/*
 Copyright (c) 2015, Kotaro Endo.
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 
 1. Redistributions of source code must retain the above copyright
	notice, this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above
	copyright notice, this list of conditions and the following
	disclaimer in the documentation and/or other materials provided
	with the distribution.
 
 3. Neither the name of the copyright holder nor the names of its
	contributors may be used to endorse or promote products derived
	from this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

// constructor
function RegExpCompilerContext(params) {
	this.params = params;
	this.texts = [];
	this.literals = [];
	this.entries = 3;
}

RegExpCompilerContext.prototype.compileMatcher = function(match, c) {
	assert(match.compile, match.toString()); // check if all matchers have own compilers
	if (match.compile) {
		match.compile(this, c);
		return;
	}
	// compiler doesn't exit (under development)
	this.text("var self=arguments.callee;");
	this.text("var d=function(x){");
	this.text("return self(literals,stack," + c + ",x,lastContinuation);}");
	this.text("x=" + this.literal(match) + "(x,d);");
	this.text("x=unpending(x);");
	this.text("break Lsw;");
};

RegExpCompilerContext.matcher = function(compile) {
	var delayed;
	function evaluate(x, c) {
		if (!delayed) {
			var ctx = new RegExpCompilerContext("stack, swidx, x, lastContinuation");
			ctx.text("x=unpending(x);");
			ctx.text("stack.push({Exit:true});");
			ctx.text("Lwh:while(true){");
			ctx.text("Lsw:switch(swidx){");
			ctx.text("case 2:");
			compile(ctx, "1");
			ctx.text("case 1:");
			ctx.text("var x=unpending(lastContinuation(x));");
			ctx.text("case 0:");
			ctx.text("break Lsw;");
			ctx.text("}");
			ctx.text("while(true){");
			ctx.text("var f=stack.pop()");
			ctx.text("if(f.Exit){return x;}");
			ctx.text("if(f.ReturnEntry){swidx=f.ReturnEntry;break;}");
			ctx.text("if(f.FailureEntry&&x===failure){swidx=f.FailureEntry;break;}");
			ctx.text("}");
			ctx.text("}");
			delayed = ctx.finish();
			//ctx.texts.length > 30 && console.log(ctx.texts.join('\n'));
		}
		return delayed([], 2, x, c);
	}
	evaluate.compile = compile;
	return evaluate;
};

RegExpCompilerContext.prototype.compileTester = function(tester) {
	assert(tester.compile, tester.toString()); // check if all testers have own compilers
	if (tester.compile) {
		tester.compile(this);
		return;
	}
	// compiler doesn't exit (under development)
	this.text("var r = " + this.literal(tester) + "(x);");
};

RegExpCompilerContext.tester = function(compile) {
	var delayed;
	function evaluate(x) {
		if (!delayed) {
			var ctx = new RegExpCompilerContext("x");
			compile(ctx);
			ctx.text("return r;");
			delayed = ctx.finish();
		}
		return delayed(x);
	}
	evaluate.compile = compile;
	return evaluate;
};

RegExpCompilerContext.prototype.compileCharSet = function(charset) {
	assert(charset.compile, charset.toString()); // check if all charsets have own compilers
	if (charset.compile) {
		charset.compile(this);
		return;
	}
	// compiler doesn't exit (under development)
	this.text("var r = " + this.literal(charset) + "(cc);");
};

RegExpCompilerContext.charset = function(compile) {
	var delayed;
	function evaluate(cc) {
		if (!delayed) {
			var ctx = new RegExpCompilerContext("cc");
			compile(ctx);
			ctx.text("return r;");
			delayed = ctx.finish();
		}
		return delayed(cc);
	}
	evaluate.compile = compile;
	return evaluate;
};

RegExpCompilerContext.prototype.text = function(text) {
	this.texts.push(text);
};

RegExpCompilerContext.prototype.literal = function(value) {
	var n = this.literals.length;
	this.literals.push(value);
	return "literals[" + n + "]";
};

RegExpCompilerContext.prototype.quote = function(x) {
	switch (typeof x) {
	case "string":
		if (x.length > 100) return this.literal(x);
		for (var i = 0; i < x.length; i++) {
			var c = x.charCodeAt(i);
			if (c < 0x20 || 0x7e < c || c === 0x22 || c === 0x5c) return this.literal(x);
		}
		return '"' + x + '"';
	case "number":
		if (floor(x) === x && abs(x) < 1000000000) {
			if (x >= 0) return String(x);
			else return "(" + String(x) + ")";
		}
		return this.literal(x);
	case "boolean":
		return String(x);
	}
	assert(x === null);
	return "null";
};

RegExpCompilerContext.prototype.finish = function() {
	var code = this.texts.join('\n');
	try {
		if (this.literals.length === 0) {
			return new Function(this.params, code);
		}
		return new Function("literals", this.params, code).bind(undefined, this.literals);
	} catch (e) {
		console.error("COMPILE ERROR:\n" + code);
		console.error(e);
		process.reallyExit(1);
	}
};

RegExpCompilerContext.prototype.loop = function() {
	var entry = this.entries++;
	this.text("case " + entry + ": ");
	return entry;
};

RegExpCompilerContext.prototype.newEntry = function() {
	var entry = this.entries++;
	if (arguments.length > 0) {
		var args = Array.prototype.slice.call(arguments).join(",");
		this.text("stack.push({entry:" + entry + ",args:[" + args + "]});");
	}
	return entry;
};

RegExpCompilerContext.prototype.entry = function(entry) {
	this.text("case " + entry + ": ");
	if (arguments.length > 1) {
		this.text("var i=stack.length;");
		this.text("while(stack[--i].entry !== " + entry + ");");
		for (var j = 1; j < arguments.length; j++) {
			this.text("var " + arguments[j] + "=stack[i].args[" + (j - 1) + "];");
		}
	}
};

RegExpCompilerContext.prototype.jump = function(entry) {
	this.text("swidx=" + entry + ";continue Lwh;");
};

RegExpCompilerContext.prototype.failure_if = function(condition) {
	this.text("if(" + condition + "){x=failure;break Lsw;}");
};

RegExpCompilerContext.prototype.jump_if = function(condition, entry) {
	this.text("if(" + condition + "){swidx=" + entry + ";continue Lwh;}");
};

RegExpCompilerContext.prototype.setFailureHandler = function(entry) {
	this.text("stack.push({FailureEntry:" + entry + "});");
};

RegExpCompilerContext.prototype.setReturnHandler = function(entry) {
	this.text("stack.push({ReturnEntry:" + entry + "});");
};

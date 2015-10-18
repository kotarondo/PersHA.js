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
	this.texts = [ "'use strict';" ];
	this.literals = [];
	this.variables = 0;
	this.labels = 0;
}

RegExpCompilerContext.prototype.compileMatcher = function(r, match, x, c) {
	//assert(match.compile, match.toString()); // check if all matchers have own compilers
	if (match.compile) {
		return match.compile(this, r, x, c);
	}
	// compiler doesn't exit (under development)
	return this.merge(r, "unpending(" + this.literal(match) + "(" + x.name + "," + this.literal(c) + "))");
};

RegExpCompilerContext.matcher = function(evaluate, compile) {
	evaluate.compile = compile;
	return evaluate;
};

RegExpCompilerContext.prototype.compileContinuation = function(r, c, x) {
	//assert(c.compile, c.toString()); // check if all continuations have own compilers
	if (c.compile) {
		return c.compile(this, r, x);
	}
	// compiler doesn't exit (under development)
	return this.merge(r, "unpending(" + this.literal(c) + "(" + x.name + "))");
};

RegExpCompilerContext.continuation = function(compile) {
	var delayed;
	function evaluate(x) {
		if (!delayed) {
			var ctx = new RegExpCompilerContext("x");
			var r = ctx.define();
			compile(ctx, r, ctx.constant("x"));
			ctx.compileReturn(r);
			delayed = ctx.finish();
		}
		return delayed(x);
	}
	evaluate.compile = compile;
	return evaluate;
};

RegExpCompilerContext.prototype.compileCharSet = function(charset, cc) {
	//assert(charset.compile, charset.toString()); // check if all charsets have own compilers
	if (charset.compile) {
		return charset.compile(this, cc);
	}
	// compiler doesn't exit (under development)
	var name = this.literal(charset);
	return this.define(name + "(" + cc.name + ")");
};

RegExpCompilerContext.charset = function(compile) {
	var delayed;
	function evaluate(cc) {
		if (!delayed) {
			var ctx = new RegExpCompilerContext("cc");
			var v = compile(ctx, ctx.constant("cc"));
			ctx.compileReturn(v);
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

RegExpCompilerContext.prototype.constant = function(str) {
	return {
		name : str,
		isConstant : true,
	};
};

RegExpCompilerContext.prototype.define = function(str) {
	var name = "tmp" + (this.variables++);
	if (str) this.text("var " + name + "= " + str + ";");
	return {
		name : name,
		isVariable : true,
	};
};

RegExpCompilerContext.prototype.unify = function(val) {
	if (val.isVariable || val.isLiteral || val.isSpecial) return val;
	return this.define(val.name);
};

RegExpCompilerContext.prototype.toMergeable = function(val) {
	if (val.isVariable) return val;
	return this.define(val.name);
};

RegExpCompilerContext.prototype.merge = function(mval, str) {
	assert(mval.isVariable, mval);
	this.text("var " + mval.name + "= " + str + ";");
	return mval;
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

RegExpCompilerContext.prototype.compileReturn = function(val) {
	this.text("return " + val.name + ";");
}

RegExpCompilerContext.prototype.openBlock = function() {
	var label = "L" + (this.labels++);
	this.text(label + ":{");
	return label;
};

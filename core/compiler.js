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
function CompilerTypes() {
	var A = [];
	for (var i = 0; i < arguments.length; i++) {
		var a = arguments[i];
		if (a instanceof CompilerTypes) a = a.types;
		A[i] = a;
	}
	this.types = Array.prototype.concat.apply([], A);
}

var COMPILER_NONE_TYPE = new CompilerTypes();
var COMPILER_UNDEFINED_TYPE = new CompilerTypes("undefined");
var COMPILER_NULL_TYPE = new CompilerTypes("null");
var COMPILER_BOOLEAN_TYPE = new CompilerTypes("boolean", "true", "false");
var COMPILER_NUMBER_TYPE = new CompilerTypes("number");
var COMPILER_STRING_TYPE = new CompilerTypes("string");
var COMPILER_PRIMITIVE_TYPE = new CompilerTypes("undefined", "null", COMPILER_BOOLEAN_TYPE, "number", "string");
var COMPILER_OBJECT_TYPE = new CompilerTypes("object");
var COMPILER_VALUE_TYPE = new CompilerTypes(COMPILER_PRIMITIVE_TYPE, COMPILER_OBJECT_TYPE);
var COMPILER_IDENTIFIER_REFERENCE_TYPE = new CompilerTypes("iref");
var COMPILER_PROPERTY_REFERENCE_TYPE = new CompilerTypes("pref");
var COMPILER_ANY_TYPE = new CompilerTypes(COMPILER_VALUE_TYPE, "iref", "pref", "list", "envRec");

var COMPILER_UNDEFINED_VALUE = {
	name : "undefined",
	types : COMPILER_UNDEFINED_TYPE,
	isLiteral : true,
	value : undefined
};

var COMPILER_TRUE_VALUE = {
	name : "true",
	types : COMPILER_BOOLEAN_TYPE,
	isLiteral : true,
	value : true
};

var COMPILER_FALSE_VALUE = {
	name : "false",
	types : COMPILER_BOOLEAN_TYPE,
	isLiteral : true,
	value : false
};

CompilerTypes.prototype.isPrimitive = function() {
	return this.types.every(function(type) {
		return (COMPILER_PRIMITIVE_TYPE.types.indexOf(type) >= 0);
	});
};

CompilerTypes.prototype.isValue = function() {
	return this.types.every(function(type) {
		if (COMPILER_VALUE_TYPE.types.indexOf(type) >= 0) return true;
	});
};

CompilerTypes.prototype.isObject = function() {
	return this.types.every(function(type) {
		if (COMPILER_OBJECT_TYPE.types.indexOf(type) >= 0) return true;
	});
};

CompilerTypes.prototype.isNotObject = function() {
	return this.types.every(function(type) {
		if (COMPILER_OBJECT_TYPE.types.indexOf(type) < 0) return true;
	});
};

CompilerTypes.prototype.isString = function() {
	return this.types.every(function(type) {
		return (COMPILER_STRING_TYPE.types.indexOf(type) >= 0);
	});
};

CompilerTypes.prototype.isNotString = function() {
	return this.types.every(function(type) {
		return (COMPILER_STRING_TYPE.types.indexOf(type) < 0);
	});
};

CompilerTypes.prototype.isNumber = function() {
	return this.types.every(function(type) {
		if (COMPILER_NUMBER_TYPE.types.indexOf(type) >= 0) return true;
	});
};

CompilerTypes.prototype.isBoolean = function() {
	return this.types.every(function(type) {
		return (COMPILER_BOOLEAN_TYPE.types.indexOf(type) >= 0);
	});
};

CompilerTypes.prototype.isNotNull = function() {
	return this.types.every(function(type) {
		return type !== "null";
	});
};

CompilerTypes.prototype.isNotUndefined = function() {
	return this.types.every(function(type) {
		return type !== "undefined";
	});
};

// constructor
function CompilerContext() {
	this.texts = [ "'use strict';" ];
	this.literals = [];
	this.variables = 0;
	this.iterables = 0;
	this.switches = 0;
}

CompilerContext.prototype.compileExpression = function(expr) {
	assert(expr.compile, expr.toString()); // check if all expressions have own compilers
	if (expr.compile) {
		return expr.compile(this);
	}
	// compiler doesn't exit (under development)
	var name = this.literal(expr);
	return this.defineAny(name + "()");
};

CompilerContext.prototype.compileStatement = function(stmt) {
	//assert(stmt.compile, stmt.toString()); // check if all statements have own compilers
	if (stmt.compile) {
		stmt.compile(this);
		return;
	}
	// compiler doesn't exit (under development)
	var name = this.literal(stmt);
	this.text("var stmt= " + name + "();");
	this.text("if(stmt.type==='return')return stmt.value;");
	this.text("if(stmt.type==='throw')throw stmt.value;");
	this.text("assertEquals(stmt.target,empty,stmt);");
	if (this.iterables) {
		this.text("if(stmt.type==='continue')continue;");
	}
	if (this.iterables || this.switches) {
		this.text("if(stmt.type==='break')break;");
	}
	this.text("assertEquals(stmt.type,'normal',stmt);");
};

CompilerContext.expression = function(compile) {
	var cached;
	function evaluate() {
		if (!cached) {
			var ctx = new CompilerContext();
			var v = compile(ctx);
			ctx.compileReturn(v);
			cached = ctx.finish();
		}
		return cached();
	}
	evaluate.compile = compile;
	return evaluate;
};

CompilerContext.reference = function(compile) {
	var cached;
	function evaluate() {
		if (!cached) {
			var ctx = new CompilerContext();
			var ref = compile(ctx);
			ctx.text("return ReferenceValue(" + ref.base.name + "," + ref.name + "," + ref.strict + ");");
			cached = ctx.finish();
		}
		return cached();
	}
	evaluate.compile = compile;
	return evaluate;
};

CompilerContext.statement = function(evaluate, compile) {
	evaluate.compile = compile;
	return evaluate;
};

CompilerContext.prototype.text = function(text) {
	this.texts.push(text);
};

CompilerContext.prototype.literal = function(value) {
	var n = this.literals.length;
	this.literals.push(value);
	return "literals[" + n + "]";
};

CompilerContext.prototype.quote = function(x) {
	switch (typeof x) {
	case "string":
		if (x.length > 100) return this.literal(x);
		for (var i = 0; i < x.length; i++) {
			var c = x.charCodeAt(i);
			if (c < 0x20 || 0x7e < c || c === 0x22 || c === 0x5c) return this.literal(x);
		}
		return '"' + x + '"';
	case "number":
		if (floor(x) === x && abs(x) < 1000000000) return String(x);
		return this.literal(x);
	case "boolean":
		return String(x);
	}
	assert(x === null);
	return "null";
};

CompilerContext.prototype.define = function(str, types) {
	assert(types);
	var name = "tmp" + (this.variables++);
	if (str) this.text("var " + name + "= " + str + ";");
	else this.text("var " + name + ";");
	return {
		name : name,
		types : types
	};
};

CompilerContext.prototype.defineValue = function(str) {
	return this.define(str, COMPILER_VALUE_TYPE);
};

CompilerContext.prototype.defineAny = function(str) {
	return this.define(str, COMPILER_ANY_TYPE);
};

CompilerContext.prototype.defineObject = function(str) {
	return this.define(str, COMPILER_OBJECT_TYPE);
};

CompilerContext.prototype.defineString = function(str) {
	return this.define(str, COMPILER_STRING_TYPE);
};

CompilerContext.prototype.defineNumber = function(str) {
	return this.define(str, COMPILER_NUMBER_TYPE);
};

CompilerContext.prototype.defineBoolean = function(str) {
	return this.define(str, COMPILER_BOOLEAN_TYPE);
};

CompilerContext.prototype.definePrimitive = function(str) {
	return this.define(str, COMPILER_PRIMITIVE_TYPE);
};

CompilerContext.prototype.defineNone = function(str) {
	return this.define(str, COMPILER_NONE_TYPE);
};

CompilerContext.prototype.mergeDefine = function(mval, str, types) {
	this.text("var " + mval.name + "= " + str + ";");
	mval.types = new CompilerTypes(mval.types, types);
};

CompilerContext.prototype.mergeDefineString = function(mval, str) {
	this.mergeDefine(mval, str, COMPILER_STRING_TYPE);
};

CompilerContext.prototype.mergeDefineValue = function(mval, str) {
	this.mergeDefine(mval, str, COMPILER_VALUE_TYPE);
};

CompilerContext.prototype.merge = function(mval, rval) {
	this.mergeDefine(mval, rval.name, rval.types);
};

CompilerContext.prototype.finish = function() {
	var code = this.texts.join('\n');
	try {
		if (this.literals.length === 0) {
			return new Function(code);
		}
		return new Function("literals", code).bind(undefined, this.literals);
	} catch (e) {
		console.error("COMPILE ERROR:\n" + code);
		throw e;
	}
};

CompilerContext.prototype.compileReturn = function(val) {
	this.text("return " + val.name + ";");
}

CompilerContext.prototype.compileGetValue = function(ref) {
	if (ref.types.isValue()) return ref;
	if (ref.types === COMPILER_PROPERTY_REFERENCE_TYPE) {
		var base = ref.base;
		if (base.types.isObject()) {
			return this.defineValue(base.name + " .Get(" + ref.name + ")");
		}
		if (base.types.isNotObject()) {
			return this.defineValue("specialGet(" + base.name + "," + ref.name + ")");
		}
		this.text("if(Type(" + base.name + ")===TYPE_Object)");
		var mval = this.defineValue(base.name + " .Get(" + ref.name + ")");
		this.text("else");
		this.mergeDefineValue(mval, "specialGet(" + base.name + "," + ref.name + ")");
		return mval;
	}
	else if (ref.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
		var base = ref.base;
		this.text("if(" + base.name + " ===undefined)throw VMReferenceError(" + ref.name + " +' is not defined');");
		return this.defineValue(base.name + " .GetBindingValue(" + ref.name + "," + ref.strict + ")");
	}
	else {
		return this.defineValue("GetValue(" + ref.name + ")");
	}
};

CompilerContext.prototype.compilePutValue = function(ref, val) {
	if (ref.types === COMPILER_PROPERTY_REFERENCE_TYPE) {
		var base = ref.base;
		if (base.types.isObject()) {
			this.text(base.name + " .Put(" + ref.name + "," + val.name + "," + ref.strict + ");");
			return;
		}
		if (base.types.isNotObject()) {
			this.text("specialPut(" + base.name + "," + ref.name + "," + val.name + "," + ref.strict + ");");
			return;
		}
		this.text("if(Type(" + base.name + ")===TYPE_Object)");
		this.text(base.name + " .Put(" + ref.name + "," + val.name + "," + ref.strict + ");");
		this.text("else");
		this.text("specialPut(" + base.name + "," + ref.name + "," + val.name + "," + ref.strict + ");");
	}
	else if (ref.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
		var base = ref.base;
		this.text("if(" + base.name + " ===undefined)");
		if (ref.strict) this.text("throw VMReferenceError(" + ref.name + " +' is not defined');");
		else this.text("vm.theGlobalObject.Put(" + ref.name + "," + val.name + ",false);");
		this.text("else");
		this.text(base.name + " .SetMutableBinding(" + ref.name + "," + val.name + "," + ref.strict + ");");
	}
	else {
		this.text("PutValue(" + ref.name + "," + val.name + ");");
	}
};

CompilerContext.prototype.compileToNumber = function(val) {
	if (val.types.isNumber()) return val;
	if (val.types.isPrimitive()) return this.defineNumber("Number(" + val.name + ")");
	return this.defineNumber("ToNumber(" + val.name + ")");
};

CompilerContext.prototype.compileToString = function(val) {
	if (val.types.isString()) return val;
	if (val.types.isPrimitive()) return this.defineString("String(" + val.name + ")");
	return this.defineString("ToString(" + val.name + ")");
};

CompilerContext.prototype.compileToObject = function(val) {
	if (val.types.isObject()) return val;
	return this.defineObject("ToObject(" + val.name + ")");
};

CompilerContext.prototype.compileToPrimitive = function(val, hint) {
	if (val.types.isPrimitive()) return val;
	if (!hint) return this.definePrimitive("ToPrimitive(" + val.name + ")");
	return this.definePrimitive("ToPrimitive(" + val.name + "," + hint + ")");
};

CompilerContext.prototype.compileEvaluateArguments = function(args) {
	var argList = this.defineAny("[]");
	for (var i = 0; i < args.length; i++) {
		var ref = this.compileExpression(args[i]);
		var arg = this.compileGetValue(ref);
		this.text(argList.name + " .push(" + arg.name + ");");
	}
	return argList;
};

CompilerContext.prototype.compileRunningPos = function(pos) {
	this.text("runningSourcePos= " + pos + ";");
};

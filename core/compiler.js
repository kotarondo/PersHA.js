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
var COMPILER_NUMBER_TYPE = new CompilerTypes("number", "integer", "int32", "uint32");
var COMPILER_STRING_TYPE = new CompilerTypes("string");
var COMPILER_NUMBER_OR_STRING_TYPE = new CompilerTypes(COMPILER_NUMBER_TYPE, COMPILER_STRING_TYPE);
var COMPILER_PRIMITIVE_TYPE = new CompilerTypes(COMPILER_UNDEFINED_TYPE, COMPILER_NULL_TYPE, COMPILER_BOOLEAN_TYPE,
		COMPILER_NUMBER_TYPE, COMPILER_STRING_TYPE);
var COMPILER_OBJECT_TYPE = new CompilerTypes("object");
var COMPILER_VALUE_TYPE = new CompilerTypes(COMPILER_PRIMITIVE_TYPE, COMPILER_OBJECT_TYPE);
var COMPILER_IDENTIFIER_REFERENCE_TYPE = new CompilerTypes("iref");
var COMPILER_PROPERTY_REFERENCE_TYPE = new CompilerTypes("pref");
var COMPILER_LIST_TYPE = new CompilerTypes("list");
var COMPILER_ANY_TYPE = new CompilerTypes(COMPILER_VALUE_TYPE, COMPILER_IDENTIFIER_REFERENCE_TYPE,
		COMPILER_IDENTIFIER_REFERENCE_TYPE, COMPILER_LIST_TYPE);

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

// constructor
function CompilerContext() {
	this.texts = [ "'use strict';" ];
	this.literals = [];
	this.variables = 0;
}

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
		types : types,
	};
};

CompilerContext.prototype.mergeHolder = function() {
	return this.define("", COMPILER_NONE_TYPE);
};

CompilerContext.prototype.merge = function(mval, rval) {
	this.text("var " + mval.name + "= " + rval.name + ";");
	mval.types = new CompilerTypes(mval.types, rval.types);
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

CompilerContext.prototype.compileExpression = function(expr) {
	assert(expr.compile, expr.toString()); // check if all expressions have own compilers
	if (expr.compile) {
		return expr.compile(this);
	}
	// compiler doesn't exit (under development)
	var name = this.literal(expr);
	var v = this.define(name + "()", COMPILER_ANY_TYPE);
	return v;
};

CompilerContext.prototype.compileGetValue = function(ref) {
	if (ref.types.isValue()) return ref;
	if (ref.types === COMPILER_PROPERTY_REFERENCE_TYPE) {
		var base = ref.base;
		if (base.types.isObject()) {
			return this.define(base.name + ".Get(" + ref.name + ")", COMPILER_VALUE_TYPE);
		}
		if (base.types.isNotObject()) {
			return this.define("specialGet(" + base.name + "," + ref.name + ")", COMPILER_VALUE_TYPE);
		}
		var mval = this.mergeHolder();
		this.text("if (Type(" + base.name + ") === " + TYPE_Object + ") {");
		var val = this.define(base.name + ".Get(" + ref.name + ")", COMPILER_VALUE_TYPE);
		this.merge(mval, val);
		this.text("} else {");
		var val = this.define("specialGet(" + base.name + "," + ref.name + ")", COMPILER_VALUE_TYPE);
		this.merge(mval, val);
		this.text("}");
		return mval;
	}
	else if (ref.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
		var base = ref.base;
		this.text("if(" + base.name + "===undefined)");
		this.text("throw VMReferenceError(" + ref.name + "+' is not defined');");
		return this.define(base.name + ".GetBindingValue(" + ref.name + "," + ref.strict + ")", COMPILER_VALUE_TYPE);
	}
	else {
		return this.define("GetValue(" + ref.name + ")", COMPILER_VALUE_TYPE);
	}
};

CompilerContext.prototype.compilePutValue = function(ref, val) {
	if (ref.types === COMPILER_PROPERTY_REFERENCE_TYPE) {
		var base = ref.base;
		if (base.types.isObject()) {
			this.text(base.name + ".Put(" + ref.name + "," + val.name + "," + ref.strict + ");");
			return;
		}
		if (base.types.isNotObject()) {
			this.text("specialPut(" + base.name + "," + ref.name + "," + val.name + "," + ref.strict + ");");
			return;
		}
		this.text("if (Type(" + base.name + ") === " + TYPE_Object + ") {");
		this.text(base.name + ".Put(" + ref.name + "," + val.name + "," + ref.strict + ");");
		this.text("} else {");
		this.text("specialPut(" + base.name + "," + ref.name + "," + val.name + "," + ref.strict + ");");
		this.text("}");
	}
	else if (ref.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
		var base = ref.base;
		this.text("if(" + base.name + "===undefined)");
		if (ref.strict) this.text("throw VMReferenceError(" + ref.name + "+' is not defined');");
		else this.text("vm.theGlobalObject.Put(" + ref.name + "," + val.name + ", false);");
		this.text("else");
		this.text(base.name + ".SetMutableBinding(" + ref.name + "," + val.name + "," + ref.strict + ");");
	}
	else {
		this.text("PutValue(" + ref.name + "," + val.name + ");");
	}
};

CompilerContext.prototype.compileToNumber = function(val) {
	if (val.types.isNumber()) return val;
	if (val.types.isPrimitive()) return this.define("Number(" + val.name + ")", COMPILER_NUMBER_TYPE);
	return this.define("ToNumber(" + val.name + ")", COMPILER_NUMBER_TYPE);
};

CompilerContext.prototype.compileToString = function(val) {
	if (val.types.isString()) return val;
	if (val.types.isPrimitive()) return this.define("String(" + val.name + ")", COMPILER_STRING_TYPE);
	return this.define("ToString(" + val.name + ")", COMPILER_STRING_TYPE);
};

CompilerContext.prototype.compileToBoolean = function(val) {
	if (val.types.isBoolean()) return val;
	if (val.types.isPrimitive()) return this.define("!! " + val.name, COMPILER_BOOLEAN_TYPE);
	return this.define("ToBoolean(" + val.name + ")", COMPILER_BOOLEAN_TYPE);
};

CompilerContext.prototype.compileToPrimitive = function(val, hint) {
	if (val.types.isPrimitive()) return val;
	if (!hint) return this.define("ToPrimitive(" + val.name + ")", COMPILER_PRIMITIVE_TYPE);
	return this.define("ToPrimitive(" + val.name + "," + hint + ")", COMPILER_PRIMITIVE_TYPE);
};

CompilerContext.prototype.compileToInt32 = function(val) {
	if (val.types.isPrimitive()) return this.define(val.name + " >> 0", COMPILER_NUMBER_TYPE);
	return this.define("ToInt32(" + val.name + ")", COMPILER_NUMBER_TYPE);
};

CompilerContext.prototype.compileToUint32 = function(val) {
	if (val.types.isPrimitive()) return this.define(val.name + " >>> 0", COMPILER_NUMBER_TYPE);
	return this.define("ToUint32(" + val.name + ")", COMPILER_NUMBER_TYPE);
};

CompilerContext.prototype.compileEvaluateArguments = function(args) {
	var argList = this.define("[]", COMPILER_LIST_TYPE);
	for (var i = 0; i < args.length; i++) {
		var ref = this.compileExpression(args[i]);
		var arg = this.compileGetValue(ref);
		this.text(argList.name + ".push(" + arg.name + ");");
	}
	return argList;
}

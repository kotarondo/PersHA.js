// This is an generated file.
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

// ECMAScript 5.1: 15 Standard Built-in ECMAScript Objects

var STRICT_CONFORMANCE = false;

function define(obj, name, value) {
	intrinsic_createData(obj, name, PropertyDescriptor({
		Value : value,
		Writable : true,
		Enumerable : false,
		Configurable : true
	}));
}

function defineFinal(obj, name, value) {
	intrinsic_createData(obj, name, PropertyDescriptor({
		Value : value,
		Writable : false,
		Enumerable : false,
		Configurable : false
	}));
}

function defineFree(obj, name, value) {
	intrinsic_createData(obj, name, PropertyDescriptor({
		Value : value,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}));
}

function defineWritable(obj, name, value) {
	intrinsic_createData(obj, name, PropertyDescriptor({
		Value : value,
		Writable : true,
		Enumerable : false,
		Configurable : false
	}));
}

function defineFunction(obj, name, length, func) {
	var F = VMObject(CLASSID_BuiltinFunction);
	F.Prototype = builtin_Function_prototype;
	F.Extensible = true;
	F.Call = func;
	defineFinal(F, "length", length);
	define(obj, name, F);
	return F;
}

function defineAccessor(obj, name, get, set) {
	if (get !== undefined) {
		var Get = VMObject(CLASSID_BuiltinFunction);
		Get.Prototype = builtin_Function_prototype;
		Get.Extensible = true;
		Get.Call = get;
		defineFinal(Get, "length", 0);
	}
	if (set !== undefined) {
		var Set = VMObject(CLASSID_BuiltinFunction);
		Set.Prototype = builtin_Function_prototype;
		Set.Extensible = true;
		Set.Call = set;
		defineFinal(Set, "length", 1);
	}
	intrinsic_createAccessor(obj, name, PropertyDescriptor({
		Get : Get,
		Set : Set,
		Enumerable : false,
		Configurable : true
	}));
}

var builtin_Object_prototype;
var builtin_Function_prototype;
var builtin_Array_prototype;
var builtin_String_prototype;
var builtin_Boolean_prototype;
var builtin_Number_prototype;
var builtin_Date_prototype;
var builtin_RegExp_prototype;
var builtin_Error_prototype;
var builtin_EvalError_prototype;
var builtin_RangeError_prototype;
var builtin_ReferenceError_prototype;
var builtin_SyntaxError_prototype;
var builtin_TypeError_prototype;
var builtin_URIError_prototype;

var theGlobalObject;
var theGlobalEnvironment;
var theEvalFunction;

function ReturnUndefined() {
	return undefined;
};

function initializeVM() {
	builtin_Object_prototype = VMObject(CLASSID_Object);
	builtin_Object_prototype.Prototype = null;
	builtin_Object_prototype.Extensible = true;

	builtin_Function_prototype = VMObject(CLASSID_BuiltinFunction);
	builtin_Function_prototype.Prototype = builtin_Object_prototype;
	builtin_Function_prototype.Extensible = true;
	builtin_Function_prototype.Call = ReturnUndefined;

	builtin_Array_prototype = VMObject(CLASSID_Array);
	builtin_Array_prototype.Prototype = builtin_Object_prototype;
	builtin_Array_prototype.Extensible = true;

	builtin_String_prototype = VMObject(CLASSID_String);
	builtin_String_prototype.Prototype = builtin_Object_prototype;
	builtin_String_prototype.Extensible = true;
	builtin_String_prototype.PrimitiveValue = "";

	builtin_Boolean_prototype = VMObject(CLASSID_Boolean);
	builtin_Boolean_prototype.Prototype = builtin_Object_prototype;
	builtin_Boolean_prototype.Extensible = true;
	builtin_Boolean_prototype.PrimitiveValue = false;

	builtin_Number_prototype = VMObject(CLASSID_Number);
	builtin_Number_prototype.Prototype = builtin_Object_prototype;
	builtin_Number_prototype.Extensible = true;
	builtin_Number_prototype.PrimitiveValue = 0;

	builtin_Date_prototype = VMObject(CLASSID_Date);
	builtin_Date_prototype.Prototype = builtin_Object_prototype;
	builtin_Date_prototype.Extensible = true;
	builtin_Date_prototype.PrimitiveValue = NaN;

	builtin_RegExp_prototype = VMObject(CLASSID_RegExp);
	builtin_RegExp_prototype.Prototype = builtin_Object_prototype;
	builtin_RegExp_prototype.Extensible = true;

	builtin_Error_prototype = VMObject(CLASSID_Error);
	builtin_Error_prototype.Prototype = builtin_Object_prototype;
	builtin_Error_prototype.Extensible = true;

	builtin_EvalError_prototype = VMObject(CLASSID_Error);
	builtin_EvalError_prototype.Prototype = builtin_Error_prototype;
	builtin_EvalError_prototype.Extensible = true;

	builtin_RangeError_prototype = VMObject(CLASSID_Error);
	builtin_RangeError_prototype.Prototype = builtin_Error_prototype;
	builtin_RangeError_prototype.Extensible = true;

	builtin_ReferenceError_prototype = VMObject(CLASSID_Error);
	builtin_ReferenceError_prototype.Prototype = builtin_Error_prototype;
	builtin_ReferenceError_prototype.Extensible = true;

	builtin_SyntaxError_prototype = VMObject(CLASSID_Error);
	builtin_SyntaxError_prototype.Prototype = builtin_Error_prototype;
	builtin_SyntaxError_prototype.Extensible = true;

	builtin_TypeError_prototype = VMObject(CLASSID_Error);
	builtin_TypeError_prototype.Prototype = builtin_Error_prototype;
	builtin_TypeError_prototype.Extensible = true;

	builtin_URIError_prototype = VMObject(CLASSID_Error);
	builtin_URIError_prototype.Prototype = builtin_Error_prototype;
	builtin_URIError_prototype.Extensible = true;

	theGlobalObject = VMObject(CLASSID_Global);
	theGlobalObject.Prototype = builtin_Object_prototype;
	theGlobalObject.Extensible = true;
	theGlobalEnvironment = NewObjectEnvironment(theGlobalObject, null);

	var builtin_Object = VMObject(CLASSID_BuiltinFunction);
	builtin_Object.Call = Object_Call;
	builtin_Object.Construct = Object_Construct;
	builtin_Object.Prototype = builtin_Function_prototype;
	builtin_Object.Extensible = true;

	var builtin_Function = VMObject(CLASSID_BuiltinFunction);
	builtin_Function.Call = Function_Call;
	builtin_Function.Construct = Function_Construct;
	builtin_Function.Prototype = builtin_Function_prototype;
	builtin_Function.Extensible = true;

	var builtin_Array = VMObject(CLASSID_BuiltinFunction);
	builtin_Array.Call = Array_Call;
	builtin_Array.Construct = Array_Construct;
	builtin_Array.Prototype = builtin_Function_prototype;
	builtin_Array.Extensible = true;

	var builtin_String = VMObject(CLASSID_BuiltinFunction);
	builtin_String.Call = String_Call;
	builtin_String.Construct = String_Construct;
	builtin_String.Prototype = builtin_Function_prototype;
	builtin_String.Extensible = true;

	var builtin_Boolean = VMObject(CLASSID_BuiltinFunction);
	builtin_Boolean.Call = Boolean_Call;
	builtin_Boolean.Construct = Boolean_Construct;
	builtin_Boolean.Prototype = builtin_Function_prototype;
	builtin_Boolean.Extensible = true;

	var builtin_Number = VMObject(CLASSID_BuiltinFunction);
	builtin_Number.Call = Number_Call;
	builtin_Number.Construct = Number_Construct;
	builtin_Number.Prototype = builtin_Function_prototype;
	builtin_Number.Extensible = true;

	var builtin_Math = VMObject(CLASSID_Math);
	builtin_Math.Prototype = builtin_Object_prototype;
	builtin_Math.Extensible = true;

	var builtin_Date = VMObject(CLASSID_BuiltinFunction);
	builtin_Date.Call = Date_Call;
	builtin_Date.Construct = Date_Construct;
	builtin_Date.Prototype = builtin_Function_prototype;
	builtin_Date.Extensible = true;

	var builtin_RegExp = VMObject(CLASSID_BuiltinFunction);
	builtin_RegExp.Call = RegExp_Call;
	builtin_RegExp.Construct = RegExp_Construct;
	builtin_RegExp.Prototype = builtin_Function_prototype;
	builtin_RegExp.Extensible = true;

	var builtin_Error = VMObject(CLASSID_BuiltinFunction);
	builtin_Error.Call = Error_Call;
	builtin_Error.Construct = Error_Construct;
	builtin_Error.Prototype = builtin_Function_prototype;
	builtin_Error.Extensible = true;

	var builtin_EvalError = VMObject(CLASSID_BuiltinFunction);
	builtin_EvalError.Call = EvalError_Call;
	builtin_EvalError.Construct = EvalError_Construct;
	builtin_EvalError.Prototype = builtin_Function_prototype;
	builtin_EvalError.Extensible = true;

	var builtin_RangeError = VMObject(CLASSID_BuiltinFunction);
	builtin_RangeError.Call = RangeError_Call;
	builtin_RangeError.Construct = RangeError_Construct;
	builtin_RangeError.Prototype = builtin_Function_prototype;
	builtin_RangeError.Extensible = true;

	var builtin_ReferenceError = VMObject(CLASSID_BuiltinFunction);
	builtin_ReferenceError.Call = ReferenceError_Call;
	builtin_ReferenceError.Construct = ReferenceError_Construct;
	builtin_ReferenceError.Prototype = builtin_Function_prototype;
	builtin_ReferenceError.Extensible = true;

	var builtin_SyntaxError = VMObject(CLASSID_BuiltinFunction);
	builtin_SyntaxError.Call = SyntaxError_Call;
	builtin_SyntaxError.Construct = SyntaxError_Construct;
	builtin_SyntaxError.Prototype = builtin_Function_prototype;
	builtin_SyntaxError.Extensible = true;

	var builtin_TypeError = VMObject(CLASSID_BuiltinFunction);
	builtin_TypeError.Call = TypeError_Call;
	builtin_TypeError.Construct = TypeError_Construct;
	builtin_TypeError.Prototype = builtin_Function_prototype;
	builtin_TypeError.Extensible = true;

	var builtin_URIError = VMObject(CLASSID_BuiltinFunction);
	builtin_URIError.Call = URIError_Call;
	builtin_URIError.Construct = URIError_Construct;
	builtin_URIError.Prototype = builtin_Function_prototype;
	builtin_URIError.Extensible = true;

	var builtin_JSON = VMObject(CLASSID_JSON);
	builtin_JSON.Prototype = builtin_Object_prototype;
	builtin_JSON.Extensible = true;

	defineFinal(theGlobalObject, "NaN", NaN);
	defineFinal(theGlobalObject, "Infinity", Infinity);
	defineFinal(theGlobalObject, "undefined", undefined);
	theEvalFunction = //
	defineFunction(theGlobalObject, "eval", 1, Global_eval);
	defineFunction(theGlobalObject, "parseInt", 2, Global_parseInt);
	defineFunction(theGlobalObject, "parseFloat", 1, Global_parseFloat);
	defineFunction(theGlobalObject, "isNaN", 1, Global_isNaN);
	defineFunction(theGlobalObject, "isFinite", 1, Global_isFinite);
	defineFunction(theGlobalObject, "decodeURI", 1, Global_decodeURI);
	defineFunction(theGlobalObject, "decodeURIComponent", 1, Global_decodeURIComponent);
	defineFunction(theGlobalObject, "encodeURI", 1, Global_encodeURI);
	defineFunction(theGlobalObject, "encodeURIComponent", 1, Global_encodeURIComponent);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(theGlobalObject, "escape", 1, Global_escape);
		defineFunction(theGlobalObject, "unescape", 1, Global_unescape);
		defineFunction(theGlobalObject, "evaluateProgram", 1, Global_evaluateProgram);
	}
	define(theGlobalObject, "Object", builtin_Object);
	define(theGlobalObject, "Function", builtin_Function);
	define(theGlobalObject, "Array", builtin_Array);
	define(theGlobalObject, "String", builtin_String);
	define(theGlobalObject, "Boolean", builtin_Boolean);
	define(theGlobalObject, "Number", builtin_Number);
	define(theGlobalObject, "Date", builtin_Date);
	define(theGlobalObject, "RegExp", builtin_RegExp);
	define(theGlobalObject, "Error", builtin_Error);
	define(theGlobalObject, "EvalError", builtin_EvalError);
	define(theGlobalObject, "RangeError", builtin_RangeError);
	define(theGlobalObject, "ReferenceError", builtin_ReferenceError);
	define(theGlobalObject, "SyntaxError", builtin_SyntaxError);
	define(theGlobalObject, "TypeError", builtin_TypeError);
	define(theGlobalObject, "URIError", builtin_URIError);
	define(theGlobalObject, "Math", builtin_Math);
	define(theGlobalObject, "JSON", builtin_JSON);

	defineFinal(builtin_Object, "length", 1);
	defineFinal(builtin_Object, "prototype", builtin_Object_prototype);
	defineFunction(builtin_Object, "getPrototypeOf", 1, Object_getPrototypeOf);
	defineFunction(builtin_Object, "getOwnPropertyDescriptor", 2, Object_getOwnPropertyDescriptor);
	defineFunction(builtin_Object, "getOwnPropertyNames", 1, Object_getOwnPropertyNames);
	defineFunction(builtin_Object, "create", 2, Object_create);
	defineFunction(builtin_Object, "defineProperty", 3, Object_defineProperty);
	defineFunction(builtin_Object, "defineProperties", 2, Object_defineProperties);
	defineFunction(builtin_Object, "seal", 1, Object_seal);
	defineFunction(builtin_Object, "freeze", 1, Object_freeze);
	defineFunction(builtin_Object, "preventExtensions", 1, Object_preventExtensions);
	defineFunction(builtin_Object, "isSealed", 1, Object_isSealed);
	defineFunction(builtin_Object, "isFrozen", 1, Object_isFrozen);
	defineFunction(builtin_Object, "isExtensible", 1, Object_isExtensible);
	defineFunction(builtin_Object, "keys", 1, Object_keys);
	define(builtin_Object_prototype, "constructor", builtin_Object);
	defineFunction(builtin_Object_prototype, "toString", 0, Object_prototype_toString);
	defineFunction(builtin_Object_prototype, "toLocaleString", 0, Object_prototype_toLocaleString);
	defineFunction(builtin_Object_prototype, "valueOf", 0, Object_prototype_valueOf);
	defineFunction(builtin_Object_prototype, "hasOwnProperty", 1, Object_prototype_hasOwnProperty);
	defineFunction(builtin_Object_prototype, "isPrototypeOf", 1, Object_prototype_isPrototypeOf);
	defineFunction(builtin_Object_prototype, "propertyIsEnumerable", 1, Object_prototype_propertyIsEnumerable);
	if (STRICT_CONFORMANCE === false) {
		defineAccessor(builtin_Object_prototype, "__proto__", get_Object_prototype___proto__, set_Object_prototype___proto__);
	}

	defineFinal(builtin_Function, "length", 1);
	defineFinal(builtin_Function, "prototype", builtin_Function_prototype);
	defineFinal(builtin_Function_prototype, "length", 0);
	define(builtin_Function_prototype, "constructor", builtin_Function);
	defineFunction(builtin_Function_prototype, "toString", 0, Function_prototype_toString);
	defineFunction(builtin_Function_prototype, "apply", 2, Function_prototype_apply);
	defineFunction(builtin_Function_prototype, "call", 1, Function_prototype_call);
	defineFunction(builtin_Function_prototype, "bind", 1, Function_prototype_bind);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(builtin_Function_prototype, "scheduleAsMicrotask", 1, Function_prototype_scheduleAsMicrotask);
	}

	defineFinal(builtin_Array, "length", 1);
	defineFinal(builtin_Array, "prototype", builtin_Array_prototype);
	defineFunction(builtin_Array, "isArray", 1, Array_isArray);
	defineWritable(builtin_Array_prototype, "length", 0);
	define(builtin_Array_prototype, "constructor", builtin_Array);
	defineFunction(builtin_Array_prototype, "toString", 0, Array_prototype_toString);
	defineFunction(builtin_Array_prototype, "toLocaleString", 0, Array_prototype_toLocaleString);
	defineFunction(builtin_Array_prototype, "concat", 1, Array_prototype_concat);
	defineFunction(builtin_Array_prototype, "join", 1, Array_prototype_join);
	defineFunction(builtin_Array_prototype, "pop", 0, Array_prototype_pop);
	defineFunction(builtin_Array_prototype, "push", 1, Array_prototype_push);
	defineFunction(builtin_Array_prototype, "reverse", 0, Array_prototype_reverse);
	defineFunction(builtin_Array_prototype, "shift", 0, Array_prototype_shift);
	defineFunction(builtin_Array_prototype, "slice", 2, Array_prototype_slice);
	defineFunction(builtin_Array_prototype, "sort", 1, Array_prototype_sort);
	defineFunction(builtin_Array_prototype, "splice", 2, Array_prototype_splice);
	defineFunction(builtin_Array_prototype, "unshift", 1, Array_prototype_unshift);
	defineFunction(builtin_Array_prototype, "indexOf", 1, Array_prototype_indexOf);
	defineFunction(builtin_Array_prototype, "lastIndexOf", 1, Array_prototype_lastIndexOf);
	defineFunction(builtin_Array_prototype, "every", 1, Array_prototype_every);
	defineFunction(builtin_Array_prototype, "some", 1, Array_prototype_some);
	defineFunction(builtin_Array_prototype, "forEach", 1, Array_prototype_forEach);
	defineFunction(builtin_Array_prototype, "map", 1, Array_prototype_map);
	defineFunction(builtin_Array_prototype, "filter", 1, Array_prototype_filter);
	defineFunction(builtin_Array_prototype, "reduce", 1, Array_prototype_reduce);
	defineFunction(builtin_Array_prototype, "reduceRight", 1, Array_prototype_reduceRight);

	defineFinal(builtin_String, "length", 1);
	defineFinal(builtin_String, "prototype", builtin_String_prototype);
	defineFunction(builtin_String, "fromCharCode", 1, String_fromCharCode);
	defineFinal(builtin_String_prototype, "length", 0);
	define(builtin_String_prototype, "constructor", builtin_String);
	defineFunction(builtin_String_prototype, "toString", 0, String_prototype_toString);
	defineFunction(builtin_String_prototype, "valueOf", 0, String_prototype_valueOf);
	defineFunction(builtin_String_prototype, "charAt", 1, String_prototype_charAt);
	defineFunction(builtin_String_prototype, "charCodeAt", 1, String_prototype_charCodeAt);
	defineFunction(builtin_String_prototype, "concat", 1, String_prototype_concat);
	defineFunction(builtin_String_prototype, "indexOf", 1, String_prototype_indexOf);
	defineFunction(builtin_String_prototype, "lastIndexOf", 1, String_prototype_lastIndexOf);
	defineFunction(builtin_String_prototype, "localeCompare", 1, String_prototype_localeCompare);
	defineFunction(builtin_String_prototype, "match", 1, String_prototype_match);
	defineFunction(builtin_String_prototype, "replace", 2, String_prototype_replace);
	defineFunction(builtin_String_prototype, "search", 1, String_prototype_search);
	defineFunction(builtin_String_prototype, "slice", 2, String_prototype_slice);
	defineFunction(builtin_String_prototype, "split", 2, String_prototype_split);
	defineFunction(builtin_String_prototype, "substring", 2, String_prototype_substring);
	defineFunction(builtin_String_prototype, "toLowerCase", 0, String_prototype_toLowerCase);
	defineFunction(builtin_String_prototype, "toLocaleLowerCase", 0, String_prototype_toLocaleLowerCase);
	defineFunction(builtin_String_prototype, "toUpperCase", 0, String_prototype_toUpperCase);
	defineFunction(builtin_String_prototype, "toLocaleUpperCase", 0, String_prototype_toLocaleUpperCase);
	defineFunction(builtin_String_prototype, "trim", 0, String_prototype_trim);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(builtin_String_prototype, "substr", 2, String_prototype_substr);
	}

	defineFinal(builtin_Boolean, "length", 1);
	defineFinal(builtin_Boolean, "prototype", builtin_Boolean_prototype);
	define(builtin_Boolean_prototype, "constructor", builtin_Boolean);
	defineFunction(builtin_Boolean_prototype, "toString", 0, Boolean_prototype_toString);
	defineFunction(builtin_Boolean_prototype, "valueOf", 0, Boolean_prototype_valueOf);

	defineFinal(builtin_Number, "length", 1);
	defineFinal(builtin_Number, "prototype", builtin_Number_prototype);
	defineFinal(builtin_Number, "MAX_VALUE", MAX_VALUE);
	defineFinal(builtin_Number, "MIN_VALUE", MIN_VALUE);
	defineFinal(builtin_Number, "NaN", NaN);
	defineFinal(builtin_Number, "POSITIVE_INFINITY", Infinity);
	defineFinal(builtin_Number, "NEGATIVE_INFINITY", -Infinity);
	define(builtin_Number_prototype, "constructor", builtin_Number);
	defineFunction(builtin_Number_prototype, "toString", 0, Number_prototype_toString);
	defineFunction(builtin_Number_prototype, "toLocaleString", 0, Number_prototype_toLocaleString);
	defineFunction(builtin_Number_prototype, "valueOf", 0, Number_prototype_valueOf);
	defineFunction(builtin_Number_prototype, "toFixed", 1, Number_prototype_toFixed);
	defineFunction(builtin_Number_prototype, "toExponential", 1, Number_prototype_toExponential);
	defineFunction(builtin_Number_prototype, "toPrecision", 1, Number_prototype_toPrecision);

	defineFinal(builtin_Math, "E", Math.E);
	defineFinal(builtin_Math, "LN10", Math.LN10);
	defineFinal(builtin_Math, "LN2", Math.LN2);
	defineFinal(builtin_Math, "LOG2E", Math.LOG2E);
	defineFinal(builtin_Math, "LOG10E", Math.LOG10E);
	defineFinal(builtin_Math, "PI", Math.PI);
	defineFinal(builtin_Math, "SQRT1_2", Math.SQRT1_2);
	defineFinal(builtin_Math, "SQRT2", Math.SQRT2);
	defineFunction(builtin_Math, "abs", 1, Math_abs);
	defineFunction(builtin_Math, "acos", 1, Math_acos);
	defineFunction(builtin_Math, "asin", 1, Math_asin);
	defineFunction(builtin_Math, "atan", 1, Math_atan);
	defineFunction(builtin_Math, "atan2", 2, Math_atan2);
	defineFunction(builtin_Math, "ceil", 1, Math_ceil);
	defineFunction(builtin_Math, "cos", 1, Math_cos);
	defineFunction(builtin_Math, "exp", 1, Math_exp);
	defineFunction(builtin_Math, "floor", 1, Math_floor);
	defineFunction(builtin_Math, "log", 1, Math_log);
	defineFunction(builtin_Math, "max", 2, Math_max);
	defineFunction(builtin_Math, "min", 2, Math_min);
	defineFunction(builtin_Math, "pow", 2, Math_pow);
	defineFunction(builtin_Math, "random", 0, Math_random);
	defineFunction(builtin_Math, "round", 1, Math_round);
	defineFunction(builtin_Math, "sin", 1, Math_sin);
	defineFunction(builtin_Math, "sqrt", 1, Math_sqrt);
	defineFunction(builtin_Math, "tan", 1, Math_tan);

	defineFinal(builtin_Date, "length", 7);
	defineFinal(builtin_Date, "prototype", builtin_Date_prototype);
	defineFunction(builtin_Date, "parse", 1, Date_parse);
	defineFunction(builtin_Date, "UTC", 7, Date_UTC);
	defineFunction(builtin_Date, "now", 0, Date_now);
	define(builtin_Date_prototype, "constructor", builtin_Date);
	defineFunction(builtin_Date_prototype, "toString", 0, Date_prototype_toString);
	defineFunction(builtin_Date_prototype, "toDateString", 0, Date_prototype_toDateString);
	defineFunction(builtin_Date_prototype, "toTimeString", 0, Date_prototype_toTimeString);
	defineFunction(builtin_Date_prototype, "toLocaleString", 0, Date_prototype_toLocaleString);
	defineFunction(builtin_Date_prototype, "toLocaleDateString", 0, Date_prototype_toLocaleDateString);
	defineFunction(builtin_Date_prototype, "toLocaleTimeString", 0, Date_prototype_toLocaleTimeString);
	defineFunction(builtin_Date_prototype, "valueOf", 0, Date_prototype_valueOf);
	defineFunction(builtin_Date_prototype, "getTime", 0, Date_prototype_getTime);
	defineFunction(builtin_Date_prototype, "getFullYear", 0, Date_prototype_getFullYear);
	defineFunction(builtin_Date_prototype, "getUTCFullYear", 0, Date_prototype_getUTCFullYear);
	defineFunction(builtin_Date_prototype, "getMonth", 0, Date_prototype_getMonth);
	defineFunction(builtin_Date_prototype, "getUTCMonth", 0, Date_prototype_getUTCMonth);
	defineFunction(builtin_Date_prototype, "getDate", 0, Date_prototype_getDate);
	defineFunction(builtin_Date_prototype, "getUTCDate", 0, Date_prototype_getUTCDate);
	defineFunction(builtin_Date_prototype, "getDay", 0, Date_prototype_getDay);
	defineFunction(builtin_Date_prototype, "getUTCDay", 0, Date_prototype_getUTCDay);
	defineFunction(builtin_Date_prototype, "getHours", 0, Date_prototype_getHours);
	defineFunction(builtin_Date_prototype, "getUTCHours", 0, Date_prototype_getUTCHours);
	defineFunction(builtin_Date_prototype, "getMinutes", 0, Date_prototype_getMinutes);
	defineFunction(builtin_Date_prototype, "getUTCMinutes", 0, Date_prototype_getUTCMinutes);
	defineFunction(builtin_Date_prototype, "getSeconds", 0, Date_prototype_getSeconds);
	defineFunction(builtin_Date_prototype, "getUTCSeconds", 0, Date_prototype_getUTCSeconds);
	defineFunction(builtin_Date_prototype, "getMilliseconds", 0, Date_prototype_getMilliseconds);
	defineFunction(builtin_Date_prototype, "getUTCMilliseconds", 0, Date_prototype_getUTCMilliseconds);
	defineFunction(builtin_Date_prototype, "getTimezoneOffset", 0, Date_prototype_getTimezoneOffset);
	defineFunction(builtin_Date_prototype, "setTime", 1, Date_prototype_setTime);
	defineFunction(builtin_Date_prototype, "setMilliseconds", 1, Date_prototype_setMilliseconds);
	defineFunction(builtin_Date_prototype, "setUTCMilliseconds", 1, Date_prototype_setUTCMilliseconds);
	defineFunction(builtin_Date_prototype, "setSeconds", 2, Date_prototype_setSeconds);
	defineFunction(builtin_Date_prototype, "setUTCSeconds", 2, Date_prototype_setUTCSeconds);
	defineFunction(builtin_Date_prototype, "setMinutes", 3, Date_prototype_setMinutes);
	defineFunction(builtin_Date_prototype, "setUTCMinutes", 3, Date_prototype_setUTCMinutes);
	defineFunction(builtin_Date_prototype, "setHours", 4, Date_prototype_setHours);
	defineFunction(builtin_Date_prototype, "setUTCHours", 4, Date_prototype_setUTCHours);
	defineFunction(builtin_Date_prototype, "setDate", 1, Date_prototype_setDate);
	defineFunction(builtin_Date_prototype, "setUTCDate", 1, Date_prototype_setUTCDate);
	defineFunction(builtin_Date_prototype, "setMonth", 2, Date_prototype_setMonth);
	defineFunction(builtin_Date_prototype, "setUTCMonth", 2, Date_prototype_setUTCMonth);
	defineFunction(builtin_Date_prototype, "setFullYear", 3, Date_prototype_setFullYear);
	defineFunction(builtin_Date_prototype, "setUTCFullYear", 3, Date_prototype_setUTCFullYear);
	defineFunction(builtin_Date_prototype, "toUTCString", 0, Date_prototype_toUTCString);
	defineFunction(builtin_Date_prototype, "toISOString", 0, Date_prototype_toISOString);
	defineFunction(builtin_Date_prototype, "toJSON", 1, Date_prototype_toJSON);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(builtin_Date_prototype, "getYear", 0, Date_prototype_getYear);
		defineFunction(builtin_Date_prototype, "setYear", 1, Date_prototype_setYear);
		defineFunction(builtin_Date_prototype, "toGMTString", 0, Date_prototype_toUTCString);
	}

	defineFinal(builtin_RegExp, "length", 2);
	defineFinal(builtin_RegExp, "prototype", builtin_RegExp_prototype);
	defineFinal(builtin_RegExp_prototype, "source", "(?:)");
	defineFinal(builtin_RegExp_prototype, "global", false);
	defineFinal(builtin_RegExp_prototype, "ignoreCase", false);
	defineFinal(builtin_RegExp_prototype, "multiline", false);
	defineWritable(builtin_RegExp_prototype, "lastIndex", 0);
	theRegExpFactory.compile(builtin_RegExp_prototype);
	define(builtin_RegExp_prototype, "constructor", builtin_RegExp);
	defineFunction(builtin_RegExp_prototype, "exec", 1, RegExp_prototype_exec);
	defineFunction(builtin_RegExp_prototype, "test", 1, RegExp_prototype_test);
	defineFunction(builtin_RegExp_prototype, "toString", 0, RegExp_prototype_toString);

	defineFinal(builtin_Error, "length", 1);
	defineFinal(builtin_Error, "prototype", builtin_Error_prototype);
	define(builtin_Error_prototype, "constructor", builtin_Error);
	define(builtin_Error_prototype, "name", "Error");
	define(builtin_Error_prototype, "message", "");
	defineFunction(builtin_Error_prototype, "toString", 0, Error_prototype_toString);
	if (STRICT_CONFORMANCE === false) {
		defineAccessor(builtin_Error_prototype, "stack", get_Error_prototype_stack, undefined);
	}

	defineFinal(builtin_EvalError, "length", 1);
	defineFinal(builtin_EvalError, "prototype", builtin_EvalError_prototype);
	define(builtin_EvalError_prototype, "constructor", builtin_EvalError);
	define(builtin_EvalError_prototype, "name", "EvalError");
	define(builtin_EvalError_prototype, "message", "");

	defineFinal(builtin_RangeError, "length", 1);
	defineFinal(builtin_RangeError, "prototype", builtin_RangeError_prototype);
	define(builtin_RangeError_prototype, "constructor", builtin_RangeError);
	define(builtin_RangeError_prototype, "name", "RangeError");
	define(builtin_RangeError_prototype, "message", "");

	defineFinal(builtin_ReferenceError, "length", 1);
	defineFinal(builtin_ReferenceError, "prototype", builtin_ReferenceError_prototype);
	define(builtin_ReferenceError_prototype, "constructor", builtin_ReferenceError);
	define(builtin_ReferenceError_prototype, "name", "ReferenceError");
	define(builtin_ReferenceError_prototype, "message", "");

	defineFinal(builtin_SyntaxError, "length", 1);
	defineFinal(builtin_SyntaxError, "prototype", builtin_SyntaxError_prototype);
	define(builtin_SyntaxError_prototype, "constructor", builtin_SyntaxError);
	define(builtin_SyntaxError_prototype, "name", "SyntaxError");
	define(builtin_SyntaxError_prototype, "message", "");

	defineFinal(builtin_TypeError, "length", 1);
	defineFinal(builtin_TypeError, "prototype", builtin_TypeError_prototype);
	define(builtin_TypeError_prototype, "constructor", builtin_TypeError);
	define(builtin_TypeError_prototype, "name", "TypeError");
	define(builtin_TypeError_prototype, "message", "");

	defineFinal(builtin_URIError, "length", 1);
	defineFinal(builtin_URIError, "prototype", builtin_URIError_prototype);
	define(builtin_URIError_prototype, "constructor", builtin_URIError);
	define(builtin_URIError_prototype, "name", "URIError");
	define(builtin_URIError_prototype, "message", "");

	defineFunction(builtin_JSON, "parse", 2, JSON_parse);
	defineFunction(builtin_JSON, "stringify", 3, JSON_stringify);

	initializeThrowTypeErrorObject();
	initializeBuffer();
	initializeIOPort();
	initExecutionContext();
}

var builtin_Buffer;
var builtin_Buffer_prototype;

function initializeBuffer() {
	builtin_Buffer_prototype = VMObject(CLASSID_Buffer);
	builtin_Buffer_prototype.Prototype = builtin_Object_prototype;
	builtin_Buffer_prototype.Extensible = true;
	builtin_Buffer_prototype.wrappedBuffer = new Buffer(0);

	builtin_Buffer = VMObject(CLASSID_BuiltinFunction);
	builtin_Buffer.Call = Buffer_Call;
	builtin_Buffer.Construct = Buffer_Construct;
	builtin_Buffer.Prototype = builtin_Function_prototype;
	builtin_Buffer.Extensible = true;
	define(theGlobalObject, "Buffer", builtin_Buffer);

	define(builtin_Buffer, "INSPECT_MAX_BYTES", 52);
	defineFinal(builtin_Buffer, "length", 2);
	defineFinal(builtin_Buffer, "prototype", builtin_Buffer_prototype);
	defineFunction(builtin_Buffer, "isEncoding", 1, Buffer_isEncoding);
	defineFunction(builtin_Buffer, "isBuffer", 1, Buffer_isBuffer);
	defineFunction(builtin_Buffer, "byteLength", 1, Buffer_byteLength);
	defineFunction(builtin_Buffer, "concat", 2, Buffer_concat);
	defineFunction(builtin_Buffer, "compare", 2, Buffer_compare);
	defineFinal(builtin_Buffer_prototype, "length", 0);
	define(builtin_Buffer_prototype, "constructor", builtin_Buffer);
	defineFunction(builtin_Buffer_prototype, "write", 4, Buffer_prototype_write);
	defineFunction(builtin_Buffer_prototype, "writeUIntLE", 4, Buffer_prototype_writeUIntLE);
	defineFunction(builtin_Buffer_prototype, "writeUIntBE", 4, Buffer_prototype_writeUIntBE);
	defineFunction(builtin_Buffer_prototype, "writeIntLE", 4, Buffer_prototype_writeIntLE);
	defineFunction(builtin_Buffer_prototype, "writeIntBE", 4, Buffer_prototype_writeIntBE);
	defineFunction(builtin_Buffer_prototype, "readUIntLE", 3, Buffer_prototype_readUIntLE);
	defineFunction(builtin_Buffer_prototype, "readUIntBE", 3, Buffer_prototype_readUIntBE);
	defineFunction(builtin_Buffer_prototype, "readIntLE", 3, Buffer_prototype_readIntLE);
	defineFunction(builtin_Buffer_prototype, "readIntBE", 3, Buffer_prototype_readIntBE);
	defineFunction(builtin_Buffer_prototype, "toString", 3, Buffer_prototype_toString);
	defineFunction(builtin_Buffer_prototype, "toJSON", 0, Buffer_prototype_toJSON);
	defineFunction(builtin_Buffer_prototype, "equals", 1, Buffer_prototype_equals);
	defineFunction(builtin_Buffer_prototype, "compare", 1, Buffer_prototype_compare);
	defineFunction(builtin_Buffer_prototype, "copy", 0, Buffer_prototype_copy);
	defineFunction(builtin_Buffer_prototype, "slice", 2, Buffer_prototype_slice);
	defineFunction(builtin_Buffer_prototype, "readUInt8", 2, Buffer_prototype_readUInt8);
	defineFunction(builtin_Buffer_prototype, "readUInt16LE", 2, Buffer_prototype_readUInt16LE);
	defineFunction(builtin_Buffer_prototype, "readUInt16BE", 2, Buffer_prototype_readUInt16BE);
	defineFunction(builtin_Buffer_prototype, "readUInt32LE", 2, Buffer_prototype_readUInt32LE);
	defineFunction(builtin_Buffer_prototype, "readUInt32BE", 2, Buffer_prototype_readUInt32BE);
	defineFunction(builtin_Buffer_prototype, "readInt8", 2, Buffer_prototype_readInt8);
	defineFunction(builtin_Buffer_prototype, "readInt16LE", 2, Buffer_prototype_readInt16LE);
	defineFunction(builtin_Buffer_prototype, "readInt16BE", 2, Buffer_prototype_readInt16BE);
	defineFunction(builtin_Buffer_prototype, "readInt32LE", 2, Buffer_prototype_readInt32LE);
	defineFunction(builtin_Buffer_prototype, "readInt32BE", 2, Buffer_prototype_readInt32BE);
	defineFunction(builtin_Buffer_prototype, "readFloatLE", 2, Buffer_prototype_readFloatLE);
	defineFunction(builtin_Buffer_prototype, "readFloatBE", 2, Buffer_prototype_readFloatBE);
	defineFunction(builtin_Buffer_prototype, "readDoubleLE", 2, Buffer_prototype_readDoubleLE);
	defineFunction(builtin_Buffer_prototype, "readDoubleBE", 2, Buffer_prototype_readDoubleBE);
	defineFunction(builtin_Buffer_prototype, "writeUInt8", 3, Buffer_prototype_writeUInt8);
	defineFunction(builtin_Buffer_prototype, "writeUInt16LE", 3, Buffer_prototype_writeUInt16LE);
	defineFunction(builtin_Buffer_prototype, "writeUInt16BE", 3, Buffer_prototype_writeUInt16BE);
	defineFunction(builtin_Buffer_prototype, "writeUInt32LE", 3, Buffer_prototype_writeUInt32LE);
	defineFunction(builtin_Buffer_prototype, "writeUInt32BE", 3, Buffer_prototype_writeUInt32BE);
	defineFunction(builtin_Buffer_prototype, "writeInt8", 3, Buffer_prototype_writeInt8);
	defineFunction(builtin_Buffer_prototype, "writeInt16LE", 3, Buffer_prototype_writeInt16LE);
	defineFunction(builtin_Buffer_prototype, "writeInt16BE", 3, Buffer_prototype_writeInt16BE);
	defineFunction(builtin_Buffer_prototype, "writeInt32LE", 3, Buffer_prototype_writeInt32LE);
	defineFunction(builtin_Buffer_prototype, "writeInt32BE", 3, Buffer_prototype_writeInt32BE);
	defineFunction(builtin_Buffer_prototype, "writeFloatLE", 3, Buffer_prototype_writeFloatLE);
	defineFunction(builtin_Buffer_prototype, "writeFloatBE", 3, Buffer_prototype_writeFloatBE);
	defineFunction(builtin_Buffer_prototype, "writeDoubleLE", 3, Buffer_prototype_writeDoubleLE);
	defineFunction(builtin_Buffer_prototype, "writeDoubleBE", 3, Buffer_prototype_writeDoubleBE);
	defineFunction(builtin_Buffer_prototype, "fill", 3, Buffer_prototype_fill);
	defineFunction(builtin_Buffer_prototype, "inspect", 0, Buffer_prototype_inspect);
}

var builtin_IOPort;
var builtin_IOPort_prototype;

function initializeIOPort() {
	builtin_IOPort_prototype = VMObject(CLASSID_IOPort);
	builtin_IOPort_prototype.Prototype = builtin_Object_prototype;
	builtin_IOPort_prototype.Extensible = true;
	builtin_IOPort_prototype.txid = 0;
	builtin_IOPort_prototype.handler = null;

	builtin_IOPort = VMObject(CLASSID_BuiltinFunction);
	builtin_IOPort.Call = IOPort_Call;
	builtin_IOPort.Construct = IOPort_Construct;
	builtin_IOPort.Prototype = builtin_Function_prototype;
	builtin_IOPort.Extensible = true;
	define(theGlobalObject, "IOPort", builtin_IOPort);

	defineFinal(builtin_IOPort, "length", 1);
	defineFinal(builtin_IOPort, "prototype", builtin_IOPort_prototype);
	defineFinal(builtin_IOPort, "restartError", Error_Construct(["restart"]));
	defineFinal(builtin_IOPort, "offlineError", Error_Construct(["offline"]));
	defineFinal(builtin_IOPort, "staleError", Error_Construct(["stale"]));
	define(builtin_IOPort_prototype, "constructor", builtin_IOPort);
	defineFunction(builtin_IOPort_prototype, "open", 0, IOPort_prototype_open);
	defineFunction(builtin_IOPort_prototype, "syncIO", 1, IOPort_prototype_syncIO);
	defineFunction(builtin_IOPort_prototype, "asyncIO", 2, IOPort_prototype_asyncIO);
}
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

// ECMAScript 5.1: 15.4 Array Objects

function Array_Call(thisValue, argumentsList) {
	return Array_Construct(argumentsList);
}

function Array_Construct(argumentsList) {
	var obj = VMObject(CLASSID_Array);
	obj.Prototype = builtin_Array_prototype;
	obj.Extensible = true;
	if (argumentsList.length !== 1) {
		defineWritable(obj, "length", argumentsList.length);
		for (var i = 0; i < argumentsList.length; i++) {
			defineFree(obj, ToString(i), argumentsList[i]);
		}
	}
	else {
		var len = argumentsList[0];
		if (Type(len) === TYPE_Number && ToUint32(len) === len) {
			defineWritable(obj, "length", ToUint32(len));
		}
		if (Type(len) === TYPE_Number && ToUint32(len) !== len) throw VMRangeError();
		if (Type(len) !== TYPE_Number) {
			defineWritable(obj, "length", 1);
			defineFree(obj, "0", len);
		}
	}
	return obj;
}

function Array_isArray(thisValue, argumentsList) {
	var arg = argumentsList[0];
	if (Type(arg) !== TYPE_Object) return false;
	if (arg.Class === "Array") return true;
	return false;
}

function Array_prototype_toString(thisValue, argumentsList) {
	var array = ToObject(thisValue);
	var func = array.Get("join");
	if (IsCallable(func) === false) return Object_prototype_toString(array, []);
	return func.Call(array, []);
}

function Array_prototype_toLocaleString(thisValue, argumentsList) {
	var array = ToObject(thisValue);
	var arrayLen = array.Get("length");
	var len = ToUint32(arrayLen);
	var separator = ',';
	if (len === 0) return "";
	var firstElement = array.Get("0");
	if (firstElement === undefined || firstElement === null) {
		var R = "";
	}
	else {
		var elementObj = ToObject(firstElement);
		var func = elementObj.Get("toLocaleString");
		if (IsCallable(func) === false) throw VMTypeError();
		// specification Bug 62
		//var R = func.Call(elementObj, []);
		var R = func.Call(firstElement, []);
		var R = ToString(R);
		// end of bug fix
	}
	var k = 1;
	while (k < len) {
		var S = R + separator;
		var nextElement = array.Get(ToString(k));
		if (nextElement === undefined || nextElement === null) {
			var R = "";
		}
		else {
			var elementObj = ToObject(nextElement);
			var func = elementObj.Get("toLocaleString");
			if (IsCallable(func) === false) throw VMTypeError();
			// specification Bug 62
			//var R = func.Call(elementObj, []);
			var R = func.Call(nextElement, []);
			var R = ToString(R);
			// end of bug fix
		}
		var R = S + R;
		k++;
	}
	return R;
}

function Array_prototype_concat(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var A = Array_Construct([]);
	var n = 0;
	var items = [ O ].concat(argumentsList);
	for (var i = 0; i < items.length; i++) {
		var E = items[i];
		if (E.Class === "Array") {
			var k = 0;
			var len = E.Get("length");
			while (k < len) {
				var P = ToString(k);
				var exists = E.HasProperty(P);
				if (exists === true) {
					var subElement = E.Get(P);
					A.DefineOwnProperty(ToString(n), PropertyDescriptor({
						Value : subElement,
						Writable : true,
						Enumerable : true,
						Configurable : true
					}), false);
				}
				n++;
				k++;
			}
		}
		else {
			A.DefineOwnProperty(ToString(n), PropertyDescriptor({
				Value : E,
				Writable : true,
				Enumerable : true,
				Configurable : true
			}), false);
			n++;
		}
	}
	// specification Bug 129
	A.Put("length", n, true);
	// end of bug fix
	return A;
}

function Array_prototype_join(thisValue, argumentsList) {
	var separator = argumentsList[0];
	var O = ToObject(thisValue);
	var lenVal = O.Get("length");
	var len = ToUint32(lenVal);
	if (separator === undefined) {
		var separator = ",";
	}
	var sep = ToString(separator);
	if (len === 0) return "";
	var element0 = O.Get("0");
	if (element0 === undefined || element0 === null) {
		var R = "";
	}
	else {
		var R = ToString(element0);
	}
	var k = 1;
	while (k < len) {
		var S = R + sep;
		var element = O.Get(ToString(k));
		if (element === undefined || element === null) {
			var next = "";
		}
		else {
			var next = ToString(element);
		}
		var R = S + next;
		k++;
	}
	return R;
}

function Array_prototype_pop(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var lenVal = O.Get("length");
	var len = ToUint32(lenVal);
	if (len === 0) {
		O.Put("length", 0, true);
		return undefined;
	}
	else {
		var indx = ToString(len - 1);
		var element = O.Get(indx);
		O.Delete(indx, true);
		// specification Bug 162
		// O.Put("length", indx, true);
		O.Put("length", len - 1, true);
		// end of bug fix
		return element;
	}
}

function Array_prototype_push(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var lenVal = O.Get("length");
	var n = ToUint32(lenVal);
	var items = argumentsList;
	for (var i = 0; i < items.length; i++) {
		var E = items[i];
		O.Put(ToString(n), E, true);
		n++;
	}
	O.Put("length", n, true);
	return n;
}

function Array_prototype_reverse(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var lenVal = O.Get("length");
	var len = ToUint32(lenVal);
	var middle = floor(len / 2);
	var lower = 0;
	while (lower !== middle) {
		var upper = len - lower - 1;
		var upperP = ToString(upper);
		var lowerP = ToString(lower);
		var lowerValue = O.Get(lowerP);
		var upperValue = O.Get(upperP);
		var lowerExists = O.HasProperty(lowerP);
		var upperExists = O.HasProperty(upperP);
		if (lowerExists === true && upperExists === true) {
			O.Put(lowerP, upperValue, true);
			O.Put(upperP, lowerValue, true);
		}
		else if (lowerExists === false && upperExists === true) {
			O.Put(lowerP, upperValue, true);
			O.Delete(upperP, true);
		}
		else if (lowerExists === true && upperExists === false) {
			O.Delete(lowerP, true);
			O.Put(upperP, lowerValue, true);
		}
		lower++;
	}
	return O;
}

function Array_prototype_shift(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var lenVal = O.Get("length");
	var len = ToUint32(lenVal);
	if (len === 0) {
		O.Put("length", 0, true);
		return undefined;
	}
	var first = O.Get("0");
	var k = 1;
	while (k < len) {
		var from = ToString(k);
		var to = ToString(k - 1);
		var fromPresent = O.HasProperty(from);
		if (fromPresent === true) {
			var fromVal = O.Get(from);
			O.Put(to, fromVal, true);
		}
		else {
			O.Delete(to, true);
		}
		k++;
	}
	O.Delete(ToString(len - 1), true);
	O.Put("length", (len - 1), true);
	return first;
}

function Array_prototype_slice(thisValue, argumentsList) {
	var start = argumentsList[0];
	var end = argumentsList[1];
	var O = ToObject(thisValue);
	var A = Array_Construct([]);
	var lenVal = O.Get("length");
	var len = ToUint32(lenVal);
	var relativeStart = ToInteger(start);
	if (relativeStart < 0) {
		var k = max((len + relativeStart), 0);
	}
	else {
		var k = min(relativeStart, len);
	}
	if (end === undefined) {
		var relativeEnd = len;
	}
	else {
		var relativeEnd = ToInteger(end);
	}
	if (relativeEnd < 0) {
		var final = max((len + relativeEnd), 0);
	}
	else {
		var final = min(relativeEnd, len);
	}
	var n = 0;
	while (k < final) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			A.DefineOwnProperty(ToString(n), PropertyDescriptor({
				Value : kValue,
				Writable : true,
				Enumerable : true,
				Configurable : true
			}), false);
		}
		k++;
		n++;
	}
	// specification Bug 417
	A.Put("length", n, true);
	// end of bug fix
	return A;
}

function Array_prototype_sort(thisValue, argumentsList) {
	var comparefn = argumentsList[0];
	var obj = ToObject(thisValue);
	var len = ToUint32(obj.Get("length"));
	var perm = [];
	for (var i = 0; i < len; i++) {
		perm[i] = i;
	}
	var perm = qsort(perm);
	var result = [];
	for (var i = 0; i < len; i++) {
		var P = ToString(perm[i]);
		if (obj.HasProperty(P) === false) {
			break;
		}
		result[i] = obj.Get(P);
	}
	for (var i = 0; i < len; i++) {
		var P = ToString(i);
		if (i < result.length) {
			obj.Put(P, result[i], true);
		}
		else {
			obj.Delete(P, true);
		}
	}
	return obj;

	function qsort(perm) {
		var l = perm.length;
		if (l <= 1) return perm;
		var lower = [];
		var same = [];
		var higher = [];
		var p = perm[l >>> 1];
		for (var i = 0; i < l; i++) {
			var q = perm[i];
			var c = (q === p) ? 0 : SortCompare(q, p);
			switch (c) {
			case -1:
				lower.push(q);
				break;
			case 0:
				same.push(q);
				break;
			case 1:
				higher.push(q);
				break;
			}
		}
		var lower = qsort(lower);
		var higher = qsort(higher);
		return lower.concat(same, higher);
	}

	function SortCompare(j, k) {
		var jString = ToString(j);
		var kString = ToString(k);
		var hasj = obj.HasProperty(jString);
		var hask = obj.HasProperty(kString);
		if (hasj === false && hask === false) return 0;
		if (hasj === false) return 1;
		if (hask === false) return -1;
		var x = obj.Get(jString);
		var y = obj.Get(kString);
		if (x === undefined && y === undefined) return 0;
		if (x === undefined) return 1;
		if (y === undefined) return -1;
		if (comparefn !== undefined) {
			if (IsCallable(comparefn) === false) throw VMTypeError();
			return comparefn.Call(undefined, [ x, y ]);
		}
		var xString = ToString(x);
		var yString = ToString(y);
		if (xString < yString) return -1;
		if (xString > yString) return 1;
		return 0;
	}
}

function Array_prototype_splice(thisValue, argumentsList) {
	var start = argumentsList[0];
	var deleteCount = argumentsList[1];
	var O = ToObject(thisValue);
	var A = Array_Construct([]);
	var lenVal = O.Get("length");
	var len = ToUint32(lenVal);
	var relativeStart = ToInteger(start);
	if (relativeStart < 0) {
		var actualStart = max((len + relativeStart), 0);
	}
	else {
		var actualStart = min(relativeStart, len);
	}
	var actualDeleteCount = min(max(ToInteger(deleteCount), 0), len - actualStart);
	var k = 0;
	while (k < actualDeleteCount) {
		var from = ToString(actualStart + k);
		var fromPresent = O.HasProperty(from);
		if (fromPresent === true) {
			var fromValue = O.Get(from);
			A.DefineOwnProperty(ToString(k), PropertyDescriptor({
				Value : fromValue,
				Writable : true,
				Enumerable : true,
				Configurable : true
			}), false);
		}
		k++;
	}
	// specification Bug 332
	A.Put("length", actualDeleteCount, true);
	// end of bug fix
	var itemCount = argumentsList.length - 2;
	if (itemCount < 0) {
		itemCount = 0;
	}
	if (itemCount < actualDeleteCount) {
		var k = actualStart;
		while (k < (len - actualDeleteCount)) {
			var from = ToString(k + actualDeleteCount);
			var to = ToString(k + itemCount);
			var fromPresent = O.HasProperty(from);
			if (fromPresent === true) {
				var fromValue = O.Get(from);
				O.Put(to, fromValue, true);
			}
			else {
				O.Delete(to, true);
			}
			k++;
		}
		var k = len;
		while (k > (len - actualDeleteCount + itemCount)) {
			O.Delete(ToString(k - 1), true);
			k--;
		}
	}
	else if (itemCount > actualDeleteCount) {
		var k = (len - actualDeleteCount);
		while (k > actualStart) {
			var from = ToString(k + actualDeleteCount - 1);
			var to = ToString(k + itemCount - 1);
			var fromPresent = O.HasProperty(from);
			if (fromPresent === true) {
				var fromValue = O.Get(from);
				O.Put(to, fromValue, true);
			}
			else {
				O.Delete(to, true);
			}
			k--;
		}
	}
	var k = actualStart;
	for (var i = 2; i < argumentsList.length; i++) {
		var E = argumentsList[i];
		O.Put(ToString(k), E, true);
		k++;
	}
	O.Put("length", (len - actualDeleteCount + itemCount), true);
	return A;
}

function Array_prototype_unshift(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var lenVal = O.Get("length");
	var len = ToUint32(lenVal);
	var argCount = argumentsList.length;
	var k = len;
	while (k > 0) {
		var from = ToString(k - 1);
		var to = ToString(k + argCount - 1);
		var fromPresent = O.HasProperty(from);
		if (fromPresent === true) {
			var fromValue = O.Get(from);
			O.Put(to, fromValue, true);
		}
		else {
			O.Delete(to, true);
		}
		k--;
	}
	var j = 0;
	var items = argumentsList;
	while (j !== items.length) {
		var E = items[j];
		O.Put(ToString(j), E, true);
		j++;
	}
	O.Put("length", len + argCount, true);
	return len + argCount;
}

function Array_prototype_indexOf(thisValue, argumentsList) {
	var searchElement = argumentsList[0];
	var fromIndex = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (len === 0) return -1;
	if (argumentsList.length >= 2) {
		var n = ToInteger(fromIndex);
	}
	else {
		var n = 0;
	}
	if (n >= len) return -1;
	if (n >= 0) {
		var k = n;
	}
	else {
		var k = len - abs(n);
		if (k < 0) {
			var k = 0;
		}
	}
	while (k < len) {
		var kPresent = O.HasProperty(ToString(k));
		if (kPresent === true) {
			var elementK = O.Get(ToString(k));
			var same = (searchElement === elementK);
			if (same === true) return k;
		}
		k++;
	}
	return -1;
}

function Array_prototype_lastIndexOf(thisValue, argumentsList) {
	var searchElement = argumentsList[0];
	var fromIndex = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (len === 0) return -1;
	if (argumentsList.length >= 2) {
		var n = ToInteger(fromIndex);
	}
	else {
		var n = len - 1;
	}
	if (n >= 0) {
		var k = min(n, len - 1);
	}
	else {
		var k = len - abs(n);
	}
	while (k >= 0) {
		var kPresent = O.HasProperty(ToString(k));
		if (kPresent === true) {
			var elementK = O.Get(ToString(k));
			var same = (searchElement === elementK);
			if (same === true) return k;
		}
		k--;
	}
	return -1;
}

function Array_prototype_every(thisValue, argumentsList) {
	var callbackfn = argumentsList[0];
	var thisArg = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (IsCallable(callbackfn) === false) throw VMTypeError();
	if (argumentsList.length >= 2) {
		var T = thisArg;
	}
	else {
		var T = undefined;
	}
	var k = 0;
	while (k < len) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			var testResult = callbackfn.Call(T, [ kValue, k, O ]);
			if (ToBoolean(testResult) === false) return false;
		}
		k++;
	}
	return true;
}

function Array_prototype_some(thisValue, argumentsList) {
	var callbackfn = argumentsList[0];
	var thisArg = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (IsCallable(callbackfn) === false) throw VMTypeError();
	if (argumentsList.length >= 2) {
		var T = thisArg;
	}
	else {
		var T = undefined;
	}
	var k = 0;
	while (k < len) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			var testResult = callbackfn.Call(T, [ kValue, k, O ]);
			if (ToBoolean(testResult) === true) return true;
		}
		k++;
	}
	return false;
}

function Array_prototype_forEach(thisValue, argumentsList) {
	var callbackfn = argumentsList[0];
	var thisArg = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (IsCallable(callbackfn) === false) throw VMTypeError();
	if (argumentsList.length >= 2) {
		var T = thisArg;
	}
	else {
		var T = undefined;
	}
	var k = 0;
	while (k < len) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			callbackfn.Call(T, [ kValue, k, O ]);
		}
		k++;
	}
	return undefined;
}

function Array_prototype_map(thisValue, argumentsList) {
	var callbackfn = argumentsList[0];
	var thisArg = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (IsCallable(callbackfn) === false) throw VMTypeError();
	if (argumentsList.length >= 2) {
		var T = thisArg;
	}
	else {
		var T = undefined;
	}
	var A = Array_Construct([ len ]);
	var k = 0;
	while (k < len) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			var mappedValue = callbackfn.Call(T, [ kValue, k, O ]);
			A.DefineOwnProperty(Pk, PropertyDescriptor({
				Value : mappedValue,
				Writable : true,
				Enumerable : true,
				Configurable : true
			}), false);
		}
		k++;
	}
	return A;
}

function Array_prototype_filter(thisValue, argumentsList) {
	var callbackfn = argumentsList[0];
	var thisArg = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (IsCallable(callbackfn) === false) throw VMTypeError();
	if (argumentsList.length >= 2) {
		var T = thisArg;
	}
	else {
		var T = undefined;
	}
	var A = Array_Construct([]);
	var k = 0;
	var to = 0;
	while (k < len) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			var selected = callbackfn.Call(T, [ kValue, k, O ]);
			if (ToBoolean(selected) === true) {
				A.DefineOwnProperty(ToString(to), PropertyDescriptor({
					Value : kValue,
					Writable : true,
					Enumerable : true,
					Configurable : true
				}), false);
				to++;
			}
		}
		k++;
	}
	return A;
}

function Array_prototype_reduce(thisValue, argumentsList) {
	var callbackfn = argumentsList[0];
	var initialValue = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (IsCallable(callbackfn) === false) throw VMTypeError();
	if (len === 0 && (argumentsList.length < 2)) throw VMTypeError();
	var k = 0;
	if (argumentsList.length >= 2) {
		var accumulator = initialValue;
	}
	else {
		var kPresent = false;
		while (kPresent === false && (k < len)) {
			var Pk = ToString(k);
			var kPresent = O.HasProperty(Pk);
			if (kPresent === true) {
				var accumulator = O.Get(Pk);
			}
			k++;
		}
		if (kPresent === false) throw VMTypeError();
	}
	while (k < len) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			var accumulator = callbackfn.Call(undefined, [ accumulator, kValue, k, O ]);
		}
		k++;
	}
	return accumulator;
}

function Array_prototype_reduceRight(thisValue, argumentsList) {
	var callbackfn = argumentsList[0];
	var initialValue = argumentsList[1];
	var O = ToObject(thisValue);
	var lenValue = O.Get("length");
	var len = ToUint32(lenValue);
	if (IsCallable(callbackfn) === false) throw VMTypeError();
	if (len === 0 && (argumentsList.length < 2)) throw VMTypeError();
	var k = len - 1;
	if (argumentsList.length >= 2) {
		var accumulator = initialValue;
	}
	else {
		var kPresent = false;
		while (kPresent === false && (k >= 0)) {
			var Pk = ToString(k);
			var kPresent = O.HasProperty(Pk);
			if (kPresent === true) {
				var accumulator = O.Get(Pk);
			}
			k--;
		}
		if (kPresent === false) throw VMTypeError();
	}
	while (k >= 0) {
		var Pk = ToString(k);
		var kPresent = O.HasProperty(Pk);
		if (kPresent === true) {
			var kValue = O.Get(Pk);
			var accumulator = callbackfn.Call(undefined, [ accumulator, kValue, k, O ]);
		}
		k--;
	}
	return accumulator;
}

function ArrayObject_DefineOwnProperty(P, Desc, Throw) {
	var A = this;
	var oldLenDesc = A.GetOwnProperty("length");
	var oldLen = oldLenDesc.Value;
	if (P === "length") {
		if (Desc.Value === absent) return default_DefineOwnProperty.call(A, "length", Desc, Throw);
		var newLen = ToUint32(Desc.Value);
		if (newLen !== ToNumber(Desc.Value)) throw VMRangeError();
		var newLenDesc = PropertyDescriptor({
			Value : newLen,
			Writable : Desc.Writable,
			Enumerable : Desc.Enumerable,
			Configurable : Desc.Configurable,
		});
		if (newLen >= oldLen) return default_DefineOwnProperty.call(A, "length", newLenDesc, Throw);
		if (oldLenDesc.Writable === false) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
		if (newLenDesc.Writable === absent || newLenDesc.Writable === true) {
			var newWritable = true;
		}
		else {
			var newWritable = false;
			var newLenDesc = PropertyDescriptor({
				Value : newLenDesc.Value,
				Writable : true,
				Enumerable : newLenDesc.Enumerable,
				Configurable : newLenDesc.Configurable,
			});
		}
		var succeeded = default_DefineOwnProperty.call(A, "length", newLenDesc, Throw);
		if (succeeded === false) return false;
		while (newLen < oldLen) {
			oldLen = oldLen - 1;
			var deleteSucceeded = A.Delete(ToString(oldLen), false);
			if (deleteSucceeded === false) {
				var newLenDesc = PropertyDescriptor({
					Value : oldLen + 1,
					Writable : newWritable ? newLenDesc.Writable : false,
					Enumerable : newLenDesc.Enumerable,
					Configurable : newLenDesc.Configurable,
				});
				default_DefineOwnProperty.call(A, "length", newLenDesc, false);
				if (Throw === true) throw VMTypeError();
				else return false;
			}
		}
		if (newWritable === false) {
			default_DefineOwnProperty.call(A, "length", PropertyDescriptor({
				Writable : false
			}), false);
		}
		return true;
	}
	var index = ToUint32(P);
	if (ToString(index) === P && index !== 0xffffffff) {
		if ((index >= oldLen) && oldLenDesc.Writable === false) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
		var succeeded = default_DefineOwnProperty.call(A, P, Desc, false);
		if (succeeded === false) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
		if (index >= oldLen) {
			var oldLenDesc = PropertyDescriptor({
				Value : index + 1,
				Writable : oldLenDesc.Writable,
				Enumerable : oldLenDesc.Enumerable,
				Configurable : oldLenDesc.Configurable,
			});
			default_DefineOwnProperty.call(A, "length", oldLenDesc, false);
		}
		return true;
	}
	return default_DefineOwnProperty.call(A, P, Desc, Throw);
}

//optimized version of ArrayObject_DefineOwnProperty
function ArrayObject_DefineOwnProperty_Value(A, P, V, ownDesc) {
	assert(ownDesc.Writable , ownDesc);
	if (P === "length") {
		var oldLen = ownDesc.Value;
		V = ToNumber(V);
		var newLen = ToUint32(V);
		if (newLen !== V) throw VMRangeError();
		intrinsic_set_value(A, P, newLen, ownDesc);
		while (newLen < oldLen) {
			oldLen = oldLen - 1;
			var deleteSucceeded = A.Delete(ToString(oldLen), false);
			if (deleteSucceeded === false) {
				intrinsic_set_value(A, P, oldLen + 1, ownDesc);
				return false;
			}
		}
		return true;
	}
	var index = ToUint32(P);
	if (ToString(index) === P && index !== 0xffffffff) {
		var oldLenDesc = A.GetOwnProperty("length");
		var oldLen = oldLenDesc.Value;
		if ((index >= oldLen) && oldLenDesc.Writable === false) {
			return false;
		}
		intrinsic_set_value(A, P, V, ownDesc);
		if (index >= oldLen) {
			intrinsic_set_value(A, "length", index + 1, oldLenDesc);
		}
		return true;
	}
	intrinsic_set_value(A, P, V, ownDesc);
	return true;
}
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

// ECMAScript 5.1: 15.6 Boolean Objects

function Boolean_Call(thisValue, argumentsList) {
	var value = argumentsList[0];
	return ToBoolean(value);
}

function Boolean_Construct(argumentsList) {
	var value = Boolean_Call(null, argumentsList);
	var obj = VMObject(CLASSID_Boolean);
	obj.Prototype = builtin_Boolean_prototype;
	obj.Extensible = true;
	obj.PrimitiveValue = value;
	return obj;
}

function Boolean_prototype_toString(thisValue, argumentsList) {
	var B = thisValue;
	if (Type(B) === TYPE_Boolean) {
		var b = B;
	}
	else if (Type(B) === TYPE_Object && B.Class === "Boolean") {
		var b = B.PrimitiveValue;
	}
	else throw VMTypeError();
	if (b === true) return "true";
	else return "false";
}

function Boolean_prototype_valueOf(thisValue, argumentsList) {
	var B = thisValue;
	if (Type(B) === TYPE_Boolean) {
		var b = B;
	}
	else if (Type(B) === TYPE_Object && B.Class === "Boolean") {
		var b = B.PrimitiveValue;
	}
	else throw VMTypeError();
	return b;
}
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

// Node.js Buffer wrapper; experimental;

function BufferObject_GetOwnProperty(P) {
	var B = this;
	var index = ToUint32(P);
	if (ToString(index) !== P) {
		return default_GetOwnProperty.call(B, P);
	}
	var buf = B.wrappedBuffer;
	var len = buf.length;
	if (len <= index) return undefined;
	var result = buf[index];
	return PropertyDescriptor({
		Value : result,
		Enumerable : true,
		Writable : true,
		Configurable : false
	});
}

function BufferObject_enumerator(ownOnly, enumerableOnly) {
	var B = this;
	var next = intrinsic_enumerator(B, ownOnly, enumerableOnly);
	var buf = B.wrappedBuffer;
	var i = 0;
	var len = buf.length;
	return function() {
		if (i < len) return ToString(i++);
		return next();
	};
}

function BufferObject_DefineOwnProperty(P, Desc, Throw) {
	var B = this;
	var index = ToUint32(P);
	if (ToString(index) !== P) {
		return default_DefineOwnProperty.call(B, P, Desc, Throw);
	}
	var buf = B.wrappedBuffer;
	var len = buf.length;
	if (len <= index) return false;
	if (IsAccessorDescriptor(Desc) === true) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (Desc.Configurable === true) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (Desc.Enumerable === false) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (Desc.Writable === false) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (Desc.Value !== absent) {
		var value = ToUint32(Desc.Value);
		buf[index] = value;
	}
	return true;
}

function Buffer_Call(thisValue, argumentsList) {
	return Buffer_Construct(argumentsList);
}

function Buffer_Construct(argumentsList) {
	var subject = argumentsList[0];
	if (Type(subject) === TYPE_Number) {
		try {
			var buf = new Buffer(subject);
		} catch (e) {
			redirectException(e);
		}
		buf.fill(0); // for deterministic behavior
	}
	else if (Type(subject) === TYPE_String) {
		var encoding = ToPrimitive(argumentsList[1]);
		try {
			var buf = new Buffer(subject, encoding);
		} catch (e) {
			redirectException(e);
		}
	}
	else if (Type(subject) === TYPE_Object && subject.Class === "Buffer") {
		try {
			var buf = new Buffer(subject.wrappedBuffer);
		} catch (e) {
			redirectException(e);
		}
	}
	else if (Type(subject) === TYPE_Object) {
		if (subject.Get("type") === "Buffer") {
			var data = subject.Get("data");
			if (Type(data) === TYPE_Object && data.Class === "Array") {
				subject = data;
			}
		}
		var len = ToNumber(subject.Get("length"));
		try {
			var buf = new Buffer(len);
		} catch (e) {
			redirectException(e);
		}
		var k = 0;
		while (k < len) {
			var P = ToString(k);
			var b = subject.Get(P);
			buf[k] = ToPrimitive(b);
			k++;
		}
	}
	else {
		throw VMTypeError();
	}
	var obj = VMObject(CLASSID_Buffer);
	obj.Prototype = builtin_Buffer_prototype;
	obj.Extensible = true;
	obj.wrappedBuffer = buf;
	defineFinal(obj, "length", buf.length);
	defineFinal(obj, "parent", obj);
	return obj;
}

function Buffer_isEncoding(thisValue, argumentsList) {
	var encoding = ToPrimitive(argumentsList[0]);
	try {
		return Buffer.isEncoding(encoding);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_isBuffer(thisValue, argumentsList) {
	var obj = argumentsList[0];
	if (Type(obj) !== TYPE_Object || obj.Class !== "Buffer") return false;
	return true;
}

function Buffer_byteLength(thisValue, argumentsList) {
	var string = ToString(argumentsList[0]);
	var encoding = ToPrimitive(argumentsList[1]);
	try {
		return Buffer.byteLength(string, encoding);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_concat(thisValue, argumentsList) {
	var list = argumentsList[0];
	var totalLength = ToPrimitive(argumentsList[1]);
	if (Type(list) !== TYPE_Object) throw VMTypeError();
	var len = list.Get("length");
	if (len === 0) {
		return Buffer_Construct([ 0 ]);
	}
	if (len === 1) {
		return list.Get("0");
	}
	var A = [];
	var k = 0;
	while (k < len) {
		var P = ToString(k);
		var b = list.Get(P);
		if (Type(b) !== TYPE_Object || b.Class !== "Buffer") throw VMTypeError();
		A[k] = b.wrappedBuffer;
		k++;
	}
	try {
		var buf = Buffer.concat(A, totalLength);
	} catch (e) {
		redirectException(e);
	}
	var obj = VMObject(CLASSID_Buffer);
	obj.Prototype = builtin_Buffer_prototype;
	obj.Extensible = true;
	obj.wrappedBuffer = buf;
	defineFinal(obj, "length", buf.length);
	defineFinal(obj, "parent", obj);
	return obj;
}

function Buffer_compare(thisValue, argumentsList) {
	var buf1 = argumentsList[0];
	var buf2 = argumentsList[1];
	if (Type(buf1) !== TYPE_Object || buf1.Class !== "Buffer") throw VMTypeError();
	if (Type(buf2) !== TYPE_Object || buf2.Class !== "Buffer") throw VMTypeError();
	try {
		return Buffer.compare(buf1.wrappedBuffer, buf2.wrappedBuffer);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_write(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var string = ToPrimitive(argumentsList[0]);
	var offset = ToPrimitive(argumentsList[1]);
	var length = ToPrimitive(argumentsList[2]);
	var encoding = ToPrimitive(argumentsList[3]);
	try {
		return thisValue.wrappedBuffer.write(string, offset, length, encoding);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeUIntLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var byteLength = ToNumber(argumentsList[2]);
	var noAssert = ToBoolean(argumentsList[3]);
	try {
		return thisValue.wrappedBuffer.writeUIntLE(value, offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeUIntBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var byteLength = ToNumber(argumentsList[2]);
	var noAssert = ToBoolean(argumentsList[3]);
	try {
		return thisValue.wrappedBuffer.writeUIntBE(value, offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeIntLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var byteLength = ToNumber(argumentsList[2]);
	var noAssert = ToBoolean(argumentsList[3]);
	try {
		return thisValue.wrappedBuffer.writeIntLE(value, offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeIntBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var byteLength = ToNumber(argumentsList[2]);
	var noAssert = ToBoolean(argumentsList[3]);
	try {
		return thisValue.wrappedBuffer.writeIntBE(value, offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readUIntLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var byteLength = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.readUIntLE(offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readUIntBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var byteLength = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.readUIntBE(offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readIntLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var byteLength = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.readIntLE(offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readIntBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var byteLength = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.readIntBE(offset, byteLength, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_toString(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var encoding = ToPrimitive(argumentsList[0]);
	var start = ToPrimitive(argumentsList[1]);
	var end = ToPrimitive(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.toString(encoding, start, end);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_toJSON(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var buf = thisValue.wrappedBuffer;
	var len = buf.length;
	var A = Array_Construct([ len ]);
	for (var i = 0; i < len; i++) {
		A.Put(ToString(i), buf[i]);
	}
	var O = Object_Construct([]);
	O.Put("type", "Buffer");
	O.Put("data", A);
	return O;
}

function Buffer_prototype_equals(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var otherBuffer = argumentsList[0];
	if (Type(otherBuffer) !== TYPE_Object || otherBuffer.Class !== "Buffer") throw VMTypeError();
	try {
		return thisValue.wrappedBuffer.equals(otherBuffer.wrappedBuffer);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_compare(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var otherBuffer = argumentsList[0];
	if (Type(otherBuffer) !== TYPE_Object || otherBuffer.Class !== "Buffer") throw VMTypeError();
	try {
		return thisValue.wrappedBuffer.compare(otherBuffer.wrappedBuffer);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_copy(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var targetBuffer = argumentsList[0];
	var targetStart = ToPrimitive(argumentsList[1]);
	var sourceStart = ToPrimitive(argumentsList[2]);
	var sourceEnd = ToPrimitive(argumentsList[3]);
	if (Type(targetBuffer) !== TYPE_Object || targetBuffer.Class !== "Buffer") throw VMTypeError();
	try {
		return thisValue.wrappedBuffer.copy(targetBuffer.wrappedBuffer, targetStart, sourceStart, sourceEnd);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_slice(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var start = ToPrimitive(argumentsList[0]);
	var end = ToPrimitive(argumentsList[1]);
	try {
		var buf = thisValue.wrappedBuffer.slice(start, end);
	} catch (e) {
		redirectException(e);
	}
	var obj = VMObject(CLASSID_Buffer);
	obj.Prototype = builtin_Buffer_prototype;
	obj.Extensible = true;
	obj.wrappedBuffer = buf;
	defineFinal(obj, "length", buf.length);
	if (buf.length > 0) {
		defineFinal(obj, "parent", thisValue.Get("parent"));
	}
	return obj;
}

function Buffer_prototype_readUInt8(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readUInt8(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readUInt16LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readUInt16LE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readUInt16BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readUInt16BE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readUInt32LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readUInt32LE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readUInt32BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readUInt32BE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readInt8(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readInt8(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readInt16LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readInt16LE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readInt16BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readInt16BE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readInt32LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readInt32LE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readInt32BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readInt32BE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readFloatLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readFloatLE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readFloatBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readFloatBE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readDoubleLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readDoubleLE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_readDoubleBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var offset = ToNumber(argumentsList[0]);
	var noAssert = ToBoolean(argumentsList[1]);
	try {
		return thisValue.wrappedBuffer.readDoubleBE(offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeUInt8(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeUInt8(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeUInt16LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeUInt16LE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeUInt16BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeUInt16BE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeUInt32LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeUInt32LE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeUInt32BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeUInt32BE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeInt8(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeInt8(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeInt16LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeInt16LE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeInt16BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeInt16BE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeInt32LE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeInt32LE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeInt32BE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeInt32BE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeFloatLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeFloatLE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeFloatBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeFloatBE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeDoubleLE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeDoubleLE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_writeDoubleBE(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToNumber(argumentsList[0]);
	var offset = ToNumber(argumentsList[1]);
	var noAssert = ToBoolean(argumentsList[2]);
	try {
		return thisValue.wrappedBuffer.writeDoubleBE(value, offset, noAssert);
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_fill(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var value = ToPrimitive(argumentsList[0]);
	var offset = ToPrimitive(argumentsList[1]);
	var end = ToPrimitive(argumentsList[2]);
	try {
		thisValue.wrappedBuffer.fill(value, offset, end);
		return thisValue;
	} catch (e) {
		redirectException(e);
	}
}

function Buffer_prototype_inspect(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Buffer") throw VMTypeError();
	var buffer = require('buffer');
	var max = ToPrimitive(builtin_Buffer.Get("INSPECT_MAX_BYTES"));
	buffer.INSPECT_MAX_BYTES = max;
	try {
		return thisValue.wrappedBuffer.inspect();
	} catch (e) {
		redirectException(e);
	}
}
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

// ECMAScript 5.1: 15.9 Date Objects

function Day(t) {
	return floor(t / msPerDay);
}

var msPerDay = 86400000;

function TimeWithinDay(t) {
	return modulo(t, msPerDay);
}

function DaysInYear(y) {
	if (modulo(y, 4) !== 0) return 365;
	if (modulo(y, 100) !== 0) return 366;
	if (modulo(y, 400) !== 0) return 365;
	return 366;
}

function DayFromYear(y) {
	return 365 * (y - 1970) + floor((y - 1969) / 4) - floor((y - 1901) / 100) + floor((y - 1601) / 400);
}

function TimeFromYear(y) {
	return msPerDay * DayFromYear(y);
}

function YearFromTime(t) {
	var y = floor(Day(t) / 365.2425);
	if (TimeFromYear(y) <= t) {
		while (TimeFromYear(y + 1) <= t) {
			y = y + 1;
		}
		return y;
	}
	y = y - 1;
	while (TimeFromYear(y) > t) {
		y = y - 1;
	}
	return y;
}

function InLeapYear(t) {
	if (DaysInYear(YearFromTime(t)) === 365) return 0;
	return 1;
}

function MonthFromTime(t) {
	var dayWithinYear = DayWithinYear(t);
	var inLeapYear = InLeapYear(t);
	if (dayWithinYear < 31) return 0;
	if (dayWithinYear < 59 + inLeapYear) return 1;
	if (dayWithinYear < 90 + inLeapYear) return 2;
	if (dayWithinYear < 120 + inLeapYear) return 3;
	if (dayWithinYear < 151 + inLeapYear) return 4;
	if (dayWithinYear < 181 + inLeapYear) return 5;
	if (dayWithinYear < 212 + inLeapYear) return 6;
	if (dayWithinYear < 243 + inLeapYear) return 7;
	if (dayWithinYear < 273 + inLeapYear) return 8;
	if (dayWithinYear < 304 + inLeapYear) return 9;
	if (dayWithinYear < 334 + inLeapYear) return 10;
	if (dayWithinYear < 365 + inLeapYear) return 11;
}

function DayWithinYear(t) {
	return Day(t) - DayFromYear(YearFromTime(t));
}

function DateFromTime(t) {
	var monthFromTime = MonthFromTime(t);
	if (monthFromTime === 0) return DayWithinYear(t) + 1;
	if (monthFromTime === 1) return DayWithinYear(t) - 30;
	if (monthFromTime === 2) return DayWithinYear(t) - 58 - InLeapYear(t);
	if (monthFromTime === 3) return DayWithinYear(t) - 89 - InLeapYear(t);
	if (monthFromTime === 4) return DayWithinYear(t) - 119 - InLeapYear(t);
	if (monthFromTime === 5) return DayWithinYear(t) - 150 - InLeapYear(t);
	if (monthFromTime === 6) return DayWithinYear(t) - 180 - InLeapYear(t);
	if (monthFromTime === 7) return DayWithinYear(t) - 211 - InLeapYear(t);
	if (monthFromTime === 8) return DayWithinYear(t) - 242 - InLeapYear(t);
	if (monthFromTime === 9) return DayWithinYear(t) - 272 - InLeapYear(t);
	if (monthFromTime === 10) return DayWithinYear(t) - 303 - InLeapYear(t);
	if (monthFromTime === 11) return DayWithinYear(t) - 333 - InLeapYear(t);
}

function WeekDay(t) {
	return modulo((Day(t) + 4), 7);
}

var LocalTZA = 9 * 3600000;
var LocalTZAString = "JST";

function DaylightSavingTA(t) {
	return 0;
}

function LocalTime(t) {
	return t + LocalTZA + DaylightSavingTA(t);
}

function UTC(t) {
	return t - LocalTZA - DaylightSavingTA(t - LocalTZA);
}

function HourFromTime(t) {
	return modulo(floor(t / msPerHour), HoursPerDay);
}

function MinFromTime(t) {
	return modulo(floor(t / msPerMinute), MinutesPerHour);
}

function SecFromTime(t) {
	return modulo(floor(t / msPerSecond), SecondsPerMinute);
}

function msFromTime(t) {
	return modulo(t, msPerSecond);
}

var HoursPerDay = 24;
var MinutesPerHour = 60;
var SecondsPerMinute = 60;
var msPerSecond = 1000;
var msPerMinute = 60000;
var msPerHour = 3600000;

function MakeTime(hour, min, sec, ms) {
	if (!(isFinite(hour) && isFinite(min) && isFinite(sec) && isFinite(ms))) return NaN;
	var h = ToInteger(hour);
	var m = ToInteger(min);
	var s = ToInteger(sec);
	var milli = ToInteger(ms);
	var t = h * msPerHour + m * msPerMinute + s * msPerSecond + milli;
	return t;
}

function MakeDay(year, month, date) {
	if (!(isFinite(year) && isFinite(month) && isFinite(date))) return NaN;
	var y = ToInteger(year);
	var m = ToInteger(month);
	var dt = ToInteger(date);
	var ym = y + floor(m / 12);
	var mn = modulo(m, 12);
	var t = TimeFromYear(ym);
	if (mn === 1) {
		t += msPerHour * HoursPerDay * 31;
	}
	if (mn === 2) {
		t += msPerHour * HoursPerDay * (59 + InLeapYear(ym));
	}
	if (mn === 3) {
		t += msPerHour * HoursPerDay * (90 + InLeapYear(ym));
	}
	if (mn === 4) {
		t += msPerHour * HoursPerDay * (120 + InLeapYear(ym));
	}
	if (mn === 5) {
		t += msPerHour * HoursPerDay * (151 + InLeapYear(ym));
	}
	if (mn === 6) {
		t += msPerHour * HoursPerDay * (181 + InLeapYear(ym));
	}
	if (mn === 7) {
		t += msPerHour * HoursPerDay * (212 + InLeapYear(ym));
	}
	if (mn === 8) {
		t += msPerHour * HoursPerDay * (243 + InLeapYear(ym));
	}
	if (mn === 9) {
		t += msPerHour * HoursPerDay * (273 + InLeapYear(ym));
	}
	if (mn === 10) {
		t += msPerHour * HoursPerDay * (304 + InLeapYear(ym));
	}
	if (mn === 11) {
		t += msPerHour * HoursPerDay * (334 + InLeapYear(ym));
	}
	if (!(YearFromTime(t) === ym && MonthFromTime(t) === mn && DateFromTime(t) === 1)) return NaN;
	return Day(t) + dt - 1;
}

function MakeDate(day, time) {
	if (!(isFinite(day) && isFinite(time))) return NaN;
	return day * msPerDay + time;
}

function TimeClip(time) {
	if (!isFinite(time)) return NaN;
	if (abs(time) > 8.64e15) return NaN;
	return ToInteger(time);
}

function toISODateString(t) {
	var y = YearFromTime(t);
	var m = MonthFromTime(t) + 1;
	var d = DateFromTime(t);
	if (0 <= y && y <= 9999) {
		var ys = formatNumber(y, 4);
	}
	else if (y < 0) {
		var ys = "-" + formatNumber(-y, 6);
	}
	else {
		var ys = "+" + formatNumber(y, 6);
	}
	return ys + "-" + formatNumber(m, 2) + "-" + formatNumber(d, 2);
}

function toISOTimeString(t) {
	var h = HourFromTime(t);
	var m = MinFromTime(t);
	var s = SecFromTime(t);
	return formatNumber(h, 2) + ":" + formatNumber(m, 2) + ":" + formatNumber(s, 2);
}

function Date_Call(thisValue, argumentsList) {
	return Date_prototype_toString(Date_Construct([]), []);
}

function Date_Construct(argumentsList) {
	if (argumentsList.length >= 2) {
		var year = argumentsList[0];
		var month = argumentsList[1];
		var date = argumentsList[2];
		var hours = argumentsList[3];
		var minutes = argumentsList[4];
		var seconds = argumentsList[5];
		var ms = argumentsList[6];
		var obj = VMObject(CLASSID_Date);
		obj.Prototype = builtin_Date_prototype;
		obj.Extensible = true;
		var y = ToNumber(year);
		var m = ToNumber(month);
		if (argumentsList.length >= 3) {
			var dt = ToNumber(date);
		}
		else {
			var dt = 1;
		}
		if (argumentsList.length >= 4) {
			var h = ToNumber(hours);
		}
		else {
			var h = 0;
		}
		if (argumentsList.length >= 5) {
			var min = ToNumber(minutes);
		}
		else {
			var min = 0;
		}
		if (argumentsList.length >= 6) {
			var s = ToNumber(seconds);
		}
		else {
			var s = 0;
		}
		if (argumentsList.length >= 7) {
			var milli = ToNumber(ms);
		}
		else {
			var milli = 0;
		}
		if (isNaN(y) === false && (0 <= ToInteger(y)) && (ToInteger(y) <= 99)) {
			var yr = 1900 + ToInteger(y);
		}
		else {
			var yr = y;
		}
		var finalDate = MakeDate(MakeDay(yr, m, dt), MakeTime(h, min, s, milli));
		obj.PrimitiveValue = TimeClip(UTC(finalDate));
		return obj;
	}
	if (argumentsList.length === 1) {
		var value = argumentsList[0];
		var obj = VMObject(CLASSID_Date);
		obj.Prototype = builtin_Date_prototype;
		obj.Extensible = true;
		var v = ToPrimitive(value);
		if (Type(v) === TYPE_String) {
			var V = Date_parse(undefined, [ v ]);
		}
		else {
			var V = ToNumber(v);
		}
		obj.PrimitiveValue = TimeClip(V);
		return obj;
	}
	var obj = VMObject(CLASSID_Date);
	obj.Prototype = builtin_Date_prototype;
	obj.Extensible = true;
	obj.PrimitiveValue = Date_now();
	return obj;
}

function Date_parse(thisValue, argumentsList) {
	var string = argumentsList[0];
	var s = ToString(string);
	var i = 0;
	var y = NaN;
	var m = 0;
	var d = 1;
	var h = 0;
	var min = 0;
	var sec = 0;
	var ms = 0;
	parseDate();
	if (isNaN(y) || isNaN(m) || isNaN(d)) {
		return NaN;
	}
	if (s[i] === 'T' || s[i] === ' ') {
		i++;
		parseTime();
		if (isNaN(h) || isNaN(min) || isNaN(sec) || isNaN(ms)) {
			return NaN;
		}
	}
	if (s[i] === ' ') {
		i++;
	}
	var TZstr = s.substring(i);
	if (TZstr === LocalTZAString) {
		var tza = LocalTZA;
	}
	else if (TZstr === "" || TZstr === "Z" || TZstr === "UTC" || TZstr === "GMT") {
		var tza = 0;
	}
	else {
		return NaN;
	}
	return TimeClip(MakeDate(MakeDay(y, m, d), MakeTime(h, min, sec, ms)) - tza);

	function parseDate() {
		if (s[i] === '+') {
			i++;
			y = parseDigits(6);
		}
		else if (s[i] === '-') {
			i++;
			y = -parseDigits(6);
		}
		else {
			y = parseDigits(4);
		}
		if (s[i] !== '-') {
			return;
		}
		i++;
		m = parseDigits(2) - 1;
		if (s[i] !== '-') {
			return;
		}
		i++;
		d = parseDigits(2);
	}

	function parseTime() {
		h = parseDigits(2);
		if (s[i] !== ':') {
			return;
		}
		i++;
		min = parseDigits(2);
		if (s[i] !== ':') {
			return;
		}
		i++;
		sec = parseDigits(2);
		if (s[i] !== '.') {
			return;
		}
		ms = parseDigits(3);
	}

	function parseDigits(n) {
		var x = 0;
		while (n-- > 0) {
			if (!isDecimalDigitChar(s[i])) return NaN;
			x = x * 10 + mvDigitChar(s[i]);
			i++;
		}
		return x;
	}
}

function Date_UTC(thisValue, argumentsList) {
	var year = argumentsList[0];
	var month = argumentsList[1];
	var date = argumentsList[2];
	var hours = argumentsList[3];
	var minutes = argumentsList[4];
	var seconds = argumentsList[5];
	var ms = argumentsList[6];
	var y = ToNumber(year);
	var m = ToNumber(month);
	if (argumentsList.length >= 3) {
		var dt = ToNumber(date);
	}
	else {
		var dt = 1;
	}
	if (argumentsList.length >= 4) {
		var h = ToNumber(hours);
	}
	else {
		var h = 0;
	}
	if (argumentsList.length >= 5) {
		var min = ToNumber(minutes);
	}
	else {
		var min = 0;
	}
	if (argumentsList.length >= 6) {
		var s = ToNumber(seconds);
	}
	else {
		var s = 0;
	}
	if (argumentsList.length >= 7) {
		var milli = ToNumber(ms);
	}
	else {
		var milli = 0;
	}
	if (isNaN(y) === false && (0 <= ToInteger(y)) && (ToInteger(y) <= 99)) {
		var yr = 1900 + ToInteger(y);
	}
	else {
		var yr = y;
	}
	return TimeClip(MakeDate(MakeDay(yr, m, dt), MakeTime(h, min, s, milli)));
}

function Date_now(thisValue, argumentsList) {
	return IOManager_date_now(); // for deterministic behavior
}

function Date_prototype_toString(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	return toISODateString(t) + " " + toISOTimeString(t) + " " + LocalTZAString;
}

function Date_prototype_toDateString(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	return toISODateString(t);
}

function Date_prototype_toTimeString(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	return toISOTimeString(t);
}

function Date_prototype_toLocaleString(thisValue, argumentsList) {
	return Date_prototype_toString(thisValue, argumentsList);
}

function Date_prototype_toLocaleDateString(thisValue, argumentsList) {
	return Date_prototype_toDateString(thisValue, argumentsList);
}

function Date_prototype_toLocaleTimeString(thisValue, argumentsList) {
	return Date_prototype_toTimeString(thisValue, argumentsList);
}

function Date_prototype_valueOf(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Date") throw VMTypeError();
	return thisValue.PrimitiveValue;
}

function Date_prototype_getTime(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	return thisTimeValue;
}

function Date_prototype_getFullYear(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return YearFromTime(LocalTime(t));
}

function Date_prototype_getUTCFullYear(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return YearFromTime(t);
}

function Date_prototype_getMonth(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return MonthFromTime(LocalTime(t));
}

function Date_prototype_getUTCMonth(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return MonthFromTime(t);
}

function Date_prototype_getDate(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return DateFromTime(LocalTime(t));
}

function Date_prototype_getUTCDate(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return DateFromTime(t);
}

function Date_prototype_getDay(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return WeekDay(LocalTime(t));
}

function Date_prototype_getUTCDay(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return WeekDay(t);
}

function Date_prototype_getHours(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return HourFromTime(LocalTime(t));
}

function Date_prototype_getUTCHours(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return HourFromTime(t);
}

function Date_prototype_getMinutes(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return MinFromTime(LocalTime(t));
}

function Date_prototype_getUTCMinutes(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return MinFromTime(t);
}

function Date_prototype_getSeconds(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return SecFromTime(LocalTime(t));
}

function Date_prototype_getUTCSeconds(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return SecFromTime(t);
}

function Date_prototype_getMilliseconds(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return msFromTime(LocalTime(t));
}

function Date_prototype_getUTCMilliseconds(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return msFromTime(t);
}

function Date_prototype_getTimezoneOffset(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return (t - LocalTime(t)) / msPerMinute;
}

function Date_prototype_setTime(thisValue, argumentsList) {
	var time = argumentsList[0];
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Date") throw VMTypeError();
	var v = TimeClip(ToNumber(time));
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_setMilliseconds(thisValue, argumentsList) {
	var ms = argumentsList[0];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	var time = MakeTime(HourFromTime(t), MinFromTime(t), SecFromTime(t), ToNumber(ms));
	var u = TimeClip(UTC(MakeDate(Day(t), time)));
	thisValue.PrimitiveValue = u;
	return u;
}

function Date_prototype_setUTCMilliseconds(thisValue, argumentsList) {
	var ms = argumentsList[0];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	var time = MakeTime(HourFromTime(t), MinFromTime(t), SecFromTime(t), ToNumber(ms));
	var v = TimeClip(MakeDate(Day(t), time));
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_setSeconds(thisValue, argumentsList) {
	var sec = argumentsList[0];
	var ms = argumentsList[1];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	var s = ToNumber(sec);
	if (argumentsList.length < 2) {
		var milli = msFromTime(t);
	}
	else {
		var milli = ToNumber(ms);
	}
	var date = MakeDate(Day(t), MakeTime(HourFromTime(t), MinFromTime(t), s, milli));
	var u = TimeClip(UTC(date));
	thisValue.PrimitiveValue = u;
	return u;
}

function Date_prototype_setUTCSeconds(thisValue, argumentsList) {
	var sec = argumentsList[0];
	var ms = argumentsList[1];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	var s = ToNumber(sec);
	if (argumentsList.length < 2) {
		var milli = msFromTime(t);
	}
	else {
		var milli = ToNumber(ms);
	}
	var date = MakeDate(Day(t), MakeTime(HourFromTime(t), MinFromTime(t), s, milli));
	var v = TimeClip(date);
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_setMinutes(thisValue, argumentsList) {
	var min = argumentsList[0];
	var sec = argumentsList[1];
	var ms = argumentsList[2];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	var m = ToNumber(min);
	if (argumentsList.length < 2) {
		var s = SecFromTime(t);
	}
	else {
		var s = ToNumber(sec);
	}
	if (argumentsList.length < 3) {
		var milli = msFromTime(t);
	}
	else {
		var milli = ToNumber(ms);
	}
	var date = MakeDate(Day(t), MakeTime(HourFromTime(t), m, s, milli));
	var u = TimeClip(UTC(date));
	thisValue.PrimitiveValue = u;
	return u;
}

function Date_prototype_setUTCMinutes(thisValue, argumentsList) {
	var min = argumentsList[0];
	var sec = argumentsList[1];
	var ms = argumentsList[2];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	var m = ToNumber(min);
	if (argumentsList.length < 2) {
		var s = SecFromTime(t);
	}
	else {
		var s = ToNumber(sec);
	}
	if (argumentsList.length < 3) {
		var milli = msFromTime(t);
	}
	else {
		var milli = ToNumber(ms);
	}
	var date = MakeDate(Day(t), MakeTime(HourFromTime(t), m, s, milli));
	var v = TimeClip(date);
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_setHours(thisValue, argumentsList) {
	var hour = argumentsList[0];
	var min = argumentsList[1];
	var sec = argumentsList[2];
	var ms = argumentsList[3];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	var h = ToNumber(hour);
	if (argumentsList.length < 2) {
		var m = MinFromTime(t);
	}
	else {
		var m = ToNumber(min);
	}
	if (argumentsList.length < 3) {
		var s = SecFromTime(t);
	}
	else {
		var s = ToNumber(sec);
	}
	if (argumentsList.length < 4) {
		var milli = msFromTime(t);
	}
	else {
		var milli = ToNumber(ms);
	}
	var date = MakeDate(Day(t), MakeTime(h, m, s, milli));
	var u = TimeClip(UTC(date));
	thisValue.PrimitiveValue = u;
	return u;
}

function Date_prototype_setUTCHours(thisValue, argumentsList) {
	var hour = argumentsList[0];
	var min = argumentsList[1];
	var sec = argumentsList[2];
	var ms = argumentsList[3];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	var h = ToNumber(hour);
	if (argumentsList.length < 2) {
		var m = MinFromTime(t);
	}
	else {
		var m = ToNumber(min);
	}
	if (argumentsList.length < 3) {
		var s = SecFromTime(t);
	}
	else {
		var s = ToNumber(sec);
	}
	if (argumentsList.length < 4) {
		var milli = msFromTime(t);
	}
	else {
		var milli = ToNumber(ms);
	}
	var date = MakeDate(Day(t), MakeTime(h, m, s, milli));
	var v = TimeClip(date);
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_setDate(thisValue, argumentsList) {
	var date = argumentsList[0];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	var dt = ToNumber(date);
	var newDate = MakeDate(MakeDay(YearFromTime(t), MonthFromTime(t), dt), TimeWithinDay(t));
	var u = TimeClip(UTC(newDate));
	thisValue.PrimitiveValue = u;
	return u;
}

function Date_prototype_setUTCDate(thisValue, argumentsList) {
	var date = argumentsList[0];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	var dt = ToNumber(date);
	var newDate = MakeDate(MakeDay(YearFromTime(t), MonthFromTime(t), dt), TimeWithinDay(t));
	var v = TimeClip(newDate);
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_setMonth(thisValue, argumentsList) {
	var month = argumentsList[0];
	var date = argumentsList[1];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = LocalTime(thisTimeValue);
	var m = ToNumber(month);
	if (argumentsList.length < 2) {
		var dt = DateFromTime(t);
	}
	else {
		var dt = ToNumber(date);
	}
	var newDate = MakeDate(MakeDay(YearFromTime(t), m, dt), TimeWithinDay(t));
	var u = TimeClip(UTC(newDate));
	thisValue.PrimitiveValue = u;
	return u;
}

function Date_prototype_setUTCMonth(thisValue, argumentsList) {
	var month = argumentsList[0];
	var date = argumentsList[1];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	var m = ToNumber(month);
	if (argumentsList.length < 2) {
		var dt = DateFromTime(t);
	}
	else {
		var dt = ToNumber(date);
	}
	var newDate = MakeDate(MakeDay(YearFromTime(t), m, dt), TimeWithinDay(t));
	var v = TimeClip(newDate);
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_setFullYear(thisValue, argumentsList) {
	var year = argumentsList[0];
	var month = argumentsList[1];
	var date = argumentsList[2];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	if (isNaN(thisTimeValue) === false) {
		var t = LocalTime(thisTimeValue);
	}
	else {
		var t = 0;
	}
	var y = ToNumber(year);
	if (argumentsList.length < 2) {
		var m = MonthFromTime(t);
	}
	else {
		var m = ToNumber(month);
	}
	if (argumentsList.length < 3) {
		var dt = DateFromTime(t);
	}
	else {
		var dt = ToNumber(date);
	}
	var newDate = MakeDate(MakeDay(y, m, dt), TimeWithinDay(t));
	var u = TimeClip(UTC(newDate));
	thisValue.PrimitiveValue = u;
	return u;
}

function Date_prototype_setUTCFullYear(thisValue, argumentsList) {
	var year = argumentsList[0];
	var month = argumentsList[1];
	var date = argumentsList[2];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	if (isNaN(thisTimeValue) === false) {
		var t = thisTimeValue;
	}
	else {
		var t = 0;
	}
	var y = ToNumber(year);
	if (argumentsList.length < 2) {
		var m = MonthFromTime(t);
	}
	else {
		var m = ToNumber(month);
	}
	if (argumentsList.length < 3) {
		var dt = DateFromTime(t);
	}
	else {
		var dt = ToNumber(date);
	}
	var newDate = MakeDate(MakeDay(y, m, dt), TimeWithinDay(t));
	var v = TimeClip(newDate);
	thisValue.PrimitiveValue = v;
	return v;
}

function Date_prototype_toUTCString(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isFinite(t) === false) throw VMRangeError();
	return toISODateString(t) + " " + toISOTimeString(t) + " UTC";
}

function Date_prototype_toISOString(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isFinite(t) === false) throw VMRangeError();
	return toISODateString(t) + "T" + toISOTimeString(t) + "." + formatNumber(msFromTime(t), 3) + "Z";
}

function Date_prototype_toJSON(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var tv = ToPrimitive(O, TYPE_Number);
	if (Type(tv) === TYPE_Number && isFinite(tv) === false) return null;
	var toISO = O.Get("toISOString");
	if (IsCallable(toISO) === false) throw VMTypeError();
	return toISO.Call(O, []);
}

function Date_prototype_getYear(thisValue, argumentsList) {
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	var t = thisTimeValue;
	if (isNaN(t)) return NaN;
	return YearFromTime(LocalTime(t)) - 1900;
}

function Date_prototype_setYear(thisValue, argumentsList) {
	var year = argumentsList[0];
	var thisTimeValue = Date_prototype_valueOf(thisValue);
	if (isNaN(thisTimeValue) === false) {
		var t = LocalTime(thisTimeValue);
	}
	else {
		var t = 0;
	}
	var Result2 = ToNumber(year);
	if (isNaN(Result2)) {
		thisValue.PrimitiveValue = NaN;
		return NaN;
	}
	if (0 <= ToInteger(Result2) && ToInteger(Result2) <= 99) {
		var Result4 = ToInteger(Result2) + 1900;
	}
	else {
		var Result4 = Result2;
	}
	var Result5 = MakeDay(Result4, MonthFromTime(t), DateFromTime(t));
	var Result6 = UTC(MakeDate(Result5, TimeWithinDay(t)));
	thisValue.PrimitiveValue = TimeClip(Result6);
	return thisValue.PrimitiveValue;
}
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

// ECMAScript 5.1: 15.11 Error Objects

function Error_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_Error_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function Error_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_Error_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function Error_prototype_toString(thisValue, argumentsList) {
	var O = thisValue;
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var name = O.Get("name");
	if (name === undefined) {
		var name = "Error";
	}
	else {
		var name = ToString(name);
	}
	var msg = O.Get("message");
	if (msg === undefined) {
		var msg = "";
	}
	else {
		var msg = ToString(msg);
	}
	if (msg === undefined) {
		var msg = "";
	}
	else {
		var msg = ToString(msg);
	}
	if (name === "") return msg;
	if (msg === "") return name;
	return name + ": " + msg;
}

function EvalError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_EvalError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function EvalError_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_EvalError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function RangeError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_RangeError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function RangeError_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_RangeError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function ReferenceError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_ReferenceError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function ReferenceError_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_ReferenceError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function SyntaxError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_SyntaxError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function SyntaxError_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_SyntaxError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function TypeError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_TypeError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function TypeError_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_TypeError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function URIError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_URIError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function URIError_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_URIError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function VMRangeError(message) {
	return RangeError_Construct([ message ]);
}

function VMReferenceError(message) {
	return ReferenceError_Construct([ message ]);
}

function VMSyntaxError(message) {
	return SyntaxError_Construct([ message ]);
}

function VMTypeError(message) {
	return TypeError_Construct([ message ]);
}

function VMURIError(message) {
	return URIError_Construct([ message ]);
}

function get_Error_prototype_stack(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "Error") throw VMTypeError();
	var stackTrace = thisValue.stackTrace;
	var A = [];
	A[0] = Error_prototype_toString(thisValue, []);
	for (var i = 0; i < stackTrace.length; i++) {
		A[i + 1] = theParser.locateDebugInfo(stackTrace[i]);
	}
	return A.join("\n    at ");
}
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

// ECMAScript 5.1: 15.3 Function Objects

function Function_Call(thisValue, argumentsList) {
	return Function_Construct(argumentsList);
}

function Function_Construct(argumentsList) {
	var argCount = argumentsList.length;
	var P = "";
	if (argCount === 0) {
		var body = "";
	}
	else if (argCount === 1) {
		var body = argumentsList[0];
	}
	else {
		var firstArg = argumentsList[0];
		var P = ToString(firstArg);
		var k = 2;
		while (k < argCount) {
			var nextArg = argumentsList[k - 1];
			var P = P + "," + ToString(nextArg);
			k++;
		}
		var body = argumentsList[k - 1];
	}
	var body = ToString(body);
	var parameters = theParser.readFunctionParameters(P);
	var body = theParser.readFunctionCode(body, parameters, [], "<anonymous>");
	return FunctionObject(parameters, body, theGlobalEnvironment, body.strict);
}

function Function_prototype_toString(thisValue, argumentsList) {
	var func = thisValue;
	if (IsCallable(func) === false) throw VMTypeError();
	while (func.ClassID === CLASSID_BindFunction) {
		func = func.TargetFunction;
	}
	if (func.ClassID === CLASSID_BuiltinFunction) {
		return "function " + getIntrinsicFunctionName(func.Call) + "{ native }";
	}
	assert(func.ClassID === CLASSID_FunctionObject);
	var param = func.FormalParameters;
	var name = func.Code.name;
	var startPos = func.Code.startPos;
	var endPos = func.Code.endPos;
	var source = func.Code.sourceObject.source;
	var codeText = source.substring(startPos, endPos);
	return "function " + name + "(" + param + "){" + codeText + "}";
}

function Function_prototype_apply(thisValue, argumentsList) {

	var func = thisValue;
	var thisArg = argumentsList[0];
	var argArray = argumentsList[1];
	if (IsCallable(func) === false) throw VMTypeError();
	if (argArray === null || argArray === undefined) return func.Call(thisArg, []);
	if (Type(argArray) !== TYPE_Object) throw VMTypeError();
	var len = argArray.Get("length");
	var n = ToUint32(len);
	var argList = [];
	var index = 0;
	while (index < n) {
		var indexName = ToString(index);
		var nextArg = argArray.Get(indexName);
		argList.push(nextArg);
		index = index + 1;
	}
	return func.Call(thisArg, argList);
}

function Function_prototype_call(thisValue, argumentsList) {
	var func = thisValue;
	var thisArg = argumentsList[0];
	if (IsCallable(func) === false) throw VMTypeError();
	var argList = [];
	if (argumentsList.length > 1) {
		for (var i = 1; i < argumentsList.length; i++) {
			argList.push(argumentsList[i]);
		}
	}
	return func.Call(thisArg, argList);
}

function Function_prototype_bind(thisValue, argumentsList) {
	var thisArg = argumentsList[0];
	var Target = thisValue;
	if (IsCallable(Target) === false) throw VMTypeError();
	var A = [];
	for (var i = 1; i < argumentsList.length; i++) {
		A.push(argumentsList[i]);
	}
	var F = VMObject(CLASSID_BindFunction);
	F.TargetFunction = Target;
	F.BoundThis = thisArg;
	F.BoundArgs = A;
	F.Prototype = builtin_Function_prototype;
	if (Target.Class === "Function") {
		var L = Target.Get("length") - A.length;
		defineFinal(F, "length", max(0, L));
	}
	else {
		defineFinal(F, "length", 0);
	}
	F.Extensible = true;
	var thrower = theThrowTypeError;
	F.DefineOwnProperty("caller", PropertyDescriptor({
		Get : thrower,
		Set : thrower,
		Enumerable : false,
		Configurable : false
	}), false);
	F.DefineOwnProperty("arguments", PropertyDescriptor({
		Get : thrower,
		Set : thrower,
		Enumerable : false,
		Configurable : false
	}), false);
	return F;
}

function BindFunction_Call(thisValue, argumentsList) {
	var F = this;
	var ExtraArgs = argumentsList;
	var boundArgs = F.BoundArgs;
	var boundThis = F.BoundThis;
	var target = F.TargetFunction;
	var args = boundArgs.concat(ExtraArgs);
	return target.Call(boundThis, args);
}

function BindFunction_Construct(argumentsList) {
	var F = this;
	var ExtraArgs = argumentsList;
	var target = F.TargetFunction;
	if (target.Construct === undefined) throw VMTypeError();
	var boundArgs = F.BoundArgs;
	var args = boundArgs.concat(ExtraArgs);
	return target.Construct(args);
}

function BindFunction_HasInstance(V) {
	var F = this;
	var target = F.TargetFunction;
	if (target.HasInstance === undefined) throw VMTypeError();
	return target.HasInstance(V);
}

function FunctionObject_Get(P) {
	var F = this;
	var v = default_Get.call(F, P);
	if (P === "caller" && Type(v) === TYPE_Object && v.Class === "Function" && v.Code !== undefined && v.Code.strict) throw VMTypeError();
	return v;
}

function FunctionObject_HasInstance(V) {
	var F = this;
	if (Type(V) !== TYPE_Object) return false;
	var O = F.Get("prototype");
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	while (true) {
		var V = V.Prototype;
		if (V === null) return false;
		if (O === V) return true;
	}
}

function Function_prototype_scheduleAsMicrotask(thisValue, argumentsList) {
	var callback = thisValue;
	var thisArg = argumentsList[0];
	if (IsCallable(callback) === false) throw VMTypeError();
	scheduleMicrotask(callback, argumentsList);
}/*
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

// ECMAScript 5.1: 15.1 The Global Object

function Global_eval(thisValue, argumentsList, direct, strict) {
	var x = argumentsList[0];
	if (Type(x) !== TYPE_String) return x;
	var prog = theParser.readProgram(x, strict, [], "<anonymous>");
	prog.isEvalCode = true;
	enterExecutionContextForEvalCode(prog, direct);
	var result = prog.evaluate();
	exitExecutionContext();
	if (result.type === "normal" && result.value === empty) return undefined;
	if (result.type === "normal") return result.value;
	assertEquals(result.type, "throw", result);
	throw result.value;
}

function Global_evaluateProgram(thisValue, argumentsList) {
	var x = argumentsList[0];
	var filename = ToString(argumentsList[1]);
	if (Type(x) !== TYPE_String) return x;
	var prog = theParser.readProgram(x, false, [], filename);
	enterExecutionContextForGlobalCode(prog);
	var result = prog.evaluate();
	exitExecutionContext();
	if (result.type === "normal" && result.value === empty) return undefined;
	if (result.type === "normal") return result.value;
	assertEquals(result.type, "throw", result);
	throw result.value;
}

function Global_parseInt(thisValue, argumentsList) {
	var string = argumentsList[0];
	var radix = argumentsList[1];
	var inputString = ToString(string);
	var i = 0;
	while (i !== inputString.length && (isWhiteSpace(inputString[i]) || isLineTerminator(inputString[i]))) {
		i++;
	}
	var S = inputString.substring(i);
	var sign = 1;
	if (S !== "" && S[0] === '-') {
		var sign = -1;
	}
	if (S !== "" && (S[0] === '+' || S[0] === '-')) {
		S = S.substring(1);
	}
	var R = ToInt32(radix);
	var stripPrefix = true;
	if (R !== 0) {
		if ((R < 2) || (R > 36)) return NaN;
		if (R !== 16) {
			var stripPrefix = false;
		}
	}
	else {
		var R = 10;
	}
	if (stripPrefix === true) {
		if ((S.length >= 2) && (S.substring(0, 2) === "0x" || S.substring(0, 2) === "0X")) {
			S = S.substring(2);
			var R = 16;
		}
	}
	var i = 0;
	while (i !== S.length && (mvDigitChar(S[i]) < R)) {
		i++;
	}
	var Z = S.substring(0, i);
	if (Z === "") return NaN;
	var number = parseInt(Z, R);
	return sign * number;
}

function Global_parseFloat(thisValue, argumentsList) {
	var string = argumentsList[0];
	var inputString = ToString(string);
	var i = 0;
	while (i !== inputString.length && (isWhiteSpace(inputString[i]) || isLineTerminator(inputString[i]))) {
		i++;
	}
	var trimmedString = inputString.substring(i);
	return parseFloat(trimmedString);
}

function Global_isNaN(thisValue, argumentsList) {
	var number = argumentsList[0];
	return isNaN(ToNumber(number));
}

function Global_isFinite(thisValue, argumentsList) {
	var number = argumentsList[0];
	return isFinite(ToNumber(number));
}

function Encode(string, unescapedSet) {
	var strLen = string.length;
	var R = "";
	var k = 0;
	while (true) {
		if (k === strLen) return R;
		var C = string[k];
		if (isIncluded(C, unescapedSet)) {
			var S = C;
			var R = R + S;
		}
		else {
			if ((toCharCode(C) >= 0xDC00) && (toCharCode(C) <= 0xDFFF)) throw VMURIError();
			if ((toCharCode(C) < 0xD800) || (toCharCode(C) > 0xDBFF)) {
				var V = toCharCode(C);
			}
			else {
				k++;
				if (k === strLen) throw VMURIError();
				var kChar = toCharCode(string[k]);
				if ((kChar < 0xDC00) || (kChar > 0xDFFF)) throw VMURIError();
				var V = ((toCharCode(C) - 0xD800) * 0x400 + (kChar - 0xDC00) + 0x10000);
			}
			var Octets = UTF8encode(V);
			var L = Octets.length;
			for (var j = 0; j < L; j++) {
				var jOctet = Octets[j];
				var S = '%' + toUpperDigitChar(jOctet >> 4) + toUpperDigitChar(jOctet & 15);
				var R = R + S;
			}
		}
		k++;
	}
}

function Decode(string, reservedSet) {
	var strLen = string.length;
	var R = "";
	var k = 0;
	while (true) {
		if (k === strLen) return R;
		var C = string[k];
		if (C !== '%') {
			var S = C;
		}
		else {
			var start = k;
			if (k + 2 >= strLen) throw VMURIError();
			if ((isHexDigitChar(string[k + 1]) && isHexDigitChar(string[k + 2])) === false) throw VMURIError();
			var B = (mvDigitChar(string[k + 1]) << 4) + mvDigitChar(string[k + 2]);
			k += 2;
			if ((B & 0x80) === 0) {
				var C = fromCharCode(B);
				if (isIncluded(C, reservedSet) === false) {
					var S = C;
				}
				else {
					var S = string.substring(start, k + 1);
				}
			}
			else {
				var n = 0;
				while (((B << n) & 0x80) !== 0) {
					n++;
				}
				if (n === 1 || (n > 4)) throw VMURIError();
				var Octets = [];
				Octets[0] = B;
				if (k + (3 * (n - 1)) >= strLen) throw VMURIError();
				for (var j = 1; j < n; j++) {
					k++;
					if (string[k] !== '%') throw VMURIError();
					if ((isHexDigitChar(string[k + 1]) && isHexDigitChar(string[k + 2])) === false) throw VMURIError();
					var B = (mvDigitChar(string[k + 1]) << 4) + mvDigitChar(string[k + 2]);
					if ((B & 0xC0) !== 0x80) throw VMURIError();
					k += 2;
					Octets[j] = B;
				}
				var V = UTF8decode(Octets);
				if (V < 0x10000) {
					var C = fromCharCode(V);
					if (isIncluded(C, reservedSet) === false) {
						var S = C;
					}
					else {
						var S = string.substring(start, k + 1);
					}
				}
				else {
					var L = (((V - 0x10000) & 0x3FF) + 0xDC00);
					var H = ((((V - 0x10000) >> 10) & 0x3FF) + 0xD800);
					var S = fromCharCode(H) + fromCharCode(L);
				}
			}
		}
		var R = R + S;
		k++;
	}
}

function UTF8encode(V) {
	var Octets = [];
	if (V <= 0x007F) {
		Octets[0] = V;
	}
	else if (V <= 0x07FF) {
		Octets[0] = 0xC0 + ((V >> 6) & 0x1F);
		Octets[1] = 0x80 + (V & 0x3F);
	}
	else if (V <= 0xFFFF) {
		Octets[0] = 0xE0 + ((V >> 12) & 0x1F);
		Octets[1] = 0x80 + ((V >> 6) & 0x3F);
		Octets[2] = 0x80 + (V & 0x3F);
	}
	else {
		Octets[0] = 0xF0 + ((V >> 18) & 0x07);
		Octets[1] = 0x80 + ((V >> 12) & 0x3F);
		Octets[2] = 0x80 + ((V >> 6) & 0x3F);
		Octets[3] = 0x80 + (V & 0x3F);
	}
	return Octets;
}

function UTF8decode(Octets) {
	var len = Octets.length;
	if (len === 2) {
		var V = ((Octets[0] & 0x1F) << 6) + (Octets[1] & 0x3F);
		if (V <= 0x007F) throw VMURIError();
	}
	else if (len === 3) {
		var V = ((Octets[0] & 0x0F) << 12) + ((Octets[1] & 0x3F) << 6) + (Octets[2] & 0x3F);
		if ((V <= 0x07FF) || ((0xD800 <= V) && (V <= 0xDFFF))) throw VMURIError();
	}
	else {
		var V = ((Octets[0] & 0x07) << 18) + ((Octets[1] & 0x3F) << 12) + ((Octets[2] & 0x3F) << 6) + (Octets[3] & 0x3F);
		if ((V <= 0xFFFF) || (0x110000 <= V)) throw VMURIError();
	}
	return V;
}

function Global_decodeURI(thisValue, argumentsList) {
	var encodedURI = argumentsList[0];
	var uriString = ToString(encodedURI);
	var reservedURISet = ";/?:@&=+$,#";
	return Decode(uriString, reservedURISet);
}

function Global_decodeURIComponent(thisValue, argumentsList) {
	var encodedURIComponent = argumentsList[0];
	var componentString = ToString(encodedURIComponent);
	var reservedURIComponentSet = "";
	return Decode(componentString, reservedURIComponentSet);
}

function Global_encodeURI(thisValue, argumentsList) {
	var uri = argumentsList[0];
	var uriString = ToString(uri);
	var unescapedURISet = ";/?:@&=+$,abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.!~*'()#";
	return Encode(uriString, unescapedURISet);
}

function Global_encodeURIComponent(thisValue, argumentsList) {
	var uriComponent = argumentsList[0];
	var componentString = ToString(uriComponent);
	var unescapedURIComponentSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.!~*'()";
	return Encode(componentString, unescapedURIComponentSet);
}

function Global_escape(thisValue, argumentsList) {
	var string = argumentsList[0];
	var Result1 = ToString(string);
	var Result2 = Result1.length;
	var R = [];
	var k = 0;
	while (true) {
		if (k === Result2) return join(R);
		var Result6 = Result1[k];
		if (!isIncluded(Result6, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./")) {
			var x = toCharCode(Result6);
			if (x >= 256) {
				var S = "%u" + toDigitChar(x >> 12) + toDigitChar((x >> 8) & 15) + toDigitChar((x >> 4) & 15) + toDigitChar(x & 15);
			}
			else {
				var S = "%" + toDigitChar(x >> 4) + toDigitChar(x & 15);
			}
		}
		else {
			var S = Result6;
		}
		R.push(S);
		k++;
	}
}

function Global_unescape(thisValue, argumentsList) {
	var string = argumentsList[0];
	var Result1 = ToString(string);
	var Result2 = Result1.length;
	var R = [];
	var k = 0;
	while (true) {
		if (k === Result2) return join(R);
		var c = Result1[k];
		if (c === '%') {
			if ((k <= Result2 - 6) && Result1[k + 1] === 'u' && isHexDigitChar(Result1[k + 2]) && isHexDigitChar(Result1[k + 3])
					&& isHexDigitChar(Result1[k + 4]) && isHexDigitChar(Result1[k + 5])) {
				var c = fromCharCode((mvDigitChar(Result1[k + 2]) << 12) + (mvDigitChar(Result1[k + 3]) << 8)
						+ (mvDigitChar(Result1[k + 4]) << 4) + mvDigitChar(Result1[k + 5]));
				k += 5;
			}
			else if ((k <= Result2 - 3) && isHexDigitChar(Result1[k + 1]) && isHexDigitChar(Result1[k + 2])) {
				var c = fromCharCode((mvDigitChar(Result1[k + 1]) << 4) + mvDigitChar(Result1[k + 2]));
				k += 2;
			}
		}
		R.push(c);
		k++;
	}
}/*
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

function IOPort_Call(thisValue, argumentsList) {
	return IOPort_Construct(argumentsList);
}

function IOPort_Construct(argumentsList) {
	var name = ToString(argumentsList[0]);
	var port = VMObject(CLASSID_IOPort);
	port.Prototype = builtin_IOPort_prototype;
	port.Extensible = true;
	defineFinal(port, "name", name);
	IOManager_bindPort(port, name);
	return port;
}

function IOPort_prototype_open(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var args = IOPort_unwrapArgs(argumentsList, 0, 0);
	var root = thisValue;
	var port = VMObject(CLASSID_IOPort);
	port.Prototype = builtin_IOPort_prototype;
	port.Extensible = true;
	IOManager_openPort(port, root, args);
	return port;
}

function IOPort_prototype_syncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var port = thisValue;
	var name = ToString(argumentsList[0]);
	var args = IOPort_unwrapArgs(argumentsList, 1, 0);
	var event = IOManager_syncIO(port, name, args);
	if (event.error !== true) {
		return IOPort_wrap(event.value);
	}
	if (event.failure) {
		throw builtin_IOPort.Get(event.failure);
	}
	throw IOPort_wrap(event.value);
}

function IOPort_prototype_asyncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var name = ToString(argumentsList[0]);
	var args = IOPort_unwrapArgs(argumentsList, 1, 1);
	var callback = argumentsList[argumentsList.length - 1];
	if (IsCallable(callback) === false) throw VMTypeError();
	var port = thisValue;
	return IOManager_asyncIO(port, name, args, callback);
}

function IOPort_asyncIO_completion(event, callback) {
	if (event.failure) {
		scheduleMicrotask(callback, [ builtin_IOPort.Get(event.failure) ]);
	}
	else {
		scheduleMicrotask(callback, [ IOPort_wrap(event.error), IOPort_wrap(event.value) ]);
	}
}

function IOPort_unwrapArgs(A, start, end) {
	assert(A instanceof Array);
	var length = A.length;
	var a = [];
	for (var i = start; i < length - end; i++) {
		a[i - start] = IOPort_unwrap(A[i], []);
	}
	return a;
}

function IOPort_unwrap(A, stack) {
	if (isPrimitiveValue(A)) {
		return A;
	}
	if (isIncluded(A, stack)) throw VMTypeError();
	stack.push(A);
	if (A.Class === "Array") {
		var a = [];
		var length = A.Get("length");
		for (var i = 0; i < length; i++) {
			a[i] = IOPort_unwrap(A.Get(ToString(i)), stack);
		}
	}
	else if (A.Class === "Object") {
		var a = {};
		var next = A.enumerator(false, true);
		var P;
		while ((P = next()) !== undefined) {
			a[P] = IOPort_unwrap(A.Get(P), stack);
		}
	}
	else if (A.Class === "Buffer") {
		var a = A.wrappedBuffer;
	}
	else {
		throw VMTypeError();
	}
	stack.pop();
	return a;
}

function IOPort_wrap(a, stack) {
	// must be compatible with FileOutputStream.writeAny
	// i.e. IOPort_wrap == IOPort_wrap ○ readAny ○ writeAny
	if (isPrimitiveValue(a)) {
		return a;
	}
	if (stack === undefined) stack = [];
	if (isIncluded(a, stack)) return null;
	stack.push(a);
	if (a instanceof Buffer) {
		var A = VMObject(CLASSID_Buffer);
		A.Prototype = builtin_Buffer_prototype;
		A.Extensible = true;
		A.wrappedBuffer = a;
		defineFinal(A, "length", a.length);
		defineFinal(A, "parent", A);
	}
	else if (a instanceof Array) {
		var length = a.length;
		var A = Array_Construct([ length ]);
		for (var i = 0; i < length; i++) {
			A.Put(ToString(i), IOPort_wrap(a[i], stack), false);
		}
	}
	else {
		var A = Object_Construct([]);
		var keys = Object.keys(a);
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			var P = keys[i];
			A.Put(P, IOPort_wrap(a[P], stack), false);
		}
	}
	stack.pop();
	return A;
}
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

// ECMAScript 5.1: 15.12 The JSON Object

function JSON_parse(thisValue, argumentsList) {
	var text = argumentsList[0];
	var reviver = argumentsList[1];
	var JText = ToString(text);
	var unfiltered = theJSONParser.readJSONText(JText);
	if (IsCallable(reviver) === true) {
		var root = Object_Construct([]);
		root.DefineOwnProperty("", PropertyDescriptor({
			Value : unfiltered,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		return Walk(root, "");
	}
	else return unfiltered;

	function Walk(holder, name) {
		var val = holder.Get(name);
		if (Type(val) === TYPE_Object) {
			if (val.Class === "Array") {
				var I = 0;
				var len = val.Get("length");
				while (I < len) {
					var newElement = Walk(val, ToString(I));
					if (newElement === undefined) {
						val.Delete(ToString(I), false);
					}
					else {
						val.DefineOwnProperty(ToString(I), PropertyDescriptor({
							Value : newElement,
							Writable : true,
							Enumerable : true,
							Configurable : true
						}), false);
					}
					I++;
				}
			}
			else {
				var keys = [];
				var next = val.enumerator(true, true);
				var P;
				while ((P = next()) !== undefined) {
					keys.push(P);
				}
				for (var i = 0; i < keys.length; i++) {
					var P = keys[i];
					var newElement = Walk(val, P);
					if (newElement === undefined) {
						val.Delete(P, false);
					}
					else {
						val.DefineOwnProperty(P, PropertyDescriptor({
							Value : newElement,
							Writable : true,
							Enumerable : true,
							Configurable : true
						}), false);
					}
				}
			}
		}
		return reviver.Call(holder, [ name, val ]);
	}
}

var theJSONParser = JSONParser();

function JSONParser() {
	return preventExtensions({
		readJSONText : readJSONText,
	});

	var source;
	var current;
	var currentPos;

	function readJSONText(text) {
		source = text;
		currentPos = 0;
		current = source[0];
		skipJSONWhiteSpaces();
		var value = readJSONValue();
		skipJSONWhiteSpaces();
		if (current !== undefined) throw VMSyntaxError();
		return value;
	}

	function readJSONValue() {
		if (current === 'n') return readJSONNullLiteral();
		else if (current === 't' || current === 'f') return readJSONBooleanLiteral();
		else if (current === '{') return readJSONObject();
		else if (current === '[') return readJSONArray();
		else if (current === '"') return readJSONString();
		return readJSONNumber();
	}

	function readJSONObject() {
		var obj = Object_Construct([]);
		expecting('{');
		skipJSONWhiteSpaces();
		if (current === '}') {
			proceed();
			return obj;
		}
		while (true) {
			skipJSONWhiteSpaces();
			var key = readJSONString();
			skipJSONWhiteSpaces();
			expecting(':');
			skipJSONWhiteSpaces();
			var value = readJSONValue();
			var desc = PropertyDescriptor({
				Value : value,
				Writable : true,
				Enumerable : true,
				Configurable : true
			});
			obj.DefineOwnProperty(key, desc, false);
			skipJSONWhiteSpaces();
			if (current === '}') {
				proceed();
				return obj;
			}
			expecting(',');
		}
	}

	function readJSONArray() {
		var obj = Array_Construct([]);
		expecting('[');
		skipJSONWhiteSpaces();
		if (current === ']') {
			proceed();
			return obj;
		}
		var index = 0;
		while (true) {
			skipJSONWhiteSpaces();
			var value = readJSONValue();
			var desc = PropertyDescriptor({
				Value : value,
				Writable : true,
				Enumerable : true,
				Configurable : true
			});
			obj.DefineOwnProperty(ToString(index), desc, false);
			index++;
			skipJSONWhiteSpaces();
			if (current === ']') {
				proceed();
				return obj;
			}
			expecting(',');
		}
	}

	function readJSONString() {
		expecting('"');
		var buffer = [];
		while (true) {
			if (current === undefined) throw VMSyntaxError();
			else if (current === '"') {
				proceed();
				return join(buffer);
			}
			else if (current === '\\') {
				var c = readJSONEscapeSequence();
				buffer.push(c);
			}
			else if (toCharCode(current) <= 0x001F) throw VMSyntaxError();
			else {
				buffer.push(current);
				proceed();
			}
		}
	}

	function readJSONEscapeSequence() {
		expecting('\\');
		var c = proceed();
		switch (c) {
		case '"':
		case '/':
		case '\\':
			return c;
		case 'b':
			return '\u0008';
		case 'f':
			return '\u000C';
		case 'n':
			return '\u000A';
		case 'r':
			return '\u000D';
		case 't':
			return '\u0009';
		case 'u':
			var x = 0;
			for (var i = 0; i < 4; i++) {
				if (!isHexDigitChar(current)) throw VMSyntaxError();
				x = (x << 4) + mvDigitChar(current);
				proceed();
			}
			return fromCharCode(x);
		}
		throw VMSyntaxError();
	}

	function readJSONNumber() {
		var startPos = currentPos;
		if (current === '-') {
			proceed();
		}
		if (current === '0') {
			proceed();
			if (isDecimalDigitChar(current)) throw VMSyntaxError();
		}
		else {
			if (!isDecimalDigitChar(current)) throw VMSyntaxError();
			while (isDecimalDigitChar(current)) {
				proceed();
			}
		}
		if (current === '.') {
			proceed();
			while (isDecimalDigitChar(current)) {
				proceed();
			}
		}
		if (current === 'E' || current === 'e') {
			proceed();
			if (current === '+' || current === '-') {
				proceed();
			}
			if (!isDecimalDigitChar(current)) throw VMSyntaxError();
			while (isDecimalDigitChar(current)) {
				proceed();
			}
		}
		if (startPos === currentPos) throw VMSyntaxError();
		return ToNumber(source.substring(startPos, currentPos));
	}

	function readJSONNullLiteral() {
		if (source.substring(currentPos, currentPos + 4) === "null") {
			proceed(4);
			return null;
		}
		throw VMSyntaxError();
	}

	function readJSONBooleanLiteral() {
		if (source.substring(currentPos, currentPos + 4) === "true") {
			proceed(4);
			return true;
		}
		if (source.substring(currentPos, currentPos + 5) === "false") {
			proceed(5);
			return false;
		}
		throw VMSyntaxError();
	}

	function skipJSONWhiteSpaces() {
		while (true) {
			switch (current) {
			case '\u0009': // <TAB>
			case '\u000D': // <CR>
			case '\u000A': // <LF>
			case '\u0020': // <SP>
				proceed();
				break;
			default:
				return;
			}
		}
	}

	function expecting(c) {
		if (c !== current) throw VMSyntaxError();
		proceed();
	}

	function proceed(count) {
		var c = current;
		if (count === undefined) {
			count = 1;
		}
		for (var i = 0; i < count; i++) {
			if (current === undefined) throw VMSyntaxError();
			current = source[++currentPos];
		}
		return c;
	}
}

function JSON_stringify(thisValue, argumentsList) {
	var value = argumentsList[0];
	var replacer = argumentsList[1];
	var space = argumentsList[2];
	var stack = [];
	var indent = "";
	var PropertyList = undefined;
	var ReplacerFunction = undefined;
	if (Type(replacer) === TYPE_Object) {
		if (IsCallable(replacer) === true) {
			var ReplacerFunction = replacer;
		}
		else if (replacer.Class === "Array") {
			var PropertyList = [];
			var length = replacer.Get("length");
			for (var i = 0; i < length; i++) {
				if (replacer.HasOwnProperty(ToString(i)) === false) {
					continue;
				}
				var v = replacer.Get(ToString(i));
				var item = undefined;
				if (Type(v) === TYPE_String) {
					var item = v;
				}
				else if (Type(v) === TYPE_Number) {
					var item = ToString(v);
				}
				else if (Type(v) === TYPE_Object) {
					if (v.Class === "String" || v.Class === "Number") {
						var item = ToString(v);
					}
				}
				if (item !== undefined && isIncluded(item, PropertyList) === false) {
					PropertyList.push(item);
				}
			}
		}
	}
	if (Type(space) === TYPE_Object) {
		if (space.Class === "Number") {
			var space = ToNumber(space);
		}
		else if (space.Class === "String") {
			var space = ToString(space);
		}
	}
	if (Type(space) === TYPE_Number) {
		var space = min(10, ToInteger(space));
		var gap = "";
		for (var i = 0; i < space; i++) {
			gap = gap + " ";
		}
	}
	else if (Type(space) === TYPE_String) {
		if (space.length <= 10) {
			var gap = space;

		}
		else {
			var gap = space.substring(0, 10);
		}
	}
	else {
		var gap = "";
	}
	var wrapper = Object_Construct([]);
	wrapper.DefineOwnProperty("", PropertyDescriptor({
		Value : value,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), false);
	return Str("", wrapper);

	function Str(key, holder) {
		var value = holder.Get(key);
		if (Type(value) === TYPE_Object) {
			var toJSON = value.Get("toJSON");
			if (IsCallable(toJSON) === true) {
				var value = toJSON.Call(value, [ key ]);
			}
		}
		if (ReplacerFunction !== undefined) {
			var value = ReplacerFunction.Call(holder, [ key, value ]);
		}
		if (Type(value) === TYPE_Object) {
			if (value.Class === "Number") {
				var value = ToNumber(value);
			}
			else if (value.Class === "String") {
				var value = ToString(value);
			}
			else if (value.Class === "Boolean") {
				var value = value.PrimitiveValue;
			}
		}
		if (value === null) return "null";
		if (value === true) return "true";
		if (value === false) return "false";
		if (Type(value) === TYPE_String) return Quote(value);
		if (Type(value) === TYPE_Number) {
			if (isFinite(value)) return ToString(value);
			else return "null";
		}
		if (Type(value) === TYPE_Object && IsCallable(value) === false) {
			if (value.Class === "Array") return JA(value);
			else return JO(value);
		}
		return undefined;
	}

	function Quote(value) {
		var product = [];
		product.push('"');
		for (var i = 0; i < value.length; i++) {
			var C = value[i];
			if (C === '"') {
				product.push('\\"');
			}
			else if (C === '\\') {
				product.push('\\\\');
			}
			else if (C === '\b') {
				product.push('\\b');
			}
			else if (C === '\f') {
				product.push('\\f');
			}
			else if (C === '\n') {
				product.push('\\n');
			}
			else if (C === '\r') {
				product.push('\\r');
			}
			else if (C === '\t') {
				product.push('\\t');
			}
			else if (toCharCode(C) < 0x20) {
				var x = toCharCode(C);
				var hex = toDigitChar(x >> 12) + toDigitChar(15 & (x >> 8)) + toDigitChar(15 & (x >> 4)) + toDigitChar(15 & x);
				product.push('\\u' + hex);
			}
			else {
				product.push(C);
			}
		}
		product.push('"');
		return join(product);
	}

	function JO(value) {
		if (isIncluded(value, stack)) throw VMTypeError();
		stack.push(value);
		var stepback = indent;
		indent = indent + gap;
		if (PropertyList !== undefined) {
			var K = PropertyList;
		}
		else {
			var K = [];
			var next = value.enumerator(true, true);
			var P;
			while ((P = next()) !== undefined) {
				K.push(P);
			}
		}
		var partial = [];
		for (var i = 0; i < K.length; i++) {
			var P = K[i];
			var strP = Str(P, value);
			if (strP !== undefined) {
				var member = Quote(P);
				var member = member + ':';
				if (gap !== "") {
					var member = member + ' ';
				}
				var member = member + strP;
				partial.push(member);
			}
		}
		if (partial === empty) {
			var final = "{}";
		}
		else if (gap === "") {
			var properties = partial.join(',');
			var final = "{" + properties + "}";
		}
		else {
			var separator = ',' + '\n' + indent;
			var properties = partial.join(separator);
			var final = "{" + '\n' + indent + properties + '\n' + stepback + "}";
		}
		stack.pop();
		indent = stepback;
		return final;
	}

	function JA(value) {
		if (isIncluded(value, stack)) throw VMTypeError();
		stack.push(value);
		var stepback = indent;
		indent = indent + gap;
		var partial = [];
		var len = value.Get("length");
		var index = 0;
		while (index < len) {
			var strP = Str(ToString(index), value);
			if (strP === undefined) {
				partial.push("null");
			}
			else {
				partial.push(strP);
			}
			index++;
		}
		if (partial === empty) {
			var final = "[]";
		}
		else if (gap === "") {
			var properties = partial.join(',');
			var final = "[" + properties + "]";
		}
		else {
			var separator = ',' + '\n' + indent;
			var properties = partial.join(separator);
			var final = "[" + '\n' + indent + properties + '\n' + stepback + "]";
		}
		stack.pop();
		indent = stepback;
		return final;
	}

}
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

// ECMAScript 5.1: 15.8 The Math Object

function Math_abs(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.abs(x);
}

function Math_acos(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.acos(x);
}

function Math_asin(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.asin(x);
}

function Math_atan(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.atan(x);
}

function Math_atan2(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	var y = ToNumber(argumentsList[1]);
	return Math.atan2(x, y);
}

function Math_ceil(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.ceil(x);
}

function Math_cos(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.cos(x);
}

function Math_exp(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.exp(x);
}

function Math_floor(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.floor(x);
}

function Math_log(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.log(x);
}

function Math_max(thisValue, argumentsList) {
	var result = -Infinity;
	for (var i = 0; i < argumentsList.length; i++) {
		var value = ToNumber(argumentsList[i]);
		var result = Math.max(result, value);
	}
	return result;
}

function Math_min(thisValue, argumentsList) {
	var result = Infinity;
	for (var i = 0; i < argumentsList.length; i++) {
		var value = ToNumber(argumentsList[i]);
		var result = Math.min(result, value);
	}
	return result;
}

function Math_pow(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	var y = ToNumber(argumentsList[1]);
	return Math.pow(x, y);
}

function Math_random(thisValue, argumentsList) {
	return IOManager_math_random(); // for deterministic behavior
}

function Math_round(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.round(x);
}

function Math_sin(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.sin(x);
}

function Math_sqrt(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.sqrt(x);
}

function Math_tan(thisValue, argumentsList) {
	var x = ToNumber(argumentsList[0]);
	return Math.tan(x);
}
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

// ECMAScript 5.1: 15.7 Number Objects

function Number_Call(thisValue, argumentsList) {
	var value = argumentsList[0];
	if (argumentsList.length === 0) return 0;
	return ToNumber(value);
}

function Number_Construct(argumentsList) {
	var value = Number_Call(null, argumentsList);
	var obj = VMObject(CLASSID_Number);
	obj.Prototype = builtin_Number_prototype;
	obj.Extensible = true;
	obj.PrimitiveValue = value;
	return obj;
}

function Number_prototype_toString(thisValue, argumentsList) {
	var radix = argumentsList[0];
	var thisNumber = Number_prototype_valueOf(thisValue);
	if (radix === undefined) {
		radix = 10;
	}
	var r = ToInteger(radix);
	if (r === 10) return ToString(thisNumber);
	if (!((2 <= r) && (r <= 36))) throw VMRangeError();
	return thisNumber.toString(r);
}

function Number_prototype_toLocaleString(thisValue, argumentsList) {
	return Number_prototype_toString(thisValue, argumentsList);
}

function Number_prototype_valueOf(thisValue, argumentsList) {
	if (Type(thisValue) === TYPE_Number) return thisValue;
	if (Type(thisValue) === TYPE_Object && thisValue.Class === "Number") return thisValue.PrimitiveValue;
	throw VMTypeError();
}

function Number_prototype_toFixed(thisValue, argumentsList) {
	var fractionDigits = argumentsList[0];
	var f = ToInteger(fractionDigits);
	if ((f < 0) || (f > 20)) throw VMRangeError();
	var x = Number_prototype_valueOf(thisValue);
	if (isNaN(x)) return "NaN";
	var s = "";
	if (x < 0) {
		var s = "-";
		var x = -x;
	}
	if (x >= 1e21) {
		var m = ToString(x);
	}
	else {
		var m = x.toFixed(f);
	}
	return s + m;
}

function Number_prototype_toExponential(thisValue, argumentsList) {
	var fractionDigits = argumentsList[0];
	var x = Number_prototype_valueOf(thisValue);
	var f = ToInteger(fractionDigits);
	if (isNaN(x)) return "NaN";
	var s = "";
	if (x < 0) {
		var s = "-";
		var x = -x;
	}
	if (x === Infinity) return s + "Infinity";
	if (fractionDigits !== undefined && ((f < 0) || (f > 20))) throw VMRangeError();
	var m = x.toExponential(f);
	return s + m;
}

function Number_prototype_toPrecision(thisValue, argumentsList) {
	var precision = argumentsList[0];
	var x = Number_prototype_valueOf(thisValue);
	if (precision === undefined) return ToString(x);
	var p = ToInteger(precision);
	if (isNaN(x)) return "NaN";
	var s = "";
	if (x < 0) {
		var s = "-";
		var x = -x;
	}
	if (x === Infinity) return s + "Infinity";
	if ((p < 1) || (p > 21)) throw VMRangeError();
	var m = x.toPrecision(p);
	return s + m;
}
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

// ECMAScript 5.1: 15.2 Object Objects

function Object_Call(thisValue, argumentsList) {
	var value = argumentsList[0];
	if (value === null || value === undefined) return Object_Construct(argumentsList);
	return ToObject(value);
}

function Object_Construct(argumentsList) {
	var value = argumentsList[0];
	if (argumentsList.length >= 1) {
		if (Type(value) === TYPE_Object) return value;
		if (Type(value) === TYPE_String) return ToObject(value);
		if (Type(value) === TYPE_Boolean) return ToObject(value);
		if (Type(value) === TYPE_Number) return ToObject(value);
	}
	var obj = VMObject(CLASSID_Object);
	obj.Prototype = builtin_Object_prototype;
	obj.Extensible = true;
	return obj;
}

function Object_getPrototypeOf(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	return O.Prototype;
}

function Object_getOwnPropertyDescriptor(thisValue, argumentsList) {
	var O = argumentsList[0];
	var P = argumentsList[1];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var name = ToString(P);
	var desc = O.GetOwnProperty(name);
	return FromPropertyDescriptor(desc);
}

function Object_getOwnPropertyNames(thisValue, argumentsList) {
	var O = argumentsList[0];
	var P = argumentsList[1];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var array = Array_Construct([]);
	var n = 0;
	var next = O.enumerator(true, false);
	var name;
	while ((name = next()) !== undefined) {
		array.DefineOwnProperty(ToString(n), PropertyDescriptor({
			Value : name,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		n++;
	}
	return array;
}

function Object_create(thisValue, argumentsList) {
	var O = argumentsList[0];
	var Properties = argumentsList[1];
	if (Type(O) !== TYPE_Object && Type(O) !== TYPE_Null) throw VMTypeError();
	var obj = Object_Construct([]);
	obj.Prototype = O;
	if (Properties !== undefined) {
		Object_defineProperties(null, [ obj, Properties ]);
	}
	return obj;
}

function Object_defineProperty(thisValue, argumentsList) {
	var O = argumentsList[0];
	var P = argumentsList[1];
	var Attributes = argumentsList[2];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var name = ToString(P);
	var desc = ToPropertyDescriptor(Attributes);
	O.DefineOwnProperty(name, desc, true);
	return O;
}

function Object_defineProperties(thisValue, argumentsList) {
	var O = argumentsList[0];
	var Properties = argumentsList[1];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var props = ToObject(Properties);
	var names = props.enumerator(true, true);
	var descriptors = [];
	var P;
	while ((P = names()) !== undefined) {
		var descObj = props.Get(P);
		var desc = ToPropertyDescriptor(descObj);
		descriptors.push([ P, desc ]);
	}
	for (var i = 0; i < descriptors.length; i++) {
		var pair = descriptors[i];
		var P = pair[0];
		var desc = pair[1];
		O.DefineOwnProperty(P, desc, true);
	}
	return O;
}

function Object_seal(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var next = O.enumerator(true, false);
	var P;
	while ((P = next()) !== undefined) {
		var desc = O.GetOwnProperty(P);
		if (desc.Configurable === true) {
			var desc = PropertyDescriptor({
				Value : desc.Value,
				Writable : desc.Writable,
				Get : desc.Get,
				Set : desc.Set,
				Enumerable : desc.Enumerable,
				Configurable : false,
			});
		}
		O.DefineOwnProperty(P, desc, true);
	}
	O.Extensible = false;
	return O;
}

function Object_freeze(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var next = O.enumerator(true, false);
	var P;
	while ((P = next()) !== undefined) {
		var desc = O.GetOwnProperty(P);
		var desc = PropertyDescriptor({
			Value : desc.Value,
			Writable : (desc.Writable === true) ? false : desc.Writable,
			Get : desc.Get,
			Set : desc.Set,
			Enumerable : desc.Enumerable,
			Configurable : false,
		});
		O.DefineOwnProperty(P, desc, true);
	}
	O.Extensible = false;
	return O;
}

function Object_preventExtensions(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	O.Extensible = false;
	return O;
}

function Object_isSealed(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var next = O.enumerator(true, false);
	var P;
	while ((P = next()) !== undefined) {
		var desc = O.GetOwnProperty(P);
		if (desc.Configurable === true) return false;
	}
	if (O.Extensible === false) return true;
	return false;
}

function Object_isFrozen(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var next = O.enumerator(true, false);
	var P;
	while ((P = next()) !== undefined) {
		var desc = O.GetOwnProperty(P);
		if (IsDataDescriptor(desc) === true) {
			if (desc.Writable === true) return false;
		}
		if (desc.Configurable === true) return false;
	}
	if (O.Extensible === false) return true;
	return false;
}

function Object_isExtensible(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	return O.Extensible;
}

function Object_keys(thisValue, argumentsList) {
	var O = argumentsList[0];
	if (Type(O) !== TYPE_Object) throw VMTypeError();
	var next = O.enumerator(true, true);
	var n = next.length;
	var array = Array_Construct([ n ]);
	var index = 0;
	var P;
	while ((P = next()) !== undefined) {
		array.DefineOwnProperty(ToString(index), PropertyDescriptor({
			Value : P,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		index++;
	}
	return array;
}

function Object_prototype_toString(thisValue, argumentsList) {
	if (thisValue === undefined) return "[object Undefined]";
	if (thisValue === null) return "[object Null]";
	var O = ToObject(thisValue);
	return "[object " + O.Class + "]";
}

function Object_prototype_toLocaleString(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	var toString = O.Get("toString");
	if (IsCallable(toString) === false) throw VMTypeError();
	return toString.Call(O, []);
}

function Object_prototype_valueOf(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	return O;
}

function Object_prototype_hasOwnProperty(thisValue, argumentsList) {
	var V = argumentsList[0];
	var P = ToString(V);
	var O = ToObject(thisValue);
	var desc = O.GetOwnProperty(P);
	if (desc === undefined) return false;
	return true;
}

function Object_prototype_isPrototypeOf(thisValue, argumentsList) {
	var V = argumentsList[0];
	if (Type(V) !== TYPE_Object) return false;
	var O = ToObject(thisValue);
	while (true) {
		var V = V.Prototype;
		if (V === null) return false;
		if (O === V) return true;
	}
}

function Object_prototype_propertyIsEnumerable(thisValue, argumentsList) {
	var V = argumentsList[0];
	var P = ToString(V);
	var O = ToObject(thisValue);
	var desc = O.GetOwnProperty(P);
	if (desc === undefined) return false;
	return desc.Enumerable;
}

function get_Object_prototype___proto__(thisValue, argumentsList) {
	var O = ToObject(thisValue);
	return O.Prototype;
}

function set_Object_prototype___proto__(thisValue, argumentsList) {
	var proto = argumentsList[0];
	CheckObjectCoercible(thisValue);
	var O = thisValue;
	if (proto !== null && Type(proto) !== TYPE_Object) return undefined;
	if (Type(O) !== TYPE_Object) return undefined;
	if (O.Extensible === false) throw VMTypeError();
	var current = O.Prototype;
	if (proto === current) return undefined;
	var p = proto;
	while (p !== null) {
		if (p === O) return undefined;
		p = p.Prototype;
	}
	O.Prototype = proto;
	return undefined;
}
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

// ECMAScript 5.1: 15.10 RegExp Objects

function RegExp_Call(thisValue, argumentsList) {
	var pattern = argumentsList[0];
	var flags = argumentsList[1];
	var R = pattern;
	if (Type(R) === TYPE_Object && R.Class === "RegExp" && flags === undefined) return R;
	return RegExp_Construct([ pattern, flags ]);
}

function RegExp_Construct(argumentsList) {
	var pattern = argumentsList[0];
	var flags = argumentsList[1];
	var R = pattern;
	if (Type(R) === TYPE_Object && R.Class === "RegExp") {
		if (flags !== undefined) throw VMTypeError();
		var obj = VMObject(CLASSID_RegExp);
		obj.Prototype = builtin_RegExp_prototype;
		obj.Extensible = true;
		defineFinal(obj, "source", R.Get("source"));
		defineFinal(obj, "global", R.Get("global"));
		defineFinal(obj, "ignoreCase", R.Get("ignoreCase"));
		defineFinal(obj, "multiline", R.Get("multiline"));
		defineWritable(obj, "lastIndex", 0);
		obj.Match = R.Match;
		obj.NCapturingParens = R.NCapturingParens;
		return obj;
	}
	if (pattern === undefined) {
		var P = "";
	}
	else {
		var P = ToString(pattern);
	}
	if (flags === undefined) {
		var F = "";
	}
	else {
		var F = ToString(flags);
	}
	var obj = VMObject(CLASSID_RegExp);
	obj.Prototype = builtin_RegExp_prototype;
	obj.Extensible = true;
	theRegExpFactory.setup(obj, P, F);
	theRegExpFactory.compile(obj);
	return obj;
}

function RegExp_prototype_exec(thisValue, argumentsList) {
	var string = argumentsList[0];
	var R = thisValue;
	if (Type(R) !== TYPE_Object || R.Class !== "RegExp") throw VMTypeError();
	var S = ToString(string);
	var length = S.length;
	var lastIndex = R.Get("lastIndex");
	var i = ToInteger(lastIndex);
	var global = R.Get("global");
	if (global === false) {
		var i = 0;
	}
	var matchSucceeded = false;
	while (matchSucceeded === false) {
		if ((i < 0) || (i > length)) {
			R.Put("lastIndex", 0, true);
			return null;
		}
		var r = R.Match(S, i);
		if (r === failure) {
			var i = i + 1;
		}
		else {
			matchSucceeded = true;
		}
	}
	var e = r.endIndex;
	if (global === true) {
		R.Put("lastIndex", e, true);
	}
	var n = R.NCapturingParens;
	var A = Array_Construct([]);
	var matchIndex = i;
	A.DefineOwnProperty("index", PropertyDescriptor({
		Value : matchIndex,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), true);
	A.DefineOwnProperty("input", PropertyDescriptor({
		Value : S,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), true);
	A.DefineOwnProperty("length", PropertyDescriptor({
		Value : n + 1
	}), true);
	var matchedSubstr = S.substring(i, e);
	A.DefineOwnProperty("0", PropertyDescriptor({
		Value : matchedSubstr,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), true);
	for (var i = 1; i <= n; i++) {
		var captureI = r.captures[i];
		A.DefineOwnProperty(ToString(i), PropertyDescriptor({
			Value : captureI,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), true);
	}
	return A;
}

function RegExp_prototype_test(thisValue, argumentsList) {
	var match = RegExp_prototype_exec(thisValue, argumentsList);
	if (match !== null) return true;
	return false;
}

function RegExp_prototype_toString(thisValue, argumentsList) {
	var R = thisValue;
	if (Type(R) !== TYPE_Object || R.Class !== "RegExp") throw VMTypeError();
	return "/" + R.Get("source") + "/" + (R.Get("global") ? "g" : "") + (R.Get("ignoreCase") ? "i" : "") + (R.Get("multiline") ? "m" : "");
}

function State(endIndex, captures) {
	return preventExtensions({
		endIndex : endIndex,
		captures : captures,
		pendingContinuation : undefined
	});
}

var theRegExpFactory = RegExpFactory();

function RegExpFactory() {
	return preventExtensions({
		compile : compile,
		setup : setup,
	});

	var source;
	var current;
	var lookahead;
	var lookahead2;
	var currentPos;

	function setPattern(pattern) {
		source = pattern;
		currentPos = 0;
		current = source[0];
		lookahead = source[1];
		lookahead2 = source[2];
	}

	function expecting(c) {
		if (c !== current) throw VMSyntaxError();
		proceed();
	}

	function proceed(count) {
		var c = current;
		if (count === undefined) {
			count = 1;
		}
		for (var i = 0; i < count; i++) {
			if (current === undefined) throw VMSyntaxError();
			currentPos++;
			current = lookahead;
			lookahead = lookahead2;
			lookahead2 = source[currentPos + 2];
		}
		return c;
	}

	var leftCapturingParentheses;
	var oneCharacterOfCharSet;
	var NCapturingParens;
	var IgnoreCase;
	var Multiline;
	var Input;
	var InputLength;

	function compile(obj) {
		var P = obj.Get("source");
		IgnoreCase = obj.Get("ignoreCase");
		Multiline = obj.Get("multiline");
		NCapturingParens = countNCapturingParens(P);
		obj.Match = evaluatePattern(P, IgnoreCase, Multiline, NCapturingParens);
		obj.NCapturingParens = NCapturingParens;
	}

	function evaluatePattern(P, ignoreCase, multiline, nCapturingParens) {
		setPattern(P);
		leftCapturingParentheses = 0;
		var m = evaluateDisjunction();
		if (current !== undefined) throw VMSyntaxError();
		assertEquals(nCapturingParens, leftCapturingParentheses, P);
		return function(str, index) {
			Input = str;
			InputLength = Input.length;
			NCapturingParens = nCapturingParens;
			IgnoreCase = ignoreCase;
			Multiline = multiline;
			var cap = [];
			var x = State(index, []);
			return unpending(m(x, noContinuation));
		};
	}

	function noContinuation(x) {
		return x;
	}

	function pending(c, x) {
		assertEquals(x.pendingContinuation, undefined, x);
		if (c !== noContinuation) {
			x.pendingContinuation = c;
		}
		return x;
	}

	function unpending(x) {
		while (true) {
			var c = x.pendingContinuation;
			if (c === undefined) {
				return x;
			}
			x.pendingContinuation = undefined;
			x = c(x);
		}
	}

	function evaluateDisjunction() {
		var m1 = evaluateAlternative();
		if (current !== '|') return m1;
		proceed();
		var m2 = evaluateDisjunction();
		return function(x, c) {
			var r = unpending(m1(x, c));
			if (r !== failure) return r;
			return m2(x, c);
		};
	}

	function evaluateAlternative() {
		var m1 = function(x, c) {
			return pending(c, x);
		};
		while (true) {
			var m2 = evaluateTerm();
			if (m2 === undefined) return m1;
			var m1 = concat(m1, m2);
		}
		function concat(m1, m2) {
			return function(x, c) {
				var d = function(y) {
					return m2(y, c);
				};
				return m1(x, d);
			};
		}
	}

	function evaluateTerm() {
		var parenIndex = leftCapturingParentheses;
		var t = evaluateAssertionTester();
		if (t !== undefined) return function(x, c) {
			var r = t(x);
			if (r === false) return failure;
			return pending(c, x);
		};
		var m = evaluateAssertion();
		if (m !== undefined) return m;
		var m = evaluateAtom();
		if (m === undefined) return undefined;
		return evaluateQuantifierWithAtom(m, parenIndex);
	}

	function RepeatMatcher(m, min, max, greedy, x, c, parenIndex, parenCount) {
		if (max === 0) return pending(c, x);
		if (min === 0 && greedy === true) return RepeatMatcher0Greedy(m, max, x, c, parenIndex, parenCount);
		var d = function(y) {
			if (min === 0 && y.endIndex === x.endIndex) return failure;
			if (min === 0) {
				var min2 = 0;
			}
			else {
				var min2 = min - 1;
			}
			if (max === Infinity) {
				var max2 = Infinity;
			}
			else {
				var max2 = max - 1;
			}
			return RepeatMatcher(m, min2, max2, greedy, y, c, parenIndex, parenCount);
		};
		var cap = arraycopy(x.captures);
		for (var k = parenIndex + 1; k <= parenIndex + parenCount; k++) {
			cap[k] = undefined;
		}
		var e = x.endIndex;
		var xr = State(e, cap);
		if (min !== 0) return m(xr, d);
		if (greedy === false) {
			var z = unpending(c(x));
			if (z !== failure) return z;
			return m(xr, d);
		}
		var z = unpending(m(xr, d));
		if (z !== failure) return z;
		return pending(c, x);
	}

	// optimized loop version
	function RepeatMatcher0Greedy(m, max, x, c, parenIndex, parenCount) {
		var stack = [];
		while (true) {
			if (max === 0) break;
			var d = function(y) {
				if (y.endIndex === x.endIndex) return failure;
				return RepeatMatcher0Greedy(m, max - 1, y, c, parenIndex, parenCount);
			};
			var cap = arraycopy(x.captures);
			for (var k = parenIndex + 1; k <= parenIndex + parenCount; k++) {
				cap[k] = undefined;
			}
			var e = x.endIndex;
			var xr = State(e, cap);
			var y = m(xr, d);
			if (y.pendingContinuation !== d) {
				var z = unpending(y);
				if (z !== failure) return z;
				break;
			}
			y.pendingContinuation = undefined;
			if (y.endIndex === x.endIndex) break;
			stack.push(x);
			x = y;
			max = max - 1;
		}
		while (stack.length > 0) {
			var z = unpending(c(x));
			if (z !== failure) return z;
			x = stack.pop();
		}
		return pending(c, x);
	}

	function evaluateAssertionTester() {
		if (current === '^') {
			proceed();
			return function(x) {
				var e = x.endIndex;
				if (e === 0) return true;
				if (Multiline === false) return false;
				if (isLineTerminator(Input[e - 1])) return true;
				return false;
			};
		}
		if (current === '$') {
			proceed();
			return function(x) {
				var e = x.endIndex;
				if (e === InputLength) return true;
				if (Multiline === false) return false;
				if (isLineTerminator(Input[e])) return true;
				return false;
			};
		}
		if (current === '\\' && lookahead === 'b') {
			proceed(2);
			return function(x) {
				var e = x.endIndex;
				var a = IsWordChar(e - 1);
				var b = IsWordChar(e);
				if (a === true && b === false) return true;
				if (a === false && b === true) return true;
				return false;
			};
		}
		if (current === '\\' && lookahead === 'B') {
			proceed(2);
			return function(x) {
				var e = x.endIndex;
				var a = IsWordChar(e - 1);
				var b = IsWordChar(e);
				if (a === true && b === false) return false;
				if (a === false && b === true) return false;
				return true;
			};
		}
		return undefined;
	}

	function evaluateAssertion() {
		if (current === '(' && lookahead === '?' && lookahead2 === '=') {
			proceed(3);
			var m = evaluateDisjunction();
			expecting(')');
			return function(x, c) {
				var r = unpending(m(x, noContinuation));
				if (r === failure) return failure;
				var y = r;
				var cap = y.captures;
				var xe = x.endIndex;
				var z = State(xe, cap);
				return pending(c, z);
			};
		}
		if (current === '(' && lookahead === '?' && lookahead2 === '!') {
			proceed(3);
			var m = evaluateDisjunction();
			expecting(')');
			return function(x, c) {
				var r = unpending(m(x, noContinuation));
				if (r !== failure) return failure;
				return pending(c, x);
			};
		}
		return undefined;
	}

	function IsWordChar(e) {
		if (e === -1 || e === InputLength) return false;
		var c = Input[e];
		if (c === '_' || isDigitChar(c)) return true;
		return false;
	}

	function evaluateQuantifierWithAtom(m, parenIndex) {
		var parenCount = leftCapturingParentheses - parenIndex;
		var min, max, greedy;
		if (current === '*') {
			proceed();
			min = 0;
			max = Infinity;
		}
		else if (current === '+') {
			proceed();
			min = 1;
			max = Infinity;
		}
		else if (current === '?') {
			proceed();
			min = 0;
			max = 1;
		}
		else if (current === '{') {
			proceed();
			min = evaluateDecimalDigits();
			if (current === '}') {
				proceed();
				max = min;
			}
			else if (current === ',' && lookahead === '}') { // '{'
				proceed(2);
				max = Infinity;
			}
			else if (current === ',') {
				proceed();
				max = evaluateDecimalDigits();
				expecting('}'); // '{'
			}
			else throw VMSyntaxError();
		}
		else return m;
		var greedy = true;
		if (current === '?') {
			proceed();
			var greedy = false;
		}
		if (isFinite(max) && (max < min)) throw VMSyntaxError();
		return function(x, c) {
			return RepeatMatcher(m, min, max, greedy, x, c, parenIndex, parenCount);
		};
	}

	function evaluateDecimalDigits() {
		if (isDecimalDigitChar(current) === false) throw VMSyntaxError();
		var x = 0;
		while (isDecimalDigitChar(current)) {
			x = x * 10 + mvDigitChar(current);
			proceed();
		}
		return x;
	}

	function evaluateAtom() {
		if (current === undefined) return undefined;
		if (current === '.') {
			proceed();
			return CharacterSetMatcher(function(cc) {
				if (isLineTerminator(cc)) return false;
				return true;
			}, false);
		}
		if (current === '\\') {
			proceed();
			return evaluateAtomEscape();
		}
		if (current === '[') {
			proceed();
			return evaluateCharacterClassMatcher();
		}
		if (current === '(' && lookahead === '?' && lookahead2 === ':') {
			proceed(3);
			var m = evaluateDisjunction();
			expecting(')');
			return m;
		}
		if (current === '(') {
			proceed();
			var parenIndex = leftCapturingParentheses++;
			var m = evaluateDisjunction();
			expecting(')');
			return function(x, c) {
				var d = function(y) {
					var cap = arraycopy(y.captures);
					var xe = x.endIndex;
					var ye = y.endIndex;
					var s = Input.substring(xe, ye);
					cap[parenIndex + 1] = s;
					var z = State(ye, cap);
					return pending(c, z);
				};
				return m(x, d);
			};
		}
		if (STRICT_CONFORMANCE) {
			if (current === ']') return undefined;
		}
		if (isIncluded(current, "*+?){}|")) return undefined;
		var A = oneElementCharSet(proceed());
		return CharacterSetMatcher(A, false);
	}

	function oneElementCharSet(ch) {
		oneCharacterOfCharSet = ch;
		return function(cc) {
			if (Canonicalize(ch) === cc) return true;
			return false;
		};
	}

	function CharacterSetMatcher(A, invert) {
		return function(x, c) {
			var e = x.endIndex;
			if (e === InputLength) return failure;
			var ch = Input[e];
			var cc = Canonicalize(ch);
			if (invert === false) {
				if (A(cc) === false) return failure;
			}
			else if (A(cc) === true) return failure;
			var cap = x.captures;
			var y = State(e + 1, cap);
			return pending(c, y);
		};
	}

	function Canonicalize(ch) {
		if (IgnoreCase === false) return ch;
		var u = ch.toUpperCase();
		if (u.length !== 1) return ch;
		var cu = u;
		if ((toCharCode(ch) >= 128) && (toCharCode(cu) < 128)) return ch;
		return cu;
	}

	function evaluateAtomEscape() {
		var E = evaluateDecimalEscape();
		if (E !== undefined) {
			if (Type(E) === TYPE_String) {
				var ch = E;
				var A = oneElementCharSet(ch);
				return CharacterSetMatcher(A, false);
			}
			var n = E;
			if (n > NCapturingParens) {
				if (STRICT_CONFORMANCE) throw VMSyntaxError();
				return function(x, c) {
					return failure;
				};
			}

			return function(x, c) {
				var cap = x.captures;
				var s = cap[n];
				if (s === undefined) return pending(c, x);
				var e = x.endIndex;
				var len = s.length;
				var f = e + len;
				if (f > InputLength) return failure;
				for (var i = 0; i < len; i++) {
					if (Canonicalize(s[i]) !== Canonicalize(Input[e + i])) return failure;
				}
				var y = State(f, cap);
				return pending(c, y);
			};
		}
		if (isIncluded(current, "dDsSwW")) {
			var A = evaluateCharacterClassEscape();
			return CharacterSetMatcher(A, false);
		}
		var ch = evaluateCharacterEscape();
		if (ch === undefined) return function(x, c) {
			return failure;
		};
		var A = oneElementCharSet(ch);
		return CharacterSetMatcher(A, false);
	}

	function evaluateCharacterEscape() {
		var c = proceed();
		switch (c) {
		case 't':
			return '\u0009';
		case 'n':
			return '\u000A';
		case 'v':
			return '\u000B';
		case 'f':
			return '\u000C';
		case 'r':
			return '\u000D';
		case 'c':
			if ((mvDigitChar(current) >= 10) === false) {
				if (STRICT_CONFORMANCE) throw VMSyntaxError();
				if (isIncluded(current, "/^$\\.*+?()[]{}|")) throw VMSyntaxError();
				return undefined;
			}
			var ch = proceed();
			var i = toCharCode(ch);
			var j = i % 32;
			return fromCharCode(j);
		case 'x':
			var x = 0;
			for (var i = 0; i < 2; i++) {
				if (!isHexDigitChar(current)) {
					if (STRICT_CONFORMANCE) throw VMSyntaxError();
					return undefined;
				}
				x = (x << 4) + mvDigitChar(current);
				proceed();
			}
			return fromCharCode(x);
		case 'u':
			var x = 0;
			for (var i = 0; i < 4; i++) {
				if (!isHexDigitChar(current)) {
					if (STRICT_CONFORMANCE) throw VMSyntaxError();
					return undefined;
				}
				x = (x << 4) + mvDigitChar(current);
				proceed();
			}
			return fromCharCode(x);
		case '\u200d': // <ZWJ>
		case '\u200c': // <ZWNJ>
			return c;
		}
		if (STRICT_CONFORMANCE) {
			if (isIdentifierPart(c)) throw VMSyntaxError();
		}
		return c;
	}

	function evaluateDecimalEscape() {
		if (isDecimalDigitChar(current) === false) return undefined;
		if (current === '0') {
			proceed();
			if (isDecimalDigitChar(current)) throw VMSyntaxError();
			return '\u0000';
		}
		var x = 0;
		while (isDecimalDigitChar(current)) {
			x = x * 10 + mvDigitChar(current);
			proceed();
		}
		return x;
	}

	function evaluateOctalEscape() {
		if (isDecimalDigitChar(current) === false) return undefined;
		if (current === '0') {
			proceed();
			if (isDecimalDigitChar(current)) throw VMSyntaxError();
			return '\u0000';
		}
		if (STRICT_CONFORMANCE) throw VMSyntaxError();
		var x = 0;
		while (isDecimalDigitChar(current)) {
			if (current === '8' || current === '9') throw VMSyntaxError();
			x = x * 8 + mvDigitChar(current);
			proceed();
		}
		return fromCharCode(x);
	}

	function evaluateCharacterClassEscape() {
		switch (proceed()) {
		case 'd':
			return function(cc) {
				if (isDecimalDigitChar(cc)) return true;
				return false;
			};
		case 'D':
			return function(cc) {
				if (isDecimalDigitChar(cc)) return false;
				return true;
			};
		case 's':
			return function(cc) {
				if (isWhiteSpace(cc) || isLineTerminator(cc)) return true;
				return false;
			};
		case 'S':
			return function(cc) {
				if (isWhiteSpace(cc) || isLineTerminator(cc)) return false;
				return true;
			};
		case 'w':
			return function(cc) {
				if (cc === '_' || isDigitChar(cc)) return true;
				return false;
			};
		case 'W':
			return function(cc) {
				if (cc === '_' || isDigitChar(cc)) return false;
				return true;
			};
		}
		return false;
	}

	function evaluateCharacterClassMatcher() {
		if (current === '^') {
			proceed();
			var A = evaluateClassRanges();
			return CharacterSetMatcher(A, true);
		}
		var A = evaluateClassRanges();
		return CharacterSetMatcher(A, false);
	}

	function evaluateClassRanges() {
		var charSets = [];
		while (current !== ']') {
			var A = evaluateClassAtom();
			var a = oneCharacterOfCharSet;
			if (current === '-') {
				proceed();
				if (current === ']') {
					charSets.push(A);
					charSets.push(oneElementCharSet('-'));
				}
				else {
					var B = evaluateClassAtom();
					var b = oneCharacterOfCharSet;
					if (a === undefined || b === undefined) {
						if (STRICT_CONFORMANCE) throw VMSyntaxError();
						charSets.push(A);
						charSets.push(oneElementCharSet('-'));
						charSets.push(B);
					}
					else {
						var i = toCharCode(a);
						var j = toCharCode(b);
						if (i > j) throw VMSyntaxError();
						var D = rangeCharSet(i, j);
						charSets.push(D);
					}
				}
			}
			else {
				charSets.push(A);
			}
		}
		proceed();
		return unionCharSet(charSets);
	}

	function rangeCharSet(i, j) {
		return function(cc) {
			if (IgnoreCase === false) {
				var k = toCharCode(cc);
				if ((i <= k) && (k <= j)) return true;
				return false;
			}
			else {
				for (var k = i; k <= j; k++) {
					var ch = fromCharCode(k);
					if (Canonicalize(ch) === cc) return true;
				}
				return false;
			}
		};
	}

	function unionCharSet(charSets) {
		return function(cc) {
			for (var i = 0; i < charSets.length; i++) {
				var A = charSets[i];
				if (A(cc) === true) return true;
			}
			return false;
		};
	}

	function evaluateClassAtom() {
		oneCharacterOfCharSet = undefined;
		if (current === '-') {
			proceed();
			return oneElementCharSet('-');
		}
		if (current === '\\') {
			proceed();
			var E = evaluateOctalEscape();
			if (E !== undefined) {
				var ch = E;
				return oneElementCharSet(ch);
			}
			if (current === 'b') {
				proceed();
				return oneElementCharSet('\u0008');
			}
			if (current === 'B') throw VMSyntaxError();
			if (isIncluded(current, "dDsSwW")) return evaluateCharacterClassEscape();
			var ch = evaluateCharacterEscape();
			if (ch === undefined) return function(cc) {
				return false;
			};
			var A = oneElementCharSet(ch);
			return A;
		}
		var ch = proceed();
		return oneElementCharSet(ch);
	}

	function countNCapturingParens(P) {
		setPattern(P);
		var nCapturingParens = 0;
		var buffer = [];
		while (current !== undefined) {
			if (current === '(' && lookahead !== '?') {
				nCapturingParens++;
				proceed();
			}
			else if (current === '\\' && lookahead !== undefined) {
				proceed(2);
			}
			else if (current === '[') {
				proceed();
				while (current !== ']') {
					if (current === '\\' && lookahead !== undefined) {
						proceed(2);
					}
					else {
						proceed();
					}
				}
			}
			else {
				proceed();
			}
		}
		return nCapturingParens;
	}

	function escapePattern(P) {
		setPattern(P);
		if (current === undefined) return "(?:)";
		var buffer = [];
		while (current !== undefined) {
			if (current === '/') {
				buffer.push('\\');
				buffer.push(current);
				proceed();
			}
			else if (current === '\\' && lookahead !== undefined) {
				buffer.push(current);
				buffer.push(lookahead);
				proceed(2);
			}
			else if (current === '[') {
				buffer.push(current);
				proceed();
				while (current !== ']') {
					if (current === '\\' && lookahead !== undefined) {
						buffer.push(current);
						buffer.push(lookahead);
						proceed(2);
					}
					else {
						buffer.push(proceed());
					}
				}
			}
			else {
				buffer.push(proceed());
			}
		}
		return join(buffer);
	}

	function setup(obj, P, F) {
		var ignoreCase = false;
		var multiline = false;
		var global = false;
		for (var i = 0; i !== F.length; i++) {
			var f = F[i];
			if (f === 'g') {
				if (global) throw VMSyntaxError();
				global = true;
			}
			else if (f === 'i') {
				if (ignoreCase) throw VMSyntaxError();
				ignoreCase = true;
			}
			else if (f === 'm') {
				if (multiline) throw VMSyntaxError();
				multiline = true;
			}
			else throw VMSyntaxError();
		}
		defineFinal(obj, "source", escapePattern(P));
		defineFinal(obj, "global", global);
		defineFinal(obj, "ignoreCase", ignoreCase);
		defineFinal(obj, "multiline", multiline);
		defineWritable(obj, "lastIndex", 0);
	}
}
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

// ECMAScript 5.1: 15.5 String Objects

function String_Call(thisValue, argumentsList) {
	var value = argumentsList[0];
	if (argumentsList.length === 0) return "";
	return ToString(value);
}

function String_Construct(argumentsList) {
	var value = String_Call(null, argumentsList);
	var obj = VMObject(CLASSID_String);
	obj.Prototype = builtin_String_prototype;
	obj.Extensible = true;
	obj.PrimitiveValue = value;
	defineFinal(obj, "length", value.length);
	return obj;
}

function String_fromCharCode(thisValue, argumentsList) {
	var buffer = [];
	for (var i = 0; i < argumentsList.length; i++) {
		buffer.push(fromCharCode(ToUint16(argumentsList[i])));
	}
	var S = join(buffer);
	return S;
}

function String_prototype_toString(thisValue, argumentsList) {
	return String_prototype_valueOf(thisValue);
}

function String_prototype_valueOf(thisValue, argumentsList) {
	if (Type(thisValue) === TYPE_String) return thisValue;
	if (Type(thisValue) === TYPE_Object && thisValue.Class === "String") return thisValue.PrimitiveValue;
	throw VMTypeError();
}

function String_prototype_charAt(thisValue, argumentsList) {
	var pos = argumentsList[0];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var position = ToInteger(pos);
	var size = S.length;
	if ((position < 0) || (position >= size)) return "";
	return S[position];
}

function String_prototype_charCodeAt(thisValue, argumentsList) {
	var pos = argumentsList[0];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var position = ToInteger(pos);
	var size = S.length;
	if ((position < 0) || (position >= size)) return NaN;
	return toCharCode(S[position]);
}

function String_prototype_concat(thisValue, argumentsList) {
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var args = argumentsList;
	var R = S;
	for (var i = 0; i < args.length; i++) {
		var next = args[i];
		var R = R + ToString(next);
	}
	return R;
}

function String_prototype_indexOf(thisValue, argumentsList) {
	var searchString = argumentsList[0];
	var position = argumentsList[1];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var searchStr = ToString(searchString);
	var pos = ToInteger(position);
	var len = S.length;
	var start = min(max(pos, 0), len);
	var searchLen = searchStr.length;
	for (var k = start; k + searchLen <= len; k++) {
		if (searchStr === S.substring(k, k + searchLen)) return k;
	}
	return -1;
	return S.indexOf(searchStr, start);
}

function String_prototype_lastIndexOf(thisValue, argumentsList) {
	var searchString = argumentsList[0];
	var position = argumentsList[1];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var searchStr = ToString(searchString);
	var numPos = ToNumber(position);
	if (isNaN(numPos)) {
		var pos = +Infinity;
	}
	else {
		var pos = ToInteger(numPos);
	}
	var len = S.length;
	var start = min(max(pos, 0), len);
	var searchLen = searchStr.length;
	for (var k = start; k >= 0; k--) {
		if ((k + searchLen <= len) && searchStr === S.substring(k, k + searchLen)) return k;
	}
	return -1;
}

function String_prototype_localeCompare(thisValue, argumentsList) {
	var that = argumentsList[0];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var That = ToString(that);
	return S.localeCompare(That);
}

function String_prototype_match(thisValue, argumentsList) {
	var regexp = argumentsList[0];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	if (Type(regexp) === TYPE_Object && regexp.Class === "RegExp") {
		var rx = regexp;
	}
	else {
		var rx = RegExp_Construct([ regexp ]);
	}
	var global = rx.Get("global");
	if (global !== true) return RegExp_prototype_exec(rx, [ S ]);
	else {
		rx.Put("lastIndex", 0);
		var A = Array_Construct([]);
		var previousLastIndex = 0;
		var n = 0;
		var lastMatch = true;
		while (lastMatch === true) {
			var result = RegExp_prototype_exec(rx, [ S ]);
			if (result === null) {
				lastMatch = false;
			}
			else {
				var thisIndex = rx.Get("lastIndex");
				if (thisIndex === previousLastIndex) {
					rx.Put("lastIndex", thisIndex + 1);
					previousLastIndex = thisIndex + 1;
				}
				else {
					previousLastIndex = thisIndex;
				}
				var matchStr = result.Get("0");
				A.DefineOwnProperty(ToString(n), PropertyDescriptor({
					Value : matchStr,
					Writable : true,
					Enumerable : true,
					configurable : true
				}), false);
				n++;
			}
		}
	}
	if (n === 0) return null;
	return A;
}

function String_prototype_replace(thisValue, argumentsList) {
	var searchValue = argumentsList[0];
	var replaceValue = argumentsList[1];
	CheckObjectCoercible(thisValue);
	var string = ToString(thisValue);
	if (Type(searchValue) === TYPE_Object && searchValue.Class === "RegExp") {
		var result = "";
		var endIndex = 0;
		var global = searchValue.Get("global");
		if (global === true) {
			searchValue.Put("lastIndex", 0);
			var previousLastIndex = 0;
		}
		while (true) {
			var matched = RegExp_prototype_exec(searchValue, [ string ]);
			if (matched === null) {
				break;
			}
			if (global === true) {
				var thisIndex = searchValue.Get("lastIndex");
				if (thisIndex === previousLastIndex) {
					searchValue.Put("lastIndex", thisIndex + 1);
					previousLastIndex = thisIndex + 1;
				}
				else {
					previousLastIndex = thisIndex;
				}
			}
			var indx = matched.Get("index");
			var len = matched.Get("length");
			var args = [];
			for (var i = 0; i < len; i++) {
				args[i] = matched.Get(ToString(i));
			}
			var newstring = convertingReplaceValue(indx, args);
			result = result + string.substring(endIndex, indx) + newstring;
			endIndex = indx + args[0].length;
			if (global !== true) {
				break;
			}
		}
		return result + string.substring(endIndex);
	}
	else {
		var searchString = ToString(searchValue);
		var indx = String_prototype_indexOf(string, [ searchString ]);
		if (indx < 0) return string;
		var newstring = convertingReplaceValue(indx, [ searchString ]);
		var endIndex = indx + searchString.length;
		return string.substring(0, indx) + newstring + string.substring(endIndex);
	}

	function convertingReplaceValue(indx, args) {
		var m = args.length - 1;
		if (Type(replaceValue) === TYPE_Object && replaceValue.Class === "Function") {
			var newstring = replaceValue.Call(undefined, args.concat(indx, string));
		}
		else {
			var newstring = ToString(replaceValue);
			var buffer = [];
			for (var i = 0; i < newstring.length; i++) {
				var c = newstring[i];
				if (c === '$') {
					var a = newstring[i + 1];
					if (a === '$') {
						buffer.push('$');
						i++;
					}
					else if (a === '&') {
						buffer.push(args[0]);
						i++;
					}
					else if (a === "`") {
						buffer.push(string.substring(0, indx));
						i++;
					}
					else if (a === "'") {
						buffer.push(string.substring(indx + args[0].length));
						i++;
					}
					else {
						var x = mvDigitChar(a);
						var y = mvDigitChar(newstring[i + 2]);
						if (x === 0 && y === 0) {
							buffer.push('$');
						}
						else if ((0 <= x) && (x <= 9) && (0 <= y) && (y <= 9)) {
							var nn = x * 10 + y;
							if (nn <= m) {
								var c = args[nn];
								if (c !== undefined) {
									buffer.push(c);
									i += 2;
								}
							}
							else // implementation defined behavior
							if ((0 < x) && (x <= m)) {
								var c = args[x];
								if (c !== undefined) {
									buffer.push(c);
								}
								i++;
							}
							else {
								i += 2;
							}
						}
						else if ((1 <= x) && (x <= 9)) {
							if (x <= m) {
								var c = args[x];
								if (c !== undefined) {
									buffer.push(c);
								}
								i++;
							}
							else {
								i++;
							}
						}
						else {
							buffer.push('$');
						}
					}
				}
				else {
					buffer.push(c);
				}
			}
			var newstring = join(buffer);
		}
		return newstring;
	}
}

function String_prototype_search(thisValue, argumentsList) {
	var regexp = argumentsList[0];
	CheckObjectCoercible(thisValue);
	var string = ToString(thisValue);
	if (Type(regexp) === TYPE_Object && regexp.Class === "RegExp") {
		var rx = regexp;
	}
	else {
		var rx = RegExp_Construct([ regexp ]);
	}
	var result = -1;
	for (var i = 0; i <= string.length; i++) {
		var r = rx.Match(string, i);
		if (r !== failure) {
			var result = i;
			break;
		}
	}
	return result;
}

function String_prototype_slice(thisValue, argumentsList) {
	var start = argumentsList[0];
	var end = argumentsList[1];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var len = S.length;
	var intStart = ToInteger(start);
	if (end === undefined) {
		var intEnd = len;
	}
	else {
		var intEnd = ToInteger(end);
	}
	if (intStart < 0) {
		var from = max(len + intStart, 0);
	}
	else {
		var from = min(intStart, len);
	}
	if (intEnd < 0) {
		var to = max(len + intEnd, 0);
	}
	else {
		var to = min(intEnd, len);
	}
	var span = max(to - from, 0);
	return S.substring(from, from + span);
}

function String_prototype_split(thisValue, argumentsList) {
	var separator = argumentsList[0];
	var limit = argumentsList[1];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var A = Array_Construct([]);
	var lengthA = 0;
	if (limit === undefined) {
		var lim = 0xffffffff;
	}
	else {
		var lim = ToUint32(limit);
	}
	var s = S.length;
	var p = 0;
	if (Type(separator) === TYPE_Object && separator.Class === "RegExp") {
		var R = separator;
	}
	else {
		var R = ToString(separator);
	}
	if (lim === 0) return A;
	if (separator === undefined) {
		A.DefineOwnProperty("0", PropertyDescriptor({
			Value : S,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		return A;
	}
	if (s === 0) {
		var z = SplitMatch(S, 0, R);
		if (z !== failure) return A;
		A.DefineOwnProperty("0", PropertyDescriptor({
			Value : S,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		return A;
	}
	var q = p;
	while (q !== s) {
		var z = SplitMatch(S, q, R);
		if (z === failure) {
			var q = q + 1;
		}
		else {
			var e = z.endIndex;
			var cap = z.captures;
			if (e === p) {
				var q = q + 1;
			}
			else {
				var T = S.substring(p, q);
				A.DefineOwnProperty(ToString(lengthA), PropertyDescriptor({
					Value : T,
					Writable : true,
					Enumerable : true,
					Configurable : true
				}), false);
				lengthA++;
				if (lengthA === lim) return A;
				var p = e;
				var i = 0;
				while (i !== cap.length) {
					var i = i + 1;
					A.DefineOwnProperty(ToString(lengthA), PropertyDescriptor({
						Value : cap[i],
						Writable : true,
						Enumerable : true,
						Configurable : true
					}), false);
					lengthA++;
					if (lengthA === lim) return A;
				}
				var q = p;
			}
		}
	}
	var T = S.substring(p, s);
	A.DefineOwnProperty(ToString(lengthA), PropertyDescriptor({
		Value : T,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), false);
	return A;

	function SplitMatch(S, q, R) {
		if (Type(R) === TYPE_Object && R.Class === "RegExp") return R.Match(S, q);
		assertEquals(Type(R) , TYPE_String, R);
		var r = R.length;
		var s = S.length;
		if (q + r > s) return failure;
		if (S.substring(q, q + r) !== R) return failure;
		var cap = [];
		return State(q + r, cap);
	}
}

function String_prototype_substring(thisValue, argumentsList) {
	var start = argumentsList[0];
	var end = argumentsList[1];
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var len = S.length;
	var intStart = ToInteger(start);
	if (end === undefined) {
		var intEnd = len;
	}
	else {
		var intEnd = ToInteger(end);
	}
	var finalStart = min(max(intStart, 0), len);
	var finalEnd = min(max(intEnd, 0), len);
	var from = min(finalStart, finalEnd);
	var to = max(finalStart, finalEnd);
	return S.substring(from, to);
}

function String_prototype_toLowerCase(thisValue, argumentsList) {
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	return S.toLowerCase();
}

function String_prototype_toLocaleLowerCase(thisValue, argumentsList) {
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	return S.toLocaleLowerCase();
}

function String_prototype_toUpperCase(thisValue, argumentsList) {
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	return S.toUpperCase();
}

function String_prototype_toLocaleUpperCase(thisValue, argumentsList) {
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	return S.toLocaleUpperCase();
}

function String_prototype_trim(thisValue, argumentsList) {
	CheckObjectCoercible(thisValue);
	var S = ToString(thisValue);
	var from = 0;
	while (from !== S.length && (isWhiteSpace(S[from]) || isLineTerminator(S[from]))) {
		from++;
	}
	var to = S.length;
	while (to !== from && (isWhiteSpace(S[to - 1]) || isLineTerminator(S[to - 1]))) {
		to--;
	}
	return S.substring(from, to);
}

function String_prototype_substr(thisValue, argumentsList) {
	var start = argumentsList[0];
	var length = argumentsList[1];
	// specification Bug 350
	CheckObjectCoercible(thisValue);
	// end of bug fix
	var Result1 = ToString(thisValue);
	var Result2 = ToInteger(start);
	if (length === undefined) {
		var Result3 = Infinity;
	}
	else {
		var Result3 = ToInteger(length);
	}
	var Result4 = Result1.length;
	if (Result2 >= 0) {
		var Result5 = Result2;
	}
	else {
		var Result5 = max(Result4 + Result2, 0);
	}
	var Result6 = min(max(Result3, 0), Result4 - Result5);
	if (Result6 <= 0) return "";
	return Result1.substring(Result5, Result5 + Result6);
}

function StringObject_GetOwnProperty(P) {
	var S = this;
	var desc = default_GetOwnProperty.call(S, P);
	if (desc !== undefined) return desc;
	var index = ToInteger(P);
	if (ToString(index) !== P) return undefined;
	var str = S.PrimitiveValue;
	var len = str.length;
	if (len <= index) return undefined;
	var resultStr = str[index];
	return PropertyDescriptor({
		Value : resultStr,
		Enumerable : true,
		Writable : false,
		Configurable : false
	});
}

function StringObject_enumerator(ownOnly, enumerableOnly) {
	var S = this;
	var next = intrinsic_enumerator(S, ownOnly, enumerableOnly);
	var str = S.PrimitiveValue;
	var i = 0;
	var len = str.length;
	return function() {
		if (i < len) return ToString(i++);
		return next();
	};
}
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

// ECMAScript 5.1: 9 Type Conversion and Testing

function ToPrimitive(input, hint) {
	if (Type(input) === TYPE_Object) return input.DefaultValue(hint);
	return input;
}

function ToBoolean(input) {
	switch (Type(input)) {
	case TYPE_Undefined:
	case TYPE_Null:
		return false;
	case TYPE_Boolean:
		return input;
	case TYPE_Number:
		if (input === 0 || isNaN(input)) return false;
		return true;
	case TYPE_String:
		if (input === "") return false;
		return true;
	case TYPE_Object:
		return true;
	}
}

function ToNumber(input) {
	switch (Type(input)) {
	case TYPE_Undefined:
		return NaN;
	case TYPE_Null:
		return 0;
	case TYPE_Boolean:
		if (input === true) return 1;
		return 0;
	case TYPE_Number:
		return input;
	case TYPE_String:
		return ToNumberFromString(input);
	case TYPE_Object:
		var primValue = input.DefaultValue(TYPE_Number);
		return ToNumber(primValue);
	}
}

function ToNumberFromString(input) {
	var currentPos = 0;
	var current = input[0];
	var lookahead = input[1];
	skipStrWhiteSpaces();
	if (current === undefined) {
		return 0;
	}
	var startPos = currentPos;
	if (current === '0' && (lookahead === 'X' || lookahead === 'x')) {
		proceed(2);
		if (!isHexDigitChar(current)) return NaN;
		while (isHexDigitChar(current)) {
			proceed();
		}
	}
	else {
		if (current === '+' || current === '-') {
			proceed();
		}
		if (current === 'I' && input.substring(currentPos, currentPos + 8) === "Infinity") {
			proceed(8);
		}
		else {
			if (current === '.' && !isDecimalDigitChar(lookahead)) return NaN;
			while (isDecimalDigitChar(current)) {
				proceed();
			}
			if (current === '.') {
				proceed();
				while (isDecimalDigitChar(current)) {
					proceed();
				}
			}
			if (current === 'E' || current === 'e') {
				proceed();
				if (current === '+' || current === '-') {
					proceed();
				}
				if (!isDecimalDigitChar(current)) return NaN;
				while (isDecimalDigitChar(current)) {
					proceed();
				}
			}
		}
	}
	var v = Number(input.substring(startPos, currentPos));
	skipStrWhiteSpaces();
	if (current !== undefined) {
		return NaN;
	}
	return v;

	function skipStrWhiteSpaces() {
		while (isWhiteSpace(current) || isLineTerminator(current)) {
			proceed();
		}
	}

	function proceed(count) {
		if (count === undefined) count = 1;
		var c = current;
		while (count-- !== 0) {
			currentPos++;
			current = lookahead;
			lookahead = input[currentPos + 1];
		}
		return c;
	}
}

function ToInteger(input) {
	var number = ToNumber(input);
	if (isNaN(number)) return 0;
	if (number === 0) return number;
	if (number < 0) return -floor(-number);
	return floor(number);
}

function ToInt32(input) {
	var number = ToNumber(input);
	return (number >> 0);
}

function ToUint32(input) {
	var number = ToNumber(input);
	return (number >>> 0);
}

function ToUint16(input) {
	var number = ToNumber(input);
	return ((number >>> 0) & 0xffff);
}

function ToString(input) {
	switch (Type(input)) {
	case TYPE_Undefined:
		return "undefined";
	case TYPE_Null:
		return "null";
	case TYPE_Boolean:
		if (input === true) return "true";
		return "false";
	case TYPE_Number:
		return String(input);
	case TYPE_String:
		return input;
	case TYPE_Object:
		var primValue = input.DefaultValue(TYPE_String);
		return ToString(primValue);
	}
}

function ToObject(input) {
	switch (Type(input)) {
	case TYPE_Undefined:
		throw VMTypeError("undefined");
	case TYPE_Null:
		throw VMTypeError("null");
	case TYPE_Boolean:
		return Boolean_Construct([ input ]);
	case TYPE_Number:
		return Number_Construct([ input ]);
	case TYPE_String:
		return String_Construct([ input ]);
	case TYPE_Object:
		return input;
	}
	assert(false, input);
}

function CheckObjectCoercible(input) {
	switch (Type(input)) {
	case TYPE_Undefined:
		throw VMTypeError("undefined");
	case TYPE_Null:
		throw VMTypeError("null");
	}
}

function IsCallable(input) {
	if (Type(input) === TYPE_Object) {
		if (input.Call !== undefined) return true;
	}
	return false;
}

function SameValue(x, y) {
	if (Type(x) !== Type(y)) return false;
	switch (Type(x)) {
	case TYPE_Undefined:
	case TYPE_Null:
		return true;
	case TYPE_Boolean:
	case TYPE_String:
	case TYPE_Object:
		return (x === y);
	case TYPE_Number:
		if (x === y) {
			if (x === 0 && 1 / (x * y) === -Infinity) return false;
			return true;
		}
		else {
			if (isNaN(x) && isNaN(y)) return true;
			return false;
		}
	}
	assert(false, x);
}
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

// ECMAScript 5.1: 10 Executable Code and Execution Contexts

var DeclarativeEnvironmentRecordClass = freeze({
	// $attributes
	// 0: Mutable Deletable
	// 1: Mutable Undeletable
	// 2: Immutable Initialized
	// 3: Immutable Uninitialized

	HasBinding : function(N) {
		if (this.$attributes[N] !== undefined) return true;
		return false;
	},

	CreateMutableBinding : function(N, D) {
		assertEquals(this.$attributes[N], undefined, N);
		if (D === true) {
			this.$attributes[N] = 0;
		}
		else {
			this.$attributes[N] = 1;
		}
	},

	SetMutableBinding : function(N, V, S) {
		if (this.$attributes[N] === undefined) return;
		if (this.$attributes[N] <= 1) {
			this.$values[N] = V;
		}
		else throw VMTypeError(N);
	},

	GetBindingValue : function(N, S) {
		assert(this.$attributes[N] !== undefined, N);
		if (this.$attributes[N] === 3) {
			if (S === false) return undefined;
			throw VMReferenceError(N);
		}
		return this.$values[N];
	},

	DeleteBinding : function(N) {
		if (this.$attributes[N] === undefined) return true;
		if (this.$attributes[N] !== 0) return false;
		delete (this.$values[N]);
		delete (this.$attributes[N]);
		return true;
	},

	ImplicitThisValue : function() {
		return undefined;
	},

	CreateImmutableBinding : function(N) {
		assertEquals(this.$attributes[N], undefined, N);
		this.$attributes[N] = 3;
	},

	InitializeImmutableBinding : function(N, V) {
		assertEquals(this.$attributes[N], 3, N);
		this.$values[N] = V;
		this.$attributes[N] = 2;
	},
});

var ObjectEnvironmentRecordClass = freeze({
	HasBinding : function(N) {
		var bindings = this.bindings;
		return bindings.HasProperty(N);
	},

	CreateMutableBinding : function(N, D) {
		var bindings = this.bindings;
		assertEquals(bindings.HasProperty(N), false, N);
		if (D === true) {
			var configValue = true;
		}
		else {
			var configValue = false;
		}
		bindings.DefineOwnProperty(N, PropertyDescriptor({
			Value : undefined,
			Writable : true,
			Enumerable : true,
			Configurable : configValue
		}), true);
	},

	SetMutableBinding : function(N, V, S) {
		var bindings = this.bindings;
		bindings.Put(N, V, S);
	},

	GetBindingValue : function(N, S) {
		var bindings = this.bindings;
		var value = bindings.HasProperty(N);
		if (value === false) {
			if (S === false) return undefined;
			throw VMReferenceError(N);
		}
		return bindings.Get(N);
	},

	DeleteBinding : function(N) {
		var bindings = this.bindings;
		return bindings.Delete(N, false);
	},

	ImplicitThisValue : function() {
		if (this.provideThis === true) return this.bindings;
		return undefined;
	},
});

function GetIdentifierReference(lex, name, strict) {
	if (lex === null) return ReferenceValue(undefined, name, strict);
	var envRec = lex.environmentRecord;
	var exists = envRec.HasBinding(name);
	if (exists === true) return ReferenceValue(envRec, name, strict);
	else {
		var outer = lex.outer;
		return GetIdentifierReference(outer, name, strict);
	}
}

function DeclarativeEnvironmentRecord() {
	var obj = Object.create(DeclarativeEnvironmentRecordClass);
	obj.$values = Object.create(null);
	obj.$attributes = Object.create(null);
	return preventExtensions(obj);
}

function ObjectEnvironmentRecord(bindings) {
	var obj = Object.create(ObjectEnvironmentRecordClass);
	obj.bindings = bindings;
	obj.provideThis = false;
	return preventExtensions(obj);
}

function NewDeclarativeEnvironment(E) {
	if (DeclarativeEnvironmentClass === undefined) {
		DeclarativeEnvironmentClass = freeze({
			walkObject : DeclarativeEnvironment_walkObject,
			writeObject : DeclarativeEnvironment_writeObject,
			readObject : DeclarativeEnvironment_readObject,
			ClassID : CLASSID_DeclarativeEnvironment,
		});
	}
	var obj = Object.create(DeclarativeEnvironmentClass);
	obj.environmentRecord = DeclarativeEnvironmentRecord();
	obj.outer = E;
	obj.ID = 0;
	return preventExtensions(obj);
}

function NewObjectEnvironment(O, E) {
	if (ObjectEnvironmentClass === undefined) {
		ObjectEnvironmentClass = freeze({
			walkObject : ObjectEnvironment_walkObject,
			writeObject : ObjectEnvironment_writeObject,
			readObject : ObjectEnvironment_readObject,
			ClassID : CLASSID_ObjectEnvironment,
		});
	}
	var obj = Object.create(ObjectEnvironmentClass);
	obj.environmentRecord = ObjectEnvironmentRecord(O);
	obj.outer = E;
	obj.ID = 0;
	return preventExtensions(obj);
}

var LexicalEnvironment;
var VariableEnvironment;
var ThisBinding;

var runningCode;
var runningSourcePos;
var outerExecutionContext;

function initExecutionContext() {
	LexicalEnvironment = theGlobalEnvironment;
	VariableEnvironment = theGlobalEnvironment;
	ThisBinding = theGlobalObject;
	runningCode = undefined;
	runningSourcePos = undefined;
	outerExecutionContext = undefined;
}

function saveExecutionContext() {
	outerExecutionContext = preventExtensions({
		LexicalEnvironment : LexicalEnvironment,
		VariableEnvironment : VariableEnvironment,
		ThisBinding : ThisBinding,
		runningCode : runningCode,
		runningSourcePos : runningSourcePos,
		outerExecutionContext : outerExecutionContext,
	});
}

function exitExecutionContext() {
	var ctx = outerExecutionContext;
	LexicalEnvironment = ctx.LexicalEnvironment;
	VariableEnvironment = ctx.VariableEnvironment;
	ThisBinding = ctx.ThisBinding;
	runningCode = ctx.runningCode;
	runningSourcePos = ctx.runningSourcePos;
	outerExecutionContext = ctx.outerExecutionContext;
}

function getStackTrace() {
	var stackTrace = [];
	if (runningCode !== undefined) {
		stackTrace.push({
			code : runningCode,
			pos : runningSourcePos,
		});
		var ctx = outerExecutionContext;
		while (ctx.runningCode !== undefined) {
			stackTrace.push({
				code : ctx.runningCode,
				pos : ctx.runningSourcePos,
			});
			var ctx = ctx.outerExecutionContext;
		}
	}
	return stackTrace;
}

function enterExecutionContextForGlobalCode(code) {
	saveExecutionContext();
	LexicalEnvironment = theGlobalEnvironment;
	VariableEnvironment = theGlobalEnvironment;
	ThisBinding = theGlobalObject;
	runningCode = code;
	runningSourcePos = 0;
	DeclarationBindingInstantiation(code);
}

function enterExecutionContextForEvalCode(code, direct) {
	saveExecutionContext();
	if (direct !== true) {
		LexicalEnvironment = theGlobalEnvironment;
		VariableEnvironment = theGlobalEnvironment;
		ThisBinding = theGlobalObject;
	}
	if (code.strict) {
		var strictVarEnv = NewDeclarativeEnvironment(LexicalEnvironment);
		LexicalEnvironment = strictVarEnv;
		VariableEnvironment = strictVarEnv;
	}
	runningCode = code;
	runningSourcePos = 0;
	DeclarationBindingInstantiation(code);
}

function enterExecutionContextForFunctionCode(F, thisValue, argumentsList) {
	saveExecutionContext();
	var code = F.Code;
	if (code.strict) {
		ThisBinding = thisValue;
	}
	else if (thisValue === null || thisValue === undefined) {
		ThisBinding = theGlobalObject;
	}
	else if (Type(thisValue) !== TYPE_Object) {
		ThisBinding = ToObject(thisValue);
	}
	else {
		ThisBinding = thisValue;
	}
	var localEnv = NewDeclarativeEnvironment(F.Scope);
	LexicalEnvironment = localEnv;
	VariableEnvironment = localEnv;
	runningCode = code;
	runningSourcePos = 0;
	DeclarationBindingInstantiation(code, argumentsList, F);
}

function DeclarationBindingInstantiation(code, args, func) {
	var env = VariableEnvironment.environmentRecord;
	if (code.isEvalCode) {
		var configurableBindings = true;
	}
	else {
		var configurableBindings = false;
	}
	if (code.strict) {
		var strict = true;
	}
	else {
		var strict = false;
	}
	if (code.isFunctionCode) {
		var names = func.FormalParameters;
		var n = 0;
		for (var i = 0; i < names.length; i++) {
			var argName = names[i];
			var v = args[n++];
			var argAlreadyDeclared = env.HasBinding(argName);
			if (argAlreadyDeclared === false) {
				env.CreateMutableBinding(argName);
			}
			env.SetMutableBinding(argName, v, strict);
		}
	}
	var functions = code.functions;
	for (var i = 0; i < functions.length; i++) {
		var f = functions[i];
		var fn = f.name;
		var fo = f.instantiate();
		var funcAlreadyDeclared = env.HasBinding(fn);
		if (funcAlreadyDeclared === false) {
			env.CreateMutableBinding(fn, configurableBindings);
		}
		else if (env === theGlobalEnvironment.envRec) {
			var go = theGlobalObject;
			var existingProp = go.GetProperty(fn);
			if (existingProp.Configurable === true) {
				go.DefineOwnProperty(fn, PropertyDescriptor({
					Value : undefined,
					Writable : true,
					Enumerable : true,
					Configurable : configurableBindings
				}), true);
			}
			else if (IsAccessorDescriptor(existingProp) || !(existingProp.Writable === true && existingProp.Enumerable === true))
				throw VMTypeError();
		}
		env.SetMutableBinding(fn, fo, strict);
	}
	var argumentsAlreadyDeclared = env.HasBinding("arguments");
	if (code.isFunctionCode && argumentsAlreadyDeclared === false && (code.existsDirectEval || code.existsArgumentsRef)) {
		var argsObj = CreateArgumentsObject(func, names, args, VariableEnvironment, strict);
		if (strict === true) {
			env.CreateImmutableBinding("arguments");
			env.InitializeImmutableBinding("arguments", argsObj);
		}
		else {
			env.CreateMutableBinding("arguments");
			env.SetMutableBinding("arguments", argsObj, false);
		}
	}
	var variables = code.variables;
	for (var i = 0; i < variables.length; i++) {
		var dn = variables[i];
		var varAlreadyDeclared = env.HasBinding(dn);
		if (varAlreadyDeclared === false) {
			env.CreateMutableBinding(dn);
			env.SetMutableBinding(dn, undefined, strict);
		}
	}
}

function CreateArgumentsObject(func, names, args, env, strict) {
	var len = args.length;
	if (strict === true || len === 0 || names.length === 0) {
		var obj = VMObject(CLASSID_PlainArguments);
	}
	else {
		var obj = VMObject(CLASSID_Arguments);
	}
	obj.Prototype = builtin_Object_prototype;
	obj.Extensible = true;
	default_DefineOwnProperty.call(obj, "length", PropertyDescriptor({
		Value : len,
		Writable : true,
		Enumerable : false,
		Configurable : true
	}), false);
	var map = [];
	var mappedNames = [];
	var indx = len - 1;
	while (indx >= 0) {
		var val = args[indx];
		default_DefineOwnProperty.call(obj, ToString(indx), PropertyDescriptor({
			Value : val,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		if (indx < names.length) {
			var name = names[indx];
			if (strict === false && isIncluded(name, mappedNames) === false) {
				mappedNames.push(name);
				map[indx] = name;
			}
		}
		var indx = indx - 1;
	}
	if (mappedNames.length !== 0) {
		obj.ParameterMap = map;
		obj.ArgumentsScope = env;
	}
	if (strict === false) {
		obj.DefineOwnProperty("callee", PropertyDescriptor({
			Value : func,
			Writable : true,
			Enumerable : false,
			Configurable : true
		}), false);
	}
	else {
		var thrower = theThrowTypeError;
		obj.DefineOwnProperty("caller", PropertyDescriptor({
			Get : thrower,
			Set : thrower,
			Enumerable : false,
			Configurable : false
		}), false);
		obj.DefineOwnProperty("callee", PropertyDescriptor({
			Get : thrower,
			Set : thrower,
			Enumerable : false,
			Configurable : false
		}), false);
	}
	return obj;
}

function ArgGet(env, name) {
	var ref = GetIdentifierReference(env, name, false);
	return GetValue(ref);
}

function ArgSet(env, name, value) {
	var ref = GetIdentifierReference(env, name, false);
	PutValue(ref, value);
}

function Arguments_Get(P) {
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	if (isMapped === undefined) {
		var v = default_Get.call(this, P);
		if (P === "caller" && Type(v) === TYPE_Object && v.Class === "Function" && v.Code !== undefined && v.Code.strict)
			throw VMTypeError();
		return v;
	}
	else {
		return ArgGet(this.ArgumentsScope, isMapped);
	}
}

function Arguments_GetOwnProperty(P) {
	var desc = default_GetOwnProperty.call(this, P);
	if (desc === undefined) return desc;
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	if (isMapped !== undefined) {
		desc = PropertyDescriptor({
			Value : ArgGet(this.ArgumentsScope, isMapped),
			Writable : desc.Writable,
			Configurable : desc.Configurable,
			Enumerable : desc.Enumerable,
		});
	}
	return desc;
}

function Arguments_DefineOwnProperty(P, Desc, Throw) {
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	var allowed = default_DefineOwnProperty.call(this, P, Desc, false);
	if (allowed === false) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (isMapped !== undefined) {
		if (IsAccessorDescriptor(Desc) === true) {
			map[P] = undefined;
		}
		else {
			if (Desc.Value !== absent) {
				ArgSet(this.ArgumentsScope, isMapped, Desc.Value);
			}
			if (Desc.Writable === false) {
				map[P] = undefined;
			}
		}
	}
	return true;
}

function Arguments_Delete(P, Throw) {
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	var result = default_Delete.call(this, P, Throw);
	if (result === true && isMapped !== undefined) {
		map[P] = undefined;
	}
	return result;
}
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

// ECMAScript 5.1: 11 Expressions

function ThisExpression() {
	return function() {
		return ThisBinding;
	};
}

function IdentifierReference(identifier, strict) {
	return function() {
		var env = LexicalEnvironment;
		return GetIdentifierReference(env, identifier, strict);
	};
}

function Literal(value) {
	return function() {
		return value;
	};
}

function RegExpLiteral(regexp) {
	return function() {
		return RegExp_Construct([ regexp ]);
	};
}

function ArrayInitialiser(elements) {
	return function() {
		var array = Array_Construct([]);
		for (var i = 0; i < elements.length; i++) {
			var e = elements[i];
			if (e !== empty) {
				var initResult = e();
				var initValue = GetValue(initResult);
				array.DefineOwnProperty(ToString(i), PropertyDescriptor({
					Value : initValue,
					Writable : true,
					Enumerable : true,
					Configurable : true
				}), false);
			}
		}
		if (e === empty) {
			array.Put("length", i - 1, false);
		}
		return array;
	};
}

function ObjectInitialiser(elements) {
	return function() {
		var obj = Object_Construct([]);
		for (var i = 0; i < elements.length; i++) {
			elements[i](obj);
		}
		return obj;
	};
}

function PropertyAssignment(name, expression) {
	return function(obj) {
		var exprValue = expression();
		var propValue = GetValue(exprValue);
		var desc = PropertyDescriptor({
			Value : propValue,
			Writable : true,
			Enumerable : true,
			Configurable : true
		});
		obj.DefineOwnProperty(name, desc, false);
	};
}

function PropertyAssignmentGet(name, body) {
	return function(obj) {
		var env = LexicalEnvironment;
		var closure = FunctionObject([], body, env, body.strict);
		var desc = PropertyDescriptor({
			Get : closure,
			Enumerable : true,
			Configurable : true
		});
		obj.DefineOwnProperty(name, desc, false);
	};
}

function PropertyAssignmentSet(name, parameter, body) {
	return function(obj) {
		var env = LexicalEnvironment;
		var closure = FunctionObject([ parameter ], body, env, body.strict);
		var desc = PropertyDescriptor({
			Set : closure,
			Enumerable : true,
			Configurable : true
		});
		obj.DefineOwnProperty(name, desc, false);
	};
}

function PropertyAccessor(base, name, strict) {
	return function() {
		var baseReference = base();
		var baseValue = GetValue(baseReference);
		var propertyNameReference = name();
		var propertyNameValue = GetValue(propertyNameReference);
		CheckObjectCoercible(baseValue);
		var propertyNameString = ToString(propertyNameValue);
		return ReferenceValue(baseValue, propertyNameString, strict);
	};
}

function NewOperator(expression, args) {
	return function() {
		var ref = expression();
		var constructor = GetValue(ref);
		var argList = evaluateArguments(args);
		if (Type(constructor) !== TYPE_Object) throw VMTypeError();
		if (constructor.Construct === undefined) throw VMTypeError();
		return constructor.Construct(argList);
	};
}

function FunctionCall(expression, args, strict) {
	return function() {
		var ref = expression();
		var func = GetValue(ref);
		var argList = evaluateArguments(args);
		if (Type(func) !== TYPE_Object) throw VMTypeError();
		if (!IsCallable(func)) throw VMTypeError();
		if (Type(ref) === TYPE_Reference) {
			if (IsPropertyReference(ref)) {
				var thisValue = GetBase(ref);
			}
			else {
				var thisValue = GetBase(ref).ImplicitThisValue();
				if (func === theEvalFunction && GetReferencedName(ref) === "eval") return Global_eval(thisValue, argList, true, strict);
			}
		}
		return func.Call(thisValue, argList);
	};
}

function evaluateArguments(args) {
	var argList = [];
	for (var i = 0; i < args.length; i++) {
		var ref = args[i]();
		var arg = GetValue(ref);
		argList.push(arg);
	}
	return argList;
}

function PostfixIncrementOperator(expression) {
	return function() {
		var lhs = expression();
		var oldValue = ToNumber(GetValue(lhs));
		var newValue = oldValue + 1;
		PutValue(lhs, newValue);
		return oldValue;
	};
}

function PostfixDecrementOperator(expression) {
	return function() {
		var lhs = expression();
		var oldValue = ToNumber(GetValue(lhs));
		var newValue = oldValue - 1;
		PutValue(lhs, newValue);
		return oldValue;
	};
}

function deleteOperator(expression) {
	return function() {
		var ref = expression();
		if (Type(ref) !== TYPE_Reference) return true;
		if (IsUnresolvableReference(ref)) return true;
		if (IsPropertyReference(ref)) return ToObject(GetBase(ref)).Delete(GetReferencedName(ref), IsStrictReference(ref));
		else {
			var bindings = GetBase(ref);
			return bindings.DeleteBinding(GetReferencedName(ref));
		}
	};
}

function voidOperator(expression) {
	return function() {
		var expr = expression();
		GetValue(expr);
		return undefined;
	};
}

function typeofOperator(expression) {
	return function() {
		var val = expression();
		if (Type(val) === TYPE_Reference) {
			if (IsUnresolvableReference(val)) return "undefined";
			val = GetValue(val);
		}
		switch (Type(val)) {
		case TYPE_Undefined:
			return "undefined";
		case TYPE_Null:
			return "object";
		case TYPE_Boolean:
			return "boolean";
		case TYPE_Number:
			return "number";
		case TYPE_String:
			return "string";
		case TYPE_Object:
			if (IsCallable(val)) return "function";
			return "object";
		}
	};
}

function PrefixIncrementOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToNumber(GetValue(expr));
		var newValue = oldValue + 1;
		PutValue(expr, newValue);
		return newValue;
	};
}

function PrefixDecrementOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToNumber(GetValue(expr));
		var newValue = oldValue - 1;
		PutValue(expr, newValue);
		return newValue;
	};
}

function PlusOperator(expression) {
	return function() {
		var expr = expression();
		return ToNumber(GetValue(expr));
	};
}

function MinusOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToNumber(GetValue(expr));
		return -oldValue;
	};
}

function BitwiseNOTOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToInt32(GetValue(expr));
		return ~oldValue;
	};
}

function LogicalNOTOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToBoolean(GetValue(expr));
		if (oldValue === true) return false;
		return true;
	};
}

function MultiplicativeOperator(operator, leftExpression, rightExpression) {
	return function() {
		var left = leftExpression();
		var leftValue = GetValue(left);
		var right = rightExpression();
		var rightValue = GetValue(right);
		var leftNum = ToNumber(leftValue);
		var rightNum = ToNumber(rightValue);
		switch (operator) {
		case '*':
			return leftNum * rightNum;
		case '/':
			return leftNum / rightNum;
		case '%':
			return leftNum % rightNum;
		}
	};
}

function AdditionOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lprim = ToPrimitive(lval);
		var rprim = ToPrimitive(rval);
		if (Type(lprim) === TYPE_String || Type(rprim) === TYPE_String) return ToString(lprim) + ToString(rprim);
		else return ToNumber(lprim) + ToNumber(rprim);
	};
}

function SubtractionOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToNumber(lval);
		var rnum = ToNumber(rval);
		return lnum - rnum;
	};
}

function LeftShiftOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToInt32(lval);
		var rnum = ToUint32(rval);
		var shiftCount = rnum & 0x1F;
		return lnum << shiftCount;
	};
}

function SignedRightShiftOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToInt32(lval);
		var rnum = ToUint32(rval);
		var shiftCount = rnum & 0x1F;
		return lnum >> shiftCount;
	};
}

function UnsignedRightShiftOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToUint32(lval);
		var rnum = ToUint32(rval);
		var shiftCount = rnum & 0x1F;
		return lnum >>> shiftCount;
	};
}

function LessThanOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(lval, rval);
		if (r === undefined) return false;
		return r;
	};
}

function GreaterThanOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(rval, lval, false);
		if (r === undefined) return false;
		return r;
	};
}

function LessThanOrEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(rval, lval, false);
		if (r === true || r === undefined) return false;
		return true;
	};
}

function GreaterThanOrEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(lval, rval);
		if (r === true || r === undefined) return false;
		return true;
	};
}

function abstractRelationalComparison(x, y, LeftFirst) {
	if (LeftFirst !== false) {
		var px = ToPrimitive(x, TYPE_Number);
		var py = ToPrimitive(y, TYPE_Number);
	}
	else {
		var py = ToPrimitive(y, TYPE_Number);
		var px = ToPrimitive(x, TYPE_Number);
	}
	if (!(Type(px) === TYPE_String && Type(py) === TYPE_String)) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if (isNaN(nx)) return undefined;
		if (isNaN(ny)) return undefined;
		return (nx < ny);
	}
	else return (px < py);
}

function instanceofOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		if (Type(rval) !== TYPE_Object) throw VMTypeError();
		if (rval.HasInstance === undefined) throw VMTypeError();
		return rval.HasInstance(lval);
	};
}

function inOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		if (Type(rval) !== TYPE_Object) throw VMTypeError();
		return rval.HasProperty(ToString(lval));
	};
}

function EqualsOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		return abstractEqualityComparison(lval, rval);
	};
}

function DoesNotEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractEqualityComparison(lval, rval);
		if (r === true) return false;
		return true;
	};
}

function abstractEqualityComparison(x, y) {
	if (Type(x) === Type(y)) return (x === y);
	if (x === null && y === undefined) return true;
	if (x === undefined && y === null) return true;
	if (Type(x) === TYPE_Number && Type(y) === TYPE_String) return abstractEqualityComparison(x, ToNumber(y));
	if (Type(x) === TYPE_String && Type(y) === TYPE_Number) return abstractEqualityComparison(ToNumber(x), y);
	if (Type(x) === TYPE_Boolean) return abstractEqualityComparison(ToNumber(x), y);
	if (Type(y) === TYPE_Boolean) return abstractEqualityComparison(x, ToNumber(y));
	if ((Type(x) === TYPE_String || Type(x) === TYPE_Number) && Type(y) === TYPE_Object)
		return abstractEqualityComparison(x, ToPrimitive(y));
	if (Type(x) === TYPE_Object && (Type(y) === TYPE_String || Type(y) === TYPE_Number))
		return abstractEqualityComparison(ToPrimitive(x), y);
	return false;
}

function StrictEqualsOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		return (lval === rval);
	};
}

function StrictDoesNotEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		if (lval === rval) return false;
		return true;
	};
}

function BinaryBitwiseOperator(operator, leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToInt32(lval);
		var rnum = ToInt32(rval);
		switch (operator) {
		case '&':
			return lnum & rnum;
		case '^':
			return lnum ^ rnum;
		case '|':
			return lnum | rnum;
		}
	};
}

function LogicalAndOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		if (ToBoolean(lval) === false) return lval;
		var rref = rightExpression();
		return GetValue(rref);
	};
}

function LogicalOrOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		if (ToBoolean(lval) === true) return lval;
		var rref = rightExpression();
		return GetValue(rref);
	};
}

function ConditionalOperator(condition, firstExpression, secondExpression) {
	return function() {
		var lref = condition();
		if (ToBoolean(GetValue(lref)) === true) {
			var trueRef = firstExpression();
			return GetValue(trueRef);
		}
		else {
			var falseRef = secondExpression();
			return GetValue(falseRef);
		}
	};
}

function SimpleAssignment(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var rref = rightExpression();
		var rval = GetValue(rref);
		PutValue(lref, rval);
		return rval;
	};
}

function CompoundAssignment(operator, leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		switch (operator) {
		case '*=':
			var r = ToNumber(lval) * ToNumber(rval);
			break;
		case '/=':
			var r = ToNumber(lval) / ToNumber(rval);
			break;
		case '%=':
			var r = ToNumber(lval) % ToNumber(rval);
			break;
		case '+=':
			var lprim = ToPrimitive(lval);
			var rprim = ToPrimitive(rval);
			if (Type(lprim) === TYPE_String || Type(rprim) === TYPE_String) {
				var r = ToString(lprim) + ToString(rprim);
			}
			else {
				var r = ToNumber(lprim) + ToNumber(rprim);
			}
			break;
		case '-=':
			var r = ToNumber(lval) - ToNumber(rval);
			break;
		case '<<=':
			var r = ToInt32(lval) << (ToUint32(rval) & 0x1F);
			break;
		case '>>=':
			var r = ToInt32(lval) >> (ToUint32(rval) & 0x1F);
			break;
		case '>>>=':
			var r = ToUint32(lval) >>> (ToUint32(rval) & 0x1F);
			break;
		case '&=':
			var r = ToInt32(lval) & ToInt32(rval);
			break;
		case '|=':
			var r = ToInt32(lval) | ToInt32(rval);
			break;
		case '^=':
			var r = ToInt32(lval) ^ ToInt32(rval);
			break;
		}
		PutValue(lref, r);
		return r;
	};
}

function CommaOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		GetValue(lref);
		var rref = rightExpression();
		return GetValue(rref);
	};
}
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

var fs = require('fs');

function FileOutputStream(filename, openExists) {
	var capacity = 8192;
	var cacheLen = 0;
	var position = 0;
	var buffer = new Buffer(capacity);
	if (openExists) {
		var fd = fs.openSync(filename, 'r+');
	}
	else {
		var fd = fs.openSync(filename, 'w');
	}

	function getPosition() {
		return position;
	}

	function setPosition(pos) {
		flush();
		position = pos;
		fs.ftruncateSync(fd, position);
	}

	function close() {
		flush();
		try {
			fs.closeSync(fd);
		} catch (e) {
		}
		fd = undefined;
	}

	function fsync() {
		flush();
		fs.fsyncSync(fd);
	}

	function flush() {
		assert(cacheLen <= capacity, cacheLen);
		writeFully(fd, buffer, 0, cacheLen);
		cacheLen = 0;
	}

	function putByte(x) {
		if (cacheLen === capacity) {
			flush();
		}
		buffer[cacheLen++] = x;
	}

	function writeInt(x) {
		assert((typeof x) === "number", x);
		assert(floor(x) === x && x >= 0, x);
		while (true) {
			if (x < 128) {
				putByte(x);
				return;
			}
			putByte((x & 127) + 128);
			x = x >>> 7;
		}
	}

	function writeString(x) {
		assert((typeof x) === "string");
		var length = Buffer.byteLength(x);
		writeInt(length);
		if (capacity < cacheLen + length) {
			flush();
			if (capacity < length) {
				var l = fs.writeSync(fd, x, position);
				position += l;
				assert(l === length);
				return;
			}
		}
		var l = buffer.write(x, cacheLen);
		assert(l === length);
		cacheLen += length;
	}

	function writeBuffer(x) {
		assert(x instanceof Buffer);
		var length = x.length;
		writeInt(length);
		if (capacity < cacheLen + length) {
			flush();
			if (capacity < length) {
				writeFully(fd, x, 0, length);
				return;
			}
		}
		x.copy(buffer, cacheLen);
		cacheLen += length;
	}

	function writeNumber(x) {
		assert((typeof x) === "number");
		if (capacity < cacheLen + 8) {
			flush();
		}
		buffer.writeDoubleLE(x, cacheLen);
		cacheLen += 8;
	}

	function writeAny(x, stack) {
		switch (typeof x) {
		case "undefined":
			writeInt(1);
			return;
		case "boolean":
			writeInt((x === true) ? 2 : 3);
			return;
		case "number":
			writeInt(4);
			writeNumber(x);
			return;
		case "string":
			writeInt(5);
			writeString(x);
			return;
		}
		if (x === null) {
			writeInt(6);
			return;
		}
		if (x instanceof Buffer) {
			writeInt(7);
			writeBuffer(x);
			return;
		}
		if (stack === undefined) stack = [];
		if (isIncluded(x, stack)) {
			writeInt(6);
			return;
		}
		stack.push(x);
		if (x instanceof Array) {
			writeInt(10);
			var length = x.length;
			writeInt(length);
			for (var i = 0; i < length; i++) {
				writeAny(x[i], stack);
			}
		}
		else {
			writeInt(11);
			var keys = Object.keys(x);
			var length = keys.length;
			writeInt(length);
			for (var i = 0; i < length; i++) {
				var P = keys[i];
				writeString(P);
				writeAny(x[P], stack);
			}
		}
		stack.pop();
	}

	function writeFully(fd, buffer, startPos, endPos) {
		for (var i = 0; i < 10000; i++) {
			assert(startPos <= endPos, startPos);
			if (startPos >= endPos) {
				return;
			}
			var l = fs.writeSync(fd, buffer, startPos, endPos - startPos, position);
			position += l;
			startPos += l;
		}
		throw Error("too many retries");
	}

	return {
		getPosition : getPosition,
		setPosition : setPosition,
		writeInt : writeInt,
		writeString : writeString,
		writeBuffer : writeBuffer,
		writeNumber : writeNumber,
		writeAny : writeAny,
		flush : flush,
		fsync : fsync,
		close : close,
	};
}

function FileInputStream(filename) {
	var capacity = 8192;
	var cacheOff = 0;
	var cacheSize = 0;
	var position = 0;
	var buffer = new Buffer(capacity);
	var fd = fs.openSync(filename, 'r');

	function getPosition() {
		return position - cacheSize + cacheOff;
	}

	function setPosition(pos) {
		cacheOff = 0;
		cacheSize = 0;
		position = pos;
	}

	function close() {
		try {
			fs.closeSync(fd);
		} catch (e) {
		}
		fd = undefined;
	}

	function fill(length) {
		if (cacheOff + length <= cacheSize) {
			return;
		}
		assert(cacheOff <= cacheSize);
		if (0 < cacheOff && cacheOff < cacheSize) {
			buffer.copy(buffer, 0, cacheOff, cacheSize);
		}
		cacheSize -= cacheOff;
		cacheOff = 0;
		var l = readFully(fd, buffer, cacheSize, length, capacity);
		cacheSize += l;
		assert(length <= cacheSize && cacheSize <= capacity, cacheSize);
	}

	function getByte(x) {
		fill(1);
		return buffer[cacheOff++];
	}

	function readInt() {
		var x = 0;
		var s = 0;
		while (true) {
			var c = getByte();
			if (c < 128) {
				return x + (c << s);
			}
			x += (c - 128) << s;
			s += 7;
		}
	}

	function readString() {
		var length = readInt();
		if (length > capacity) {
			var b = new Buffer(length);
			if (cacheOff < cacheSize) {
				buffer.copy(b, 0, cacheOff, cacheSize);
			}
			var cached = cacheSize - cacheOff;
			var l = readFully(fd, b, cached, length, length);
			assert(cached + l === length, l);
			cacheOff = 0;
			cacheSize = 0;
			return b.toString();
		}
		fill(length);
		var s = buffer.toString(null, cacheOff, cacheOff + length);
		cacheOff += length;
		return s;
	}

	function readBuffer() {
		var length = readInt();
		var b = new Buffer(length);
		if (length > capacity) {
			if (cacheOff < cacheSize) {
				buffer.copy(b, 0, cacheOff, cacheSize);
			}
			var cached = cacheSize - cacheOff;
			var l = readFully(fd, b, cached, length, length);
			assert(cached + l === length, l);
			cacheOff = 0;
			cacheSize = 0;
			return b;
		}
		fill(length);
		buffer.copy(b, 0, cacheOff, cacheOff + length);
		cacheOff += length;
		return b;
	}

	function readNumber() {
		fill(8);
		var x = buffer.readDoubleLE(cacheOff);
		cacheOff += 8;
		return x;
	}

	function readAny() {
		var type = readInt();
		switch (type) {
		case 1:
			return undefined;
		case 2:
			return true;
		case 3:
			return false;
		case 4:
			return readNumber();
		case 5:
			return readString();
		case 6:
			return null;
		case 7:
			return readBuffer();
		case 10:
			var length = readInt();
			var a = [];
			for (var i = 0; i < length; i++) {
				a[i] = readAny();
			}
			return a;
		case 11:
			var length = readInt();
			var a = {};
			for (var i = 0; i < length; i++) {
				var P = readString();
				a[P] = readAny();
			}
			return a;
		}
		throw Error("file broken");
	}

	function readFully(fd, buffer, startPos, minPos, capacity) {
		var transferred = 0;
		for (var i = 0; i < 10000; i++) {
			assert(startPos <= capacity, startPos);
			if (minPos <= startPos) {
				return transferred;
			}
			var l = fs.readSync(fd, buffer, startPos, capacity - startPos, position);
			if (l === 0) {
				throw Error("end of file");
			}
			position += l;
			startPos += l;
			transferred += l;
		}
		throw Error("too many retries");
	}

	return {
		getPosition : getPosition,
		setPosition : setPosition,
		readInt : readInt,
		readString : readString,
		readBuffer : readBuffer,
		readNumber : readNumber,
		readAny : readAny,
		close : close,
	};
}
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

// ECMAScript 5.1: 13 Function Definition

function FunctionDeclaration(name, parameters, body) {
	return preventExtensions({
		name : name,
		instantiate : function() {
			var env = VariableEnvironment;
			return FunctionObject(parameters, body, env, body.strict);
		}
	});
}

function FunctionExpression(name, parameters, body) {
	if (name === undefined) return function() {
		var env = LexicalEnvironment;
		return FunctionObject(parameters, body, env, body.strict);
	};

	return function() {
		var env = LexicalEnvironment;
		var funcEnv = NewDeclarativeEnvironment(env);
		var envRec = funcEnv.environmentRecord;
		envRec.CreateImmutableBinding(name);
		var closure = FunctionObject(parameters, body, funcEnv, body.strict);
		envRec.InitializeImmutableBinding(name, closure);
		return closure;
	};
}

function FunctionBody(sourceElements) {
	return function() {
		if (sourceElements !== undefined) return sourceElements();
		else return CompletionValue("normal", undefined, empty);
	};
}

function FunctionObject(parameters, body, Scope, Strict) {
	var F = VMObject(CLASSID_FunctionObject);
	F.Prototype = builtin_Function_prototype;
	F.Scope = Scope;
	F.FormalParameters = parameters;
	F.Code = body;
	F.Extensible = true;
	var len = parameters.length;
	F.DefineOwnProperty("length", PropertyDescriptor({
		Value : len,
		Writable : false,
		Enumerable : false,
		Configurable : false
	}), false);
	var proto = Object_Construct([]);
	proto.DefineOwnProperty("constructor", PropertyDescriptor({
		Value : F,
		Writable : true,
		Enumerable : false,
		Configurable : true
	}), false);
	F.DefineOwnProperty("prototype", PropertyDescriptor({
		Value : proto,
		Writable : true,
		Enumerable : false,
		Configurable : false
	}), false);
	if (Strict === true) {
		var thrower = theThrowTypeError;
		F.DefineOwnProperty("caller", PropertyDescriptor({
			Get : thrower,
			Set : thrower,
			Enumerable : false,
			Configurable : false
		}), false);
		F.DefineOwnProperty("arguments", PropertyDescriptor({
			Get : thrower,
			Set : thrower,
			Enumerable : false,
			Configurable : false
		}), false);
	}
	return F;
}

function FunctionObject_Call(thisValue, argumentsList) {
	var F = this;
	enterExecutionContextForFunctionCode(F, thisValue, argumentsList);
	if (F.Code === undefined) {
		var result = CompletionValue("normal", undefined, empty);
	}
	else {
		var result = F.Code.evaluate();
	}
	exitExecutionContext();
	if (result.type === "throw") throw result.value;
	if (result.type === "return") return result.value;
	assertEquals(result.type, "normal", result);
	return undefined;
}

function FunctionObject_Construct(argumentsList) {
	var F = this;
	var obj = VMObject(CLASSID_Object);
	obj.Extensible = true;
	var proto = F.Get("prototype");
	if (Type(proto) === TYPE_Object) {
		obj.Prototype = proto;
	}
	if (Type(proto) !== TYPE_Object) {
		obj.Prototype = builtin_Object_prototype;
	}
	var result = F.Call(obj, argumentsList);
	if (Type(result) === TYPE_Object) return result;
	return obj;
}

function ThrowTypeError() {
	throw VMTypeError();
}

var theThrowTypeError;

function initializeThrowTypeErrorObject() {
	var F = VMObject(CLASSID_BuiltinFunction);
	F.Prototype = builtin_Function_prototype;
	F.Call = ThrowTypeError;
	defineFinal(F, "length", 0);
	F.Extensible = false;
	theThrowTypeError = F;
}
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

var CHECK_EXTENSION = false;
var CHECK_READONLY = false;

function assert(condition, info) {
	if (!condition) {
		debugger;
		console.trace("assertion failed: " + info);
		process.abort();
	}
}

function assertEquals(a, b, info) {
	if (a !== b) {
		debugger;
		console.trace("assertion failed: " + info);
		process.abort();
	}
}

function preventExtensions(obj) {
	return obj;
}

function freeze(obj) {
	return obj;
}

if (CHECK_EXTENSION) {
	preventExtensions = function(obj) {
		return Object.preventExtensions(obj);
	}
}

if (CHECK_READONLY) {
	freeze = function(obj) {
		return Object.freeze(obj);
	}
}

var MAX_VALUE = Number.MAX_VALUE;
var MIN_VALUE = Number.MIN_VALUE;

var empty = freeze({
	empty : true
});

var absent = freeze({
	absent : true
});

var failure = freeze({
	failure : true
});

function join(a) {
	return a.join('');
}

function arraycopy(a) {
	var b = [];
	for (var i = 0; i < a.length; i++) {
		b[i] = a[i];
	}
	return b;
}

function isIncluded(m, a) {
	return (a.indexOf(m) >= 0);
}

function floor(x) {
	return Math.floor(x);
}

function modulo(x, y) {
	return x - y * floor(x / y);
}

function abs(x) {
	return Math.abs(x);
}

function min(x, y) {
	return Math.min(x, y);
}

function max(x, y) {
	return Math.max(x, y);
}

function fromCharCode(x) {
	return String.fromCharCode(x);
}

function toCharCode(c) {
	return c.charCodeAt(0);
}

function mvDigitChar(c) {
	if (c === undefined) return NaN;
	var x = c.charCodeAt(0);
	if ((0x30 <= x) && (x <= 0x39)) return x - 0x30;
	if ((0x41 <= x) && (x <= 0x5a)) return x - (0x41 - 10);
	if ((0x61 <= x) && (x <= 0x7a)) return x - (0x61 - 10);
	return NaN;
}

function toDigitChar(x) {
	if ((0 <= x) && (x <= 9)) return fromCharCode(x + 0x30);
	if ((10 <= x) && (x <= 35)) return fromCharCode(x + (0x61 - 10)); // 'a' - 'z'
	assert(false, x);
}

function toUpperDigitChar(x) {
	if ((0 <= x) && (x <= 9)) return fromCharCode(x + 0x30);
	if ((10 <= x) && (x <= 35)) return fromCharCode(x + (0x41 - 10)); // 'A' - 'Z'
	assert(false, x);
}

function isDigitChar(c) {
	return (mvDigitChar(c) >= 0);
}

function isDecimalDigitChar(c) {
	return (mvDigitChar(c) <= 9);
}

function isOctalDigitChar(c) {
	return (mvDigitChar(c) <= 7);
}

function isHexDigitChar(c) {
	return (mvDigitChar(c) <= 15);
}

function formatNumber(x, witdh) {
	var buffer = [];
	while (witdh-- > 0) {
		buffer[witdh] = toDigitChar(x % 10);
		x = floor(x / 10);
	}
	return join(buffer);
}

function isPrimitiveValue(x) {
	switch (typeof x) {
	case "undefined":
	case "boolean":
	case "number":
	case "string":
		return true;
	}
	if (x === null) return true;
	return false;
}

function isInternalError(x) {
	if (isPrimitiveValue(x)) {
		return false;
	}
	if (x.Class !== undefined) return false;
	debugger;
	return true;
}

function isSnapshotObject(x) {
	if (typeof x !== "object") {
		return false;
	}
	if (x === null) {
		return false;
	}
	assert(x.walkObject !== undefined, x);
	return true;
}

function redirectException(e) {
	if (e instanceof TypeError) {
		throw VMTypeError(e.message);
	}
	if (e instanceof RangeError) {
		throw VMRangeError(e.message);
	}
	if (e instanceof ReferenceError) {
		throw VMReferenceError(e.message);
	}
	assert(false, e);
}

function compareNumber(a, b) {
	return Number(a) - Number(b);
}
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

var intrinsicFunctions = {
	Object_Call : Object_Call,
	Object_Construct : Object_Construct,
	Function_Call : Function_Call,
	Function_Construct : Function_Construct,
	Array_Call : Array_Call,
	Array_Construct : Array_Construct,
	String_Call : String_Call,
	String_Construct : String_Construct,
	Boolean_Call : Boolean_Call,
	Boolean_Construct : Boolean_Construct,
	Number_Call : Number_Call,
	Number_Construct : Number_Construct,
	Date_Call : Date_Call,
	Date_Construct : Date_Construct,
	RegExp_Call : RegExp_Call,
	RegExp_Construct : RegExp_Construct,
	Error_Call : Error_Call,
	Error_Construct : Error_Construct,
	EvalError_Call : EvalError_Call,
	EvalError_Construct : EvalError_Construct,
	RangeError_Call : RangeError_Call,
	RangeError_Construct : RangeError_Construct,
	ReferenceError_Call : ReferenceError_Call,
	ReferenceError_Construct : ReferenceError_Construct,
	SyntaxError_Call : SyntaxError_Call,
	SyntaxError_Construct : SyntaxError_Construct,
	TypeError_Call : TypeError_Call,
	TypeError_Construct : TypeError_Construct,
	URIError_Call : URIError_Call,
	URIError_Construct : URIError_Construct,
	Global_eval : Global_eval,
	Global_parseInt : Global_parseInt,
	Global_parseFloat : Global_parseFloat,
	Global_isNaN : Global_isNaN,
	Global_isFinite : Global_isFinite,
	Global_decodeURI : Global_decodeURI,
	Global_decodeURIComponent : Global_decodeURIComponent,
	Global_encodeURI : Global_encodeURI,
	Global_encodeURIComponent : Global_encodeURIComponent,
	Global_escape : Global_escape,
	Global_unescape : Global_unescape,
	Global_evaluateProgram : Global_evaluateProgram,
	Object_getPrototypeOf : Object_getPrototypeOf,
	Object_getOwnPropertyDescriptor : Object_getOwnPropertyDescriptor,
	Object_getOwnPropertyNames : Object_getOwnPropertyNames,
	Object_create : Object_create,
	Object_defineProperty : Object_defineProperty,
	Object_defineProperties : Object_defineProperties,
	Object_seal : Object_seal,
	Object_freeze : Object_freeze,
	Object_preventExtensions : Object_preventExtensions,
	Object_isSealed : Object_isSealed,
	Object_isFrozen : Object_isFrozen,
	Object_isExtensible : Object_isExtensible,
	Object_keys : Object_keys,
	Object_prototype_toString : Object_prototype_toString,
	Object_prototype_toLocaleString : Object_prototype_toLocaleString,
	Object_prototype_valueOf : Object_prototype_valueOf,
	Object_prototype_hasOwnProperty : Object_prototype_hasOwnProperty,
	Object_prototype_isPrototypeOf : Object_prototype_isPrototypeOf,
	Object_prototype_propertyIsEnumerable : Object_prototype_propertyIsEnumerable,
	get_Object_prototype___proto__ : get_Object_prototype___proto__,
	set_Object_prototype___proto__ : set_Object_prototype___proto__,
	Function_prototype_toString : Function_prototype_toString,
	Function_prototype_apply : Function_prototype_apply,
	Function_prototype_call : Function_prototype_call,
	Function_prototype_bind : Function_prototype_bind,
	Function_prototype_scheduleAsMicrotask : Function_prototype_scheduleAsMicrotask,
	Array_isArray : Array_isArray,
	Array_prototype_toString : Array_prototype_toString,
	Array_prototype_toLocaleString : Array_prototype_toLocaleString,
	Array_prototype_concat : Array_prototype_concat,
	Array_prototype_join : Array_prototype_join,
	Array_prototype_pop : Array_prototype_pop,
	Array_prototype_push : Array_prototype_push,
	Array_prototype_reverse : Array_prototype_reverse,
	Array_prototype_shift : Array_prototype_shift,
	Array_prototype_slice : Array_prototype_slice,
	Array_prototype_sort : Array_prototype_sort,
	Array_prototype_splice : Array_prototype_splice,
	Array_prototype_unshift : Array_prototype_unshift,
	Array_prototype_indexOf : Array_prototype_indexOf,
	Array_prototype_lastIndexOf : Array_prototype_lastIndexOf,
	Array_prototype_every : Array_prototype_every,
	Array_prototype_some : Array_prototype_some,
	Array_prototype_forEach : Array_prototype_forEach,
	Array_prototype_map : Array_prototype_map,
	Array_prototype_filter : Array_prototype_filter,
	Array_prototype_reduce : Array_prototype_reduce,
	Array_prototype_reduceRight : Array_prototype_reduceRight,
	String_fromCharCode : String_fromCharCode,
	String_prototype_toString : String_prototype_toString,
	String_prototype_valueOf : String_prototype_valueOf,
	String_prototype_charAt : String_prototype_charAt,
	String_prototype_charCodeAt : String_prototype_charCodeAt,
	String_prototype_concat : String_prototype_concat,
	String_prototype_indexOf : String_prototype_indexOf,
	String_prototype_lastIndexOf : String_prototype_lastIndexOf,
	String_prototype_localeCompare : String_prototype_localeCompare,
	String_prototype_match : String_prototype_match,
	String_prototype_replace : String_prototype_replace,
	String_prototype_search : String_prototype_search,
	String_prototype_slice : String_prototype_slice,
	String_prototype_split : String_prototype_split,
	String_prototype_substring : String_prototype_substring,
	String_prototype_toLowerCase : String_prototype_toLowerCase,
	String_prototype_toLocaleLowerCase : String_prototype_toLocaleLowerCase,
	String_prototype_toUpperCase : String_prototype_toUpperCase,
	String_prototype_toLocaleUpperCase : String_prototype_toLocaleUpperCase,
	String_prototype_trim : String_prototype_trim,
	String_prototype_substr : String_prototype_substr,
	Boolean_prototype_toString : Boolean_prototype_toString,
	Boolean_prototype_valueOf : Boolean_prototype_valueOf,
	Number_prototype_toString : Number_prototype_toString,
	Number_prototype_toLocaleString : Number_prototype_toLocaleString,
	Number_prototype_valueOf : Number_prototype_valueOf,
	Number_prototype_toFixed : Number_prototype_toFixed,
	Number_prototype_toExponential : Number_prototype_toExponential,
	Number_prototype_toPrecision : Number_prototype_toPrecision,
	Math_abs : Math_abs,
	Math_acos : Math_acos,
	Math_asin : Math_asin,
	Math_atan : Math_atan,
	Math_atan2 : Math_atan2,
	Math_ceil : Math_ceil,
	Math_cos : Math_cos,
	Math_exp : Math_exp,
	Math_floor : Math_floor,
	Math_log : Math_log,
	Math_max : Math_max,
	Math_min : Math_min,
	Math_pow : Math_pow,
	Math_random : Math_random,
	Math_round : Math_round,
	Math_sin : Math_sin,
	Math_sqrt : Math_sqrt,
	Math_tan : Math_tan,
	Date_parse : Date_parse,
	Date_UTC : Date_UTC,
	Date_now : Date_now,
	Date_prototype_toString : Date_prototype_toString,
	Date_prototype_toDateString : Date_prototype_toDateString,
	Date_prototype_toTimeString : Date_prototype_toTimeString,
	Date_prototype_toLocaleString : Date_prototype_toLocaleString,
	Date_prototype_toLocaleDateString : Date_prototype_toLocaleDateString,
	Date_prototype_toLocaleTimeString : Date_prototype_toLocaleTimeString,
	Date_prototype_valueOf : Date_prototype_valueOf,
	Date_prototype_getTime : Date_prototype_getTime,
	Date_prototype_getFullYear : Date_prototype_getFullYear,
	Date_prototype_getUTCFullYear : Date_prototype_getUTCFullYear,
	Date_prototype_getMonth : Date_prototype_getMonth,
	Date_prototype_getUTCMonth : Date_prototype_getUTCMonth,
	Date_prototype_getDate : Date_prototype_getDate,
	Date_prototype_getUTCDate : Date_prototype_getUTCDate,
	Date_prototype_getDay : Date_prototype_getDay,
	Date_prototype_getUTCDay : Date_prototype_getUTCDay,
	Date_prototype_getHours : Date_prototype_getHours,
	Date_prototype_getUTCHours : Date_prototype_getUTCHours,
	Date_prototype_getMinutes : Date_prototype_getMinutes,
	Date_prototype_getUTCMinutes : Date_prototype_getUTCMinutes,
	Date_prototype_getSeconds : Date_prototype_getSeconds,
	Date_prototype_getUTCSeconds : Date_prototype_getUTCSeconds,
	Date_prototype_getMilliseconds : Date_prototype_getMilliseconds,
	Date_prototype_getUTCMilliseconds : Date_prototype_getUTCMilliseconds,
	Date_prototype_getTimezoneOffset : Date_prototype_getTimezoneOffset,
	Date_prototype_setTime : Date_prototype_setTime,
	Date_prototype_setMilliseconds : Date_prototype_setMilliseconds,
	Date_prototype_setUTCMilliseconds : Date_prototype_setUTCMilliseconds,
	Date_prototype_setSeconds : Date_prototype_setSeconds,
	Date_prototype_setUTCSeconds : Date_prototype_setUTCSeconds,
	Date_prototype_setMinutes : Date_prototype_setMinutes,
	Date_prototype_setUTCMinutes : Date_prototype_setUTCMinutes,
	Date_prototype_setHours : Date_prototype_setHours,
	Date_prototype_setUTCHours : Date_prototype_setUTCHours,
	Date_prototype_setDate : Date_prototype_setDate,
	Date_prototype_setUTCDate : Date_prototype_setUTCDate,
	Date_prototype_setMonth : Date_prototype_setMonth,
	Date_prototype_setUTCMonth : Date_prototype_setUTCMonth,
	Date_prototype_setFullYear : Date_prototype_setFullYear,
	Date_prototype_setUTCFullYear : Date_prototype_setUTCFullYear,
	Date_prototype_toUTCString : Date_prototype_toUTCString,
	Date_prototype_toISOString : Date_prototype_toISOString,
	Date_prototype_toJSON : Date_prototype_toJSON,
	Date_prototype_getYear : Date_prototype_getYear,
	Date_prototype_setYear : Date_prototype_setYear,
	RegExp_prototype_exec : RegExp_prototype_exec,
	RegExp_prototype_test : RegExp_prototype_test,
	RegExp_prototype_toString : RegExp_prototype_toString,
	Error_prototype_toString : Error_prototype_toString,
	get_Error_prototype_stack : get_Error_prototype_stack,
	JSON_parse : JSON_parse,
	JSON_stringify : JSON_stringify,
	ThrowTypeError : ThrowTypeError,
	ReturnUndefined : ReturnUndefined,
	// extensions
	Buffer_Call : Buffer_Call,
	Buffer_Construct : Buffer_Construct,
	Buffer_isEncoding : Buffer_isEncoding,
	Buffer_isBuffer : Buffer_isBuffer,
	Buffer_byteLength : Buffer_byteLength,
	Buffer_concat : Buffer_concat,
	Buffer_compare : Buffer_compare,
	Buffer_prototype_write : Buffer_prototype_write,
	Buffer_prototype_writeUIntLE : Buffer_prototype_writeUIntLE,
	Buffer_prototype_writeUIntBE : Buffer_prototype_writeUIntBE,
	Buffer_prototype_writeIntLE : Buffer_prototype_writeIntLE,
	Buffer_prototype_writeIntBE : Buffer_prototype_writeIntBE,
	Buffer_prototype_readUIntLE : Buffer_prototype_readUIntLE,
	Buffer_prototype_readUIntBE : Buffer_prototype_readUIntBE,
	Buffer_prototype_readIntLE : Buffer_prototype_readIntLE,
	Buffer_prototype_readIntBE : Buffer_prototype_readIntBE,
	Buffer_prototype_toString : Buffer_prototype_toString,
	Buffer_prototype_toJSON : Buffer_prototype_toJSON,
	Buffer_prototype_equals : Buffer_prototype_equals,
	Buffer_prototype_compare : Buffer_prototype_compare,
	Buffer_prototype_copy : Buffer_prototype_copy,
	Buffer_prototype_slice : Buffer_prototype_slice,
	Buffer_prototype_readUInt8 : Buffer_prototype_readUInt8,
	Buffer_prototype_readUInt16LE : Buffer_prototype_readUInt16LE,
	Buffer_prototype_readUInt16BE : Buffer_prototype_readUInt16BE,
	Buffer_prototype_readUInt32LE : Buffer_prototype_readUInt32LE,
	Buffer_prototype_readUInt32BE : Buffer_prototype_readUInt32BE,
	Buffer_prototype_readInt8 : Buffer_prototype_readInt8,
	Buffer_prototype_readInt16LE : Buffer_prototype_readInt16LE,
	Buffer_prototype_readInt16BE : Buffer_prototype_readInt16BE,
	Buffer_prototype_readInt32LE : Buffer_prototype_readInt32LE,
	Buffer_prototype_readInt32BE : Buffer_prototype_readInt32BE,
	Buffer_prototype_readFloatLE : Buffer_prototype_readFloatLE,
	Buffer_prototype_readFloatBE : Buffer_prototype_readFloatBE,
	Buffer_prototype_readDoubleLE : Buffer_prototype_readDoubleLE,
	Buffer_prototype_readDoubleBE : Buffer_prototype_readDoubleBE,
	Buffer_prototype_writeUInt8 : Buffer_prototype_writeUInt8,
	Buffer_prototype_writeUInt16LE : Buffer_prototype_writeUInt16LE,
	Buffer_prototype_writeUInt16BE : Buffer_prototype_writeUInt16BE,
	Buffer_prototype_writeUInt32LE : Buffer_prototype_writeUInt32LE,
	Buffer_prototype_writeUInt32BE : Buffer_prototype_writeUInt32BE,
	Buffer_prototype_writeInt8 : Buffer_prototype_writeInt8,
	Buffer_prototype_writeInt16LE : Buffer_prototype_writeInt16LE,
	Buffer_prototype_writeInt16BE : Buffer_prototype_writeInt16BE,
	Buffer_prototype_writeInt32LE : Buffer_prototype_writeInt32LE,
	Buffer_prototype_writeInt32BE : Buffer_prototype_writeInt32BE,
	Buffer_prototype_writeFloatLE : Buffer_prototype_writeFloatLE,
	Buffer_prototype_writeFloatBE : Buffer_prototype_writeFloatBE,
	Buffer_prototype_writeDoubleLE : Buffer_prototype_writeDoubleLE,
	Buffer_prototype_writeDoubleBE : Buffer_prototype_writeDoubleBE,
	Buffer_prototype_fill : Buffer_prototype_fill,
	Buffer_prototype_inspect : Buffer_prototype_inspect,
	IOPort_Call : IOPort_Call,
	IOPort_Construct : IOPort_Construct,
	IOPort_prototype_open : IOPort_prototype_open,
	IOPort_prototype_syncIO : IOPort_prototype_syncIO,
	IOPort_prototype_asyncIO : IOPort_prototype_asyncIO,
};

(function initializeIntrinsicFunctions() {
	for ( var name in intrinsicFunctions) {
		var func = intrinsicFunctions[name];
		func.intrinsicFunctionName = name;
	}
})();

function getIntrinsicFunctionName(func) {
	if (func === undefined) {
		return '';
	}
	var name = func.intrinsicFunctionName;
	assert(name !== undefined, func);
	return name;
}

function getIntrinsicFunction(name) {
	if (name === '') {
		return undefined;
	}
	var func = intrinsicFunctions[name];
	if (func === undefined) {
		return null;
	}
	return func;
}
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

var HANDLER_DIR;
var RECOVERY_TARGET = 3000;

var IOManager_state = 'offline'; // -> 'roll-forward' -> 'online'
var IOManager_uniqueID = 0;
var IOManager_asyncCallbacks = {};

function IOManager_bindPort(port, name) {
	if (IOManager_state !== 'online') {
		return;
	}
	port.handler = undefined;
	try {
		port.handler = require(HANDLER_DIR + name);
	} catch (e) {
		console.log("bind error " + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_rebindPort(port) {
	var name = port.Get("name");
	if (Type(name) === TYPE_String) {
		IOManager_bindPort(port, name);
	}
	else {
		port.handler = null;
	}
}

function IOManager_openPort(port, root, args) {
	if (IOManager_state !== 'online') {
		return;
	}
	if (root.handler === undefined) {
		IOManager_rebindPort(root);
	}
	if (root.handler === null) {
		return;
	}
	port.handler = undefined;
	try {
		args = IOManager_copyAny(args); // safeguard
		port.handler = root.handler.open(args);
	} catch (e) {
		console.log("open error " + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_date_now() {
	var txid = ++IOManager_uniqueID;
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'roll-forward') {
			return Date.now();
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'now' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
	}
	var event = Date.now();
	Journal_write('now', event, txid);
	return event;
}

function IOManager_math_random() {
	var txid = ++IOManager_uniqueID;
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'roll-forward') {
			return Math.random();
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'random' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
	}
	var event = Math.random();
	Journal_write('now', event, txid);
	return event;
}

function IOManager_evaluate(text, filename) {
	Journal_write('evaluate', {
		text : text,
		filename : filename,
	}, 0);
	IOManager_context.start();
	var result = evaluateProgram(text, filename);
	runMicrotasks();
	IOManager_context.stop();
	IOManager_checkpoint();
	return result;
}

function IOManager_syncIO(port, name, args) {
	var txid = ++IOManager_uniqueID;
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'roll-forward') {
			return {
				error : true,
				failure : 'offlineError'
			};
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'syncIO' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
		var event = {
			error : true,
			failure : 'restartError'
		};
	}
	else {
		if (port.handler === undefined) {
			IOManager_rebindPort(port);
		}
		if (port.handler === null) {
			var event = {
				error : true,
				failure : 'staleError'
			};
		}
		else {
			IOManager_context.pauseTime();
			try {
				args = IOManager_copyAny(args); // safeguard
				var value = port.handler.syncIO(name, args);
				value = IOManager_copyAny(value); // safeguard
				var event = {
					value : value
				};
			} catch (err) {
				console.log("syncIO error " + err); // debug
				err = IOManager_copyAny(err); // safeguard
				var event = {
					error : true,
					value : err
				};
			}
			IOManager_context.resumeTime();
		}
	}
	Journal_write('syncIO', event, txid);
	return event;
}

function IOManager_asyncIO(port, name, args, callback) {
	var txid = ++IOManager_uniqueID;
	IOManager_asyncCallbacks[txid] = callback;
	if (IOManager_state !== 'online') {
		return txid;
	}
	if (port.handler === undefined) {
		IOManager_rebindPort(port);
	}
	if (port.handler === null) {
		setImmediate(IOManager_asyncIO_completion, failure, 'staleError', txid);
		return txid;
	}
	IOManager_context.pauseTime();
	try {
		args = IOManager_copyAny(args); // safeguard
		port.handler.asyncIO(name, args, function(err, value) {
			err = IOManager_copyAny(err); // safeguard
			value = IOManager_copyAny(value); // safeguard
			if (IOManager_context.isIdle()) {
				IOManager_asyncIO_completion(err, value, txid);
			}
			else {
				setImmediate(IOManager_asyncIO_completion, err, value, txid);
			}
		});
	} catch (err) {
		console.log("asyncIO error " + err); // debug
		err = IOManager_copyAny(err); // safeguard
		setImmediate(IOManager_asyncIO_completion, err, undefined, txid);
	}
	IOManager_context.resumeTime();
	return txid;
}

function IOManager_asyncIO_completion(error, value, txid) {
	assert(IOManager_state === 'online');
	var callback = IOManager_asyncCallbacks[txid];
	if (callback === undefined) {
		return;
	}
	delete (IOManager_asyncCallbacks[txid]);
	if (error === failure) {
		var event = {
			failure : value
		};
	}
	else {
		var event = {
			error : error,
			value : value
		};
	}
	Journal_write('asyncIO', event, txid);
	IOManager_context.start();
	IOPort_asyncIO_completion(event, callback);
	runMicrotasks();
	IOManager_context.stop();
	IOManager_checkpoint();
}

function IOManager_online() {
	assert(IOManager_state === 'roll-forward');
	for ( var txid in IOManager_asyncCallbacks) {
		txid = Number(txid);
		setImmediate(IOManager_asyncIO_completion, failure, 'restartError', txid);
	}
	IOManager_state = 'online';
}

function IOManager_start() {
	assert(IOManager_state === 'offline');
	IOManager_state = 'roll-forward';
	console.log('RECOVERING ...');
	IOManager_context.resetTime();
	IOManager_context.start();
	while (IOManager_state === 'roll-forward') {
		var entry = Journal_read();
		if (entry === undefined) {
			IOManager_online();
			break;
		}
		if (entry.type === 'asyncIO') {
			var txid = entry.txid;
			var callback = IOManager_asyncCallbacks[txid];
			assert(callback !== undefined);
			delete (IOManager_asyncCallbacks[txid]);
			IOPort_asyncIO_completion(entry.event, callback);
		}
		else if (entry.type === 'evaluate') {
			var event = entry.event;
			evaluateProgram(event.text, event.filename);
		}
		else {
			assert(false, entry.type);
		}
		runMicrotasks();
	}
	IOManager_context.stop();
	console.log('READY');
	IOManager_checkpoint();
}

function IOManager_checkpoint() {
	if (IOManager_context.getTime() >= RECOVERY_TARGET) {
		IOManager_context.resetTime();
		Journal_checkpoint();
	}
}

var IOManager_context = (function() {
	var idle = true;
	function start() {
		assert(idle);
		idle = false;
		resumeTime();
	}
	function stop() {
		pauseTime();
		assert(!idle);
		idle = true;
	}
	function isIdle() {
		return idle;
	}
	var time = 0;
	var startTime = 0;
	function resumeTime() {
		if (idle) return;
		assert(startTime === 0);
		startTime = Date.now();
	}
	function pauseTime() {
		if (idle) return;
		assert(startTime !== 0);
		time += Date.now() - startTime + 1;
		startTime = 0;
	}
	function getTime() {
		return time;
	}
	function resetTime() {
		time = 0;
	}
	return {
		start : start,
		stop : stop,
		isIdle : isIdle,
		resumeTime : resumeTime,
		pauseTime : pauseTime,
		getTime : getTime,
		resetTime : resetTime,
	};
})();

function IOManager_copyAny(x, stack) {
	if (isPrimitiveValue(x)) {
		return x;
	}
	if (x instanceof Buffer) {
		return new Buffer(x);
	}
	if (stack === undefined) stack = [];
	if (isIncluded(x, stack)) return null;
	stack.push(x);
	if (x instanceof Array) {
		var y = [];
		var length = x.length;
		for (var i = 0; i < length; i++) {
			y[i] = IOManager_copyAny(x[i], stack);
		}
	}
	else {
		var y = {};
		var keys = Object.keys(x);
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			var P = keys[i];
			y[P] = IOManager_copyAny(x[P], stack);
		}
	}
	stack.pop();
	return y;
}/*
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

var JOURNAL_FILEBASE;
var MAX_CHECKPOINT_FILES = 8;

var Journal_currentFileNo;
var Journal_currentGen;
var Journal_inputStream;
var Journal_outputStream;

function Journal_read() {
	if (Journal_inputStream === undefined) {
		return undefined;
	}
	try {
		var position = Journal_inputStream.getPosition();
		var type = Journal_inputStream.readString();
		var event = Journal_inputStream.readAny();
		var txid = Journal_inputStream.readInt();
		return {
			type : type,
			event : event,
			txid : txid,
		};
	} catch (e) {
		Journal_closeInputStream();
		Journal_openLog(position);
		return undefined;
	}
}

function Journal_write(type, event, txid) {
	if (Journal_outputStream === undefined) {
		return;
	}
	Journal_outputStream.writeString(type);
	Journal_outputStream.writeAny(event);
	Journal_outputStream.writeInt(txid);
	Journal_outputStream.flush();
}

function Journal_start() {
	var maxFileNo = undefined;
	var maxGen = 1;
	for (var i = 0; i < MAX_CHECKPOINT_FILES; i++) {
		Journal_currentFileNo = i;
		var hcpt = Journal_readCheckpointHeader();
		var hlog = Journal_readLogHeader();
		if (hcpt === null || hlog === null || hcpt.gen !== hlog.gen || hlog.gen < maxGen) {
			continue;
		}
		maxFileNo = i;
		maxGen = hlog.gen;
	}
	if (maxFileNo === undefined) {
		return false;
	}
	Journal_currentFileNo = maxFileNo;
	Journal_currentGen = maxGen;
	Journal_readCheckpointHeader();
	readSnapshot(Journal_inputStream);
	Journal_readLogHeader();
	return true;
}

function Journal_checkpoint() {
	console.log("journal checkpoint ");//debug
	Journal_currentFileNo = (Journal_currentFileNo + 1) % MAX_CHECKPOINT_FILES;
	Journal_currentGen++;
	Journal_clearLogHeader();
	Journal_writeCheckpointHeader();
	writeSnapshot(Journal_outputStream);
	Journal_writeLogHeader();
}

function Journal_init() {
	for (var i = 0; i < MAX_CHECKPOINT_FILES; i++) {
		Journal_currentFileNo = i;
		Journal_clearLogHeader();
	}
	Journal_currentFileNo = 0;
	Journal_currentGen = 1;
	Journal_clearLogHeader();
	Journal_writeCheckpointHeader();
	writeSnapshot(Journal_outputStream);
	Journal_writeLogHeader();
}

function Journal_readCheckpointHeader() {
	Journal_closeInputStream();
	try {
		Journal_inputStream = FileInputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "cp.bin");
		var header = Journal_inputStream.readAny();
		if (isPrimitiveValue(header) || header.magic !== "checkpoint") {
			return null;
		}
		return header;
	} catch (e) {
		return null;
	}
}

function Journal_readLogHeader() {
	Journal_closeInputStream();
	try {
		Journal_inputStream = FileInputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin");
		var header = Journal_inputStream.readAny();
		if (isPrimitiveValue(header) || header.magic !== "log") {
			return null;
		}
		return header;
	} catch (e) {
		return null;
	}
}

function Journal_writeCheckpointHeader() {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "cp.bin");
	var header = {
		magic : "checkpoint",
		gen : Journal_currentGen,
	};
	Journal_outputStream.writeAny(header);
	Journal_outputStream.flush();
}

function Journal_writeLogHeader() {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin");
	var header = {
		magic : "log",
		gen : Journal_currentGen,
	};
	Journal_outputStream.writeAny(header);
	Journal_outputStream.flush();
}

function Journal_clearLogHeader() {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin");
	Journal_outputStream.writeAny({});
	Journal_outputStream.flush();
}

function Journal_openLog(position) {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin", true);
	Journal_outputStream.setPosition(position);
}

function Journal_closeInputStream() {
	if (Journal_inputStream !== undefined) {
		Journal_inputStream.close();
		Journal_inputStream = undefined;
	}
}

function Journal_closeOutputStream() {
	if (Journal_outputStream !== undefined) {
		Journal_outputStream.close();
		Journal_outputStream = undefined;
	}
}
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

var theParser = function() {
	return preventExtensions({
		readProgram : readProgram,
		readFunctionParameters : readFunctionParameters,
		readFunctionCode : readFunctionCode,
		locateDebugInfo : locateDebugInfo,
	});

	var current;
	var token;
	var value;
	var isNumericLiteral;
	var isStringLiteral;
	var isIdentifierName;
	var isEscaped;
	var isLineSeparatedAhead;
	var isLineSeparatedBehind;
	var prevTokenPos;
	var tokenPos;
	var tokenEndPos;
	var currentPos;
	/*
	 *     token    current
	 * <--> isLineSeparatedAhead
	 *     ^ tokenPos
	 *          ^ tokenEndPos
	 *          <--> isLineSeparatedBehind
	 *              ^ currentPos
	 */

	var source;
	var strict;
	var subcodes;
	var sourceObject;
	var code;
	var stack;
	var lastLeftHandSide;
	var lastReference;
	var lastIdentifierReference;
	var lastIdentifier;

	function setup(text, strictMode, subc, filename) {
		source = text;
		strict = strictMode;
		subcodes = subc;
		sourceObject = NewSourceObject(source, strict, filename);
		code = undefined;
		stack = undefined;
		lastLeftHandSide = undefined;
		lastReference = undefined;
		lastIdentifierReference = undefined;
		lastIdentifier = undefined;
		setPosition(0);
		skipSpaces();
		proceedToken();
	}

	function Code() {
		var code = preventExtensions({
			strict : strict,
			isFunctionCode : false,
			isEvalCode : false,
			functions : [],
			variables : [],
			existsDirectEval : false,
			existsArgumentsRef : false,
			evaluate : undefined,
			sourceObject : sourceObject,
			index : subcodes.length,
			startPos : undefined,
			endPos : undefined,
			funcname : undefined,
		});
		subcodes.push(code);
		return code;
	}

	function Stack() {
		return preventExtensions({
			labelStack : [],
			iterableLabelStack : [],
			iterables : 0,
			switches : 0,
		});
	}

	function readProgram(programText, strictMode, subcodes, filename) {
		setup(programText, strictMode, subcodes, filename);
		code = Code();
		stack = Stack();
		var sourceElements = readSourceElements();
		if (token !== undefined) SyntaxError(tokenPos);
		code.strict = strict;
		code.evaluate = Program(sourceElements);
		return code;
	}

	function readFunctionParameters(parameterText) {
		setup(parameterText, false);
		var parameters = [];
		if (token !== undefined) {
			while (true) {
				parameters.push(expectingIdentifier());
				if (token === undefined) {
					break;
				}
				expectingToken(',');
			}
		}
		return parameters;
	}

	function readFunctionCode(programText, parameters, subcodes, filename) {
		setup(programText, false, subcodes, filename);
		sourceObject.isFunctionBody = true;
		var body = readFunctionBody();
		if (body.strict) {
			disallowDuplicated(parameters);
			parameters.forEach(disallowEvalOrArguments);
		}
		return body;
	}

	function readFunctionBody(name) {
		var outerStrict = strict;
		var outerCode = code;
		var outerStack = stack;
		code = Code();
		stack = Stack();
		var body = code;
		body.isFunctionCode = true;
		body.funcname = (name || "anonymous");
		var sourceElements = readSourceElements();
		body.strict = strict;
		body.evaluate = FunctionBody(sourceElements);
		strict = outerStrict;
		code = outerCode;
		stack = outerStack;
		return body;
	}

	function readSourceElements() {
		code.startPos = tokenPos;
		while (isStringLiteral) {
			if (!(isLineSeparatedBehind || current === ';' || current === '}')) {
				break;
			}
			if (value === "use strict") {
				var text = source.substring(tokenPos, tokenEndPos);
				if (text === '"use strict"' || text === "'use strict'") {
					strict = true;
				}
			}
			readStatement();
		}
		if (code.startPos !== tokenPos) {
			setPosition(code.startPos);
			proceedToken();
		}
		var statements = [];
		while (token !== undefined && token !== '}') {
			if (token === "function") {
				code.functions.push(readFunctionDeclaration());
			}
			else {
				statements.push(readStatement());
			}
		}
		code.endPos = tokenPos;
		return SourceElements(statements);
	}

	function readFunctionDeclaration() {
		proceedToken();
		var name = expectingIdentifier();
		expectingToken('(');
		var parameters = [];
		if (!testToken(')')) {
			while (true) {
				parameters.push(expectingIdentifier());
				if (testToken(')')) {
					break;
				}
				expectingToken(',');
			}
		}
		expectingToken('{');
		var body = readFunctionBody(name);
		expectingToken('}');
		if (body.strict) {
			disallowEvalOrArguments(name);
			disallowDuplicated(parameters);
			parameters.forEach(disallowEvalOrArguments);
		}
		var func = FunctionDeclaration(name, parameters, body);
		return func;
	}

	function readStatement(labelset) {
		switch (token) {
		case '{': // '}'
			return readBlockStatement();
		case ';':
			proceedToken();
			return EmptyStatement();
		case "var":
			return readVariableStatement();
		case "if":
			return readIfStatement();
		case "do":
			stack.iterables++;
			var statement = readDoWhileStatement(labelset);
			stack.iterables--;
			return statement;
		case "while":
			stack.iterables++;
			var statement = readWhileStatement(labelset);
			stack.iterables--;
			return statement;
		case "for":
			stack.iterables++;
			var statement = readForStatement(labelset);
			stack.iterables--;
			return statement;
		case "continue":
			return readContinueStatement();
		case "break":
			return readBreakStatement();
		case "return":
			return readReturnStatement();
		case "with":
			return readWithStatement();
		case "switch":
			stack.switches++;
			var statement = readSwitchStatement(labelset);
			stack.switches--;
			return statement;
		case "throw":
			return readThrowStatement();
		case "try":
			return readTryStatement();
		case "debugger":
			return readDebuggerStatement();
		case "function":
			return readFunctionStatement();
		default:
			if (isIdentifierName && current === ':') return readLabelledStatement();
			else return readExpressionStatement();
		}
	}

	function readLabelledStatement() {
		var labelset = [];
		stack.labelStack.push(labelset);
		while (isIdentifierName && current === ':') {
			var identifier = expectingIdentifier();
			if (findLabel(stack.labelStack, identifier) !== undefined) SyntaxError(prevTokenPos);
			expectingToken(':');
			labelset.push(identifier);
		}
		switch (token) {
		case "do":
		case "while":
		case "for":
			var iterable = true;
		}
		if (iterable) {
			stack.iterableLabelStack.push(labelset);
		}
		var statement = readStatement(labelset);
		stack.labelStack.pop();
		if (iterable) {
			stack.iterableLabelStack.pop();
		}
		var i = labelset.length;
		while (i-- !== 0) {
			statement = LabelledStatement(labelset[i], statement);
		}
		return statement;
	}

	function readExpressionStatement() {
		var pos = tokenPos;
		var expression = readExpression();
		expectingAutoSemicolon();
		return ExpressionStatement(expression, pos);
	}

	function readBlockStatement() {
		expectingToken('{');
		var statements = [];
		while (true) {
			if (testToken('}')) {
				break;
			}
			statements.push(readStatement());
		}
		return BlockStatement(StatementList(statements));
	}

	function readVariableStatement() {
		proceedToken();
		var variableDeclarationList = readVariableDeclarationList();
		expectingAutoSemicolon();
		return VariableStatement(variableDeclarationList);
	}

	function readVariableDeclarationList(isNoIn) {
		var variableDeclarationList = [];
		while (true) {
			var variableDeclaration = readVariableDeclaration(isNoIn);
			variableDeclarationList.push(variableDeclaration);
			if (!testToken(',')) {
				break;
			}
		}
		return variableDeclarationList;
	}

	function readVariableDeclaration(isNoIn) {
		var identifier = expectingIdentifier();
		if (strict) {
			disallowEvalOrArguments(identifier);
		}
		var pos = tokenPos;
		if (testToken('=')) {
			var initialiser = readAssignmentExpression(isNoIn);
		}
		if (isIncluded(identifier, code.variables) === false) {
			code.variables.push(identifier);
		}
		return VariableDeclaration(identifier, initialiser, strict, pos);
	}

	function readIfStatement() {
		proceedToken();
		expectingToken('(');
		var pos = tokenPos;
		var expression = readExpression();
		expectingToken(')');
		var statement = readStatement();
		if (testToken("else")) {
			var elseStatement = readStatement();
		}
		return IfStatement(expression, statement, elseStatement, pos);
	}

	function readDoWhileStatement(labelset) {
		proceedToken();
		var statement = readStatement();
		expectingToken("while");
		expectingToken('(');
		var pos = tokenPos;
		var expression = readExpression();
		expectingToken(')');
		expectingAutoSemicolon();
		return DoWhileStatement(statement, expression, labelset, pos);
	}

	function readWhileStatement(labelset) {
		proceedToken();
		expectingToken('(');
		var pos = tokenPos;
		var expression = readExpression();
		expectingToken(')');
		var statement = readStatement();
		return WhileStatement(expression, statement, labelset, pos);
	}

	function readForStatement(labelset) {
		proceedToken();
		expectingToken('(');
		if (testToken("var")) {
			var variableDeclarationList = readVariableDeclarationList(true); // NoIn
			var pos1 = tokenPos;
			if (testToken("in")) {
				if (variableDeclarationList.length !== 1) SyntaxError(prevTokenPos);
				var expression = readExpression();
				var pos2 = tokenPos;
				expectingToken(')');
				var statement = readStatement();
				return ForVarInStatement(variableDeclarationList[0], expression, statement, labelset, strict, pos1, pos2);
			}
			expectingToken(';');
			if (!testToken(';')) {
				var pos1 = tokenPos;
				var testExpression = readExpression();
				expectingToken(';');
			}
			if (!testToken(')')) {
				var pos2 = tokenPos;
				var postExpression = readExpression();
				expectingToken(')');
			}
			var statement = readStatement();
			return ForVarStatement(variableDeclarationList, testExpression, postExpression, statement, labelset, pos1, pos2);
		}
		if (!testToken(';')) {
			var pos1 = tokenPos;
			var expressionNoIn = readExpression(true); // NoIn
			if (testToken("in")) {
				if (expressionNoIn !== lastLeftHandSide) SyntaxError(prevTokenPos);
				if (expressionNoIn !== lastReference) throw VMReferenceError();
				var pos2 = tokenPos;
				var expression = readExpression();
				expectingToken(')');
				var statement = readStatement();
				return ForInStatement(expressionNoIn, expression, statement, labelset, pos1, pos2);
			}
			expectingToken(';');
		}
		if (!testToken(';')) {
			var pos2 = tokenPos;
			var testExpression = readExpression();
			expectingToken(';');
		}
		if (!testToken(')')) {
			var pos3 = tokenPos;
			var postExpression = readExpression();
			expectingToken(')');
		}
		var statement = readStatement();
		return ForStatement(expressionNoIn, testExpression, postExpression, statement, labelset, pos1, pos2, pos3);
	}

	function readContinueStatement() {
		proceedToken();
		if (isIdentifierName && !isLineSeparatedAhead) {
			var identifier = expectingIdentifier();
			var labelset = findLabel(stack.iterableLabelStack, identifier);
			if (labelset === undefined) SyntaxError(prevTokenPos);
		}
		else if (stack.iterables === 0) SyntaxError(prevTokenPos);
		expectingAutoSemicolon();
		return ContinueStatement(identifier);
	}

	function readBreakStatement() {
		proceedToken();
		if (isIdentifierName && !isLineSeparatedAhead) {
			var identifier = expectingIdentifier();
			var labelset = findLabel(stack.labelStack, identifier);
			if (labelset === undefined) SyntaxError(prevTokenPos);
		}
		else if (stack.iterables === 0 && stack.switches === 0) SyntaxError(prevTokenPos);
		expectingAutoSemicolon();
		return BreakStatement(identifier);
	}

	function readReturnStatement() {
		proceedToken();
		if (code.isFunctionCode === false) SyntaxError(prevTokenPos);
		if (!(isLineSeparatedAhead || token === ';' || token === '}')) {
			var pos = tokenPos;
			var expression = readExpression();
		}
		expectingAutoSemicolon();
		return ReturnStatement(expression, pos);
	}

	function readWithStatement() {
		proceedToken();
		if (strict) SyntaxError(prevTokenPos);
		expectingToken('(');
		var pos = tokenPos;
		var expression = readExpression();
		expectingToken(')');
		var statement = readStatement();
		return WithStatement(expression, statement, pos);
	}

	function readSwitchStatement(labelset) {
		proceedToken();
		expectingToken('(');
		var pos1 = tokenPos;
		var expression = readExpression();
		expectingToken(')');
		var firstClauses = [];
		var secondClauses = [];
		expectingToken('{');
		while (!testToken('}')) {
			if (testToken("default")) {
				if (defaultClause !== undefined) SyntaxError(prevTokenPos);
				expectingToken(':');
				var statements = [];
				while (token !== '}' && token !== "case" && token !== "default") {
					statements.push(readStatement());
				}
				var defaultClause = StatementList(statements);
				continue;
			}
			expectingToken("case");
			var pos2 = tokenPos;
			var caseExpression = readExpression();
			expectingToken(':');
			var statements = [];
			while (token !== '}' && token !== "case" && token !== "default") {
				statements.push(readStatement());
			}
			var clause = CaseClause(caseExpression, StatementList(statements), pos2);
			if (defaultClause === undefined) {
				firstClauses.push(clause);
			}
			else {
				secondClauses.push(clause);
			}
		}
		return SwitchStatement(expression, CaseBlock(firstClauses, defaultClause, secondClauses), labelset, pos1);
	}

	function readThrowStatement() {
		proceedToken();
		if (isLineSeparatedAhead) SyntaxError(prevTokenPos);
		var pos = tokenPos;
		var expression = readExpression();
		expectingAutoSemicolon();
		return ThrowStatement(expression, pos);
	}

	function readTryStatement() {
		proceedToken();
		var block = readBlockStatement();
		if (testToken("catch")) {
			expectingToken('(');
			var identifier = expectingIdentifier();
			if (strict) {
				disallowEvalOrArguments(identifier);
			}
			expectingToken(')');
			var catchBlock = CatchBlock(identifier, readBlockStatement());
			if (testToken("finally")) {
				var finallyBlock = readBlockStatement();
			}
		}
		else {
			expectingToken("finally");
			var finallyBlock = readBlockStatement();
		}
		return TryStatement(block, catchBlock, finallyBlock);
	}

	function readDebuggerStatement() {
		var pos = tokenPos;
		proceedToken();
		expectingAutoSemicolon();
		return DebuggerStatement(pos);
	}

	function readFunctionStatement() {
		if (strict || STRICT_CONFORMANCE) SyntaxError(tokenPos);
		code.functions.push(readFunctionDeclaration());
		return EmptyStatement();
	}

	function findLabel(labelStack, identifier) {
		var i = labelStack.length;
		while (i-- !== 0) {
			var labelset = labelStack[i];
			if (isIncluded(identifier, labelset)) return labelset;
		}
		return undefined;
	}

	function readExpression(isNoIn) {
		var expression = readAssignmentExpression(isNoIn);
		while (testToken(',')) {
			var rightExpression = readAssignmentExpression(isNoIn);
			expression = CommaOperator(expression, rightExpression);
		}
		return expression;
	}

	function readAssignmentExpression(isNoIn) {
		var expression = readConditionalExpression(isNoIn);
		var operator = token;
		switch (operator) {
		case '=':
		case '*=':
		case '/=':
		case '%=':
		case '+=':
		case '-=':
		case '<<=':
		case '>>=':
		case '>>>=':
		case '&=':
		case '|=':
		case '^=':
			proceedToken();
			if (expression !== lastLeftHandSide) SyntaxError(prevTokenPos);
			if (expression !== lastReference) throw VMReferenceError();
			if (strict && expression === lastIdentifierReference) {
				disallowEvalOrArguments(lastIdentifier);
			}
			var rightExpression = readAssignmentExpression(isNoIn);
			if (operator === '=') return SimpleAssignment(expression, rightExpression);
			else return CompoundAssignment(operator, expression, rightExpression);
		}
		return expression;
	}

	function readConditionalExpression(isNoIn) {
		var expression = readBinaryExpression('', isNoIn);
		if (testToken('?')) {
			var firstExpression = readAssignmentExpression();
			expectingToken(':');
			var secondExpression = readAssignmentExpression(isNoIn);
			return ConditionalOperator(expression, firstExpression, secondExpression);
		}
		return expression;
	}

	function readBinaryExpression(leadingOperator, isNoIn) {
		var expression = readUnaryExpression();
		while (true) {
			var operator = token;
			if (isNoIn && operator === "in") {
				break;
			}
			if (getOperatorPriority(leadingOperator) <= getOperatorPriority(operator)) {
				break;
			}
			proceedToken();
			var rightExpression = readBinaryExpression(operator, isNoIn);
			switch (operator) {
			case '*':
			case '/':
			case '%':
				expression = MultiplicativeOperator(operator, expression, rightExpression);
				break;
			case '+':
				expression = AdditionOperator(expression, rightExpression);
				break;
			case '-':
				expression = SubtractionOperator(expression, rightExpression);
				break;
			case '<<':
				expression = LeftShiftOperator(expression, rightExpression);
				break;
			case '>>':
				expression = SignedRightShiftOperator(expression, rightExpression);
				break;
			case '>>>':
				expression = UnsignedRightShiftOperator(expression, rightExpression);
				break;
			case '<':
				expression = LessThanOperator(expression, rightExpression);
				break;
			case '>':
				expression = GreaterThanOperator(expression, rightExpression);
				break;
			case '<=':
				expression = LessThanOrEqualOperator(expression, rightExpression);
				break;
			case '>=':
				expression = GreaterThanOrEqualOperator(expression, rightExpression);
				break;
			case "instanceof":
				expression = instanceofOperator(expression, rightExpression);
				break;
			case "in":
				expression = inOperator(expression, rightExpression);
				break;
			case '==':
				expression = EqualsOperator(expression, rightExpression);
				break;
			case '!=':
				expression = DoesNotEqualOperator(expression, rightExpression);
				break;
			case '===':
				expression = StrictEqualsOperator(expression, rightExpression);
				break;
			case '!==':
				expression = StrictDoesNotEqualOperator(expression, rightExpression);
				break;
			case '&':
			case '^':
			case '|':
				expression = BinaryBitwiseOperator(operator, expression, rightExpression);
				break;
			case '&&':
				expression = LogicalAndOperator(expression, rightExpression);
				break;
			case '||':
				expression = LogicalOrOperator(expression, rightExpression);
				break;
			}
		}
		return expression;
	}

	function getOperatorPriority(operator) {
		switch (operator) {
		case '*':
		case '/':
		case '%':
			return 1;
		case '+':
		case '-':
			return 2;
		case '<<':
		case '>>':
		case '>>>':
			return 3;
		case '<':
		case '>':
		case '<=':
		case '>=':
		case "instanceof":
		case "in":
			return 4;
		case '==':
		case '!=':
		case '===':
		case '!==':
			return 5;
		case '&':
			return 6;
		case '^':
			return 7;
		case '|':
			return 8;
		case '&&':
			return 9;
		case '||':
			return 10;
		}
		return 99;
	}

	function readUnaryExpression() {
		var operator = token;
		switch (operator) {
		case "delete":
			proceedToken();
			var expression = readUnaryExpression();
			if (strict && expression === lastIdentifierReference) SyntaxError(prevTokenPos);
			return deleteOperator(expression);
		case "void":
			proceedToken();
			var expression = readUnaryExpression();
			return voidOperator(expression);
		case "typeof":
			proceedToken();
			var expression = readUnaryExpression();
			return typeofOperator(expression);
		case '++':
			proceedToken();
			var expression = readUnaryExpression();
			if (strict && expression === lastIdentifierReference) {
				disallowEvalOrArguments(lastIdentifier);
			}
			if (expression !== lastReference) throw VMReferenceError();
			return PrefixIncrementOperator(expression);
		case '--':
			proceedToken();
			var expression = readUnaryExpression();
			if (strict && expression === lastIdentifierReference) {
				disallowEvalOrArguments(lastIdentifier);
			}
			if (expression !== lastReference) throw VMReferenceError();
			return PrefixDecrementOperator(expression);
		case '+':
			proceedToken();
			var expression = readUnaryExpression();
			return PlusOperator(expression);
		case '-':
			proceedToken();
			var expression = readUnaryExpression();
			return MinusOperator(expression);
		case '~':
			proceedToken();
			var expression = readUnaryExpression();
			return BitwiseNOTOperator(expression);
		case '!':
			proceedToken();
			var expression = readUnaryExpression();
			return LogicalNOTOperator(expression);
		}
		var expression = readLeftHandSideExpression();
		if (isLineSeparatedAhead) return expression;
		var operator = token;
		switch (operator) {
		case '++':
			if (strict && expression === lastIdentifierReference) {
				disallowEvalOrArguments(lastIdentifier);
			}
			if (expression !== lastReference) throw VMReferenceError();
			proceedToken();
			return PostfixIncrementOperator(expression);
		case '--':
			if (strict && expression === lastIdentifierReference) {
				disallowEvalOrArguments(lastIdentifier);
			}
			if (expression !== lastReference) throw VMReferenceError();
			proceedToken();
			return PostfixDecrementOperator(expression);
		}
		return expression;
	}

	function readLeftHandSideExpression() {
		var newOperators = 0;
		while (testToken("new")) {
			newOperators++;
		}
		if (token === "function") {
			var expression = readFunctionExpression();
		}
		else {
			var expression = readPrimaryExpression();
		}
		while (true) {
			switch (token) {
			case '[':
				proceedToken();
				var indexExpression = readExpression();
				expectingToken(']');
				expression = PropertyAccessor(expression, indexExpression, strict);
				lastReference = expression;
				continue;
			case '.':
				proceedToken();
				var name = expectingIdentifierName();
				expression = PropertyAccessor(expression, Literal(name), strict);
				lastReference = expression;
				continue;
			case '(':
				if (expression === lastIdentifierReference && lastIdentifier === "eval" && newOperators === 0) {
					code.existsDirectEval = true;
				}
				var args = readArguments();
				if (newOperators !== 0) {
					newOperators--;
					expression = NewOperator(expression, args);
				}
				else {
					expression = FunctionCall(expression, args, strict);
				}
				continue;
			}
			break;
		}
		while (newOperators-- !== 0) {
			expression = NewOperator(expression, []);
		}
		lastLeftHandSide = expression;
		return expression;
	}

	function readArguments() {
		var args = [];
		proceedToken();
		if (!testToken(')')) {
			while (true) {
				args.push(readAssignmentExpression());
				if (testToken(')')) {
					break;
				}
				expectingToken(',');
			}
		}
		return args;
	}

	function readFunctionExpression() {
		proceedToken();
		if (!testToken('(')) {
			var name = expectingIdentifier();
			expectingToken('(');
		}
		var parameters = [];
		if (!testToken(')')) {
			while (true) {
				parameters.push(expectingIdentifier());
				if (testToken(')')) {
					break;
				}
				expectingToken(',');
			}
		}
		expectingToken('{');
		var body = readFunctionBody(name);
		expectingToken('}');
		if (body.strict) {
			disallowEvalOrArguments(name);
			disallowDuplicated(parameters);
			parameters.forEach(disallowEvalOrArguments);
		}
		return FunctionExpression(name, parameters, body);
	}

	function readPrimaryExpression() {
		if (isNumericLiteral || isStringLiteral) {
			var expression = Literal(value);
			proceedToken();
			return expression;
		}
		if (isIdentifierName && !isReservedWord(token)) {
			var identifier = proceedToken();
			var expression = IdentifierReference(identifier, strict);
			lastIdentifierReference = expression;
			lastIdentifier = identifier;
			lastReference = expression;
			if (identifier === "arguments") {
				code.existsArgumentsRef = true;
			}
			return expression;
		}
		if (token === '/' || token === '/=') {
			setPosition(tokenPos);
			value = readRegExpLiteral();
			skipSpaces();
			proceedToken();
			return RegExpLiteral(value);
		}
		switch (proceedToken()) {
		case "this":
			return ThisExpression();
		case "null":
			return Literal(null);
		case "false":
			return Literal(false);
		case "true":
			return Literal(true);
		case '[':
			var elements = [];
			while (true) {
				while (testToken(',')) {
					elements.push(empty);
				}
				if (testToken(']')) {
					elements.push(empty);
					break;
				}
				elements.push(readAssignmentExpression());
				if (testToken(']')) {
					break;
				}
				expectingToken(',');
			}
			return ArrayInitialiser(elements);
		case '{':
			var elements = [];
			var previous = preventExtensions({
				data : [],
				get : [],
				set : [],
			});
			while (true) {
				if (testToken('}')) {
					break;
				}
				elements.push(readPropertyAssignment(previous));
				if (testToken('}')) {
					break;
				}
				expectingToken(',');
			}
			return ObjectInitialiser(elements);
		case '(':
			var expression = readExpression();
			expectingToken(')');
			return expression;
		}
		SyntaxError(prevTokenPos);
	}

	function readPropertyAssignment(previous) {
		var name = expectingPropertyName();
		if (token === ':') {
			if (strict && isIncluded(name, previous.data)) SyntaxError(prevTokenPos);
			if (isIncluded(name, previous.get)) SyntaxError(prevTokenPos);
			if (isIncluded(name, previous.set)) SyntaxError(prevTokenPos);
			previous.data.push(name);
			proceedToken();
			var expression = readAssignmentExpression();
			var a = PropertyAssignment(name, expression);
		}
		else if (name === "get") {
			name = expectingPropertyName();
			if (isIncluded(name, previous.data)) SyntaxError(prevTokenPos);
			if (isIncluded(name, previous.get)) SyntaxError(prevTokenPos);
			previous.get.push(name);
			expectingToken('(');
			expectingToken(')');
			expectingToken('{');
			var body = readFunctionBody("get_" + name);
			expectingToken('}');
			var a = PropertyAssignmentGet(name, body);
		}
		else if (name === "set") {
			name = expectingPropertyName();
			if (isIncluded(name, previous.data)) SyntaxError(prevTokenPos);
			if (isIncluded(name, previous.set)) SyntaxError(prevTokenPos);
			previous.set.push(name);
			expectingToken('(');
			var identifier = expectingIdentifier();
			expectingToken(')');
			expectingToken('{');
			var body = readFunctionBody("set_" + name);
			expectingToken('}');
			if (body.strict) {
				disallowEvalOrArguments(identifier);
			}
			var a = PropertyAssignmentSet(name, identifier, body);
		}
		else {
			expectingToken(':');
		}
		return a;
	}

	//TODO
	function disallowDuplicated(parameters) {
		for (var i = 0; i < parameters.length; i++) {
			for (var j = 0; j < i; j++) {
				if (parameters[i] === parameters[j]) SyntaxError(prevTokenPos);
			}
		}
	}

	//TODO
	function disallowEvalOrArguments(identifier) {
		if (identifier === "eval" || identifier === "arguments") SyntaxError(prevTokenPos);
	}

	function testToken(t) {
		if (token === t) {
			proceedToken();
			return true;
		}
		return false;
	}

	function expectingToken(t) {
		if (proceedToken() === t) {
			return;
		}
		SyntaxError(prevTokenPos);
	}

	function expectingAutoSemicolon() {
		if (token === ';') {
			proceedToken();
			return;
		}
		if (isLineSeparatedAhead || token === '}') return;
		SyntaxError(tokenPos);
	}

	function expectingIdentifier() {
		if (isIdentifierName && !isReservedWord(token)) return proceedToken();
		SyntaxError(tokenPos);
	}

	function expectingIdentifierName() {
		if (isIdentifierName) return proceedToken();
		SyntaxError(tokenPos);
	}

	function expectingPropertyName() {
		if (isIdentifierName) return proceedToken();
		if (isStringLiteral) {
			var name = value;
			proceedToken();
			return name;
		}
		if (isNumericLiteral) {
			var name = ToString(value);
			proceedToken();
			return name;
		}
		SyntaxError(tokenPos);
	}

	function isReservedWord(v) {
		switch (v) {
		case "null":
		case "true":
		case "false":
		case "break":
		case "case":
		case "catch":
		case "continue":
		case "debugger":
		case "default":
		case "delete":
		case "do":
		case "else":
		case "finally":
		case "for":
		case "function":
		case "if":
		case "in":
		case "instanceof":
		case "new":
		case "return":
		case "switch":
		case "this":
		case "throw":
		case "try":
		case "typeof":
		case "var":
		case "void":
		case "while":
		case "with":
		case "class":
		case "const":
		case "enum":
		case "export":
		case "extends":
		case "import":
		case "super":
			return true;
		}
		if (strict) {
			switch (v) {
			case "implements":
			case "interface":
			case "let":
			case "package":
			case "private":
			case "protected":
			case "public":
			case "static":
			case "yield":
				return true;
			}
		}
		return false;
	}

	function proceedToken() {
		var t = token;
		isLineSeparatedAhead = isLineSeparatedBehind;
		prevTokenPos = tokenPos;
		tokenPos = currentPos;
		token = readToken();
		tokenEndPos = currentPos;
		skipSpaces();
		return t;
	}

	function skipSpaces() {
		isLineSeparatedBehind = false;
		while (true) {
			if (isWhiteSpace(current)) {
				proceed();
				continue;
			}
			if (current === undefined) {
				isLineSeparatedBehind = true;
				break;
			}
			if (isLineTerminator(current)) {
				proceed();
				isLineSeparatedBehind = true;
				continue;
			}
			if (current === '/') {
				var pos = currentPos;
				proceed();
				if (current === '/') {
					while (true) {
						var c = proceed();
						if (c === undefined || isLineTerminator(c)) {
							isLineSeparatedBehind = true;
							break;
						}
					}
					continue;
				}
				if (current === '*') {
					proceed();
					while (true) {
						if (current === undefined) SyntaxError();
						var c = proceed();
						if (isLineTerminator(c)) {
							isLineSeparatedBehind = true;
						}
						if (c === '*' && current === '/') {
							proceed();
							break;
						}
					}
					continue;
				}
				setPosition(pos);
			}
			break;
		}
	}

	function readToken() {
		isNumericLiteral = false;
		isStringLiteral = false;
		isIdentifierName = false;
		isEscaped = false;
		if (current === undefined) return undefined;
		var c = proceed();
		switch (c) {
		case '{':
		case '}':
		case '(':
		case ')':
		case '[':
		case ']':
		case ';':
		case ',':
		case '~':
		case '?':
		case ':':
			break;
		case '.':
			if (isDecimalDigitChar(current)) {
				isNumericLiteral = true;
				setPosition(tokenPos);
				value = readNumericLiteral();
				if (current === '\\' || isIdentifierStart(current)) SyntaxError();
				return '';
			}
			break;
		case '<':
			current === '<' && proceed();
			current === '=' && proceed();
			break;
		case '>':
			current === '>' && proceed();
			current === '>' && proceed();
			current === '=' && proceed();
			break;
		case '=':
		case '!':
			current === '=' && proceed();
			current === '=' && proceed();
			break;
		case '+':
		case '-':
		case '&':
		case '|':
			if (current === c) {
				proceed();
				break;
			}
			current === '=' && proceed();
			break;
		case '*':
		case '%':
		case '^':
		case '/':
			current === '=' && proceed();
			break;
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			isNumericLiteral = true;
			setPosition(tokenPos);
			value = readNumericLiteral();
			if (current === '\\' || isIdentifierStart(current)) SyntaxError();
			return '';
		case '"':
		case "'":
			isStringLiteral = true;
			var t = c;
			while (true) {
				if (current === undefined || isLineTerminator(current)) SyntaxError();
				var c = proceed();
				if (c === t) {
					value = source.substring(tokenPos + 1, currentPos - 1);
					break;
				}
				if (c === '\\') {
					isEscaped = true;
					setPosition(tokenPos);
					value = readEscapedStringLiteral();
					break;
				}
			}
			return '';
		default:
			isIdentifierName = true;
			if (c === '\\') {
				isEscaped = true;
				setPosition(tokenPos);
				return readEscapedIdentifierName();
			}
			if (!isIdentifierStart(c)) SyntaxError();
			while (true) {
				if (current === '\\') {
					isEscaped = true;
					setPosition(tokenPos);
					return readEscapedIdentifierName();
				}
				if (!isIdentifierPart(current)) {
					break;
				}
				proceed();
			}
			break;
		}
		return source.substring(tokenPos, currentPos);
	}

	function readNumericLiteral() {
		var startPos = currentPos;
		if (current === '0') {
			proceed();
			if (current === 'X' || current === 'x') {
				proceed();
				if (!isHexDigitChar(current)) SyntaxError();
				while (isHexDigitChar(current)) {
					proceed();
				}
				return Number(source.substring(startPos, currentPos));
			}
			if (isOctalDigitChar(current)) {
				if (strict || STRICT_CONFORMANCE) SyntaxError();
				var x = mvDigitChar(proceed());
				while (isOctalDigitChar(current)) {
					x = (x << 3) + mvDigitChar(proceed());
				}
				return x;
			}
			if (current === '8' || current === '9') SyntaxError();
		}
		while (isDecimalDigitChar(current)) {
			proceed();
		}
		if (current === '.') {
			proceed();
			while (isDecimalDigitChar(current)) {
				proceed();
			}
		}
		if (current === 'E' || current === 'e') {
			proceed();
			if (current === '+' || current === '-') {
				proceed();
			}
			if (!isDecimalDigitChar(current)) SyntaxError();
			while (isDecimalDigitChar(current)) {
				proceed();
			}
		}
		return Number(source.substring(startPos, currentPos));
	}

	function readRegExpLiteral() {
		var pos = currentPos;
		proceed();
		while (true) {
			if (current === undefined || isLineTerminator(current)) SyntaxError();
			var c = proceed();
			if (c === '/') {
				break;
			}
			if (c === '\\') {
				if (current === undefined || isLineTerminator(current)) SyntaxError();
				proceed();
			}
			if (c === '[') {
				while (true) {
					if (current === undefined || isLineTerminator(current)) SyntaxError();
					var c = proceed();
					if (c === ']') {
						break;
					}
					if (c === '\\') {
						proceed();
					}
				}
			}
		}
		var pattern = source.substring(pos + 1, currentPos - 1);
		var pos = currentPos;
		while (true) {
			c = readIdentifierPart();
			if (c === undefined) {
				break;
			}
		}
		var flags = source.substring(pos, currentPos);
		try {
			return RegExp_Construct([ pattern, flags ]);
		} catch (e) {
			if (isInternalError(e)) throw e;
			SyntaxError(tokenPos);
		}
	}

	function readEscapedStringLiteral() {
		var buffer = [];
		var t = proceed();
		while (true) {
			if (current === undefined || isLineTerminator(current)) SyntaxError();
			var c = proceed();
			if (c === t) {
				break;
			}
			if (c === '\\') {
				if (current === undefined || isLineTerminator(current)) {
					var c = proceed();
					if (c === '\r' && current === '\n') {
						proceed();
					}
					continue;
				}
				var c = proceed();
				switch (c) {
				case 'b':
					c = '\b';
					break;
				case 'f':
					c = '\f';
					break;
				case 'n':
					c = '\n';
					break;
				case 'r':
					c = '\r';
					break;
				case 't':
					c = '\t';
					break;
				case 'v':
					c = '\v';
					break;
				case 'x':
					var x = 0;
					for (var i = 0; i < 2; i++) {
						if (!isHexDigitChar(current)) SyntaxError();
						x = (x << 4) + mvDigitChar(proceed());
					}
					c = fromCharCode(x);
					break;
				case 'u':
					var x = 0;
					for (var i = 0; i < 4; i++) {
						if (!isHexDigitChar(current)) SyntaxError();
						x = (x << 4) + mvDigitChar(proceed());
					}
					c = fromCharCode(x);
					break;
				case '0':
				case '1':
				case '2':
				case '3':
					if (strict || STRICT_CONFORMANCE) {
						if (c === '0' && isDecimalDigitChar(current) !== true) {
							c = '\0';
							break;
						}
						SyntaxError();
					}
					var x = mvDigitChar(c);
					if (current === '8' || current === '9') SyntaxError();
					if (isOctalDigitChar(current)) {
						x = (x << 4) + mvDigitChar(proceed());
						if (current === '8' || current === '9') SyntaxError();
						if (isOctalDigitChar(current)) {
							x = (x << 4) + mvDigitChar(proceed());
						}
					}
					c = fromCharCode(x);
					break;
				case '4':
				case '5':
				case '6':
				case '7':
					if (strict || STRICT_CONFORMANCE) SyntaxError();
					var x = mvDigitChar(c);
					if (current === '8' || current === '9') SyntaxError();
					if (isOctalDigitChar(current)) {
						x = (x << 4) + mvDigitChar(proceed());
					}
					c = fromCharCode(x);
					break;
				case '8':
				case '9':
					SyntaxError();
				}
			}
			buffer.push(c);
		}
		return join(buffer);
	}

	function readEscapedIdentifierName() {
		var buffer = [];
		var c = readIdentifierPart();
		if (!isIdentifierStart(c)) SyntaxError();
		buffer.push(c);
		while (true) {
			c = readIdentifierPart();
			if (c === undefined) {
				break;
			}
			buffer.push(c);
		}
		return join(buffer);
	}

	function readIdentifierPart() {
		if (current === '\\') {
			proceed();
			if (current !== 'u') SyntaxError();
			proceed();
			var x = 0;
			for (var i = 0; i < 4; i++) {
				if (!isHexDigitChar(current)) SyntaxError();
				x = (x << 4) + mvDigitChar(proceed());
			}
			var c = fromCharCode(x);
			if (!isIdentifierPart(c)) SyntaxError();
			return c;
		}
		if (!isIdentifierPart(current)) return undefined;
		return proceed();
	}

	function proceed() {
		var c = current;
		if (c !== undefined) {
			current = source[++currentPos];
		}
		return c;
	}

	function setPosition(pos) {
		currentPos = pos;
		current = source[currentPos];
	}

	function convertToLineColumn(source, pos) {
		var lineNumber = 1;
		var lineHeadPos = 0;
		var i = 0;
		while (i < pos) {
			var c = source[i++];
			if (!isLineTerminator(c)) {
				continue;
			}
			if (c === '\r' && source[i] === '\n') {
				i++;
			}
			lineNumber++;
			lineHeadPos = i;
		}
		return lineNumber + ":" + (pos - lineHeadPos + 1);
	}

	function locateDebugInfo(stackTraceEntry) {
		var code = stackTraceEntry.code;
		var sourceObject = code.sourceObject;
		var source = sourceObject.source;
		var pos = stackTraceEntry.pos;
		var finfo = sourceObject.filename + ":" + convertToLineColumn(source, pos);
		if (code.isFunctionCode) {
			return code.funcname + " (" + finfo + ")";
		}
		return finfo;
	}

	function SyntaxError(pos) {
		if (pos === undefined) {
			pos = currentPos;
		}
		var finfo = sourceObject.filename + ":" + convertToLineColumn(source, pos);
		throw VMSyntaxError(finfo);
	}

}();
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

// ECMAScript 5.1: 14 Program

function Program(sourceElements) {
	return function() {
		if (sourceElements === undefined) return CompletionValue("normal", empty, empty);
		else return sourceElements();
	};
}

function SourceElements(statements) {
	if (statements.length === 0) return undefined;

	if (statements.length === 1) return function() {
		try {
			return statements[0]();
		} catch (V) {
			if (isInternalError(V)) throw V;
			return CompletionValue("throw", V, empty);
		}
	};

	return function() {
		try {
			var headResult = statements[0]();
			for (var i = 1; i < statements.length; i++) {
				if (headResult.type !== "normal") return headResult;
				var tailResult = statements[i]();
				if (tailResult.value === empty) {
					var V = headResult.value;
				}
				else {
					var V = tailResult.value;
				}
				headResult = CompletionValue(tailResult.type, V, tailResult.target);
			}
			return headResult;
		} catch (V) {
			if (isInternalError(V)) throw V;
			return CompletionValue("throw", V, empty);
		}
	};
}

function NewSourceObject(source, strict, filename) {
	if (filename === undefined) {
		filename = "<unknown>";
	}
	if (SourceObjectClass === undefined) {
		SourceObjectClass = freeze({
			walkObject : SourceObject_walkObject,
			writeObject : SourceObject_writeObject,
			readObject : undefined,
			ClassID : CLASSID_SourceObject,
		});
	}
	var obj = Object.create(SourceObjectClass);
	obj.source = source;
	obj.strict = strict;
	obj.filename = ToString(filename);
	obj.subcodes = undefined;
	obj.isFunctionBody = undefined;
	obj.ID = 0;
	return preventExtensions(obj);
}

function evaluateProgram(text, filename) {
	try {
		var result = Global_evaluateProgram(undefined, [ text, filename ]);
	} catch (e) {
		if (isInternalError(e)) throw e;
		if (Type(e) !== TYPE_Object) {
			return {
				error : true,
				value : e,
			};
		}
		try {
			var value = ToString(e.Get("stack"));
		} catch (e) {
			if (isInternalError(e)) throw e;
			try {
				var value = ToString(e);
			} catch (e) {
				if (isInternalError(e)) throw e;
				var value = undefined;
			}
		}
		return {
			error : true,
			value : value,
		};
	}
	if (isPrimitiveValue(result)) {
		return {
			value : result,
		};
	}
	try {
		var value = JSON_stringify(undefined, [ result ]);
	} catch (e) {
		if (isInternalError(e)) throw e;
	}
	if (value === undefined) {
		try {
			var value = ToString(result);
		} catch (e) {
			if (isInternalError(e)) throw e;
		}
	}
	return {
		value : value,
	};
}
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

function SnapshotOutputStream(ostream) {
	return {
		writeInt : function(x) {
			ostream.writeInt(x);
		},
		writeString : function(x) {
			ostream.writeString(x);
		},
		writeBuffer : function(x) {
			ostream.writeBuffer(x);
		},
		writeAny : function(x) {
			ostream.writeAny(x);
		},
		writeValue : function(x) {
			switch (typeof x) {
			case "undefined":
				ostream.writeInt(1);
				return;
			case "boolean":
				ostream.writeInt((x === true) ? 2 : 3);
				return;
			case "number":
				ostream.writeInt(4);
				ostream.writeNumber(x);
				return;
			case "string":
				ostream.writeInt(5);
				ostream.writeString(x);
				return;
			}
			if (x === null) {
				ostream.writeInt(6);
				return;
			}
			assert(10 <= x.ID, x);
			ostream.writeInt(x.ID);
		},
	};
}

function SnapshotInputStream(istream, allObjs) {
	return {
		readInt : function() {
			return istream.readInt();
		},
		readString : function() {
			return istream.readString();
		},
		readBuffer : function() {
			return istream.readBuffer();
		},
		readAny : function() {
			return istream.readAny();
		},
		readValue : function() {
			var ID = istream.readInt();
			if (10 <= ID) {
				var obj = allObjs[ID];
				this.assert(obj !== undefined);
				return obj;
			}
			switch (ID) {
			case 1:
				return undefined;
			case 2:
				return true;
			case 3:
				return false;
			case 4:
				return istream.readNumber();
			case 5:
				return istream.readString();
			case 6:
				return null;
			}
			this.assert(false);
		},
		assert : function(condition) {
			if (condition !== true) {
				throw Error("snapshot broken");
			}
		},
	};
}

function writeSnapshot(l_ostream) {
	var ostream = SnapshotOutputStream(l_ostream);
	ostream.writeInt(1); // format version
	var allObjs = [];
	allObjs.length = 10;
	function mark(obj) {
		if (isSnapshotObject(obj) === false) {
			return;
		}
		if (obj.ID === 0) {
			obj.ID = allObjs.length;
			allObjs.push(obj);
		}
		assert(obj.ID >= 10, obj);
	}
	mark(builtin_Object_prototype);
	mark(builtin_Function_prototype);
	mark(builtin_Array_prototype);
	mark(builtin_String_prototype);
	mark(builtin_Boolean_prototype);
	mark(builtin_Number_prototype);
	mark(builtin_Date_prototype);
	mark(builtin_RegExp_prototype);
	mark(builtin_Error_prototype);
	mark(builtin_EvalError_prototype);
	mark(builtin_RangeError_prototype);
	mark(builtin_ReferenceError_prototype);
	mark(builtin_SyntaxError_prototype);
	mark(builtin_TypeError_prototype);
	mark(builtin_URIError_prototype);
	mark(theGlobalObject);
	mark(theGlobalEnvironment);
	mark(theEvalFunction);
	mark(theThrowTypeError);
	// mark extensions
	if (builtin_Buffer !== undefined) {
		mark(builtin_Buffer);
		mark(builtin_Buffer_prototype);
	}
	if (builtin_IOPort !== undefined) {
		mark(builtin_IOPort);
		mark(builtin_IOPort_prototype);
	}
	for ( var txid in IOManager_asyncCallbacks) {
		var callback = IOManager_asyncCallbacks[txid];
		mark(callback);
	}

	for (var i = 10; i < allObjs.length; i++) {
		var obj = allObjs[i];
		ostream.writeInt(obj.ClassID);
		if (obj.ClassID === CLASSID_SourceObject) {
			obj.writeObject(ostream);
		}
		obj.walkObject(mark);
	}
	ostream.writeInt(0);
	for (var i = 10; i < allObjs.length; i++) {
		var obj = allObjs[i];
		assert(obj.ID === i, obj);
		if (obj.ClassID !== CLASSID_SourceObject) {
			ostream.writeInt(obj.ID);
			obj.writeObject(ostream);
		}
	}

	// extensions
	{
		ostream.writeString("Timezone");
		ostream.writeInt(LocalTZA);
		ostream.writeString(LocalTZAString);
	}
	if (builtin_Buffer !== undefined) {
		ostream.writeString("Buffer");
		ostream.writeInt(builtin_Buffer.ID);
		ostream.writeInt(builtin_Buffer_prototype.ID);
	}
	if (builtin_IOPort !== undefined) {
		ostream.writeString("IOPort");
		ostream.writeInt(builtin_IOPort.ID);
		ostream.writeInt(builtin_IOPort_prototype.ID);
	}
	{
		ostream.writeString("IOManager");
		ostream.writeInt(IOManager_uniqueID);
		for ( var txid in IOManager_asyncCallbacks) {
			var callback = IOManager_asyncCallbacks[txid];
			ostream.writeInt(ToNumber(txid));
			ostream.writeInt(callback.ID);
		}
		ostream.writeInt(0);
	}
	ostream.writeString("end");

	//cleanup
	l_ostream.flush();
	for (var i = 10; i < allObjs.length; i++) {
		var obj = allObjs[i];
		obj.ID = 0;
	}
}

function readSnapshot(l_istream) {
	var allObjs = [];
	allObjs.length = 10;
	var istream = SnapshotInputStream(l_istream, allObjs);
	var version = istream.readInt();
	if (version > 1) {
		throw Error("version not supported: " + version);
	}
	while (true) {
		var ClassID = istream.readInt();
		if (ClassID === 0) {
			break;
		}
		switch (ClassID) {
		case CLASSID_DeclarativeEnvironment:
			var obj = NewDeclarativeEnvironment();
			break;
		case CLASSID_ObjectEnvironment:
			var obj = NewObjectEnvironment();
			break;
		case CLASSID_SourceObject:
			var obj = SourceObject_readObject(istream);
			break;
		default:
			var obj = VMObject(ClassID);
			break;
		}
		allObjs.push(obj);
	}
	for (var i = 10; i < allObjs.length; i++) {
		var obj = allObjs[i];
		if (obj.ClassID === CLASSID_SourceObject) {
			continue;
		}
		var ID = istream.readInt();
		istream.assert(ID === i);
		obj.readObject(istream);
	}
	var i = 10;
	builtin_Object_prototype = allObjs[i++];
	builtin_Function_prototype = allObjs[i++];
	builtin_Array_prototype = allObjs[i++];
	builtin_String_prototype = allObjs[i++];
	builtin_Boolean_prototype = allObjs[i++];
	builtin_Number_prototype = allObjs[i++];
	builtin_Date_prototype = allObjs[i++];
	builtin_RegExp_prototype = allObjs[i++];
	builtin_Error_prototype = allObjs[i++];
	builtin_EvalError_prototype = allObjs[i++];
	builtin_RangeError_prototype = allObjs[i++];
	builtin_ReferenceError_prototype = allObjs[i++];
	builtin_SyntaxError_prototype = allObjs[i++];
	builtin_TypeError_prototype = allObjs[i++];
	builtin_URIError_prototype = allObjs[i++];
	theGlobalObject = allObjs[i++];
	theGlobalEnvironment = allObjs[i++];
	theEvalFunction = allObjs[i++];
	theThrowTypeError = allObjs[i++];
	istream.assert(builtin_Object_prototype.ClassID === CLASSID_Object);
	istream.assert(builtin_Function_prototype.ClassID === CLASSID_BuiltinFunction);
	istream.assert(builtin_Array_prototype.ClassID === CLASSID_Array);
	istream.assert(builtin_String_prototype.ClassID === CLASSID_String);
	istream.assert(builtin_Boolean_prototype.ClassID === CLASSID_Boolean);
	istream.assert(builtin_Number_prototype.ClassID === CLASSID_Number);
	istream.assert(builtin_Date_prototype.ClassID === CLASSID_Date);
	istream.assert(builtin_RegExp_prototype.ClassID === CLASSID_RegExp);
	istream.assert(builtin_Error_prototype.ClassID === CLASSID_Error);
	istream.assert(builtin_EvalError_prototype.ClassID === CLASSID_Error);
	istream.assert(builtin_RangeError_prototype.ClassID === CLASSID_Error);
	istream.assert(builtin_ReferenceError_prototype.ClassID === CLASSID_Error);
	istream.assert(builtin_SyntaxError_prototype.ClassID === CLASSID_Error);
	istream.assert(builtin_TypeError_prototype.ClassID === CLASSID_Error);
	istream.assert(builtin_URIError_prototype.ClassID === CLASSID_Error);
	istream.assert(theGlobalObject.ClassID === CLASSID_Global);
	istream.assert(theGlobalEnvironment.ClassID === CLASSID_ObjectEnvironment);
	istream.assert(theEvalFunction.ClassID === CLASSID_BuiltinFunction);
	istream.assert(theThrowTypeError.ClassID === CLASSID_BuiltinFunction);
	initExecutionContext();

	// extensions
	LocalTZA = 9 * 3600000;
	LocalTZAString = "JST";
	builtin_Buffer = undefined;
	builtin_Buffer_prototype = undefined;
	builtin_IOPort = undefined;
	builtin_IOPort_prototype = undefined;
	assert(IOManager_state === 'offline');
	IOManager_uniqueID = 0
	IOManager_asyncCallbacks = {};
	while (true) {
		var ext = istream.readString();
		if (ext === "end") {
			break;
		}
		switch (ext) {
		case "Timezone":
			LocalTZA = istream.readInt();
			LocalTZAString = istream.readString();
			break;
		case "Buffer":
			builtin_Buffer = allObjs[istream.readInt()];
			builtin_Buffer_prototype = allObjs[istream.readInt()];
			istream.assert(builtin_Buffer.ClassID === CLASSID_BuiltinFunction);
			istream.assert(builtin_Buffer_prototype.ClassID === CLASSID_Buffer);
			break;
		case "IOPort":
			builtin_IOPort = allObjs[istream.readInt()];
			builtin_IOPort_prototype = allObjs[istream.readInt()];
			istream.assert(builtin_IOPort.ClassID === CLASSID_BuiltinFunction);
			istream.assert(builtin_IOPort_prototype.ClassID === CLASSID_IOPort);
			break;
		case "IOManager":
			IOManager_uniqueID = istream.readInt();
			while (true) {
				var txid = istream.readInt();
				if (txid === 0) {
					break;
				}
				var callback = allObjs[istream.readInt()];
				istream.assert(txid <= IOManager_uniqueID);
				istream.assert(IsCallable(callback));
				IOManager_asyncCallbacks[txid] = callback;
			}
			break;
		default:
			throw Error("unknown extension: " + ext);
		}
	}

	//cleanup
	for (var i = 10; i < allObjs.length; i++) {
		var obj = allObjs[i];
		if (obj.ClassID === CLASSID_SourceObject) {
			obj.subcodes = undefined;
		}
	}
}

function intrinsic_walkObject(O, mark) {
	mark(O.Prototype);
	for ( var P in O.$properties) {
		var prop = O.$properties[P];
		if (prop.Value !== absent) mark(prop.Value);
		if (prop.Get !== absent) mark(prop.Get);
		if (prop.Set !== absent) mark(prop.Set);
	}
}

function intrinsic_writeObject(O, ostream) {
	ostream.writeValue(O.Prototype);
	ostream.writeValue(O.Extensible);
	for ( var P in O.$properties) {
		var prop = O.$properties[P];
		var flag = (prop.Configurable ? 0 : 1) + (prop.Enumerable ? 0 : 2);
		if (IsDataDescriptor(prop)) {
			flag += (prop.Writable ? 0 : 4);
			ostream.writeInt(flag);
			ostream.writeValue(prop.Value);
		}
		else {
			flag += 8;
			ostream.writeInt(flag);
			ostream.writeValue(prop.Get);
			ostream.writeValue(prop.Set);
		}
		ostream.writeString(P);
	}
	ostream.writeInt(16);
}

function intrinsic_readObject(O, istream) {
	O.Prototype = istream.readValue();
	O.Extensible = istream.readValue();
	istream.assert(O.Prototype === null || Type(O.Prototype) === TYPE_Object);
	istream.assert(Type(O.Extensible) === TYPE_Boolean);
	while (true) {
		var flag = istream.readInt();
		if (flag === 16) {
			break;
		}
		istream.assert(flag <= 15);
		if ((flag & 8) === 0) {
			var Value = istream.readValue();
			var P = istream.readString();
			var prop = PropertyDescriptor({
				Value : Value,
				Writable : ((flag & 4) === 0),
				Configurable : ((flag & 1) === 0),
				Enumerable : ((flag & 2) === 0),
			});
			intrinsic_createData(O, P, prop);
		}
		else {
			var Get = istream.readValue();
			var Set = istream.readValue();
			istream.assert(Get === undefined || (Type(Get) === TYPE_Object && Get.Class === "Function"));
			istream.assert(Set === undefined || (Type(Set) === TYPE_Object && Set.Class === "Function"));
			var P = istream.readString();
			var prop = PropertyDescriptor({
				Get : Get,
				Set : Set,
				Configurable : ((flag & 1) === 0),
				Enumerable : ((flag & 2) === 0),
			});
			intrinsic_createAccessor(O, P, prop);
		}
	}
}

function default_walkObject(mark) {
	intrinsic_walkObject(this, mark);
}

function default_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
}

function default_readObject(istream) {
	intrinsic_readObject(this, istream);
}

function BuiltinFunctionObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeString(getIntrinsicFunctionName(this.Call));
	ostream.writeString(getIntrinsicFunctionName(this.Construct));
}

function BuiltinFunctionObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.Call = getIntrinsicFunction(istream.readString());
	this.Construct = getIntrinsicFunction(istream.readString());
	istream.assert(this.Call !== null && this.Call !== undefined);
	istream.assert(this.Construct !== null);
}

function FunctionObject_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	mark(this.Scope);
	mark(this.Code.sourceObject);
}

function FunctionObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.Scope);
	ostream.writeValue(this.Code.sourceObject);
	ostream.writeInt(this.Code.index);
	var length = this.FormalParameters.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		ostream.writeString(this.FormalParameters[i]);
	}
}

function FunctionObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.Scope = istream.readValue();
	var sourceObject = istream.readValue();
	var index = istream.readInt();
	this.Code = sourceObject.subcodes[index];
	var length = istream.readInt();
	this.FormalParameters = [];
	for (var i = 0; i < length; i++) {
		this.FormalParameters[i] = istream.readString();
	}
	istream.assert(Type(this.Scope) === TYPE_Environment);
	istream.assert(this.Code !== undefined);
}

function BindFunction_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	mark(this.TargetFunction);
	mark(this.BoundThis);
	this.BoundArgs.forEach(mark);
}

function BindFunction_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.TargetFunction);
	ostream.writeValue(this.BoundThis);
	var length = this.BoundArgs.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		ostream.writeValue(this.BoundArgs[i]);
	}
}

function BindFunction_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.TargetFunction = istream.readValue();
	this.BoundThis = istream.readValue();
	var length = istream.readInt();
	this.BoundArgs = [];
	for (var i = 0; i < length; i++) {
		this.BoundArgs[i] = istream.readValue();
	}
	istream.assert(Type(this.TargetFunction) === TYPE_Object && this.TargetFunction.Class === "Function");
}

function PrimitiveObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.PrimitiveValue);
}

function PrimitiveObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.PrimitiveValue = istream.readValue();
	this.Class === "String" && istream.assert(Type(this.PrimitiveValue) === TYPE_String);
	this.Class === "Boolean" && istream.assert(Type(this.PrimitiveValue) === TYPE_Boolean);
	this.Class === "Number" && istream.assert(Type(this.PrimitiveValue) === TYPE_Number);
	this.Class === "Date" && istream.assert(Type(this.PrimitiveValue) === TYPE_Number);
}

function RegExp_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
}

function RegExp_readObject(istream) {
	intrinsic_readObject(this, istream);
	try {
		theRegExpFactory.compile(this);
	} catch (e) {
		if (isInternalError(e)) throw e;
		console.log(e);
		console.log("debug :" + this.Get("source"))
	}
}

function Error_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	var length = this.stackTrace.length;
	for (var i = 0; i < length; i++) {
		var code = this.stackTrace[i].code;
		mark(code.sourceObject);
	}
}

function Error_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	var length = this.stackTrace.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		var code = this.stackTrace[i].code;
		var pos = this.stackTrace[i].pos;
		ostream.writeValue(code.sourceObject);
		ostream.writeInt(code.index);
		ostream.writeInt(pos);
	}
}

function Error_readObject(istream) {
	intrinsic_readObject(this, istream);
	var length = istream.readInt();
	this.stackTrace = [];
	for (var i = 0; i < length; i++) {
		var sourceObject = istream.readValue();
		var index = istream.readInt();
		var pos = istream.readInt();
		this.stackTrace[i] = {
			code : sourceObject.subcodes[index],
			pos : pos,
		};
	}
}

function Arguments_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	mark(this.ArgumentsScope);
}

function Arguments_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.ArgumentsScope);
	var length = this.ParameterMap.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		ostream.writeValue(this.ParameterMap[i]);
	}
}

function Arguments_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.ArgumentsScope = istream.readValue();
	var length = istream.readInt();
	this.ParameterMap = [];
	for (var i = 0; i < length; i++) {
		var name = istream.readValue();
		this.ParameterMap[i] = name;
		istream.assert(name === undefined || Type(name) === TYPE_String);
	}
	istream.assert(Type(this.ArgumentsScope) === TYPE_Environment);
}

function ObjectEnvironment_walkObject(mark) {
	var envRec = this.environmentRecord;
	mark(this.outer);
	mark(envRec.bindings);
}

function ObjectEnvironment_writeObject(ostream) {
	var envRec = this.environmentRecord;
	ostream.writeValue(this.outer);
	ostream.writeValue(envRec.bindings);
}

function ObjectEnvironment_readObject(istream) {
	var envRec = this.environmentRecord;
	this.outer = istream.readValue();
	envRec.bindings = istream.readValue();
	istream.assert(this.outer === null || Type(this.outer) === TYPE_Environment);
	istream.assert(Type(envRec.bindings) === TYPE_Object);
}

function DeclarativeEnvironment_walkObject(mark) {
	var envRec = this.environmentRecord;
	var $values = envRec.$values;
	mark(this.outer);
	for ( var N in $values) {
		mark($values[N]);
	}
}

function DeclarativeEnvironment_writeObject(ostream) {
	var envRec = this.environmentRecord;
	var $values = envRec.$values;
	var $attributes = envRec.$attributes;
	ostream.writeValue(this.outer);
	for ( var N in $values) {
		ostream.writeInt($attributes[N]);
		ostream.writeValue($values[N]);
		ostream.writeString(N);
	}
	ostream.writeInt(4);
}

function DeclarativeEnvironment_readObject(istream) {
	var envRec = this.environmentRecord;
	var $values = envRec.$values;
	var $attributes = envRec.$attributes;
	this.outer = istream.readValue();
	while (true) {
		var attr = istream.readInt();
		if (attr === 4) {
			break;
		}
		istream.assert(attr <= 3);
		var value = istream.readValue();
		var N = istream.readString();
		$attributes[N] = attr;
		$values[N] = value;
	}
	istream.assert(this.outer === null || Type(this.outer) === TYPE_Environment);
}

function SourceObject_walkObject(mark) {
}

function SourceObject_writeObject(ostream) {
	ostream.writeString(this.source);
	ostream.writeValue(this.strict);
	ostream.writeString(this.filename);
	ostream.writeValue(this.isFunctionBody);
}

function SourceObject_readObject(istream) {
	var source = istream.readString();
	var strict = istream.readValue();
	var filename = istream.readString();
	var isFunctionBody = istream.readValue();
	var subcodes = [];
	if (isFunctionBody) {
		var code = theParser.readFunctionCode(source, [], subcodes, filename);
	}
	else {
		var code = theParser.readProgram(source, strict, subcodes, filename);
	}
	var sourceObject = code.sourceObject;
	sourceObject.subcodes = subcodes;
	return sourceObject;
}

function BufferObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeBuffer(this.wrappedBuffer);
}

function BufferObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.wrappedBuffer = istream.readBuffer();
}
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

// ECMAScript 5.1: 12 Statements

function BlockStatement(statementList) {
	return function() {
		if (statementList === undefined) return CompletionValue("normal", empty, empty);
		return statementList();
	};
}

function StatementList(statements) {
	if (statements.length === 0) return undefined;
	if (statements.length === 1) return function() {
		try {
			var s = statements[0]();
		} catch (V) {
			if (isInternalError(V)) throw V;
			return CompletionValue("throw", V, empty);
		}
		return s;
	};

	return function() {
		try {
			var sl = statements[0]();
		} catch (V) {
			if (isInternalError(V)) throw V;
			return CompletionValue("throw", V, empty);
		}
		for (var i = 1; i < statements.length; i++) {
			if (sl.type !== "normal") return sl;
			try {
				var s = statements[i]();
			} catch (V) {
				if (isInternalError(V)) throw V;
				return CompletionValue("throw", V, empty);
			}
			if (s.value === empty) {
				var V = sl.value;
			}
			else {
				var V = s.value;
			}
			sl = CompletionValue(s.type, V, s.target);
		}
		return sl;
	};
}

function VariableStatement(variableDeclarationList) {
	return function() {
		for (var i = 0; i !== variableDeclarationList.length; i++) {
			variableDeclarationList[i]();
		}
		return CompletionValue("normal", empty, empty);
	};
}

function VariableDeclaration(identifier, initialiser, strict, pos) {
	return function() {
		if (initialiser !== undefined) {
			runningSourcePos = pos;
			var env = LexicalEnvironment;
			var lhs = GetIdentifierReference(env, identifier, strict);
			var rhs = initialiser();
			var value = GetValue(rhs);
			PutValue(lhs, value);
		}
		return identifier;
	};
}

function EmptyStatement() {
	return function() {
		return CompletionValue("normal", empty, empty);
	};
}

function ExpressionStatement(expression, pos) {
	return function() {
		runningSourcePos = pos;
		var exprRef = expression();
		return CompletionValue("normal", GetValue(exprRef), empty);
	};
}

function IfStatement(expression, firstStatement, secondStatement, pos) {
	return function() {
		runningSourcePos = pos;
		var exprRef = expression();
		if (ToBoolean(GetValue(exprRef)) === true) return firstStatement();
		else {
			if (secondStatement === undefined) return CompletionValue("normal", empty, empty);
			return secondStatement();
		}
	};
}

function DoWhileStatement(statement, expression, labelset, pos) {
	return function() {
		var V = empty;
		while (true) {
			var stmt = statement();
			if (stmt.value !== empty) {
				V = stmt.value;
			}
			if (stmt.type !== "continue" || isInLabelSet(stmt.target, labelset) === false) {
				if (stmt.type === "break" && isInLabelSet(stmt.target, labelset) === true) return CompletionValue("normal", V, empty);
				if (stmt.type !== "normal") return stmt;
			}
			runningSourcePos = pos;
			var exprRef = expression();
			if (ToBoolean(GetValue(exprRef)) === false) {
				break;
			}
		}
		return CompletionValue("normal", V, empty);
	};
}

function WhileStatement(expression, statement, labelset, pos) {
	return function() {
		var V = empty;
		while (true) {
			runningSourcePos = pos;
			var exprRef = expression();
			if (ToBoolean(GetValue(exprRef)) === false) {
				break;
			}
			var stmt = statement();
			if (stmt.value !== empty) {
				V = stmt.value;
			}
			if (stmt.type !== "continue" || isInLabelSet(stmt.target, labelset) === false) {
				if (stmt.type === "break" && isInLabelSet(stmt.target, labelset) === true) return CompletionValue("normal", V, empty);
				if (stmt.type !== "normal") return stmt;
			}
		}
		return CompletionValue("normal", V, empty);
	};
}

function ForStatement(expressionNoIn, firstExpression, secondExpression, statement, labelset, pos1, pos2, pos3) {
	return function() {
		if (expressionNoIn !== undefined) {
			runningSourcePos = pos1;
			var exprRef = expressionNoIn();
			GetValue(exprRef);
		}
		var V = empty;
		while (true) {
			if (firstExpression !== undefined) {
				runningSourcePos = pos2;
				var testExprRef = firstExpression();
				if (ToBoolean(GetValue(testExprRef)) === false) return CompletionValue("normal", V, empty);
			}
			var stmt = statement();
			if (stmt.value !== empty) {
				V = stmt.value;
			}
			if (stmt.type === "break" && isInLabelSet(stmt.target, labelset) === true) return CompletionValue("normal", V, empty);
			if (stmt.type !== "continue" || isInLabelSet(stmt.target, labelset) === false) {
				if (stmt.type !== "normal") return stmt;
			}
			if (secondExpression !== undefined) {
				runningSourcePos = pos3;
				var incExprRef = secondExpression();
				GetValue(incExprRef);
			}
		}
	};
}

function ForVarStatement(variableDeclarationList, firstExpression, secondExpression, statement, labelset, pos1, pos2) {
	return function() {
		for (var i = 0; i < variableDeclarationList.length; i++) {
			variableDeclarationList[i]();
		}
		var V = empty;
		while (true) {
			if (firstExpression !== undefined) {
				runningSourcePos = pos1;
				var testExprRef = firstExpression();
				if (ToBoolean(GetValue(testExprRef)) === false) return CompletionValue("normal", V, empty);
			}
			var stmt = statement();
			if (stmt.value !== empty) {
				V = stmt.value;
			}
			if (stmt.type === "break" && isInLabelSet(stmt.target, labelset) === true) return CompletionValue("normal", V, empty);
			if (stmt.type !== "continue" || isInLabelSet(stmt.target, labelset) === false) {
				if (stmt.type !== "normal") return stmt;
			}
			if (secondExpression !== undefined) {
				runningSourcePos = pos2;
				var incExprRef = secondExpression();
				GetValue(incExprRef);
			}
		}
	};
}

function ForInStatement(leftHandSideExpression, expression, statement, labelset, pos1, pos2) {
	return function() {
		runningSourcePos = pos2;
		var exprRef = expression();
		var experValue = GetValue(exprRef);
		if (experValue === null || experValue === undefined) return CompletionValue("normal", empty, empty);
		var obj = ToObject(experValue);
		var V = empty;
		var next = obj.enumerator(false, true);
		while (true) {
			var P = next();
			if (P === undefined) return CompletionValue("normal", V, empty);
			runningSourcePos = pos1;
			var lhsRef = leftHandSideExpression();
			PutValue(lhsRef, P);
			var stmt = statement();
			if (stmt.value !== empty) {
				V = stmt.value;
			}
			if (stmt.type === "break" && isInLabelSet(stmt.target, labelset) === true) return CompletionValue("normal", V, empty);
			if (stmt.type !== "continue" || isInLabelSet(stmt.target, labelset) === false) {
				if (stmt.type !== "normal") return stmt;
			}
		}
	};
}

function ForVarInStatement(variableDeclarationNoIn, expression, statement, labelset, strict, pos1, pos2) {
	return function() {
		var varName = variableDeclarationNoIn();
		runningSourcePos = pos2;
		var exprRef = expression();
		var experValue = GetValue(exprRef);
		if (experValue === null || experValue === undefined) return CompletionValue("normal", empty, empty);
		var obj = ToObject(experValue);
		var V = empty;
		var next = obj.enumerator(false, true);
		while (true) {
			var P = next();
			if (P === undefined) return CompletionValue("normal", V, empty);
			runningSourcePos = pos1;
			var env = LexicalEnvironment;
			var varRef = GetIdentifierReference(env, varName, strict);
			PutValue(varRef, P);
			var stmt = statement();
			if (stmt.value !== empty) {
				V = stmt.value;
			}
			if (stmt.type === "break" && isInLabelSet(stmt.target, labelset) === true) return CompletionValue("normal", V, empty);
			if (stmt.type !== "continue" || isInLabelSet(stmt.target, labelset) === false) {
				if (stmt.type !== "normal") return stmt;
			}
		}
	};
}

function ContinueStatement(identifier) {
	return function() {
		if (identifier === undefined) return CompletionValue("continue", empty, empty);
		else return CompletionValue("continue", empty, identifier);
	};
}

function BreakStatement(identifier) {
	return function() {
		if (identifier === undefined) return CompletionValue("break", empty, empty);
		else return CompletionValue("break", empty, identifier);
	};
}

function ReturnStatement(expression, pos) {
	return function() {
		if (expression === undefined) return CompletionValue("return", undefined, empty);
		runningSourcePos = pos;
		var exprRef = expression();
		return CompletionValue("return", GetValue(exprRef), empty);
	};
}

function WithStatement(expression, statement, pos) {
	return function() {
		runningSourcePos = pos;
		var val = expression();
		var obj = ToObject(GetValue(val));
		var oldEnv = LexicalEnvironment;
		var newEnv = NewObjectEnvironment(obj, oldEnv);
		newEnv.environmentRecord.provideThis = true;
		LexicalEnvironment = newEnv;
		try {
			var C = statement();
		} catch (V) {
			if (isInternalError(V)) throw V;
			C = CompletionValue("throw", V, empty);
		}
		LexicalEnvironment = oldEnv;
		return C;
	};
}

function SwitchStatement(expression, caseBlock, labelset, pos) {
	return function() {
		runningSourcePos = pos;
		var exprRef = expression();
		var R = caseBlock(GetValue(exprRef));
		if (R.type === "break" && isInLabelSet(R.target, labelset) === true) return CompletionValue("normal", R.value, empty);
		return R;
	};
}

function CaseBlock(A, defaultClause, B) {
	if (defaultClause === undefined) return function(input) {
		var V = empty;
		var searching = true;
		for (var i = 0; searching && (i < A.length); i++) {
			var C = A[i];
			var clauseSelector = C.evaluate();
			if (input === clauseSelector) {
				searching = false;
				if (C.statementList !== undefined) {
					var R = C.statementList();
					if (R.type !== "normal") return R;
					V = R.value;
				}
			}
		}
		for (; i < A.length; i++) {
			var C = A[i];
			if (C.statementList !== undefined) {
				var R = C.statementList();
				if (R.value !== empty) {
					V = R.value;
				}
				if (R.type !== "normal") return CompletionValue(R.type, V, R.target);
			}
		}
		return CompletionValue("normal", V, empty);
	};

	return function(input) {
		var V = empty;
		var found = false;
		for (var i = 0; i < A.length; i++) {
			var C = A[i];
			if (found === false) {
				var clauseSelector = C.evaluate();
				if (input === clauseSelector) {
					found = true;
				}
			}
			if (found === true) {
				if (C.statementList !== undefined) {
					var R = C.statementList();
					if (R.value !== empty) {
						V = R.value;
					}
					if (R.type !== "normal") return CompletionValue(R.type, V, R.target);
				}
			}
		}
		var foundInB = false;
		if (found === false) {
			for (var j = 0; foundInB === false && (j < B.length); j++) {
				var C = B[j];
				var clauseSelector = C.evaluate();
				if (input === clauseSelector) {
					foundInB = true;
					if (C.statementList !== undefined) {
						var R = C.statementList();
						if (R.value !== empty) {
							V = R.value;
						}
						if (R.type !== "normal") return CompletionValue(R.type, V, R.target);
					}
				}
			}
		}
		if (foundInB === false && defaultClause !== undefined) {
			var R = defaultClause();
			if (R.value !== empty) {
				V = R.value;
			}
			if (R.type !== "normal") return CompletionValue(R.type, V, R.target);
		}
		// specification Bug 345
		if (foundInB === false) {
			j = 0;
		}
		// end of bug fix
		for (; j < B.length; j++) {
			var C = B[j];
			if (C.statementList !== undefined) {
				var R = C.statementList();
				if (R.value !== empty) {
					V = R.value;
				}
				if (R.type !== "normal") return CompletionValue(R.type, V, R.target);
			}
		}
		return CompletionValue("normal", V, empty);
	};
}

function CaseClause(expression, statementList, pos) {
	return preventExtensions({
		statementList : statementList,
		evaluate : function() {
			runningSourcePos = pos;
			var exprRef = expression();
			return GetValue(exprRef);
		}
	});
}

function isInLabelSet(target, labelset) {
	if (target === empty) return true;
	if (labelset === undefined) return false;
	if (isIncluded(target, labelset)) return true;
	return false;
}

function LabelledStatement(identifier, statement) {
	return function() {
		var stmt = statement();
		if (stmt.type === "break" && stmt.target === identifier) return CompletionValue("normal", stmt.value, empty);
		return stmt;
	};
}

function ThrowStatement(expression, pos) {
	return function() {
		runningSourcePos = pos;
		var exprRef = expression();
		return CompletionValue("throw", GetValue(exprRef), empty);
	};
}

function TryStatement(block, catchBlock, finallyBlock) {
	if (finallyBlock === undefined) return function() {
		var B = block();
		if (B.type !== "throw") return B;
		return catchBlock(B.value);
	};

	if (catchBlock === undefined) return function() {
		var B = block();
		var F = finallyBlock();
		if (F.type === "normal") return B;
		return F;
	};

	return function() {
		var B = block();
		if (B.type === "throw") {
			var C = catchBlock(B.value);
		}
		else {
			var C = B;
		}
		var F = finallyBlock();
		if (F.type === "normal") return C;
		return F;
	};
}

function CatchBlock(identifier, block) {
	return function(C) {
		var oldEnv = LexicalEnvironment;
		var catchEnv = NewDeclarativeEnvironment(oldEnv);
		var envRec = catchEnv.environmentRecord;
		envRec.CreateMutableBinding(identifier);
		envRec.SetMutableBinding(identifier, C, false);
		LexicalEnvironment = catchEnv;
		var B = block();
		LexicalEnvironment = oldEnv;
		return B;
	};
}

function DebuggerStatement(pos) {
	return function() {
		runningSourcePos = pos;
		debugger;
		return CompletionValue("normal", empty, empty);
	};
}
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

var microtaskQueue = [];

function scheduleMicrotask(callback, args) {
	var task = {
		callback : callback,
		args : args
	};
	microtaskQueue.push(task);
}

function runMicrotasks() {
	while (microtaskQueue.length > 0) {
		for (var i = 0; i < microtaskQueue.length && i < 100; i++) {
			var task = microtaskQueue[i];
			var callback = task.callback;
			var args = task.args;
			assert(IsCallable(callback), callback);
			assert(args instanceof Array, args);
			try {
				callback.Call(undefined, args);
			} catch (e) {
				if (isInternalError(e)) throw e;
				//TODO handle uncaught exception
			}
		}
		microtaskQueue.shift(i);
	}
}
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

// ECMAScript 5.1: 8 Types

var TYPE_Undefined = 1;
var TYPE_Boolean = 2;
var TYPE_Number = 3;
var TYPE_String = 4;
var TYPE_Null = 5;
var TYPE_Object = 6;
var TYPE_Reference = 7;
var TYPE_EnvironmentRecord = 8;
var TYPE_Environment = 9;

function Type(x) {
	switch (typeof x) {
	case "undefined":
		return TYPE_Undefined;
	case "boolean":
		return TYPE_Boolean;
	case "number":
		return TYPE_Number;
	case "string":
		return TYPE_String;
	}
	if (x === null) return TYPE_Null;
	if (x.Class !== undefined) return TYPE_Object;
	if (x.referencedName !== undefined) return TYPE_Reference;
	if (x.HasBinding !== undefined) return TYPE_EnvironmentRecord;
	if (x.environmentRecord !== undefined) return TYPE_Environment;
	assert(false, x);
}

var CLASSID_Object = 1;
var CLASSID_BuiltinFunction = 2;
var CLASSID_FunctionObject = 3;
var CLASSID_BindFunction = 4;
var CLASSID_Array = 5;
var CLASSID_String = 6;
var CLASSID_Boolean = 7;
var CLASSID_Number = 8;
var CLASSID_Date = 9;
var CLASSID_RegExp = 10;
var CLASSID_Error = 11;
var CLASSID_Global = 12;
var CLASSID_Math = 13;
var CLASSID_JSON = 14;
var CLASSID_Arguments = 15;
var CLASSID_PlainArguments = 16;
var CLASSID_DeclarativeEnvironment = 17;
var CLASSID_ObjectEnvironment = 18;
var CLASSID_SourceObject = 19;
// extensions
var CLASSID_Buffer = 20;
var CLASSID_IOPort = 21;

var VMObjectClass;
var VMBuiltinFunctionClass;
var VMFunctionObjectClass;
var VMBindFunctionClass;
var VMArrayClass;
var VMStringClass;
var VMBooleanClass;
var VMNumberClass;
var VMDateClass;
var VMRegExpClass;
var VMErrorClass;
var VMGlobalClass;
var VMMathClass;
var VMJSONClass;
var VMArgumentsClass;
var VMPlainArgumentsClass;
var DeclarativeEnvironmentClass;
var ObjectEnvironmentClass;
var SourceObjectClass;
// extensions
var VMBufferClass;
var VMIOPortClass;

function setAlltheInternalMethod(Class, ClassID) {
	var obj = Object.create(null);
	obj.Class = Class;
	obj.ClassID = ClassID;
	obj.GetOwnProperty = default_GetOwnProperty;
	obj.GetProperty = default_GetProperty;
	obj.Get = default_Get;
	obj.CanPut = default_CanPut;
	obj.Put = default_Put;
	obj.HasProperty = default_HasProperty;
	obj.Delete = default_Delete;
	obj.DefaultValue = default_DefaultValue;
	obj.DefineOwnProperty = default_DefineOwnProperty;
	obj.enumerator = default_enumerator;
	obj.walkObject = default_walkObject;
	obj.writeObject = default_writeObject;
	obj.readObject = default_readObject;
	return obj;
}

function VMObject(ClassID) {
	switch (ClassID) {
	case CLASSID_Object:
		if (VMObjectClass === undefined) {
			var obj = setAlltheInternalMethod("Object", ClassID);
			VMObjectClass = freeze(obj);
		}
		var obj = Object.create(VMObjectClass);
		break;
	case CLASSID_BuiltinFunction:
		if (VMBuiltinFunctionClass === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.Get = FunctionObject_Get;
			obj.HasInstance = FunctionObject_HasInstance;
			obj.writeObject = BuiltinFunctionObject_writeObject;
			obj.readObject = BuiltinFunctionObject_readObject;
			VMBuiltinFunctionClass = freeze(obj);
		}
		var obj = Object.create(VMBuiltinFunctionClass);
		obj.Call = undefined;
		obj.Construct = undefined;
		break;
	case CLASSID_FunctionObject:
		if (VMFunctionObjectClass === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.Get = FunctionObject_Get;
			obj.Call = FunctionObject_Call;
			obj.Construct = FunctionObject_Construct;
			obj.HasInstance = FunctionObject_HasInstance;
			obj.walkObject = FunctionObject_walkObject;
			obj.writeObject = FunctionObject_writeObject;
			obj.readObject = FunctionObject_readObject;
			VMFunctionObjectClass = freeze(obj);
		}
		var obj = Object.create(VMFunctionObjectClass);
		obj.Scope = undefined;
		obj.FormalParameters = undefined;
		obj.Code = undefined;
		break;
	case CLASSID_BindFunction:
		if (VMBindFunctionClass === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.Get = FunctionObject_Get;
			obj.Call = BindFunction_Call;
			obj.Construct = BindFunction_Construct;
			obj.HasInstance = BindFunction_HasInstance;
			obj.walkObject = BindFunction_walkObject;
			obj.writeObject = BindFunction_writeObject;
			obj.readObject = BindFunction_readObject;
			VMBindFunctionClass = freeze(obj);
		}
		var obj = Object.create(VMBindFunctionClass);
		obj.TargetFunction = undefined;
		obj.BoundThis = undefined;
		obj.BoundArgs = undefined;
		break;
	case CLASSID_Array:
		if (VMArrayClass === undefined) {
			var obj = setAlltheInternalMethod("Array", ClassID);
			obj.DefineOwnProperty = ArrayObject_DefineOwnProperty;
			VMArrayClass = freeze(obj);
		}
		var obj = Object.create(VMArrayClass);
		break;
	case CLASSID_String:
		if (VMStringClass === undefined) {
			var obj = setAlltheInternalMethod("String", ClassID);
			obj.GetOwnProperty = StringObject_GetOwnProperty;
			obj.enumerator = StringObject_enumerator;
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMStringClass = freeze(obj);
		}
		var obj = Object.create(VMStringClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Boolean:
		if (VMBooleanClass === undefined) {
			var obj = setAlltheInternalMethod("Boolean", ClassID);
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMBooleanClass = freeze(obj);
		}
		var obj = Object.create(VMBooleanClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Number:
		if (VMNumberClass === undefined) {
			var obj = setAlltheInternalMethod("Number", ClassID);
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMNumberClass = freeze(obj);
		}
		var obj = Object.create(VMNumberClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Date:
		if (VMDateClass === undefined) {
			var obj = setAlltheInternalMethod("Date", ClassID);
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMDateClass = freeze(obj);
		}
		var obj = Object.create(VMDateClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_RegExp:
		if (VMRegExpClass === undefined) {
			var obj = setAlltheInternalMethod("RegExp", ClassID);
			obj.writeObject = RegExp_writeObject;
			obj.readObject = RegExp_readObject;
			VMRegExpClass = freeze(obj);
		}
		var obj = Object.create(VMRegExpClass);
		obj.Match = undefined;
		obj.NCapturingParens = undefined;
		break;
	case CLASSID_Error:
		if (VMErrorClass === undefined) {
			var obj = setAlltheInternalMethod("Error", ClassID);
			obj.walkObject = Error_walkObject;
			obj.writeObject = Error_writeObject;
			obj.readObject = Error_readObject;
			VMErrorClass = freeze(obj);
		}
		var obj = Object.create(VMErrorClass);
		obj.stackTrace = [];
		break;
	case CLASSID_Global:
		if (VMGlobalClass === undefined) {
			var obj = setAlltheInternalMethod("Global", ClassID);
			VMGlobalClass = freeze(obj);
		}
		var obj = Object.create(VMGlobalClass);
		break;
	case CLASSID_Math:
		if (VMMathClass === undefined) {
			var obj = setAlltheInternalMethod("Math", ClassID);
			VMMathClass = freeze(obj);
		}
		var obj = Object.create(VMMathClass);
		break;
	case CLASSID_JSON:
		if (VMJSONClass === undefined) {
			var obj = setAlltheInternalMethod("JSON", ClassID);
			VMJSONClass = freeze(obj);
		}
		var obj = Object.create(VMJSONClass);
		break;
	case CLASSID_Arguments:
		if (VMArgumentsClass === undefined) {
			var obj = setAlltheInternalMethod("Arguments", ClassID);
			obj.GetOwnProperty = Arguments_GetOwnProperty;
			obj.Get = Arguments_Get;
			obj.Delete = Arguments_Delete;
			obj.DefineOwnProperty = Arguments_DefineOwnProperty;
			obj.walkObject = Arguments_walkObject;
			obj.writeObject = Arguments_writeObject;
			obj.readObject = Arguments_readObject;
			VMArgumentsClass = freeze(obj);
		}
		var obj = Object.create(VMArgumentsClass);
		obj.ParameterMap = undefined;
		obj.ArgumentsScope = undefined;
		break;
	case CLASSID_PlainArguments:
		if (VMPlainArgumentsClass === undefined) {
			var obj = setAlltheInternalMethod("Arguments", ClassID);
			VMPlainArgumentsClass = freeze(obj);
		}
		var obj = Object.create(VMPlainArgumentsClass);
		break;
	//extensions
	case CLASSID_Buffer:
		if (VMBufferClass === undefined) {
			var obj = setAlltheInternalMethod("Buffer", ClassID);
			obj.GetOwnProperty = BufferObject_GetOwnProperty;
			obj.enumerator = BufferObject_enumerator;
			obj.DefineOwnProperty = BufferObject_DefineOwnProperty;
			obj.writeObject = BufferObject_writeObject;
			obj.readObject = BufferObject_readObject;
			VMBufferClass = freeze(obj);
		}
		var obj = Object.create(VMBufferClass);
		obj.wrappedBuffer = undefined;
		break;
	case CLASSID_IOPort:
		if (VMIOPortClass === undefined) {
			var obj = setAlltheInternalMethod("IOPort", ClassID);
			VMIOPortClass = freeze(obj);
		}
		var obj = Object.create(VMIOPortClass);
		obj.portId = undefined;
		obj.handler = undefined;
		break;
	default:
		assert(false, ClassID);
	}
	obj.$properties = Object.create(null);
	obj.Prototype = undefined;
	obj.Extensible = undefined;
	obj.ID = 0;
	return preventExtensions(obj);
}

function ReferenceValue(base, referencedName, strictReference) {
	return freeze({
		base : base,
		referencedName : referencedName,
		strictReference : strictReference,
	});
}

function GetBase(V) {
	return V.base;
}

function GetReferencedName(V) {
	return V.referencedName;
}

function IsStrictReference(V) {
	return V.strictReference;
}

function HasPrimitiveBase(V) {
	switch (typeof V.base) {
	case "boolean":
	case "string":
	case "number":
		return true;
	}
	return false;
}

function IsPropertyReference(V) {
	if (Type(V.base) === TYPE_Object) return true;
	return HasPrimitiveBase(V);
}

function IsUnresolvableReference(V) {
	if (V.base === undefined) return true;
	return false;
}

function GetValue(V) {
	if (Type(V) !== TYPE_Reference) return V;
	var base = GetBase(V);
	if (IsUnresolvableReference(V)) throw VMReferenceError(GetReferencedName(V));
	if (IsPropertyReference(V)) {
		if (HasPrimitiveBase(V) === false) return base.Get(GetReferencedName(V));
		else return specialGet(base, GetReferencedName(V));
	}
	else {
		assertEquals(Type(base), TYPE_EnvironmentRecord, base);
		return base.GetBindingValue(GetReferencedName(V), IsStrictReference(V));
	}
}

function specialGet(base, P) {
	var O = ToObject(base);
	var desc = O.GetProperty(P);
	if (desc === undefined) return undefined;
	if (IsDataDescriptor(desc) === true) return desc.Value;
	else {
		assert(IsAccessorDescriptor(desc), desc);
		var getter = desc.Get;
		if (getter === undefined) return undefined;
		return getter.Call(base, []);
	}
}

function PutValue(V, W) {
	if (Type(V) !== TYPE_Reference) throw VMReferenceError();
	var base = GetBase(V);
	if (IsUnresolvableReference(V)) {
		if (IsStrictReference(V) === true) throw VMReferenceError(GetReferencedName(V));
		theGlobalObject.Put(GetReferencedName(V), W, false);
	}
	else if (IsPropertyReference(V)) {
		if (HasPrimitiveBase(V) === false) {
			base.Put(GetReferencedName(V), W, IsStrictReference(V));
		}
		else {
			specialPut(base, GetReferencedName(V), W, IsStrictReference(V));
		}
	}
	else {
		assertEquals(Type(base), TYPE_EnvironmentRecord, base);
		base.SetMutableBinding(GetReferencedName(V), W, IsStrictReference(V));
	}
	return;
}

function specialPut(base, P, W, Throw) {
	var O = ToObject(base);
	if (O.CanPut(P) === false) {
		if (Throw === true) throw VMTypeError();
		else return;
	}
	var ownDesc = O.GetOwnProperty(P);
	if (IsDataDescriptor(ownDesc) === true) {
		if (Throw === true) throw VMTypeError();
		else return;
	}
	var desc = O.GetProperty(P);
	if (IsAccessorDescriptor(desc) === true) {
		var setter = desc.Set;
		setter.Call(base, [ W ]);
	}
	else if (Throw === true) throw VMTypeError();
	return;
}

function CompletionValue(type, value, target) {
	return preventExtensions({
		type : type,
		value : value,
		target : target,
	});
}

function PropertyDescriptor(Desc) {
	if (!Desc.hasOwnProperty("Value")) {
		Desc.Value = absent;
	}
	if (!Desc.hasOwnProperty("Writable")) {
		Desc.Writable = absent;
	}
	if (!Desc.hasOwnProperty("Get")) {
		Desc.Get = absent;
	}
	if (!Desc.hasOwnProperty("Set")) {
		Desc.Set = absent;
	}
	if (!Desc.hasOwnProperty("Configurable")) {
		Desc.Configurable = absent;
	}
	if (!Desc.hasOwnProperty("Enumerable")) {
		Desc.Enumerable = absent;
	}
	assert((Desc.Get === absent && Desc.Set === absent) || (Desc.Value === absent && Desc.Writable === absent), Desc);
	return freeze(Desc);
}

function IsAccessorDescriptor(Desc) {
	if (Desc === undefined) return false;
	if (Desc.Get === absent && Desc.Set === absent) return false;
	return true;
}

function IsDataDescriptor(Desc) {
	if (Desc === undefined) return false;
	if (Desc.Value === absent && Desc.Writable === absent) return false;
	return true;
}

function IsGenericDescriptor(Desc) {
	if (Desc === undefined) return false;
	if (IsAccessorDescriptor(Desc) === false && IsDataDescriptor(Desc) === false) return true;
	return false;
}

function FromPropertyDescriptor(Desc) {
	if (Desc === undefined) return undefined;
	var obj = Object_Construct([]);
	if (IsDataDescriptor(Desc) === true) {
		assert(Desc.Value !== absent, Desc);
		assert(Desc.Writable !== absent, Desc);
		obj.DefineOwnProperty("value", PropertyDescriptor({
			Value : Desc.Value,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		obj.DefineOwnProperty("writable", PropertyDescriptor({
			Value : Desc.Writable,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
	}
	else {
		assert(IsAccessorDescriptor(Desc), Desc);
		assert(Desc.Get !== absent, Desc);
		assert(Desc.Set !== absent, Desc);
		obj.DefineOwnProperty("get", PropertyDescriptor({
			Value : Desc.Get,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		obj.DefineOwnProperty("set", PropertyDescriptor({
			Value : Desc.Set,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
	}
	assert(Desc.Enumerable !== absent, Desc);
	assert(Desc.Configurable !== absent, Desc);
	obj.DefineOwnProperty("enumerable", PropertyDescriptor({
		Value : Desc.Enumerable,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), false);
	obj.DefineOwnProperty("configurable", PropertyDescriptor({
		Value : Desc.Configurable,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), false);
	return obj;
}

function ToPropertyDescriptor(Obj) {
	var Enumerable = absent;
	var Configurable = absent;
	var Value = absent;
	var Writable = absent;
	var Get = absent;
	var Set = absent;
	if (Type(Obj) !== TYPE_Object) throw VMTypeError();
	if (Obj.HasProperty("enumerable") === true) {
		var enum_ = Obj.Get("enumerable");
		var Enumerable = ToBoolean(enum_);
	}
	if (Obj.HasProperty("configurable") === true) {
		var conf = Obj.Get("configurable");
		var Configurable = ToBoolean(conf);
	}
	if (Obj.HasProperty("value") === true) {
		var value = Obj.Get("value");
		var Value = value;
	}
	if (Obj.HasProperty("writable") === true) {
		var writable = Obj.Get("writable");
		var Writable = ToBoolean(writable);
	}
	if (Obj.HasProperty("get") === true) {
		var getter = Obj.Get("get");
		if (IsCallable(getter) === false && getter !== undefined) throw VMTypeError();
		var Get = getter;
	}
	if (Obj.HasProperty("set") === true) {
		var setter = Obj.Get("set");
		if (IsCallable(setter) === false && setter !== undefined) throw VMTypeError();
		var Set = setter;
	}
	if (Get !== absent || Set !== absent) {
		if (Value !== absent || Writable !== absent) throw VMTypeError();
	}
	var desc = PropertyDescriptor({
		Enumerable : Enumerable,
		Configurable : Configurable,
		Value : Value,
		Writable : Writable,
		Get : Get,
		Set : Set,
	});
	return desc;
}

function default_GetOwnProperty(P) {
	return this.$properties[P];
}

function default_GetProperty(P) {
	var O = this;
	var prop = O.GetOwnProperty(P);
	if (prop !== undefined) return prop;
	var proto = O.Prototype;
	if (proto === null) return undefined;
	return proto.GetProperty(P);
}

function default_Get(P) {
	var O = this;
	var desc = O.GetProperty(P);
	if (desc === undefined) return undefined;
	if (IsDataDescriptor(desc) === true) return desc.Value;
	else {
		assert(IsAccessorDescriptor(desc), desc);
		var getter = desc.Get;
		if (getter === undefined) return undefined;
		return getter.Call(O, []);
	}
}

function default_CanPut(P) {
	var O = this;
	var desc = O.GetOwnProperty(P);
	if (desc !== undefined) {
		if (IsAccessorDescriptor(desc) === true) {
			if (desc.Set === undefined) return false;
			else return true;
		}
		else {
			assert(IsDataDescriptor(desc), desc);
		}
		return desc.Writable;
	}
	var proto = O.Prototype;
	if (proto === null) return O.Extensible;
	var inherited = proto.GetProperty(P);
	if (inherited === undefined) return O.Extensible;
	if (IsAccessorDescriptor(inherited) === true) {
		if (inherited.Set === undefined) return false;
		else return true;
	}
	else {
		assert(IsDataDescriptor(inherited), inherited);
		if (O.Extensible === false) return false;
		else return inherited.Writable;
	}
}

function default_Put(P, V, Throw) {
	var O = this;
	var ownDesc = O.GetOwnProperty(P);
	if (IsDataDescriptor(ownDesc) === true) {
		if (ownDesc.Writable === false) {
			if (Throw === true) throw VMTypeError();
			else return;
		}
		if (O.DefineOwnProperty === default_DefineOwnProperty) {
			//shortcut optimization
			intrinsic_set_value(O, P, V, ownDesc);
			return;
		}
		if (O.DefineOwnProperty === ArrayObject_DefineOwnProperty) {
			//shortcut optimization
			ArrayObject_DefineOwnProperty_Value(O, P, V, ownDesc);
			return;
		}
		var valueDesc = PropertyDescriptor({
			Value : V
		});
		O.DefineOwnProperty(P, valueDesc, Throw);
		return;
	}
	if (O.CanPut(P) === false) {
		if (Throw === true) throw VMTypeError();
		else return;
	}
	var desc = O.GetProperty(P);
	if (IsAccessorDescriptor(desc) === true) {
		var setter = desc.Set;
		assert(setter !== undefined, desc);
		setter.Call(O, [ V ]);
	}
	else {
		var newDesc = PropertyDescriptor({
			Value : V,
			Writable : true,
			Enumerable : true,
			Configurable : true
		});
		O.DefineOwnProperty(P, newDesc, Throw);
	}
	return;
}

function default_HasProperty(P) {
	var O = this;
	var desc = O.GetProperty(P);
	if (desc === undefined) return false;
	else return true;
}

function default_Delete(P, Throw) {
	var O = this;
	var desc = O.GetOwnProperty(P);
	if (desc === undefined) return true;
	if (desc.Configurable === true) {
		intrinsic_remove(O, P);
		return true;
	}
	else if (Throw) throw VMTypeError();
	return false;
}

function default_DefaultValue(hint) {
	var O = this;
	if (hint === undefined) {
		if (O.Class === "Date") {
			hint = TYPE_String;
		}
		else {
			hint = TYPE_Number;
		}
	}
	if (hint === TYPE_String) {
		var toString = O.Get("toString");
		if (IsCallable(toString) === true) {
			var str = toString.Call(O, []);
			if (Type(str) !== TYPE_Object) return str;
		}
		var valueOf = O.Get("valueOf");
		if (IsCallable(valueOf) === true) {
			var val = valueOf.Call(O, []);
			if (Type(val) !== TYPE_Object) return val;
		}
		throw VMTypeError();
	}
	if (hint === TYPE_Number) {
		var valueOf = O.Get("valueOf");
		if (IsCallable(valueOf) === true) {
			var val = valueOf.Call(O, []);
			if (Type(val) !== TYPE_Object) return val;
		}
		var toString = O.Get("toString");
		if (IsCallable(toString) === true) {
			var str = toString.Call(O, []);
			if (Type(str) !== TYPE_Object) return str;
		}
		throw VMTypeError();
	}
}

var emptyPropertyDescriptor = PropertyDescriptor({});

function default_DefineOwnProperty(P, Desc, Throw) {
	var O = this;
	var current = O.GetOwnProperty(P);
	var extensible = O.Extensible;
	if (current === undefined && extensible === false) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (current === undefined && extensible === true) {
		if (IsGenericDescriptor(Desc) === true || IsDataDescriptor(Desc) === true) {
			intrinsic_createData(O, P, Desc);
		}
		else {
			assert(IsAccessorDescriptor(Desc), Desc);
			intrinsic_createAccessor(O, P, Desc);
		}
		return true;
	}
	if (isEveryFieldOcurrsAndSameAs(Desc, emptyPropertyDescriptor)) return true;
	if (isEveryFieldOcurrsAndSameAs(Desc, current)) return true;
	if (current.Configurable === false) {
		if (Desc.Configurable === true) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
		if (Desc.Enumerable !== absent && current.Enumerable !== Desc.Enumerable) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
	}
	if (IsGenericDescriptor(Desc) === true) {
	}
	else if (IsDataDescriptor(current) !== IsDataDescriptor(Desc)) {
		if (current.Configurable === false) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
		if (IsDataDescriptor(current) === true) {
			intrinsic_createAccessor(O, P, PropertyDescriptor({
				Configurable : current.Configurable,
				Enumerable : current.Enumerable,
			}));
		}
		else {
			intrinsic_createData(O, P, PropertyDescriptor({
				Configurable : current.Configurable,
				Enumerable : current.Enumerable,
			}));
		}
	}
	else if (IsDataDescriptor(current) === true && IsDataDescriptor(Desc) === true) {
		if (current.Configurable === false) {
			if (current.Writable === false && Desc.Writable === true) {
				if (Throw === true) throw VMTypeError();
				else return false;
			}
			if (current.Writable === false) {
				if (Desc.Value !== absent && SameValue(Desc.Value, current.Value) === false) {
					if (Throw === true) throw VMTypeError();
					else return false;
				}
			}
		}
		else {
			assert(current.Configurable, current);
		}
	}
	else {
		assert(IsAccessorDescriptor(current), current);
		assert(IsAccessorDescriptor(Desc), Desc);
		if (current.Configurable === false) {
			if (Desc.Set !== absent && SameValue(Desc.Set, current.Set) === false) {
				if (Throw === true) throw VMTypeError();
				else return false;
			}
			if (Desc.Get !== absent && SameValue(Desc.Get, current.Get) === false) {
				if (Throw === true) throw VMTypeError();
				else return false;
			}
		}
	}
	intrinsic_set(O, P, Desc);
	return true;
}

function isEveryFieldOcurrsAndSameAs(Desc, x) {
	if (Desc.Value !== absent) {
		if (x.Value === absent) return false;
		if (!SameValue(Desc.Value, x.Value)) return false;
	}
	if (Desc.Writable !== absent) {
		if (x.Writable === absent) return false;
		if (!SameValue(Desc.Writable, x.Writable)) return false;
	}
	if (Desc.Get !== absent) {
		if (x.Get === absent) return false;
		if (!SameValue(Desc.Get, x.Get)) return false;
	}
	if (Desc.Set !== absent) {
		if (x.Set === absent) return false;
		if (!SameValue(Desc.Set, x.Set)) return false;
	}
	if (Desc.Configurable !== absent) {
		if (x.Configurable === absent) return false;
		if (!SameValue(Desc.Configurable, x.Configurable)) return false;
	}
	if (Desc.Enumerable !== absent) {
		if (x.Enumerable === absent) return false;
		if (!SameValue(Desc.Enumerable, x.Enumerable)) return false;
	}
	return true;
}

function default_enumerator(ownOnly, enumerableOnly) {
	return intrinsic_enumerator(this, ownOnly, enumerableOnly);
}

function intrinsic_set(O, P, Desc) {
	var x = O.$properties[P];
	O.$properties[P] = freeze({
		Value : (Desc.Value !== absent) ? Desc.Value : x.Value,
		Writable : (Desc.Writable !== absent) ? Desc.Writable : x.Writable,
		Get : (Desc.Get !== absent) ? Desc.Get : x.Get,
		Set : (Desc.Set !== absent) ? Desc.Set : x.Set,
		Configurable : (Desc.Configurable !== absent) ? Desc.Configurable : x.Configurable,
		Enumerable : (Desc.Enumerable !== absent) ? Desc.Enumerable : x.Enumerable,
	});
}

function intrinsic_set_value(O, P, V, x) {
	assert(x.Writable, x);
	O.$properties[P] = freeze({
		Value : V,
		Writable : true,
		Get : absent,
		Set : absent,
		Configurable : x.Configurable,
		Enumerable : x.Enumerable,
	});
}

function intrinsic_remove(O, P) {
	delete O.$properties[P];
}

function intrinsic_createData(O, P, Desc) {
	var x = {
		Value : undefined,
		Writable : false,
		Get : absent,
		Set : absent,
		Enumerable : false,
		Configurable : false,
	};
	if (Desc.Value !== absent) {
		x.Value = Desc.Value;
	}
	if (Desc.Writable !== absent) {
		x.Writable = Desc.Writable;
	}
	if (Desc.Configurable !== absent) {
		x.Configurable = Desc.Configurable;
	}
	if (Desc.Enumerable !== absent) {
		x.Enumerable = Desc.Enumerable;
	}
	O.$properties[P] = freeze(x);
}

function intrinsic_createAccessor(O, P, Desc) {
	var x = {
		Value : absent,
		Writable : absent,
		Get : undefined,
		Set : undefined,
		Enumerable : false,
		Configurable : false,
	};
	if (Desc.Get !== absent) {
		x.Get = Desc.Get;
	}
	if (Desc.Set !== absent) {
		x.Set = Desc.Set;
	}
	if (Desc.Configurable !== absent) {
		x.Configurable = Desc.Configurable;
	}
	if (Desc.Enumerable !== absent) {
		x.Enumerable = Desc.Enumerable;
	}
	O.$properties[P] = freeze(x);
}

function intrinsic_enumerator(O, ownOnly, enumerableOnly) {
	var names = Object.keys(O.$properties);
	if (ownOnly !== true) {
		var all = Object.create(null);
		var proto = O;
		while (proto !== null) {
			for ( var P in proto.$properties) {
				var desc = proto.$properties[P];
				if (enumerableOnly === false || desc.Enumerable === true) {
					all[P] = P;
				}
			}
			proto = proto.Prototype;
		}
		var names = Object.keys(all);
	}
	var i = 0;
	var next = function() {
		while (true) {
			var P = names[i++];
			if (P === undefined) return undefined;
			var desc = O.$properties[P];
			if (desc === undefined) {
				if (ownOnly === true) {
					continue;
				}
				var proto = O.Prototype;
				while (proto !== null) {
					var desc = proto.$properties[P];
					if (desc !== undefined) {
						break;
					}
					proto = proto.Prototype;
				}
				if (desc === undefined) {
					continue;
				}
			}
			if (enumerableOnly === false || desc.Enumerable === true) return P;
		}
	}
	return next;
}
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

function isWhiteSpace(c) {
	switch (c) {
	case '\u0009': // <TAB>
	case '\u000B': // <VT>
	case '\u000C': // <FF>
	case '\u0020': // <SP>
	case '\u00A0': // <NBSP>
	case '\uFEFF': // <BOM>
	case '\u1680':
	case '\u2000':
	case '\u2001':
	case '\u2002':
	case '\u2003':
	case '\u2004':
	case '\u2005':
	case '\u2006':
	case '\u2007':
	case '\u2008':
	case '\u2009':
	case '\u200A':
	case '\u202F':
	case '\u3000':
		return true;
	case '\u200B':
		if (STRICT_CONFORMANCE) return true;
		return false;
	case '\u180E':
	case '\u205F':
		if (STRICT_CONFORMANCE) return false;
		return true;
	}
	return false;
}

function isLineTerminator(c) {
	switch (c) {
	case '\u000A': // <LF>
	case '\u000D': // <CR>
	case '\u2028': // <LS>
	case '\u2029': // <PS>
		return true;
	}
	return false;
}

function isIdentifierStart(c) {
	if (c === undefined) return false;
	if (c === '$' || c === '_') return true;
	var x = toCharCode(c);
	if ((0x41 <= x) && (x <= 0x5a)) return true;
	if ((0x61 <= x) && (x <= 0x7a)) return true;
	if (x <= 0x7f) return false;
	if (unicodeLu.test(c)) return true;
	if (unicodeLl.test(c)) return true;
	if (unicodeLt.test(c)) return true;
	if (unicodeLm.test(c)) return true;
	if (unicodeLo.test(c)) return true;
	if (unicodeNl.test(c)) return true;
	return false;
}

function isIdentifierPart(c) {
	if (c === undefined) return false;
	if (c === '$' || c === '_') return true;
	var x = toCharCode(c);
	if ((0x30 <= x) && (x <= 0x39)) return true;
	if ((0x41 <= x) && (x <= 0x5a)) return true;
	if ((0x61 <= x) && (x <= 0x7a)) return true;
	if (x <= 0x7f) return false;
	if (unicodeLu.test(c)) return true;
	if (unicodeLl.test(c)) return true;
	if (unicodeLt.test(c)) return true;
	if (unicodeLm.test(c)) return true;
	if (unicodeLo.test(c)) return true;
	if (unicodeNl.test(c)) return true;
	if (unicodeMn.test(c)) return true;
	if (unicodeMc.test(c)) return true;
	if (unicodeNd.test(c)) return true;
	if (unicodePc.test(c)) return true;
	if (c === '\u200c' || c === '\u200d') return true;
	return false;
}

if (STRICT_CONFORMANCE) {
	// UNICODE 3.0.0
	var unicodeLl = /[\u0061-\u007A\u00AA\u00B5\u00BA\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233\u0250-\u02AD\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C8\u04CC\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F9\u0561-\u0587\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9B\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u207F\u210A\u210E\u210F\u2113\u212F\u2134\u2139\uFB00-\uFB06\uFB13-\uFB17\uFF41]/;
	var unicodeLm = /[\u02B0-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u037A\u0559\u0640\u06E5\u06E6\u0E46\u0EC6\u1843\u3005\u3031-\u3035\u309D\u309E\u30FC-\u30FE\uFF70\uFF9E]/;
	var unicodeLo = /[\u01BB\u01C0-\u01C3\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0641-\u064A\u0671-\u06D3\u06D5\u06FA-\u06FC\u0710\u0712-\u072C\u0780-\u07A5\u0905-\u0939\u093D\u0950\u0958-\u0961\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B36-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60\u0D61\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6A\u0F88-\u0F8B\u1000-\u1021\u1023-\u1027\u1029\u102A\u1050-\u1055\u10D0-\u10F6\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1206\u1208-\u1246\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1286\u1288\u128A-\u128D\u1290-\u12AE\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12CE\u12D0-\u12D6\u12D8-\u12EE\u12F0-\u130E\u1310\u1312-\u1315\u1318-\u131E\u1320-\u1346\u1348-\u135A\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u1780-\u17B3\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u2135-\u2138\u3006\u3041-\u3094\u30A1-\u30FA\u3105-\u312C\u3131-\u318E\u31A0-\u31B7\u3400\u4DB5\u4E00\u9FA5\uA000-\uA48C\uAC00\uD7A3\uF900-\uFA2D\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA]/;
	var unicodeLt = /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/;
	var unicodeLu = /[\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03D2-\u03D4\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u0400-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C7\u04CB\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F8\u0531-\u0556\u10A0-\u10C5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130\u2131\u2133\uFF21]/;
	var unicodeMc = /[\u0903\u093E-\u0940\u0949-\u094C\u0982\u0983\u09BE-\u09C0\u09C7\u09C8\u09CB\u09CC\u09D7\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B83\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD7\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0-\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0D02\u0D03\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D57\u0D82\u0D83\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DF2\u0DF3\u0F3E\u0F3F\u0F7F\u102C\u1031\u1038\u1056\u1057\u17B4-\u17B6\u17BE-\u17C5\u17C7]/;
	var unicodeMe = /[\u0488\u0489\u06DD\u06DE\u20DD-\u20E0\u20E2]/;
	var unicodeMn = /[\u0300-\u034E\u0360-\u0362\u0483-\u0486\u0591-\u05A1\u05A3-\u05B9\u05BB-\u05BD\u05BF\u05C1\u05C2\u05C4\u064B-\u0655\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u0901\u0902\u093C\u0941-\u0948\u094D\u0951-\u0954\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A70\u0A71\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0B01\u0B3C\u0B3F\u0B41-\u0B43\u0B4D\u0B56\u0B82\u0BC0\u0BCD\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0CBF\u0CC6\u0CCC\u0CCD\u0D41-\u0D43\u0D4D\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F90-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032\u1036\u1037\u1039\u1058\u1059\u17B7-\u17BD\u17C6\u17C9-\u17D3\u18A9\u20D0-\u20DC\u20E1\u302A-\u302F\u3099\u309A\uFB1E\uFE20]/;
	var unicodeNd = /[\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE7-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1369-\u1371\u17E0-\u17E9\u1810-\u1819\uFF10]/;
	var unicodeNl = /[\u2160-\u2183\u3007\u3021-\u3029\u3038]/;
	var unicodePc = /[\u005F\u203F\u2040\u30FB\uFE33\uFE34\uFE4D-\uFE4F\uFF3F\uFF65]/;
}
else {
	// UNICODE 5.1.0
	var unicodeLl = /[\u0061-\u007A\u00AA\u00B5\u00BA\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233\u0250-\u02AD\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C8\u04CC\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F9\u0561-\u0587\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9B\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u207F\u210A\u210E\u210F\u2113\u212F\u2134\u2139\uFB00-\uFB06\uFB13-\uFB17\uFF41]/;
	var unicodeLm = /[\u02B0-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u037A\u0559\u0640\u06E5\u06E6\u0E46\u0EC6\u1843\u3005\u3031-\u3035\u309D\u309E\u30FC-\u30FE\uFF70\uFF9E]/;
	var unicodeLo = /[\u01BB\u01C0-\u01C3\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0641-\u064A\u0671-\u06D3\u06D5\u06FA-\u06FC\u0710\u0712-\u072C\u0780-\u07A5\u0905-\u0939\u093D\u0950\u0958-\u0961\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B36-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60\u0D61\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6A\u0F88-\u0F8B\u1000-\u1021\u1023-\u1027\u1029\u102A\u1050-\u1055\u10D0-\u10F6\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1206\u1208-\u1246\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1286\u1288\u128A-\u128D\u1290-\u12AE\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12CE\u12D0-\u12D6\u12D8-\u12EE\u12F0-\u130E\u1310\u1312-\u1315\u1318-\u131E\u1320-\u1346\u1348-\u135A\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u1780-\u17B3\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u2135-\u2138\u3006\u3041-\u3094\u30A1-\u30FA\u3105-\u312C\u3131-\u318E\u31A0-\u31B7\u3400\u4DB5\u4E00\u9FA5\uA000-\uA48C\uAC00\uD7A3\uF900-\uFA2D\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA]/;
	var unicodeLt = /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/;
	var unicodeLu = /[\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03D2-\u03D4\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u0400-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C7\u04CB\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F8\u0531-\u0556\u10A0-\u10C5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130\u2131\u2133\uFF21]/;
	var unicodeMc = /[\u0903\u093E-\u0940\u0949-\u094C\u0982\u0983\u09BE-\u09C0\u09C7\u09C8\u09CB\u09CC\u09D7\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B83\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD7\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0-\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0D02\u0D03\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D57\u0D82\u0D83\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DF2\u0DF3\u0F3E\u0F3F\u0F7F\u102C\u1031\u1038\u1056\u1057\u17B4-\u17B6\u17BE-\u17C5\u17C7]/;
	var unicodeMe = /[\u0488\u0489\u06DD\u06DE\u20DD-\u20E0\u20E2]/;
	var unicodeMn = /[\u0300-\u034E\u0360-\u0362\u0483-\u0486\u0591-\u05A1\u05A3-\u05B9\u05BB-\u05BD\u05BF\u05C1\u05C2\u05C4\u064B-\u0655\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u0901\u0902\u093C\u0941-\u0948\u094D\u0951-\u0954\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A70\u0A71\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0B01\u0B3C\u0B3F\u0B41-\u0B43\u0B4D\u0B56\u0B82\u0BC0\u0BCD\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0CBF\u0CC6\u0CCC\u0CCD\u0D41-\u0D43\u0D4D\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F90-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032\u1036\u1037\u1039\u1058\u1059\u17B7-\u17BD\u17C6\u17C9-\u17D3\u18A9\u20D0-\u20DC\u20E1\u302A-\u302F\u3099\u309A\uFB1E\uFE20]/;
	var unicodeNd = /[\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE7-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1369-\u1371\u17E0-\u17E9\u1810-\u1819\uFF10]/;
	var unicodeNl = /[\u2160-\u2183\u3007\u3021-\u3029\u3038]/;
	var unicodePc = /[\u005F\u203F\u2040\u30FB\uFE33\uFE34\uFE4D-\uFE4F\uFF3F\uFF65]/;
}
function persha_initdb(){
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

'use strict'

var fs = require('fs');

initializeVM();

var prog = fs.readFileSync(INITSCRIPT_DIR + 'bridge.js').toString();
Global_evaluateProgram(undefined, [ prog, 'bridge.js' ]);

/* hacking
*/
Global_eval(undefined, [ "process.debug" ]).Call = function(thisValue, argumentsList) {
	console.log(argumentsList);
};

var natives_binding = Global_eval(undefined, [ "process.binding('natives')" ]);
var list = [ 'events', 'module', 'buffer', 'smalloc', 'util', 'assert', 'vm', 'timers', 'stream', 'console', 'fs', 'path', 'net', 'repl',
		'readline', 'domain', 'string_decoder', '_stream_readable', '_stream_writable', '_stream_duplex', '_stream_transform',
		'_stream_passthrough', ];
for (var i = 0; i < list.length; i++) {
	var n = list[i];
	var s = fs.readFileSync(INITSCRIPT_DIR + n + '.js').toString();
	natives_binding.Put(n, s, false);
}

var smalloc_binding = Global_eval(undefined, [ "process.binding('smalloc')" ]);
smalloc_binding.Put('kMaxLength', require('smalloc').kMaxLength, false);

var constants_binding = Global_eval(undefined, [ "process.binding('constants')" ]);
var constants = require('constants');
for ( var P in constants) {
	assert(isPrimitiveValue(constants[P]));
	constants_binding.Put(P, constants[P]);
}

var prog = fs.readFileSync(INITSCRIPT_DIR + 'node.js').toString();
var process = Global_eval(undefined, [ "process" ]);
try {
	var result = Global_evaluateProgram(undefined, [ prog, "node.js" ]).Call(theGlobalObject, [ process ]);
} catch (e) {
	if (isInternalError(e)) {
		console.log(e);
	}
	else {
		console.log(e.Get("stack"));
	}
	return;
}

runMicrotasks();

Journal_init();
}
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

'use strict'

var PERSHA_HOME;
var PERSHA_DB;
var JOURNAL_FILEBASE;
var INITSCRIPT_DIR;
var HANDLER_DIR;

(function() {
	var path = require('path');
	var fs = require('fs');

	function print_usage() {
		console.log("Usage:");
		console.log("    persha -initdb [directory]");
		console.log("    persha -startup [directory]");
		console.log("  where omitted directory can be specified by the environment ");
		console.log("  variable PERSHA_DB which defaults to $HOME/.persha");
	}

	var cmd = process.argv[2];
	switch (cmd) {
	case '-initdb':
	case '-startup':
		PERSHA_DB = process.argv[3];
		break;
	default:
		print_usage();
		process.exit(1);
	}

	if (typeof PERSHA_DB !== "string" || PERSHA_DB === "") {
		PERSHA_DB = process.env.PERSHA_DB;
		if (typeof PERSHA_DB !== "string" || PERSHA_DB === "") {
			PERSHA_DB = process.env.HOME + "/.persha";
		}
	}
	JOURNAL_FILEBASE = path.normalize(PERSHA_DB + "/journal");
	PERSHA_DB = path.dirname(JOURNAL_FILEBASE);
	if (PERSHA_DB[0] !== '/') {
		console.log("ERROR: PERSHA_DB must be absolute path: " + PERSHA_DB);
		process.exit(1);
	}
	//console.log("PERSHA_DB: " + PERSHA_DB);
	//console.log("JOURNAL_FILEBASE: " + JOURNAL_FILEBASE);

	PERSHA_HOME = path.dirname(path.dirname(process.argv[1]));
	INITSCRIPT_DIR = PERSHA_HOME + "/node-init/";
	HANDLER_DIR = PERSHA_HOME + "/handler/";
	//console.log("INITSCRIPT_DIR: " + INITSCRIPT_DIR);
	//console.log("HANDLER_DIR: " + HANDLER_DIR);

	if (cmd === '-initdb') {
		if (fs.existsSync(PERSHA_DB)) {
			console.log("ERROR: already exists: " + PERSHA_DB);
			process.exit(1);
		}
		try {
			fs.mkdirSync(PERSHA_DB);
		} catch (e) {
			console.log("ERROR: cannot create directory: " + PERSHA_DB);
			process.exit(1);
		}
		persha_initdb();
	}
	if (cmd === '-startup') {
		if (!fs.existsSync(PERSHA_DB)) {
			console.log("ERROR: does not exist: " + PERSHA_DB);
			process.exit(1);
		}
		if (!Journal_start()) {
			console.log("ERROR: invalid: " + PERSHA_DB);
			process.exit(1);
		}
		IOManager_start();
	}
})();

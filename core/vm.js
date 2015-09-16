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

var vm;

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
	F.Prototype = vm.Function_prototype;
	F.Extensible = true;
	defineCall(F, func);
	defineFinal(F, "length", length);
	define(obj, name, F);
	return F;
}

function defineAccessor(obj, name, get, set) {
	if (get !== undefined) {
		var Get = VMObject(CLASSID_BuiltinFunction);
		Get.Prototype = vm.Function_prototype;
		Get.Extensible = true;
		defineCall(Get, get);
		defineFinal(Get, "length", 0);
	}
	if (set !== undefined) {
		var Set = VMObject(CLASSID_BuiltinFunction);
		Set.Prototype = vm.Function_prototype;
		Set.Extensible = true;
		defineCall(Set, set);
		defineFinal(Set, "length", 1);
	}
	intrinsic_createAccessor(obj, name, PropertyDescriptor({
		Get : Get,
		Set : Set,
		Enumerable : false,
		Configurable : true
	}));
}

function defineCall(obj, func) {
	obj.vm = vm;
	obj._Call = func;
}

function defineConstruct(obj, func) {
	obj.vm = vm;
	obj._Construct = func;
}

function vm_wrapper_ClassCall(thisValue, argumentsList) {
	var callingVM = vm;
	vm = this.vm;
	assert(vm);
	if (vm === callingVM) {
		return this._Call(thisValue, argumentsList);
	}
	try {
		return this._Call(thisValue, argumentsList);
	} finally {
		vm = callingVM;
	}
}

function vm_wrapper_ClassConstruct(argumentsList) {
	var callingVM = vm;
	vm = this.vm;
	assert(vm);
	if (vm === callingVM) {
		return this._Construct(argumentsList);
	}
	try {
		return this._Construct(argumentsList);
	} finally {
		vm = callingVM;
	}
}

function initializeVM() {
	vm = VMObject(CLASSID_vm);
	vm.Prototype = null;
	vm.Extensible = true;

	vm.Object_prototype = VMObject(CLASSID_Object);
	vm.Object_prototype.Prototype = null;
	vm.Object_prototype.Extensible = true;

	vm.Function_prototype = VMObject(CLASSID_BuiltinFunction);
	vm.Function_prototype.Prototype = vm.Object_prototype;
	vm.Function_prototype.Extensible = true;
	defineCall(vm.Function_prototype, ReturnUndefined);

	vm.Array_prototype = VMObject(CLASSID_Array);
	vm.Array_prototype.Prototype = vm.Object_prototype;
	vm.Array_prototype.Extensible = true;

	vm.String_prototype = VMObject(CLASSID_String);
	vm.String_prototype.Prototype = vm.Object_prototype;
	vm.String_prototype.Extensible = true;
	vm.String_prototype.PrimitiveValue = "";

	vm.Boolean_prototype = VMObject(CLASSID_Boolean);
	vm.Boolean_prototype.Prototype = vm.Object_prototype;
	vm.Boolean_prototype.Extensible = true;
	vm.Boolean_prototype.PrimitiveValue = false;

	vm.Number_prototype = VMObject(CLASSID_Number);
	vm.Number_prototype.Prototype = vm.Object_prototype;
	vm.Number_prototype.Extensible = true;
	vm.Number_prototype.PrimitiveValue = 0;

	vm.Date_prototype = VMObject(CLASSID_Date);
	vm.Date_prototype.Prototype = vm.Object_prototype;
	vm.Date_prototype.Extensible = true;
	vm.Date_prototype.PrimitiveValue = NaN;

	vm.RegExp_prototype = VMObject(CLASSID_RegExp);
	vm.RegExp_prototype.Prototype = vm.Object_prototype;
	vm.RegExp_prototype.Extensible = true;

	vm.Error_prototype = VMObject(CLASSID_Error);
	vm.Error_prototype.Prototype = vm.Object_prototype;
	vm.Error_prototype.Extensible = true;

	vm.EvalError_prototype = VMObject(CLASSID_Error);
	vm.EvalError_prototype.Prototype = vm.Error_prototype;
	vm.EvalError_prototype.Extensible = true;

	vm.RangeError_prototype = VMObject(CLASSID_Error);
	vm.RangeError_prototype.Prototype = vm.Error_prototype;
	vm.RangeError_prototype.Extensible = true;

	vm.ReferenceError_prototype = VMObject(CLASSID_Error);
	vm.ReferenceError_prototype.Prototype = vm.Error_prototype;
	vm.ReferenceError_prototype.Extensible = true;

	vm.SyntaxError_prototype = VMObject(CLASSID_Error);
	vm.SyntaxError_prototype.Prototype = vm.Error_prototype;
	vm.SyntaxError_prototype.Extensible = true;

	vm.TypeError_prototype = VMObject(CLASSID_Error);
	vm.TypeError_prototype.Prototype = vm.Error_prototype;
	vm.TypeError_prototype.Extensible = true;

	vm.URIError_prototype = VMObject(CLASSID_Error);
	vm.URIError_prototype.Prototype = vm.Error_prototype;
	vm.URIError_prototype.Extensible = true;

	vm.Object = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Object, Object_Call);
	defineConstruct(vm.Object, Object_Construct);
	vm.Object.Prototype = vm.Function_prototype;
	vm.Object.Extensible = true;

	vm.Function = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Function, Function_Call);
	defineConstruct(vm.Function, Function_Construct);
	vm.Function.Prototype = vm.Function_prototype;
	vm.Function.Extensible = true;

	vm.Array = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Array, Array_Call);
	defineConstruct(vm.Array, Array_Construct);
	vm.Array.Prototype = vm.Function_prototype;
	vm.Array.Extensible = true;

	vm.String = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.String, String_Call);
	defineConstruct(vm.String, String_Construct);
	vm.String.Prototype = vm.Function_prototype;
	vm.String.Extensible = true;

	vm.Boolean = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Boolean, Boolean_Call);
	defineConstruct(vm.Boolean, Boolean_Construct);
	vm.Boolean.Prototype = vm.Function_prototype;
	vm.Boolean.Extensible = true;

	vm.Number = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Number, Number_Call);
	defineConstruct(vm.Number, Number_Construct);
	vm.Number.Prototype = vm.Function_prototype;
	vm.Number.Extensible = true;

	vm.Math = VMObject(CLASSID_Math);
	vm.Math.Prototype = vm.Object_prototype;
	vm.Math.Extensible = true;

	vm.Date = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Date, Date_Call);
	defineConstruct(vm.Date, Date_Construct);
	vm.Date.Prototype = vm.Function_prototype;
	vm.Date.Extensible = true;

	vm.RegExp = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.RegExp, RegExp_Call);
	defineConstruct(vm.RegExp, RegExp_Construct);
	vm.RegExp.Prototype = vm.Function_prototype;
	vm.RegExp.Extensible = true;

	vm.Error = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Error, Error_Call);
	defineConstruct(vm.Error, Error_Construct);
	vm.Error.Prototype = vm.Function_prototype;
	vm.Error.Extensible = true;

	vm.EvalError = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.EvalError, EvalError_Call);
	defineConstruct(vm.EvalError, EvalError_Construct);
	vm.EvalError.Prototype = vm.Function_prototype;
	vm.EvalError.Extensible = true;

	vm.RangeError = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.RangeError, RangeError_Call);
	defineConstruct(vm.RangeError, RangeError_Construct);
	vm.RangeError.Prototype = vm.Function_prototype;
	vm.RangeError.Extensible = true;

	vm.ReferenceError = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.ReferenceError, ReferenceError_Call);
	defineConstruct(vm.ReferenceError, ReferenceError_Construct);
	vm.ReferenceError.Prototype = vm.Function_prototype;
	vm.ReferenceError.Extensible = true;

	vm.SyntaxError = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.SyntaxError, SyntaxError_Call);
	defineConstruct(vm.SyntaxError, SyntaxError_Construct);
	vm.SyntaxError.Prototype = vm.Function_prototype;
	vm.SyntaxError.Extensible = true;

	vm.TypeError = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.TypeError, TypeError_Call);
	defineConstruct(vm.TypeError, TypeError_Construct);
	vm.TypeError.Prototype = vm.Function_prototype;
	vm.TypeError.Extensible = true;

	vm.URIError = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.URIError, URIError_Call);
	defineConstruct(vm.URIError, URIError_Construct);
	vm.URIError.Prototype = vm.Function_prototype;
	vm.URIError.Extensible = true;

	vm.JSON = VMObject(CLASSID_JSON);
	vm.JSON.Prototype = vm.Object_prototype;
	vm.JSON.Extensible = true;

	vm.theGlobalObject = VMObject(CLASSID_Global);
	vm.theGlobalObject.Prototype = vm.Object_prototype;
	vm.theGlobalObject.Extensible = true;

	defineFinal(vm, "global", vm.theGlobalObject);
	vm.theGlobalEnvironment = NewObjectEnvironment(vm.theGlobalObject, null);
	initializeThrowTypeErrorObject();

	defineFinal(vm.theGlobalObject, "NaN", NaN);
	defineFinal(vm.theGlobalObject, "Infinity", Infinity);
	defineFinal(vm.theGlobalObject, "undefined", undefined);
	vm.theEvalFunction = //
	defineFunction(vm.theGlobalObject, "eval", 1, Global_eval);
	defineFunction(vm.theGlobalObject, "parseInt", 2, Global_parseInt);
	defineFunction(vm.theGlobalObject, "parseFloat", 1, Global_parseFloat);
	defineFunction(vm.theGlobalObject, "isNaN", 1, Global_isNaN);
	defineFunction(vm.theGlobalObject, "isFinite", 1, Global_isFinite);
	defineFunction(vm.theGlobalObject, "decodeURI", 1, Global_decodeURI);
	defineFunction(vm.theGlobalObject, "decodeURIComponent", 1, Global_decodeURIComponent);
	defineFunction(vm.theGlobalObject, "encodeURI", 1, Global_encodeURI);
	defineFunction(vm.theGlobalObject, "encodeURIComponent", 1, Global_encodeURIComponent);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(vm.theGlobalObject, "escape", 1, Global_escape);
		defineFunction(vm.theGlobalObject, "unescape", 1, Global_unescape);
		defineFunction(vm.theGlobalObject, "evaluateProgram", 1, Global_evaluateProgram);
		defineFunction(vm.theGlobalObject, "parseProgram", 1, Global_parseProgram);
		defineFunction(vm.theGlobalObject, "setSystemProperty", 2, Global_setSystemProperty);
		defineFunction(vm.theGlobalObject, "getSystemProperty", 1, Global_getSystemProperty);
		defineFunction(vm.theGlobalObject, "createVM", 0, Global_createVM);
	}
	define(vm.theGlobalObject, "Object", vm.Object);
	define(vm.theGlobalObject, "Function", vm.Function);
	define(vm.theGlobalObject, "Array", vm.Array);
	define(vm.theGlobalObject, "String", vm.String);
	define(vm.theGlobalObject, "Boolean", vm.Boolean);
	define(vm.theGlobalObject, "Number", vm.Number);
	define(vm.theGlobalObject, "Math", vm.Math);
	define(vm.theGlobalObject, "Date", vm.Date);
	define(vm.theGlobalObject, "RegExp", vm.RegExp);
	define(vm.theGlobalObject, "Error", vm.Error);
	define(vm.theGlobalObject, "EvalError", vm.EvalError);
	define(vm.theGlobalObject, "RangeError", vm.RangeError);
	define(vm.theGlobalObject, "ReferenceError", vm.ReferenceError);
	define(vm.theGlobalObject, "SyntaxError", vm.SyntaxError);
	define(vm.theGlobalObject, "TypeError", vm.TypeError);
	define(vm.theGlobalObject, "URIError", vm.URIError);
	define(vm.theGlobalObject, "JSON", vm.JSON);

	defineFinal(vm.Object, "length", 1);
	defineFinal(vm.Object, "prototype", vm.Object_prototype);
	defineFunction(vm.Object, "getPrototypeOf", 1, Object_getPrototypeOf);
	defineFunction(vm.Object, "getOwnPropertyDescriptor", 2, Object_getOwnPropertyDescriptor);
	defineFunction(vm.Object, "getOwnPropertyNames", 1, Object_getOwnPropertyNames);
	defineFunction(vm.Object, "create", 2, Object_create);
	defineFunction(vm.Object, "defineProperty", 3, Object_defineProperty);
	defineFunction(vm.Object, "defineProperties", 2, Object_defineProperties);
	defineFunction(vm.Object, "seal", 1, Object_seal);
	defineFunction(vm.Object, "freeze", 1, Object_freeze);
	defineFunction(vm.Object, "preventExtensions", 1, Object_preventExtensions);
	defineFunction(vm.Object, "isSealed", 1, Object_isSealed);
	defineFunction(vm.Object, "isFrozen", 1, Object_isFrozen);
	defineFunction(vm.Object, "isExtensible", 1, Object_isExtensible);
	defineFunction(vm.Object, "keys", 1, Object_keys);
	define(vm.Object_prototype, "constructor", vm.Object);
	defineFunction(vm.Object_prototype, "toString", 0, Object_prototype_toString);
	defineFunction(vm.Object_prototype, "toLocaleString", 0, Object_prototype_toLocaleString);
	defineFunction(vm.Object_prototype, "valueOf", 0, Object_prototype_valueOf);
	defineFunction(vm.Object_prototype, "hasOwnProperty", 1, Object_prototype_hasOwnProperty);
	defineFunction(vm.Object_prototype, "isPrototypeOf", 1, Object_prototype_isPrototypeOf);
	defineFunction(vm.Object_prototype, "propertyIsEnumerable", 1, Object_prototype_propertyIsEnumerable);
	if (STRICT_CONFORMANCE === false) {
		defineAccessor(vm.Object_prototype, "__proto__", get_Object_prototype___proto__, set_Object_prototype___proto__);
		defineFunction(vm.Object_prototype, "mirrorTo", 1, Object_prototype_mirrorTo);
	}

	defineFinal(vm.Function, "length", 1);
	defineFinal(vm.Function, "prototype", vm.Function_prototype);
	defineFinal(vm.Function_prototype, "length", 0);
	define(vm.Function_prototype, "constructor", vm.Function);
	defineFunction(vm.Function_prototype, "toString", 0, Function_prototype_toString);
	defineFunction(vm.Function_prototype, "apply", 2, Function_prototype_apply);
	defineFunction(vm.Function_prototype, "call", 1, Function_prototype_call);
	defineFunction(vm.Function_prototype, "bind", 1, Function_prototype_bind);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(vm.Function_prototype, "scheduleAsMicrotask", 1, Function_prototype_scheduleAsMicrotask);
		defineAccessor(vm.Function_prototype, "name", get_Function_prototype_name, undefined);
	}

	defineFinal(vm.Array, "length", 1);
	defineFinal(vm.Array, "prototype", vm.Array_prototype);
	defineFunction(vm.Array, "isArray", 1, Array_isArray);
	defineWritable(vm.Array_prototype, "length", 0);
	define(vm.Array_prototype, "constructor", vm.Array);
	defineFunction(vm.Array_prototype, "toString", 0, Array_prototype_toString);
	defineFunction(vm.Array_prototype, "toLocaleString", 0, Array_prototype_toLocaleString);
	defineFunction(vm.Array_prototype, "concat", 1, Array_prototype_concat);
	defineFunction(vm.Array_prototype, "join", 1, Array_prototype_join);
	defineFunction(vm.Array_prototype, "pop", 0, Array_prototype_pop);
	defineFunction(vm.Array_prototype, "push", 1, Array_prototype_push);
	defineFunction(vm.Array_prototype, "reverse", 0, Array_prototype_reverse);
	defineFunction(vm.Array_prototype, "shift", 0, Array_prototype_shift);
	defineFunction(vm.Array_prototype, "slice", 2, Array_prototype_slice);
	defineFunction(vm.Array_prototype, "sort", 1, Array_prototype_sort);
	defineFunction(vm.Array_prototype, "splice", 2, Array_prototype_splice);
	defineFunction(vm.Array_prototype, "unshift", 1, Array_prototype_unshift);
	defineFunction(vm.Array_prototype, "indexOf", 1, Array_prototype_indexOf);
	defineFunction(vm.Array_prototype, "lastIndexOf", 1, Array_prototype_lastIndexOf);
	defineFunction(vm.Array_prototype, "every", 1, Array_prototype_every);
	defineFunction(vm.Array_prototype, "some", 1, Array_prototype_some);
	defineFunction(vm.Array_prototype, "forEach", 1, Array_prototype_forEach);
	defineFunction(vm.Array_prototype, "map", 1, Array_prototype_map);
	defineFunction(vm.Array_prototype, "filter", 1, Array_prototype_filter);
	defineFunction(vm.Array_prototype, "reduce", 1, Array_prototype_reduce);
	defineFunction(vm.Array_prototype, "reduceRight", 1, Array_prototype_reduceRight);

	defineFinal(vm.String, "length", 1);
	defineFinal(vm.String, "prototype", vm.String_prototype);
	defineFunction(vm.String, "fromCharCode", 1, String_fromCharCode);
	defineFinal(vm.String_prototype, "length", 0);
	define(vm.String_prototype, "constructor", vm.String);
	defineFunction(vm.String_prototype, "toString", 0, String_prototype_toString);
	defineFunction(vm.String_prototype, "valueOf", 0, String_prototype_valueOf);
	defineFunction(vm.String_prototype, "charAt", 1, String_prototype_charAt);
	defineFunction(vm.String_prototype, "charCodeAt", 1, String_prototype_charCodeAt);
	defineFunction(vm.String_prototype, "concat", 1, String_prototype_concat);
	defineFunction(vm.String_prototype, "indexOf", 1, String_prototype_indexOf);
	defineFunction(vm.String_prototype, "lastIndexOf", 1, String_prototype_lastIndexOf);
	defineFunction(vm.String_prototype, "localeCompare", 1, String_prototype_localeCompare);
	defineFunction(vm.String_prototype, "match", 1, String_prototype_match);
	defineFunction(vm.String_prototype, "replace", 2, String_prototype_replace);
	defineFunction(vm.String_prototype, "search", 1, String_prototype_search);
	defineFunction(vm.String_prototype, "slice", 2, String_prototype_slice);
	defineFunction(vm.String_prototype, "split", 2, String_prototype_split);
	defineFunction(vm.String_prototype, "substring", 2, String_prototype_substring);
	defineFunction(vm.String_prototype, "toLowerCase", 0, String_prototype_toLowerCase);
	defineFunction(vm.String_prototype, "toLocaleLowerCase", 0, String_prototype_toLocaleLowerCase);
	defineFunction(vm.String_prototype, "toUpperCase", 0, String_prototype_toUpperCase);
	defineFunction(vm.String_prototype, "toLocaleUpperCase", 0, String_prototype_toLocaleUpperCase);
	defineFunction(vm.String_prototype, "trim", 0, String_prototype_trim);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(vm.String_prototype, "substr", 2, String_prototype_substr);
	}

	defineFinal(vm.Boolean, "length", 1);
	defineFinal(vm.Boolean, "prototype", vm.Boolean_prototype);
	define(vm.Boolean_prototype, "constructor", vm.Boolean);
	defineFunction(vm.Boolean_prototype, "toString", 0, Boolean_prototype_toString);
	defineFunction(vm.Boolean_prototype, "valueOf", 0, Boolean_prototype_valueOf);

	defineFinal(vm.Number, "length", 1);
	defineFinal(vm.Number, "prototype", vm.Number_prototype);
	defineFinal(vm.Number, "MAX_VALUE", MAX_VALUE);
	defineFinal(vm.Number, "MIN_VALUE", MIN_VALUE);
	defineFinal(vm.Number, "NaN", NaN);
	defineFinal(vm.Number, "POSITIVE_INFINITY", Infinity);
	defineFinal(vm.Number, "NEGATIVE_INFINITY", -Infinity);
	define(vm.Number_prototype, "constructor", vm.Number);
	defineFunction(vm.Number_prototype, "toString", 0, Number_prototype_toString);
	defineFunction(vm.Number_prototype, "toLocaleString", 0, Number_prototype_toLocaleString);
	defineFunction(vm.Number_prototype, "valueOf", 0, Number_prototype_valueOf);
	defineFunction(vm.Number_prototype, "toFixed", 1, Number_prototype_toFixed);
	defineFunction(vm.Number_prototype, "toExponential", 1, Number_prototype_toExponential);
	defineFunction(vm.Number_prototype, "toPrecision", 1, Number_prototype_toPrecision);

	defineFinal(vm.Math, "E", Math.E);
	defineFinal(vm.Math, "LN10", Math.LN10);
	defineFinal(vm.Math, "LN2", Math.LN2);
	defineFinal(vm.Math, "LOG2E", Math.LOG2E);
	defineFinal(vm.Math, "LOG10E", Math.LOG10E);
	defineFinal(vm.Math, "PI", Math.PI);
	defineFinal(vm.Math, "SQRT1_2", Math.SQRT1_2);
	defineFinal(vm.Math, "SQRT2", Math.SQRT2);
	defineFunction(vm.Math, "abs", 1, Math_abs);
	defineFunction(vm.Math, "acos", 1, Math_acos);
	defineFunction(vm.Math, "asin", 1, Math_asin);
	defineFunction(vm.Math, "atan", 1, Math_atan);
	defineFunction(vm.Math, "atan2", 2, Math_atan2);
	defineFunction(vm.Math, "ceil", 1, Math_ceil);
	defineFunction(vm.Math, "cos", 1, Math_cos);
	defineFunction(vm.Math, "exp", 1, Math_exp);
	defineFunction(vm.Math, "floor", 1, Math_floor);
	defineFunction(vm.Math, "log", 1, Math_log);
	defineFunction(vm.Math, "max", 2, Math_max);
	defineFunction(vm.Math, "min", 2, Math_min);
	defineFunction(vm.Math, "pow", 2, Math_pow);
	defineFunction(vm.Math, "random", 0, Math_random);
	defineFunction(vm.Math, "round", 1, Math_round);
	defineFunction(vm.Math, "sin", 1, Math_sin);
	defineFunction(vm.Math, "sqrt", 1, Math_sqrt);
	defineFunction(vm.Math, "tan", 1, Math_tan);

	defineFinal(vm.Date, "length", 7);
	defineFinal(vm.Date, "prototype", vm.Date_prototype);
	defineFunction(vm.Date, "parse", 1, Date_parse);
	defineFunction(vm.Date, "UTC", 7, Date_UTC);
	defineFunction(vm.Date, "now", 0, Date_now);
	define(vm.Date_prototype, "constructor", vm.Date);
	defineFunction(vm.Date_prototype, "toString", 0, Date_prototype_toString);
	defineFunction(vm.Date_prototype, "toDateString", 0, Date_prototype_toDateString);
	defineFunction(vm.Date_prototype, "toTimeString", 0, Date_prototype_toTimeString);
	defineFunction(vm.Date_prototype, "toLocaleString", 0, Date_prototype_toLocaleString);
	defineFunction(vm.Date_prototype, "toLocaleDateString", 0, Date_prototype_toLocaleDateString);
	defineFunction(vm.Date_prototype, "toLocaleTimeString", 0, Date_prototype_toLocaleTimeString);
	defineFunction(vm.Date_prototype, "valueOf", 0, Date_prototype_valueOf);
	defineFunction(vm.Date_prototype, "getTime", 0, Date_prototype_getTime);
	defineFunction(vm.Date_prototype, "getFullYear", 0, Date_prototype_getFullYear);
	defineFunction(vm.Date_prototype, "getUTCFullYear", 0, Date_prototype_getUTCFullYear);
	defineFunction(vm.Date_prototype, "getMonth", 0, Date_prototype_getMonth);
	defineFunction(vm.Date_prototype, "getUTCMonth", 0, Date_prototype_getUTCMonth);
	defineFunction(vm.Date_prototype, "getDate", 0, Date_prototype_getDate);
	defineFunction(vm.Date_prototype, "getUTCDate", 0, Date_prototype_getUTCDate);
	defineFunction(vm.Date_prototype, "getDay", 0, Date_prototype_getDay);
	defineFunction(vm.Date_prototype, "getUTCDay", 0, Date_prototype_getUTCDay);
	defineFunction(vm.Date_prototype, "getHours", 0, Date_prototype_getHours);
	defineFunction(vm.Date_prototype, "getUTCHours", 0, Date_prototype_getUTCHours);
	defineFunction(vm.Date_prototype, "getMinutes", 0, Date_prototype_getMinutes);
	defineFunction(vm.Date_prototype, "getUTCMinutes", 0, Date_prototype_getUTCMinutes);
	defineFunction(vm.Date_prototype, "getSeconds", 0, Date_prototype_getSeconds);
	defineFunction(vm.Date_prototype, "getUTCSeconds", 0, Date_prototype_getUTCSeconds);
	defineFunction(vm.Date_prototype, "getMilliseconds", 0, Date_prototype_getMilliseconds);
	defineFunction(vm.Date_prototype, "getUTCMilliseconds", 0, Date_prototype_getUTCMilliseconds);
	defineFunction(vm.Date_prototype, "getTimezoneOffset", 0, Date_prototype_getTimezoneOffset);
	defineFunction(vm.Date_prototype, "setTime", 1, Date_prototype_setTime);
	defineFunction(vm.Date_prototype, "setMilliseconds", 1, Date_prototype_setMilliseconds);
	defineFunction(vm.Date_prototype, "setUTCMilliseconds", 1, Date_prototype_setUTCMilliseconds);
	defineFunction(vm.Date_prototype, "setSeconds", 2, Date_prototype_setSeconds);
	defineFunction(vm.Date_prototype, "setUTCSeconds", 2, Date_prototype_setUTCSeconds);
	defineFunction(vm.Date_prototype, "setMinutes", 3, Date_prototype_setMinutes);
	defineFunction(vm.Date_prototype, "setUTCMinutes", 3, Date_prototype_setUTCMinutes);
	defineFunction(vm.Date_prototype, "setHours", 4, Date_prototype_setHours);
	defineFunction(vm.Date_prototype, "setUTCHours", 4, Date_prototype_setUTCHours);
	defineFunction(vm.Date_prototype, "setDate", 1, Date_prototype_setDate);
	defineFunction(vm.Date_prototype, "setUTCDate", 1, Date_prototype_setUTCDate);
	defineFunction(vm.Date_prototype, "setMonth", 2, Date_prototype_setMonth);
	defineFunction(vm.Date_prototype, "setUTCMonth", 2, Date_prototype_setUTCMonth);
	defineFunction(vm.Date_prototype, "setFullYear", 3, Date_prototype_setFullYear);
	defineFunction(vm.Date_prototype, "setUTCFullYear", 3, Date_prototype_setUTCFullYear);
	defineFunction(vm.Date_prototype, "toUTCString", 0, Date_prototype_toUTCString);
	defineFunction(vm.Date_prototype, "toISOString", 0, Date_prototype_toISOString);
	defineFunction(vm.Date_prototype, "toJSON", 1, Date_prototype_toJSON);
	if (STRICT_CONFORMANCE === false) {
		defineFunction(vm.Date_prototype, "getYear", 0, Date_prototype_getYear);
		defineFunction(vm.Date_prototype, "setYear", 1, Date_prototype_setYear);
		defineFunction(vm.Date_prototype, "toGMTString", 0, Date_prototype_toUTCString);
	}

	defineFinal(vm.RegExp, "length", 2);
	defineFinal(vm.RegExp, "prototype", vm.RegExp_prototype);
	defineFinal(vm.RegExp_prototype, "source", "(?:)");
	defineFinal(vm.RegExp_prototype, "global", false);
	defineFinal(vm.RegExp_prototype, "ignoreCase", false);
	defineFinal(vm.RegExp_prototype, "multiline", false);
	defineWritable(vm.RegExp_prototype, "lastIndex", 0);
	theRegExpFactory.recompile(vm.RegExp_prototype);
	define(vm.RegExp_prototype, "constructor", vm.RegExp);
	defineFunction(vm.RegExp_prototype, "exec", 1, RegExp_prototype_exec);
	defineFunction(vm.RegExp_prototype, "test", 1, RegExp_prototype_test);
	defineFunction(vm.RegExp_prototype, "toString", 0, RegExp_prototype_toString);

	defineFinal(vm.Error, "length", 1);
	defineFinal(vm.Error, "prototype", vm.Error_prototype);
	define(vm.Error_prototype, "constructor", vm.Error);
	define(vm.Error_prototype, "name", "Error");
	define(vm.Error_prototype, "message", "");
	defineFunction(vm.Error_prototype, "toString", 0, Error_prototype_toString);
	if (STRICT_CONFORMANCE === false) {
		defineWritable(vm.Error, "stackTraceLimit", 10);
		defineAccessor(vm.Error_prototype, "stack", get_Error_prototype_stack, undefined);
		defineFunction(vm.Error_prototype, "getStackTraceEntry", 1, Error_prototype_getStackTraceEntry);
	}

	defineFinal(vm.EvalError, "length", 1);
	defineFinal(vm.EvalError, "prototype", vm.EvalError_prototype);
	define(vm.EvalError_prototype, "constructor", vm.EvalError);
	define(vm.EvalError_prototype, "name", "EvalError");
	define(vm.EvalError_prototype, "message", "");

	defineFinal(vm.RangeError, "length", 1);
	defineFinal(vm.RangeError, "prototype", vm.RangeError_prototype);
	define(vm.RangeError_prototype, "constructor", vm.RangeError);
	define(vm.RangeError_prototype, "name", "RangeError");
	define(vm.RangeError_prototype, "message", "");

	defineFinal(vm.ReferenceError, "length", 1);
	defineFinal(vm.ReferenceError, "prototype", vm.ReferenceError_prototype);
	define(vm.ReferenceError_prototype, "constructor", vm.ReferenceError);
	define(vm.ReferenceError_prototype, "name", "ReferenceError");
	define(vm.ReferenceError_prototype, "message", "");

	defineFinal(vm.SyntaxError, "length", 1);
	defineFinal(vm.SyntaxError, "prototype", vm.SyntaxError_prototype);
	define(vm.SyntaxError_prototype, "constructor", vm.SyntaxError);
	define(vm.SyntaxError_prototype, "name", "SyntaxError");
	define(vm.SyntaxError_prototype, "message", "");

	defineFinal(vm.TypeError, "length", 1);
	defineFinal(vm.TypeError, "prototype", vm.TypeError_prototype);
	define(vm.TypeError_prototype, "constructor", vm.TypeError);
	define(vm.TypeError_prototype, "name", "TypeError");
	define(vm.TypeError_prototype, "message", "");

	defineFinal(vm.URIError, "length", 1);
	defineFinal(vm.URIError, "prototype", vm.URIError_prototype);
	define(vm.URIError_prototype, "constructor", vm.URIError);
	define(vm.URIError_prototype, "name", "URIError");
	define(vm.URIError_prototype, "message", "");

	defineFunction(vm.JSON, "parse", 2, JSON_parse);
	defineFunction(vm.JSON, "stringify", 3, JSON_stringify);

	// ----------- Buffer ----------- 

	vm.Buffer_prototype = VMObject(CLASSID_Buffer);
	vm.Buffer_prototype.Prototype = vm.Object_prototype;
	vm.Buffer_prototype.Extensible = true;
	vm.Buffer_prototype.wrappedBuffer = new Buffer(0);

	vm.Buffer = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.Buffer, Buffer_Call);
	defineConstruct(vm.Buffer, Buffer_Construct);
	vm.Buffer.Prototype = vm.Function_prototype;
	vm.Buffer.Extensible = true;
	define(vm.theGlobalObject, "Buffer", vm.Buffer);

	defineFinal(vm.Buffer, "length", 2);
	defineFinal(vm.Buffer, "prototype", vm.Buffer_prototype);
	defineFunction(vm.Buffer, "isEncoding", 1, Buffer_isEncoding);
	defineFunction(vm.Buffer, "isBuffer", 1, Buffer_isBuffer);
	defineFunction(vm.Buffer, "byteLength", 1, Buffer_byteLength);
	defineFunction(vm.Buffer, "concat", 2, Buffer_concat);
	defineFunction(vm.Buffer, "compare", 2, Buffer_compare);
	defineFinal(vm.Buffer_prototype, "length", 0);
	define(vm.Buffer_prototype, "constructor", vm.Buffer);
	defineFunction(vm.Buffer_prototype, "write", 4, Buffer_prototype_write);
	defineFunction(vm.Buffer_prototype, "writeUIntLE", 4, Buffer_prototype_writeUIntLE);
	defineFunction(vm.Buffer_prototype, "writeUIntBE", 4, Buffer_prototype_writeUIntBE);
	defineFunction(vm.Buffer_prototype, "writeIntLE", 4, Buffer_prototype_writeIntLE);
	defineFunction(vm.Buffer_prototype, "writeIntBE", 4, Buffer_prototype_writeIntBE);
	defineFunction(vm.Buffer_prototype, "readUIntLE", 3, Buffer_prototype_readUIntLE);
	defineFunction(vm.Buffer_prototype, "readUIntBE", 3, Buffer_prototype_readUIntBE);
	defineFunction(vm.Buffer_prototype, "readIntLE", 3, Buffer_prototype_readIntLE);
	defineFunction(vm.Buffer_prototype, "readIntBE", 3, Buffer_prototype_readIntBE);
	defineFunction(vm.Buffer_prototype, "toString", 3, Buffer_prototype_toString);
	defineFunction(vm.Buffer_prototype, "toJSON", 0, Buffer_prototype_toJSON);
	defineFunction(vm.Buffer_prototype, "equals", 1, Buffer_prototype_equals);
	defineFunction(vm.Buffer_prototype, "compare", 1, Buffer_prototype_compare);
	defineFunction(vm.Buffer_prototype, "copy", 0, Buffer_prototype_copy);
	defineFunction(vm.Buffer_prototype, "slice", 2, Buffer_prototype_slice);
	defineFunction(vm.Buffer_prototype, "readUInt8", 2, Buffer_prototype_readUInt8);
	defineFunction(vm.Buffer_prototype, "readUInt16LE", 2, Buffer_prototype_readUInt16LE);
	defineFunction(vm.Buffer_prototype, "readUInt16BE", 2, Buffer_prototype_readUInt16BE);
	defineFunction(vm.Buffer_prototype, "readUInt32LE", 2, Buffer_prototype_readUInt32LE);
	defineFunction(vm.Buffer_prototype, "readUInt32BE", 2, Buffer_prototype_readUInt32BE);
	defineFunction(vm.Buffer_prototype, "readInt8", 2, Buffer_prototype_readInt8);
	defineFunction(vm.Buffer_prototype, "readInt16LE", 2, Buffer_prototype_readInt16LE);
	defineFunction(vm.Buffer_prototype, "readInt16BE", 2, Buffer_prototype_readInt16BE);
	defineFunction(vm.Buffer_prototype, "readInt32LE", 2, Buffer_prototype_readInt32LE);
	defineFunction(vm.Buffer_prototype, "readInt32BE", 2, Buffer_prototype_readInt32BE);
	defineFunction(vm.Buffer_prototype, "readFloatLE", 2, Buffer_prototype_readFloatLE);
	defineFunction(vm.Buffer_prototype, "readFloatBE", 2, Buffer_prototype_readFloatBE);
	defineFunction(vm.Buffer_prototype, "readDoubleLE", 2, Buffer_prototype_readDoubleLE);
	defineFunction(vm.Buffer_prototype, "readDoubleBE", 2, Buffer_prototype_readDoubleBE);
	defineFunction(vm.Buffer_prototype, "writeUInt8", 3, Buffer_prototype_writeUInt8);
	defineFunction(vm.Buffer_prototype, "writeUInt16LE", 3, Buffer_prototype_writeUInt16LE);
	defineFunction(vm.Buffer_prototype, "writeUInt16BE", 3, Buffer_prototype_writeUInt16BE);
	defineFunction(vm.Buffer_prototype, "writeUInt32LE", 3, Buffer_prototype_writeUInt32LE);
	defineFunction(vm.Buffer_prototype, "writeUInt32BE", 3, Buffer_prototype_writeUInt32BE);
	defineFunction(vm.Buffer_prototype, "writeInt8", 3, Buffer_prototype_writeInt8);
	defineFunction(vm.Buffer_prototype, "writeInt16LE", 3, Buffer_prototype_writeInt16LE);
	defineFunction(vm.Buffer_prototype, "writeInt16BE", 3, Buffer_prototype_writeInt16BE);
	defineFunction(vm.Buffer_prototype, "writeInt32LE", 3, Buffer_prototype_writeInt32LE);
	defineFunction(vm.Buffer_prototype, "writeInt32BE", 3, Buffer_prototype_writeInt32BE);
	defineFunction(vm.Buffer_prototype, "writeFloatLE", 3, Buffer_prototype_writeFloatLE);
	defineFunction(vm.Buffer_prototype, "writeFloatBE", 3, Buffer_prototype_writeFloatBE);
	defineFunction(vm.Buffer_prototype, "writeDoubleLE", 3, Buffer_prototype_writeDoubleLE);
	defineFunction(vm.Buffer_prototype, "writeDoubleBE", 3, Buffer_prototype_writeDoubleBE);
	defineFunction(vm.Buffer_prototype, "fill", 3, Buffer_prototype_fill);
	defineFunction(vm.Buffer_prototype, "inspect", 0, Buffer_prototype_inspect);

	// ----------- IOPort ----------- 

	vm.IOPort_prototype = VMObject(CLASSID_IOPort);
	vm.IOPort_prototype.Prototype = vm.Object_prototype;
	vm.IOPort_prototype.Extensible = true;
	vm.IOPort_prototype.handler = null;

	vm.IOPortError_prototype = VMObject(CLASSID_Error);
	vm.IOPortError_prototype.Prototype = vm.Error_prototype;
	vm.IOPortError_prototype.Extensible = true;

	vm.IOPort = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.IOPort, IOPort_Call);
	defineConstruct(vm.IOPort, IOPort_Construct);
	vm.IOPort.Prototype = vm.Function_prototype;
	vm.IOPort.Extensible = true;
	define(vm.theGlobalObject, "IOPort", vm.IOPort);

	vm.IOPortError = VMObject(CLASSID_BuiltinFunction);
	defineCall(vm.IOPortError, IOPortError_Call);
	defineConstruct(vm.IOPortError, IOPortError_Construct);
	vm.IOPortError.Prototype = vm.Function_prototype;
	vm.IOPortError.Extensible = true;
	define(vm.theGlobalObject, "IOPortError", vm.IOPortError);

	defineFinal(vm.IOPort, "length", 1);
	defineFinal(vm.IOPort, "prototype", vm.IOPort_prototype);
	define(vm.IOPort_prototype, "constructor", vm.IOPort);
	defineFunction(vm.IOPort_prototype, "open", 2, IOPort_prototype_open);
	defineFunction(vm.IOPort_prototype, "close", 0, IOPort_prototype_close);
	defineFunction(vm.IOPort_prototype, "syncIO", 3, IOPort_prototype_syncIO);
	defineFunction(vm.IOPort_prototype, "asyncIO", 3, IOPort_prototype_asyncIO);

	defineFinal(vm.IOPortError, "length", 1);
	defineFinal(vm.IOPortError, "prototype", vm.IOPortError_prototype);
	define(vm.IOPortError_prototype, "constructor", vm.IOPortError);
	define(vm.IOPortError_prototype, "name", "IOPortError");
	define(vm.IOPortError_prototype, "message", "");

	assert(checkVM());
	return vm;
}

function checkVM() {
	return vm.Class === "vm" //
			&& vm.Object_prototype.Class === "Object" //
			&& vm.Function_prototype.Class === "Function" //
			&& vm.Array_prototype.Class === "Array" //
			&& vm.String_prototype.Class === "String" //
			&& vm.Boolean_prototype.Class === "Boolean" //
			&& vm.Number_prototype.Class === "Number" //
			&& vm.Date_prototype.Class === "Date" //
			&& vm.RegExp_prototype.Class === "RegExp" //
			&& vm.Error_prototype.Class === "Error" //
			&& vm.EvalError_prototype.Class === "Error" //
			&& vm.RangeError_prototype.Class === "Error" //
			&& vm.ReferenceError_prototype.Class === "Error" //
			&& vm.SyntaxError_prototype.Class === "Error" //
			&& vm.TypeError_prototype.Class === "Error" //
			&& vm.URIError_prototype.Class === "Error" //
			&& vm.Object.Class === "Function" //
			&& vm.Function.Class === "Function" //
			&& vm.Array.Class === "Function" //
			&& vm.String.Class === "Function" //
			&& vm.Boolean.Class === "Function" //
			&& vm.Number.Class === "Function" //
			&& vm.Math.Class === "Math" //
			&& vm.Date.Class === "Function" //
			&& vm.RegExp.Class === "Function" //
			&& vm.Error.Class === "Function" //
			&& vm.EvalError.Class === "Function" //
			&& vm.RangeError.Class === "Function" //
			&& vm.ReferenceError.Class === "Function" //
			&& vm.SyntaxError.Class === "Function" //
			&& vm.TypeError.Class === "Function" //
			&& vm.URIError.Class === "Function" //
			&& vm.JSON.Class === "JSON" //
			&& vm.theGlobalObject.Class === "Global" //
			&& vm.theGlobalEnvironment.ClassID === CLASSID_ObjectEnvironment //
			&& vm.theEvalFunction.Class === "Function" //
			&& vm.theThrowTypeError.Class === "Function" //
			&& vm.Buffer_prototype.Class === "Buffer" //
			&& vm.Buffer.Class === "Function" //
			&& vm.IOPort_prototype.Class === "IOPort" //
			&& vm.IOPortError_prototype.Class === "Error" //
			&& vm.IOPort.Class === "Function" //
			&& vm.IOPortError.Class === "Function" //
	;
}

var vmTemplate = {
	Object_prototype : undefined,
	Function_prototype : undefined,
	Array_prototype : undefined,
	String_prototype : undefined,
	Boolean_prototype : undefined,
	Number_prototype : undefined,
	Date_prototype : undefined,
	RegExp_prototype : undefined,
	Error_prototype : undefined,
	EvalError_prototype : undefined,
	RangeError_prototype : undefined,
	ReferenceError_prototype : undefined,
	SyntaxError_prototype : undefined,
	TypeError_prototype : undefined,
	URIError_prototype : undefined,
	Object : undefined,
	Function : undefined,
	Array : undefined,
	String : undefined,
	Boolean : undefined,
	Number : undefined,
	Math : undefined,
	Date : undefined,
	RegExp : undefined,
	Error : undefined,
	EvalError : undefined,
	RangeError : undefined,
	ReferenceError : undefined,
	SyntaxError : undefined,
	TypeError : undefined,
	URIError : undefined,
	JSON : undefined,
	theGlobalObject : undefined,
	theGlobalEnvironment : undefined,
	theEvalFunction : undefined,
	theThrowTypeError : undefined,
	Buffer_prototype : undefined,
	Buffer : undefined,
	IOPort_prototype : undefined,
	IOPortError_prototype : undefined,
	IOPort : undefined,
	IOPortError : undefined,
};

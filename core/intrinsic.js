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

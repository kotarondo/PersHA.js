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
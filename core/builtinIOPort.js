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
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort") throw VMTypeError();
	var args = IOPort_unwrapArgs(argumentsList, 0, 0);
	var root = thisValue;
	var port = VMObject(CLASSID_IOPort);
	port.Prototype = builtin_IOPort_prototype;
	port.Extensible = true;
	IOManager_openPort(port, root, args);
	return port;
}

function IOPort_prototype_syncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort") throw VMTypeError();
	var port = thisValue;
	var name = ToString(argumentsList[0]);
	var args = IOPort_unwrapArgs(argumentsList, 1, 0);
	var event = IOManager_syncIO(port, name, args);
	if (event.error !== true) {
		return IOPort_wrap(event.value);
	}
	if (event.failure) {
		throw IOPortError_Construct([ event.failure ]);
	}
	throw IOPort_wrap(event.value);
}

function IOPort_prototype_asyncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort") throw VMTypeError();
	var name = ToString(argumentsList[0]);
	var args = IOPort_unwrapArgs(argumentsList, 1, 1);
	var callback = argumentsList[argumentsList.length - 1];
	if (IsCallable(callback) === false) throw VMTypeError();
	var port = thisValue;
	return IOManager_asyncIO(port, name, args, callback);
}

function IOPort_asyncIO_completion(event, callback) {
	if (event.failure) {
		scheduleMicrotask(callback, [ IOPortError_Construct([ event.failure ]) ]);
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
	if (A.Class === "Buffer") {
		return A.wrappedBuffer;
	}
	if (A.Class === "Date") {
		return new Date(A.PrimitiveValue);
	}
	if (A.Class === "Error") {
		return new Error(A.Get("message"));
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
	if (a instanceof Buffer) {
		var A = VMObject(CLASSID_Buffer);
		A.Prototype = builtin_Buffer_prototype;
		A.Extensible = true;
		A.wrappedBuffer = a;
		defineFinal(A, "length", a.length);
		defineFinal(A, "parent", A);
		return A;
	}
	if (a instanceof Date) {
		return Date_Construct([ a.getTime() ]);
	}
	if (a instanceof Date) {
		return Error_Construct([ a.message ]);
	}
	if (stack === undefined) stack = [];
	if (isIncluded(a, stack)) return null;
	stack.push(a);
	if (a instanceof Array) {
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

function IOPortError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_IOPortError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

function IOPortError_Construct(argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = builtin_IOPortError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, "message", ToString(message));
	}
	return obj;
}

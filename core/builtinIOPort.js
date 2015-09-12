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
	defineFinal(port, 'root', null);
	defineFinal(port, 'name', name);
	return port;
}

function IOPort_prototype_open(thisValue, argumentsList) {
	var root = thisValue;
	if (Type(root) !== TYPE_Object || root.Class !== 'IOPort') throw VMTypeError();
	var name = ToString(argumentsList[0]);
	if (argumentsList.length >= 2) {
		var callback = argumentsList[1];
		if (IsCallable(callback) === false) throw VMTypeError();
	}
	var root = thisValue;
	var port = VMObject(CLASSID_IOPort);
	port.Prototype = builtin_IOPort_prototype;
	port.Extensible = true;
	defineFinal(port, 'root', root);
	defineFinal(port, 'name', name);
	if (callback) {
		task_pause();
		IOManager_openPort(port, callback);
		task_resume();
		callback.Call(undefined, [ IOPortError_Construct([ 'restart' ]), port ]);
	}
	return port;
}

function IOPort_prototype_close(thisValue, argumentsList) {
	var port = thisValue;
	if (Type(port) !== TYPE_Object || port.Class !== 'IOPort') throw VMTypeError();
	task_pause();
	IOManager_closePort(port);
	task_resume();
}

function IOPort_prototype_asyncIO(thisValue, argumentsList) {
	var port = thisValue;
	if (Type(port) !== TYPE_Object || port.Class !== 'IOPort') throw VMTypeError();
	var func = ToString(argumentsList[0]);
	var args = IOPort_unwrapArgs(argumentsList[1]);
	if (argumentsList.length >= 3) {
		var callback = argumentsList[2];
		if (IsCallable(callback) === false) throw VMTypeError();
	}
	task_pause();
	IOManager_asyncIO(port, func, args, callback);
	task_resume();
}

function IOPort_prototype_syncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== 'IOPort') throw VMTypeError();
	var port = thisValue;
	var func = ToString(argumentsList[0]);
	var args = IOPort_unwrapArgs(argumentsList[1]);
	var noRetry = ToBoolean(argumentsList[2]);
	if (IsCallable(argumentsList[2])) {
		var callback = argumentsList[2];
	}
	do {
		task_pause();
		var entry = IOManager_syncIO(port, func, args, callback);
		task_resume();
	} while (!noRetry && entry.error === 'restart');
	if (entry.success) {
		return IOPort_wrap(entry.value);
	}
	if (entry.error) {
		assert(isPrimitiveValue(entry.error));
		throw IOPortError_Construct([ entry.error ]);
	}
	throw IOPort_wrap(entry.exception);
}

function IOPort_portEvent(entry, callback, port) {
	if (entry.error) {
		assert(isPrimitiveValue(entry.error));
		callback.Call(undefined, [ IOPortError_Construct([ entry.error ]), port ]);
	}
	else {
		callback.Call(undefined, IOPort_wrapArgs(entry.value));
	}
}

function IOPort_completionEvent(entry, callback) {
	if (entry.error) {
		assert(isPrimitiveValue(entry.error));
		callback.Call(undefined, [ IOPortError_Construct([ entry.error ]) ]);
	}
	else {
		callback.Call(undefined, IOPort_wrapArgs(entry.value));
	}
}

function IOPort_callbackUncaughtError(e) {
	if (isInternalError(e)) throw e;
	try {
		var callback = theGlobalObject.Get('_uncaughtErrorCallback');
		if (IsCallable(callback)) {
			callback.Call(undefined, [ e ]);
			return;
		}
	} catch (ee) {
		if (isInternalError(ee)) throw ee;
		e = ee;
	}
	try {
		if (Type(e) === TYPE_Object && e.Class === "Error") {
			return ToString(e.Get('stack'));
		}
		return ToString(e);
	} catch (ee) {
		if (isInternalError(ee)) throw ee;
		return "non-printable error";
	}
}

function IOPort_longname(port) {
	var root = port.Get('root');
	var name = port.Get('name');
	if (!root) {
		return name;
	}
	return IOPort_longname(root) + "." + name;
}

function IOPort_unwrapArgs(A) {
	var a = IOPort_unwrap(A);
	if (a instanceof Array) {
		return a;
	}
	return [ a ];
}

function IOPort_unwrap(A, stack) {
	if (isPrimitiveValue(A)) {
		return A;
	}
	if (A.Class === 'Buffer') {
		return new Buffer(A.wrappedBuffer); // safeguard
	}
	if (A.Class === 'Date') {
		return new Date(A.PrimitiveValue);
	}
	if (A.Class === 'Function') {
		return undefined;
	}
	if (stack === undefined) stack = [];
	if (isIncluded(A, stack)) return null;
	stack.push(A);
	if (A.Class === 'Array' || A.Class === 'Arguments') {
		var a = [];
	}
	else if (A.Class === 'Error') {
		var a = new Error();
	}
	else {
		var a = {};
	}
	var next = A.enumerator(false, true);
	var P;
	while ((P = next()) !== undefined) {
		if (P === 'caller' || P === 'callee' || P === 'arguments') {
			continue;
		}
		a[P] = IOPort_unwrap(A.Get(P), stack);
	}
	stack.pop();
	return a;
}

function IOPort_wrapArgs(a) {
	var length = a.length;
	var A = [];
	for (var i = 0; i < length; i++) {
		A[i] = IOPort_wrap(a[i]);
	}
	return A;
}

function IOPort_wrap(a, stack) {
	// must be compatible with FileOutputStream.readAny/writeAny
	// i.e. IOPort_wrap == IOPort_wrap ○ readAny ○ writeAny
	if (isPrimitiveValue(a)) {
		return a;
	}
	if (a instanceof Function) {
		return undefined;
	}
	if (a instanceof Buffer) {
		var A = VMObject(CLASSID_Buffer);
		A.Prototype = builtin_Buffer_prototype;
		A.Extensible = true;
		A.wrappedBuffer = new Buffer(a); // safeguard
		defineFinal(A, 'length', a.length);
		defineFinal(A, 'parent', A);
		return A;
	}
	if (a instanceof Date) {
		return Date_Construct([ a.getTime() ]);
	}
	if (stack === undefined) stack = [];
	if (isIncluded(a, stack)) {
		return null;
	}
	stack.push(a);
	if (a instanceof Error) {
		if (a instanceof TypeError) {
			var A = TypeError_Construct([]);
		}
		else if (a instanceof ReferenceError) {
			var A = ReferenceError_Construct([]);
		}
		else if (a instanceof RangeError) {
			var A = RangeError_Construct([]);
		}
		else {
			var A = Error_Construct([]);
		}
	}
	else if (a instanceof Array) {
		var A = Array_Construct([]);
	}
	else {
		var A = Object_Construct([]);
	}
	var keys = Object.getOwnPropertyNames(a);
	var length = keys.length;
	for (var i = 0; i < length; i++) {
		var P = keys[i];
		if (P === 'caller' || P === 'callee' || P === 'arguments') {
			continue;
		}
		A.Put(P, IOPort_wrap(a[P], stack), false);
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
		define(obj, 'message', ToString(message));
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
		define(obj, 'message', ToString(message));
	}
	return obj;
}

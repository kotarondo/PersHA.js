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
	port.Prototype = vm.IOPort_prototype;
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
	port.Prototype = vm.IOPort_prototype;
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
	if (IsCallable(argumentsList[2])) {
		var callback = argumentsList[2];
		var noRestartRetry = ToBoolean(argumentsList[3]);
	}
	else {
		var noRestartRetry = ToBoolean(argumentsList[2]);
	}
	taskPendingError = undefined;
	do {
		task_pause();
		var entry = IOManager_syncIO(port, func, args, callback);
		task_resume();
	} while (!noRestartRetry && entry.error === 'restart');
	if (entry.success) {
		return IOPort_wrap(entry.value);
	}
	if (taskPendingError) {
		throw taskPendingError;
	}
	if (entry.error) {
		assert(isPrimitiveValue(entry.error));
		throw IOPortError_Construct([ entry.error ]);
	}
	throw IOPort_wrap(entry.exception);
}

function IOPort_portEvent(entry, callback, port) {
	var callingVM = vm;
	vm = callback.vm;
	assert(vm);
	try {
		if (entry.error) {
			assert(isPrimitiveValue(entry.error));
			callback._Call(undefined, [ IOPortError_Construct([ entry.error ]), port ]);
		}
		else {
			callback._Call(undefined, IOPort_wrapArgs(entry.value));
		}
	} catch (e) {
		if (taskDepth >= 2) {
			if (isInternalError(e)) throw e;
			taskPendingError = e;
			return IOPort_unwrap(e);
		}
		else {
			task_callbackUncaughtError(e);
		}
	} finally {
		vm = callingVM;
	}
}

function IOPort_completionEvent(entry, callback) {
	var callingVM = vm;
	vm = callback.vm;
	assert(vm);
	try {
		if (entry.error) {
			assert(isPrimitiveValue(entry.error));
			callback._Call(undefined, [ IOPortError_Construct([ entry.error ]) ]);
		}
		else {
			callback._Call(undefined, IOPort_wrapArgs(entry.value));
		}
	} catch (e) {
		task_callbackUncaughtError(e);
	} finally {
		vm = callingVM;
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
		a.length = A.Get("length");
	}
	else if (A.Class === 'Error') {
		try {
			var name = ToString(A.Get("name"));
			var message = ToString(A.Get("message"));
		} catch (e) {
			//TODO
		}
		switch (name) {
		case "TypeError":
			var a = new TypeError(message);
			break;
		case "ReferenceError":
			var a = new ReferenceError(message);
			break;
		case "RangeError":
			var a = new RangeError(message);
			break;
		case "SyntaxError":
			var a = new SyntaxError(message);
			break;
		default:
			var a = new Error(message);
			break;
		}
	}
	else {
		var a = {};
	}
	var next = A.enumerator(true, true);
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

function IOPort_prewrapArgs(a) {
	var length = a.length;
	var A = [];
	for (var i = 0; i < length; i++) {
		A[i] = IOPort_prewrap(a[i]);
	}
	return A;
}

function IOPort_prewrap(a, stack) {
	if (isPrimitiveValue(a)) {
		return a;
	}
	if (a instanceof Function) {
		return undefined;
	}
	if (a instanceof Buffer) {
		return new Buffer(a); // safeguard
	}
	if (a instanceof Date) {
		return new Date(a.getTime());
	}
	if (stack === undefined) stack = [];
	if (isIncluded(a, stack)) {
		return null;
	}
	stack.push(a);
	if (a instanceof Error) {
		var message = String(a.message);
		if (a instanceof TypeError) {
			var A = new TypeError(message);
		}
		else if (a instanceof ReferenceError) {
			var A = new ReferenceError(message);
		}
		else if (a instanceof RangeError) {
			var A = new RangeError(message);
		}
		else if (a instanceof SyntaxError) {
			var A = new SyntaxError(message);
		}
		else {
			var A = new Error(message);
		}
	}
	else if (a instanceof Array) {
		var A = new Array(a.length);
	}
	else {
		var A = {};
	}
	var keys = Object.getOwnPropertyNames(a);
	var length = keys.length;
	for (var i = 0; i < length; i++) {
		var P = keys[i];
		if (a.propertyIsEnumerable(P) === false) {
			continue;
		}
		if (P === 'caller' || P === 'callee' || P === 'arguments') {
			continue;
		}
		A[P] = IOPort_prewrap(a[P], stack);
	}
	stack.pop();
	return A;
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
	//      on IOPort_prewrap image
	if (isPrimitiveValue(a)) {
		return a;
	}
	if (a instanceof Function) {
		return undefined;
	}
	if (a instanceof Buffer) {
		var A = VMObject(CLASSID_Buffer);
		A.Prototype = vm.Buffer_prototype;
		A.Extensible = true;
		A.wrappedBuffer = a;
		defineFinal(A, 'length', a.length);
		defineFinal(A, 'parent', A);
		return A;
	}
	if (a instanceof Date) {
		return Date_Construct([ a.getTime() ]);
	}
	if (a instanceof Error) {
		var message = String(a.message);
		if (a instanceof TypeError) {
			var A = TypeError_Construct([ message ]);
		}
		else if (a instanceof ReferenceError) {
			var A = ReferenceError_Construct([ message ]);
		}
		else if (a instanceof RangeError) {
			var A = RangeError_Construct([ message ]);
		}
		else if (a instanceof SyntaxError) {
			var A = SyntaxError_Construct([ message ]);
		}
		else {
			var A = Error_Construct([ message ]);
		}
	}
	else if (a instanceof Array) {
		var A = Array_Construct([ a.length ]);
	}
	else {
		var A = Object_Construct([]);
	}
	for ( var P in a) {
		A.Put(P, IOPort_wrap(a[P]), false);
	}
	return A;
}

function IOPortError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = vm.IOPortError_prototype;
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
	obj.Prototype = vm.IOPortError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, 'message', ToString(message));
	}
	return obj;
}

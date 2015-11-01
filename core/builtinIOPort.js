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
	port.Prototype = vm0.IOPort_prototype;
	port.Extensible = true;
	defineFinal(port, 'root', null);
	defineFinal(port, 'name', name);
	return port;
}

var IOP_uniqueID = 0;
var IOP_asyncCallbacks = {};
var IOP_openPorts = {};

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
	port.Prototype = vm0.IOPort_prototype;
	port.Extensible = true;
	defineFinal(port, 'root', root);
	defineFinal(port, 'name', name);
	if (callback) {
		var txid = ++IOP_uniqueID;
		IOP_openPorts[txid] = port;
		port.txid = txid;
		port.callback = callback;
		callback.Call(undefined, [ IOPortError_Construct([ 'restart' ]), port ]);
	}
	IOM_bindPort(port);
	return port;
}

function IOPort_prototype_close(thisValue, argumentsList) {
	var port = thisValue;
	if (Type(port) !== TYPE_Object || port.Class !== 'IOPort') throw VMTypeError();
	var txid = port.txid;
	if (txid) {
		assert(IOP_openPorts[txid] === port);
		delete IOP_openPorts[txid];
		port.txid = undefined;
		port.callback = undefined;
	}
}

function IOPort_prototype_asyncIO(thisValue, argumentsList) {
	var port = thisValue;
	if (Type(port) !== TYPE_Object || port.Class !== 'IOPort') throw VMTypeError();
	var func = ToString(argumentsList[0]);
	var args = IOP_unwrapArgs(argumentsList[1]);
	if (argumentsList.length >= 3) {
		var callback = argumentsList[2];
		if (IsCallable(callback) === false) throw VMTypeError();
	}
	if (callback) {
		var txid = ++IOP_uniqueID;
		IOP_asyncCallbacks[txid] = callback;
	}
	IOM_asyncIO(port, func, args, txid);
}

function IOPort_prototype_syncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== 'IOPort') throw VMTypeError();
	var port = thisValue;
	var func = ToString(argumentsList[0]);
	var args = IOP_unwrapArgs(argumentsList[1]);
	if (IsCallable(argumentsList[2])) {
		var callback = argumentsList[2];
		var noRestartRetry = ToBoolean(argumentsList[3]);
	}
	else {
		var noRestartRetry = ToBoolean(argumentsList[2]);
	}
	do {
		if (callback) {
			var txid = ++IOP_uniqueID;
		}
		var ret = IOM_syncIO(port, func, args, txid);
		if (callback && ret.type === 'return') {
			IOP_asyncCallbacks[txid] = callback;
		}
	} while (!noRestartRetry && ret.type === 'error' && ret.value === 'restart');
	if (ret.type === 'return') {
		return ret.value;
	}
	if (ret.type === 'throw') {
		throw ret.value;
	}
	assert(ret.type === 'error');
	throw IOPortError_Construct([ ret.value ]);
}

function IOP_completionEvent(txid, args) {
	assert(args instanceof Array, args);
	var callback = IOP_asyncCallbacks[txid];
	if (callback === undefined) {
		return;
	}
	delete IOP_asyncCallbacks[txid];
	callback.Call(undefined, args);
}

function IOP_portEvent(txid, args) {
	assert(args instanceof Array, args);
	var port = IOP_openPorts[txid];
	if (port === undefined) {
		return;
	}
	var callback = port.callback;
	callback.Call(undefined, args);
}

function IOP_restartPorts() {
	for ( var txid in IOP_openPorts) {
		var port = IOP_openPorts[txid];
		try {
			IOP_portEvent(txid, [ IOPortError_Construct([ 'restart' ]), port ]);
		} catch (e) {
		}
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

function IOPortError_Call(thisValue, argumentsList) {
	var message = argumentsList[0];
	var obj = VMObject(CLASSID_Error);
	obj.Prototype = vm0.IOPortError_prototype;
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
	obj.Prototype = vm0.IOPortError_prototype;
	obj.Extensible = true;
	obj.stackTrace = getStackTrace();
	if (message !== undefined) {
		define(obj, 'message', ToString(message));
	}
	return obj;
}

function IOP_unwrapArgs(A) {
	var a = IOP_unwrap(A);
	if (a instanceof Array) {
		return a;
	}
	return [ a ];
}

function IOP_unwrap(A, stack) {
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
		a[P] = IOP_unwrap(A.Get(P), stack);
	}
	stack.pop();
	return a;
}

function IOP_wrapArgs(a) {
	var length = a.length;
	var A = [];
	for (var i = 0; i < length; i++) {
		A[i] = IOP_wrap(a[i]);
	}
	return A;
}

function IOP_wrap(a) {
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
		A.Put(P, IOP_wrap(a[P]), false);
	}
	return A;
}

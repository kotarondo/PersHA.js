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
	var args = IO_unwrapArgs(argumentsList, 1, 0);
	var port = VMObject(CLASSID_IOPort);
	port.Prototype = builtin_IOPort_prototype;
	port.Extensible = true;
	port.name = name;
	port.args = args;
	IO_register(port);
	port.handler = IOManager_bind(name, args, port);
	return port;
}

function IOPort_list(thisValue, argumentsList) {
	var A = Array_Construct([]);
	var keys = Object.keys(IO_objects);
	keys.sort(compareNumber);
	var j = 0;
	for (var i = 0; i < keys.length; i++) {
		var obj = IO_objects[keys[i]];
		if (obj.Class === "IOPort") {
			A.Put(ToString(j++), obj, false);
		}
	}
	return A;
}

function IOPort_prototype_rebind(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var port = thisValue;
	var name = port.name;
	var args = port.args;
	if (name !== undefined) {
		port.handler = IOManager_bind(name, args, port);
	}
}

function IOPort_prototype_open(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var args = IO_unwrapArgs(argumentsList, 0, 0);
	var port = VMObject(CLASSID_IOPort);
	port.Prototype = builtin_IOPort_prototype;
	port.Extensible = true;
	IO_register(port);
	port.handler = IOManager_open(thisValue.handler, args, port);
	return port;
}

function IOPort_prototype_terminate(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var port = thisValue;
	IOManager_terminate(port.handler);
	IO_remove(port);
	port.name = undefined;
	port.args = undefined;
	port.handler = undefined;
}

function IOPort_prototype_syncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var name = ToString(argumentsList[0]);
	var args = IO_unwrapArgs(argumentsList, 1, 0);
	var event = IOManager_syncIO(thisValue.handler, name, args, ++IO_maxID);
	return IO_wrap(event, []);
}

function IOPort_prototype_asyncIO(thisValue, argumentsList) {
	if (Type(thisValue) !== TYPE_Object || thisValue.Class !== "IOPort" || thisValue.txid === 0) throw VMTypeError();
	var name = ToString(argumentsList[0]);
	var args = IO_unwrapArgs(argumentsList, 1, 1);
	var callback = argumentsList[argumentsList.length - 1];
	if (IsCallable(callback) === false) throw VMTypeError();
	var req = preventExtensions({
		txid : 0,
		callback : callback,
	});
	IO_register(req);
	IOManager_asyncIO(thisValue.handler, name, args, req);
}

function IOPort_callback(obj, event) {
	assert(obj.txid !== undefined);
	assertEquals(obj, IO_find(obj.txid), obj);
	try {
		if (obj.Class === "IOPort") {
			var callback = obj.Get("callback");
			if (IsCallable(callback) === false) return;
		}
		else {
			var callback = obj.callback;
			assert(IsCallable(callback));
			IO_remove(obj);
		}
		var argumentsList = IO_wrapArgs(event);
		callback.Call(undefined, argumentsList);
	} catch (e) {
		if (isInternalError(e)) throw e;
		try {
			var callback = builtin_IOPort.Get("uncaughtErrorCallback");
			if (IsCallable(callback) === false) return;
			callback.Call(undefined, [ e ]);
		} catch (e) {
			if (isInternalError(e)) throw e;
		}
	}
}

var IO_maxID;
var IO_objects;

function IO_register(obj) {
	var txid = ++IO_maxID;
	obj.txid = txid;
	IO_objects[txid] = obj;
	console.log("register" + txid);
}

function IO_find(txid) {
	return IO_objects[txid];
}

function IO_remove(obj) {
	var txid = obj.txid;
	obj.txid = 0;
	delete (IO_objects[txid]);
}

function IO_unwrapArgs(A, start, end) {
	assert(A instanceof Array);
	var stack = [];
	var length = A.length;
	var a = [];
	for (var i = start; i < length - end; i++) {
		a[i - start] = IO_unwrap(A[i], stack);
	}
	return a;
}

function IO_unwrap(A, stack) {
	if (isPrimitiveValue(A)) {
		return A;
	}
	if (isIncluded(A, stack)) throw VMTypeError();
	stack.push(A);
	if (A.Class === "Array") {
		var a = [];
		var length = A.Get("length");
		for (var i = 0; i < length; i++) {
			a[i] = IO_unwrap(A.Get(ToString(i)), stack);
		}
	}
	else if (A.Class === "Object") {
		var a = {};
		var next = A.enumerator(false, true);
		var P;
		while ((P = next()) !== undefined) {
			a[P] = IO_unwrap(A.Get(P), stack);
		}
	}
	else {
		throw VMTypeError();
	}
	stack.pop();
	return a;
}

function IO_wrapArgs(a) {
	if (a instanceof Array === false) {
		a = [ a ];
	}
	var stack = [];
	var length = a.length;
	var A = [];
	for (var i = 0; i < length; i++) {
		A[i] = IO_wrap(a[i], stack);
	}
	return A;
}

function IO_wrap(a, stack) {
	// must be compatible with FileOutputStream.writeAny
	// i.e. IO_wrap == IO_wrap ○ readAny ○ writeAny
	if (isPrimitiveValue(a)) {
		console.log("wrapped " + a);
		return a;
	}
	if (isIncluded(a, stack)) return null;
	stack.push(a);
	if (a instanceof Array) {
		var length = a.length;
		var A = Array_Construct([ length ]);
		for (var i = 0; i < length; i++) {
			A.Put(ToString(i), IO_wrap(a[i], stack), false);
		}
	}
	else {
		var A = Object_Construct([]);
		var keys = Object.keys(a);
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			A.Put(P, IO_wrap(a[keys[i]], stack), false);
		}
	}
	stack.pop();
	return A;
}

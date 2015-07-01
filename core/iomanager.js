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

var IOManager_state = 'offline'; // -> 'recovery' -> 'online'
var IOManager_uniqueID = 0;
var IOManager_asyncCallbacks = {};
var IOManager_openPorts = {};

function IOManager_bindPort(port, name) {
	if (IOManager_state !== 'online') {
		return;
	}
	port.handler = undefined;
	try {
		port.handler = require(HANDLER_DIR + name);
	} catch (e) {
		console.log("IOManager: bind error " + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_rebindPort(port) {
	var name = port.Get('name');
	if (Type(name) === TYPE_String) {
		IOManager_bindPort(port, name);
	}
	else {
		port.handler = null;
	}
}

function IOManager_closePort(port) {
	var txid = port.txid;
	var p = IOManager_openPorts[txid];
	if (p) {
		assert(p === port);
		delete (IOManager_openPorts[txid]);
	}
	if (port.handler && port.handler.close) {
		port.handler.close();
	}
	port.handler = null;
}

function IOManager_date_now() {
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'recovery') {
			return Date.now();
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.now !== undefined);
			return entry.now;
		}
	}
	var now = Date.now();
	Journal_write({
		now : now
	});
	return now;
}

function IOManager_math_random() {
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'recovery') {
			return Math.random();
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.random !== undefined);
			return entry.random;
		}
	}
	var random = Math.random();
	Journal_write({
		random : random
	});
	return random;
}

function IOManager_syncIO(port, name, args) {
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'recovery') {
			return {
				error : 'offline'
			};
		}
		while (true) {
			var entry = Journal_read();
			if (entry === undefined) {
				break;
			}
			if (entry.type === 'syncIO') {
				assert(entry.name === name);
				return entry;
			}
			else {
				assert(entry.type === 'portEvent');
				IOManager_portEvent(entry);
			}
		}
	}
	var entry = {
		type : 'syncIO',
		name : name
	};
	if (IOManager_state !== 'online') {
		IOManager_online();
		entry.error = 'restart';
	}
	else {
		if (port.handler === undefined) {
			IOManager_rebindPort(port);
		}
		if (port.handler === null) {
			entry.error = 'stale';
		}
		else {
			try {
				args = IOManager_copyAny(args); // safeguard
				var value = port.handler.syncIO(name, args);
				value = IOManager_copyAny(value); // safeguard
				entry.value = value;
			} catch (exception) {
				exception = IOManager_copyAny(exception); // safeguard
				entry.exception = exception;
			}
		}
	}
	Journal_write(entry);
	return entry;
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
		var entry = {
			type : 'asyncIO',
			txid : txid,
			error : 'stale'
		};
		setImmediate(IOManager_asyncIO_completion, entry);
		return txid;
	}
	try {
		args = IOManager_copyAny(args); // safeguard
		port.handler.asyncIO(name, args, function() {
			var value = Array.prototype.slice.call(arguments);
			value = IOManager_copyAny(value); // safeguard
			var entry = {
				type : 'asyncIO',
				txid : txid,
				value : value
			};
			setImmediate(IOManager_asyncIO_completion, entry);
		});
	} catch (e) {
		console.log("IOManager: asyncIO: " + e);
		var entry = {
			type : 'asyncIO',
			txid : txid,
			error : 'fatal'
		};
		setImmediate(IOManager_asyncIO_completion, entry);
	}
	return txid;
}

function IOManager_asyncIO_completion(entry) {
	var txid = entry.txid;
	var callback = IOManager_asyncCallbacks[txid];
	if (callback === undefined) {
		return;
	}
	delete (IOManager_asyncCallbacks[txid]);
	if (IOManager_state === 'online') {
		Journal_write(entry);
	}
	IOManager_context.start();
	IOPort_notify(entry, callback);
	IOManager_context.stop();
}

function IOManager_openPort(port, root, name, args) {
	var txid = ++IOManager_uniqueID;
	IOManager_openPorts[txid] = port;
	port.txid = txid;
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
		port.handler = root.handler.open(name, args, function() {
			var value = Array.prototype.slice.call(arguments);
			value = IOManager_copyAny(value); // safeguard
			var entry = {
				type : 'portEvent',
				txid : txid,
				value : value,
			};
			if (IOManager_context.isInterruptible()) {
				IOManager_portEvent(entry);
			}
			else {
				setImmediate(IOManager_portEvent, entry);
			}
		});
	} catch (e) {
		console.log("IOManager: open error " + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_portEvent(entry) {
	var txid = entry.txid;
	var port = IOManager_openPorts[txid];
	if (port === undefined) {
		return;
	}
	if (entry.error) {
		delete (IOManager_openPorts[txid]);
	}
	if (IOManager_state === 'online') {
		Journal_write(entry);
	}
	IOManager_context.start();
	IOPort_notify(entry, port.Get('callback'));
	IOManager_context.stop();
}

function IOManager_online() {
	assert(IOManager_state === 'recovery');
	IOManager_state = 'online';
	for ( var txid in IOManager_openPorts) {
		var entry = {
			type : 'portEvent',
			txid : Number(txid),
			error : 'restart'
		};
		assert(IOManager_context.isInterruptible());
		IOManager_portEvent(entry);
	}
	for ( var txid in IOManager_asyncCallbacks) {
		txid = Number(txid);
		var entry = {
			type : 'asyncIO',
			txid : Number(txid),
			error : 'restart'
		};
		setImmediate(IOManager_asyncIO_completion, entry);
	}
}

function IOManager_evaluate(text, filename) {
	if (IOManager_state === 'online') {
		Journal_write({
			type : 'evaluate',
			text : text,
			filename : filename,
		});
	}
	IOManager_context.start();
	var result = evaluateProgram(text, filename);
	IOManager_context.stop();
	return result;
}

function IOManager_start() {
	assert(IOManager_state === 'offline');
	IOManager_state = 'recovery';
	console.log('RECOVERING ...');
	while (IOManager_state === 'recovery') {
		var entry = Journal_read();
		if (entry === undefined) {
			IOManager_online();
			break;
		}
		if (entry.type === 'evaluate') {
			IOManager_evaluate(entry.text, entry.filename);
		}
		else if (entry.type === 'asyncIO') {
			IOManager_asyncIO_completion(entry);
		}
		else {
			assert(entry.type === 'portEvent');
			IOManager_portEvent(entry);
		}
	}
	console.log('READY');
}

var IOManager_context = (function() {
	var interruptible = true;
	var startCount = 0;
	var pauseCount = 0;
	var estimate = 0;
	var startTime = 0;
	function resumeTimer() {
		assert(startTime === 0);
		startTime = Date.now();
	}
	function pauseTimer() {
		assert(startTime !== 0);
		estimate += Date.now() - startTime + 1;
		startTime = 0;
	}
	function isInterruptible() {
		return interruptible;
	}
	function start() {
		assert(pauseCount === startCount && interruptible);
		startCount++;
		interruptible = false;
		resumeTimer();
	}
	function stop() {
		assert(pauseCount + 1 === startCount && !interruptible);
		if (startCount === 1) {
			runMicrotasks();
		}
		assert(pauseCount + 1 === startCount && !interruptible);
		startCount--;
		interruptible = true;
		pauseTimer();
		if (startCount === 0 && IOManager_state === 'online' && estimate >= RECOVERY_TARGET) {
			estimate = 0;
			Journal_checkpoint();
		}
	}
	function pause(intr) {
		assert(pauseCount + 1 === startCount && !interruptible);
		pauseCount++;
		interruptible = intr;
		pauseTimer();
	}
	function resume() {
		assert(pauseCount === startCount);
		pauseCount--;
		interruptible = false;
		resumeTimer();
	}

	return {
		start : start,
		stop : stop,
		resume : resume,
		pause : pause,
		isInterruptible : isInterruptible,
	};
})();

function IOManager_copyAny(x, stack) {
	if (isPrimitiveValue(x)) {
		return x;
	}
	if (x instanceof Buffer) {
		return new Buffer(x);
	}
	if (x instanceof Date) {
		return new Date(x.getTime());
	}
	if (x instanceof Error) {
		if (x instanceof TypeError) {
			return new TypeError(x.message);
		}
		if (x instanceof ReferenceError) {
			return new ReferenceError(x.message);
		}
		if (x instanceof RangeError) {
			return new RangeError(x.message);
		}
		return new Error(x.message);
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
}
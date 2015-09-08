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

var HANDLER_SCRIPT_DIR;
var RECOVERY_TARGET = 3000;

var IOManager_state = 'offline'; // -> 'recovery' -> 'online'
var IOManager_uniqueID = 0;
var IOManager_asyncCallbacks = {};
var IOManager_openPorts = {};

function IOManager_bindPort(port, root, name, args) {
	if (IOManager_state !== 'online') {
		return;
	}
	if (root) {
		IOManager_autoRebind(root);
		if (!root.handler) {
			return;
		}
	}
	port.handler = undefined;
	try {
		if (!root) {
			port.handler = require(HANDLER_SCRIPT_DIR + name);
		}
		else {
			if (!root.handler.open) {
				throw new Error("[unhandled]");
			}
			port.handler = root.handler.open(name, args, function() {
				var value = Array.prototype.slice.call(arguments);
				var entry = {
					type : 'portEvent',
					txid : port.txid,
					value : value,
				};
				if (IOManager_context.isInterruptible()) {
					IOManager_portEvent(entry);
				}
				else {
					setImmediate(IOManager_portEvent, entry);
				}
			});
		}
	} catch (e) {
		console.log("IOManager: bind: " + IOPort_longname(port) + "\n" + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_autoRebind(port) {
	if (port.handler !== undefined) {
		return;
	}
	try {
		var root = port.Get('root');
		var name = port.Get('name');
		var plainArgs = port.Get('args');
		var autoRebind = port.Get('autoRebind');
		if (autoRebind || !root) {
			var args = IOPort_unwrapArgs(plainArgs);
			IOManager_bindPort(port, root, name, args);
		}
	} catch (e) {
		console.log("IOManager: auto rebind: " + IOPort_longname(port) + "\n" + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_openPort(port) {
	var txid = ++IOManager_uniqueID;
	IOManager_openPorts[txid] = port;
	port.txid = txid;
}

function IOManager_closePort(port) {
	var txid = port.txid;
	var p = IOManager_openPorts[txid];
	if (p) {
		assert(p === port);
		delete IOManager_openPorts[txid];
	}
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
		IOManager_autoRebind(port);
		if (!port.handler) {
			entry.error = 'stale';
		}
		else {
			try {
				if (!port.handler.syncIO) {
					throw new Error("[unhandled]");
				}
				var value = port.handler.syncIO(name, args);
				entry.value = value;
			} catch (exception) {
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
	IOManager_autoRebind(port);
	if (!port.handler) {
		var entry = {
			type : 'asyncIO',
			txid : txid,
			error : 'stale'
		};
		setImmediate(IOManager_asyncIO_completion, entry);
		return txid;
	}
	try {
		if (!port.handler.asyncIO) {
			throw new Error("[unhandled]");
		}
		port.handler.asyncIO(name, args, function() {
			var value = Array.prototype.slice.call(arguments);
			var entry = {
				type : 'asyncIO',
				txid : txid,
				value : value
			};
			setImmediate(IOManager_asyncIO_completion, entry);
		});
	} catch (e) {
		console.log("IOManager: asyncIO: " + IOPort_longname(port) + "\n" + e); // debug
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
	delete IOManager_asyncCallbacks[txid];
	if (IOManager_state === 'online') {
		Journal_write(entry);
	}
	IOManager_context.start();
	try {
		IOPort_notify(entry, callback);
	} catch (e) {
		IOManager_handleUncaughtError(e);
	}
	IOManager_context.stop();
}

function IOManager_portEvent(entry) {
	var txid = entry.txid;
	var port = IOManager_openPorts[txid];
	if (port === undefined) {
		return;
	}
	if (entry.error && !port.Get('autoRebind')) {
		delete IOManager_openPorts[txid];
	}
	if (IOManager_state === 'online') {
		Journal_write(entry);
	}
	IOManager_context.start();
	try {
		IOPort_notify(entry, port.Get('callback'));
	} catch (e) {
		IOManager_handleUncaughtError(e);
	}
	IOManager_context.stop();
}

function IOManager_online() {
	assert(IOManager_state === 'recovery');
	console.log('READY');
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
	try {
		Global_evaluateProgram(undefined, [ text, filename ]);
	} catch (e) {
		IOManager_handleUncaughtError(e);
	}
	IOManager_context.stop();
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
}

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
		var task = microtaskQueue[0];
		var callback = task.callback;
		var args = task.args;
		assert(IsCallable(callback), callback);
		assert(args instanceof Array, args);
		try {
			callback.Call(undefined, args);
		} catch (e) {
			IOManager_handleUncaughtError(e);
		}
		microtaskQueue.shift();
	}
}

var IOManager_context = (function() {
	var interruptible = true;
	var ioCount = 0;
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
	function getIOCount() {
		return ioCount;
	}
	function start() {
		assert(pauseCount === startCount && interruptible);
		ioCount++;
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
		if (IOManager_state === 'offline') return;
		assert(pauseCount + 1 === startCount && !interruptible);
		pauseCount++;
		interruptible = intr;
		pauseTimer();
	}
	function resume() {
		if (IOManager_state === 'offline') return;
		assert(pauseCount === startCount);
		pauseCount--;
		interruptible = false;
		resumeTimer();
	}

	return {
		start : start,
		stop : stop,
		pause : pause,
		resume : resume,
		isInterruptible : isInterruptible,
		getIOCount : getIOCount,
	};
})();

function IOManager_handleUncaughtError(e) {
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
	while (true) {
		try {
			if (Type(e) === TYPE_Object && e.Class === "Error") {
				var err = ToString(e.Get('stack'));
			}
			else {
				var err = ToString(e);
			}
			if (IOManager_state === 'online') {
				console.log("\nUncaught: " + err);
			}
			return;
		} catch (ee) {
			if (isInternalError(eee)) throw ee;
			e = ee;
		}
	}
}

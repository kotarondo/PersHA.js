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

function IOManager_openPort(port, callback) {
	if(!callback) return;
	var txid = ++IOManager_uniqueID;
	IOManager_openPorts[txid] = port;
	port.txid = txid;
	port.callback = callback;
	IOManager_bindPort(port);
}

function IOManager_closePort(port) {
	var txid = port.txid;
	if(txid){
		assert(IOManager_openPorts[txid] === port);
		delete IOManager_openPorts[txid];
		port.txid = undefined;
		port.callback = undefined;
	}
}

function IOManager_bindPort(port) {
	if (IOManager_state !== 'online') {
		return;
	}
	if (port.handler !== undefined) {
		return;
	}
	port.handler = null;
	var root = port.Get('root');
	var name = port.Get('name');
	try {
		if (!root) {
			port.handler = require(HANDLER_SCRIPT_DIR + name);
			return;
		}
		IOManager_bindPort(root);
		if (!root.handler) {
			return;
		}
		if (!root.handler.open) {
			console.error("IOManager: no open handler: " + IOPort_longname(root));
			return;
		}
		port.handler = root.handler.open(name, function() {
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
	} catch (e) {
		console.error("IOManager: bind: " + IOPort_longname(port) + "," + name + ": " + e);
	}
}

function IOManager_portEvent(entry) {
	var txid = entry.txid;
	var port = IOManager_openPorts[txid];
	if (port === undefined) {
		return;
	}
	if (IOManager_state === 'online') {
		Journal_write(entry);
	}
	IOManager_context.start();
	try {
		IOPort_callback(entry, port.callback);
	} catch (e) {
		var err = IOPort_callbackUncaughtError(e);
		if(err){
			console.error("Uncaught: "+err);
		}
	}
	IOManager_context.stop();
}

function IOManager_asyncIO(port, name, args, callback) {
	if(callback){
		var txid = ++IOManager_uniqueID;
		IOManager_asyncCallbacks[txid] = callback;
	}
	if (IOManager_state !== 'online') {
		return;
	}
	var entry = {
		type : 'asyncIO',
		txid : txid,
	};
	IOManager_bindPort(port);
	try {
		if (!port.handler) {
			entry .error = 'stale';
		}
		else if (!port.handler.asyncIO) {
			entry .error = 'no handler';
		}
		else if(!callback){
			port.handler.asyncIO(name, args);
			return;
		}
		else{
			port.handler.asyncIO(name, args, function() {
				var value = Array.prototype.slice.call(arguments);
				var entry = {
					type : 'asyncIO',
					txid : txid,
					value : value
				};
				setImmediate(IOManager_completionEvent, entry);
			});
			return;
		}
	} catch (e) {
		console.error("IOManager: asyncIO: " + IOPort_longname(port) + "," + name + ": " + e);
		entry .error = 'exception';
	}
	if(callback){
		setImmediate(IOManager_completionEvent, entry);
	}
}

function IOManager_syncIO(port, name, args, callback) {
	if(callback){
		var txid = ++IOManager_uniqueID;
	}
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'recovery') {
			return {
				error : 'offline'
			};
		}
		while (true) {
			var entry = Journal_read();
			if (entry === undefined) {
				IOManager_online();
				var entry = {
					type : 'syncIO',
					name : name,
					error : 'restart'
				};
				Journal_write(entry);
				return entry;
			}
			if (entry.type === 'syncIO') {
				assert(entry.name === name);
				if(entry.success){
					IOManager_asyncCallbacks[txid] = callback;
				}
				return entry;
			}
			assert(entry.type === 'portEvent');
			IOManager_portEvent(entry);
		}
	}
	var entry = {
		type : 'syncIO',
		name : name
	};
	IOManager_bindPort(port);
	try {
		if (!port.handler) {
			entry .error = 'stale';
		}
		else if (!port.handler.asyncIO) {
			entry .error = 'no handler';
		}
		else if(!callback){
			entry.value = port.handler.syncIO(name, args);
			entry.success = true;
		}
		else{
			entry.value = port.handler.syncIO(name, args, function() {
				var value = Array.prototype.slice.call(arguments);
				var entry = {
					type : 'asyncIO',
					txid : txid,
					value : value
				};
				setImmediate(IOManager_completionEvent, entry);
			});
			entry.success = true;
		}
	}catch (exception) {
		entry.exception = exception;
	}
	if(entry.success){
		IOManager_asyncCallbacks[txid] = callback;
	}
	Journal_write(entry);
	return entry;
}

function IOManager_completionEvent(entry) {
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
		IOPort_callback(entry, callback);
	} catch (e) {
		var err = IOPort_callbackUncaughtError(e);
		if(err){
			console.error("Uncaught: "+err);
		}
	}
	IOManager_context.stop();
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
		setImmediate(IOManager_completionEvent, entry);
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
		var err = IOPort_callbackUncaughtError(e);
		if(err){
			console.error("Uncaught: "+err);
		}
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
			IOManager_completionEvent(entry);
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
			var err = IOPort_callbackUncaughtError(e);
			if(err){
				console.error("Uncaught: "+err);
			}
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

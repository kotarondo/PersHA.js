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

var IOManager_state = 'offline'; // -> 'roll-forward' -> 'online'
var IOManager_uniqueID = 0;
var IOManager_asyncCallbacks = {};

function IOManager_bindPort(port, name) {
	if (IOManager_state !== 'online') {
		return;
	}
	port.handler = undefined;
	try {
		port.handler = require(HANDLER_DIR + name);
	} catch (e) {
		console.log("bind error " + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_rebindPort(port) {
	var name = port.Get("name");
	if (Type(name) === TYPE_String) {
		IOManager_bindPort(port, name);
	}
	else {
		port.handler = null;
	}
}

function IOManager_openPort(port, root, args) {
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
		port.handler = root.handler.open(args);
	} catch (e) {
		console.log("open error " + e); // debug
	}
	if (port.handler === undefined) {
		port.handler = null;
	}
}

function IOManager_date_now() {
	var txid = ++IOManager_uniqueID;
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'roll-forward') {
			return Date.now();
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'now' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
	}
	var event = Date.now();
	Journal_write('now', event, txid);
	return event;
}

function IOManager_math_random() {
	var txid = ++IOManager_uniqueID;
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'roll-forward') {
			return Math.random();
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'random' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
	}
	var event = Math.random();
	Journal_write('now', event, txid);
	return event;
}

function IOManager_evaluate(text, filename) {
	Journal_write('evaluate', {
		text : text,
		filename : filename,
	}, 0);
	IOManager_context.start();
	var result = evaluateProgram(text, filename);
	runMicrotasks();
	IOManager_context.stop();
	IOManager_checkpoint();
	return result;
}

function IOManager_syncIO(port, name, args) {
	var txid = ++IOManager_uniqueID;
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'roll-forward') {
			return {
				error : true,
				failure : 'offline'
			};
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'syncIO' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
		var event = {
			error : true,
			failure : 'restart'
		};
	}
	else {
		if (port.handler === undefined) {
			IOManager_rebindPort(port);
		}
		if (port.handler === null) {
			var event = {
				error : true,
				failure : 'stale'
			};
		}
		else {
			IOManager_context.pauseTime();
			try {
				args = IOManager_copyAny(args); // safeguard
				var value = port.handler.syncIO(name, args);
				value = IOManager_copyAny(value); // safeguard
				var event = {
					value : value
				};
			} catch (err) {
				console.log("syncIO error " + err); // debug
				err = IOManager_copyAny(err); // safeguard
				var event = {
					error : true,
					value : err
				};
			}
			IOManager_context.resumeTime();
		}
	}
	Journal_write('syncIO', event, txid);
	return event;
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
		setImmediate(IOManager_asyncIO_completion, failure, 'stale', txid);
		return txid;
	}
	IOManager_context.pauseTime();
	try {
		args = IOManager_copyAny(args); // safeguard
		port.handler.asyncIO(name, args, function(err, value) {
			err = IOManager_copyAny(err); // safeguard
			value = IOManager_copyAny(value); // safeguard
			if (IOManager_context.isIdle()) {
				IOManager_asyncIO_completion(err, value, txid);
			}
			else {
				setImmediate(IOManager_asyncIO_completion, err, value, txid);
			}
		});
	} catch (err) {
		console.log("asyncIO error " + err); // debug
		err = IOManager_copyAny(err); // safeguard
		setImmediate(IOManager_asyncIO_completion, err, undefined, txid);
	}
	IOManager_context.resumeTime();
	return txid;
}

function IOManager_asyncIO_completion(error, value, txid) {
	assert(IOManager_state === 'online');
	var callback = IOManager_asyncCallbacks[txid];
	if (callback === undefined) {
		return;
	}
	delete (IOManager_asyncCallbacks[txid]);
	if (error === failure) {
		var event = {
			failure : value
		};
	}
	else {
		var event = {
			error : error,
			value : value
		};
	}
	Journal_write('asyncIO', event, txid);
	IOManager_context.start();
	IOPort_asyncIO_completion(event, callback);
	runMicrotasks();
	IOManager_context.stop();
	IOManager_checkpoint();
}

function IOManager_online() {
	assert(IOManager_state === 'roll-forward');
	for ( var txid in IOManager_asyncCallbacks) {
		txid = Number(txid);
		setImmediate(IOManager_asyncIO_completion, failure, 'restart', txid);
	}
	IOManager_state = 'online';
}

function IOManager_start() {
	assert(IOManager_state === 'offline');
	IOManager_state = 'roll-forward';
	console.log('RECOVERING ...');
	IOManager_context.resetTime();
	IOManager_context.start();
	while (IOManager_state === 'roll-forward') {
		var entry = Journal_read();
		if (entry === undefined) {
			IOManager_online();
			break;
		}
		if (entry.type === 'asyncIO') {
			var txid = entry.txid;
			var callback = IOManager_asyncCallbacks[txid];
			assert(callback !== undefined);
			delete (IOManager_asyncCallbacks[txid]);
			IOPort_asyncIO_completion(entry.event, callback);
		}
		else if (entry.type === 'evaluate') {
			var event = entry.event;
			evaluateProgram(event.text, event.filename);
		}
		else {
			assert(false, entry.type);
		}
		runMicrotasks();
	}
	IOManager_context.stop();
	console.log('READY');
	IOManager_checkpoint();
}

function IOManager_checkpoint() {
	if (IOManager_context.getTime() >= RECOVERY_TARGET) {
		IOManager_context.resetTime();
		Journal_checkpoint();
	}
}

var IOManager_context = (function() {
	var idle = true;
	function start() {
		assert(idle);
		idle = false;
		resumeTime();
	}
	function stop() {
		pauseTime();
		assert(!idle);
		idle = true;
	}
	function isIdle() {
		return idle;
	}
	var time = 0;
	var startTime = 0;
	function resumeTime() {
		if (idle) return;
		assert(startTime === 0);
		startTime = Date.now();
	}
	function pauseTime() {
		if (idle) return;
		assert(startTime !== 0);
		time += Date.now() - startTime + 1;
		startTime = 0;
	}
	function getTime() {
		return time;
	}
	function resetTime() {
		time = 0;
	}
	return {
		start : start,
		stop : stop,
		isIdle : isIdle,
		resumeTime : resumeTime,
		pauseTime : pauseTime,
		getTime : getTime,
		resetTime : resetTime,
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
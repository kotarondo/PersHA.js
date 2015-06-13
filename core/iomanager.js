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
var RECOVERY_TARGER = 3000;

var IOManager_state = 'offline'; // 'offline' -> 'roll-forward' -> 'online'
var IOManager_uniqueID = 0;
var IOManager_asyncCallbacks = {};

function IOManager_bindPort(port, name) {
	if (IOManager_state !== 'online') {
		return;
	}
	try {
		port.handler = require(HANDLER_DIR + name);
	} catch (e) {
		console.log("bind error " + e); // debug
		port.handler = null;
	}
}

function IOManager_rebindPort(port) {
	var name = port.Get("name");
	if (Type(name) === TYPE_String) {
		IOManager_bindPort(port, name);
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
	try {
		port.handler = root.handler.open(args);
	} catch (e) {
		console.log("open error " + e); // debug
		port.handler = null;
	}
}

function IOManager_syncIO(port, name, args) {
	var txid = ++IOManager_uniqueID;
	if (IOManager_state !== 'online') {
		if (IOManager_state !== 'roll-forward') {
			return [ 'error', 'offline' ];
		}
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'syncIO' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
		var event = [ 'error', 'restart' ];
	}
	else {
		if (port.handler === undefined) {
			IOManager_rebindPort(port);
		}
		if (port.handler === null) {
			var event = [ 'error', 'stale' ];
		}
		else {
			IOManager_cpucount.pause();
			try {
				var event = handler.syncIO(name, args);
			} catch (e) {
				console.log("syncIO error " + e); // debug
				var event = [ 'error', 'internal' ];
			}
			IOManager_cpucount.resume();
		}
	}
	Journal_write('syncIO', event, txid);
	return event;
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
		setImmediate(IOManager_asyncIO_completion, [ 'error', 'stale' ], txid);
		return txid;
	}
	IOManager_cpucount.pause();
	try {
		port.handler.asyncIO(name, args, function(event) {
			setImmediate(IOManager_asyncIO_completion, event, txid);
		});
	} catch (e) {
		console.log("asyncIO error " + e); // debug
		setImmediate(IOManager_asyncIO_completion, [ 'error', 'internal' ], txid);
	}
	IOManager_cpucount.resume();
	return txid;
}

function IOManager_asyncIO_completion(event, txid) {
	assert(IOManager_state === 'online');
	var callback = IOManager_asyncCallbacks[txid];
	if (callback === undefined) {
		return;
	}
	delete (IOManager_asyncCallbacks[txid]);
	Journal_write('asyncIO', event, txid);
	IOManager_cpucount.resume();
	scheduleMicrotask(callback, IOPort_wrapArgs(event));
	runMicrotasks();
	IOManager_cpucount.pause();
	IOManager_checkpoint();
}

function IOManager_online() {
	assert(IOManager_state === 'roll-forward');
	var keys = Object.keys(IOManager_asyncCallbacks);
	for (var i = 0; i < keys.length; i++) {
		var txid = keys[i];
		setImmediate(IOManager_asyncIO_completion, [ 'error', 'restart' ], txid);
	}
	IOManager_state = 'online';
}

function IOManager_start() {
	assert(IOManager_state === 'offline');
	IOManager_state = 'roll-forward';
	console.log('rollforward ...'); //debug
	IOManager_cpucount.reset();
	IOManager_cpucount.resume();
	while (IOManager_state === 'roll-forward') {
		var entry = Journal_read();
		if (entry === undefined) {
			IOManager_online();
			break;
		}
		if (entry.type === 'asyncIO') {
			var callback = IOManager_removeAsyncReq(entry.txid);
			assert(callback !== undefined);
			scheduleMicrotask(callback, IOPort_wrapArgs(entry.event));
			runMicrotasks();
		}
		else if (entry.type === 'evaluate') {
			var event = entry.event;
			evaluateProgram(event.text, event.filename);
		}
		else {
			assert(false, entry.type);
		}
	}
	IOManager_cpucount.pause();
	console.log('rollforward done'); //debug
	IOManager_checkpoint();
}

function IOManager_evaluate(text, filename) {
	Journal_write('evaluate', {
		text : text,
		filename : filename,
	}, 0);
	IOManager_cpucount.resume();
	var result = evaluateProgram(text, filename);
	runMicrotasks();
	IOManager_cpucount.pause();
	IOManager_checkpoint();
	return result;
}

function IOManager_checkpoint() {
	if (IOManager_cpucount.get() >= RECOVERY_TARGER) {
		IOManager_cpucount.reset();
		Journal_checkpoint();
	}
}

var IOManager_cpucount = function() {
	var count = 0;
	var startTime = 0;
	function resume() {
		assert(startTime === 0);
		startTime = Date.now();
	}
	function pause() {
		assert(startTime !== 0);
		count += Date.now() - startTime + 10;
		startTime = 0;
	}
	function get() {
		return count;
	}
	function reset() {
		count = 0;
	}
	return {
		resume : resume,
		pause : pause,
		get : get,
		reset : reset,
	};
}();

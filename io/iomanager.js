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
var RECOVERY_TARGER = 1000;

var IOManager_queue;

function IOManager_bind(name, args, port) {
	if (IOManager_queue === undefined) {
		return null;
	}
	try {
		console.log("bind " + name); // debug
		return require(HANDLER_DIR + name).bind(args, function(event) {
			IOManager_schedule(port, event);
		});
	} catch (e) {
		console.log("bind error " + e); // debug
		IOManager_schedule(port, [ 'error', 'bind', e ]);
		return null;
	}
}

function IOManager_open(handler, args, port) {
	if (IOManager_queue === undefined) {
		return null;
	}
	if (handler === null) {
		IOManager_schedule(port, [ 'error', 'open', 'stale' ]);
		return null;
	}
	try {
		console.log("open "); // debug
		return handler.open(args, function(event) {
			IOManager_schedule(port, event);
		});
	} catch (e) {
		console.log("open error " + e); // debug
		IOManager_schedule(port, [ 'error', 'open', e ]);
		return null;
	}
}

function IOManager_terminate(handler) {
	if (IOManager_queue === undefined) {
		return;
	}
	if (handler === null) {
		return;
	}
	try {
		console.log("terminate "); // debug
		handler.terminate();
	} catch (e) {
		console.log("terminate error " + e); // debug
	}
}

function IOManager_syncIO(handler, name, args, txid) {
	IOManager_cpucount.pause();
	if (IOManager_queue === undefined) {
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'syncIO' && entry.txid === txid);
			var event = entry.event;
		}
		else {
			IOManager_online();
			var event = [ 'error', 'syncIO', 'restart' ];
		}
	}
	else {
		if (handler === null) {
			var event = [ 'error', 'syncIO', 'stale' ];
		}
		else {
			try {
				console.log("syncIO " + name); // debug
				var event = handler.syncIO(name, args);
			} catch (e) {
				console.log("syncIO error " + e); // debug
				var event = [ 'error', 'syncIO', e ];
			}
		}
	}
	Journal_write('syncIO', event, txid);
	IOManager_cpucount.resume();
	return event;
}

function IOManager_asyncIO(handler, name, args, req) {
	if (IOManager_queue === undefined) {
		return;
	}
	if (handler === null) {
		IOManager_schedule(req, [ 'error', 'asyncIO', 'stale' ]);
		return;
	}
	try {
		console.log("asyncIO "); // debug
		handler.asyncIO(name, args, function(event) {
			IOManager_schedule(req, event);
		});
	} catch (e) {
		console.log("asyncIO error " + e); // debug
		IOManager_schedule(req, [ 'error', 'asyncIO', e ]);
	}
}

function IOManager_date_now(txid) {
	if (IOManager_queue === undefined) {
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

function IOManager_math_random(txid) {
	if (IOManager_queue === undefined) {
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.type === 'random' && entry.txid === txid);
			return entry.event;
		}
		IOManager_online();
	}
	var event = Math.random();
	Journal_write('random', event, txid);
	return event;
}

function IOManager_start() {
	console.log('rollforward ...'); //debug
	while (IOManager_queue === undefined) {
		var entry = Journal_read();
		if (entry === undefined) {
			IOManager_online();
			break;
		}
		if (entry.type === 'schedule') {
			var obj = IO_find(entry.txid);
			IOManager_cpucount.resume();
			IOPort_callback(obj, entry.event);
			IOManager_cpucount.pause();
		}
		else if (entry.type === 'evaluate') {
			var event = entry.event;
			IOManager_cpucount.resume();
			evaluateProgram(event.text, event.filename);
			IOManager_cpucount.pause();
		}
		else {
			assert(false, entry.type);
		}
	}
	console.log('rollforward done'); //debug
	IOManager_checkpoint();
}

function IOManager_online() {
	assert(IOManager_queue === undefined);
	IOManager_queue = [];
	var keys = Object.keys(IO_objects);
	keys.sort(compareNumber);
	for (var i = 0; i < keys.length; i++) {
		var obj = IO_objects[keys[i]];
		IOManager_schedule(obj, [ 'restart' ]);
		if (obj.Class === "IOPort") {
			var name = obj.name;
			var args = obj.args;
			if (name !== undefined) {
				obj.handler = IOManager_bind(name, args, obj);
			}
		}
	}
}

function IOManager_schedule(obj, event) {
	if (IOManager_queue.length === 0) {
		setTimeout(IOManager_loop, 0);
	}
	IOManager_queue.push(obj);
	IOManager_queue.push(event);
}

function IOManager_loop() {
	while (true) {
		if (IOManager_queue.length === 0) {
			return;
		}
		var obj = IOManager_queue.shift();
		var event = IOManager_queue.shift();
		if (obj.txid !== undefined) {
			break;
		}
	}
	Journal_write('schedule', event, obj.txid);
	IOManager_cpucount.resume();
	IOPort_callback(obj, event);
	IOManager_cpucount.pause();
	IOManager_checkpoint();
	if (IOManager_queue.length !== 0) {
		setTimeout(IOManager_loop, 0);
	}
}

function IOManager_evaluate(text, filename) {
	Journal_write('evaluate', {
		text : text,
		filename : filename,
	}, 0);
	IOManager_cpucount.resume();
	var result = evaluateProgram(text, filename);
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

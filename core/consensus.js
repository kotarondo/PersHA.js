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

var consensus_socket = require('net').Socket();
var consensus_async = SocketOutputStream(consensus_socket);

function consensus_schedule(entry) {
	consensus_async.writeAny(entry);
	consensus_async.flush();
}

SocketInputEmitter(consensus_socket, function(entry) {
	try {
		switch (entry.type) {
		case 'online':
			for ( var txid in IOP_asyncCallbacks) {
				consensus_completionError(txid, 'restart');
			}
			IOM_state = 'online';
			break;
		case 'restart':
			IOP_restartPorts();
			break;
		case 'completionEvent':
			var args = IOP_wrapArgs(entry.args);
			IOP_completionEvent(entry.txid, args);
			break;
		case 'completionError':
			IOP_completionEvent(entry.txid, [ IOPortError_Construct([ entry.reason ]) ]);
			break;
		case 'portEvent':
			var args = IOP_wrapArgs(entry.args);
			IOP_portEvent(entry.txid, args);
			break;
		case 'evaluate':
			Global_evaluateProgram(undefined, [ entry.text, entry.filename ]);
			break;
		default:
			assert(false, entry);
		}
	} catch (e) {
		if (isInternalError(e)) throw e;
		task_callbackUncaughtError(e);
	}
	runMicrotasks();
	consensus_schedule({
		type : 'getNextEvent',
	});
});

function consensus_completionCallback(txid, args) {
	if (!txid) return;
	consensus_schedule({
		type : 'completionEvent',
		txid : txid,
		args : args,
	});
}

function consensus_completionError(txid, reason) {
	if (!txid) return;
	consensus_schedule({
		type : 'completionError',
		txid : txid,
		reason : reason,
	});
}

function consensus_portAsyncCallback(txid, args) {
	if (!txid) return;
	consensus_schedule({
		type : 'portEvent',
		txid : txid,
		args : args,
	});
}

function consensus_evaluate(text, filename) {
	consensus_schedule({
		type : 'evaluate',
		text : text,
		filename : filename,
	});
}

var consensus_sync = function() {
	var fd = require('blocking-socket').open(PERSHA_DATA + "/ipcS");
	var dos = BlockingSocketOutputStream(fd);
	var dis = BlockingSocketInputStream(fd);
	var peek;

	function write(entry) {
		dos.writeAny(entry);
		dos.flush();
	}

	function read() {
		if (peek) {
			var entry = peek;
			peek = undefined;
		}
		else {
			var entry = dis.readAny();
		}
		return entry;
	}

	function readPortEvent() {
		var entry = read();
		if (entry.type !== 'portEvent') {
			assert(!peek, peek);
			peek = event;
			return undefined;
		}
		return entry;
	}

	function writeSnapshot1() {
		dos.writeAny({
			type : 'writeSnapshot'
		});
		var cos = ContainerOutputStream(dos);
		writeSnapshot(cos);
		cos.close();
		var entry = read();
		assert(entry.type === 'snapshotWritten', entry);
	}

	return {
		write : write,
		read : read,
		readPortEvent : readPortEvent,
		writeSnapshot : writeSnapshot1,
	};
}();

function consensus_completionSyncIO(type, value) {
	consensus_sync.write({
		type : type,
		value : value
	});
	while (true) {
		var entry = consensus_sync.read();
		switch (entry.type) {
		case 'online':
			for ( var txid in IOP_asyncCallbacks) {
				consensus_completionError(txid, 'restart');
			}
			IOM_state = 'online';
			continue;
		case 'restart':
			IOP_restartPorts();
			continue;
		case 'return':
			var value = IOP_wrap(entry.value);
			return {
				type : 'return',
				value : value
			};
		case 'throw':
			var value = IOP_wrap(entry.value);
			return {
				type : 'throw',
				value : value
			};
		case 'error':
			assert(isPrimitiveValue(entry.value), entry);
			return {
				type : 'error',
				value : entry.value
			};
		case 'portEvent':
			var args = IOP_wrapArgs(entry.args);
			try {
				IOP_portEvent(entry.txid, args);
			} catch (e) {
				if (isInternalError(e)) throw e;
			}
			break;
		default:
			assert(false, entry);
		}
	}
}

function consensus_portSyncCallback(txid, args) {
	if (!txid) return;
	consensus_sync.write({
		type : 'portEvent',
		txid : txid,
		args : args,
	});
	var entry = consensus_sync.readPortEvent();
	if (!entry) {
		return;
	}
	args = IOP_wrapArgs(entry.args);
	try {
		IOP_portEvent(entry.txid, args);
	} catch (e) {
		if (isInternalError(e)) throw e;
		e = IOP_unwrap(e);
		throw e;
	}
}

function consensus_date_now() {
	consensus_sync.write({
		type : 'Date.now',
		value : Date.now()
	});
	var entry = consensus_sync.read();
	assert(entry.type === 'Date.now', entry);
	return entry.value;
}

function consensus_date_parse(str) {
	consensus_sync.write({
		type : 'Date.parse',
		value : Date.parse(str)
	});
	var entry = consensus_sync.read();
	assert(entry.type === 'Date.parse', entry);
	return entry.value;
}

function consensus_math_random() {
	consensus_sync.write({
		type : 'Math.random',
		value : Math.random()
	});
	var entry = consensus_sync.read();
	assert(entry.type === 'Math.random', entry);
	return entry.value;
}

function consensus_uncaughtError(err) {
	//TODO
	console.log("Uncaught: " + err);
	process.reallyExit(1);
}

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

var net = require('net');

var serverA = net.Server();
var serverS = net.Server();
var async_event_queue = [];
var online = false;

serverA.on('connection', function(conn) {
	var clientWaiting = false;
	var dos = SocketOutputStream(conn);

	function send(entry) {
		dos.writeAny(entry);
		dos.flush();
	}

	SocketInputEmitter(conn, function(entry) {
		if (entry.type === 'getNextEvent') {
			if (!online) {
				var entry = Journal_read();
				if (entry) {
					send(entry);
					return;
				}
				online = true;
				Journal_write({
					type : 'restart'
				});
				send({
					type : 'online'
				});
				return;
			}
			else if (async_event_queue.length === 0) {
				if (!clientWaiting) {
					clientWaiting = true;
					send({
						type : 'unref'
					});
				}
				return;
			}
			else {
				entry = async_event_queue.shift();
				Journal_write(entry);
				send(entry);
				return;
			}
		}
		else if (clientWaiting) {
			assert(async_event_queue.length === 0, async_event_queue);
			clientWaiting = false;
			Journal_write(entry);
			send(entry);
			return;
		}
		else {
			async_event_queue.push(entry);
			return;
		}
	});
});

serverS.on('connection', function(conn) {
	var dos = SocketOutputStream(conn);
	var snapshotWriting;

	function send(entry) {
		dos.writeAny(entry);
		dos.flush();
	}

	function snapshotRead() {
		Journal_startReadCheckpoint();
		while (true) {
			try {
				var buffer = Journal_inputStream.readRaw();
			} catch (e) {
				if (e.message !== 'end of file') {
					console.error("CHECKPOINT: " + e.stack);
					process.reallyExit(1);
				}
				Journal_closeReadCheckpoint();
				send("end of container");
				return;
			}
			send(buffer);
		}
	}

	SocketInputEmitter(conn, function(entry) {
		if (snapshotWriting) {
			if (entry === "end of container") {
				snapshotWriting = false;
				Journal_closeWriteCheckpoint();
				send({
					type : 'snapshotWritten'
				});
				return;
			}
			assert(entry instanceof Buffer);
			Journal_outputStream.writeRaw(entry);
			return;
		}
		switch (entry.type) {
		case 'readSnapshot':
			snapshotRead();
			return;
		case 'writeSnapshot':
			snapshotWriting = true;
			Journal_startWriteCheckpoint();
			return;
		case 'beforeExit':
			assert(online);
			var entry = {
				type : 'evaluate',
				text : "process.emit('beforeExit')",
				filename : "(beforeExit)"
			};
			Journal_write(entry);
			send(entry);
			return;
		case 'exit':
			assert(online);
			var entry = {
				type : 'evaluate',
				text : "process.exit(0)",
				filename : "(exit)"
			};
			Journal_write(entry);
			send(entry);
			return;
		}
		if (!online) {
			var entry = Journal_read();
			if (entry) {
				send(entry);
				return;
			}
			online = true;
			Journal_write({
				type : 'restart'
			});
			send({
				type : 'online'
			});
			return;
		}
		switch (entry.type) {
		case 'offline':
			assert(false, entry);
			break;
		case 'getNextEvent':
			var entry = {
				type : 'error',
				value : 'restart'
			};
			break;
		}
		Journal_write(entry);
		send(entry);
	});
});

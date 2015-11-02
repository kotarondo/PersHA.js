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

var serverS = net.Server();

serverS.on('connection', function(conn) {
	var dos = SocketOutputStream(conn);
	var snapshotWriting;

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
				dos.writeAny("end of container");
				dos.flush();
				return;
			}
			dos.writeAny(buffer);
		}
	}

	SocketInputEmitter(conn, function(entry) {
		if (snapshotWriting) {
			if (entry === "end of container") {
				snapshotWriting = false;
				Journal_closeWriteCheckpoint();
				dos.writeAny({
					type : 'snapshotWritten'
				});
				dos.flush();
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
		case 'offline':
		case 'getNextEvent':
			if (online) {
				dos.writeAny({
					type : 'error',
					value : 'restart'
				});
				dos.flush();
				return;
			}
			var entry = Journal_read();
			if (!entry) {
				online = true;
				dos.writeAny({
					type : 'online'
				});
				dos.flush();
				return;
			}
			dos.writeAny(entry);
			dos.flush();
			return;
		}
		Journal_write(entry);
		dos.writeAny(entry);
		dos.flush();
	});
});

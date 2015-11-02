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
var async_event_queue = [];
var online = false;

serverA.on('connection', function(conn) {
	var clientWaiting = false;
	var dos = SocketOutputStream(conn);

	SocketInputEmitter(conn, function(entry) {
		if (entry.type === 'getNextEvent') {
			assert(!clientWaiting);
			if (!online) {
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
			}
			else if (async_event_queue.length === 0) {
				clientWaiting = true;
			}
			else {
				entry = async_event_queue.shift();
				Journal_write(entry);
				dos.writeAny(entry);
				dos.flush();
			}
		}
		else if (clientWaiting) {
			assert(async_event_queue.length === 0, async_event_queue);
			clientWaiting = false;
			Journal_write(entry);
			dos.writeAny(entry);
			dos.flush();
		}
		else {
			async_event_queue.push(entry);
		}
	});
});

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

var bs = require('blocking-socket');

function BlockingSocketOutputStream(fd) {
	function write(buffer) {
		var transferred = 0;
		while(transferred < buffer.length){
			var l = bs.send(fd, buffer.slice(transferred));
			if( l < 0){
				throw new Error("send error");
			}
			transferred += l;
			assert(transferred <= buffer.length, l);
		}
	}

	return DataOutputStream({
		write: write
	});
}

function BlockingSocketInputStream(fd) {
	function readFully(buffer, startPos, minPos) {
		var transferred = 0;
		while(true){
			assert(startPos <= buffer.length, startPos);
			if (minPos <= startPos) {
				return transferred;
			}
			var l = bs.recv(fd, buffer.slice(startPos));
			if (l <= 0) {
				throw new Error("recv error");
			}
			startPos += l;
			transferred += l;
		}
		throw Error("too many retries");
	}

	return DataInputStream({
		readFully : readFully
	});
}

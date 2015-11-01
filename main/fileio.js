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

var fs = require('fs');

function FileOutputStream(filename, openExists) {
	var position = 0;
	if (openExists) {
		var fd = fs.openSync(filename, 'r+');
	}
	else {
		var fd = fs.openSync(filename, 'w');
	}

	function getPosition() {
		return position;
	}

	function setPosition(pos) {
		dos.flush();
		position = pos;
		fs.ftruncateSync(fd, position);
	}

	function close() {
		dos.flush();
		try {
			fs.closeSync(fd);
		} catch (e) {
		}
		fd = undefined;
	}

	function fsync() {
		flush();
		fs.fsyncSync(fd);
	}

	function write(buffer) {
		if (typeof buffer === "string") {
			var l = fs.writeSync(fd, buffer, position);
			position += l;
			return;
		}
		var startPos = 0;
		var endPos = buffer.length;
		for (var i = 0; i < 10000; i++) {
			assert(startPos <= endPos, startPos);
			if (startPos >= endPos) {
				return;
			}
			var l = fs.writeSync(fd, buffer, startPos, endPos - startPos, position);
			position += l;
			startPos += l;
		}
		throw Error("too many retries");
	}

	var dos = DataOutputStream({
		write : write
	});

	return {
		getPosition : getPosition,
		setPosition : setPosition,
		writeInt : dos.writeInt,
		writeString : dos.writeString,
		writeBuffer : dos.writeBuffer,
		writeNumber : dos.writeNumber,
		writeAny : dos.writeAny,
		write : dos.write,
		flush : dos.flush,
		fsync : fsync,
		close : close,
	};
}

function FileInputStream(filename) {
	var position = 0;
	var fd = fs.openSync(filename, 'r');

	function getPosition() {
		return position - dis.getCacheRemain();
	}

	function setPosition(pos) {
		dis.clearCache();
		position = pos;
	}

	function close() {
		try {
			fs.closeSync(fd);
		} catch (e) {
		}
		fd = undefined;
	}

	function readFully(buffer, startPos, minPos) {
		var transferred = 0;
		for (var i = 0; i < 10000; i++) {
			assert(startPos <= buffer.length, startPos);
			if (minPos <= startPos) {
				return transferred;
			}
			var l = fs.readSync(fd, buffer, startPos, buffer.length - startPos, position);
			if (l === 0) {
				throw Error("end of file");
			}
			position += l;
			startPos += l;
			transferred += l;
		}
		throw Error("too many retries");
	}

	var dis = DataInputStream({
		readFully : readFully
	});

	return {
		getPosition : getPosition,
		setPosition : setPosition,
		readInt : dis.readInt,
		readString : dis.readString,
		readBuffer : dis.readBuffer,
		readNumber : dis.readNumber,
		readAny : dis.readAny,
		close : close,
	};
}

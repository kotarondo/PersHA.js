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
	var capacity = 8192;
	var cacheLen = 0;
	var position = 0;
	var buffer = new Buffer(capacity);
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
		flush();
		position = pos;
		fs.ftruncateSync(fd, position);
	}

	function close() {
		flush();
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

	function flush() {
		assert(cacheLen <= capacity, cacheLen);
		writeFully(fd, buffer, 0, cacheLen);
		cacheLen = 0;
	}

	function putByte(x) {
		if (cacheLen === capacity) {
			flush();
		}
		buffer[cacheLen++] = x;
	}

	function writeInt(x) {
		assert((typeof x) === "number", x);
		assert(floor(x) === x && x >= 0, x);
		while (true) {
			if (x < 128) {
				putByte(x);
				return;
			}
			putByte((x & 127) + 128);
			x = x >>> 7;
		}
	}

	function writeString(x) {
		assert((typeof x) === "string");
		var length = Buffer.byteLength(x);
		writeInt(length);
		if (capacity < cacheLen + length) {
			flush();
			if (capacity < length) {
				var l = fs.writeSync(fd, x, position);
				position += l;
				assert(l === length);
				return;
			}
		}
		var l = buffer.write(x, cacheLen);
		assert(l === length);
		cacheLen += length;
	}

	function writeBuffer(x) {
		assert(x instanceof Buffer);
		var length = x.length;
		writeInt(length);
		if (capacity < cacheLen + length) {
			flush();
			if (capacity < length) {
				writeFully(fd, x, 0, length);
				return;
			}
		}
		x.copy(buffer, cacheLen);
		cacheLen += length;
	}

	function writeNumber(x) {
		assert((typeof x) === "number");
		if (capacity < cacheLen + 8) {
			flush();
		}
		buffer.writeDoubleLE(x, cacheLen);
		cacheLen += 8;
	}

	function writeAny(x, stack) {
		switch (typeof x) {
		case "undefined":
			writeInt(1);
			return;
		case "boolean":
			writeInt((x === true) ? 2 : 3);
			return;
		case "number":
			writeInt(4);
			writeNumber(x);
			return;
		case "string":
			writeInt(5);
			writeString(x);
			return;
		}
		if (x === null) {
			writeInt(6);
			return;
		}
		if (x instanceof Buffer) {
			writeInt(7);
			writeBuffer(x);
			return;
		}
		if (x instanceof Date) {
			writeInt(8);
			writeNumber(x.getTime());
			return;
		}
		if (x instanceof Error) {
			if (x instanceof TypeError) {
				writeInt(91);
			}
			else if (x instanceof ReferenceError) {
				writeInt(92);
			}
			else if (x instanceof RangeError) {
				writeInt(93);
			}
			else {
				writeInt(9);
			}
			writeString(x.message);
			return;
		}
		if (x instanceof Function) {
			writeInt(1);
			return;
		}
		if (stack === undefined) stack = [];
		if (isIncluded(x, stack)) {
			writeInt(6);
			return;
		}
		stack.push(x);
		if (x instanceof Array) {
			writeInt(10);
			var length = x.length;
			writeInt(length);
			for (var i = 0; i < length; i++) {
				writeAny(x[i], stack);
			}
		}
		else {
			writeInt(11);
			var keys = Object.getOwnPropertyNames(x);
			var length = keys.length;
			writeInt(length);
			for (var i = 0; i < length; i++) {
				var P = keys[i];
				writeString(P);
				if (P === 'caller' || P === 'callee' || P === 'arguments') {
					continue;
				}
				writeAny(x[P], stack);
			}
		}
		stack.pop();
	}

	function writeFully(fd, buffer, startPos, endPos) {
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

	return {
		getPosition : getPosition,
		setPosition : setPosition,
		writeInt : writeInt,
		writeString : writeString,
		writeBuffer : writeBuffer,
		writeNumber : writeNumber,
		writeAny : writeAny,
		flush : flush,
		fsync : fsync,
		close : close,
	};
}

function FileInputStream(filename) {
	var capacity = 8192;
	var cacheOff = 0;
	var cacheSize = 0;
	var position = 0;
	var buffer = new Buffer(capacity);
	var fd = fs.openSync(filename, 'r');

	function getPosition() {
		return position - cacheSize + cacheOff;
	}

	function setPosition(pos) {
		cacheOff = 0;
		cacheSize = 0;
		position = pos;
	}

	function close() {
		try {
			fs.closeSync(fd);
		} catch (e) {
		}
		fd = undefined;
	}

	function fill(length) {
		if (cacheOff + length <= cacheSize) {
			return;
		}
		assert(cacheOff <= cacheSize);
		if (0 < cacheOff && cacheOff < cacheSize) {
			buffer.copy(buffer, 0, cacheOff, cacheSize);
		}
		cacheSize -= cacheOff;
		cacheOff = 0;
		var l = readFully(fd, buffer, cacheSize, length, capacity);
		cacheSize += l;
		assert(length <= cacheSize && cacheSize <= capacity, cacheSize);
	}

	function getByte(x) {
		fill(1);
		return buffer[cacheOff++];
	}

	function readInt() {
		var x = 0;
		var s = 0;
		while (true) {
			var c = getByte();
			if (c < 128) {
				return x + (c << s);
			}
			x += (c - 128) << s;
			s += 7;
		}
	}

	function readString() {
		var length = readInt();
		if (length > capacity) {
			var b = new Buffer(length);
			if (cacheOff < cacheSize) {
				buffer.copy(b, 0, cacheOff, cacheSize);
			}
			var cached = cacheSize - cacheOff;
			var l = readFully(fd, b, cached, length, length);
			assert(cached + l === length, l);
			cacheOff = 0;
			cacheSize = 0;
			return b.toString();
		}
		fill(length);
		var s = buffer.toString(null, cacheOff, cacheOff + length);
		cacheOff += length;
		return s;
	}

	function readBuffer() {
		var length = readInt();
		var b = new Buffer(length);
		if (length > capacity) {
			if (cacheOff < cacheSize) {
				buffer.copy(b, 0, cacheOff, cacheSize);
			}
			var cached = cacheSize - cacheOff;
			var l = readFully(fd, b, cached, length, length);
			assert(cached + l === length, l);
			cacheOff = 0;
			cacheSize = 0;
			return b;
		}
		fill(length);
		buffer.copy(b, 0, cacheOff, cacheOff + length);
		cacheOff += length;
		return b;
	}

	function readNumber() {
		fill(8);
		var x = buffer.readDoubleLE(cacheOff);
		cacheOff += 8;
		return x;
	}

	function readAny() {
		var type = readInt();
		switch (type) {
		case 1:
			return undefined;
		case 2:
			return true;
		case 3:
			return false;
		case 4:
			return readNumber();
		case 5:
			return readString();
		case 6:
			return null;
		case 7:
			return readBuffer();
		case 8:
			return new Date(readNumber());
		case 91:
			return new TypeError(readString());
		case 92:
			return new ReferenceError(readString());
		case 93:
			return new RangeError(readString());
		case 9:
			return new Error(readString());
		case 10:
			var length = readInt();
			var a = [];
			for (var i = 0; i < length; i++) {
				a[i] = readAny();
			}
			return a;
		case 11:
			var length = readInt();
			var a = {};
			for (var i = 0; i < length; i++) {
				var P = readString();
				if (P === 'caller' || P === 'callee' || P === 'arguments') {
					continue;
				}
				a[P] = readAny();
			}
			return a;
		}
		throw Error("file broken: type=" + type);
	}

	function readFully(fd, buffer, startPos, minPos, capacity) {
		var transferred = 0;
		for (var i = 0; i < 10000; i++) {
			assert(startPos <= capacity, startPos);
			if (minPos <= startPos) {
				return transferred;
			}
			var l = fs.readSync(fd, buffer, startPos, capacity - startPos, position);
			if (l === 0) {
				throw Error("end of file");
			}
			position += l;
			startPos += l;
			transferred += l;
		}
		throw Error("too many retries");
	}

	return {
		getPosition : getPosition,
		setPosition : setPosition,
		readInt : readInt,
		readString : readString,
		readBuffer : readBuffer,
		readNumber : readNumber,
		readAny : readAny,
		close : close,
	};
}
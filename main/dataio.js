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

function DataOutputStream(stream) {
	var capacity = 8192;
	var cacheLen = 0;
	var position = 0;
	var buffer = new Buffer(capacity);

	function flush() {
		assert(cacheLen <= capacity, cacheLen);
		stream.write(buffer.slice(0, cacheLen));
		buffer = new Buffer(capacity);
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
			var c = (x & 127);
			putByte(c + 128);
			x = (x - c) / 128;
		}
	}

	function writeString(x) {
		assert((typeof x) === "string");
		var length = Buffer.byteLength(x);
		writeInt(length);
		if (capacity < cacheLen + length) {
			flush();
			if (capacity < length) {
				stream.write(x);
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
				x = new Buffer(x); // safeguard
				stream.write(x);
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
		if (x instanceof Function) {
			writeInt(1);
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
		if (stack === undefined) stack = [];
		if (isIncluded(x, stack)) {
			writeInt(6);
			return;
		}
		stack.push(x);
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
			else if (x instanceof SyntaxError) {
				writeInt(94);
			}
			else {
				writeInt(9);
			}
			writeString(String(x.message));
		}
		else if (x instanceof Array) {
			writeInt(10);
			writeInt(x.length);
		}
		else {
			writeInt(11);
		}
		var keys = Object.getOwnPropertyNames(x);
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			var P = keys[i];
			if (x.propertyIsEnumerable(P) === false) {
				continue;
			}
			if (P === 'caller' || P === 'callee' || P === 'arguments') {
				continue;
			}
			writeString(P);
			writeAny(x[P], stack);
		}
		writeString('');
		stack.pop();
	}

	function write(x) {
		writeAny(x);
		flush();
	}

	return {
		writeInt : writeInt,
		writeString : writeString,
		writeBuffer : writeBuffer,
		writeNumber : writeNumber,
		writeAny : writeAny,
		write : write,
		flush : flush,
	};
}

function DataInputStream(stream) {
	var capacity = 8192;
	var cacheOff = 0;
	var cacheSize = 0;
	var buffer = new Buffer(capacity);

	function getCacheRemain() {
		return cacheSize - cacheOff;
	}

	function clearCache() {
		cacheOff = 0;
		cacheSize = 0;
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
		var l = stream.readFully(buffer, cacheSize, length, capacity);
		cacheSize += l;
		assert(length <= cacheSize && cacheSize <= capacity, cacheSize);
	}

	function getByte() {
		fill(1);
		return buffer[cacheOff++];
	}

	function readInt() {
		var x = 0;
		var s = 1;
		while (true) {
			var c = getByte();
			if (c < 128) {
				return x + c * s;
			}
			x += (c - 128) * s;
			s *= 128;
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
			var l = stream.readFully(b, cached, length, length);
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
			var l = stream.readFully(b, cached, length, length);
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
			var a = new TypeError(readString());
			break;
		case 92:
			var a = new ReferenceError(readString());
			break;
		case 93:
			var a = new RangeError(readString());
			break;
		case 94:
			var a = new SyntaxError(readString());
			break;
		case 9:
			var a = new Error(readString());
			break;
		case 10:
			var a = new Array(readInt());
			break;
		case 11:
			var a = {};
			break;
		default:
			throw Error("file broken: type=" + type);
		}
		while (true) {
			var P = readString();
			if (P === '') {
				break;
			}
			a[P] = readAny();
		}
		return a;
	}

	return {
		getCacheRemain : getCacheRemain,
		clearCache : clearCache,
		readInt : readInt,
		readString : readString,
		readBuffer : readBuffer,
		readNumber : readNumber,
		readAny : readAny,
	};
}

function OnDataInput(stream, callback) {
	var cacheOff = 0;
	var cacheSize = 0;
	var buffer;
	var pending = [];
	var stack = [];
	var gValue;
	gCall(main);

	function gCall(f) {
		stack.push({
			next : 0
		});
		stack.push(f);
		return true;
	}

	function gReturn(v) {
		stack.length -= 2;
		gValue = v;
		return true;
	}

	stream.on('data', function(data) {
		if (data.length === 0) return;
		if (buffer) {
			pending.push(data);
		}
		else {
			buffer = data;
		}
		cacheSize += data.length;
		do {
			var f = stack[stack.length - 1];
			var ctx = stack[stack.length - 2];
		} while (f(ctx));
	});

	function pack() {
		while (buffer && cacheOff >= buffer.length) {
			cacheOff -= buffer.length;
			cacheSize -= buffer.length;
			buffer = pending.shift();
		}
	}

	function readCache(len) {
		var buf = new Buffer(len);
		var off = 0;
		while (off < len) {
			var l = buffer.length - cacheOff;
			if (len < off + l) {
				l = len - off;
			}
			buffer.copy(buf, off, cacheOff, cacheOff + l);
			off += l;
			cacheOff += l;
			pack();
		}
		return buf;
	}

	function getByte(ctx) {
		if (cacheSize < cacheOff + 1) return false;
		gReturn(buffer[cacheOff++]);
		pack();
		return true;
	}

	function readInt(ctx) {
		switch (ctx.next) {
		case 0:
			ctx.x = 0;
			ctx.s = 1;
			return ctx.next = 1, gCall(getByte);
		case 1:
			var c = gValue;
			if (c < 128) {
				return gReturn(ctx.x + c * ctx.s);
			}
			ctx.x += (c - 128) * ctx.s;
			ctx.s *= 128;
			return ctx.next = 1, gCall(getByte);
		}
		assert(false, ctx);
	}

	function readString(ctx) {
		switch (ctx.next) {
		case 0:
			return ctx.next = 1, gCall(readInt);
		case 1:
			var length = gValue;
			if (cacheSize < cacheOff + length) return false;
			return gReturn(readCache(length).toString());
		}
		assert(false, ctx);
	}

	function readBuffer(ctx) {
		switch (ctx.next) {
		case 0:
			return ctx.next = 1, gCall(readInt);
		case 1:
			var length = gValue;
			if (cacheSize < cacheOff + length) return false;
			return gReturn(readCache(length));
		}
		assert(false, ctx);
	}

	function readNumber(ctx) {
		if (cacheSize < cacheOff + 8) return false;
		return gReturn(readCache(8).readDoubleLE(0));
	}

	function readAny(ctx) {
		switch (ctx.next) {
		case 0:
			return ctx.next = 1, gCall(readInt);
		case 1:
			ctx.type = gValue;
			switch (ctx.type) {
			case 1:
				return gReturn(undefined);
			case 2:
				return gReturn(true);
			case 3:
				return gReturn(false);
			case 4:
				return gReturn(), gCall(readNumber);
			case 5:
				return gReturn(), gCall(readString);
			case 6:
				return gReturn(null);
			case 7:
				return gReturn(), gCall(readBuffer);
			case 8:
				return ctx.next = 2, gCall(readNumber);
			case 91:
			case 92:
			case 93:
			case 94:
			case 9:
				return ctx.next = 2, gCall(readString);
			case 10:
				return ctx.next = 2, gCall(readInt);
			}
		case 2:
			switch (ctx.type) {
			case 8:
				return gReturn(new Date(gValue));
			case 91:
				ctx.a = new TypeError(gValue);
				break;
			case 92:
				ctx.a = new ReferenceError(gValue);
				break;
			case 93:
				ctx.a = new RangeError(gValue);
				break;
			case 94:
				ctx.a = new SyntaxError(gValue);
				break;
			case 9:
				ctx.a = new Error(gValue);
				break;
			case 10:
				ctx.a = new Array(gValue);
				break;
			case 11:
				ctx.a = {};
				break;
			default:
				assert(false, ctx);
			}
			return ctx.next = 3, gCall(readString);
		case 3:
			ctx.P = gValue;
			if (ctx.P === '') {
				return gReturn(ctx.a);
			}
			return ctx.next = 4, gCall(readAny);
		case 4:
			ctx.a[ctx.P] = gValue;
			return ctx.next = 3, gCall(readString);
		}
		assert(false, ctx);
	}

	function main(ctx) {
		switch (ctx.next) {
		case 0:
			return ctx.next = 1, gCall(readAny);
		case 1:
			callback(gValue);
			return ctx.next = 1, gCall(readAny);
		}
		assert(false, ctx);
	}
}

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

function ContainerOutputStream(stream) {

	function writeRaw(buffer) {
		assert(buffer instanceof Buffer);
		stream.writeAny(buffer);
	}

	function close() {
		dos.flush();
		stream.writeAny("end of container");
		stream.flush();
	}

	var dos = DataOutputStream({
		writeRaw : writeRaw
	});

	return {
		writeInt : dos.writeInt,
		writeString : dos.writeString,
		writeBuffer : dos.writeBuffer,
		writeNumber : dos.writeNumber,
		writeAny : dos.writeAny,
		writeRaw : dos.writeRaw,
		flush : dos.flush,
		close : close,
	};
}

function ContainerInputStream(stream) {

	function readRaw() {
		var buffer = stream.readAny();
		if (!(buffer instanceof Buffer)) {
			throw Error("data stream broken");
		}
		return buffer;
	}

	function close() {
		var eoc = stream.readAny();
		if (eoc !== "end of container") {
			throw Error("data stream broken");
		}
	}

	var dis = DataInputStream({
		readRaw : readRaw
	});

	return {
		readInt : dis.readInt,
		readString : dis.readString,
		readBuffer : dis.readBuffer,
		readNumber : dis.readNumber,
		readAny : dis.readAny,
		readRaw : dis.readRaw,
		close : close,
	};
}

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

'use strict'

var binding = process.binding('tty_wrap');
var WriteWrap = process.binding('stream_wrap').WriteWrap;

module.exports = {
	open : open,
	syncIO : syncIO,
};

function open(name, callback) {
	if (name === 'TTY') {
		return new TTYPort(callback);
	}
	console.log("[unhandled] tty_wrap open: " + name);
}

function syncIO(func, args) {
	if (func === 'guessHandleType') {
		return binding.guessHandleType(args[0]);
	}
	if (func === 'isTTY') {
		return binding.isTTY(args[0]);
	}
	console.log("[unhandled] tty_wrap syncIO: " + func);
}

function TTYPort(callback) {
	var handle;

	function restart(state){
		handle = new binding.TTY(state.fd, state.flag);
		if (state.rawMode) {
			handle.setRawMode(state.rawMode);
		}
		if (state.reading) {
			handle.readStart();
		}
		if (state.unref) {
			handle.unref();
		}
		handle.onread = function() {
			var args = Array.prototype.slice.call(arguments);
			callback('onread', args);
		};
	}

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			return restart(args[0]);
		}
		if (func === 'close') {
			return handle.close();
		}
		if (func === 'unref') {
			return handle.unref();
		}
		if (func === 'readStart') {
			return handle.readStart();
		}
		if (func === 'readStop') {
			return handle.readStop();
		}
		if (func === 'setRawMode') {
			return handle.setRawMode(args[0]);
		}
		if (func === 'getWindowSize') {
			var winSize = [];
			var err = handle.getWindowSize(winSize);
			if (err) {
				throw err;
			}
			return winSize;
		}
		console.log("[unhandled] TTY syncIO:" + func);
	};

	this.asyncIO = function(func, args, callback) {
		if (func === 'write') {
			var req = new WriteWrap();
			req.oncomplete = function(status, self, req, err) {
				callback(status, err);
			};
			switch (args[0]) {
			case 'writeUtf8String':
				return handle.writeUtf8String(req, args[1]);
			case 'writeBinaryString':
				return handle.writeBinaryString(req, args[1]);
			case 'writeBuffer':
				return handle.writeBuffer(req, args[1]);
			case 'writeAsciiString':
				return handle.writeAsciiString(req, args[1]);
			case 'writeUcs2String':
				return handle.writeUcs2String(req, args[1]);
			case 'writev':
				return handle.writev(req, args[1]);
			}
		}
		console.log("[unhandled] TTY asyncIO:" + func);
	};
}

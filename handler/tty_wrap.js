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

module.exports = {
	open : open,
	syncIO : syncIO,
};

function open(name, args, callback) {
	if (name === 'TTY') {
		return new TTYPort(args, callback);
	}
	console.log("[unhandled] tty_wrap open:" + name);
}

function syncIO(name, args) {
	if (name === 'guessHandleType') {
		return binding.guessHandleType(args[0]);
	}
	if (name === 'isTTY') {
		return binding.isTTY(args[0]);
	}
	console.log("[unhandled] tty_wrap syncIO:" + name);
}

function TTYPort(args, callback) {
	var TTY = process.binding('tty_wrap').TTY;
	var WriteWrap = process.binding('stream_wrap').WriteWrap;

	var fd=args[0];
	var flag=args[1];

	var handle = new TTY(fd, flag);
	var restarted;

	handle.onread = function() {
		var args = Array.prototype.slice.call(arguments);
		callback('onread', args);
	};

	this.syncIO = function(name, args) {
		if (name === 'getWindowSize') {
			var winSize = [];
			var err = handle.getWindowSize(winSize);
			if (err) {
				throw err;
			}
			return winSize;
		}
		if (name === 'close') {
			return handle.close();
		}
		if (name === 'unref') {
			return handle.unref();
		}
		if (name === 'readStart') {
			return handle.readStart();
		}
		if (name === 'readStop') {
			return handle.readStop();
		}
		if (name === 'setRawMode') {
			return handle.setRawMode(args[0]);
		}
		if (name === 'restart') {
			if (restarted) {
				return;
			}
			restarted = true;
			var unref = args[0];
			var reading = args[1];
			var rawMode = args[2];
			if (rawMode) {
				handle.setRawMode(rawMode);
			}
			if (reading) {
				handle.readStart();
			}
			if (unref) {
				handle.unref();
			}
			return;
		}
		console.log("[unhandled] TTY syncIO:" + name);
	};

	this.asyncIO = function(name, args, callback) {
		if (name === 'write') {
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
		console.log("[unhandled] TTY asyncIO:" + name);
	};
}

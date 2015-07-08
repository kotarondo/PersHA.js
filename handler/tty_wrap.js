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

var tty = process.binding('tty_wrap');

module.exports = {
	open : open,
	syncIO : syncIO,
	asyncIO : asyncIO,
};

function open(name, args, callback) {
	if (name === 'TTY') {
		return new TTYPort(args, callback);
	}
	console.log("[unhandled] tty_wrap open:" + name);
	console.log(args);
}

function syncIO(name, args) {
	if (name === 'guessHandleType') {
		return tty.guessHandleType(args[0]);
	}
	console.log("[unhandled] tty_wrap syncIO:" + name);
	console.log(args);
}

function asyncIO(name, args, callback) {
	console.log("[unhandled] tty_wrap asyncIO:" + name);
	console.log(args);
	callback();
}

function TTYPort(args, callback) {
	var TTY = process.binding('tty_wrap').TTY;
	var WriteWrap = process.binding('stream_wrap').WriteWrap;

	var handle = new TTY(args[0], args[1]);

	handle.onread = function() {
		callback('onread', arguments);
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
		console.log("[unhandled] TTY syncIO:" + name);
		console.log(args);
	};

	this.asyncIO = function(name, args, callback) {
		if (name === 'writeUtf8String') {
			var req = new WriteWrap();
			req.oncomplete = function(status, self, err) {
				callback(status, err);
			};
			handle.writeUtf8String(req, args[0]);
			return;
		}
		console.log("[unhandled] TTY asyncIO:" + name);
		console.log(args);
		callback();
	};
}
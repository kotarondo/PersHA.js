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

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			var state = args[0];
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
			return;
		}
		if (func === 'getWindowSize') {
			var winSize = [];
			var err = handle.getWindowSize(winSize);
			if (err) {
				throw err;
			}
			return winSize;
		}
		return handle[func].apply(handle, args);
	};

	this.asyncIO = function(func, args, callback) {
		if (func === 'write') {
			var ret = {};
			var req = new WriteWrap();
			req.oncomplete = function(status, self, req, err) {
				callback(status, err, handle.writeQueueSize);
			};
			req.async = false;
			var func = args[0];
			var buffer = args[1];
			req.buffer = buffer; // must retain a reference
			ret.err = handle[func].call(handle, req, buffer);
			ret.async = req.async;
			ret.bytes = req.bytes;
			ret.writeQueueSize = handle.writeQueueSize;
			if (!ret.async) {
				ret.immediateCallback = true;
				throw ret;
			}
			return ret;
		}
		console.log("[unhandled] TTY asyncIO:" + func);
	};
}

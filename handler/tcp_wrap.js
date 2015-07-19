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

module.exports = {
	open : open,
	syncIO : syncIO,
	asyncIO : asyncIO,
};

function open(name, args, callback) {
	if (name === 'TCP') {
		return new TCPPort(null, callback);
	}
	console.log("[unhandled] tcp_wrap open:" + name);
	console.log(args);
}

function syncIO(name, args) {
	console.log("[unhandled] tcp_wrap syncIO:" + name);
	console.log(args);
}

function asyncIO(name, args, callback) {
	console.log("[unhandled] tcp_wrap asyncIO:" + name);
	console.log(args);
	callback();
}

function TCPPort(handle, callback) {
	var TCP = process.binding('tcp_wrap').TCP;
	var TCPConnectWrap = process.binding('tcp_wrap').TCPConnectWrap;
	var PipeConnectWrap = process.binding('pipe_wrap').PipeConnectWrap;
	var ShutdownWrap = process.binding('stream_wrap').ShutdownWrap;
	var WriteWrap = process.binding('stream_wrap').WriteWrap;

	if (!handle) {
		var handle = new TCP();
	}
	var queue = [];

	handle.onread = function() {
		callback('onread', arguments);
	};

	handle.onconnection = function(err, h) {
		if (!err) {
			queue.push(h);
		}
		callback('onconnection', err);
	};

	this.open = function(name, args, callback) {
		if (name === 'accept') {
			var h = queue.shift();
			return new TCPPort(h, callback);
		}
		console.log("[unhandled] TCPPort open:" + name);
		console.log(args);
	}

	this.syncIO = function(name, args) {
		if (name === 'readStart') {
			return handle.readStart();
		}
		if (name === 'close') {
			return handle.close();
		}
		if (name === 'bind6') {
			return handle.bind6.apply(handle, args);
		}
		if (name === 'bind') {
			return handle.bind.apply(handle, args);
		}
		if (name === 'listen') {
			return handle.listen.apply(handle, args);
		}
		console.log("[unhandled] TCP syncIO:" + name);
		console.log(args);
	};

	this.asyncIO = function(name, args, callback) {
		if (name === 'connect') {
			var req = new TCPConnectWrap();
			req.oncomplete = function(status, self, req, readable, writable) {
				callback(status, readable, writable);
			};
			handle.connect(req, args[0], args[1]);
			return;
		}
		if (name === 'writev') {
			var req = new WriteWrap();
			req.oncomplete = function(status, self, err) {
				callback(status, err);
			};
			handle.writev(req, args[0]);
			return;
		}
		if (name === 'writeUtf8String') {
			var req = new WriteWrap();
			req.oncomplete = function(status, self, err) {
				callback(status, err);
			};
			handle.writeUtf8String(req, args[0]);
			return;
		}
		if (name === 'writeBinaryString') {
			var req = new WriteWrap();
			req.oncomplete = function(status, self, err) {
				callback(status, err);
			};
			handle.writeBinaryString(req, args[0]);
			return;
		}
		if (name === 'close') {
			handle.close(callback);
			return;
		}
		console.log("[unhandled] TCP asyncIO:" + name);
		console.log(args);
		callback();
	};
}
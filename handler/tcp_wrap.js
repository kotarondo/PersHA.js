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

var binding = process.binding('tcp_wrap');
var TCPConnectWrap = binding.TCPConnectWrap;
var PipeConnectWrap = process.binding('pipe_wrap').PipeConnectWrap;
var ShutdownWrap = process.binding('stream_wrap').ShutdownWrap;
var WriteWrap = process.binding('stream_wrap').WriteWrap;

module.exports = {
	open : open,
};

function open(name, callback) {
	if (name === 'TCP') {
		return new TCPPort(null, callback);
	}
	console.log("[unhandled] tcp_wrap open: " + name);
}

function TCPPort(handle, callback) {
	if (!handle) {
		handle = new binding.TCP();
	}
	var queue = [];

	handle.onread = function() {
		var args = Array.prototype.slice.call(arguments);
		callback('onread', args);
	};

	handle.onconnection = function(err, h) {
		if (!err) {
			queue.push(h);
		}
		callback('onconnection', err);
	};

	this.open = function(name, callback) {
		if (name === 'accept') {
			var h = queue.shift();
			return new TCPPort(h, callback);
		}
		console.log("[unhandled] TCPPort open:" + name);
	}

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			var state = args[0];
			if (state.bindArgs) {
				handle.bind.apply(handle, state.bindArgs);
			}
			if (state.bind6Args) {
				handle.bind6.apply(handle, state.bind6Args);
			}
			if (state.listenArgs) {
				handle.listen.apply(handle, state.listenArgs);
			}
			if (state.unref) {
				handle.unref();
			}
			return;
		}
		if (func === 'readStart') {
			return handle.readStart();
		}
		if (func === 'readStop') {
			return handle.readStop();
		}
		if (func === 'ref') {
			return handle.ref();
		}
		if (func === 'unref') {
			return handle.unref();
		}
		if (func === 'close') {
			return handle.close();
		}
		if (func === 'bind6') {
			return handle.bind6.apply(handle, args);
		}
		if (func === 'bind') {
			return handle.bind.apply(handle, args);
		}
		if (func === 'listen') {
			return handle.listen.apply(handle, args);
		}
		if (func === 'getsockname') {
			var res = {
				out : {}
			};
			res.err = handle.getsockname(res.out);
			return res;
		}
		if (func === 'getpeername') {
			var res = {
				out : {}
			};
			res.err = handle.getsockname(res.out);
			return res;
		}
		if (func === 'setNoDelay') {
			return handle.setNoDelay.apply(handle, args);
		}
		if (func === 'setKeepAlive') {
			return handle.setKeepAlive.apply(handle, args);
		}
		console.log("[unhandled] TCP syncIO: " + func);
	};

	this.asyncIO = function(func, args, callback) {
		if (func === 'write') {
			var req = new WriteWrap();
			req.async = false;
			switch (args[0]) {
			case 'writeUtf8String':
				handle.writeUtf8String(req, args[1]);
				break;
			case 'writeBinaryString':
				handle.writeBinaryString(req, args[1]);
				break;
			case 'writeBuffer':
				handle.writeBuffer(req, args[1]);
				break;
			case 'writeAsciiString':
				handle.writeAsciiString(req, args[1]);
				break;
			case 'writeUcs2String':
				handle.writeUcs2String(req, args[1]);
				break;
			case 'writev':
				handle.writev(req, args[1]);
				break;
			}
			if (!req.async) {
				callback(0);
			}
			else {
				req.oncomplete = function(status, self, req, err) {
					callback(status, err);
				};
			}
			return;
		}
		if (func === 'connect') {
			var req = new TCPConnectWrap();
			req.oncomplete = function(status, self, req, readable, writable) {
				callback(status, readable, writable);
			};
			handle.connect(req, args[0], args[1]);
			return;
		}
		if (func === 'connect6') {
			var req = new TCPConnectWrap();
			req.oncomplete = function(status, self, req, readable, writable) {
				callback(status, readable, writable);
			};
			handle.connect6(req, args[0], args[1]);
			return;
		}
		if (func === 'close') {
			handle.close(callback);
			return;
		}
		if (func === 'shutdown') {
			var req = new ShutdownWrap();
			req.oncomplete = function(status, self, req) {
				callback(status);
			};
			handle.shutdown(req);
			return;
		}
		console.log("[unhandled] TCP asyncIO: " + func);
	};
}

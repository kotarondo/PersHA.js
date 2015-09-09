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
};

function open(name, args, callback) {
	if (name === 'TCP') {
		return new TCPPort(null, callback);
	}
	console.log("[unhandled] tcp_wrap open:" + name + ": " + args);
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
	var restarted;
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

	this.open = function(name, args, callback) {
		if (name === 'accept') {
			var h = queue.shift();
			return new TCPPort(h, callback);
		}
		console.log("[unhandled] TCPPort open:" + name + ": " + args);
	}

	this.syncIO = function(name, args) {
		if (name === 'readStart') {
			return handle.readStart();
		}
		if (name === 'readStop') {
			return handle.readStop();
		}
		if (name === 'ref') {
			return handle.ref();
		}
		if (name === 'unref') {
			return handle.unref();
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
		if (name === 'getsockname') {
			var res = {
				out : {}
			};
			res.err = handle.getsockname(res.out);
			return res;
		}
		if (name === 'getpeername') {
			var res = {
				out : {}
			};
			res.err = handle.getsockname(res.out);
			return res;
		}
		if (name === 'setNoDelay') {
			return handle.setNoDelay.apply(handle, args);
		}
		if (name === 'setKeepAlive') {
			return handle.setKeepAlive.apply(handle, args);
		}
		if (name === 'restarted') {
			if (restarted) {
				return;
			}
			restarted = true;
			var unref = args[0];
			var bindArgs = args[1];
			var bind6Args = args[2];
			var listenArgs = args[3];
			if (bindArgs) {
				handle.bind.apply(handle, bindArgs);
			}
			if (bind6Args) {
				handle.bind6.apply(handle, bind6Args);
			}
			if (listenArgs) {
				handle.listen.apply(handle, listenArgs);
			}
			if (unref) {
				handle.unref();
			}
			return;
		}
		console.log("[unhandled] TCP syncIO:" + name + ": " + args);
	};

	this.asyncIO = function(name, args, callback) {
		if (name === 'write') {
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
		if (name === 'connect') {
			var req = new TCPConnectWrap();
			req.oncomplete = function(status, self, req, readable, writable) {
				callback(status, readable, writable);
			};
			handle.connect(req, args[0], args[1]);
			return;
		}
		if (name === 'connect6') {
			var req = new TCPConnectWrap();
			req.oncomplete = function(status, self, req, readable, writable) {
				callback(status, readable, writable);
			};
			handle.connect6(req, args[0], args[1]);
			return;
		}
		if (name === 'close') {
			handle.close(callback);
			return;
		}
		if (name === 'shutdown') {
			var req = new ShutdownWrap();
			req.oncomplete = function(status, self, req) {
				callback(status);
			};
			handle.shutdown(req);
			return;
		}
		console.log("[unhandled] TCP asyncIO:" + name + ": " + args);
	};
}

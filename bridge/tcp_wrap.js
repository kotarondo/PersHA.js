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

var binding = process.binding('tcp_wrap');
var basePort = new IOPort('tcp_wrap');

binding.TCPConnectWrap = function() {
	this.domain = process.domain;
};

binding.TCP = TCP;

function TCP() {
	var self = this;
	self.writeQueueSize = 0;
	self._state = {};
	self._port = basePort.open('TCP', function(event, args) {
		if (event instanceof IOPortError) {
			if (event.message === 'restart') {
				args.asyncIO('restart', [ self._state ]);
			}
			return;
		}
		if (event === 'onconnection') {
			var err = args[0];
			if (!err) {
				var tcp = new AcceptTCP(self._port);
			}
			self.onconnection(err, tcp);
			return;
		}
		self[event].apply(self, args);
	});
}

function AcceptTCP(port) {
	var self = this;
	self.writeQueueSize = 0;
	self._state = {};
	self._port = port.open('accept', function(event, args) {
		if (event instanceof IOPortError) {
			return;
		}
		self[event].apply(self, args);
	});
}

AcceptTCP.prototype = TCP.prototype;

TCP.prototype.close = function(callback) {
	var self = this;
	self._port.asyncIO('close', [], function() {
		self._port.close();
		if (callback) {
			callback();
		}
	});
};

TCP.prototype.ref = function() {
	this._port.syncIO('ref', []);
	this._state.unref = false;
};

TCP.prototype.unref = function() {
	this._port.syncIO('unref', []);
	this._state.unref = true;
};

TCP.prototype.readStart = function() {
	return this._port.syncIO('readStart', []);
};

TCP.prototype.readStop = function() {
	return this._port.syncIO('readStop', []);
};

TCP.prototype.open = function(fd) {
	throw new Error("not implemented");
};

TCP.prototype.listen = function() {
	var err = this._port.syncIO('listen', arguments);
	if (!err) {
		this._state.listenArgs = arguments;
	}
	return err;
};

TCP.prototype.bind = function() {
	var err = this._port.syncIO('bind', arguments);
	if (!err) {
		this._state.bindArgs = arguments;
	}
	return err;
};

TCP.prototype.bind6 = function() {
	var err = this._port.syncIO('bind6', arguments);
	if (!err) {
		this._state.bind6Args = arguments;
	}
	return err;
};

TCP.prototype.connect = function(req, address, port) {
	var self = this;
	self._port.asyncIO('connect', [ address, port ], function(status, readable, writable) {
		if (status instanceof IOPortError) {
			status = -1;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, readable, writable);
		});
	});
	return 0;
};

TCP.prototype.connect6 = function(req, address, port) {
	var self = this;
	self._port.asyncIO('connect6', [ address, port ], function(status, readable, writable) {
		if (status instanceof IOPortError) {
			status = -1;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, readable, writable);
		});
	});
	return 0;
};

TCP.prototype.shutdown = function(req) {
	var self = this;
	self._port.asyncIO('shutdown', [], function(status) {
		if (status instanceof IOPortError) {
			status = -1;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req);
		});
	});
	return 0;
};

TCP.prototype.getsockname = function(out) {
	var res = this._port.syncIO('getsockname', []);
	for ( var n in res.out) {
		out[n] = res.out[n];
	}
	return res.err;
};

TCP.prototype.getpeername = function(out) {
	var res = this._port.syncIO('getpeername', []);
	for ( var n in res.out) {
		out[n] = res.out[n];
	}
	return res.err;
};

TCP.prototype.setNoDelay = function() {
	return this._port.syncIO('setNoDelay', arguments);
};

TCP.prototype.setKeepAlive = function() {
	return this._port.syncIO('setKeepAlive', arguments);
};

function writeCall(self, req, func, data) {
	var ret = self._port.syncIO('write', [ func, data ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, err);
		});
	});
	req.async = ret.async;
	req.bytes = ret.bytes;
	return ret.err;
};

TCP.prototype.writeBuffer = function(req, data) {
	return writeCall(this, req, 'writeBuffer', data);
};

TCP.prototype.writeAsciiString = function(req, data) {
	return writeCall(this, req, 'writeAsciiString', data);
};

TCP.prototype.writeUtf8String = function(req, data) {
	return writeCall(this, req, 'writeUtf8String', data);
};

TCP.prototype.writeUcs2String = function() {
	return writeCall(this, req, 'writeUcs2String', data);
};

TCP.prototype.writeBinaryString = function(req, data) {
	return writeCall(this, req, 'writeBinaryString', data);
};

TCP.prototype.writev = function(req, chunks) {
	return writeCall(this, req, 'writev', chunks);
};

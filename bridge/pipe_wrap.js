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

var binding = process.binding('pipe_wrap');
var basePort = new IOPort('pipe_wrap');

binding.PipeConnectWrap = function() {
	this.domain = process.domain;
};

binding.Pipe = Pipe;

function Pipe() {
	var self = this;
	self.writeQueueSize = 0;
	self._state = {};
	self._port = basePort.open('Pipe', function(event, args) {
		if (event instanceof IOPortError) {
			if (event.message === 'restart') {
				args.asyncIO('restart', [ self._state ]);
			}
			return;
		}
		if (event === 'onconnection') {
			var err = args[0];
			if (!err) {
				var tcp = new AcceptPipe(self._port);
			}
			self.onconnection(err, tcp);
			return;
		}
		self[event].apply(self, args);
	});
}

function AcceptPipe(port) {
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

AcceptPipe.prototype = Pipe.prototype;

Pipe.prototype.close = function(callback) {
	var self = this;
	self._port.asyncIO('close', [], function() {
		self._port.close();
		if (callback) {
			callback();
		}
	});
};

Pipe.prototype.ref = function() {
	this._port.syncIO('ref', []);
	this._state.unref = false;
};

Pipe.prototype.unref = function() {
	this._port.syncIO('unref', []);
	this._state.unref = true;
};

Pipe.prototype.readStart = function() {
	return this._port.syncIO('readStart', []);
};

Pipe.prototype.readStop = function() {
	return this._port.syncIO('readStop', []);
};

Pipe.prototype.open = function(fd) {
	if (0 <= fd && fd <= 2) {
		this._port.asyncIO('open', [ fd ]);
		this._state.fd = fd;
		return;
	}
	throw new Error("not implemented");
};

Pipe.prototype.setBlocking = function(blocking) {
	return this._port.syncIO('setBlocking', [ blocking ]);
};

Pipe.prototype.listen = function() {
	var err = this._port.syncIO('listen', arguments);
	if (!err) {
		this._state.listenArgs = arguments;
	}
	return err;
};

Pipe.prototype.bind = function() {
	var err = this._port.syncIO('bind', arguments);
	if (!err) {
		this._state.bindArgs = arguments;
	}
	return err;
};

Pipe.prototype.connect = function(req, address) {
	var self = this;
	self._port.asyncIO('connect', [ address ], function(status, readable, writable) {
		if (status instanceof IOPortError) {
			status = -1;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, readable, writable);
		});
	});
	return 0;
};

Pipe.prototype.shutdown = function(req) {
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

function writeCall(self, req, func, data) {
	req.async = true;
	self._port.asyncIO('write', [ func, data ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, err);
		});
	});
	//TODO req.bytes
	return 0;
};

Pipe.prototype.writeBuffer = function(req, data) {
	return writeCall(this, req, 'writeBuffer', data);
};

Pipe.prototype.writeAsciiString = function(req, data) {
	return writeCall(this, req, 'writeAsciiString', data);
};

Pipe.prototype.writeUtf8String = function(req, data) {
	return writeCall(this, req, 'writeUtf8String', data);
};

Pipe.prototype.writeUcs2String = function() {
	return writeCall(this, req, 'writeUcs2String', data);
};

Pipe.prototype.writeBinaryString = function(req, data) {
	return writeCall(this, req, 'writeBinaryString', data);
};

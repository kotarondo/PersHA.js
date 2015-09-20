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

var binding = process.binding('tty_wrap');
var basePort = new IOPort('tty_wrap');

binding.guessHandleType = function(fd) {
	return basePort.syncIO('guessHandleType', arguments);
};

binding.isTTY = function(fd) {
	return basePort.syncIO('isTTY', arguments);
};

binding.TTY = TTY;

function TTY(fd, flag) {
	var self = this;
	self.writeQueueSize = 0;
	self._state = {
		fd : fd,
		flag : flag
	};
	self._port = basePort.open('TTY', function(event, args) {
		if (event instanceof IOPortError) {
			if (event.message === 'restart') {
				args.asyncIO('restart', [ self._state ]);
			}
			return;
		}
		self[event].apply(self, args);
	});
}

TTY.prototype.close = function() {
	this._port.asyncIO('close', arguments);
	this._port.close();
};

TTY.prototype.ref = function() {
	this._port.asyncIO('ref', arguments);
	this._state.unref = false;
};

TTY.prototype.unref = function() {
	this._port.asyncIO('unref', arguments);
	this._state.unref = true;
};

TTY.prototype.readStart = function() {
	this._port.asyncIO('readStart', arguments);
	this._state.reading = true;
};

TTY.prototype.readStop = function() {
	this._port.asyncIO('readStop', arguments);
	this._state.reading = false;
};

TTY.prototype.setRawMode = function(mode) {
	this._port.asyncIO('setRawMode', [ mode ]);
	this._state.rawMode = mode;
};

function writeCall(self, req, func, data) {
	try {
		var ret = self._port.syncIO('write', [ func, data ], function(status, err, writeQueueSize) {
			if (status instanceof IOPortError) {
				writeQueueSize = 0;
				status = 0;
			}
			self.writeQueueSize = writeQueueSize;
			process._MakeCallback(req.domain, function() {
				req.oncomplete(status, self, req, err);
			});
		});
	} catch (e) {
		if (!e.immediateCallback) {
			throw e;
		}
		ret = e;
	}
	req.async = ret.async;
	req.bytes = ret.bytes;
	self.writeQueueSize = ret.writeQueueSize;
	return ret.err;
};

TTY.prototype.writeBuffer = function(req, data) {
	return writeCall(this, req, 'writeBuffer', data);
};

TTY.prototype.writeAsciiString = function(req, data) {
	return writeCall(this, req, 'writeAsciiString', data);
};

TTY.prototype.writeUtf8String = function(req, data) {
	return writeCall(this, req, 'writeUtf8String', data);
};

TTY.prototype.writeUcs2String = function(req, data) {
	return writeCall(this, req, 'writeUcs2String', data);
};

TTY.prototype.writeBinaryString = function(req, data) {
	return writeCall(this, req, 'writeBinaryString', data);
};

TTY.prototype.getWindowSize = function(winSize) {
	try {
		var ws = this._port.syncIO('getWindowSize');
		winSize[0] = ws[0];
		winSize[1] = ws[1];
	} catch (e) {
		return e;
	}
};

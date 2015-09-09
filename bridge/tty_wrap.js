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
var ttyPort = new IOPort('tty_wrap');

binding.guessHandleType = function(fd) {
	return ttyPort.syncIO('guessHandleType', arguments);
};

binding.isTTY = function(fd) {
	return ttyPort.syncIO('isTTY', arguments);
};

binding.TTY = TTY;

function TTY() {
	var self = this;
	self._port = ttyPort.open('TTY', arguments, portEventCallback, true);

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			if (name.message === 'restart') {
				self._port.syncIO('restart', [ self._unref, self._reading, self._rawMode ]);
			}
			return;
		}
		self[name].apply(self, args);
	}
}

TTY.prototype.setRawMode = function(mode) {
	var self = this;
	self._port.syncIO('setRawMode', [ mode ]);
	rawMode = mode;
};

TTY.prototype.close = function() {
	var self = this;
	self._port.syncIO('close', arguments);
	self._port.close();
};

TTY.prototype.ref = function() {
	var self = this;
	self._port.syncIO('ref', arguments);
	self._unref = false;
};

TTY.prototype.unref = function() {
	var self = this;
	self._port.syncIO('unref', arguments);
	self._unref = true;
};

TTY.prototype.readStart = function() {
	var self = this;
	self._port.syncIO('readStart', arguments);
	self._reading = true;
};

TTY.prototype.readStop = function() {
	var self = this;
	self._port.syncIO('readStop', arguments);
	self._reading = false;
};

TTY.prototype.writeBuffer = function(req, data) {
	var self = this;
	self._port.asyncIO('write', [ 'writeBuffer', data ], function(status, err) {
		if (status instanceof IOPortError) {
			status = 0;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, err);
		});
	});
};

TTY.prototype.writeAsciiString = function(req, data) {
	var self = this;
	self._port.asyncIO('write', [ 'writeAsciiString', data ], function(status, err) {
		if (status instanceof IOPortError) {
			status = 0;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, err);
		});
	});
};

TTY.prototype.writeUtf8String = function(req, data) {
	var self = this;
	self._port.asyncIO('write', [ 'writeUtf8String', data ], function(status, err) {
		if (status instanceof IOPortError) {
			status = 0;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, err);
		});
	});
};

TTY.prototype.writeUcs2String = function(req, data) {
	var self = this;
	self._port.asyncIO('write', [ 'writeUcs2String', data ], function(status, err) {
		if (status instanceof IOPortError) {
			status = 0;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, err);
		});
	});
};

TTY.prototype.writeBinaryString = function(req, data) {
	var self = this;
	self._port.asyncIO('write', [ 'writeBinaryString', data ], function(status, err) {
		if (status instanceof IOPortError) {
			status = 0;
		}
		process._MakeCallback(req.domain, function() {
			req.oncomplete(status, self, req, err);
		});
	});
};

TTY.prototype.getWindowSize = function(winSize) {
	var self = this;
	var ws = self._port.syncIO('getWindowSize');
	winSize[0] = ws[0];
	winSize[1] = ws[1];
};

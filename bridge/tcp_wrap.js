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

var tcp = process.binding('tcp_wrap');
var tcpPort = new IOPort('tcp_wrap');

tcp.TCPConnectWrap = TCPConnectWrap;
tcp.TCP = TCP;

function TCPConnectWrap() {
};

function TCP() {
	var self = this;
	self._port = tcpPort.open('TCP', [], portEventCallback);

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			if (name.message === 'restart') {
				if (self._listenArgs) { // restart server automatically
					self._port = tcpPort.open('TCP', [], portEventCallback);
					if (self._bindArgs) {
						self._port.syncIO('bind', self._bindArgs);
					}
					else if (self._bind6Args) {
						self._port.syncIO('bind6', self._bind6Args);
					}
					self._port.syncIO('listen', self._listenArgs);
				}
			}
			return;
		}
		if (name === 'onconnection') {
			var err = args[0];
			if (!err) {
				var handle = new accept(self._port);
			}
			self.onconnection(err, handle);
			return;
		}
		self[name].apply(self, args);
	}
}

function accept(port) {
	var self = this;
	self._port = port.open('accept', [], portEventCallback);

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
}

accept.prototype = TCP.prototype;

TCP.prototype.connect = function(req, address, port) {
	var self = this;
	self._port.asyncIO('connect', [ address, port ], function(status, readable, writable) {
		if (status instanceof IOPortError) {
			//TODO
		}
		req.oncomplete(status, self, req, readable, writable);
	});
};

TCP.prototype.readStart = function() {
	var self = this;
	return self._port.syncIO('readStart', arguments);
};

TCP.prototype.close = function(callback) {
	var self = this;
	self._port.close();
	if (callback === undefined) {
		return self._port.syncIO('close');
	}
	else {
		self._port.asyncIO('close', null, callback);
	}
};

TCP.prototype.ref = function() {
	process._debug("[unhandled1] TCP.prototype.ref");
};

TCP.prototype.unref = function() {
	process._debug("[unhandled1] TCP.prototype.unref");
};

TCP.prototype.readStop = function() {
	process._debug("[unhandled1] TCP.prototype.readStop ");
};

TCP.prototype.shutdown = function() {
	process._debug("[unhandled1] TCP.prototype.shutdown ");
};

TCP.prototype.writeBuffer = function() {
	process._debug("[unhandled1] TCP.prototype.writeBuffer ");
};

TCP.prototype.writeAsciiString = function() {
	process._debug("[unhandled1] TCP.prototype.writeAsciiString ");
};

TCP.prototype.writeUtf8String = function(req, data) {
	var self = this;
	self._port.asyncIO('writeUtf8String', [ data ], function(status, err) {
		if (status instanceof IOPortError) {
			//TODO
		}
		req.oncomplete(status, self, req, err);
	});
};

TCP.prototype.writeUcs2String = function() {
	process._debug("[unhandled1] TCP.prototype.writeUcs2String ");
};

TCP.prototype.writev = function(req, chunks) {
	var self = this;
	self._port.asyncIO('writev', [ chunks ], function(status, err) {
		if (status instanceof IOPortError) {
			//TODO
		}
		req.oncomplete(status, self, req, err);
	});
};

TCP.prototype.writeBinaryString = function(req, data) {
	var self = this;
	self._port.asyncIO('writeBinaryString', [ data ], function(status, err) {
		if (status instanceof IOPortError) {
			//TODO
		}
		req.oncomplete(status, self, req, err);
	});
};

TCP.prototype.open = function() {
	process._debug("[unhandled1] TCP.prototype.open ");
};

TCP.prototype.listen = function() {
	var self = this;
	var err = self._port.syncIO('listen', arguments);
	if (!err) {
		self._listenArgs = arguments;
	}
	return err;
};

TCP.prototype.connect = function() {
	process._debug("[unhandled1] TCP.prototype.connect ");
};

TCP.prototype.bind = function() {
	var self = this;
	var err = self._port.syncIO('bind', arguments);
	if (!err) {
		self._bindArgs = arguments;
	}
	return err;
};

TCP.prototype.bind6 = function() {
	var self = this;
	var err = self._port.syncIO('bind6', arguments);
	if (!err) {
		self._bind6Args = arguments;
	}
	return err;
};

TCP.prototype.connect6 = function() {
	process._debug("[unhandled1] TCP.prototype.connect6 ");
};

TCP.prototype.getsockname = function() {
	process._debug("[unhandled1] TCP.prototype.getsockname ");
};

TCP.prototype.getpeername = function() {
	process._debug("[unhandled1] TCP.prototype.getpeername ");
};

TCP.prototype.setNoDelay = function() {
	process._debug("[unhandled1] TCP.prototype.setNoDelay ");
};

TCP.prototype.setKeepAlive = function() {
	process._debug("[unhandled1] TCP.prototype.setKeepAlive ");
};

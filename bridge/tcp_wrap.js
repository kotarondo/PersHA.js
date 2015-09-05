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
	self.writeQueueSize = 0;

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			if (name.message === 'restart') {
				if (self._listenArgs) {
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
				var handle = new AcceptTCP(self._port);
			}
			self.onconnection(err, handle);
			return;
		}
		self[name].apply(self, args);
	}
}

function AcceptTCP(port) {
	var self = this;
	self._port = port.open('accept', [], portEventCallback);
	self.writeQueueSize = 0;

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
}

AcceptTCP.prototype = TCP.prototype;

function nop() {
};

TCP.prototype.close = function(callback) {
	var self = this;
	self._port.close();
	if (callback === undefined) {
		callback = nop;
	}
	self._port.asyncIO('close', [], callback);
};

TCP.prototype.ref = function() {
	var self = this;
	return self._port.syncIO('ref', []);
};

TCP.prototype.unref = function() {
	var self = this;
	return self._port.syncIO('unref', []);
};

TCP.prototype.readStart = function() {
	var self = this;
	return self._port.syncIO('readStart', []);
};

TCP.prototype.readStop = function() {
	var self = this;
	return self._port.syncIO('readStop', []);
};

TCP.prototype.shutdown = function(req) {
	var self = this;
	self._port.asyncIO('shutdown', [], function(status) {
		if (status instanceof IOPortError) {
			status = -1;
		}
		req.oncomplete(status, self, req);
	});
	return 0;
};

TCP.prototype.writeBuffer = function(req, data) {
	var self = this;
	req.async = true;
	self._port.asyncIO('write', [ 'writeBuffer', data ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		req.oncomplete(status, self, req, err);
	});
	return 0;
};

TCP.prototype.writeAsciiString = function(req, data) {
	var self = this;
	req.async = true;
	self._port.asyncIO('write', [ 'writeAsciiString', data ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		req.oncomplete(status, self, req, err);
	});
	return 0;
};

TCP.prototype.writeUtf8String = function(req, data) {
	var self = this;
	req.async = true;
	self._port.asyncIO('write', [ 'writeUtf8String', data ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		req.oncomplete(status, self, req, err);
	});
	return 0;
};

TCP.prototype.writeUcs2String = function() {
	var self = this;
	req.async = true;
	self._port.asyncIO('write', [ 'writeUcs2String', data ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		req.oncomplete(status, self, req, err);
	});
	return 0;
};

TCP.prototype.writev = function(req, chunks) {
	var self = this;
	req.async = true;
	self._port.asyncIO('write', [ 'writev', chunks ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		req.oncomplete(status, self, req, err);
	});
	return 0;
};

TCP.prototype.writeBinaryString = function(req, data) {
	var self = this;
	req.async = true;
	self._port.asyncIO('write', [ 'writeBinaryString', data ], function(status, err) {
		if (status instanceof IOPortError) {
			err = status.message;
			status = -1;
		}
		req.oncomplete(status, self, req, err);
	});
	return 0;
};

TCP.prototype.open = function(fd) {
	throw new Error("[unhandled] TCP.prototype.open");
};

TCP.prototype.listen = function() {
	var self = this;
	var err = self._port.syncIO('listen', arguments);
	if (!err) {
		self._listenArgs = arguments;
	}
	return err;
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

TCP.prototype.connect = function(req, address, port) {
	var self = this;
	self._port.asyncIO('connect', [ address, port ], function(status, readable, writable) {
		if (status instanceof IOPortError) {
			status = -1;
		}
		req.oncomplete(status, self, req, readable, writable);
	});
	return 0;
};

TCP.prototype.connect6 = function(req, address, port) {
	var self = this;
	self._port.asyncIO('connect6', [ address, port ], function(status, readable, writable) {
		if (status instanceof IOPortError) {
			status = -1;
		}
		req.oncomplete(status, self, req, readable, writable);
	});
	return 0;
};

TCP.prototype.getsockname = function(out) {
	var self = this;
	var res = self._port.syncIO('getsockname', []);
	for ( var n in res.out) {
		out[n] = res.out[n];
	}
	return res.err;
};

TCP.prototype.getpeername = function(out) {
	var self = this;
	var res = self._port.syncIO('getpeername', []);
	for ( var n in res.out) {
		out[n] = res.out[n];
	}
	return res.err;
};

TCP.prototype.setNoDelay = function() {
	var self = this;
	return self._port.syncIO('setNoDelay', arguments);
};

TCP.prototype.setKeepAlive = function() {
	var self = this;
	return self._port.syncIO('setKeepAlive', arguments);
};

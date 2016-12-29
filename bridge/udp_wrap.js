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

var binding = process.binding('udp_wrap');
var basePort = new IOPort('udp_wrap');

binding.SendWrap = function() {
	this.domain = process.domain;
};

binding.UDP = UDP;

function UDP() {
	var self = this;
	self._state = {};
	self._port = basePort.open('UDP', function(event, args) {
		if (event instanceof IOPortError) {
			if (event.message === 'restart') {
				args.asyncIO('restart', [ self._state ]);
			}
			return;
		}
		if (event === 'onmessage') {
			var nread = args[0];
			var buf = args[1];
			var rinfo = args[2];
			self.onmessage(nread, self, buf, rinfo);
			return;
		}
		self[event].apply(self, args);
	});
}

UDP.prototype.close = function() {
	return this._port.syncIO('close', []);
};

UDP.prototype.ref = function() {
	this._port.syncIO('ref', []);
	this._state.unref = false;
};

UDP.prototype.unref = function() {
	this._port.syncIO('unref', []);
	this._state.unref = true;
};

UDP.prototype.recvStart = function() {
	return this._port.syncIO('recvStart', []);
};

UDP.prototype.recvStop = function() {
	return this._port.syncIO('recvStop', []);
};

UDP.prototype.bind = function() {
	var err = this._port.syncIO('bind', arguments);
	if (!err) {
		this._state.bindArgs = arguments;
	}
	return err;
};

UDP.prototype.bind6 = function() {
	var err = this._port.syncIO('bind6', arguments);
	if (!err) {
		this._state.bind6Args = arguments;
	}
	return err;
};

UDP.prototype.getsockname = function(out) {
	var res = this._port.syncIO('getsockname', []);
	for ( var n in res.out) {
		out[n] = res.out[n];
	}
	return res.err;
};

UDP.prototype.setBroadcast = function() {
	return this._port.syncIO('setBroadcast', arguments);
};

UDP.prototype.setTTL = function() {
	return this._port.syncIO('setTTL', arguments);
};

UDP.prototype.addMembership = function() {
	return this._port.syncIO('addMembership', arguments);
};

UDP.prototype.dropMembership = function() {
	return this._port.syncIO('dropMembership', arguments);
};

UDP.prototype.setMulticastTTL = function() {
	return this._port.syncIO('setMulticastTTL', arguments);
};

UDP.prototype.setMulticastLoopback = function() {
	return this._port.syncIO('setMulticastLoopback', arguments);
};

function sendCall(self, req, func, buffer, offset, length, port, ip) {
	var data = buffer.slice(offset, length - offset);
	self._port.asyncIO('send', [ func, data, port, ip ], function(err) {
		if (err instanceof IOPortError) {
			err = -1;
		}
		if (req.oncomplete) {
			process._MakeCallback(req.domain, function() {
				req.oncomplete(err);
			});
		}
	});
	return 0;
};

UDP.prototype.send = function(req, buffer, offset, length, port, ip, isCallback) {
	return sendCall(this, req, 'send', buffer, offset, length, port, ip);
};

UDP.prototype.send6 = function(req, buffer, offset, length, port, ip, isCallback) {
	return sendCall(this, req, 'send6', buffer, offset, length, port, ip);
};

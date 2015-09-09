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

var binding = process.binding('signal_wrap');
var signalPort = new IOPort('signal_wrap');

binding.Signal = Signal;

function Signal() {
	var self = this;
	self._port = signalPort.open('Signal', [], portEventCallback, true);

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			if (name.message === 'restart') {
				port.syncIO('restart', [ self._unref, self._signum ]);
			}
			return;
		}
		self[name].apply(self, args);
	}
}

Signal.prototype.close = function() {
	var self = this;
	self._port.syncIO('close', arguments);
	self._port.close();
};

Signal.prototype.ref = function() {
	var self = this;
	self._port.syncIO('ref', arguments);
	self._unref = false;
};

Signal.prototype.unref = function() {
	var self = this;
	self._port.syncIO('unref', arguments);
	self._unref = true;
};

Signal.prototype.start = function() {
	var self = this;
	var err = self._port.syncIO('start', arguments);
	if (!err) {
		self._signum = arguments[0];
	}
	return err;
};

Signal.prototype.stop = function() {
	var self = this;
	var err = self._port.syncIO('stop', arguments);
	if (!err) {
		self._signum = undefined;
	}
	return err;
};

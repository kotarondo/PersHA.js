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

var binding = process.binding('timer_wrap');
var basePort = new IOPort('timer_wrap');

binding.Timer = Timer;

Timer.now = function() {
	return basePort.syncIO('now', []);
};

function Timer() {
	var self = this;
	self._state = {};
	self._port = basePort.open('Timer', function(event, args) {
		if (event instanceof IOPortError) {
			if (event.message === 'restart') {
				args.asyncIO('restart', [ self._state ]);
			}
			return;
		}
		process._MakeCallback(self.domain, function() {
			self[event].apply(self, args);
		});
	});
}

Timer.prototype.close = function() {
	this._port.close();
	this._port.asyncIO('close', []);
};

Timer.prototype.ref = function() {
	this._port.asyncIO('ref', []);
	this._state.unref = false;
};

Timer.prototype.unref = function() {
	this._port.asyncIO('unref', []);
	this._state.unref = true;
};

Timer.prototype.start = function() {
	var err = this._port.syncIO('start', arguments);
	if (!err) {
		this._state.startArgs = arguments;
	}
	return err;
};

Timer.prototype.stop = function() {
	var err = this._port.syncIO('stop', []);
	if (!err) {
		this._state.startArgs = null;
	}
	return err;
};

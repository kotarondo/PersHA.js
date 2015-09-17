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

var binding = process.binding('timer_wrap');
var kOnTimeout = binding.Timer.kOnTimeout;

module.exports = {
	open : open,
	syncIO : syncIO,
};

function open(name, callback) {
	if (name === 'Timer') {
		return new TimerPort(callback);
	}
	console.log("[unhandled] timer_wrap open: " + name);
}

function syncIO(func, args) {
	if (func === 'now') {
		return binding.Timer.now();
	}
	console.log("[unhandled] timer_wrap syncIO: " + func);
}

function TimerPort(callback) {
	var handle = new binding.Timer();

	handle[kOnTimeout] = function() {
		var args = Array.prototype.slice.call(arguments);
		callback(kOnTimeout, args);
	};

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			var state = args[0];
			if (state.startArgs) {
				handle.start.apply(handle, state.startArgs);
			}
			if (state.unref) {
				handle.unref();
			}
			return;
		}
		return handle[func].apply(handle, args);
	};
}

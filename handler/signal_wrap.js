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

var signal = process.binding('signal_wrap');

module.exports = {
	open : open,
};

function open(name, args, callback) {
	if (name === 'Signal') {
		return new SignalPort(callback);
	}
	console.log("[unhandled] signal_wrap open:" + name);
}

function SignalPort(callback) {
	var Signal = process.binding('signal_wrap').Signal;

	var handle = new Signal();
	var restarted;

	handle.onsignal = function() {
		var args = Array.prototype.slice.call(arguments);
		callback('onsignal', args);
	};

	this.syncIO = function(name, args) {
		if (name === 'close') {
			return handle.close();
		}
		if (name === 'ref') {
			return handle.ref();
		}
		if (name === 'unref') {
			return handle.unref();
		}
		if (name === 'start') {
			return handle.start(args[0]);
		}
		if (name === 'stop') {
			return handle.stop();
		}
		if (name === 'restart') {
			if (restarted) {
				return;
			}
			restarted = true;
			var unref = args[0];
			var signum = args[1];
			if (signum >= 0) {
				handle.start(signum);
			}
			if (unref) {
				handle.unref();
			}
			return;
		}
		console.log("[unhandled] Signal syncIO:" + name);
	};
}

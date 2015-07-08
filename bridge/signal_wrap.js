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

var signal = process.binding('signal_wrap');
var signalPort = new IOPort('signal_wrap');

signal.Signal = Signal;

function Signal() {
	var self = this;
	var port = signalPort.open('Signal', [], portEventCallback);
	var signum;

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			port = signalPort.open('Signal', [], portEventCallback);
			if (signum) {
				port.syncIO('start', [ signum ]);
			}
			return;
		}
		self[name].apply(self, args);
	}

	this.close = function() {
		port.close();
		return port.syncIO('close', arguments);
	};

	this.ref = function() {
		return port.syncIO('ref', arguments);
	};

	this.unref = function() {
		return port.syncIO('unref', arguments);
	};

	this.start = function() {
		signum = arguments[0];
		return port.syncIO('start', [ signum ]);
	};

	this.stop = function() {
		signum = undefined;
		return port.syncIO('stop', arguments);
	};

}
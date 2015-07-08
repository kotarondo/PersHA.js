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

var tty = process.binding('tty_wrap');
var ttyPort = new IOPort('tty_wrap');

tty.guessHandleType = function(fd) {
	while (true) {
		try {
			return ttyPort.syncIO('guessHandleType', arguments);
		} catch (e) {
			if (e instanceof IOPortError) {
				if (e.message === 'restart') {
					continue;
				}
			}
			throw e;
		}
	}
};

tty.isTTY = function(fd) {
	return ttyPort.syncIO('isTTY', arguments);
};

tty.TTY = TTY;

function TTY(fd, flag) {
	var self = this;
	var port = ttyPort.open('TTY', arguments, portEventCallback);
	var reading;
	var rawMode;

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			if (name.message === 'restart') {
				if (0 <= fd && fd <= 2) {
					port = ttyPort.open('TTY', [ fd, flag ], portEventCallback);
					if (reading) {
						port.syncIO('readStart', []);
					}
					if (rawMode) {
						port.syncIO('setRawMode', [ rawMode ]);
					}
				}
			}
			return;
		}
		self[name].apply(self, args);
	}

	this.setRawMode = function() {
		rawMode = arguments[0] ? true : false;
		return port.syncIO('setRawMode', [ rawMode ]);
	};

	this.close = function() {
		port.close();
		return port.syncIO('close', arguments);
	};

	this.unref = function() {
		return port.syncIO('unref', arguments);
	};

	this.readStart = function() {
		reading = true;
		return port.syncIO('readStart', arguments);
	};

	this.readStop = function() {
		reading = false;
		return port.syncIO('readStop', arguments);
	};

	this.writeBuffer = function() {
		_debug("[unhandled] tty.writeBuffer " + new Error().stack);
	};

	this.writeAsciiString = function() {
		_debug("[unhandled] tty.writeAsciiString " + new Error().stack);
	};

	this.writeUtf8String = function(req, data) {
		port.asyncIO('writeUtf8String', [ data ], function(status, err) {
			if (status instanceof IOPortError) {
				//TODO
			}
			req.oncomplete(status, self, req, err);
		});
	};

	this.writeUcs2String = function() {
		_debug("[unhandled] tty.writeUcs2String " + new Error().stack);
	};

	this.writeBinaryString = function() {
		_debug("[unhandled] tty.writeBinaryString " + new Error().stack);
	};

	this.getWindowSize = function(winSize) {
		var ws = port.syncIO('getWindowSize');
		winSize[0] = ws[0];
		winSize[1] = ws[1];
	};

}
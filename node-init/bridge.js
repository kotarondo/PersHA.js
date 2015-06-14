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

Object.prototype.__defineGetter__ = function(n, f) {
	Object.defineProperty(this, n, {
		get : f
	});
};

var process = {
	execPath : ".",
	cwd : function() {
		return "."
	},
	argv : [ "node" ],
	env : {},
	_eval : null,
	_forceRepl : true,
	moduleLoadList : [],
};

process.debug = (function() {
	var debug = new IOPort('debug');
	return function(a) {
		debug.syncIO('debug', a);
	};
})();

process._setupNextTick = function(tickInfo, _tickCallback, _runMicrotasks) {
	tickInfo[0] = 0;
	tickInfo[1] = 0;
	function callbackNextTick() {
		process.debug("callbackNextTick ");
		if (tickInfo[0] < tickInfo[1]) {
			_tickCallback();
		}
	}
	_runMicrotasks.runMicrotasks = function() {
		process.debug("runMicrotasks ");
		callbackNextTick.scheduleAsMicrotask();
	};
	_runMicrotasks.runMicrotasks();
};

process._setupDomainUse = function(_domain, _domain_flag) {
	process.debug("_setupDomainUse");
}

process.binding = (function() {

	var contextify = {
		ContextifyScript : function(code, options) {
			this.runInThisContext = function() {
				process.debug("runInThisContext " + options.filename);
				return evaluateProgram(code, options.filename);
			};
		},
	};

	var natives = {};
	natives.config = "\n{}";

	var fsPort = new IOPort('fs');

	var fs = {
		FSInitialize : function() {
		},

		FSReqWrap : function() {
			return {};
		},

		writeBuffer : function(fd, buffer, offset, length, position, req) {
			process.debug("binding[fs] writeBuffer ");
			if (req === undefined) {
				while (true) {
					var result = fsPort.syncIO('writeBuffer', fd, buffer, offset, length, position);
					if (result.error) {
						if (fd === 1 || fd === 2) {
							if (result.error === 'restart') {
								continue;
							}
							if (result.error === 'offline') {
								return length;
							}
						}
						throw new Error(result.error);
					}
					return result.transferred;
				}

			}
			else {
				(function retry() {
					fsPort.asyncIO("writeBuffer", fd, buffer, offset, length, position, function(result) {
						if (result.error) {
							if (fd === 1 || fd === 2) {
								if (result.error === 'restart') {
									retry();
									return;
								}
								if (result.error === 'offline') {
									req.oncomplete(undefined, length);
									return;
								}
							}
							req.oncomplete(new Error(result.error), 0);
							return;
						}
						req.oncomplete(undefined, result.transferred);
					});
				})();
			}
		},

		read : function(fd, buffer, offset, length, position, req) {
			process.debug("binding[fs] read ");
			if (req === undefined) {
				while (true) {
					var result = fsPort.syncIO('readBuffer', fd, length, position);
					if (result.error) {
						if (fd === 0) {
							if (result.error === 'restart') {
								continue;
							}
						}
						throw new Error(result.error);
					}
					result.buffer.copy(buffer, offset, 0, result.transferred);
					return result.transferred;
				}
			}
			else {
				(function retry() {
					fsPort.asyncIO("readBuffer", fd, length, position, function(result) {
						if (result.error) {
							if (fd === 0) {
								if (result.error === 'restart') {
									process.debug("binding[fs] read error restart retry");
									retry();
									return;
								}
							}
							process.debug("binding[fs] read error " + result.error);
							req.oncomplete(new Error(result.error), 0);
							return;
						}
						if (result.transferred === 0) {
							retry();
							return;
						}
						result.buffer.copy(buffer, offset, 0, result.transferred);
						req.oncomplete(undefined, result.transferred);
					});
				})();
			}
		},

		writeString : function(fd, buffer, offset, length, position, req) {
			process.debug("binding[fs] writeString TODO ");
		},
	};

	var smalloc = {};

	var constants = {};

	var tty_wrap = {
		guessHandleType : function(fd) {
			return 'FILE';
		},
	};

	return function(name) {
		if (name === 'contextify') {
			return contextify;
		}
		if (name === 'natives') {
			return natives;
		}
		if (name === 'fs') {
			return fs;
		}
		if (name === 'smalloc') {
			return smalloc;
		}
		if (name === 'constants') {
			return constants;
		}
		if (name === 'tty_wrap') {
			return tty_wrap;
		}
	};
})();

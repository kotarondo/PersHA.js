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

Object.prototype.__defineGetter__ = function(n, getter) {
	Object.defineProperty(this, n, {
		get : getter
	});
};

var process = {
	execPath : ".",
	cwd : function() {
		return "."
	},
	argv : [ "node" ],
	env : {
		NODE_DEBUG : "module",
	},
	_eval : null,
	_forceRepl : true,
	moduleLoadList : [],
};

process.debug = (function() {
	var debug = new IOPort('debug');
	return function(a) {
		try{
		debug.syncIO('debug', a);
		}catch(e){}
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
				//process.debug("runInThisContext " + options.filename + " " + new Error().stack);
				process.debug("runInThisContext " + options.filename);
				return evaluateProgram(code, options.filename);
			};
		},
	};

	var natives = {};
	natives.config = "\n{}";

	var smalloc = {};

	var constants = {};

	var tty_wrap = {
		guessHandleType : function(fd) {
			return 'FILE';
		},
		isTTY : function(fd) {
			return false;
		},
	};

	var fsPort = new IOPort('fs');

	var fs = {
		FSInitialize : function() {
		},

		FSReqWrap : function() {
			return {};
		},

		StatWatcher : function() {
			process.debug("binding[fs] StatWatcher ");
		},
		access : function() {
			process.debug("binding[fs] access ");
		},
		chmod : function() {
			process.debug("binding[fs] chmod ");
		},
		chown : function() {
			process.debug("binding[fs] chown ");
		},
		close : function() {
			process.debug("binding[fs] close ");
		},
		fchmod : function() {
			process.debug("binding[fs] fchmod ");
		},
		fchown : function() {
			process.debug("binding[fs] fchown ");
		},
		fdatasync : function() {
			process.debug("binding[fs] fdatasync ");
		},
		fstat : function() {
			process.debug("binding[fs] fstat ");
		},
		fsync : function() {
			process.debug("binding[fs] fsync ");
		},
		ftruncate : function() {
			process.debug("binding[fs] ftruncate ");
		},
		futimes : function() {
			process.debug("binding[fs] futimes ");
		},
		link : function() {
			process.debug("binding[fs] link ");
		},
		lstat : function() {
			process.debug("binding[fs] lstat ");
		},
		mkdir : function() {
			process.debug("binding[fs] mkdir ");
		},
		open : function() {
			process.debug("binding[fs] open ");
		},
		readdir : function() {
			process.debug("binding[fs] readdir ");
		},
		readlink : function() {
			process.debug("binding[fs] readlink ");
		},
		rename : function() {
			process.debug("binding[fs] rename ");
		},
		rmdir : function() {
			process.debug("binding[fs] rmdir ");
		},
		stat : function(path, req) {
			process.debug("binding[fs] stat " + path);
			if (req === undefined) {
				while (true) {
					try {
						return fsPort.syncIO('stat', path);
					} catch (err) {
						if (err instanceof IOPortError && err.message==='restart') {
							continue;
						}
						throw err;
					}
				}
			}
			else {
				(function retry() {
					fsPort.asyncIO("stat", path, function(err, stats) {
						if (err instanceof IOPortError && err.message==='restart') {
							retry();
							return;
						}
						req.oncomplete(err, stats);
					});
				})();
			}
		},

		symlink : function() {
			process.debug("binding[fs] symlink ");
		},
		unlink : function() {
			process.debug("binding[fs] unlink ");
		},
		utimes : function() {
			process.debug("binding[fs] utimes ");
		},

		writeBuffer : function(fd, buffer, offset, length, position, req) {
			//process.debug("binding[fs] writeBuffer ");
			if (req === undefined) {
				while (true) {
					try {
						return fsPort.syncIO('writeBuffer', fd, buffer, offset, length, position);
					} catch (err) {
						if (err instanceof IOPortError && err.message==='restart') {
							if (fd === 1 || fd === 2) {
								continue;
							}
						}
						if (err instanceof IOPortError && err.message==='offline') {
							return 0;
						}
						throw err;
					}
				}
			}
			else {
				(function retry() {
					fsPort.asyncIO("writeBuffer", fd, buffer, offset, length, position, function(err, transferred) {
						if (err instanceof IOPortError && err.message==='restart') {
							if (fd === 1 || fd === 2) {
								retry();
								return;
							}
						}
						req.oncomplete(err, transferred);
					});
				})();
			}
		},

		read : function(fd, buffer, offset, length, position, req) {
			//process.debug("binding[fs] read " + new Error().stack);
			//process.debug("binding[fs] read ");
			if (req === undefined) {
				while (true) {
					try {
						var b = fsPort.syncIO('readBuffer', fd, length, position);
						b.copy(buffer, offset, 0, b.length);
						return b.length;
					} catch (err) {
						if (err instanceof IOPortError && err.message==='restart') {
							if (fd === 0) {
								buffer[0] = 0x0a;
								return 1;
							}
						}
						throw err;
					}
				}
			}
			else {
				(function retry() {
					fsPort.asyncIO("readBuffer", fd, length, position, function(err, b) {
						if (err instanceof IOPortError && err.message==='restart') {
							if (fd === 0) {
								process.debug("binding[fs] read error restart retry");
								buffer[0] = 0x0a;
								req.oncomplete(undefined, 1);
								return;
							}
							process.debug("binding[fs] read error " + err);
							req.oncomplete(err, undefined);
							return;
						}
						if (b.length === 0) {
							process.debug("binding[fs] read retry transferred=0");
							buffer[0] = 0x0a;
							req.oncomplete(undefined, 1);
							return;
						}
						b.copy(buffer, offset, 0, b.length);
						req.oncomplete(undefined, b.length);
					});
				})();
			}
		},

		writeString : function(fd, buffer, offset, length, position, req) {
			process.debug("binding[fs] writeString TODO ");
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

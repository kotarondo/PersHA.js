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

Number.isFinite = Number.isFinite || function(value) {
	return typeof value === "number" && isFinite(value);
}

var process = {
	execPath : '.',
	cwd : function() {
		return '.'
	},
	argv : [ 'node' ],
	env : {
		NODE_DEBUG : "module,net,dns",
	},
	_eval : null,
	_forceRepl : true,
	moduleLoadList : [],
};

process.reallyExit = function() {
	throw new Error("the process is really exiting");
}

process.debug = (function() {
	var debug = new IOPort('debug');
	return function(a) {
		try {
			debug.syncIO('debug', a);
		} catch (e) {
		}
	};
})();

process._setupNextTick = function(tickInfo, _tickCallback, _runMicrotasks) {
	tickInfo[0] = 0;
	tickInfo[1] = 0;
	function callbackNextTick() {
		if (tickInfo[0] < tickInfo[1]) {
			_tickCallback();
		}
	}
	_runMicrotasks.runMicrotasks = function() {
		callbackNextTick.scheduleAsMicrotask();
	};
	_runMicrotasks.runMicrotasks();
};

process._setupDomainUse = function(_domain, _domain_flag) {
	//TODO domain support
}

process.binding = (function() {

	var tty_wrap = {
		guessHandleType : function(fd) {
			return 'FILE';
		},
		isTTY : function(fd) {
			return false;
		},
	};

	var contextify = {
		ContextifyScript : function(code, options) {
			this.runInThisContext = function() {
				return evaluateProgram(code, options.filename);
			};
		},
	};

	var natives = {}; // configured by initdb.js
	natives.config = "\n{}";

	var smalloc = {}; // configured by initdb.js

	var constants = {}; // configured by initdb.js

	var uv = {}; // configured by initdb.js

	var Stats;
	var fsPort = new IOPort('fs');

	function makeFSmethods(name, reqPos, options) {
		return function() {
			//process.debug("binding[fs] " + name);
			var args = Array.prototype.slice.call(arguments);
			var req = args[reqPos];
			if (req === undefined) {
				while (true) {
					try {
						if (options.argsFilter) {
							var a = options.argsFilter.apply(undefined, args);
						}
						else {
							var a = args.slice(0, reqPos);
						}
						var value = fsPort.syncIO(name, a);
						if (options.valueFilter) {
							value = options.valueFilter(value, args);
						}
						return value;
					} catch (err) {
						if (err instanceof IOPortError) {
							if (err.message === 'restart') {
								if (options.restartPolicy === 'retry') {
									continue;
								}
								if (options.restartPolicy === 'ignore') {
									return;
								}
							}
							if (err.message === 'offline') {
								if (options.offlinePolicy === 'return0') {
									return 0;
								}
							}
						}
						throw err;
					}
				}
			}
			else {
				(function retry() {
					if (options.argsFilter) {
						var a = options.argsFilter.apply(undefined, args);
					}
					else {
						var a = args.slice(0, reqPos);
					}
					fsPort.asyncIO(name, a, function(err, value) {
						if (err instanceof IOPortError) {
							if (err.message === 'restart') {
								if (options.restartPolicy === 'retry') {
									retry();
									return;
								}
								if (options.restartPolicy === 'ignore') {
									req.oncomplete();
									return;
								}
							}
						}
						if (options.valueFilter) {
							value = options.valueFilter(value, args);
						}
						req.oncomplete(err, value);
					});
				})();
			}
		};
	}

	function renameFdArgsFilter() {
		var args = Array.prototype.slice.call(arguments);
		//TODO renaming
		return args;
	}

	function renameFdValueFilter(value) {
		//TODO renaming
		return value;
	}

	function statValueFilter(value) {
		value.__proto__ = Stats.prototype;
		return value;
	}

	var fs = {
		FSInitialize : function(s) {
			Stats = s;
		},
		FSReqWrap : function() {
		},
		open : makeFSmethods('open', 3, {
			restartPolicy : 'retry',
			valueFilter : renameFdValueFilter,
		}),
		close : makeFSmethods('close', 1, {
			restartPolicy : 'ignore',
			argsFilter : renameFdArgsFilter,
		}),
		stat : makeFSmethods('stat', 1, {
			restartPolicy : 'retry',
			valueFilter : statValueFilter,
		}),
		lstat : makeFSmethods('lstat', 1, {
			restartPolicy : 'retry',
			valueFilter : statValueFilter,
		}),
		fstat : makeFSmethods('fstat', 1, {
			restartPolicy : 'retry',
			argsFilter : renameFdArgsFilter,
			valueFilter : statValueFilter,
		}),
		writeBuffer : makeFSmethods('writeBuffer', 5, {
			restartPolicy : 'retry',
			offlinePolicy : 'return0',
			argsFilter : renameFdArgsFilter,
		}),
		read : makeFSmethods('readBuffer', 5, {
			restartPolicy : 'retry',
			offlinePolicy : 'return0',
			argsFilter : function(fd, buffer, offset, length, position, req) {
				//TODO renaming
				return [ fd, length, position ];
			},
			valueFilter : function(value, args) {
				if (!(value instanceof Buffer)) {
					return 0;
				}
				var buffer = args[1];
				var offset = args[2];
				value.copy(buffer, offset, 0, value.length);
				return value.length;
			},
		}),
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
		fchmod : function() {
			process.debug("binding[fs] fchmod ");
		},
		fchown : function() {
			process.debug("binding[fs] fchown ");
		},
		fdatasync : function() {
			process.debug("binding[fs] fdatasync ");
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
		mkdir : function() {
			process.debug("binding[fs] mkdir ");
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
		symlink : function() {
			process.debug("binding[fs] symlink ");
		},
		unlink : function() {
			process.debug("binding[fs] unlink ");
		},
		utimes : function() {
			process.debug("binding[fs] utimes ");
		},
		writeString : function() {
			process.debug("binding[fs] writeString ");
		},
	};

	var parserPort = new IOPort('http_parser');

	var http_parser = {
		HTTPParser : function HTTPParser() {
			parserPort.open('HTTPParser', arguments, function() {
				process.debug("port event " + arguments);
			});
		},
	};
	http_parser.HTTPParser.methods = [];
	http_parser.HTTPParser.prototype.close = function() {
	};
	http_parser.HTTPParser.prototype.execute = function() {
	};
	http_parser.HTTPParser.prototype.finish = function() {
	};
	http_parser.HTTPParser.prototype.reinitialize = function() {
	};
	http_parser.HTTPParser.prototype.pause = function() {
	};
	http_parser.HTTPParser.prototype.resume = function() {
	};

	var timer_wrap = {
		Timer : function() {
		},
	};

	var pipe_wrap = {};

	var cares_wrap = {
		getHostByAddr : function() {
		},
		getaddrinfo : function() {
		},
		getnameinfo : function() {
		},
		isIP : function() {
		},
		strerror : function() {
		},
		getServers : function() {
		},
		setServers : function() {
		},
		GetAddrInfoReqWrap : function() {
		},
		GetNameInfoReqWrap : function() {
		},
	};

	var tcp_wrap = {
		TCP : function() {
		},
	};

	var stream_wrap = {};

	return function(name) {
		if (name === 'fs') {
			return fs;
		}
		if (name === 'contextify') {
			return contextify;
		}
		if (name === 'natives') {
			return natives;
		}
		if (name === 'smalloc') {
			return smalloc;
		}
		if (name === 'constants') {
			return constants;
		}
		if (name === 'uv') {
			return uv;
		}
		if (name === 'http_parser') {
			return http_parser;
		}
		if (name === 'tty_wrap') {
			return tty_wrap;
		}
		if (name === 'timer_wrap') {
			return timer_wrap;
		}
		if (name === 'pipe_wrap') {
			return pipe_wrap;
		}
		if (name === 'cares_wrap') {
			return cares_wrap;
		}
		if (name === 'tcp_wrap') {
			return tcp_wrap;
		}
		if (name === 'stream_wrap') {
			return stream_wrap;
		}
	};

})();

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

var fs = process.binding('fs');
var fsPort = new IOPort('fs');
var Stats;

fsPort.open("", [], function(event){
	_debug("fs bridge DEBUG: fs callback:"+event);
});

function makeFSmethods(name, reqPos, options) {
	return function() {
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

fs.FSInitialize = function(s) {
	Stats = s;
};

fs.FSReqWrap = function() {
};

fs.open = makeFSmethods('open', 3, {
	restartPolicy : 'retry',
	valueFilter : renameFdValueFilter,
});

fs.close = makeFSmethods('close', 1, {
	restartPolicy : 'ignore',
	argsFilter : renameFdArgsFilter,
});

fs.stat = makeFSmethods('stat', 1, {
	restartPolicy : 'retry',
	valueFilter : statValueFilter,
});

fs.lstat = makeFSmethods('lstat', 1, {
	restartPolicy : 'retry',
	valueFilter : statValueFilter,
});

fs.fstat = makeFSmethods('fstat', 1, {
	restartPolicy : 'retry',
	argsFilter : renameFdArgsFilter,
	valueFilter : statValueFilter,
});

fs.writeBuffer = makeFSmethods('writeBuffer', 5, {
	restartPolicy : 'retry',
	offlinePolicy : 'return0',
	argsFilter : renameFdArgsFilter,
});

fs.read = makeFSmethods('readBuffer', 5, {
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
});

fs.access = function() {
	_debug("binding[fs] access ");
};

fs.chmod = function() {
	_debug("binding[fs] chmod ");
};

fs.chown = function() {
	_debug("binding[fs] chown ");
};

fs.fchmod = function() {
	_debug("binding[fs] fchmod ");
};

fs.fchown = function() {
	_debug("binding[fs] fchown ");
};

fs.fdatasync = function() {
	_debug("binding[fs] fdatasync ");
};

fs.fsync = function() {
	_debug("binding[fs] fsync ");
};

fs.ftruncate = function() {
	_debug("binding[fs] ftruncate ");
};

fs.futimes = function() {
	_debug("binding[fs] futimes ");
};

fs.link = function() {
	_debug("binding[fs] link ");
};

fs.mkdir = function() {
	_debug("binding[fs] mkdir ");
};

fs.readdir = function() {
	_debug("binding[fs] readdir ");
};

fs.readlink = function() {
	_debug("binding[fs] readlink ");
};

fs.rename = function() {
	_debug("binding[fs] rename ");
};

fs.rmdir = function() {
	_debug("binding[fs] rmdir ");
};

fs.symlink = function() {
	_debug("binding[fs] symlink ");
};

fs.unlink = function() {
	_debug("binding[fs] unlink ");
};

fs.utimes = function() {
	_debug("binding[fs] utimes ");
};

fs.writeString = function() {
	_debug("binding[fs] writeString ");
};

fs.StatWatcher = function() {
	_debug("binding[fs] StatWatcher ");
};

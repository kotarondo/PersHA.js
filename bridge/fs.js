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

var binding = process.binding('fs');
var fsPort = new IOPort('fs');
var Stats;

var maxFD = 10;
var mapFD = [];

function findPort(fd) {
	return mapFD[fd];
}

function bindPort(port) {
	var fd = maxFD++;
	mapFD[fd] = port;
	return fd;
}

function unbindPort(fd) {
	delete (mapFD[fd]);
}

binding.FSInitialize = function(s) {
	Stats = s;
};

binding.FSReqWrap = function() {
};

function onceCall(name, args, req, filter) {
	return generalCall(fsPort, name, args, req, false, filter);
}

function retryCall(name, args, req, filter) {
	return generalCall(fsPort, name, args, req, true, filter);
}

function fdCall(fd, name, args, req, filter) {
	return generalCall(findPort(fd), name, args, req, false, filter);
}

function generalCall(port, name, args, req, retry, filter) {
	if (req === undefined) {
		var value = port.syncIO(name, args, !retry);
		if (filter) {
			value = filter(value);
		}
		return value;
	}
	(function async() {
		port.asyncIO(name, args, function(err, value) {
			if (retry && err instanceof IOPortError && err.message === 'restart') {
				async();
				return;
			}
			if (!err && filter) {
				value = filter(value);
			}
			req.oncomplete(err, value);
		});
	})();
}

binding.open = function(path, flags, mode, req) {
	var port = fsPort.open('open', [], portEventCallback);
	function portEventCallback(name, args) {
	}
	generalCall(port, 'open', [ path, flags, mode ], req, false, function(value) {
		return bindPort(port);
	});
};

binding.close = function(fd, req) {
	var port = unbindPort(fd);
	if (!port) {
		return;
	}
	port.close();
	generalCall(port, 'close', [], req, false);
};

binding.read = function(fd, buffer, offset, length, position, req) {
	return fdCall('read', [ length, position ], req, function(value) {
		if (!(value instanceof Buffer)) {
			return 0;
		}
		value.copy(buffer, offset, 0, value.length);
		return value.length;
	});
};

binding.writeBuffer = function(fd, buffer, offset, length, position, req) {
	return fdCall('writeBuffer', [ buffer, offset, length, position ], req);
};

binding.writeString = function(fd, string, position, encoding, req) {
	return fdCall('writeString', [ string, position, encoding ], req);
};

function statFilter(value) {
	value.__proto__ = Stats.prototype;
	return value;
}

binding.stat = function(path, req) {
	return retryCall('stat', [ path ], req, statFilter);
};

binding.lstat = function(path, req) {
	return retryCall('lstat', [ path ], req, statFilter);
};

binding.fstat = function(fd, req) {
	return fdCall('fstat', [], req, statFilter);
};

binding.access = function(path, mode, req) {
	return retryCall('access', [ path, mode ], req);
};

binding.chmod = function(path, mode, req) {
	return onceCall('chmod', [ path, mode ], req);
};

binding.chown = function(path, uid, gid, req) {
	return onceCall('chown', [ path, uid, gid ], req);
};

binding.fchmod = function(fd, mode, req) {
	return fdCall('fchmod', [ mode ], req);
};

binding.fchown = function(fd, uid, gid, req) {
	return fdCall('fchown', [ uid, gid ], req);
};

binding.fsync = function(fd, req) {
	return fdCall('fsync', [], req);
};

binding.fdatasync = function(fd, req) {
	return fdCall('fdatasync', [], req);
};

binding.ftruncate = function(fd, len, req) {
	return fdCall('ftruncate', [ len ], req);
};

binding.utimes = function(path, atime, mtime, req) {
	return onceCall('utimes', [ path, atime, mtime ], req);
};

binding.futimes = function(fd, atime, mtime, req) {
	return fdCall('futimes', [ atime, mtime ], req);
};

binding.link = function(srcpath, dstpath, req) {
	return onceCall('link', [ srcpath, dstpath ], req);
};

binding.symlink = function(destination, path, type, req) {
	return onceCall('symlink', [ destination, path, type ], req);
};

binding.unlink = function(path, req) {
	return onceCall('unlink', [ path ], req);
};

binding.mkdir = function(path, mode, req) {
	return onceCall('mkdir', [ path, mode ], req);
};

binding.readdir = function(path, req) {
	return retryCall('readdir', [ path ], req);
};

binding.readlink = function(path, req) {
	return retryCall('readlink', [ path ], req);
};

binding.rename = function(oldPath, newPath, req) {
	return onceCall('rename', [ oldPath, newPath ], req);
};

binding.rmdir = function(path, req) {
	return onceCall('rmdir', [ path ], req);
};

binding.StatWatcher = function() {
//TODO
};

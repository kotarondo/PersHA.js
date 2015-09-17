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

var binding = process.binding('fs');

module.exports = {
	open : open,
	syncIO : syncIO,
	asyncIO : asyncIO,
};

function open(name, callback) {
	if (name === 'general') {
		return new FilePort(callback);
	}
	if (name === 'StatWatcher') {
		return new StatWatcherPort(callback);
	}
	console.log("[unhandled] fs open: " + name);
}

function syncIO(func, args) {
	return binding[func].apply(binding, args);
}

function asyncIO(func, args, callback) {
	var req = new binding.FSReqWrap();
	req.oncomplete = callback;
	args.push(req);
	return binding[func].apply(binding, args);
}

function FilePort(callback) {
	var fd;

	this.syncIO = function(func, args) {
		if (func === 'stdio') {
			fd = args[0];
			return;
		}
		if (func === 'open') {
			fd = binding.open(args[0], args[1], args[2]);
			return;
		}
		if (func === 'read') {
			var length = args[0];
			var position = args[1];
			var buffer = new Buffer(length);
			var transferred = binding.read(fd, buffer, 0, length, position);
			return buffer.slice(0, transferred);
		}
		args.unshift(fd);
		return binding[func].apply(binding, args);
	};

	this.asyncIO = function(func, args, callback) {
		var req = new binding.FSReqWrap();
		req.oncomplete = callback;
		if (func === 'open') {
			req.oncomplete = function(err, value) {
				fd = value;
				callback(err);
			};
			return binding.open(args[0], args[1], args[2], req);
		}
		if (func === 'read') {
			var length = args[0];
			var position = args[1];
			var buffer = new Buffer(length);
			req.oncomplete = function(err, transferred) {
				if (err) {
					callback(err);
					return;
				}
				buffer = buffer.slice(0, transferred);
				callback(undefined, buffer);
			};
			return binding.read(fd, buffer, 0, length, position, req);
		}
		args.unshift(fd);
		args.push(req);
		return binding[func].apply(binding, args);
	};
}

function StatWatcherPort(callback) {
	var handle = new binding.StatWatcher();

	handle.onchange = function() {
		var args = Array.prototype.slice.call(arguments);
		callback('onchange', args);
	};
	handle.onstop = function() {
		var args = Array.prototype.slice.call(arguments);
		callback('onstop', args);
	};

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			var startArgs = args[0];
			if (startArgs) {
				handle.start.apply(handle, startArgs);
			}
			return;
		}
		return handle[func].apply(handle, args);
	};
}

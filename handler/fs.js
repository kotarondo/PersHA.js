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

module.exports = {
	open : open,
	syncIO : syncIO,
	asyncIO : asyncIO,
};

var fs = require('fs');

function open(name, args, callback) {
	if (name === '') {
		return;
	}
	console.log("[unhandled] fs open:" + name);
	console.log(args);
}

function syncIO(name, args) {
	if (name === 'readBuffer') {
		var fd = args[0];
		var length = args[1];
		var position = args[2];
		var buffer = new Buffer(length);
		var transferred = fs.readSync(fd, buffer, 0, length, position);
		return buffer.slice(0, transferred);
	}
	if (name === 'writeBuffer') {
		return fs.writeSync.apply(fs, args);
	}
	if (name === 'open') {
		return fs.openSync.apply(fs, args);
	}
	if (name === 'close') {
		return fs.closeSync.apply(fs, args);
	}
	if (name === 'stat') {
		return fs.statSync.apply(fs, args);
	}
	if (name === 'lstat') {
		return fs.lstatSync.apply(fs, args);
	}
	if (name === 'fstat') {
		return fs.fstatSync.apply(fs, args);
	}
	if (name === 'mkdir') {
		return fs.mkdirSync.apply(fs, args);
	}
	if (name === 'rmdir') {
		return fs.rmdirSync.apply(fs, args);
	}

	console.log("[unhandled] fs syncIO:" + name);
	console.log(args);
}

function asyncIO(name, args, callback) {
	if (name === 'readBuffer') {
		var fd = args[0];
		var length = args[1];
		var position = args[2];
		var buffer = new Buffer(length);
		fs.read(fd, buffer, 0, length, position, function(err, transferred, buffer) {
			if (err) {
				callback(err);
				return;
			}
			if (fd === 0 && transferred === 0) {
				buffer = new Buffer(1);
				buffer[0] = '\n';
				return buffer;
			}
			buffer = buffer.slice(0, transferred);
			callback(undefined, buffer);
		});
		return;
	}
	if (name === 'writeBuffer') {
		args.push(callback);
		return fs.write.apply(fs, args);
	}
	if (name === 'stat') {
		args.push(callback);
		return fs.stat.apply(fs, args);
	}
	if (name === 'lstat') {
		args.push(callback);
		return fs.lstat.apply(fs, args);
	}
	if (name === 'fstat') {
		args.push(callback);
		return fs.fstat.apply(fs, args);
	}
	if (name === 'open') {
		args.push(callback);
		return fs.stat.apply(fs, args);
	}

	console.log("[unhandled] fs asyncIO:" + name);
	console.log(args);
	callback();
}

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
	syncIO : syncIO,
	asyncIO : asyncIO,
};

function syncIO(name, args) {
	if (name === 'debug') {
		return console.log("debug: " + args);
	}
	if (name === 'cwd') {
		return process.cwd();
	}
	if (name === 'chdir') {
		return process.chdir.apply(process, args);
	}
	if (name === 'getuid') {
		return process.getuid.apply(process, args);
	}
	if (name === 'setuid') {
		return process.setuid.apply(process, args);
	}
	if (name === 'umask') {
		return process.umask.apply(process, args);
	}
	if (name === 'exit') {
		return process.exit(args[0]);
	}
	console.log("[unhandled] process syncIO:" + name + ":" + args);
}

function asyncIO(name, args, callback) {
	if (name === 'setImmediate') {
		setImmediate(callback);
		return;
	}
	console.log("[unhandled] process asyncIO:" + name + ":" + args);
}

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

var binding = process.binding('udp_wrap');
var SendWrap = binding.SendWrap;

module.exports = {
	open : open,
};

function open(name, callback) {
	if (name === 'UDP') {
		return new UDPPort(null, callback);
	}
	console.log("[unhandled] udp_wrap open: " + name);
}

function UDPPort(handle, callback) {
	if (!handle) {
		handle = new binding.UDP();
	}

	handle.onmessage = function(nread, handle, buf, rinfo) {
		callback('onmessage', [ nread, buf, rinfo ]);
	};

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			var state = args[0];
			if (state.bindArgs) {
				handle.bind.apply(handle, state.bindArgs);
			}
			if (state.bind6Args) {
				handle.bind6.apply(handle, state.bind6Args);
			}
			if (state.unref) {
				handle.unref();
			}
			return;
		}
		if (func === 'getsockname') {
			var res = {
				out : {}
			};
			res.err = handle.getsockname(res.out);
			return res;
		}
		return handle[func].apply(handle, args);
	};

	this.asyncIO = function(func, args, callback) {
		if (func === 'send') {
			var func = args[0];
			var data = args[1];
			var port = args[2];
			var ip = args[3];
			var req = new SendWrap();
			req.buffer = data; // must retain a reference
			req.length = data.length;
			req.callback = callback;
			req.oncomplete = function(err) {
				callback(err);
			};
			var err = handle[func].call(handle, req, data, 0, data.length, port, ip, true);
			if (err) {
				callback(errnoException(err, 'send'));
			}
			return;
		}
		console.log("[unhandled] UDP asyncIO: " + func);
	};
}

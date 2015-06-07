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

global = this;

require = function(modname) {
	function assert(a) {
		if (a) return;
		debugger;
		throw new Error("assertion error");
	}
	function assert_ok(a) {
		if (a) return;
		debugger;
		throw new Error("assertion error");
	}
	function assert_doesNotThrow(f) {
		try {
			f();
		} catch (e) {
			throw new Error("assertion error");
		}
	}
	function assert_throws(f, error) {
		try {
			f();
			debugger;
			throw new Error("assertion error");
		} catch (e) {
			if (error === undefined || e instanceof error) return;
			debugger;
			throw new Error("assertion error");
		}
	}
	function assert_strictEqual(a, b) {
		if (a === b) return;
		debugger;
		throw new Error("assertion error");
	}
	function assert_equal(a, b) {
		if (a == b) return;
		debugger;
		throw new Error("assertion error");
	}
	function assert_deepEqual(actual, expected) {
		if (actual === expected) {
			return;
		}
		else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
			if (actual.length != expected.length) throw new Error("assertion error");
			for (var i = 0; i < actual.length; i++) {
				if (actual[i] !== expected[i]) throw new Error("assertion error");
			}
			return;
		}
		else if (Array.isArray(actual) && Array.isArray(expected)) {
			if (actual.length != expected.length) throw new Error("assertion error");
			for (var i = 0; i < actual.length; i++) {
				if (actual[i] !== expected[i]) throw new Error("assertion error");
			}
			return;
		}
		debugger;
		throw new Error("assertion error");
	}
	assert.ok = assert_ok;
	assert.throws = assert_throws;
	assert.doesNotThrow = assert_doesNotThrow;
	assert.strictEqual = assert_strictEqual;
	assert.equal = assert_equal;
	assert.deepEqual = assert_deepEqual;
	switch (modname) {
	case 'buffer':
		return {
			Buffer : Buffer,
			SlowBuffer : Buffer,
			get INSPECT_MAX_BYTES(){
				return Buffer.INSPECT_MAX_BYTES;
			},
			set INSPECT_MAX_BYTES(b){
				Buffer.INSPECT_MAX_BYTES=b;
			},
		};
	case 'assert':
		return assert;
	case 'smalloc':
		return {
			kMaxLength : 0x3fffffff,
		};
	case 'util':
		return {
			inspect : function(b){
				return b.inspect();
			},
		};
	case 'crypto':
		return {
			createHash : function() {
				return {
					update : function() {
						return this;
					},
					digest : function() {
					},
				};
			},
		};
	}
	return {};
};

console = {
	log : function() {
	},
	error : function() {
	},
};

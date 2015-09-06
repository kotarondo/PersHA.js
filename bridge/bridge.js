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

var process = {};

process.binding = (function() {
	var bindings = {
		contextify : {},
		natives : {},
		smalloc : {},
		constants : {},
		fs : {},
		uv : {},
		http_parser : {},
		crypto : {},
		tty_wrap : {},
		timer_wrap : {},
		pipe_wrap : {},
		cares_wrap : {},
		tcp_wrap : {},
		udp_wrap : {},
		stream_wrap : {},
		signal_wrap : {},
	};
	return function(name) {
		return bindings[name];
	}
})();

Object.defineProperty(Object.prototype, "__defineGetter__", {
	value : function(n, getter) {
		Object.defineProperty(this, n, {
			get : getter
		});
	},
	writable : true,
	enumerable : false,
	configurable : true
});

Object.defineProperty(Number, "isFinite", {
	value : function(value) {
		return typeof value === "number" && isFinite(value);
	},
	writable : true,
	enumerable : false,
	configurable : true
});

Object.defineProperty(Error, "stackTraceLimit", {
	get : function() {
		return getSystemProperty("stackTraceLimit");
	},
	set : function(value) {
		setSystemProperty("stackTraceLimit", value);
	},
	enumerable : true,
	configurable : true
});

Error.captureStackTrace = (function() {
	function StackTraceEntry(info) {
		this.info = info;
	}
	StackTraceEntry.prototype.getFileName = function() {
		return this.info.filename;
	}
	StackTraceEntry.prototype.getLineNumber = function() {
		return this.info.lineNumber;
	}
	StackTraceEntry.prototype.getColumnNumber = function() {
		return this.info.columnNumber;
	}
	StackTraceEntry.prototype.getFunctionName = function() {
		return this.info.functionName;
	}
	StackTraceEntry.prototype.isEval = function() {
		return !info.functionObject;
	}

	function prepareStackTrace(obj, stack) {
		var A = [];
		A[0] = "Error";
		for (var i = 0; i < stack.length; i++) {
			var info = stack[i].info;
			var finfo = info.filename + ":" + info.lineNumber + ":" + info.columnNumber;
			A[i+1] = finfo;
			if (info.functionName) {
				A[i+1] = info.functionName + " (" + finfo + ")";
			}
		}
		return A.join("\n    at ");
	}

	return function(obj, func) {
		Error.stackTraceLimit++;
		var e = new Error();
		Error.stackTraceLimit--;
		var stack = [];
		for (var i = 1;; i++) {
			var info = e.getStackTraceEntry(i);
			if (!info) {
				break;
			}
			if (info.functionObject === func) {
				stack = [];
				continue;
			}
			stack.push(new StackTraceEntry(info));
		}
		if (Error.prepareStackTrace) {
			var value = Error.prepareStackTrace(obj, stack);
		}
		else {
			var value = prepareStackTrace(obj, stack);
		}
		Object.defineProperty(obj, "stack", {
			value : value,
			writable : true,
			enumerable : false,
			configurable : true
		});
	};

})();

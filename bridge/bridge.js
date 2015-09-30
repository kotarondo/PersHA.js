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

Object.defineProperty(this, "process", {
	value : {},
	writable : true,
	enumerable : false,
	configurable : true
});

process.binding = (function() {
	var bindings = {
		contextify : {},
		natives : {},
		smalloc : {
			kMaxLength : 1073741823
		},
		constants : {},
		buffer : {},
		fs : {},
		uv : {},
		http_parser : {},
		crypto : {},
		os : {},
		tty_wrap : {},
		timer_wrap : {},
		pipe_wrap : {},
		cares_wrap : {},
		tcp_wrap : {},
		udp_wrap : {},
		stream_wrap : {},
		signal_wrap : {},
		fs_event_wrap : {},
	};
	return function(name) {
		var b = bindings[name];
		if (!b) throw new Error("No such module: " + name);
		return b;
	};
})();

Object.defineProperty(this, "_uncaughtErrorCallback", {
	value : function(e) {
		if (!process._fatalException) {
			return false;
		}
		return process._fatalException(e);
	},
	writable : true,
	enumerable : false,
	configurable : true
});

Object.defineProperty(Object.prototype, "__defineGetter__", {
	value : function(n, getter) {
		Object.defineProperty(this, n, {
			get : getter,
			enumerable : true,
			configurable : true
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
		return !this.info.functionObject;
	}

	function prepareStackTrace(obj, stack) {
		var A = [];
		A[0] = Error.prototype.toString.call(obj);
		for (var i = 0; i < stack.length; i++) {
			var info = stack[i].info;
			var finfo = info.filename + ":" + info.lineNumber + ":" + info.columnNumber;
			A[i + 1] = finfo;
			if (info.functionName) {
				A[i + 1] = info.functionName + " (" + finfo + ")";
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

function DTRACE_HTTP_CLIENT_REQUEST() {
}
function DTRACE_HTTP_CLIENT_RESPONSE() {
}
function DTRACE_HTTP_SERVER_REQUEST() {
}
function DTRACE_HTTP_SERVER_RESPONSE() {
}
function DTRACE_NET_STREAM_END() {
}
function DTRACE_NET_SERVER_CONNECTION() {
}
function DTRACE_NET_SOCKET_READ() {
}
function DTRACE_NET_SOCKET_WRITE() {
}

function COUNTER_HTTP_CLIENT_REQUEST() {
}
function COUNTER_HTTP_CLIENT_RESPONSE() {
}
function COUNTER_HTTP_SERVER_REQUEST() {
}
function COUNTER_HTTP_SERVER_RESPONSE() {
}
function COUNTER_NET_SERVER_CONNECTION() {
}
function COUNTER_NET_SERVER_CONNECTION_CLOSE() {
}

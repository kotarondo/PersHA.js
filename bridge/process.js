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

var basePort = new IOPort('process');

process._debug = function() {
	basePort.asyncIO('debug', arguments);
};

process.execArgv = [];
process.argv = [ 'node' ];
process.env = {};
process._eval = null;
process._forceRepl = true;
process.moduleLoadList = [];
process.features = {};
process.versions = {};

process.cwd = function() {
	return basePort.syncIO('cwd', arguments);
};

process.chdir = function() {
	return basePort.syncIO('chdir', arguments);
};

process.getuid = function() {
	return basePort.syncIO('getuid', arguments);
};

process.setuid = function() {
	return basePort.syncIO('setuid', arguments);
};

process.umask = function() {
	return basePort.syncIO('umask', arguments);
};

process.hrtime = function() {
	return basePort.syncIO('hrtime', arguments);
};

process.memoryUsage = function() {
	return basePort.syncIO('memoryUsage', arguments);
};

process.abort = function() {
	basePort.asyncIO('abort', arguments);
};

process.reallyExit = function() {
	basePort.syncIO('exit', arguments);
};

process.suspendExit = function() {
	basePort.asyncIO('exit', arguments);
};

var tickCallback;

process._setupNextTick = function(tickInfo, _tickCallback, _runMicrotasks) {
	tickCallback = _tickCallback;
	var callbackNextTickScheduled = false;
	function callbackNextTick() {
		callbackNextTickScheduled = false;
		while (tickInfo[0] < tickInfo[1]) {
			tickCallback();
		}
	}
	tickInfo[0] = 0;
	var tickInfo1 = 0;
	Object.defineProperty(tickInfo, "1", {
		get : function() {
			return tickInfo1;
		},
		set : function(value) {
			tickInfo1 = value;
			if (!callbackNextTickScheduled && tickInfo[0] < tickInfo1) {
				callbackNextTickScheduled = true;
				callbackNextTick.scheduleAsMicrotask();
			}
		},
		enumerable : true,
		configurable : false
	});
	_runMicrotasks.runMicrotasks = function() {
	}
};

process._setupDomainUse = function(_domain, _domain_flag) {
	tickCallback = process._tickDomainCallback;
	process._tickCallback = tickCallback;
};

process._MakeCallback = function(domain, f) {
	if (domain) {
		return domain.run(f);
	}
	return f();
};

process.binding('contextify').ContextifyScript = function(code, options) {
	if (options) {
		var filename = options.filename;
	}
	parseProgram(code, filename);
	this.runInThisContext = function() {
		return evaluateProgram(code, filename);
	};
	this.runInContext = function(sandbox) {
		var vm = sandbox && sandbox.__vm__;
		return evaluateProgram(code, filename);
	};
};

process.binding('contextify').makeContext = function(sandbox) {
	//var vm = createVM(sandbox);
	var vm = {};
	Object.defineProperty(sandbox, "__vm__", {
		value : vm,
		writable : false,
		enumerable : false,
		configurable : false
	});
};

process.binding('contextify').isContext = function(sandbox) {
	return sandbox && sandbox.__vm__;
};

process.binding('natives').config = "\n{}";

var _needImmediateCallback = false;
var _immediateCallbackScheduled = false;

Object.defineProperty(process, "_needImmediateCallback", {
	get : function() {
		return _needImmediateCallback;
	},
	set : function(value) {
		_needImmediateCallback = value;
		if (value && !_immediateCallbackScheduled) {
			_immediateCallbackScheduled = true;
			basePort.asyncIO('setImmediate', [], immediateCallback);
		}
	},
	enumerable : false,
	configurable : true
});

function immediateCallback() {
	_immediateCallbackScheduled = false;
	if (_needImmediateCallback) {
		process._immediateCallback();
		if (_needImmediateCallback) {
			_immediateCallbackScheduled = true;
			basePort.asyncIO('setImmediate', [], immediateCallback);
		}
	}
}

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

var processPort = new IOPort('process');

process._debug = function() {
	processPort.syncIO('debug', arguments);
};

process.cwd = function() {
	return this.__cwd;
};
process.argv = [ 'node' ];
process.env = {};
process._eval = null;
process._forceRepl = true;
process.moduleLoadList = [];

process.reallyExit = function() {
	processPort.syncIO('exit', arguments, true);
};

process._setupNextTick = function(tickInfo, _tickCallback, _runMicrotasks) {
	tickInfo[0] = 0;
	tickInfo[1] = 0;
	function callbackNextTick() {
		if (tickInfo[0] < tickInfo[1]) {
			_tickCallback();
		}
	}
	_runMicrotasks.runMicrotasks = function() {
		callbackNextTick.scheduleAsMicrotask();
	};
	_runMicrotasks.runMicrotasks();
};

process._setupDomainUse = function(_domain, _domain_flag) {
	//TODO domain support
};

process.binding('contextify').ContextifyScript = function(code, options) {
	parseProgram(code, options.filename);
	this.runInThisContext = function() {
		return evaluateProgram(code, options.filename);
	};
};

process.binding('natives').config = "\n{}";
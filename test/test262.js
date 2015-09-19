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

var stopIfFailed = true;
var skipVeryHeavyTests = true;
var skipHeavyTests = true;

if (process.argv.length >= 3) {
	var specificTest = process.argv[2];
}

// for Tests S15.9.3.1_A5_T*.js
LocalTZA = -8 * 3600000;
LocalTZAString = "PDT";

var vm = require('vm');
var fs = require('fs');
var atob = require('atob');
var passCount = 0;
var failCount = 0;
var skipCount = 0;
var fails = "";

setImmediate(nextLoadInclude);

var includes = [ "sta.js", "math_precision.js", "math_isequal.js", "environment.js",//
"Date_constants.js", "Date_library.js", "numeric_conversion.js" ];
var includeCache = {};

function nextLoadInclude() {
	var filename = includes.shift();
	if (filename === undefined) {
		nextTestSuite();
		return;
	}
	fs.readFile("test262-harness/" + filename, function(err, data) {
		if (err) {
			console.error("cannot read: " + filename);
			return;
		}
		includeCache[filename] = data;
		nextLoadInclude();
	});
}

var testSuites = [ "ch06.json", "ch07.json", "ch08.json", "ch09.json", "ch10.json",//
"ch11.json", "ch12.json", "ch13.json", "ch14.json", "ch15.json", ];

function nextTestSuite() {
	var filename = testSuites.shift();
	if (filename === undefined) {
		console.log("FAILED TESTS");
		console.log(fails);
		console.log("pass: " + passCount);
		console.log("fail: " + failCount);
		console.log("skip: " + skipCount);
		console.log("ALL TESTS DONE");
		return;
	}
	fs.readFile("test262-json/" + filename, function(err, data) {
		if (err) {
			console.error("cannot read: " + filename);
			return;
		}
		doTestSuite(data);
	});
}

function doTestSuite(data) {
	var tests = JSON.parse(data).testsCollection.tests;
	for (var i = 0; i < tests.length; i++) {
		var test = tests[i];
		var begin = Date.now();
		var ok = doTest(test);
		var end = Date.now();
		if (end - begin > 3000) {
			console.log("elapsed: " + (end - begin) + " ms");
		}
		if (ok === true) {
			passCount++;
		}
		else if (ok === false) {
			failCount++;
			fails += "FAILED: " + test.path + '\n';
			if (stopIfFailed) {
				testSuites = [];
				nextTestSuite();
				return;
			}
		}
		else {
			skipCount++;
		}
	}
	nextTestSuite();
}

var VeryHeavyTests = [ //
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A2.5_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A2.5_T1.js",//
"TestCases/ch15/15.4/15.4.5/15.4.5.2/S15.4.5.2_A3_T4.js",//
];
var HeavyTests = [ //
"TestCases/ch07/7.4/S7.4_A5.js",//
"TestCases/ch07/7.4/S7.4_A6.js",//
"TestCases/ch07/7.8/7.8.5/S7.8.5_A1.1_T2.js",//
"TestCases/ch07/7.8/7.8.5/S7.8.5_A1.4_T2.js",//
"TestCases/ch07/7.8/7.8.5/S7.8.5_A2.1_T2.js",//
"TestCases/ch07/7.8/7.8.5/S7.8.5_A2.4_T2.js",//
"TestCases/ch15/15.1/15.1.2/15.1.2.2/S15.1.2.2_A8.js",//
"TestCases/ch15/15.1/15.1.2/15.1.2.3/S15.1.2.3_A6.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.10_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.11_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.11_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.12_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.12_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.12_T3.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.2_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A1.2_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A2.1_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.1/S15.1.3.1_A2.4_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.10_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.11_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.11_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.12_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.12_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.12_T3.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.2_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A1.2_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A2.1_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.2/S15.1.3.2_A2.4_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.3/S15.1.3.3_A1.3_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.3/S15.1.3.3_A2.3_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.3/S15.1.3.3_A2.4_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.3/S15.1.3.3_A2.4_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.3/S15.1.3.3_A2.5_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.4/S15.1.3.4_A1.3_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.4/S15.1.3.4_A2.3_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.4/S15.1.3.4_A2.4_T1.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.4/S15.1.3.4_A2.4_T2.js",//
"TestCases/ch15/15.1/15.1.3/15.1.3.4/S15.1.3.4_A2.5_T1.js",//
];

function doTest(test) {
	if (specificTest && !test.path.match(specificTest)) return undefined;
	if (skipVeryHeavyTests && VeryHeavyTests.indexOf(test.path) >= 0) return undefined;
	if (skipHeavyTests && HeavyTests.indexOf(test.path) >= 0) return undefined;
	console.log(test.path);
	try {
		var source = atob(test.code);
		source = decodeURIComponent(escape(source)); // UTF-8 decoding trick
		var sandbox = vm.createContext();
		vm.runInContext(includeCache["sta.js"], sandbox, "sta.js");
		var includes = source.match(/\$INCLUDE\(([^\)]+)\)/g);
		if (includes !== null) {
			for (var i = 0; i < includes.length; i++) {
				var filename = includes[i].replace(/.*\(('|")(.*)('|")\)/, "$2");
				if (includeCache[filename] === undefined) {
					console.error("unknown included script: " + filename);
					return false;
				}
				vm.runInContext(includeCache[filename], sandbox, filename);
			}
		}
		vm.runInContext(source, sandbox, test.path);
		if (test.negative === undefined) {
			return true;
		}
	} catch (e) {
		if (test.negative !== undefined) {
			if (new RegExp(test.negative, "i").test(String(e))) {
				return true;
			}
		}
		console.log("ERROR: " + e.stack);
	}
	console.log(test.description);
	console.log(test.path);
	console.log(source);
	return false;
}
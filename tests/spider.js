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

var fs = require("fs");
var vm = require("vm");

var successCount = 0;
var failCount = 0;

var tests = [ "3d-cube", "3d-morph", "3d-raytrace", "access-binary-trees", "access-fannkuch", "access-nbody", "access-nsieve",
		"bitops-3bit-bits-in-byte", "bitops-bits-in-byte", "bitops-bitwise-and", "bitops-nsieve-bits", "controlflow-recursive",
		"crypto-aes", "crypto-md5", "crypto-sha1", "date-format-tofte", "date-format-xparb", "math-cordic", "math-partial-sums",
		"math-spectral-norm", "regexp-dna", "string-base64", "string-fasta", "string-tagcloud", "string-unpack-code",
		"string-validate-input", ];

var mean = 0;
for (var index = 0; index < tests.length; index++) {
	console.log("testing " + tests[index] + " ...");
	var filename = "../imported/sunspider-1.0.2/" + tests[index] + ".js";
	var source = fs.readFileSync(filename).toString();
	var begin = Date.now();
	var ok = doTest(source);
	var end = Date.now();
	var elapsed = end - begin;
	console.log("elapsed: " + elapsed + " ms");
	mean += Math.log(elapsed);
	if (ok === true) {
		successCount++;
		var begin_ref = Date.now();
		vm.runInNewContext(source);
		var end_ref = Date.now();
		console.log("ratio: " + Math.floor((end - begin) / (end_ref - begin_ref)));
	}
	else {
		failCount++;
		console.log("failed: " + tests[index]);
	}
}
console.log("ALL TESTS DONE");
mean = Math.exp(mean / tests.length);
console.log("elapsed(mean): " + mean + " ms");

function doTest(source) {
	try {
		initializeVM();
		var stmt = evaluateProgram(source);
		if (stmt.type === "throw") {
			throw stmt.value;
		}
		if (stmt.type !== "normal") {
			debugger;
			return false;
		}
		return true;
	} catch (e) {
		if (!isInternalError(e)) {
			console.log("ERROR: " + ToString(e));
		}
		else {
			console.log("ERROR: " + e);
			if (e.lineNumber) {
				console.log("line:" + e.lineNumber);
			}
			if (e.stack) {
				console.log("stack:\n" + e.stack);
			}
		}
	}
	return false;
}

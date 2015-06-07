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

var readline = require('readline');


JOURNAL_FILEBASE = ".testdata/repl";
if(!Journal_start()){
	console.log("========= initializing VM ============");
	initializeVM();
	Journal_init();
}
IOManager_start();

loop();

function loop() {
	var rl = readline.createInterface({
		input : process.stdin,
		output : process.stdout
	});
	rl.question("> ", function(text) {
		rl.close();
		var result = IOManager_evaluate(text);
		print(result);
		loop();
	});
}

function print(result){
	if (result.type === "throw") {
		var e = result.value;
		console.log("exception: " + ToString(e));
		if (!isPrimitiveValue(e) && e.stackTrace) {
			console.log("stack:");
			for (var i = 0; i < e.stackTrace.length; i += 2) {
				var linfo = theParser.locateDebugInfo(e.stackTrace[i].sourceObject.source, e.stackTrace[i + 1]);
				console.log(e.stackTrace[i].filename + ":" + linfo);
			}
		}
		return;
	}
	assert(result.type === "normal");
	if (result.value === empty) {
		return;
	}
	console.log(ToString(result.value));
}

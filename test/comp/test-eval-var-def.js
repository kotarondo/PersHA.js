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

var results=[];
var expected=[];

var x1="a";
var x2="b";
var x3="c";
var x4="d";

void function(){
	var x1=1;
	eval("var x2=2;");
	var x3=3;
	eval("var x4=4;");

	results.push(delete x1);
	expected.push(false);
	results.push(x1);
	expected.push(1);

	results.push(delete x2);
	expected.push(true);
	results.push(x2);
	expected.push("b");

	results.push(eval("delete x3"));
	expected.push(false);
	results.push(x3);
	expected.push(3);

	results.push(eval("delete x4"));
	expected.push(true);
	results.push(x4);
	expected.push("d");
}();

results.push(x1);
expected.push("a");
results.push(x2);
expected.push("b");
results.push(x3);
expected.push("c");
results.push(x4);
expected.push("d");

console.log("results= "+results);
console.log("expected= "+expected);
if(results.join()!==expected.join()) process.exit(1);
console.log("ok");
process.exit(0);

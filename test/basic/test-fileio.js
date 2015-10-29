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

global.require=require;

function assert(expr){
	if(!eval(expr)){
		console.log(expr);
		process.exit(1);
	}
}

function load(filename){
	require('vm').runInThisContext(require('fs').readFileSync(filename).toString());
}

load('../../main/helper.js');
load('../../main/dataio.js');
load('../../main/fileio.js');

var fos = FileOutputStream("tmp/xxx");
fos.writeInt(1);
fos.flush();
fos.writeInt(10000000000);
fos.flush();
fos.writeNumber(0.5);
fos.flush();
fos.writeString('abcdef');
fos.flush();
fos.writeBuffer(new Buffer('12345f'));
fos.flush();
var fis = FileInputStream("tmp/xxx");
assert("fis.readInt() === 1");
assert("fis.readInt() === 10000000000");
assert("fis.readNumber() === 0.5");
assert("fis.readString() === 'abcdef'");
var b = fis.readBuffer();
assert("b instanceof Buffer");
assert("b.toString() === '12345f'");

console.log("ok");
process.exit(0);

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
	require('vm').runInThisContext(require('fs').readFileSync(filename).toString(), filename);
}

load('../../main/helper.js');
load('../../main/dataio.js');

date = new Date();

function testwrite(delim){
	fos.writeAny(1);
	delim();
	fos.writeAny(10000000000);
	delim();
	fos.writeAny(0.5);
	delim();
	fos.writeAny('abcdef');
	delim();
	fos.writeAny(new Buffer('12345f'));
	delim();

	fos.writeAny({u:undefined, n:null, t:true, f:false, num:1234, s:"str", b:new Buffer("buf"), d:date});
	delim();
	fos.writeAny([undefined, null, true, false, 1234, "str", new Buffer("buf"), date]);
	delim();
	fos.writeAny({0:[{1:[2]}]});
	delim();
	fos.writeAny(function(){});
	delim();
	fos.writeAny(new TypeError("type"));
	delim();
	fos.writeAny(new ReferenceError("reference"));
	delim();
	fos.writeAny(new RangeError("range"));
	delim();
	fos.writeAny(new SyntaxError("syntax"));
	delim();
	fos.writeAny(new Error("error"));
	delim();

	A={name:"A"};
	B=["B"];
	A.b=B;
	B[1]=A;
	fos.writeAny(A);
	delim();
	fos.writeAny(B);
	delim();
}

testread_pc = 0;

function testread(data0){
	data = data0;
	var idx = 0;
	switch(testread_pc++){
	case idx++:
		assert("data === 1");
		return;
	case idx++:
		return;
	case idx++:
		assert("data === 10000000000");
		return;
	case idx++:
		return;
	case idx++:
		assert("data === 0.5");
		return;
	case idx++:
		return;
	case idx++:
		assert("data === 'abcdef'");
		return;
	case idx++:
		return;
	case idx++:
		b = data;
		assert("b instanceof Buffer");
		assert("b.toString() === '12345f'");
		return;
	case idx++:
		return;

	case idx++:
		obj=data;
		assert("obj.u === undefined");
		assert("obj.n === null");
		assert("obj.t === true");
		assert("obj.f === false");
		assert("obj.num === 1234");
		assert("obj.s === 'str'");
		assert("obj.b instanceof Buffer");
		assert("obj.b.toString() === 'buf'");
		assert("obj.d instanceof Date");
		assert("obj.d.valueOf() === date.valueOf()");
		return;
	case idx++:
		return;

	case idx++:
		arr=data;
		assert("arr[0] === undefined");
		assert("arr[1] === null");
		assert("arr[2] === true");
		assert("arr[3] === false");
		assert("arr[4] === 1234");
		assert("arr[5] === 'str'");
		assert("arr[6] instanceof Buffer");
		assert("arr[6].toString() === 'buf'");
		assert("arr[7] instanceof Date");
		assert("arr[7].valueOf() === date.valueOf()");
		return;
	case idx++:
		return;

	case idx++:
		obj=data;
		assert("obj instanceof Object");
		assert("obj[0] instanceof Array");
		assert("obj[0][0] instanceof Object");
		assert("obj[0][0][1] instanceof Array");
		assert("obj[0][0][1][0] === 2");
	case idx++:
		return;

	case idx++:
		assert("data === undefined");
		return;
	case idx++:
		return;

	case idx++:
		e = data;
		assert("e instanceof TypeError");
		assert("e.message === 'type'");
		return;
	case idx++:
		return;
	case idx++:
		e = data;
		assert("e instanceof ReferenceError");
		assert("e.message === 'reference'");
		return;
	case idx++:
		return;
	case idx++:
		e = data;
		assert("e instanceof RangeError");
		assert("e.message === 'range'");
		return;
	case idx++:
		return;
	case idx++:
		e = data;
		assert("e instanceof SyntaxError");
		assert("e.message === 'syntax'");
		return;
	case idx++:
		return;
	case idx++:
		e = data;
		assert("e instanceof Error");
		assert("e.message === 'error'");
		return;
	case idx++:
		return;

	case idx++:
		a = data;
		assert("a.name === 'A'");
		assert("a.b[0] === 'B'");
		assert("a.b[1] === null");
		return;
	case idx++:
		return;
	case idx++:
		b = data;
		assert("b[0] === 'B'");
		assert("b[1].name === 'A'");
		assert("b[1].b === null");
		return;
	case idx++:
		testread_pc=0;
		return;
	}
	assert("false");
}

die = DataInputEmitter(testread);
fos = DataOutputStream({
	writeRaw:function(buffer){
		die.emit(buffer);
	}
});

testwrite(function(){fos.writeAny(0);fos.flush()});

for(delims=8100; delims < 8200; delims++){
	testwrite(function(){fos.writeAny(new Buffer(delims))});
	fos.flush();
}

console.log("ok");
process.exit(0);

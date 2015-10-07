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

function Object_prototype_mirrorTo(thisValue, argumentsList) {
	var obj = thisValue;
	var dst = argumentsList[0];
	if (Type(obj) !== TYPE_Object) throw VMTypeError();
	if (Type(dst) !== TYPE_Object) throw VMTypeError();
	makeMirror(obj, dst);
}

function makeMirror(obj, dst) {
	obj.ClassID = CLASSID_mirror;
	obj.walkObject = mirror_walkObject;
	obj.writeObject = mirror_writeObject;
	obj.readObject = mirror_readObject;
	obj.DefineOwnProperty = mirror_DefineOwnProperty;
	obj.Put = default_Put;
	obj.mirror = dst;
}

function mirror_DefineOwnProperty(P, Desc, Throw) {
	var obj = this;
	var dst = obj.mirror;
	var r = Object.getPrototypeOf(obj).DefineOwnProperty.call(obj, P, Desc, false);
	if (r === false) {
		if (Throw) throw VMTypeError();
	}
	else {
		Object.getPrototypeOf(dst).DefineOwnProperty.call(dst, P, Desc, false);
	}
	return r;
}

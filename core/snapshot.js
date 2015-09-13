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

var OBJID_BASE=10;

function SnapshotOutputStream(ostream, allObjs) {
	return {
		writeInt : function(x) {
			ostream.writeInt(x);
		},
		writeString : function(x) {
			ostream.writeString(x);
		},
		writeBuffer : function(x) {
			ostream.writeBuffer(x);
		},
		writeAny : function(x) {
			ostream.writeAny(x);
		},
		writeValue : function(x) {
			switch (typeof x) {
			case "undefined":
				ostream.writeInt(1);
				return;
			case "boolean":
				ostream.writeInt((x === true) ? 2 : 3);
				return;
			case "number":
				ostream.writeInt(4);
				ostream.writeNumber(x);
				return;
			case "string":
				ostream.writeInt(5);
				ostream.writeString(x);
				return;
			}
			if (x === null) {
				ostream.writeInt(6);
				return;
			}
			assert(allObjs[x.ID] === x, x);
			ostream.writeInt(x.ID);
		},
	};
}

function SnapshotInputStream(istream, allObjs) {
	return {
		readInt : function() {
			return istream.readInt();
		},
		readString : function() {
			return istream.readString();
		},
		readBuffer : function() {
			return istream.readBuffer();
		},
		readAny : function() {
			return istream.readAny();
		},
		readValue : function() {
			var ID = istream.readInt();
			if (OBJID_BASE <= ID) {
				var obj = allObjs[ID];
				this.assert(obj !== undefined);
				return obj;
			}
			switch (ID) {
			case 1:
				return undefined;
			case 2:
				return true;
			case 3:
				return false;
			case 4:
				return istream.readNumber();
			case 5:
				return istream.readString();
			case 6:
				return null;
			}
			this.assert(false);
		},
		assert : function(condition) {
			if (condition !== true) {
				throw Error("snapshot broken");
			}
		},
	};
}

var systemProperties = {
	stackDepthLimit: undefined,
	LocalTZA: undefined,
	LocalTZAString: undefined,
	INSPECT_MAX_BYTES:  undefined,
};

function writeSnapshot(l_ostream) {
	var allObjs = [];
	allObjs.length = OBJID_BASE;
	var ostream = SnapshotOutputStream(l_ostream, allObjs);
	ostream.writeString("v2.0");

	function mark(obj) {
		if (isSnapshotObject(obj) === false) {
			return;
		}
		if (obj.ID === 0) {
			obj.ID = allObjs.length;
			allObjs.push(obj);
		}
		assert(allObjs[obj.ID ] === obj, obj);
	}
	for(var name in vm){
		mark(vm[name]);
	}
	for(var name in systemProperties){
		mark(global[name]);
	}
	for ( var txid in IOManager_asyncCallbacks) {
		var callback = IOManager_asyncCallbacks[txid];
		mark(callback);
	}
	for ( var txid in IOManager_openPorts) {
		var port = IOManager_openPorts[txid];
		mark(port);
		mark(port.callback);
	}

	ostream.writeString("CLASSID");
	for (var i = OBJID_BASE; i < allObjs.length; i++) {
		var obj = allObjs[i];
		ostream.writeInt(obj.ClassID);
		if (obj.ClassID === CLASSID_SourceObject) {
			obj.writeObject(ostream);
		}
		obj.walkObject(mark);
	}
	ostream.writeInt(0);

	ostream.writeString("CONTENTS");
	for (var i = OBJID_BASE; i < allObjs.length; i++) {
		var obj = allObjs[i];
		if (obj.ClassID !== CLASSID_SourceObject) {
			ostream.writeInt(obj.ID);
			obj.writeObject(ostream);
		}
	}
	ostream.writeInt(0);

	ostream.writeString("VM");
	for(var name in vm){
		ostream.writeString(name);
		ostream.writeValue(vm[name]);
	}
	ostream.writeString("");

	ostream.writeString("SYSTEM");
	for(var name in systemProperties){
		ostream.writeString(name);
		ostream.writeValue(global[name]);
	}
	ostream.writeString("");

	ostream.writeString("IO");
	ostream.writeInt(IOManager_uniqueID);
	for ( var txid in IOManager_asyncCallbacks) {
		var callback = IOManager_asyncCallbacks[txid];
		ostream.writeInt(ToNumber(txid));
		ostream.writeValue(callback);
	}
	ostream.writeInt(0);
	for ( var txid in IOManager_openPorts) {
		var port = IOManager_openPorts[txid];
		assert(ToNumber(txid) === port.txid);
		ostream.writeInt(ToNumber(txid));
		ostream.writeValue(port);
		ostream.writeValue(port.callback);
	}
	ostream.writeInt(0);

	ostream.writeString("FINISH");

	//cleanup
	l_ostream.flush();
	for (var i = OBJID_BASE; i < allObjs.length; i++) {
		var obj = allObjs[i];
		obj.ID = 0;
	}
}

function readSnapshot(l_istream) {
	var allObjs = [];
	allObjs.length = OBJID_BASE;
	var istream = SnapshotInputStream(l_istream, allObjs);
	var version = istream.readString();
	if (version !== "v2.0") {
		throw Error("unsupported format version: " + version);
	}

	istream.assert(istream.readString() ==="CLASSID");
	while (true) {
		var ClassID = istream.readInt();
		if (ClassID === 0) {
			break;
		}
		switch (ClassID) {
		case CLASSID_DeclarativeEnvironment:
			var obj = NewDeclarativeEnvironment();
			break;
		case CLASSID_ObjectEnvironment:
			var obj = NewObjectEnvironment();
			break;
		case CLASSID_SourceObject:
			var obj = SourceObject_readObject(istream);
			break;
		default:
			var obj = VMObject(ClassID);
			break;
		}
		allObjs.push(obj);
	}

	istream.assert(istream.readString() ==="CONTENTS");
	for (var i = OBJID_BASE; i < allObjs.length; i++) {
		var obj = allObjs[i];
		if (obj.ClassID === CLASSID_SourceObject) {
			continue;
		}
		var ID = istream.readInt();
		istream.assert(ID === i);
		obj.readObject(istream);
	}
	istream.assert(istream.readInt() ===0);

	istream.assert(istream.readString() ==="VM");
	while (true) {
		var name = istream.readString();
		if (name === "") {
			break;
		}
		vm[name]=istream.readValue();
	}

	istream.assert(istream.readString() ==="SYSTEM");
	while (true) {
		var name = istream.readString();
		if (name === "") {
			break;
		}
		istream.assert(name in systemProperties);
		global[name ] = istream.readValue();
	}

	istream.assert(istream.readString() ==="IO");
	IOManager_uniqueID = istream.readInt();
	IOManager_asyncCallbacks = {};
	IOManager_openPorts = {};
	while (true) {
		var txid = istream.readInt();
		if (txid === 0) {
			break;
		}
		var callback = istream.readValue();
		IOManager_asyncCallbacks[txid] = callback;
		istream.assert(txid <= IOManager_uniqueID);
		istream.assert(IsCallable(callback));
	}
	while (true) {
		var txid = istream.readInt();
		if (txid === 0) {
			break;
		}
		var port = istream.readValue();
		var callback = istream.readValue();
		IOManager_openPorts[txid] = port;
		port.txid = txid;
		port.callback = callback;
		istream.assert(txid <= IOManager_uniqueID);
		istream.assert(port.ClassID == CLASSID_IOPort);
		istream.assert(IsCallable(callback));
	}

	istream.assert(istream.readString() ==="FINISH");
	Object.freeze(vm);
	istream.assert(checkVM());

	//cleanup
	for (var i = OBJID_BASE; i < allObjs.length; i++) {
		var obj = allObjs[i];
		if (obj.ClassID === CLASSID_SourceObject) {
			obj.subcodes = undefined;
		}
	}
}

function intrinsic_walkObject(O, mark) {
	mark(O.Prototype);
	for ( var P in O.$properties) {
		var prop = O.$properties[P];
		if (prop.Value !== absent) mark(prop.Value);
		if (prop.Get !== absent) mark(prop.Get);
		if (prop.Set !== absent) mark(prop.Set);
	}
}

function intrinsic_writeObject(O, ostream) {
	ostream.writeValue(O.Prototype);
	ostream.writeValue(O.Extensible);
	for ( var P in O.$properties) {
		var prop = O.$properties[P];
		var flag = (prop.Configurable ? 0 : 1) + (prop.Enumerable ? 0 : 2);
		if (IsDataDescriptor(prop)) {
			flag += (prop.Writable ? 0 : 4);
			ostream.writeInt(flag);
			ostream.writeValue(prop.Value);
		}
		else {
			flag += 8;
			ostream.writeInt(flag);
			ostream.writeValue(prop.Get);
			ostream.writeValue(prop.Set);
		}
		ostream.writeString(P);
	}
	ostream.writeInt(16);
}

function intrinsic_readObject(O, istream) {
	O.Prototype = istream.readValue();
	O.Extensible = istream.readValue();
	istream.assert(O.Prototype === null || Type(O.Prototype) === TYPE_Object);
	istream.assert(Type(O.Extensible) === TYPE_Boolean);
	while (true) {
		var flag = istream.readInt();
		if (flag === 16) {
			break;
		}
		istream.assert(flag <= 15);
		if ((flag & 8) === 0) {
			var Value = istream.readValue();
			var P = istream.readString();
			var prop = PropertyDescriptor({
				Value : Value,
				Writable : ((flag & 4) === 0),
				Configurable : ((flag & 1) === 0),
				Enumerable : ((flag & 2) === 0),
			});
			intrinsic_createData(O, P, prop);
		}
		else {
			var Get = istream.readValue();
			var Set = istream.readValue();
			istream.assert(Get === undefined || (Type(Get) === TYPE_Object && Get.Class === "Function"));
			istream.assert(Set === undefined || (Type(Set) === TYPE_Object && Set.Class === "Function"));
			var P = istream.readString();
			var prop = PropertyDescriptor({
				Get : Get,
				Set : Set,
				Configurable : ((flag & 1) === 0),
				Enumerable : ((flag & 2) === 0),
			});
			intrinsic_createAccessor(O, P, prop);
		}
	}
}

function default_walkObject(mark) {
	intrinsic_walkObject(this, mark);
}

function default_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
}

function default_readObject(istream) {
	intrinsic_readObject(this, istream);
}

function BuiltinFunctionObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeString(getIntrinsicFunctionName(this.Call));
	ostream.writeString(getIntrinsicFunctionName(this.Construct));
}

function BuiltinFunctionObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.Call = getIntrinsicFunction(istream.readString());
	this.Construct = getIntrinsicFunction(istream.readString());
	istream.assert(this.Call !== null && this.Call !== undefined);
	istream.assert(this.Construct !== null);
}

function FunctionObject_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	mark(this.Scope);
	mark(this.Code.sourceObject);
}

function FunctionObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.Scope);
	ostream.writeValue(this.Code.sourceObject);
	ostream.writeInt(this.Code.index);
	var length = this.FormalParameters.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		ostream.writeString(this.FormalParameters[i]);
	}
}

function FunctionObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.Scope = istream.readValue();
	var sourceObject = istream.readValue();
	var index = istream.readInt();
	this.Code = sourceObject.subcodes[index];
	var length = istream.readInt();
	this.FormalParameters = [];
	for (var i = 0; i < length; i++) {
		this.FormalParameters[i] = istream.readString();
	}
	istream.assert(Type(this.Scope) === TYPE_Environment);
	istream.assert(this.Code !== undefined);
}

function BindFunction_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	mark(this.TargetFunction);
	mark(this.BoundThis);
	this.BoundArgs.forEach(mark);
}

function BindFunction_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.TargetFunction);
	ostream.writeValue(this.BoundThis);
	var length = this.BoundArgs.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		ostream.writeValue(this.BoundArgs[i]);
	}
}

function BindFunction_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.TargetFunction = istream.readValue();
	this.BoundThis = istream.readValue();
	var length = istream.readInt();
	this.BoundArgs = [];
	for (var i = 0; i < length; i++) {
		this.BoundArgs[i] = istream.readValue();
	}
	istream.assert(Type(this.TargetFunction) === TYPE_Object && this.TargetFunction.Class === "Function");
}

function PrimitiveObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.PrimitiveValue);
}

function PrimitiveObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.PrimitiveValue = istream.readValue();
	this.Class === "String" && istream.assert(Type(this.PrimitiveValue) === TYPE_String);
	this.Class === "Boolean" && istream.assert(Type(this.PrimitiveValue) === TYPE_Boolean);
	this.Class === "Number" && istream.assert(Type(this.PrimitiveValue) === TYPE_Number);
	this.Class === "Date" && istream.assert(Type(this.PrimitiveValue) === TYPE_Number);
}

function RegExp_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
}

function RegExp_readObject(istream) {
	intrinsic_readObject(this, istream);
	try {
		theRegExpFactory.compile(this);
	} catch (e) {
		if (isInternalError(e)) throw e;
		console.log("debug: regexp load error: " + ToString(e));
		console.log("debug: regexp load error: " + this.Get("source"))
	}
}

function Error_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	var length = this.stackTrace.length;
	for (var i = 0; i < length; i++) {
		var func = this.stackTrace[i].func;
		mark(func);
		var code = this.stackTrace[i].code;
		mark(code.sourceObject);
	}
}

function Error_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	var length = this.stackTrace.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		var func = this.stackTrace[i].func;
		var code = this.stackTrace[i].code;
		var pos = this.stackTrace[i].pos;
		ostream.writeValue(func);
		ostream.writeValue(code.sourceObject);
		ostream.writeInt(code.index);
		ostream.writeInt(pos);
	}
}

function Error_readObject(istream) {
	intrinsic_readObject(this, istream);
	var length = istream.readInt();
	this.stackTrace = [];
	for (var i = 0; i < length; i++) {
		var func = istream.readValue();
		var sourceObject = istream.readValue();
		var index = istream.readInt();
		var pos = istream.readInt();
		this.stackTrace[i] = {
			func : func,
			code : sourceObject.subcodes[index],
			pos : pos,
		};
	}
}

function Arguments_walkObject(mark) {
	intrinsic_walkObject(this, mark);
	mark(this.ArgumentsScope);
}

function Arguments_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeValue(this.ArgumentsScope);
	var length = this.ParameterMap.length;
	ostream.writeInt(length);
	for (var i = 0; i < length; i++) {
		ostream.writeValue(this.ParameterMap[i]);
	}
}

function Arguments_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.ArgumentsScope = istream.readValue();
	var length = istream.readInt();
	this.ParameterMap = [];
	for (var i = 0; i < length; i++) {
		var name = istream.readValue();
		this.ParameterMap[i] = name;
		istream.assert(name === undefined || Type(name) === TYPE_String);
	}
	istream.assert(Type(this.ArgumentsScope) === TYPE_Environment);
}

function ObjectEnvironment_walkObject(mark) {
	var envRec = this.environmentRecord;
	mark(this.outer);
	mark(envRec.bindings);
}

function ObjectEnvironment_writeObject(ostream) {
	var envRec = this.environmentRecord;
	ostream.writeValue(this.outer);
	ostream.writeValue(envRec.bindings);
}

function ObjectEnvironment_readObject(istream) {
	var envRec = this.environmentRecord;
	this.outer = istream.readValue();
	envRec.bindings = istream.readValue();
	istream.assert(this.outer === null || Type(this.outer) === TYPE_Environment);
	istream.assert(Type(envRec.bindings) === TYPE_Object);
}

function DeclarativeEnvironment_walkObject(mark) {
	var envRec = this.environmentRecord;
	var $values = envRec.$values;
	mark(this.outer);
	for ( var N in $values) {
		mark($values[N]);
	}
}

function DeclarativeEnvironment_writeObject(ostream) {
	var envRec = this.environmentRecord;
	var $values = envRec.$values;
	var $attributes = envRec.$attributes;
	ostream.writeValue(this.outer);
	for ( var N in $values) {
		ostream.writeInt($attributes[N]);
		ostream.writeValue($values[N]);
		ostream.writeString(N);
	}
	ostream.writeInt(4);
}

function DeclarativeEnvironment_readObject(istream) {
	var envRec = this.environmentRecord;
	var $values = envRec.$values;
	var $attributes = envRec.$attributes;
	this.outer = istream.readValue();
	while (true) {
		var attr = istream.readInt();
		if (attr === 4) {
			break;
		}
		istream.assert(attr <= 3);
		var value = istream.readValue();
		var N = istream.readString();
		$attributes[N] = attr;
		$values[N] = value;
	}
	istream.assert(this.outer === null || Type(this.outer) === TYPE_Environment);
}

function SourceObject_walkObject(mark) {
}

function SourceObject_writeObject(ostream) {
	ostream.writeString(this.source);
	ostream.writeValue(this.strict);
	ostream.writeString(this.filename);
	ostream.writeValue(this.isFunctionBody);
}

function SourceObject_readObject(istream) {
	var source = istream.readString();
	var strict = istream.readValue();
	var filename = istream.readString();
	var isFunctionBody = istream.readValue();
	var subcodes = [];
	if (isFunctionBody) {
		var code = theParser.readFunctionCode(source, [], subcodes, filename);
	}
	else {
		var code = theParser.readProgram(source, strict, subcodes, filename);
	}
	var sourceObject = code.sourceObject;
	sourceObject.subcodes = subcodes;
	return sourceObject;
}

function BufferObject_writeObject(ostream) {
	intrinsic_writeObject(this, ostream);
	ostream.writeBuffer(this.wrappedBuffer);
}

function BufferObject_readObject(istream) {
	intrinsic_readObject(this, istream);
	this.wrappedBuffer = istream.readBuffer();
}

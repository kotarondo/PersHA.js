#!/bin/sh

TARGET=bin/core.js

echo "// This is a generated file by make.sh" >${TARGET}

for file in helper.js unicode.js types.js builtinArray.js builtinBoolean.js builtinBuffer.js builtinDate.js builtinError.js builtinFunction.js builtinGlobal.js builtinIOPort.js builtinJSON.js builtinMath.js builtinNumber.js builtinObject.js builtinRegExp.js builtinString.js compiler.js conversion.js execution.js expression.js fileio.js function.js intrinsic.js iomanager.js journal.js mirror.js parser.js program.js snapshot.js statement.js task.js vm.js
do
	cat core/${file} >>${TARGET}
done

#node main/stripper.js ${TARGET}
#node main/profiler.js ${TARGET}

TARGET=bin/main.js

echo "// This is a generated file by make.sh" >${TARGET}

cat main/main.js  >>${TARGET}

echo "function node_init(){" >>${TARGET}
cat main/init.js >>${TARGET}
echo "}" >>${TARGET}

#!/bin/sh

TARGET=bin/core.js

echo "// This is a generated file by make.sh" >${TARGET}

for file in helper.js dataio.js bsocketio.js
do
	cat main/${file} >>${TARGET}
done

for file in unicode.js types.js compiler.js regexp_compiler.js builtinArray.js builtinBoolean.js builtinBuffer.js builtinDate.js builtinError.js builtinFunction.js builtinGlobal.js builtinIOPort.js builtinJSON.js builtinMath.js builtinNumber.js builtinObject.js builtinRegExp.js builtinString.js consensus.js conversion.js execution.js expression.js function.js intrinsic.js iomanager.js mirror.js parser.js program.js snapshot.js statement.js task.js vm.js
do
	cat core/${file} >>${TARGET}
done

echo "function node_init(){" >>${TARGET}
cat main/init.js >>${TARGET}
echo "}" >>${TARGET}

[ -e "main/enableStripper" ] && node main/stripper.js ${TARGET}
[ -e "main/enableProfiler" ] && node main/profiler.js ${TARGET}

TARGET=bin/main.js

echo "// This is a generated file by make.sh" >${TARGET}

for file in helper.js dataio.js fileio.js serverA.js serverS.js main.js journal.js 
do
	cat main/${file} >>${TARGET}
done

cat main/core_main.js  > bin/core_main.js

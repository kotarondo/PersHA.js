#!/bin/sh

TARGET=bin/persha.js

echo "// This is a generated file by make.sh" >${TARGET}

for file in core/*.js
do
	cat ${file} >>${TARGET}
done

echo "function node_init(){" >>${TARGET}
cat main/init.js >>${TARGET}
echo "}" >>${TARGET}

cat main/main.js >>${TARGET}

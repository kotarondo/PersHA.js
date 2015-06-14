#!/bin/sh

TARGET=../bin/persha.js

echo "// This is an generated file." >${TARGET}

for file in ../core/*.js
do
	cat ${file} >>${TARGET}
done

echo "function persha_initdb(){" >>${TARGET}
cat initdb.js >>${TARGET}
echo "}" >>${TARGET}

cat main.js >>${TARGET}

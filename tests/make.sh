#!/bin/sh

SRCFILE=.testdata/test.js

echo >${SRCFILE}

for file in ../jsvm/*.js
do
cat ${file} >>${SRCFILE}
done

for file in ../io/*.js
do
cat ${file} >>${SRCFILE}
done

cat $* >>${SRCFILE}

node --debug ${SRCFILE}

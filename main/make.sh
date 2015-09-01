#!/bin/sh

pushd `dirname $0` > /dev/null
SRCPATH=`pwd -P`
popd > /dev/null

TARGET=${SRCPATH}/../bin/persha.js

echo "// This is a generated file." >${TARGET}

for file in ${SRCPATH}/../core/*.js
do
	cat ${file} >>${TARGET}
done

echo "function persha_initdb(){" >>${TARGET}
cat ${SRCPATH}/initdb.js >>${TARGET}
echo "}" >>${TARGET}

cat ${SRCPATH}/main.js >>${TARGET}

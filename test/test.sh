#!/bin/sh

TESTS="node test262 comp"

cd $(dirname $0)
WORKINGDIR=$(pwd -P)

doTest(){
cd $WORKINGDIR
cd $1 || return 1
./test.sh
}

failed=0
for i in $TESTS
do
doTest $i
[ $? -ne 0 ] && failed=1
done

exit $failed

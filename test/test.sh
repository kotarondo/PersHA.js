#!/bin/sh

TESTS="node test262"

cd $(dirname "$0")
WORKINGDIR=$(pwd -P)

doTest(){
cd "$WORKINGDIR"
cd $1 || return 1
./test.sh
}

failed=0
for i in $TESTS
do
echo testing $i
doTest $i
[ $? -ne 0 ] && failed=1
done

exit $failed

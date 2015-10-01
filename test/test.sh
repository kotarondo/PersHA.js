#!/bin/sh

TESTS="node test262"

doTest(){
cd $1 >/dev/null
[ $? -ne 0 ] && return 1
./test.sh
}

pushd `dirname $0` >/dev/null
failed=0

for i in $TESTS
do
echo testing $i
pushd . >/dev/null
doTest $i
[ $? -ne 0 ] && failed=1
popd >/dev/null
done

exit $failed

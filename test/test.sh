#!/bin/sh

TESTS="node comp v8bench test262"

cd $(dirname $0)
WORKINGDIR=$(pwd -P)

(cd ..; ./main/make.sh)
export PATH=$WORKINGDIR/../bin:$PATH

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

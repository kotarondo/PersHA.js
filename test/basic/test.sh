#!/bin/sh

TIMEOUT=100

killer(){
t=$TIMEOUT
while [ $t -gt 0 ]; do
t=$(expr $t - 1)
sleep 1
kill -0 $1 >/dev/null 2>&1 || return
done
echo killing ...
kill $1 >/dev/null 2>&1
}

timeout(){
$* &
pid=$!
killer $pid &
wait $pid
}

rm -rf results
mkdir -p results
rm -rf tmp
mkdir -p tmp
failed=0

node ./echo-server &
ECHO_SERVER_PID=$!
npm install blocking-socket

for i in test-*.js
do
f=${i##*/}
j=${f%%.js}
echo $j
timeout node $i >results/$j 2>&1
EXITCODE=$?
[ $EXITCODE -ne 0 ] && echo EXITCODE=$EXITCODE >>results/$j && cat results/$j
[ $EXITCODE -ne 0 ] && failed=1 && echo FAILED: $j >>results/failed && continue

done

kill $ECHO_SERVER_PID

cat results/failed
exit $failed

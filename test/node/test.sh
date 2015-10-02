#!/bin/sh

TIMEOUT=300

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
failed=0

for i in test/simple/*.js
do
f=${i##*/}
j=${f%%.js}
echo $j
rm -rf test/tmp
mkdir -p test/tmp
if [ "$j" = "test-stdout-close-unref" ]; then
	persha -init $i >results/$j 2>&1
else
	timeout persha -init $i >results/$j 2>&1
fi
EXITCODE=$?
[ $EXITCODE -ne 0 ] && failed=1 && echo FAILED: $j >>results/failed
[ $EXITCODE -ne 0 ] && echo EXITCODE=$EXITCODE >>results/$j && cat results/$j
done

cat results/failed
exit $failed

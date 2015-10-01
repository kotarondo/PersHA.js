#!/bin/sh

TIMEOUT=300

killer(){
t=$TIMEOUT
while (( t > 0 )); do
(( t = t - 1 ))
sleep 1
kill -0 $1 >/dev/null 2>&1 || return
done
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
timeout persha -init $i >results/$j 2>&1
[ $? -ne 0 ] && failed=1 && echo FAILED: $j >results/failed && cat results/$j
done

cat results/failed
exit $failed

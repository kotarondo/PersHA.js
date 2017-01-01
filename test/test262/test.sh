#!/bin/sh

persha -init test262.js
EXITCODE=$?

while [ $EXITCODE -eq 123 ]; do
	persha -restart
	EXITCODE=$?
done

exit $EXITCODE

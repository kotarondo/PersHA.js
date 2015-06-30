/*
 Copyright (c) 2015, Kotaro Endo.
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above
    copyright notice, this list of conditions and the following
    disclaimer in the documentation and/or other materials provided
    with the distribution.
 
 3. Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived
    from this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

var JOURNAL_FILEBASE;
var MAX_CHECKPOINT_FILES = 8;

var Journal_currentFileNo;
var Journal_currentGen;
var Journal_inputStream;
var Journal_outputStream;

function Journal_read() {
	if (Journal_inputStream === undefined) {
		return undefined;
	}
	try {
		var position = Journal_inputStream.getPosition();
		return Journal_inputStream.readAny();
	} catch (e) {
		Journal_closeInputStream();
		Journal_openLog(position);
		return undefined;
	}
}

function Journal_write(entry) {
	if (Journal_outputStream === undefined) {
		return;
	}
	Journal_outputStream.writeAny(entry);
	Journal_outputStream.flush();
}

function Journal_start() {
	var maxFileNo = undefined;
	var maxGen = 1;
	for (var i = 0; i < MAX_CHECKPOINT_FILES; i++) {
		Journal_currentFileNo = i;
		var hcpt = Journal_readCheckpointHeader();
		var hlog = Journal_readLogHeader();
		if (hcpt === null || hlog === null || hcpt.gen !== hlog.gen || hlog.gen < maxGen) {
			continue;
		}
		maxFileNo = i;
		maxGen = hlog.gen;
	}
	if (maxFileNo === undefined) {
		return false;
	}
	Journal_currentFileNo = maxFileNo;
	Journal_currentGen = maxGen;
	Journal_readCheckpointHeader();
	readSnapshot(Journal_inputStream);
	Journal_readLogHeader();
	return true;
}

function Journal_checkpoint() {
	console.log("journal checkpoint ");//debug
	Journal_currentFileNo = (Journal_currentFileNo + 1) % MAX_CHECKPOINT_FILES;
	Journal_currentGen++;
	Journal_clearLogHeader();
	Journal_writeCheckpointHeader();
	writeSnapshot(Journal_outputStream);
	Journal_writeLogHeader();
}

function Journal_init() {
	for (var i = 0; i < MAX_CHECKPOINT_FILES; i++) {
		Journal_currentFileNo = i;
		Journal_clearLogHeader();
	}
	Journal_currentFileNo = 0;
	Journal_currentGen = 1;
	Journal_clearLogHeader();
	Journal_writeCheckpointHeader();
	writeSnapshot(Journal_outputStream);
	Journal_writeLogHeader();
}

function Journal_readCheckpointHeader() {
	Journal_closeInputStream();
	try {
		Journal_inputStream = FileInputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "cp.bin");
		var header = Journal_inputStream.readAny();
		if (isPrimitiveValue(header) || header.magic !== "checkpoint") {
			return null;
		}
		return header;
	} catch (e) {
		return null;
	}
}

function Journal_readLogHeader() {
	Journal_closeInputStream();
	try {
		Journal_inputStream = FileInputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin");
		var header = Journal_inputStream.readAny();
		if (isPrimitiveValue(header) || header.magic !== "log") {
			return null;
		}
		return header;
	} catch (e) {
		return null;
	}
}

function Journal_writeCheckpointHeader() {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "cp.bin");
	var header = {
		magic : "checkpoint",
		gen : Journal_currentGen,
	};
	Journal_outputStream.writeAny(header);
	Journal_outputStream.flush();
}

function Journal_writeLogHeader() {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin");
	var header = {
		magic : "log",
		gen : Journal_currentGen,
	};
	Journal_outputStream.writeAny(header);
	Journal_outputStream.flush();
}

function Journal_clearLogHeader() {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin");
	Journal_outputStream.writeAny({});
	Journal_outputStream.flush();
}

function Journal_openLog(position) {
	Journal_closeOutputStream();
	Journal_outputStream = FileOutputStream(JOURNAL_FILEBASE + Journal_currentFileNo + "log.bin", true);
	Journal_outputStream.setPosition(position);
}

function Journal_closeInputStream() {
	if (Journal_inputStream !== undefined) {
		Journal_inputStream.close();
		Journal_inputStream = undefined;
	}
}

function Journal_closeOutputStream() {
	if (Journal_outputStream !== undefined) {
		Journal_outputStream.close();
		Journal_outputStream = undefined;
	}
}

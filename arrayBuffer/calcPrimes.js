const { Worker, parentPort, workerData } = require("worker_threads");

// Get init data from mainThread
const size = workerData.size;
const start = workerData.start;
const limit = workerData.limit;
var curr = workerData.curr;
const sieve = new Int8Array(workerData.sieve);

// While the current factor is less than eq limit
// While the current factor is less than eq last element of thread
while (curr <= limit && curr <= start + size - 1) {
    // if sieve isn't marked by anyone else
    // alter to >=0 to check performance for repeating elements

    // If start is not multiple of curr, index = the extra elems needed
    if (start % curr) {
        var index = curr - (start % curr);
    } else {
        // if start is multiple of curr, index = 0
        var index = 0;
    }

    // loop through each index, incrementing by curr, till size of segment exhausted
    for (index; index < size; index += curr) {
        // Not changing if start+index is same as curr
        if (start + index != curr) {
            // Else altering flag to 1, as factor found
            // -2, since 0 indexed and first element is 2 and not 1
            sieve[index] = 1;
        }
    }

    // incrementing curr here =>
    curr += 1;
}

parentPort.postMessage(sieve);
parentPort.close();

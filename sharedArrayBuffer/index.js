const os = require("os");
const path = require("path");
const { Worker, parentPort, workerData } = require("worker_threads");

const cpuCount = os.cpus().length;
const workerPath = path.resolve(__dirname + "/calcPrimes.js");

const calculatePrimes = number => {
    return new Promise((resolve, reject) => {
        // constant cannot be changed through re-assignment
        // constant cannot be changed through re-declaration
        const numbers = [];

        // Creating a shared array buffer of size => number-1, since 1 is not counted for prime
        const area = new SharedArrayBuffer(number - 1);
        const sieve = new Int8Array(area);

        // When passing a whole array to worker thread, it makes a copy of the array and no changes made there
        // Gives a stack overflow error even for calculating upto 1000000 as a copy is made and passed to all threads
        // const sieve = new Array(number-1).fill(0);

        // Get start value and size of each segment, that is passed to the threads

        // ceil so as to distribute the leftout equally among threads
        const segmentSize = Math.ceil((number - 1) / cpuCount);
        var segments = [];

        for (let segmentIndex = 0; segmentIndex < cpuCount; segmentIndex++) {
            const start = segmentIndex * segmentSize;
            const segment = [start, segmentSize];
            segments.push(segment);
        }

        // The limit till which we need to check for primes
        const limit = Math.ceil(Math.sqrt(number));

        // initialise worker with static global data
        const workers = segments.map(segment => {
            // Create a promise for each worker
            return new Promise((resolve, reject) => {
                // creating a worker with the some inital workerData
                const worker = new Worker(workerPath, {
                    workerData: {
                        start: segment[0],
                        size: segment[1],
                        curr: 2,
                        limit: limit,
                        sieve: sieve
                    }
                });

                // When worker emits, message | error | exit events
                worker.on("message", resolve);
                worker.on("error", reject);
                worker.on("exit", code => {
                    if (code !== 0)
                        reject(
                            new Error(`Worker stopped with exit code ${code}`)
                        );
                });
            });
        });

        // When all the workers have completed processing, and returned data in order, and in sync
        Promise.all(workers).then(res => {
            // Iterating through shared buffer once, all threads have parsed, and adding elems having 0 to primes
            let counter = 2;
            const primes = [];
            sieve.forEach(elem => {
                if (elem == 0) {
                    primes.push(counter);
                }
                counter += 1;
            });

            // Logging number of primes, and the time to process

            resolve(primes.length);
        });
    });
};

module.exports = calculatePrimes;
/* 
TODO =>
1. Analysis for SharedBufferArray v/s NormalArray
2. Recurring same process on worker thread after messaging mainThread
3. Message passing efficiency
    3.1 Arrays
    3.2 SharedArrayBuffers
    3.3 Objects
*/

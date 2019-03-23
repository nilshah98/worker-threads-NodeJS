const os = require("os");
const path = require("path");
const { Worker, parentPort, workerData } = require("worker_threads");
const inquirer = require("inquirer");
const ora = require("ora");

const cpuCount = os.cpus().length;
const workerPath = path.resolve("calcPrimes.js");

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

const normalSieve = n => {
    return new Promise((resolve, reject) => {
        // Eratosthenes algorithm to find all primes under n
        var array = [],
            upperLimit = Math.sqrt(n),
            output = [];

        // Make an array from 2 to (n - 1)
        for (var i = 0; i < n; i++) {
            array.push(true);
        }

        // Remove multiples of primes starting from 2, 3, 5,...
        for (var i = 2; i <= upperLimit; i++) {
            if (array[i]) {
                for (var j = i * i; j < n; j += i) {
                    array[j] = false;
                }
            }
        }

        // All array[i] set to true are primes
        for (var i = 2; i < n; i++) {
            if (array[i]) {
                output.push(i);
            }
        }

        resolve(output.length);
    });
};

const run = async () => {
    const { primeRange } = await inquirer.prompt([
        {
            type: "input",
            name: "primeRange",
            message: "Find primes till ?",
            default: 100
        }
    ]);
    // Written using then
    // calculatePrimes(primeRange).then((res) => {
    //     spinner.succeed(`Number of primes : ${res[0]}`)
    // });
    const NS_PER_SEC = 1e9;


    const spinner = ora("Calculating number of primes-").start();
    const stTime = process.hrtime();
    var res = await calculatePrimes(primeRange);
    const endTime = process.hrtime(stTime);
    spinner.succeed(`(worker) Number of primes : ${res}`);
    const time1 = endTime[0] * NS_PER_SEC + endTime[1];
    spinner.stopAndPersist(
        {
            "text":`(worker) Benchmark took   : ${time1} nanoseconds\n`,
            "symbol":"⌛"
        }
    );

    const spinner2 = ora("Calculating number of primes-").start();
    const stTime2 = process.hrtime();
    var res = await normalSieve(primeRange);
    const endTime2 = process.hrtime(stTime2);
    spinner2.succeed(`(main)   Number of primes : ${res}`);
    const time2 = endTime2[0] * NS_PER_SEC + endTime2[1];
    spinner2.stopAndPersist(
        {
            "text":`(main)   Benchmark took   : ${time2} nanoseconds\n`,
            "symbol":"⌛"
        }
    );
    spinner2.stopAndPersist({"text":`Difference between worker and main : ${(time2 - time1)} nanoseconds`,"symbol":"⏱️"});
};  


run();

/* 
TODO =>
0. Clean calculateTime function
1. Analysis for SharedBufferArray v/s NormalArray
2. Recurring same process on worker thread after messaging mainThread
3. Message passing efficiency
    3.1 Arrays
    3.2 SharedArrayBuffers
    3.3 Objects
*/

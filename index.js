const os = require("os");
const path = require("path");
const { Worker, parentPort, workerData } = require("worker_threads");

const cpuCount = os.cpus().length;
const workerPath = path.resolve("calcPrimes.js");

const calculatePrimes = number => {
    // constant cannot be changed through re-assignment
    // constant cannot be changed through re-declaration
    const numbers = [];

    const area = new SharedArrayBuffer(number-1);
    const sieve = new Int8Array(area);
    for (let i = 2; i <= number; i++) {
        numbers.push(i);
    }
    // console.log(sieve);
    // ceil so as to distribute the leftout equally among threads
    const segmentSize = Math.ceil(numbers.length / cpuCount);
    var segments = [];

    for (let segmentIndex = 0; segmentIndex < cpuCount; segmentIndex++) {
        const start = segmentIndex * segmentSize;
        const end = start + segmentSize;
        const segment = numbers.slice(start, end);
        segments.push(segment);
    }

    // console.log(segments);
    // console.log(numbers);

    const limit = Math.ceil(Math.sqrt(number));

    // initialise worker with static global data =>
    var startTime = Date.now();
    const workers = segments.map(segment => {
        return new Promise((resolve, reject) => {
            var worker = new Worker(workerPath, {
                workerData: {
                    start: segment[0],
                    limit: limit,
                    size: segment.length,
                    curr: 2,
                    sieve: sieve
                }
            });
            worker.on("message", resolve);
            worker.on("error", reject);
            worker.on("exit", code => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    });

    Promise.all(workers).then(res => {
        let counter = 2;
        const primes = [];
        sieve.forEach(elem => {
            if (!(elem !== 0)) {
                primes.push(counter);
            }
            counter += 1;
        });
        console.log(primes.length);
        console.log(Date.now() - startTime);
    });

    // var start = 2;

    // const calculate = (workers, segmentss, startTime) => {

    //     var promises = workers.map((worker, index) => {
    //         return new Promise((resolve, reject) => {
    //             worker.on("message", resolve);
    //             worker.on("error", reject);
    //             worker.on("exit", code => {
    //                 if (code !== 0)
    //                     reject(
    //                         new Error(`Worker stopped with exit code ${code}`)
    //                     );
    //             });
    //         });
    //     });

    //     workers.forEach((worker, index) => {
    //         worker.postMessage({
    //             data: segmentss[index],
    //             curr: start
    //         });
    //     });

    //     Promise.all(promises).then(results => {
    //         // console.log(results, start);
    //         start += 1;

    //         if (start <= limit) {
    //             calculate(workers, results, startTime);
    //         } else {
    //             let counter = 2;
    //             const primes = [];
    //             results.forEach(res => {
    //                 res.forEach(elem => {
    //                     if (elem == 0) {
    //                         primes.push(counter);
    //                     }
    //                     counter += 1;
    //                 });
    //             });
    //             console.log(primes.length);
    //             console.log(Date.now() - startTime);
    //         }
    //     });
    // };

    // var sieve = [];
    // segments.forEach(segment => {
    //     sieve.push(new Array(segment.length).fill(0));
    // });

    // var startTime = Date.now();
    // calculate(workers, sieve, startTime);
};

calculatePrimes(10000000);

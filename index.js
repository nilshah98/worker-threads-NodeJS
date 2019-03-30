const inquirer = require("inquirer");
const ora = require("ora");

const array = require("./array");
const arrayBuffer = require("./arrayBuffer");
const sharedArrayBuffer = require("./sharedArrayBuffer");
const normalSieve = require("./normalSieve");

const NS_PER_SEC = 1e9;

const calcTime = async (inp,func,label) => {
    const spinner = ora("Calculating number of primes-").start();
    const stTime = process.hrtime();
    var res = await func(inp);
    const endTime = process.hrtime(stTime);
    spinner.succeed(` (${label}) Number of primes : ${res}`);
    const time = endTime[0] * NS_PER_SEC + endTime[1];
    spinner.stopAndPersist(
        {
            "text":`(${label}) Benchmark took   : ${time} nanoseconds\n`,
            "symbol":"⌛"
        }
    );
    return time;
}

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

    const workerArrayTime = await calcTime(primeRange,array,"worker array");
    const workerArrayBufferTime = await calcTime(primeRange,arrayBuffer,"worker arrayBuffer");
    const workerSharedArrayBufferTime = await calcTime(primeRange,sharedArrayBuffer,"worker sharedArrayBuffer");
    const localTime = await calcTime(primeRange,normalSieve,"main");
    console.log(`⏱️ Time difference between worker (sharedArrayBuffer) and main thread : ${localTime-workerSharedArrayBufferTime} nanoseconds`);

};  

run();
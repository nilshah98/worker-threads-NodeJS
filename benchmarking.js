const Benchmark = require("benchmark");
const ora = require("ora");
const inquirer = require("inquirer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const spinner = ora("Starting Benchmarking");
const suite = new Benchmark.Suite({
    onStart: () => {
        spinner.start("Starting Benchmarking");
    },
    onComplete: () => {
        spinner.stop();
    }
});
const csvWriter = createCsvWriter({
    append: true,
    path: "benchmark.csv",
    header: [
        { id: "range", title: "Range" },
        { id: "thread", title: "Thread" },
        { id: "DS", title: "DS" },
        { id: "meanTime", title: "Mean-Time" },
        { id: "noOfTest", title: "No.-Of-Tests" }
    ]
});

const sharedBufferPrime = require("./sharedArrayBuffer");
const arrayBuffer = require("./arrayBuffer");
const array = require("./array");
const normalSieve = require("./normalSieve");

const data = [];
const run = async () => {
    const { primeRange } = await inquirer.prompt([
        {
            type: "input",
            name: "primeRange",
            message: "Benchmark till ?",
            default: 100
        }
    ]);

    suite
        .add(String(primeRange) + " sharedArrayBuffer", {
            defer: true,
            fn: async deferred => {
                await sharedBufferPrime(primeRange);

                deferred.resolve();
            }
        })
        .add(String(primeRange) + " arrayBuffer", {
            defer: true,
            fn: async deferred => {
                await arrayBuffer(primeRange);
                deferred.resolve();
            }
        })
        .add(String(primeRange) + " array", {
            defer: true,
            fn: async deferred => {
                await array(primeRange);
                deferred.resolve();
            }
        })
        .add(String(primeRange) + " normalSieve", {
            defer: true,
            fn: async deferred => {
                await normalSieve(primeRange);
                deferred.resolve();
            }
        })
        // add listeners
        .on("cycle", function(event) {
            spinner.stopAndPersist({
                text: `${event.target.name} Cycle finished`,
                symbol: "⌛"
            });
            if(event.target.name.split(" ")[1] == "normalSieve"){
                var label = "main";
            }else{
                var label = "worker"
            }
            data.push({
                range: event.target.name.split(" ")[0],
                thread: label,
                DS: event.target.name.split(" ")[1],
                meanTime: event.target.stats.mean,
                noOfTest: event.target.stats.sample.length
            });
            console.log(`Mean Exec time : ${event.target.stats.mean} seconds`);
            console.log(
                "Number of tests : " + event.target.stats.sample.length
            );
            spinner.start();
        })
        .on("complete", function() {
            // console.log('Fastest is ' + this.filter('fastest').map('name'));
            csvWriter
                .writeRecords(data)
                .then(() =>
                    console.log("The CSV file was written successfully")
                );
        })
        // run async
        .run({ async: true });
};

run();

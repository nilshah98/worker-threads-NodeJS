const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const sharedBufferPrime = require("./sharedArrayBuffer/main")



const inps = [100000000];
inps.forEach((num) => {

    suite.add(String(num) + " test", {
        defer: true,
        fn: async (deferred) => {
            await sharedBufferPrime.calcPrime(num);
            deferred.resolve();
        }       
    })
})

suite
  // add listeners
  .on('cycle', function(event) {
    console.log(event.target.name);
    console.log(event.target.stats.mean);
    console.log(event.target.stats.sample.length);
  })
  .on('complete', function() {
    // console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });
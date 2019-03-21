const sieve = (max,startTime) => {
    // Make array of length max and fill with true

    const sieve = new Array(max).fill(true)
  
    // Iterate from 2 until square root of max
    for (let i = 2; i < Math.sqrt(max); i++) {
      // If the number is labelled a prime then we can start at i^2 and mark every multiple of i
      // from there as NOT a prime
        for (let j = Math.pow(i, 2); j < max; j += i) {
          sieve[j] = false
      }
    }
  
    var primes = [];

    sieve.forEach((val,index) => {
        if(val){
            primes.push(index+2);
        }
    })

    console.log(primes.length);
    console.log(Date.now() - startTime);

  }

var startTime = Date.now();
sieve(100000,startTime)
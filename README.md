# TODO:
- Worker Thread intro
- - What?
- - Why?
- - Links
- - Operations
- - - Initialise
- - - Message Passing
- Data Structure Intro
- - Array
- - - Serialise
- - ArrayBuffer
- - SharedArrayBuffer
- - - Atomics
- CLI
- BenchMarking

# Benchmarks
## CPU
`CPU family:          6 `  
`Model name:          Intel(R) Core(TM) i5-8600K CPU @ 3.60GHz  `

## OS
### Ubuntu 18.04

| Range    | Thread | DataStructure     | MeanExecTime(in secs)    | NumberOfCycles | 
|----------|--------|-------------------|--------------------------|----------------| 
| 100      | worker | sharedArrayBuffer | 0.05451655452083334      | 48             | 
| 100      | worker | arrayBuffer       | 0.05048775225490198      | 51             | 
| 100      | worker | array             | 0.05209960375510204      | 49             | 
| 100      | main   | normalSieve       | 0.0000026189117609852627 | 88             | 
| 1000     | worker | sharedArrayBuffer | 0.05594300798936169      | 47             | 
| 1000     | worker | arrayBuffer       | 0.06054065555844155      | 77             | 
| 1000     | worker | array             | 0.06030849465384614      | 78             | 
| 1000     | main   | normalSieve       | 0.000025705733772647114  | 88             | 
| 10000    | worker | sharedArrayBuffer | 0.07244938477611937      | 67             | 
| 10000    | worker | arrayBuffer       | 0.05967241462068965      | 58             | 
| 10000    | worker | array             | 0.06134170045454545      | 77             | 
| 10000    | main   | normalSieve       | 0.00028022878913731803   | 83             | 
| 100000   | worker | sharedArrayBuffer | 0.06629550497260277      | 73             | 
| 100000   | worker | arrayBuffer       | 0.06146969272727272      | 77             | 
| 100000   | worker | array             | 0.07276433691044777      | 67             | 
| 100000   | main   | normalSieve       | 0.003791498413793104     | 87             | 
| 1000000  | worker | sharedArrayBuffer | 0.08153615076666666      | 60             | 
| 1000000  | worker | arrayBuffer       | 0.08271871261666669      | 60             | 
| 1000000  | worker | array             | 0.15392867627777776      | 36             | 
| 1000000  | main   | normalSieve       | 0.04862653041509433      | 53             | 
| 10000000 | worker | sharedArrayBuffer | 0.1780489309032258       | 31             | 
| 10000000 | worker | arrayBuffer       | 0.23233239540000003      | 25             | 
| 10000000 | worker | array             | 1.465544911125           | 8              | 
| 10000000 | main   | normalSieve       | 1.631624435625           | 8              | 
| 20000000 | worker | sharedArrayBuffer | 0.36814615133333334      | 18             | 
| 20000000 | worker | arrayBuffer       | 0.8236841264000001       | 10             | 
| 20000000 | worker | array             | 3.2359141328333334       | 6              | 
| 20000000 | main   | normalSieve       | 3.213333790833333        | 6              | 

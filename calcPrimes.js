const {Worker, parentPort, workerData} = require('worker_threads');

const size = workerData.size;
const start = workerData.start;
const limit = workerData.limit;
var curr = workerData.curr;
const sieve = new Array(size).fill(0);

while(curr <= limit && curr <= (start+size-1) ){
    if(start % curr){
        var index = curr - (start % curr);
    }else{
        var index = 0;
    }
    
    for(index; index<size; index += curr){
        if((start + index) != curr){
            sieve[index] = 1;
        }
    }

    curr += 1

}

parentPort.postMessage(sieve);

// parentPort.on("message",(data) => {

//     if(start % data.curr){
//         var index = data.curr - (start % data.curr);
//     }else{
//         var index = 0;
//     }
    
//     for(index; index<size; index += data.curr){
//         if((start + index) != data.curr){
//             data.data[index] = 1;
//         }
//     }

//     // console.log(sievex);
//     // console.log(data.curr);
//     // console.log(results,data.start);
//     // parentPort.postMessage(data.data);
//     // parentPort.close();

//     if(data.curr == limit){
//         parentPort.close();
//     }
// })


const {Worker, parentPort, workerData} = require('worker_threads');

const size = workerData.size;
const start = workerData.start;
const limit = workerData.limit;

parentPort.on("message",(data) => {

    if(start % data.curr){
        var index = data.curr - (start % data.curr);
    }else{
        var index = 0;
    }
    
    for(index; index<size; index += data.curr){
        if((start + index) != data.curr){
            data.data[index] = 1;
        }
    }

    // console.log(data.curr);
    // console.log(results,data.start);
    parentPort.postMessage(data.data);

    if(data.curr == limit){
        parentPort.close();
    }
})


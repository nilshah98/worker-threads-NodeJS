### Async Await
- A function has to be async if it uses await keyword within it
- Await keyword can be used to wait for promise to get resolved or async functions to get resolved
- An async function can be awaited as well

### Promises
- Returns a promise object which can either return resolve, or reject and accordingly call .then() or .catch()
- After a `Promise` is resolved, it cannot go back to pending state. More so, causing `Promise.all()` to execute for each single instance as well, now.

### ArrayBuffer.transfer()
- [ArrayBuffer.transfer()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer) method is still in experimental phase, so had to slice it, like polyfills would

### Array.forEach()
- Can't use a break statement in it

### Module Exports
- While requiring an exported module, the parser goes through the whole of required file, and executes everything, if a function is called, that will run
- Whereas only the exported ones are put into context


### Errors
- Need to fill Array object before passing, else recieve something like - `<2 empty items>` in console.
- Fixed relative path issues while exporting, use `__dirname` or other special variables like `__filename`
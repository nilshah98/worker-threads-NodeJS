# Async Await
- A function has to be async if it uses await keyword within it
- Await keyword can be used to wait for promise to get resolved or async functions to get resolved
- An async function can be awaited as well

# Promises
- Returns a promise object which can either return resolve, or reject and accordingly call .then() or .catch()

# ArrayBuffer.transfer()
- ArrayBuffer.transfer() method is still in experimental phase, so had to slice it, like polyfills would

# Array.forEach()
- Can't use a break statement in it

# Module Exports
- While requiring an exported module, the parser goes through the whole of required file, and executes everything, if a function is called, that will run
- Whereas only the exported ones are put into context
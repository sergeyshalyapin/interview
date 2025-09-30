Node.js ---- progress: 50%
========
<br>

<details class="success">
  <summary>
    0: What are the core differences between Node.js and traditional server-side platforms like PHP or Java (Servlets), especially in terms of concurrency and execution model?
  </summary>

  <p class="short-answer">
    The core difference between Node.js and traditional platforms like PHP or Java (Servlets) lies in their execution model and how they handle concurrent client requests.
  </p>

  1. Concurrency Model

  | Aspect | Node.js | PHP / Java (Servlets) |
  |----|----|----|
  | Concurrency Model | Single-threaded + Non-blocking I/O | Multi-threaded (blocking by default) |
  | Execution | Event loop & callback-based | Each request handled by a new thread |
  | Thread Overhead | Low (one thread handles many requests) | High (one thread per request) |
  | Scalability | High for I/O-bound tasks | Limited by number of OS threads |

  2. Performance Differences
  * Node.js excels at I/O-bound tasks: APIs, chat apps, streaming, real-time apps.
  * PHP/Java are better suited for CPU-intensive workloads where multithreading helps.

  3. Developer Paradigm
  * Node.js encourages async programming using callbacks, promises, or async/await.
  * PHP/Java are traditionally synchronous and blocking, though modern Java can use non-blocking patterns with frameworks like Spring WebFlux.

  4. Environment
  * Node.js runs JavaScript on the server with npm ecosystem.
  * PHP has its own runtime and ecosystem.
  * Java uses JVM and class-based OOP structures.

  <p class="conclusion">
    In summary, Node.js is optimized for handling many lightweight connections concurrently with minimal resource usage, while traditional servers rely on parallel threads, which are more resource-intensive.
  </p>
</details>

<details class="success">
  <summary>
    <span class="question">
      0: How does Node.js handle I/O operations if it’s single-threaded? Explain the role of the event loop and libuv.
    </span>

  </summary>

  <p class="short-answer">
    Node.js handles I/O operations using an <span class="known">event-driven</span>, non-blocking I/O model, which allows it to manage multiple operations concurrently without the need for multiple threads.
  </p>

  How It Works
  1. Main Thread Executes JS Code
      * Node.js starts by executing your JavaScript code in a single thread.
  2. Async Operations Offloaded
      * When you initiate an I/O operation (like file read, DB query, HTTP request), it is offloaded to <span class="known">libuv</span>’s thread pool or delegated to the OS (for non-blocking I/O).
  3. libuv Handles the Heavy Lifting
      * libuv uses a pool of background threads (default: 4) to handle these I/O tasks asynchronously.
  4. Callbacks Queued
      * Once the async task is complete, the associated callback is queued in one of the event loop phases (e.g., timers, poll, check).
  5. Event Loop Executes Callbacks
      * The event loop picks up these callbacks and runs them back on the main thread in the right order.

  Key Concepts
  * Non-blocking I/O: The main thread doesn't wait for I/O; it continues executing.
  * libuv: A C library abstracting the OS I/O operations and exposing a unified interface to Node.
  * Thread pool: For tasks like file system operations, DNS lookups, crypto, etc.
  * Event loop: The orchestrator that manages the queue and executes callbacks.

  Analogy
  Think of the main thread as a receptionist at a hotel:
  * It takes customer requests (JS code).
  * For tasks like room service (I/O), it forwards them to a service team (libuv thread pool).
  * When tasks are done, results are placed back in a queue for the receptionist to handle again.

  <p class="conclusion">
    This architecture allows Node.js to be highly efficient for handling thousands of concurrent connections without spawning thousands of threads.
  </p>
</details>

<details class="success">
  <summary>
    <span class="question">
      0: What is the difference between process.nextTick(), setImmediate(), and setTimeout(fn, 0) in Node.js?
    </span>
  </summary>

  <p class="short-answer">
    In Node.js, process.nextTick(), setImmediate(), and setTimeout(fn, 0) are all used to schedule asynchronous execution, but they behave differently in terms of timing and priority within the event loop.
  </p>

  #### 1. process.nextTick(callback)
  * Executes before the event loop continues — right after the current operation completes.
  * Runs before any I/O events, timers, or setImmediate().
  * Used for microtask-level priority in Node.js.
  ```js [JavaScript]
  process.nextTick(() => console.log('nextTick'));
  ```

  #### 2. setImmediate(callback)
  * Schedules code to execute in the check phase of the event loop.
  * Runs after I/O events and before the next event loop tick.
  * More predictable for I/O-heavy code.
  ```js [JavaScript]
  setImmediate(() => console.log('setImmediate'));
  ```

  #### 3. setTimeout(callback, 0)
  * Executes the callback after a minimum delay of 0ms, but still goes through the timers phase.
  * Doesn’t mean immediate — it depends on the queue and other tasks.
  ```js [JavaScript]
  setTimeout(() => console.log('setTimeout 0'), 0);
  ```

  #### Execution Order Example
  ```js [JavaScript]
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  process.nextTick(() => console.log('nextTick'));
  ```
  Output:
  ```bash
  nextTick
  timeout or immediate (order is not guaranteed)
  ```
  On most systems, timeout might fire before or after immediate, depending on the context and I/O queue. But nextTick always comes first.

  Use Cases
  | Function | Use it when... |
  |----|----|
  | process.nextTick() | You want to run logic immediately after current operation |
  | setImmediate() | You want to run code after I/O callbacks |
  | setTimeout(fn, 0) | You want to delay execution slightly, less predictable |

  <p class="conclusion">
    In summary, Node.js is optimized for handling many lightweight connections concurrently with minimal resource usage, while traditional servers rely on parallel threads, which are more resource-intensive.
  </p>
</details>

<details class="success">
  <summary>
    0: What is a callback in Node.js, and how is it different from a promise?
  </summary>

  <p class="short-answer">
    A callback in Node.js is a function that is passed as an argument to another function and is executed later, typically after an asynchronous operation completes. This was the primary way to handle async flows before promises and async/await became standard.
  </p>

  Callback Example (fs.readFile)
  ```js [JavaScript]
  const fs = require('fs');

  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) return console.error(err);
    console.log('File contents:', data);
  });
  ```
  * The third parameter is the callback function.
  * It gets called after the file is read.

  Promise Example (with fs.promises)
  ```js [JavaScript]
  const fs = require('fs').promises;

  fs.readFile('file.txt', 'utf8')
    .then(data => console.log('File contents:', data))
    .catch(err => console.error(err));
  ```

  Or using async/await:
  ```js [JavaScript]
  async function readFile() {
    try {
      const data = await fs.readFile('file.txt', 'utf8');
      console.log('File contents:', data);
    } catch (err) {
      console.error(err);
    }
  }
  ```

  Comparison: Callback vs Promise
  | Feature | Callback | Promise |
  |----|----|----|
  | Syntax complexity | Nested, can get messy | Cleaner with .then() / async/await |
  | Error handling | Needs explicit err checks | Centralized with .catch() or try/catch |
  | Composability | Hard to compose / chain | Easy chaining and sequencing |
  | Control flow readability | Poor with many async steps (callback hell) | Much better readability |

  Callback Hell (Anti-pattern)
  ```js [JavaScript]
  doTaskA(() => {
    doTaskB(() => {
      doTaskC(() => {
        console.log('All tasks done');
      });
    });
  });
  ```
  This nesting makes code hard to read and maintain. Promises solve this by flattening the flow.

  Conclusion:
  * Callbacks are still widely used (especially in older APIs or event handlers).
  * Promises offer better error handling, chaining, and readability, and are standard in modern Node.js apps.
</details>

<details class="success">
  <summary>
    0: What are Promises in Node.js, and how do they help with asynchronous programming?
  </summary>

  <p class="short-answer">
    Promises in Node.js are objects that represent the eventual completion (or failure) of an asynchronous operation and its resulting value. They help manage async workflows more cleanly than callbacks, especially when you have multiple sequential or dependent operations.
  </p>

  Basic Structure of a Promise
  A promise has three states:
  1. Pending – initial state, not yet fulfilled or rejected.
  2. Fulfilled – operation completed successfully.
  3. Rejected – operation failed with an error.

  Creating a Promise
  ```js [JavaScript]
  const myPromise = new Promise((resolve, reject) => {
    const success = true;
    if (success) {
      resolve('Done!');
    } else {
      reject('Error occurred');
    }
  });
  ```

  Using Promises
  ```js [JavaScript]
  myPromise
    .then(result => console.log(result))     // logs 'Done!' if resolved
    .catch(err => console.error(err));       // logs error if rejected
  ```

  Practical Example with fs.promises
  ```js [JavaScript]
  const fs = require('fs').promises;

  fs.readFile('file.txt', 'utf8')
    .then(data => console.log('File:', data))
    .catch(err => console.error('Read error:', err));
  ```

  Async/Await (Promise syntax sugar)
  ```js [JavaScript]
  async function readFile() {
    try {
      const data = await fs.readFile('file.txt', 'utf8');
      console.log('File:', data);
    } catch (err) {
      console.error('Error:', err);
    }
  }
  ```

  Benefits of Promises over Callbacks
  | Aspect | Callbacks | Promises |
  |----|----|----|
  | Chaining operations | Messy, nested structure | Clean with .then() |
  | Error handling | Must handle errors in each step | Centralized .catch() or try/catch |
  | Composition | Manual coordination | Built-in chaining support |
  | Readability | Lower (callback hell) | Higher (especially with async/await) |

  <p class="conclusion">
    Conclusion: Promises help simplify async programming by avoiding nested callbacks and providing a better structure for handling sequences, errors, and concurrent async operations. They are the foundation of async/await, which is now the standard approach in modern Node.js code.
  </p>
</details>

<details class="success">
  <summary>
    0: How does async/await work in Node.js? What is it syntactic sugar for, and how does it impact error handling?
  </summary>

  <p class="short-answer">
    async/await in Node.js is syntactic sugar built on top of Promises. It allows you to write asynchronous code that looks synchronous, making it easier to read, debug, and handle errors.
  </p>

  How It Works
  * async marks a function as asynchronous and makes it return a Promise.
  * await pauses execution inside an async function until the awaited Promise resolves (or rejects).

  Example with Promises
  ```js [JavaScript]
  function getUser() {
    return new Promise(resolve => {
      setTimeout(() => resolve({ id: 1, name: 'Alice' }), 1000);
    });
  }

  getUser()
    .then(user => console.log(user))
    .catch(err => console.error(err));
  ```

  Same logic using async/await
  ```js [JavaScript]
  async function fetchUser() {
    try {
      const user = await getUser();
      console.log(user);
    } catch (err) {
      console.error('Error:', err);
    }
  }

  fetchUser();
  ```

  Benefits of async/await
  | Feature | Description |
  |----|----|
  | Cleaner syntax | No chaining, avoids nested .then() |
  | Error handling | Works with try/catch, same as synchronous code |
  | Readability | Easier to follow logic sequentially |
  | Debuggable | Stack traces are simpler than deeply chained Promises |

  ⚠️ Important Notes
  * You can only use await inside an async function.
  * await pauses only that async function, not the whole event loop.
  * Use Promise.all() or Promise.allSettled() to run multiple async ops concurrently.

  Bad (sequential execution):
  ```js [JavaScript]
  await fetchA();
  await fetchB();  // waits for A to finish
  ```

  Better (parallel execution):
  ```js [JavaScript]
  await Promise.all([fetchA(), fetchB()]);
  ```

  Error Handling with async/await
  ```js [JavaScript]
  async function loadData() {
    try {
      const data = await fetchSomething();
      // use data
    } catch (err) {
      console.error('Caught error:', err);
    }
  }
  ```

  This avoids callback-style error pyramids and makes error propagation simpler and more centralized.
  
  <p class="conclusion">
    Conclusion: async/await improves developer productivity by making async code look and behave more like synchronous code — while still being non-blocking under the hood.
  </p>
</details>

<details class="success">
  <summary>
    0: What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?
  </summary>

  <p class="short-answer">
    These four Promise combinator methods — Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any() — help manage multiple asynchronous operations concurrently in Node.js, but they behave differently in terms of resolution, rejection, and error handling.
  </p>
    
  1. Promise.all()
  * Waits for all promises to resolve.
  * Rejects immediately if any promise rejects.
  * Returns an array of resolved values in the same order.
  ```js [JavaScript]
  Promise.all([p1, p2, p3])
    .then(results => console.log(results))
    .catch(err => console.error('Failed:', err));
  ```
  Use when: All results are needed, and failure of any one should fail the whole set.

  2. Promise.allSettled()
  * Waits for all promises to settle (either resolve or reject).
  * Never rejects — always resolves with an array of { status, value | reason }.
  ```js [JavaScript]
  Promise.allSettled([p1, p2, p3])
    .then(results => {
      results.forEach(result => {
        if (result.status === 'fulfilled') console.log(result.value);
        else console.warn('Error:', result.reason);
      });
    });
  ```
  Use when: You want all results, regardless of success or failure.

  3. Promise.race()
  * Resolves/rejects as soon as the first promise settles.
  * Ignores the rest.
  ```js [JavaScript]
  Promise.race([p1, p2, p3])
    .then(result => console.log('First settled:', result))
    .catch(err => console.error('First error:', err));
  ```
  Use when: You want the fastest response (e.g., race between fallback services or timeouts).

  4. Promise.any()
  * Resolves as soon as the first promise resolves.
  * Only rejects if all promises reject (returns an AggregateError).
  ```js [JavaScript]
  Promise.any([p1, p2, p3])
    .then(result => console.log('First success:', result))
    .catch(err => console.error('All failed:', err));
  ```
  Use when: You want any successful result, and don’t care if some fail.

  Comparison Table
  | Method | Resolves When... | Rejects When... | Use Case |
  |----|----|----|----|
  | Promise.all() | All succeed | Any one fails | All-or-nothing scenarios
  | Promise.allSettled() | All settle (resolve or reject) | Never | Need all outcomes regardless of success
  | Promise.race() | First promise settles | First one rejects (if it’s the first) | Fastest response wins (timeouts, fallback)
  | Promise.any() | First promise resolves | All promises reject (AggregateError) | Use first successful result

  <p class="conclusion">
    Conclusion:Use the appropriate combinator based on whether you're aiming for speed, reliability, or graceful degradation when dealing with concurrent async logic.
  </p>
</details>

<details class="success">
  <summary>
    0: What is the Node.js process object, and what are some useful things you can do with it?
  </summary>

  <p class="short-answer">
    The Node.js process object is a global object that provides information about, and control over, the current Node.js process. It is an instance of EventEmitter and can be used to interact with the operating system.
  </p>

  Key Use Cases of process
  1. Access environment variables
  ```js [JavaScript]
  console.log(process.env.NODE_ENV);  // 'development', 'production', etc.
  ```
  Used for environment-based configs (e.g., DB credentials, API keys).

  2. Read command-line arguments
  ```js [JavaScript]
  console.log(process.argv);
  ```
  process.argv returns an array of CLI arguments. Helpful for CLI tools or scripts.

  3. Exit the process
  ```js [JavaScript]
  process.exit(0);    // 0 means success
  process.exit(1);    // 1 means failure
  ```
  Forcefully ends the process with an exit code.

  4. Listen for exit events
  ```js [JavaScript]
  process.on('exit', code => {
    console.log(`Process exiting with code: ${code}`);
  });
  ```
  Used for cleanup or logging before the app exits.

  5. Handle unexpected errors
  ```js [JavaScript]
  process.on('uncaughtException', err => {
    console.error('Uncaught:', err);
    process.exit(1); // Optional: shut down gracefully
  });

  process.on('unhandledRejection', reason => {
    console.error('Unhandled Promise rejection:', reason);
  });
  ```
  Essential for catching and logging fatal or async errors in production.

  6. Get current working directory and change it
  ```js [JavaScript]
  console.log(process.cwd());       // Current working directory
  process.chdir('/new/path');
  console.log('New cwd:', process.cwd());
  ```

  7. Node version and PID
  ```js [JavaScript]
  console.log(process.version);     // Node.js version
  console.log(process.pid);         // Process ID
  ```

  8. Monitor memory usage and uptime
  ```js [JavaScript]
  console.log(process.memoryUsage());  // { rss, heapTotal, heapUsed, external }
  console.log(process.uptime());       // Seconds since process started
  ```
  Useful for performance monitoring and debugging memory leaks.

  Summary of Useful Properties / Methods
  | Property / Method | Purpose |
  |----|----|
  | process.env | Access environment variables |
  | process.argv | Command-line arguments |
  | process.exit() | Terminate the process |
  | process.on('exit') | Cleanup before exit |
  | process.on('uncaughtException') | Catch sync errors globally |
  | process.on('unhandledRejection') | Catch unhandled promise errors |
  | process.cwd() | Current working directory |
  | process.uptime() | Time (in seconds) the process has been running |
  | process.memoryUsage() | Inspect memory used by the process |

  Example: Parse flags manually
  ```js [JavaScript]
  // file: parse.js
  const args = process.argv.slice(2);
  const parsed = {};

  args.forEach(arg => {
    const [key, value] = arg.split("=");
    parsed[key.replace(/^--/, "")] = value || true;
  });
  
  console.log(parsed);
  ```

  Run:
  ```bash
  node parse.js --name=Alex --age=30 --dev
  ```

  Output:
  ```js [JavaScript]
  { name: 'Alex', age: '30', dev: true }
  ```

  Conclusion:The process object is essential for building real-world CLI tools, graceful shutdown logic, environment-aware apps, and error monitoring systems in Node.js.
  
  <p class="conclusion">
    In summary, Node.js is optimized for handling many lightweight connections concurrently with minimal resource usage, while traditional servers rely on parallel threads, which are more resource-intensive.
  </p>
</details>

<details class="success">
  <summary>
    0: What is the difference between __dirname, __filename, and process.cwd() in Node.js?
  </summary>

  <p class="short-answer">
    In Node.js, __dirname, __filename, and process.cwd() are often used for resolving file paths, but they serve different purposes and can behave differently depending on where and how your code runs.
  </p>

  1. __dirname
  * Returns the absolute path of the directory where the current file resides.
  * It’s module-scoped, i.e., it's based on the file in which it's used.
  ```js [JavaScript]
  console.log(__dirname);
  // /Users/you/project/src/utils/
  ```

  2. __filename
  * Returns the absolute path of the current file, including the file name.
  ```js [JavaScript]
  console.log(__filename);
  // /Users/you/project/src/utils/helper.js
  ```

  3. process.cwd()
  * Returns the current working directory from where Node was executed (typically the root of the project).
  * It’s not tied to the current file, but to the shell’s execution context.
  ```js [JavaScript]
  cd /Users/you/project
  node src/utils/helper.js

  console.log(process.cwd());
  // /Users/you/project
  ```

  Comparison Table
  | Property | Returns | Context | Use Case |
  |----|----|----|----|
  | __dirname | Directory path of current file | File-based | Resolve relative file paths safely |
  | __filename | Full path of current file | File-based | Logging or meta-info about the file itself |
  | process.cwd() | Current working directory of process | Execution context | CLI tools, loading files relative to execution |

  Pitfall Example
  If you use relative paths like fs.readFileSync('./data.json'), Node will resolve that path relative to process.cwd(), not __dirname.
  To safely read files next to your module, always use:
  ```js [JavaScript]
  const path = require('path');
  const filePath = path.join(__dirname, 'data.json');
  ```

  Conclusion:
  * Use __dirname and __filename for module-relative paths.
  * Use process.cwd() for execution-relative paths (e.g., in CLI tools).
  * Don’t confuse the two — especially when your app has multiple entry points or scripts.
</details>

<details class="success">
  <summary>
    0: What is the difference between CommonJS (require) and ES Modules (import) in Node.js?
  </summary>

  <p class="short-answer">
    Node.js supports two main module systems: CommonJS (CJS) and ECMAScript Modules (ESM). While both are used to organize code into separate files, they differ in syntax, features, behavior, and use cases.
  </p>

  1. CommonJS (require)
  * Default module system in Node.js (prior to ES6).
  * Synchronous.
  * Uses require() and module.exports.
  Example:
  ```js [JavaScript]
  // utils.js
  module.exports = function greet(name) {
    return `Hello, ${name}`;
  };

  // app.js
  const greet = require('./utils');
  console.log(greet('Alice'));
  ```

  2. ES Modules (import)
  * Modern, ES6-compliant module system.
  * Asynchronous and supports import/export syntax.
  * Requires "type": "module" in package.json or .mjs extension.
  Example:
  ```js [JavaScript]
  // utils.mjs or if type=module in package.json
  export function greet(name) {
    return `Hello, ${name}`;
  }

  export default function add(a, b) {
    return a + b;
  }

  // app.mjs
  import add, { greet } from './utils.mjs';
  console.log(greet('Alice'));
  console.log(add(2, 3));
  ```

  Comparison Table
  | Feature	| CommonJS (CJS) | ES Modules (ESM) |
  |----|----|----|
  | Syntax | require(), module.exports | import, export |
  | Execution | Synchronous | Asynchronous |
  | Default in Node.js | Yes | No (opt-in via "type": "module") |
  | Dynamic Imports | Harder, requires tricks | Built-in: await import() |
  | Top-Level await | Not supported | Supported |
  | Interop Support | CJS can import ESM (via async) | ESM can import CJS (with limitations) |
  | File Extension | .js | .mjs or .js with "type": "module" |

  Notes and Gotchas
  * Mixing CJS and ESM can cause issues like:
      * Cannot use import statement outside a module
      * require() of ES Module not supported
  * Tools like Babel, Webpack, and TypeScript can transpile ESM to CJS for compatibility.
  * ESM is the future standard, especially in modern frontend & full-stack apps.

  Conclusion:
  * Use CommonJS for existing Node.js projects, especially if using older libraries.
  * Prefer ES Modules for modern apps, especially with top-level await, better tree-shaking, and forward compatibility.

  <p class="conclusion">
    In summary, Node.js is optimized for handling many lightweight connections concurrently with minimal resource usage, while traditional servers rely on parallel threads, which are more resource-intensive.
  </p>
</details>

<details class="success">
  <summary>
    0: What are streams in Node.js, and what are the different types? When should you use them?
  </summary>

  <p class="short-answer">
    Streams in Node.js are abstract interfaces for working with streaming data — reading or writing chunks of data piece by piece, instead of loading everything into memory at once. They are especially useful when dealing with large files, network sockets, or any data that doesn't need to be fully buffered before being processed.
  </p>

  Why Use Streams?
  * Efficient memory usage
  * Faster processing of large data
  * Non-blocking I/O

  Types of Streams
  | Type | Description | Example |
  |----|----|----|
  | Readable | Stream from which data can be read | fs.createReadStream() |
  | Writable | Stream where data can be written | fs.createWriteStream() |
  | Duplex | Both readable and writable | net.Socket |
  | Transform | Duplex stream that can modify data | zlib.createGzip(), compression |

  Readable Stream Example
  ```js [JavaScript]
  const fs = require('fs');
  const readStream = fs.createReadStream('bigfile.txt', 'utf8');

  readStream.on('data', chunk => {
    console.log('Received chunk:', chunk.length);
  });

  readStream.on('end', () => {
    console.log('Finished reading');
  });
  ```

  Writable Stream Example
  ```js [JavaScript]
  const fs = require('fs');
  const writeStream = fs.createWriteStream('output.txt');

  writeStream.write('Hello, ');
  writeStream.write('world!');
  writeStream.end();
  ```

  Piping (Readable → Writable)
  ```js [JavaScript]
  const fs = require('fs');

  const reader = fs.createReadStream('bigfile.txt');
  const writer = fs.createWriteStream('copy.txt');

  reader.pipe(writer);
  ```
  * Automatically handles data flow and backpressure.
  * Most efficient way to copy files or move data.

  Chaining Transform Streams
  ```js [JavaScript]
  const fs = require('fs');
  const zlib = require('zlib'); 

  const gzip = zlib.createGzip();
  const source = fs.createReadStream('input.txt');
  const destination = fs.createWriteStream('input.txt.gz');

  source.pipe(gzip).pipe(destination);
  ```
  * Compresses data on-the-fly while reading and writing.

  When to Use Streams
  | Use Case | Why |
  |----|----|
  | Large file processing (e.g., CSV, logs) | Avoids loading the whole file into memory |
  | HTTP request/response handling | Send/receive data in chunks |
  | Real-time data (e.g., sockets, chat) | Low latency, continuous transmission |
  | Compression/Decompression (e.g., zlib) | Modify and stream in one pass (Transform) |

  <p class="conclusion">
    Conclusion: Streams are a core part of Node.js's I/O system, offering a powerful way to handle large or continuous data with low memory overhead and high performance.
  </p>
</details>

<details class="success">
  <summary>
    0: What is backpressure in Node.js streams, and how do you handle it?
  </summary>

  <p class="short-answer">
    Backpressure in Node.js streams occurs when the readable stream is pushing data faster than the writable stream can handle it. If not properly managed, this can lead to memory overflow or performance degradation.
  </p>

  What Causes Backpressure?
  * Data flows from producer (readable) to consumer (writable).
  * If the writable stream's internal buffer gets full, it signals the readable stream to slow down.
  * The readable stream must pause until the writable stream drains its buffer.

  How Node.js Handles Backpressure (Built-in)
  When using .pipe():
  ```js [JavaScript]
  const fs = require('fs');
  const reader = fs.createReadStream('bigfile.txt');
  const writer = fs.createWriteStream('copy.txt');

  reader.pipe(writer);
  ```
  * .pipe() handles backpressure automatically.
  * It will pause reading when the writable stream is full and resume when drained.

  Manual Backpressure Handling
  If not using .pipe(), you must manually check the return value of .write() and listen for the 'drain' event.
  ```js [JavaScript]
  const fs = require('fs');

  const reader = fs.createReadStream('input.txt');
  const writer = fs.createWriteStream('output.txt');

  reader.on('data', chunk => {
    const canWrite = writer.write(chunk);
    if (!canWrite) {
      reader.pause(); // pause reading
    }
  });

  writer.on('drain', () => {
    reader.resume(); // resume once drained
  });
  ```

  Summary: Key Points on Backpressure
  | Concept | Explanation |
  |----|----|
  | Writable buffer full | .write() returns false |
  | Pause readable stream | Call reader.pause() |
  | Wait for drain event | Listen to writer.on('drain') |
  | Resume readable stream | Call reader.resume() |
  | Best practice | Use .pipe() which handles all of this |

  <p class="conclusion">
    Conclusion: Backpressure is a natural flow control mechanism in Node.js streams. It's critical to understand and manage it—especially in manual streaming pipelines—to ensure scalability and stability in data-intensive applications.
  </p>
</details>

<details class="success">
  <summary>
    0: What are buffers in Node.js, and how are they different from strings?
  </summary>

  <p class="short-answer">
    In Node.js, a Buffer is a built-in object used to handle binary data directly in memory. It's especially useful when dealing with streams, file systems, network protocols, and other operations that require raw byte manipulation. Unlike JavaScript strings (which handle text using UTF-16), Buffers deal with binary data, making them ideal for performance-critical I/O tasks.
  </p>

  Why Buffers Exist
  * JavaScript strings are not suitable for binary manipulation.
  * Node.js needs to work with raw bytes from files, sockets, etc.

  Creating a Buffer
  ```js [JavaScript]
  const buf1 = Buffer.from('Hello');  // From string
  const buf2 = Buffer.alloc(10);      // Allocate 10 zero-filled bytes
  const buf3 = Buffer.allocUnsafe(10); // Faster but uninitialized
  ```

  Accessing / Modifying Buffer Data
  ```js [JavaScript]
  const buf = Buffer.from('ABC');
  console.log(buf[0]);         // 65 (ASCII of 'A')
  buf[0] = 97;                 // Change 'A' to 'a'
  console.log(buf.toString()); // aBC
  ```

  Buffer vs String
  | Aspect | Buffer | String |
  |----|----|----|
  | Data type | Raw binary data | Text (UTF-16 encoded) |
  | Mutability | Mutable | Immutable |
  | Encoding support | Requires encoding to convert to string | Handled internally |
  | Use cases | Streams, files, sockets, compression | User-facing text, logs, labels |

  Conversion Between Buffer and String
  ```js [JavaScript]
  const buf = Buffer.from('Hello', 'utf8');
  console.log(buf.toString('utf8')); // 'Hello'
  ```
  You can specify encodings like 'utf8', 'base64', 'hex', etc.

  Common Use Cases
  * Reading files with fs.readFile
  * Receiving TCP/UDP data with net module
  * Working with binary protocols (e.g., protobuf, custom binary formats)
  * Encoding/decoding base64, hex, or other binary formats

  <p class="conclusion">
    Conclusion: Buffers are essential for working with low-level, performance-sensitive operations in Node.js, allowing you to manipulate raw memory with precision. Strings are for human-readable data; Buffers are for machines.
  </p>
</details>

<details class="success">
  <summary>
    0: What is middleware in Express.js, and how does the next() function work?
  </summary>

  <p class="short-answer">
    In Express.js, middleware is a function that executes during the lifecycle of an HTTP request. Middleware functions have access to the request object (req), response object (res), and the next() function — which passes control to the next middleware in the stack.
  </p>

  Basic Middleware Signature
  ```js [JavaScript]
  function middleware(req, res, next) {
    // logic here
    next(); // hand off to the next function
  }
  ```
  You use it like:
  ```js [JavaScript]
  app.use(middleware);
  ```

  How next() Works
  * Without next(), the request will hang, because Express doesn’t know what to do next.
  * Calling next() passes control to the next matching route or middleware.
  * You can optionally call next(err) to trigger error-handling middleware.

  Middleware Stack Example
  ```js [JavaScript]
  const express = require('express');
  const app = express();

  function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next(); // move to the next middleware
  }

  function auth(req, res, next) {
    if (req.query.token === 'secret') {
      next(); // authorized
    } else {
      res.status(401).send('Unauthorized');
    }
  }

  app.use(logger);
  app.use(auth);

  app.get('/hello', (req, res) => {
    res.send('Hello World');
  });
  ```
  * logger runs on every request.
  * auth runs next and only calls next() if the user is authorized.
  * If both pass, the /hello route handler runs.

  Types of Middleware
  | Type | Description |
  |----|----|
  | Application-level | Attached via app.use() |
  | Route-level | Used on specific routes like app.get('/x', fn) |
  | Built-in | e.g., express.json(), express.static() |
  | Error-handling | Has 4 params: (err, req, res, next) |
  | Third-party | Like cors, morgan, helmet |

  ✅ Middleware Use Cases
  * Logging
  * Authentication
  * Validation
  * Body parsing
  * Error handling
  * Custom response headers
    
  <p class="conclusion">
    Conclusion: Middleware in Express.js enables modular, reusable logic across requests. The next() function is key for building middleware chains, enabling layered control over the request-response cycle.
  </p>
</details>

<details class="success">
  <summary>
    0: How does error handling work in Express middleware? What makes error middleware different from other types?
  </summary>

  <p class="short-answer">
    In Express.js, error handling is done using special middleware functions that have a 4-argument signature: (err, req, res, next). This differentiates them from regular middleware, which only takes 3 arguments (req, res, next).
  </p>

  What Makes Error Middleware Unique
  * Express recognizes it as an error handler only if it has 4 parameters.
  * It's invoked automatically when next(err) is called from any part of the middleware stack.
  * You can use it to log errors, sanitize output, or send proper HTTP responses.

  Example: Error-Handling Middleware
  ```js [JavaScript]
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });
  ```

  Triggering Errors Manually
  ```js [JavaScript]
  app.get('/fail', (req, res, next) => {
    const error = new Error('Something went wrong!');
    next(error); // triggers the error middleware
  });
  ```

  Built-in Error Flow Example
  ```js [JavaScript]
  const express = require('express');
  const app = express();

  // Regular middleware
  app.use((req, res, next) => {
    if (!req.query.token) {
      const err = new Error('Missing token');
      err.status = 401;
      return next(err);
    }
    next();
  });

  // Route handler
  app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message });
  });
  ```

  Error Middleware Key Points
  | Aspect | Explanation |
  |----|----|
  | Signature | Must be (err, req, res, next) |
  | Usage | Final middleware in the stack |
  | Triggers on next(err) | Automatically called when errors are passed |
  | Can customize response | Yes – can send structured error responses (JSON, etc.) |
  | Order matters | Must be defined after all other routes/middleware |

  Common Use Cases
  * Centralized error handling
  * Sending environment-based error responses (detailed in dev, generic in prod)
  * Logging to a file or error monitoring service

  <p class="conclusion">
    Conclusion: Express error middleware provides a centralized way to manage unexpected issues, prevent app crashes, and respond with structured error messages. The key is the 4-parameter signature and correct ordering in the middleware chain.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What is the purpose of the cluster module in Node.js, and when would you use it?
  </summary>

  <p class="short-answer">
    The cluster module in Node.js allows you to spawn child processes (workers) that share the same server port, effectively enabling you to scale a Node.js application across multiple CPU cores. Since Node.js runs on a single thread by default, using the cluster module helps utilize multi-core systems to improve throughput and performance — especially under high traffic or compute-heavy workloads.
  </p>

  Why Use cluster?
  * Node.js is single-threaded (via the event loop).
  * Modern servers have multiple cores — running only one thread under-utilizes the hardware.
  * The cluster module enables running multiple Node.js processes in parallel.

  Basic Example:
  ```js [JavaScript]
  const cluster = require('cluster');
  const http = require('http');
  const os = require('os');

  const numCPUs = os.cpus().length;

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    // Worker code
    http.createServer((req, res) => {
      res.writeHead(200);
      res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
  }
  ```

  Key Features of cluster
  | Feature | Details |
  |----|----|
  | Shared server port | Workers can listen on the same port (handled by master) |
  | Process isolation | Each worker is a separate process (safe from others crashing) |
  | Scalable to CPU cores | Dynamically fork workers based on os.cpus() |
  | IPC support | Communicate between master and workers via messaging |

  When to Use the cluster Module
  * High-load HTTP servers
  * API gateways or reverse proxies
  * Scenarios needing full CPU utilization
  * Compute-intensive Node.js services

  Drawbacks
  | Concern | Explanation |
  |----|----|
  | Shared memory limitations | Each worker has its own memory (no shared RAM) |
  | No built-in load balancing | Round-robin isn't guaranteed unless enabled manually |
  | More complex architecture | Debugging across multiple processes is harder |
  | Better alternatives | Libraries like PM2, or containers like Docker offer better orchestration |
    
  <p class="conclusion">
    Conclusion: Use cluster when you want to scale Node.js to multiple CPU cores, especially for I/O-heavy or CPU-bound applications. It’s a core tool for building high-performance, multi-core Node.js systems.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What are worker threads in Node.js, and how are they different from clusters?
  </summary>

  <p class="short-answer">
    Worker Threads in Node.js are used to run JavaScript code in parallel threads, allowing true multithreading for CPU-intensive tasks — something the main event loop isn’t suited for. They differ from cluster, which creates multiple isolated Node.js processes. In contrast, worker threads share memory, making them ideal for scenarios where threads need to communicate and share data efficiently.
  </p>

  Core Differences: Cluster vs Worker Threads
  | Aspect | Cluster | Worker Threads |
  |----|----|----|
  | Based on | Multiple Node.js processes | Multiple threads within one Node.js process |
  | Memory | Isolated per process | Shared via SharedArrayBuffer, MessageChannel |
  | IPC | Via inter-process messaging | Via thread messaging or shared memory |
  | Use case | Scaling servers across CPU cores | Offloading CPU-intensive work (hashing, parsing) |
  | Startup cost | Higher (process spawn) | Lower (thread spawn) |
  | HTTP port sharing | Yes | No (worker thread doesn’t share server port) |

  When to Use Worker Threads
  * CPU-heavy operations (e.g., image processing, encryption, compression)
  * Long-running computations that would otherwise block the event loop
  * Scenarios needing shared memory across threads

  Basic Example of Worker Threads
  ```js [JavaScript]
  // main.js
  const { Worker } = require('worker_threads');

  const worker = new Worker('./worker.js');

  worker.on('message', result => {
    console.log('Result from worker:', result);
  });

  worker.postMessage(10);
  ```

  ```js [JavaScript]
  // worker.js
  const { parentPort } = require('worker_threads');

  parentPort.on('message', num => {
    let result = 0;
    for (let i = 0; i < 1e9; i++) result += num;
    parentPort.postMessage(result);
  });
  ```

  Shared Memory with Worker Threads
  ```js [JavaScript]
  const shared = new SharedArrayBuffer(1024);
  ```
  Allows low-level memory sharing between threads without needing serialization.

  Worker Thread Advantages
  | Feature | Benefit |
  |----|----|
  | Non-blocking CPU tasks | Keeps main event loop responsive |
  | Shared memory support | Enables high-performance data sharing |
  | Native thread pooling | Use worker_threads + Piscina for pools |
  | More lightweight than forks | Lower memory & faster startup |

  <p class="conclusion">
    Conclusion: Use worker threads when your Node.js app needs to do heavy computation without blocking the event loop, especially when performance and low-latency response times are critical. For server scaling, prefer cluster; for CPU tasks, use worker_threads.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What is the difference between spawn(), exec(), and fork() in Node.js's child_process module?
  </summary>

  <p class="short-answer">
    The child_process module in Node.js allows you to create and manage subprocesses to run other programs or scripts. It provides methods like spawn(), exec(), and fork(), each serving different purposes depending on output size, communication needs, and use cases.
  </p>

  1. spawn()
  * Launches a new process with a given command.
  * Streams the output (stdout/stderr) — suitable for large output.
  * Returns a ChildProcess object with stdout and stderr as streams.
  Example:
  ```js [JavaScript]
  const { spawn } = require('child_process');
  const ls = spawn('ls', ['-lh', '/usr']);

  ls.stdout.on('data', data => console.log(`stdout: ${data}`));
  ls.stderr.on('data', data => console.error(`stderr: ${data}`));
  ls.on('close', code => console.log(`Process exited with code ${code}`));
  ```
  Use when: You need streamed output or are handling large data.

  2. exec()
  * Runs a command in a shell.
  * Buffers the entire output in memory and passes it to a callback.
  * Not ideal for large outputs due to buffer limits.
  Example:
  ```js [JavaScript]
  const { exec } = require('child_process');
  exec('ls -lh /usr', (error, stdout, stderr) => {
    if (error) return console.error(`Error: ${error.message}`);
    console.log(`stdout: ${stdout}`);
  });
  ```
  Use when: You need a quick command execution and small output (e.g., shell utilities).

  3. fork()
  * A special case of spawn() used to run Node.js scripts.
  * Sets up a communication channel (IPC) between parent and child.
  * Useful for scaling, child worker processes, or multi-process systems.
  Example:
  ```js [JavaScript]
  // parent.js
  const { fork } = require('child_process');
  const child = fork('child.js');

  child.send({ msg: 'Hello from parent' });
  child.on('message', msg => console.log('Message from child:', msg));
  ```

  ```js [JavaScript]
  // child.js
  process.on('message', msg => {
    console.log('Received:', msg);
    process.send({ reply: 'Pong' });
  });
  ```
  Use when: You need two-way communication with another Node.js script (e.g., background job, clustering).

  Comparison Table
  | Method | Shell Access | Output Handling | Use Case |
  |----|----|----|----|
  | spawn() | No | Streams (best for large data) | Run commands like ls, curl, etc. |
  | exec() | Yes | Buffers entire output | Shell commands with small result (e.g., git) |
  | fork() | (Node only) | IPC for message passing | Run other Node.js files as child processes |

  <p class="conclusion">
    Conclusion: Use spawn() for streaming external commands, exec() for simple one-shot shell tasks, and fork() when working with child Node processes and needing structured communication via messages.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What is the purpose of EventEmitter in Node.js, and how do you use it?
  </summary>

  <p class="short-answer">
    The EventEmitter class in Node.js is a core part of the events module. It provides a publish-subscribe (pub/sub) pattern, allowing objects to emit named events and other parts of the app to listen and respond to them. This pattern is widely used in Node.js core modules (like streams, HTTP, sockets) and is useful for building event-driven architectures.
  </p>

  Basic Usage
  ```js [JavaScript]
  const EventEmitter = require('events');
  const emitter = new EventEmitter();

  // Register a listener
  emitter.on('greet', (name) => {
    console.log(`Hello, ${name}`);
  });

  // Emit the event
  emitter.emit('greet', 'Alice');
  ```
  * on(event, callback) — registers a listener
  * emit(event, ...args) — triggers the event with optional data

  Common Methods in EventEmitter
  | Method | Description |
  |----|----|
  | .on(event, listener) | Registers a listener for the event |
  | .once(event, listener) | Registers a one-time listener |
  | .emit(event, ...args) | Triggers all listeners for the event |
  | .off(event, listener) | Removes a specific listener |
  | .removeAllListeners() | Removes all listeners for an event |
  | .listenerCount(event) | Returns the number of listeners for an event |

  Example with Custom Class
  ```js [JavaScript]
  class MyEmitter extends EventEmitter {}

  const appEvents = new MyEmitter();

  appEvents.on('user:login', (user) => {
    console.log(`User ${user.name} logged in`);
  });

  appEvents.emit('user:login', { name: 'Bob' });
  ```

  Real-World Use Cases
  * HTTP servers: req.on('data'), req.on('end')
  * WebSocket communication
  * Custom business events (e.g., order:created, user:registered)
  * Monitoring and logging systems

  Benefits of EventEmitter
  | Benefit | Explanation |
  |----|----|
  | Decouples components | Allows loose coupling between emitters and listeners |
  | Built-in to Node.js | No external library needed |
  | Supports async/event-driven logic | Ideal for non-linear workflows |
  | Used in core APIs | Understanding it is essential for Node.js mastery |

  <p class="conclusion">
    Conclusion: EventEmitter is fundamental to Node.js's event-driven architecture. It simplifies handling custom or system-level events and is especially powerful when building modular, extensible systems.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What are the key differences between fs.readFile, fs.readFileSync, and fs.createReadStream in Node.js?
  </summary>

  <p class="short-answer">
    In Node.js, the fs (File System) module provides multiple ways to read files. The three most common are: fs.readFile, fs.readFileSync, fs.createReadStream.
  </p>

  In Node.js, the fs (File System) module provides multiple ways to read files. The three most common are:
  * fs.readFile — asynchronous
  * fs.readFileSync — synchronous
  * fs.createReadStream — stream-based (asynchronous and memory-efficient)
  Each serves a different purpose depending on file size, performance needs, and synchronous vs. asynchronous context.

  1. fs.readFile (Async, Whole File in Memory)
  ```js [JavaScript]
  const fs = require('fs');

  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  ```
  * Non-blocking: does not block the event loop
  * Loads the entire file into memory
  * Good for small to medium-sized files

  2. fs.readFileSync (Sync, Whole File in Memory)
  ```js [JavaScript]
  const data = fs.readFileSync('file.txt', 'utf8');
  console.log(data);
  ```
  * Blocking: halts the event loop until the file is read
  * Simpler syntax, but not suitable in performance-critical code
  * Best for scripts, startup config, or CLI tools

  3. fs.createReadStream (Async Stream, Chunked Reading)
  ```js [JavaScript]
  const stream = fs.createReadStream('large.txt', 'utf8');

  stream.on('data', chunk => {
    console.log('Received chunk:', chunk.length);
  });

  stream.on('end', () => {
    console.log('Stream finished');
  });
  ```
  * Reads file in chunks (streamed)
  * Highly memory-efficient and scalable
  * Best for large files or piping data (e.g., video, logs)

  Comparison Table
  | Method | Blocking | Memory Usage | Best Use Case |
  |----|----|----|----|
  | fs.readFile | No | Loads full file | Small to medium files (non-blocking) |
  | fs.readFileSync | Yes | Loads full file | Startup config, CLI scripts |
  | fs.createReadStream | No | Streams in chunks | Large files, piping, real-time reading |

  Bonus: Pipe to Writable
  ```js [JavaScript]
  const reader = fs.createReadStream('input.txt');
  const writer = fs.createWriteStream('output.txt');

  reader.pipe(writer); // copies file efficiently
  ```

  Conclusion:
  * Use readFileSync only when blocking is acceptable.
  * Use readFile for simple, non-blocking reads.
  * Use createReadStream for performance-critical, large-scale file processing.
</details>

<details class="neutral">
  <summary>
    0: What tools and techniques can you use to improve performance and scalability in Node.js applications?
  </summary>

  <p class="short-answer">
    Improving performance and scalability in Node.js requires a mix of architecture decisions, code-level optimizations, and the use of the right tools and patterns. Node.js is already efficient for I/O-bound workloads, but it can bottleneck if not optimized — especially in CPU-intensive or high-concurrency scenarios.
  </p>

  Key Techniques and Tools

  1. Use Asynchronous, Non-Blocking Code
  * Prefer async/await, Promises, or callbacks for I/O.
  * Avoid blocking operations like fs.readFileSync() in request handlers.

  2. Implement Clustering
  * Use the cluster module to utilize all CPU cores.
  * Run multiple processes behind a load balancer or reverse proxy (e.g., Nginx).

  3. Use Worker Threads for CPU Tasks
  * Offload heavy computation using worker_threads.
  * Prevents blocking the event loop.

  4. Enable HTTP Keep-Alive
  * Reduces TCP overhead for repeated requests.
  ```js [JavaScript]
  http.createServer(options, handler).keepAliveTimeout = 60000;
  ```

  5. Leverage Streams
  * Use fs.createReadStream and pipe() for large file handling.
  * Reduces memory consumption and latency.

  6. Use Caching
  * Cache DB queries or frequently used data in:
      * In-memory (e.g., Node.js LRU Cache, Map)
      * Distributed cache (e.g., Redis)
  * Reduce redundant computations.

  7. Load Balancing
  * Distribute traffic with tools like:
      * Nginx
      * HAProxy
      * PM2 cluster mode

  8. Optimize Dependencies
  * Avoid bloated npm packages.
  * Bundle/minify for frontend if using full-stack with SSR.

  9. Connection Pooling
  * Use DB clients with pooling (e.g., PostgreSQL’s pg.Pool, MySQL pool)
  * Avoid opening new connections per request.

  10. Use Efficient Logging
  * Avoid console logging in production.
  * Use structured, async loggers like Winston, Pino, or Bunyan.

  11. Monitor and Profile
  * Use tools like:
      * Node.js built-in profiler
      * clinic.js
      * Prometheus + Grafana
      * Datadog / New Relic / Elastic APM

  12. Optimize Garbage Collection
  * Monitor memory usage with process.memoryUsage()
  * Avoid memory leaks (unreleased timers, event listeners, global vars)

  Summary Table
  | Technique | Benefit |
  |----|----|
  | Async code | Keeps event loop non-blocking |
  | Clustering | Multi-core CPU utilization |
  | Worker threads | Offload heavy computation |
  | Caching | Reduce redundant data access |
  | Streams | Low memory usage for large data |
  | Monitoring | Detect and resolve bottlenecks |
  | Connection pooling | Efficient DB communication |
  | Load balancing | Horizontal scaling |

  <p class="conclusion">
    Conclusion: Optimizing Node.js apps is about non-blocking architecture, resource efficiency, and intelligent scaling. Use the right combination of tools and strategies depending on whether your bottlenecks are in CPU, memory, I/O, or network latency.
  </p>
</details>

<details class="neutral">
  <summary>
    0: How does garbage collection work in Node.js, and what tools or techniques can you use to detect and fix memory leaks?
  </summary>

  <p class="short-answer">
    In Node.js, garbage collection (GC) is handled by the V8 JavaScript engine, which automatically reclaims memory that’s no longer reachable. However, understanding how it works and how to detect/fix memory leaks is crucial in long-running or high-throughput applications.
  </p>

  How Garbage Collection Works
  * V8 uses generational garbage collection, dividing memory into:
      * Young Generation (short-lived objects)
      * Old Generation (long-lived objects)
  * Common algorithms:
      * Scavenge (for young gen): fast, minor GC
      * Mark-and-sweep, mark-compact (for old gen): full, slower GC

  GC Triggers
  * When memory thresholds are exceeded
  * When global.gc() is called (requires --expose-gc)
  * Automatically during idle periods or pressure

  Common Causes of Memory Leaks
  | Cause | Example |
  |----|----|
  | Global variables | Not released after use |
  | Uncleared timers/intervals | setInterval() never cleared |
  | Event listeners not removed | emitter.on() without off() |
  | Closures holding references | Inner function retains access to outer scope |
  | Caching without limits | LRU/memoization without eviction policy |

  Detecting Memory Leaks

  1. Enable heap snapshots
      * Use Chrome DevTools with node --inspect or --inspect-brk
      * Take before/after snapshots to compare retained objects

  2. Use built-in memory tools
  ```js [JavaScript]
  console.log(process.memoryUsage());
  ```

  3. Use Node.js diagnostic tools
      * --inspect / --inspect-brk
      * --trace-gc to log GC activity
      * --max-old-space-size to control heap size

  4. External tools
      * clinic.js (auto-detects leaks)
      * Valgrind (for native leaks)
      * heapdump module (programmatically generate .heapsnapshot)

  Fixing Memory Leaks
  * Remove unused variables or listeners.
  * Use weak references or WeakMap for cache-like patterns.
  * Always clean up:
  ```js [JavaScript]
  const timer = setInterval(doWork, 1000);
  clearInterval(timer); // when done
  ```
  * Use emitter.removeListener() or emitter.off() when you're done listening.

  Pro Tips
  * Add monitoring in production: track heapUsed, heapTotal, and event loop lag.
  * Use circuit breakers or kill + restart strategies (e.g., PM2, Kubernetes) to prevent runaway memory growth.

  <p class="conclusion">
    Conclusion: Garbage collection is automatic, but memory leaks aren't. Use tooling (--inspect, heap snapshots, clinic.js) and discipline (clean timers, avoid globals, cap caches) to keep your Node.js app healthy under load.
  </p>
</details>

<details class="neutral">
  <summary>
    0: How can you profile CPU and memory usage in a live Node.js application?
  </summary>

  <p class="short-answer">
    To profile CPU and memory usage in a live Node.js application, you need to monitor both runtime performance metrics and capture diagnostics (like CPU profiles, heap snapshots, and GC events). Node.js offers several built-in and external tools for real-time and post-mortem profiling.
  </p>

  1. Using the Built-in Inspector
  Start your app with the --inspect or --inspect-brk flag:
  ```bash
  node --inspect app.js
  ```
  * Then open Chrome DevTools at chrome://inspect
  * Allows:
      * Heap snapshot (memory profiling)
      * CPU profiling (stack sampling)
      * Live object inspection
      * Manual GC triggering

  2. CPU Profiling (Manual or Automated)
  A. Manual via DevTools
  * Record CPU usage via the “Profiler” tab
  * Identify hot paths, blocking sync operations, or tight loops
  B. Generate .cpuprofile file
  ```js [JavaScript]
  const inspector = require('inspector');
  const fs = require('fs');
  const session = new inspector.Session();

  session.connect();
  session.post('Profiler.enable', () => {
    session.post('Profiler.start', () => {
      setTimeout(() => {
        session.post('Profiler.stop', (err, { profile }) => {
          fs.writeFileSync('cpu.cpuprofile', JSON.stringify(profile));
        });
      }, 10000); // record 10 seconds
    });
  });
  ```

  3. Memory Profiling
  A. Heap Snapshots via Chrome DevTools
  * Use --inspect or heapdump module
  * Load snapshot into Chrome DevTools for diffing
  B. heapdump module
  ```bash
  npm install heapdump
  ```

  ```js [JavaScript]
  const heapdump = require('heapdump');
  heapdump.writeSnapshot('/tmp/snapshot.heapsnapshot');
  ```

  4. Live Monitoring Tools
  | Tool | Purpose |
  |----|----|
  | clinic.js | All-in-one performance profiling (clinic flame, clinic doctor) |
  | 0x | Flamegraph-based profiler |
  | node-memwatch | Memory leak detection |
  | pm2 | Runtime metrics + auto-profiling support |
  | prom-client | Expose metrics for Prometheus/Grafana |

  5. Track Memory Usage at Runtime
  ```js [JavaScript]
  console.log(process.memoryUsage());
  ```
  Returns:
  * heapUsed
  * heapTotal
  * rss (resident set size)
  * external, arrayBuffers
  You can track and alert based on trends.

  Summary of Profiling Strategies
  | What You Want to Profile | Tool / Method |
  |----|----|
  | CPU bottlenecks | DevTools, inspector, clinic flame, 0x |
  | Memory leaks | Heap snapshots, heapdump, clinic doctor |
  | GC activity | --trace-gc, DevTools timeline |
  | Live metrics (prod-safe) | prom-client, pm2, custom dashboards |

  <p class="conclusion">
    Conclusion: Node.js gives you deep visibility into memory and CPU behavior via DevTools integration, low-level APIs, and profiling tools. Use these methods regularly in staging and production to catch regressions, leaks, and bottlenecks before they affect users.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What is event loop lag (a.k.a. latency), how can you measure it, and why does it matter?
  </summary>

  <p class="short-answer">
    Event loop lag (also called latency or event loop delay) refers to how long it takes Node.js to get back to the event loop to process queued tasks — like handling incoming requests, timers, or I/O callbacks. High event loop lag indicates that your JavaScript code is blocking the event loop, making the app unresponsive.
  </p>

  Why It Matters
  Node.js uses a single-threaded event loop. If that thread is busy (e.g., running CPU-heavy JS), it can't respond to other events — which causes:
  * Slow HTTP responses
  * Missed timeouts
  * Queue backups (in Redis, RabbitMQ, etc.)
  * Poor real-time performance (e.g., socket lag)

  What Causes Event Loop Lag
  | Cause | Example |
  |----|----|
  | Heavy synchronous code | Loops, sorting large arrays, crypto, etc. |
  | Blocking I/O operations | fs.readFileSync(), child_process.execSync() |
  | Large JSON parsing | JSON.parse(hugeString) |
  | Massive DOM diffs (SSR) | Inefficient rendering logic |

  How to Measure Event Loop Lag
  1. Using perf_hooks.monitorEventLoopDelay() (Node >= 11.10)
  ```js [JavaScript]
  const { monitorEventLoopDelay } = require('perf_hooks');

  const histogram = monitorEventLoopDelay();
  histogram.enable();

  setInterval(() => {
    console.log('Event loop lag (ms):', histogram.mean / 1e6); // nanoseconds → ms
  }, 1000);
  ```

  2. Using toobusy-js (lightweight lag monitor)
  ```bash
  npm install toobusy-js
  ```

  ```js [JavaScript]
  const toobusy = require('toobusy-js');

  setInterval(() => {
    console.log('Lag:', toobusy.lag());
  }, 1000);
  ```
  * You can even use it to reject requests when lag is high:
  ```js [JavaScript]
  app.use((req, res, next) => {
    if (toobusy()) {
      res.status(503).send('Server too busy');
    } else {
      next();
    }
  });
  ```

  How to Reduce Event Loop Lag
  | Strategy | Description |
  |----|----|
  | Move CPU tasks to worker_threads | Offload blocking operations |
  | Use async APIs instead of sync ones | Avoid fs.readFileSync(), etc. |
  | Throttle/paralyze heavy jobs | Process in small chunks via setImmediate() |
  | Monitor and alert | Use perf_hooks, Prometheus, or PM2 alerts |
  | Load test under stress | Detect lag using artillery, autocannon, etc. |

  Summary
  | Metric | Good Range |
  |----|----|
  | Event loop lag | Typically < 50ms |
  | Dangerous lag | > 200ms (user-visible delay) |

  <p class="conclusion">
    Conclusion: Event loop lag is a critical signal of application health in Node.js. High lag means the event loop is starved and can't serve new requests. Use perf_hooks, toobusy-js, and production alerts to monitor and mitigate latency issues proactively.
  </p>
</details>

<details class="neutral">
  <summary>
    0: How do you handle rate limiting in a Node.js API, and what are the pros/cons of different approaches?
  </summary>

  <p class="short-answer">
    Rate limiting in a Node.js API is the practice of restricting how many requests a client (usually identified by IP or token) can make in a specific time window.
  </p>

  Rate limiting in a Node.js API is the practice of restricting how many requests a client (usually identified by IP or token) can make in a specific time window. It’s critical for:
  * Preventing abuse and DDoS attacks
  * Protecting backend resources
  * Enforcing fair usage limits

  Common Approaches to Rate Limiting
  1. In-Memory Rate Limiting (e.g., express-rate-limit)
  ```bash
  npm install express-rate-limit
  ```

  ```js [JavaScript]
  const rateLimit = require('express-rate-limit');

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP to 100 requests per window
  });

  app.use(limiter);
  ```

  Pros:
  * Very easy to implement
  * No external dependencies
  * Great for low-traffic apps or internal APIs

  Cons:
  * Not distributed — doesn’t work across multiple instances
  * Memory usage grows with active IPs

  2. Distributed Rate Limiting (Redis-based)
  ```js [JavaScript]
  Use libraries like rate-limiter-flexible or custom Redis logic.

  const { RateLimiterRedis } = require('rate-limiter-flexible');
  const Redis = require('ioredis');
  const redisClient = new Redis();

  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl',
    points: 100,           // max 100 requests
    duration: 60,          // per 60 seconds
  });

  app.use(async (req, res, next) => {
    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch {
      res.status(429).send('Too Many Requests');
    }
  });
  ```

  Pros:
  * Works across multiple servers/containers
  * Highly scalable and configurable
  * Fine-grained (per-IP, per-token, per-endpoint)

  Cons:
  * Requires Redis
  * Slightly higher latency

  3. Token Bucket or Leaky Bucket Algorithm (Advanced)
  * Allows bursts of traffic, while smoothing out over time.
  * Best implemented using Redis or external gateways (e.g., API Gateway, Kong, NGINX+Lua).

  4. API Gateway Rate Limiting (e.g., AWS API Gateway, NGINX)
  Handled outside the Node.js app.

  Pros:
  * Offloads processing from your app
  * Often comes with built-in analytics & alerting
  * Prevents requests from hitting the app at all

  Cons:
  * Requires external setup/infrastructure
  * Less application-level flexibility

  Comparison Table
  | Approach | Scalable | Resilient | Best For |
  |----|----|----|----|
  | express-rate-limit | No | App crash resets limits | Small apps, quick setup |
  | Redis-based (rate-limiter-flexible) | Yes | Yes | Large-scale or distributed systems |
  | API Gateway / NGINX | Yes | Yes | Enterprises, serverless APIs |
  | Token Bucket (custom) | Yes | Yes | Custom policies or bursts allowed |

  Best Practices:
  * Use status code 429 Too Many Requests for blocked requests.
  * Set proper headers: Retry-After, X-RateLimit-*.
  * Log and monitor blocked requests (for abuse detection).
  * Consider different limits per route (e.g., auth endpoints stricter).

  <p class="conclusion">
    Conclusion: Choose your rate-limiting strategy based on scale, infrastructure, and security needs. For distributed apps, Redis-based or gateway-level limits are ideal. For simple APIs, express-rate-limit is often good enough.
  </p>
</details>

<details class="neutral">
  <summary>
    0: How can you ensure high availability and graceful shutdown in Node.js applications?
  </summary>

  <p class="short-answer">
    Ensuring high availability (HA) and implementing graceful shutdown are critical for Node.js applications, especially in production environments where zero downtime, reliability, and clean resource handling are required.
  </p>

  High Availability Strategies

  1. Run Multiple Instances
  * Use clustering, PM2, or Docker Swarm/Kubernetes to run multiple app instances.
  * Distribute load via load balancer (e.g., NGINX, HAProxy, ELB).

  2. Use a Process Manager (PM2)
  ```bash
  npm install pm2 -g
  pm2 start app.js -i max     # runs app on all CPU cores
  pm2 startup
  pm2 save
  ```
  * Restarts crashed apps
  * Auto-restarts on deployment or system reboot
  * Supports graceful shutdown hooks

  3. Monitor Health Checks
  * Expose a /health endpoint for uptime checks.
  * Used by Kubernetes, AWS ALB, and load balancers.
  ```js [JavaScript]
  app.get('/health', (req, res) => res.send('OK'));
  ```

  4. Use Reverse Proxy for Failover
  * Tools like NGINX can route around failed instances.

  Graceful Shutdown in Node.js

  Graceful shutdown allows your app to:
  * Stop accepting new connections
  * Complete in-flight requests
  * Close resources (DB, cache, file handles)
  * Exit cleanly

  Basic Example:
  ```js [JavaScript]
  const http = require('http');
  const server = http.createServer(app);

  server.listen(3000);

  process.on('SIGINT', shutdown);    // Ctrl+C
  process.on('SIGTERM', shutdown);   // Kubernetes/PM2 signal

  function shutdown() {
    console.log('Gracefully shutting down...');
    server.close(() => {
      console.log('Closed HTTP server');
      process.exit(0);
    });

    // Optional: force exit after timeout
    setTimeout(() => {
      console.error('Forcing shutdown');
      process.exit(1);
    }, 10000);
  }
  ```

  Close Connections (DB, Redis, etc.)
  ```js [JavaScript]
  mongoose.connection.close();
  redis.quit();
  dbPool.end();
  ```

  Best Practices
  | What | Why |
  |----|----|
  | server.close() | Stop accepting new requests |
  | Handle SIGINT, SIGTERM | Catch shutdown signals from OS/process manager |
  | Add setTimeout fallback | Avoid hung processes due to pending events |
  | Cleanup external resources | Prevent connection leaks, transaction hangs |
  | Log during shutdown | Helpful for debugging shutdown behavior |

  In Production Environments
  | Environment | HA Strategy |
  |----|----|
  | PM2 | Built-in clustering, graceful reloads |
  | Kubernetes | Pod replication + liveness/readiness probes |
  | Docker Compose | Use restart policies and multiple containers |

  <p class="conclusion">
    Conclusion: High availability ensures uptime. Graceful shutdown ensures clean teardown. Implement both using signal handlers, server.close(), and proper resource cleanup to avoid data corruption, dropped requests, or zombie processes during redeployments or crashes.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What are some ways to secure a Node.js application, both at the code and infrastructure level?
  </summary>

  <p class="short-answer">
    Securing a Node.js application requires a layered approach: secure the code, the runtime environment, and the infrastructure it runs on. Node.js itself is safe, but it’s the developer’s responsibility to guard against common vulnerabilities and attack vectors.
  </p>

  1. Secure Code Practices
  A. Validate and Sanitize Input
  * Use libraries like express-validator, Joi, or zod.
  * Prevents injection attacks (e.g., NoSQL, SQL, command injection).
  B. Escape User-Generated Output
  * Prevents XSS in server-rendered HTML.
  C. Use Helmet for Secure Headers
  ```bash
  npm install helmet
  ```
  ```js [JavaScript]
  const helmet = require('helmet');
  app.use(helmet());
  ```
  * Adds headers like X-Content-Type-Options, Strict-Transport-Security, etc.
  D. Avoid eval(), Function(), child_process.exec()
  * These are dangerous and allow remote code execution (RCE) if misused.

  2. Secure Dependencies
  A. Audit Packages
  ```bash
  npm audit
  npm audit fix
  ```
  B. Use npm ci in CI/CD
  * Ensures lockfile consistency, avoids accidental upgrades.
  C. Use Trusted Packages
  * Avoid obscure/unmaintained libraries.
  * Watch for typosquatting attacks (e.g., expresss instead of express).

  3. Authentication & Authorization
  | Aspect | Best Practices |
  |----|----|
  | Authentication | Use OAuth2, JWT, or session-based auth via Passport.js |
  | Authorization | Role-based checks for routes/resources |
  | Password storage | Hash using bcrypt or argon2 (never store raw passwords) |

  4. Secure Transport (HTTPS & TLS)
  * Use HTTPS via NGINX, Let's Encrypt, or Cloudflare.
  * Redirect all HTTP traffic to HTTPS.

  5. Rate Limiting & Brute Force Protection
  * Use express-rate-limit or Redis-based limits.
  * Protect login, signup, password reset endpoints.

  6. Environment Variable Management
  * Never hardcode secrets or API keys.
  * Use .env, or secret managers (AWS Secrets Manager, Vault).
  * Prevent .env from being committed via .gitignore.

  7. Avoid Information Leakage
  * Don’t expose internal errors to clients:
  ```js [JavaScript]
  app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal Server Error' });
  });
  ```
  * Disable stack traces in production

  8. Secure Infrastructure
  | Area | Recommendations |
  |----|----|
  | Reverse proxy | Use NGINX or API Gateway to terminate SSL, filter traffic |
  | Firewalls | Close unnecessary ports, block unused protocols |
  | Container security | Use minimal Node.js images (e.g., Alpine), scan Dockerfiles |
  | Logging | Mask PII and credentials in logs |
  | Monitoring | Set alerts for auth failures, unusual traffic, etc. |

  Summary Checklist
  | Security Layer | Tool/Practice |
  |----|----|
  | Input Validation | express-validator, Joi, zod |
  | Secure Headers | helmet |
  | Dependency Hygiene | npm audit, lockfile enforcement |
  | HTTPS Everywhere | TLS via proxy or certs |
  | Auth & Session Control | Passport.js, JWT, CSRF tokens |
  | Rate Limiting | express-rate-limit, Redis buckets |
  | Error Handling | Hide stack traces, generic messages |
  | Logging | Sanitize sensitive fields |

  <p class="conclusion">
    Conclusion: Security in Node.js apps is not automatic. You need to validate inputs, audit packages, harden headers, manage secrets, and secure your infrastructure. Think defense-in-depth — one layer won’t be enough.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What is the difference between socket.io and WebSocket, and how does Node.js support real-time communication?
  </summary>

  <p class="short-answer">
    WebSocket and socket.io are both used for real-time, bidirectional communication between a client and a server — often used in chat apps, live dashboards, gaming, and collaborative tools. However, they are not the same.
  </p>

  1. WebSocket (Native Protocol)
  * A low-level protocol (RFC 6455) built into browsers and Node.js.
  * Enables persistent, full-duplex TCP connections.
  * Must be manually handled — including reconnections, fallbacks, and event routing.
  Example (Node.js native WebSocket):
  ```bash
  npm install ws
  ```

  ```js [JavaScript]
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 3000 });

  wss.on('connection', socket => {
    socket.on('message', msg => console.log('Received:', msg));
    socket.send('Hello from server');
  });
  ```

  2. socket.io (Library Built on WebSocket + Fallbacks)
  * A high-level abstraction over WebSocket.
  * Supports:
      * Automatic reconnection
      * Fallbacks (polling, long-polling)
      * Broadcasting
      * Rooms
      * Middleware support
      * Client-server version sync
  Example:
  ```bash
  npm install socket.io
  ```

  ```js [JavaScript]
  const http = require('http').createServer();
  const io = require('socket.io')(http);

  io.on('connection', socket => {
    console.log('Client connected');
    socket.emit('welcome', 'Hello Client!');
    socket.on('chat message', msg => {
      io.emit('chat message', msg); // broadcast
    });
  });

  http.listen(3000);
  ```

  Comparison: WebSocket vs socket.io
  | Feature | WebSocket | socket.io |
  |----|----|----|
  | Protocol | Native WebSocket (RFC 6455) | Custom protocol over WebSocket + fallback |
  | Browser Support | Modern browsers | All modern browsers (includes fallbacks) |
  | Reconnection | Manual | Automatic |
  | Fallbacks (polling) | No | Yes |
  | Namespaces / Rooms | No (manual) | Yes |
  | Binary data support | Yes | Yes |
  | Server implementation | ws, uWebSockets.js, net | socket.io |

  When to Use What
  | Use Case | Recommendation |
  |----|----|
  | Lightweight, raw protocol needed | Use WebSocket (ws) |
  | You want robust real-time features | Use socket.io |
  | You need fallback for old clients | Use socket.io |
  | You're building your own protocol | Use WebSocket |

  Real-Time in Node.js
  * Native support via:
      * ws (WebSocket)
      * net (raw TCP)
  * Higher-level: socket.io, SockJS, Primus

  Conclusion: Use WebSocket for low-level control and performance. Use socket.io when you want a complete real-time solution with fallbacks, reconnects, and features like rooms and events out of the box.

  <p class="conclusion">
    Conclusion: Use WebSocket for low-level control and performance. Use socket.io when you want a complete real-time solution with fallbacks, reconnects, and features like rooms and events out of the box.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What are throttling and debouncing, and why are they used in Node.js?
  </summary>

  <p class="short-answer">
    Throttling and debouncing are two performance techniques used to control how often a function executes, especially in response to frequent events like API requests, user input, or file changes. They’re often used in frontend apps but are also useful in Node.js backends (e.g., rate-limiting, logging, live updates).
  </p>

  1. Throttling
  * Limits the rate at which a function can be called.
  * Ensures that the function is called at most once per interval (e.g., once every 100ms), no matter how many times the event is triggered.
  Use case in Node.js:
  * Limiting API requests to a microservice
  * Throttled logging to avoid log flooding
  Example:
  ```js [JavaScript]
  function throttle(fn, limit) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn(...args);
      }
    };
  }

  const throttledLog = throttle(console.log, 2000);
  setInterval(() => throttledLog('This logs at most every 2s'), 100);
  ```

  2. Debouncing
  * Delays the function execution until a certain amount of time has passed since the last call.
  * The function is executed only once, after the last triggering event.
  Use case in Node.js:
  * Wait until the user stops typing before hitting a search API
  * Avoid duplicate file watcher triggers on file save
  Example:
  ```js [JavaScript]
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedLog = debounce(console.log, 1000);
  debouncedLog('Start typing...');
  debouncedLog('Still typing...');
  debouncedLog('Stopped typing...'); // Only this one logs after 1s
  ```

  Throttle vs Debounce Summary
  | Feature | Throttling | Debouncing |
  |----|----|----|
  | Purpose | Limit the rate of function calls | Delay function call until input stops |
  | Behavior | Executes every X ms | Executes only after idle time |
  | Use case | API call limiter, scroll listener | Search input, file system events |
  | Trigger pattern | Regular/periodic | Only once after activity ends |

  Libraries for Throttle/Debounce
  * lodash:
  ```js [JavaScript]
  const { throttle, debounce } = require('lodash');
  ```
  * rxjs (for reactive apps)
  * underdash, throttle-debounce

  <p class="conclusion">
    Conclusion: In Node.js, throttling is ideal when you need to limit execution frequency, while debouncing is best when you want to delay execution until activity stops. Both are essential for optimizing performance and preventing overload in event-driven applications.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What are some common patterns for organizing large-scale Node.js applications?
  </summary>

  <p class="short-answer">
    Organizing large-scale Node.js applications requires adopting structured architectural patterns, proper modularity, and clean separation of concerns to keep the codebase maintainable, testable, and scalable as the project grows.
  </p>

  1. Layered Architecture (MVC / Clean Architecture)
  Structure:
  ```
  /controllers
  /services
  /repositories
  /models
  /routes
  /middlewares
  /utils
  ```
  | Layer | Role |
  |----|----|
  | Controller | Handle requests/responses |
  | Service | Business logic |
  | Repository | Data access (DB, cache, etc.) |
  | Model | Data schema (e.g., Mongoose, Prisma) |
  Pros: Clear separation, easier testing
  Cons: Requires discipline, boilerplate

  2. Domain-Driven Design (DDD)
  Structure around business domains instead of technical layers.
  Structure:
  ```
  /src
    /user
      controller.js
      service.js
      user.model.js
      user.routes.js
    /order
      ...
  ```
  Pros: Highly modular, encapsulates features
  Cons: Can be overkill for small projects

  3. Feature-based Modular Structure (Monorepo Friendly)
  Each feature/domain is a self-contained unit.
  ```
  /modules
    /auth
    /users
    /products
  ```
  Each module can export:
  * Routes
  * Services
  * Models
  * Middlewares
  Pros: Great for team ownership & scaling
  Cons: Slightly harder dependency management

  4. Plugin/Dependency Injection Pattern
  * Use IoC (Inversion of Control) or DI containers (e.g., awilix, typedi)
  * Promotes testability and loose coupling
  ```js [JavaScript]
  container.register({
    userService: asClass(UserService),
    userController: asFunction(userController)
  });
  ```
  Pros: Clean decoupling, great for testing/mocking
  Cons: Extra complexity, learning curve

  5. Monolith vs Microservices
  | Type | When to Use |
  | Monolith | Single team, fast iteration, shared database |
  | Microservices | Independent domains, scalability, async systems |
  In Node.js, frameworks like Fastify, NestJS, or Express with modules can be used to organize either approach effectively.

  Best Practices for Large-Scale Apps
  | Practice | Benefit |
  |----|----|
  | Use config or .env for environment separation | Prevent hardcoded settings |
  | Centralized error handling | Consistent API responses, easier debugging |
  | Modular route loading | Keeps router files manageable |
  | Abstract data access | Swappable persistence layer (DB, cache) |
  | Unit + integration tests | Test business logic and full workflows |
  | Linting + formatting tools | Enforce consistency (e.g., ESLint, Prettier) |
  | Use TypeScript (if possible) | Improves maintainability and DX |

  Recommended Project Skeleton (Express)
  ```
  /src
    /api
      /users
        controller.js
        routes.js
        service.js
        user.model.js
    /config
    /middlewares
    /utils
    app.js
    server.js
  ```

  <p class="conclusion">
    Conclusion: For large Node.js apps, prefer modular, feature-driven, and layered designs that align with team scale and business complexity. Add tooling, tests, and separation to ensure long-term maintainability.
  </p>
</details>

<details class="neutral">
  <summary>
    0: What’s the difference between vertical and horizontal scaling in Node.js, and how can each be implemented?
  </summary>

  <p class="short-answer">
    In the context of Node.js (or any backend service), scaling refers to increasing your application's capacity to handle more requests, users, or data. There are two primary types:
  </p>

  1. Vertical Scaling
  Definition: Adding more resources (CPU, RAM, SSD) to a single server/instance to handle more load.
  Example in Node.js:
  * Increase memory (--max-old-space-size) to allow larger heaps.
  * Run more worker_threads or child_processes to offload heavy tasks.
  * Use internal caching to reduce DB calls.
  Pros:
  * Simple to implement
  * No complex architecture
  * Useful for performance tuning
  Cons:
  * Limited by physical hardware
  * Single point of failure
  * Scaling is expensive and reaches a hard limit

  2. Horizontal Scaling
  Definition:Adding more instances of your Node.js app, each handling a share of traffic.
  How to do it:
  * Cluster Module (multi-core parallelism on one machine)
  ```js [JavaScript]
  const cluster = require('cluster');
  const os = require('os');

  if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    // Start HTTP server here
  }
  ```

  * Process Manager like PM2
  ```bash
  pm2 start app.js -i max    # Spawns per core
  ```

  * Run in Containers
      * Deploy multiple Docker containers with the app.
      * Use a load balancer (e.g., NGINX, HAProxy, AWS ELB) to distribute requests.
  * Kubernetes or Serverless
      * Auto-scale containers/pods in response to traffic.
      * Node.js fits well with serverless platforms (AWS Lambda, Vercel).
  Pros:
  * Scalability is virtually unlimited
  * Load balancing adds fault tolerance
  * Best for distributed, production-grade systems
  Cons:
  * Requires external infrastructure (LB, orchestration)
  * State sharing (e.g., session, cache) requires external services (Redis, DB)

  Comparison Table
  | Scaling Type | Vertical | Horizontal |
  |--------------|----------|------------|
  | Scale by | Adding power (CPU/RAM) | Adding more instances |
  | Easy to implement | Yes | Requires orchestration |
  | Max limit | Hardware-bound | Virtually limitless |
  | Failure risk | Higher (single node) | Lower (redundancy) |
  | Cost scaling | Exponential | Linear |
  | Ideal for | Small teams, dev/test environments | Production, microservices, cloud-native |

  Best Practices for Node.js Scaling
  * Use stateless APIs to make horizontal scaling easy
  * Externalize session and cache via Redis or DB
  * Use reverse proxies or ingress to route traffic
  * Monitor event loop lag, CPU, and memory to auto-scale

  <p class="conclusion">
    Conclusion: Vertical scaling is a good starting point, but it’s inherently limited. For real-world, high-traffic apps, you should architect for horizontal scaling, with stateless services, clustering, container orchestration, and proper load balancing.
  </p>
</details>

<details class="neutral">
  <summary>
    0: How would you architect a high-throughput Node.js system for a real-time collaborative application (e.g., Google Docs clone)?
  </summary>

  <p class="short-answer">
    Designing a real-time, collaborative application (like a Google Docs clone) using Node.js involves handling many concurrent users, synchronized state, low latency messaging, and conflict resolution — all while keeping the system scalable, resilient, and secure.
  </p>

  Here’s how you might architect such a system:

  1. Core Technology Stack
  | Component | Technology |
  |-----------|------------|
  | Backend runtime | Node.js |
  | Real-time transport | WebSocket (socket.io, ws, or uWebSockets.js) |
  | State management | CRDTs or OT (Operational Transform) |
  | Data store | MongoDB / PostgreSQL + Redis |
  | Collaboration engine | Automerge, ShareDB, or custom CRDT lib |
  | Load balancing | NGINX / AWS ELB / Kubernetes Ingress |
  | Scaling | Node.js clustering + containers |
  | Deployment | Docker + Kubernetes or Serverless |

  2. Real-Time Collaboration Architecture
  WebSocket Layer
  * Use socket.io or uWebSockets.js for real-time communication.
  * Maintain socket connections per document or user.
  * Implement rooms/namespaces for document sessions.
  Change Broadcast + Conflict Resolution
  * Use CRDT or OT to resolve concurrent edits:
      * CRDT: better for P2P or offline-first apps (e.g., Automerge, Yjs).
      * OT: better for central coordination (e.g., ShareDB).
  * Changes are batched and broadcast to other clients instantly.
  Persistence Layer
  * Store final doc state in DB (MongoDB, Postgres).
  * Optionally store granular diffs for version history.
  State Sync & Recovery
  * When a new client joins:
      * Sync latest state from memory or DB
      * Replay missed operations via logs or Redis stream
  Redis Pub/Sub or Event Bus
  * Share changes across horizontally scaled instances.
  * Each server subscribes to Redis Pub/Sub for doc events.
  ```js [JavaScript]
  // When a change is made on one instance:
  redis.publish('doc:1234', JSON.stringify({ changes }));

  // Other instances:
  redis.subscribe('doc:1234');
  ```

  3. Scalability and Fault Tolerance
  | Strategy | Details |
  |----|----|
  | Node.js Clustering | Use all CPU cores on each server instance |
  | Horizontal scaling | Deploy multiple app pods behind a load balancer |
  | Redis-backed sessions | To share auth/session state across instances |
  | Sticky sessions | If WebSocket requires server affinity (can be avoided if state is externalized) |
  | Health checks + auto-restart | Use PM2 or Kubernetes for process supervision |

  4. Security Considerations
  * Authentication: Use JWT with token validation on socket connection.
  * Authorization: Ensure users can only access allowed docs.
  * Rate limiting: On WebSocket events to prevent abuse.
  * Input validation: Sanitize all incoming ops/events.

  5. Optional Enhancements
  * **File storage:** Use S3 or similar for attachments.
  * **Search indexing:** Use Elasticsearch or Meilisearch.
  * **Analytics:** Track editing behavior, active sessions.
  * **Presence indicators:** Real-time awareness of users in document.

  Architecture Diagram Summary (Conceptual)
  ```
  Client (Web/React/TS)
      |
  WebSocket (socket.io/uWebSockets.js)
      |
  Node.js App (Clustered)
      ├── CRDT/OT Engine
      ├── Auth + Room Mgmt
      ├── Redis Pub/Sub
      ├── DB (Postgres/Mongo)
      └── File Storage (S3)
  ```

  <p class="conclusion">
    Conclusion: A high-throughput, collaborative Node.js system needs real-time messaging, intelligent conflict resolution, scalable infrastructure, and shared state coordination. Use Redis Pub/Sub for cross-node sync, CRDT/OT for doc collaboration, and horizontal scaling for reliability under load.
  </p>
</details>
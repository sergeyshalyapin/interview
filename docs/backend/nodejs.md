Node.js ---- progress: 9%
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
  |----------|----------|----------|
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
      What is the difference between process.nextTick(), setImmediate(), and setTimeout(fn, 0) in Node.js?
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
  |----------|-------------------------------------|
  | process.nextTick()	| You want to run logic immediately after current operation |
  | setImmediate()	| You want to run code after I/O callbacks |
  | setTimeout(fn, 0)	| You want to delay execution slightly, less predictable |

  <p class="conclusion">
    In summary, Node.js is optimized for handling many lightweight connections concurrently with minimal resource usage, while traditional servers rely on parallel threads, which are more resource-intensive.
  </p>

</details>
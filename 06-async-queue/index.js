/**
 * Async Queue Implementation
 *
 * A queue that processes async tasks with concurrency control.
 */
class AsyncQueue {
  /**
   * Create an async queue
   * @param {Object} options - Queue options
   * @param {number} [options.concurrency=1] - Maximum concurrent tasks
   * @param {boolean} [options.autoStart=true] - Start processing immediately
   */
  constructor(options = {}) {
    // TODO: Initialize the queue
    // Step 1: Extract options with defaults
    // this.concurrency = options.concurrency || 1;
    // this.autoStart = options.autoStart !== false;
    // Step 2: Initialize internal state
    // this.queue = [];        // Pending tasks
    // this.running = 0;       // Currently running count
    // this.paused = false;    // Paused state
    // this.emptyCallbacks = []; // Callbacks for empty event
    this.concurrency = options.concurrency || 1;
    this.autoStart = options.autoStart !== false;
    this.queue = [];        // Pending tasks
    this.running = 0;       // Currently running count
    this.paused = false;    // Paused state
    this.emptyCallbacks = []; // Callbacks for empty event
  }

  /**
   * Add a task to the queue
   * @param {Function} task - Async function to execute
   * @param {Object} [options] - Task options
   * @param {number} [options.priority=0] - Task priority (higher = sooner)
   * @returns {Promise} Resolves when task completes
   */
  add(task, options = {}) {
    // TODO: Implement add
    // Step 1: Create a new Promise and store its resolve/reject
    // Step 2: Create task entry with: task, priority, resolve, reject
    // Step 3: Add to queue (consider priority ordering)
    // Step 4: Try to process if autoStart and not paused
    // Step 5: Return the promise
    return new Promise((resolve,reject)=>{
      const taskEntry = {
        task,                     
        priority: options.priority || 0, 
        resolve,                  
        reject                   
      };
      this.queue.push(taskEntry);
      this.queue.sort((a, b) => b.priority - a.priority);
      if (this.autoStart && !this.paused) {
        this._process();
      }
    });
  }

  /**
   * Start processing the queue
   */
  start() {
    // TODO: Implement start
    // Set paused to false and trigger processing
    // Установить paused = false и запустить обработку
    this.paused = false;
    if (this.queue.length > 0) {
      this._process();
    }
  }

  /**
   * Pause the queue (running tasks will complete)
   */
  pause() {
    // TODO: Implement pause
    // Set paused to true
    this.paused = true;
  }

  /**
   * Clear all pending tasks
   */
  clear() {
    // TODO: Implement clear
    // Empty the queue array
    // Optionally: reject pending promises with an error
    
    this.queue = [];
  }

  /**
   * Register callback for when queue becomes empty
   * @param {Function} callback - Called when queue is empty
   */
  onEmpty(callback) {
    // TODO: Implement onEmpty
    // Store callback to be called when size becomes 0 and nothing running
    this.emptyCallbacks.push(callback);
    if (this.size === 0 && this.pending === 0) {
      this._checkEmpty();
    }
  }

  /**
   * Number of pending tasks
   * @returns {number}
   */
  get size() {
    // TODO: Return queue lengthЫ
    return this.queue.length;
  }

  /**
   * Number of currently running tasks
   * @returns {number}
   */
  get pending() {
    // TODO: Return running count
    return this.running;
  }

  /**
   * Whether queue is paused
   * @returns {boolean}
   */
  get isPaused() {
    // TODO: Return paused state
    return this.paused;
  }

  /**
   * Internal: Process next tasks from queue
   * @private
   */
  _process() {
    // TODO: Implement _process
    // Step 1: Check if we can run more tasks
    // - Not paused
    // - Running count < concurrency
    // - Queue has items
    // Step 2: Take task from queue (respect priority)
    // Step 3: Increment running count
    // Step 4: Execute task and handle result
    // - On success: resolve the task's promise
    // - On error: reject the task's promise
    // - Always: decrement running, call _process again, check if empty
    while (!this.paused && this.running < this.concurrency && this.queue.length > 0) {
      const taskEntry = this.queue.shift();
      this.running++;
      Promise.resolve(taskEntry.task())
        .then(result => {
          taskEntry.resolve(result);
        })
        .catch(error => {
          taskEntry.reject(error);
        })
        .finally(() => {
          this.running--;
          this._process(); 
          this._checkEmpty();
        });
    }
  }

  /**
   * Internal: Check and trigger empty callbacks
   * @private
   */
  _checkEmpty() {
    // TODO: If queue is empty and nothing running, call empty callbacks
    if (this.size === 0 && this.pending === 0 && this.emptyCallbacks.length > 0) {
        const callbacks = [...this.emptyCallbacks];
        this.emptyCallbacks = [];
        callbacks.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('Error in empty callback:', error);
          }
        });
      }
  }
}

module.exports = { AsyncQueue };

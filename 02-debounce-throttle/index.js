/**
 * Debounce Implementation
 *
 * Creates a debounced function that delays invoking `fn` until after `delay`
 * milliseconds have elapsed since the last time the debounced function was called.
 *
 * @param {Function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function with a cancel() method
 */
function debounce(fn, delay) {
  // TODO: Implement debounce

  // Step 1: Create a variable to store the timeout ID
  let timeoutId = null;

  // Step 2: Create the debounced function that:
  //   - Clears any existing timeout
  //   - Sets a new timeout to call fn after delay
  //   - Preserves `this` context and arguments
  function debounced(...args){
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(()=>{fn.apply(this, args)},delay);
  }

  // Step 3: Add a cancel() method to clear pending timeout
  debounced.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId); 
      timeoutId = null; 
    }
  };

  // Step 4: Return the debounced function
  return debounced;

  // Return a placeholder that doesn't work
  throw new Error("Not implemented");
}

/**
 * Throttle Implementation
 *
 * Creates a throttled function that only invokes `fn` at most once per
 * every `limit` milliseconds.
 *
 * @param {Function} fn - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} The throttled function with a cancel() method
 */
function throttle(fn, limit) {
  // TODO: Implement throttle

  // Step 1: Create variables to track:
  //   - Whether we're currently in a throttle period
  //   - The timeout ID for cleanup
  let lastCallTime = 0;
  let timeoutId = null;

  // Step 2: Create the throttled function that:
  //   - If not throttling, execute fn immediately and start throttle period
  //   - If throttling, ignore the call
  //   - Preserves `this` context and arguments
  function throttled(...args) {
    const now = Date.now();
    const lastTime = now - lastCallTime;
    
    if (lastTime >= limit) {
      fn.apply(this, args);
      lastCallTime = now;
    } else if (!timeoutId) { 
      const context = this;
      const savedArgs = args;
      timeoutId = setTimeout(() => {
        fn.apply(context, savedArgs);
        lastCallTime = Date.now();
        timeoutId = null; 
      }, limit - lastTime);
    }
  }

  // Step 3: Add a cancel() method to reset throttle state
  throttled.cancel = function(){
    if(timeoutId){
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = 0;
  }

  // Step 4: Return the throttled function
  return throttled;

  // Return a placeholder that doesn't work
  throw new Error("Not implemented");
}

module.exports = { debounce, throttle };

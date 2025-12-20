/**
 * Decorator Pattern Implementation
 */

/**
 * Logging Decorator
 *
 * Wraps a function to log its calls and return values.
 *
 * @param {Function} fn - Function to decorate
 * @returns {Function} Decorated function
 */
function withLogging(fn) {
  // TODO: Implement withLogging

  // Step 1: Return a new function that wraps fn
  // Step 2: Log the function name and arguments
  // Step 3: Call the original function
  // Step 4: Log the return value
  // Step 5: Return the result
  // Note: Preserve 'this' context using apply/call
  return function (...args){
    console.log(`Calling ${fn.name} with arguments:`, args);
    const result = fn.apply(this, args);
    console.log(`${fn.name} returned:`, result);
    return result;
  };
}

/**
 * Timing Decorator
 *
 * Wraps a function to measure and log execution time.
 *
 * @param {Function} fn - Function to decorate
 * @returns {Function} Decorated function
 */
function withTiming(fn) {
  // TODO: Implement withTiming
  // Step 1: Return a new function
  // Step 2: Record start time (performance.now() or Date.now())
  // Step 3: Call original function
  // Step 4: Calculate and log duration
  // Step 5: Return result
  return function (...args){
    const time = Date.now();
    const result = fn.apply(this, args);
    const endTime = Date.now();
    const duration = endTime - time;
    log(`${fn.name} took ${duration}ms to execute`);
    return result;
  }
}

/**
 * Retry Decorator
 *
 * Wraps a function to retry on failure.
 *
 * @param {Function} fn - Function to decorate
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Function} Decorated function
 */
function withRetry(fn, maxRetries = 3) {
  // TODO: Implement withRetry
  // Step 1: Return a new function
  // Step 2: Track attempt count
  // Step 3: Loop up to maxRetries:
  //   - Try to call fn
  //   - On success, return result
  //   - On failure, increment attempts and continue
  // Step 4: If all retries fail, throw the last error
  return function(...args){
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = fn.apply(this, args);
        if (attempt > 0) {
          log(`${fn.name} succeeded on retry ${attempt}`);
        }
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          log(`${fn.name} failed on attempt ${attempt + 1}: ${error.message}. ${maxRetries - attempt} retries left.`);
        }
      }
    }
    throw new Error(`${fn.name} failed after ${maxRetries + 1} attempts. Last error: ${lastError.message}`);
  }
}

/**
 * Memoize Decorator
 *
 * Wraps a function to cache results based on arguments.
 *
 * @param {Function} fn - Function to decorate
 * @returns {Function} Decorated function with cache
 */
function withMemoize(fn) {
  // TODO: Implement withMemoize
  // Similar to memoization assignment but as a decorator
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      log(`${fn.name} cache hit for args: ${key}`);
      return cache.get(key);
    }
    log(`${fn.name} cache miss for args: ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Validation Decorator
 *
 * Wraps a function to validate arguments before calling.
 *
 * @param {Function} fn - Function to decorate
 * @param {Function} validator - Validation function (returns boolean)
 * @returns {Function} Decorated function
 */
function withValidation(fn, validator) {
  // TODO: Implement withValidation
  // Step 1: Return a new function
  // Step 2: Call validator with arguments
  // Step 3: If validation fails, throw error
  // Step 4: If passes, call original function
  return function (...args) {
    const isValid = validator(...args);
    if (!isValid) {
      const errorMessage = `Validation failed for function ${fn.name} with arguments: ${JSON.stringify(args)}`;
      log(errorMessage);
      throw new Error(errorMessage);
    }
    log(`Validation passed for ${fn.name} with arguments: ${JSON.stringify(args)}`);
    return fn.apply(this, args);
  };
}

/**
 * Cache Object Method Decorator
 *
 * Decorates an object method to cache its results.
 *
 * @param {Object} obj - Object containing the method
 * @param {string} methodName - Name of method to cache
 * @returns {Object} Object with cached method
 */
function withCache(obj, methodName) {
  // TODO: Implement withCache
  // Step 1: Get the original method
  // Step 2: Create a cache (Map)
  // Step 3: Replace the method with a caching wrapper
  // Step 4: Return the object
  // Broken: deletes the method instead of caching it
  const originalMethod = obj[methodName];
  if (typeof originalMethod !== 'function') {
    throw new Error(`${methodName} is not a function on the object`);
  }
  const cache = new Map();
  obj[methodName] = function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      log(`Cache hit for ${methodName}(${args.join(', ')})`);
      return cache.get(key);
    }
    log(`Cache miss for ${methodName}(${args.join(', ')})`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  return obj;
}

/**
 * Compose Decorators
 *
 * Composes multiple decorators into one.
 * Decorators are applied right-to-left.
 *
 * @param {...Function} decorators - Decorator functions
 * @returns {Function} Composed decorator
 */
function compose(...decorators) {
  // TODO: Implement compose
  // Return a function that takes fn and applies all decorators
  // Example: compose(a, b, c)(fn) = a(b(c(fn)))
  return function (fn) {
    let decoratedFn = fn;
    for (let i = decorators.length - 1; i >= 0; i--) {
      decoratedFn = decorators[i](decoratedFn);      }
    return decoratedFn;
  };
}

/**
 * Pipe Decorators
 *
 * Like compose but applies left-to-right.
 *
 * @param {...Function} decorators - Decorator functions
 * @returns {Function} Piped decorator
 */
function pipe(...decorators) {
  // TODO: Implement pipe
  // Same as compose but left-to-right
  return function (fn) {
    let decoratedFn = fn;
    for (let i = 0; i < decorators.length; i++) {
      decoratedFn = decorators[i](decoratedFn);
    }
    return decoratedFn;
  };
}

// Storage for logs (used in tests)
const logs = [];

function log(message) {
  logs.push(message);
  console.log(message); // Uncomment for debugging
}

function clearLogs() {
  logs.length = 0;
}

function getLogs() {
  return [...logs];
}

module.exports = {
  withLogging,
  withTiming,
  withRetry,
  withMemoize,
  withValidation,
  withCache,
  compose,
  pipe,
  log,
  clearLogs,
  getLogs,
};

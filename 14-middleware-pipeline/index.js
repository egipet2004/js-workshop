/**
 * Middleware Pipeline Implementation
 *
 * An Express/Koa-style middleware pipeline.
 */
class Pipeline {
  constructor() {
    // TODO: Initialize middleware array
    this.middleware = [];
  }

  /**
   * Add middleware to the pipeline
   * @param {Function} fn - Middleware function (ctx, next) => {}
   * @returns {Pipeline} this (for chaining)
   */
  use(fn) {
    // TODO: Implement use
    // Step 1: Validate fn is a function
    // Step 2: Add to middleware array
    // Step 3: Return this for chaining
    if(typeof fn !== "function"){
      throw new TypeError('Middleware must be function');
    }
    this.middleware.push(fn);
    return this;
  }

  /**
   * Execute the pipeline with given context
   * @param {Object} context - Context object passed to all middleware
   * @returns {Promise} Resolves when pipeline completes
   */
  run(context) {
    // TODO: Implement run
    // Step 1: Create a dispatch function that:
    //   - Takes an index
    //   - Gets middleware at that index
    //   - If no middleware, resolve
    //   - Otherwise, call middleware with context and next function
    //   - next = () => dispatch(index + 1)
    // Step 2: Start dispatch at index 0
    // Step 3: Return promise for async support
    const dispatch = (index) => {
      if (index >= this.middleware.length) {
        return Promise.resolve();
      }
      const fn = this.middleware[index];
      try {
        const next = () => dispatch(index + 1);
        return Promise.resolve(fn(context, next));
      } catch (error) {
        return Promise.reject(error);
      }
    };
  return dispatch(0);
  }

  /**
   * Compose middleware into a single function
   * @returns {Function} Composed middleware function
   */
  compose() {
    // TODO: Implement compose
    // Return a function that takes context and runs the pipeline
    return (context) => this.run(context);
  }
}

/**
 * Compose function (standalone)
 *
 * Composes an array of middleware into a single function.
 *
 * @param {Function[]} middleware - Array of middleware functions
 * @returns {Function} Composed function (context) => Promise
 */
function compose(middleware) {
  // TODO: Implement compose
  // Validate all items are functions
  // Return a function that:
  // - Takes context
  // - Creates dispatch(index) that calls middleware[index]
  // - Returns dispatch(0)
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array');
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions');
    }
  }
      // TODO: Implement dispatch
      // Step 1: Get middleware at index
      // Step 2: If none, return resolved promise
      // Step 3: Create next function = () => dispatch(index + 1)
      // Step 4: Call middleware with (context, next)
      // Step 5: Return as promise
   // Return a function that takes context

  return function (context) {
    function dispatch(index) {
      if (index >= middleware.length) {
        return Promise.resolve();
      }
      const fn = middleware[index];
      try {
        const next = () => dispatch(index + 1);
        return Promise.resolve(fn(context, next));
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return dispatch(0);
  };
};


/**
 * Create a middleware that runs conditionally
 *
 * @param {Function} condition - (ctx) => boolean
 * @param {Function} middleware - Middleware to run if condition is true
 * @returns {Function} Conditional middleware
 */
function when(condition, middleware) {
  // TODO: Implement when
  // Return middleware that:
  // - Checks condition(ctx)
  // - If true, runs middleware
  // - If false, just calls next()

  if (typeof condition !== 'function') {
    throw new TypeError('Condition must be a function');
  }
  if (typeof middleware !== 'function') {
    throw new TypeError('Middleware must be a function');
  }
  return (ctx, next) => {
    if (condition(ctx)) {
      return middleware(ctx, next);
    } else {
      return next();
    }
  };
}

/**
 * Create a middleware that handles errors
 *
 * @param {Function} errorHandler - (error, ctx) => {}
 * @returns {Function} Error handling middleware
 */
function errorMiddleware(errorHandler) {
  // TODO: Implement errorMiddleware
  // Return middleware that:
  // - Wraps next() in try/catch
  // - Calls errorHandler if error thrown

  if (typeof errorHandler !== 'function') {
    throw new TypeError('Error handler must be a function');
  }
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      errorHandler(error, ctx);
    }
  };
}

module.exports = {
  Pipeline,
  compose,
  when,
  errorMiddleware,
};

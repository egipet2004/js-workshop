/**
 * Custom Bind Implementation
 *
 * Creates a new function that, when called, has its `this` keyword set to
 * the provided context, with a given sequence of arguments preceding any
 * provided when the new function is called.
 *
 * @param {Function} fn - The function to bind
 * @param {*} context - The value to bind as `this`
 * @param {...*} boundArgs - Arguments to prepend to the bound function
 * @returns {Function} A new bound function
 */
function customBind(fn, context, ...boundArgs) {
  // TODO: Implement custom bind
  // Step 1: Validate that fn is a function
  // Throw TypeError if not
  if (typeof fn !== 'function') {
    throw new TypeError(`${fn} is not a function`);
  }
  // Step 2: Create the bound function
  // It should:
  //   - Combine boundArgs with any new arguments
  //   - Call the original function with the combined arguments
  //   - Use the correct `this` context
  function bound(...newArgs) {
    const combinedArgs = [...boundArgs, ...newArgs];
    const thisContext = this instanceof bound ? this : context;
    return fn.apply(thisContext, combinedArgs);
  }
  // Step 3: Handle constructor calls (when used with `new`)
  // When called as a constructor:
  //   - `this` should be a new instance, not the bound context
  //   - The prototype chain should be preserve
  // Step 4: Preserve the prototype for constructor usage
  // boundFunction.prototype = Object.create(fn.prototype)
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
    bound.prototype.constructor = bound;
  }
  // Step 5: Return the bound function
  return bound;
}

/**
 * BONUS: Prototype Method Implementation
 *
 * Add customBind to Function.prototype so it can be called as:
 * myFunction.customBind(context, ...args)
 */
Function.prototype.customBind = function(context, ...boundArgs) {
  const fn = this;
  function bound(...newArgs) {
    const combinedArgs = [...boundArgs, ...newArgs];
    const thisContext = this instanceof bound ? this : context;
    return fn.apply(thisContext, combinedArgs);
  }
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
    bound.prototype.constructor = bound;
  }
  return bound;
};
module.exports = { customBind };
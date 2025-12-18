/**
 * Memoization Implementation
 *
 * Creates a memoized version of a function that caches results based on arguments.
 *
 * @param {Function} fn - The function to memoize
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.maxSize] - Maximum number of cached entries
 * @param {number} [options.ttl] - Time-to-live for cache entries in milliseconds
 * @param {Function} [options.keyGenerator] - Custom function to generate cache keys
 * @returns {Function} Memoized function with cache control methods
 */
function memoize(fn, options = {}) {
  // TODO: Implement memoization

  // Step 1: Extract options with defaults
  // const { maxSize, ttl, keyGenerator } = options;
  const maxSize = options.maxSize !== undefined ? options.maxSize : Infinity;
  const ttl = options.ttl !== undefined ? options.ttl : Infinity;
  const keyGenerator = options.keyGenerator || ((args) => JSON.stringify(args));

  // Step 2: Create the cache (use Map for ordered keys)
  // const cache = new Map();
  const cache = new Map();

  // Step 3: Create default key generator
  // Default: JSON.stringify(args) or args.join(',')

  // Step 4: Create the memoized function
  // - Generate cache key from arguments
  // - Check if key exists and is not expired (TTL)
  // - If cached, return cached value
  // - If not cached, call fn and store result
  // - Handle maxSize eviction (remove oldest)
  const memoized = function(...args) {
    const key = keyGenerator(args);
    if (cache.has(key)) {
      const cachedEntry = cache.get(key);
      if (ttl) {
        const now = Date.now();
        const isExpired = (now - cachedEntry.timestamp) > ttl;
        if (isExpired) {
          cache.delete(key);
        } else {
          return cachedEntry.value;
        }
      } else {
        return cachedEntry.value;
      }
    } 
    const result = fn.apply(this, args);
    cache.set(key, {
      value: result,
      timestamp: Date.now()
    });
    if (maxSize && cache.size > maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    return result;
  };

  // Step 5: Add cache control methods
  // memoized.cache = {
  //   clear: () => cache.clear(),
  //   delete: (key) => cache.delete(key),
  //   has: (key) => cache.has(key),
  //   get size() { return cache.size; }
  // };
  memoized.cache = {
    clear: () => cache.clear(),
    delete: (key) => cache.delete(key),
    has: (key) => cache.has(key),
    get size() { return cache.size; }
  };

  // Step 6: Return memoized function
  return memoized;
}

module.exports = { memoize };
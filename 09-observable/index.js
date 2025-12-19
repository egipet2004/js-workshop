/**
 * Observable Implementation
 *
 * A simple Observable for reactive data streams.
 */
class Observable {
  /**
   * Create an Observable
   * @param {Function} subscribeFn - Function called with subscriber on subscribe
   */
  constructor(subscribeFn) {
    // TODO: Store the subscribe function
    // this._subscribeFn = subscribeFn;
    this._subscribeFn = subscribeFn;
  }

  /**
   * Subscribe to the Observable
   * @param {Object|Function} observer - Observer object or next callback
   * @returns {Object} Subscription with unsubscribe method
   */
  subscribe(observer) {
    // TODO: Implement subscribe

    // Step 1: Normalize observer (handle function shorthand)
    // If observer is a function, wrap it: { next: observer }
    const normalizedObserver = typeof observer === 'function' 
      ? { next: observer } 
      : observer;

    // Step 2: Create a subscriber object that:
    //   - Has next, error, complete methods
    //   - Tracks if completed/errored (stops accepting values)
    //   - Calls observer methods when appropriate
    let isActive = true;
    const subscriber = {
      next: (value) => {
        if (isActive && normalizedObserver.next) {
          try {
            normalizedObserver.next(value);
          } catch (error) {
            this.error(error);
          }
        }
      },
      error: (err) => {
        if (isActive) {
          isActive = false;
          if (normalizedObserver.error) {
            normalizedObserver.error(err);
          }
        }
      },
      complete: () => {
        if (isActive) {
          isActive = false;
          if (normalizedObserver.complete) {
            normalizedObserver.complete();
          }
        }
      }
    };

    // Step 3: Call the subscribe function with the subscriber
    let cleanup;
    try {
      cleanup = this._subscribeFn(subscriber);
    } catch (error) {
      subscriber.error(error);
    }

    // Step 4: Handle cleanup function returned by subscribeFn
    // Step 5: Return subscription object with unsubscribe method
    return {
      unsubscribe: () => {
        if (isActive) {
          isActive = false;
          if (typeof cleanup === 'function') {
            cleanup();
          }
        }
      }
    };
  }

  /**
   * Transform each emitted value
   * @param {Function} fn - Transform function
   * @returns {Observable} New Observable with transformed values
   */
  map(fn) {
    // TODO: Implement map operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Calls fn on each value
    // - Emits transformed value

    return new Observable((subscriber) => {
      const subscription = this.subscribe({
        next: (value) => {
          try {
            subscriber.next(fn(value));
          } catch (error) {
            subscriber.error(error);
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Filter emitted values
   * @param {Function} predicate - Filter function
   * @returns {Observable} New Observable with filtered values
   */
  filter(predicate) {
    // TODO: Implement filter operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Only emits values where predicate returns true

    return new Observable((subscriber) => {
      const subscription = this.subscribe({
        next: (value) => {
          try {
            if (predicate(value)) {
              subscriber.next(value);
            }
          } catch (error) {
            subscriber.error(error);
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
      
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Take only first n values
   * @param {number} count - Number of values to take
   * @returns {Observable} New Observable limited to count values
   */
  take(count) {
    // TODO: Implement take operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Emits first `count` values
    // - Completes after `count` values
    return new Observable((subscriber) => {
      let taken = 0;
      
      const subscription = this.subscribe({
        next: (value) => {
          if (taken < count) {
            subscriber.next(value);
            taken++;
          }
          if (taken >= count) {
            subscriber.complete();
            subscription.unsubscribe();
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
      
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Skip first n values
   * @param {number} count - Number of values to skip
   * @returns {Observable} New Observable that skips first count values
   */
  skip(count) {
    // TODO: Implement skip operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Ignores first `count` values
    // - Emits remaining values

    return new Observable((subscriber) => {
      let skipped = 0;
      
      const subscription = this.subscribe({
        next: (value) => {
          if (skipped >= count) {
            subscriber.next(value);
          } else {
            skipped++;
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
      
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Create Observable from array
   * @param {Array} array - Array of values
   * @returns {Observable} Observable that emits array values
   */
  static from(array) {
    // TODO: Implement from

    // Return new Observable that:
    // - Emits each array element
    // - Completes after last element

    return new Observable((subscriber) => {
      for (const item of array) {
        subscriber.next(item);
      }
      subscriber.complete();
      return () => {};
    });
  }

  /**
   * Create Observable from single value
   * @param {*} value - Value to emit
   * @returns {Observable} Observable that emits single value
   */
  static of(...values) {
    // TODO: Implement of

    // Return new Observable that emits all values then completes

    return Observable.from(values);
  }
}

module.exports = { Observable };

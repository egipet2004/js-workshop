/**
 * State Machine Implementation
 */
class StateMachine {
  /**
   * Create a state machine
   * @param {Object} config - Machine configuration
   * @param {string} config.initial - Initial state
   * @param {Object} config.states - State definitions
   * @param {Object} [config.context] - Initial context data
   */
  constructor(config) {
    // TODO: Implement constructor
    // Step 1: Validate config has initial and states
    // Step 2: Store configuration
    // Step 3: Validate initial state exists in states
    if (!config) {
      throw new Error('Configuration is required');
    }
    if (typeof config.initial !== 'string' || !config.initial.trim()) {
      throw new Error('Initial state must be a non-empty string');
    }
    if (!config.states || typeof config.states !== 'object' || Array.isArray(config.states)) {
      throw new Error('States must be an object');
    }
    if (!config.states.hasOwnProperty(config.initial)) {
      throw new Error(`Initial state '${config.initial}' is not defined in states`);
    }
    this.config = config;
    this.currentState = config.initial;
    this.context = config.context || {};
  }

  /**
   * Get current state
   * @returns {string}
   */
  get state() {
    // TODO: Return current state
    return this.currentState;
  }

  /**
   * Attempt a state transition
   * @param {string} event - Event name
   * @param {Object} [payload] - Optional data for the transition
   * @returns {boolean} Whether transition was successful
   */
  transition(event, payload) {
    // TODO: Implement transition
    // Step 1: Get current state config
    // Step 2: Check if event is valid for current state
    // Return false if not
    // Step 3: Get transition config (can be string or object)
    // If string: target = transition
    // If object: { target, guard, action }
    // Step 4: Check guard if present
    // If guard returns false, return false
    // Step 5: Update state to target
    // Step 6: Call action if present
    // Step 7: Return true
    const stateConfig = this.config.states[this.currentState];
    if (!stateConfig) {
      return false;
    }
    const transitions = stateConfig.on;
    if (!transitions || !transitions.hasOwnProperty(event)) {
      return false;
    }
    const transition = transitions[event];
    let target, guard, action;
    if (typeof transition === 'string') {
      target = transition;
    } else if (transition && typeof transition === 'object') {
      target = transition.target;
      guard = transition.guard;
      action = transition.action;
    } else {
      return false;
    }
    if (!this.config.states.hasOwnProperty(target)) {
      return false;
    }
    if (guard && typeof guard === 'function') {
      if (!guard(this.context, payload)) {
        return false;
      }
    }
    this.currentState = target;
    if (action && typeof action === 'function') {
      action(this.context, payload);
    }
    return true;
  }

  /**
   * Check if a transition is possible
   * @param {string} event - Event name
   * @returns {boolean}
   */
  can(event) {
    // TODO: Implement can
    // Check if event exists for current state
    // Check guard if present
    const stateConfig = this.config.states[this.currentState];
    if (!stateConfig || !stateConfig.on || !stateConfig.on.hasOwnProperty(event)) {
      return false;
    }
    const transition = stateConfig.on[event];
    if (transition && typeof transition === 'object' && transition.guard) {
      if (typeof transition.guard !== 'function') {
        return false;
      }
      return transition.guard(this.context);
    }
    return true;
  }

  /**
   * Get available transitions from current state
   * @returns {string[]} Array of event names
   */
  getAvailableTransitions() {
    // TODO: Implement getAvailableTransitions
    // Return array of event names from current state's 'on' config
    const stateConfig = this.config.states[this.currentState];
    if (!stateConfig || !stateConfig.on) {
      return [];
    }
    return Object.keys(stateConfig.on);
  }

  /**
   * Get the context data
   * @returns {Object}
   */
  getContext() {
    // TODO: Return context
    return this.context;
  }

  /**
   * Update context data
   * @param {Object|Function} updater - New context or updater function
   */
  updateContext(updater) {
    // TODO: Implement updateContext
    // If updater is function: this.context = updater(this.context)
    // If updater is object: merge with existing context
    if (typeof updater === 'function') {
      this.context = updater(this.context);
    } else if (updater && typeof updater === 'object') {
      this.context = { ...this.context, ...updater };
    }
  }

  /**
   * Check if machine is in a final state (no transitions out)
   * @returns {boolean}
   */
  isFinal() {
    // TODO: Check if current state has no transitions
    const stateConfig = this.config.states[this.currentState];
    return !stateConfig || !stateConfig.on || Object.keys(stateConfig.on).length === 0;
  }

  /**
   * Reset machine to initial state
   * @param {Object} [newContext] - Optional new context
   */
  reset(newContext) {
    // TODO: Reset to initial state
    // Optionally reset context
    this.currentState = this.config.initial;
    if (newContext !== undefined) {
      this.context = newContext;
    }
  }
}

/**
 * Create a state machine factory
 *
 * @param {Object} config - Machine configuration
 * @returns {Function} Factory function that creates machines
 */
function createMachine(config) {
  // TODO: Implement createMachine
  // Return a function that creates new StateMachine instances
  // with the given config
  return () => new StateMachine(config);
}

module.exports = { StateMachine, createMachine };

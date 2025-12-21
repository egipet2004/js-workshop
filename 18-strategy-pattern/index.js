/**
 * Strategy Pattern Implementation
 */

// ============================================
// SORTING STRATEGIES
// ============================================

/**
 * Sort Context
 *
 * Delegates sorting to a strategy.
 */
class SortContext {
  constructor(strategy) {
    // TODO: Store strategy
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    // TODO: Update strategy
    this.strategy = strategy;
  }

  sort(array) {
    // TODO: Delegate to strategy
    // Return sorted copy, don't mutate original
    return this.strategy.sort([...array]);
  }
}

/**
 * Bubble Sort Strategy
 */
class BubbleSort {
  sort(array) {
    // TODO: Implement bubble sort
    // Return new sorted array
    const arr = [...array];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }
}

/**
 * Quick Sort Strategy
 */
class QuickSort {
  sort(array) {
    // TODO: Implement quick sort
    // Return new sorted array
    const arr = [...array];
    if (arr.length <= 1) {
      return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];
    for (const item of arr) {
      if (item < pivot) {
        left.push(item);
      } else if (item > pivot) {
        right.push(item);
      } else {
        equal.push(item);
      }
    } 
    return [...this.sort(left), ...equal, ...this.sort(right)];
  }
}

/**
 * Merge Sort Strategy
 */
class MergeSort {
  sort(array) {
    // TODO: Implement merge sort
    // Return new sorted array
    const arr = [...array];
    return this.mergeSort(arr);
  }
  mergeSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));
    return this.merge(left, right);
  }
  merge(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }
}

// ============================================
// PRICING STRATEGIES
// ============================================

/**
 * Pricing Context
 *
 * Calculates prices using a strategy.
 */
class PricingContext {
  constructor(strategy) {
    // TODO: Store strategy
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    // TODO: Update strategy
    this.strategy = strategy;
  }

  calculateTotal(items) {
    // TODO: Delegate to strategy
    return this.strategy.calculate(items);
  }
}

/**
 * Regular Pricing (no discount)
 */
class RegularPricing {
  calculate(items) {
    // TODO: Sum all item prices
    return items.reduce((total, item) => total + item.price, 0);
  }
}

/**
 * Percentage Discount
 */
class PercentageDiscount {
  constructor(percentage) {
    // TODO: Store percentage (0-100)
    this.percentage = percentage;
  }

  calculate(items) {
    // TODO: Apply percentage discount
    const subtotal = items.reduce((total, item) => total + item.price, 0);
    return subtotal * (1 - this.percentage / 100);
  }
}

/**
 * Fixed Discount
 */
class FixedDiscount {
  constructor(amount) {
    // TODO: Store fixed discount amount
    this.amount = amount;
  }

  calculate(items) {
    // TODO: Subtract fixed amount from total
    // Don't go below 0
    const subtotal = items.reduce((total, item) => total + item.price, 0);
    return Math.max(0, subtotal - this.amount);
  }
}

/**
 * Buy One Get One Free
 */
class BuyOneGetOneFree {
  calculate(items) {
    // TODO: Every second item is free
    // Sort by price desc, charge only every other item
    const sorted = [...items].sort((a, b) => b.price - a.price);
    let total = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (i % 2 === 0) {
        total += sorted[i].price;
      }
    }
    return total;
  }
}

/**
 * Tiered Discount
 *
 * Different discount based on total.
 */
class TieredDiscount {
  constructor(tiers) {
     this.tiers = tiers;
  }
  calculate(items) {
    const subtotal = items.reduce((total, item) => total + item.price, 0);
    let maxDiscount = 0;
    for (const tier of this.tiers) {
      if (subtotal >= tier.threshold && tier.discount > maxDiscount) {
        maxDiscount = tier.discount;
      }
    }
    return subtotal * (1 - maxDiscount / 100);
  }
}


// ============================================
// VALIDATION STRATEGIES
// ============================================

/**
 * Validation Context
 */
class ValidationContext {
  constructor(strategy) {
    // TODO: Store strategy
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    // TODO: Update strategy
    this.strategy = strategy;
  }

  validate(data) {
    // TODO: Delegate to strategy
    return this.strategy.validate(data);
  }
}

/**
 * Strict Validation
 *
 * Requires all three fields to be present and valid:
 * - name: must be a non-empty string
 * - email: must be a non-empty string (no regex validation required)
 * - age: must be a number (any number is valid, no range check required)
 */
class StrictValidation {
  validate(data) {
    // TODO: Validate that name, email, and age are all present and valid
    // Return { valid: boolean, errors: string[] }
    // Example: { valid: false, errors: ["Name is required", "Email is required"] }
    const errors = [];
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name is required');
    }
    if (typeof data.email !== 'string' || data.email.trim() === '') {
      errors.push('Email is required');
    }
    if (typeof data.age !== 'number') {
      errors.push('Age is required and must be a number');
    }
    return {
      valid: errors.length === 0,
      errors: errors
    }
  }
}

/**
 * Lenient Validation
 *
 * Accepts any data, including empty objects.
 * No validation rules - always passes.
 */
class LenientValidation {
  validate(data) {
    // TODO: Always return valid: true, errors: []
    // This strategy has no validation rules
    return { valid: true, errors: [] }; 
  }
}

// ============================================
// STRATEGY REGISTRY
// ============================================

/**
 * Strategy Registry
 *
 * Register and retrieve strategies by name.
 */
class StrategyRegistry {
  constructor() {
    // TODO: Initialize registry map
    this.strategies = new Map();
  }

  register(name, strategy) {
    // TODO: Store strategy by name
    this.strategies.set(name, strategy);
  }

  get(name) {
    // TODO: Return strategy by name
    return this.strategies.get(name) || null;
  }

  has(name) {
    // TODO: Check if strategy exists
    return this.strategies.has(name);
  }
}

module.exports = {
  // Sorting
  SortContext,
  BubbleSort,
  QuickSort,
  MergeSort,
  // Pricing
  PricingContext,
  RegularPricing,
  PercentageDiscount,
  FixedDiscount,
  BuyOneGetOneFree,
  TieredDiscount,
  // Validation
  ValidationContext,
  StrictValidation,
  LenientValidation,
  // Registry
  StrategyRegistry,
};

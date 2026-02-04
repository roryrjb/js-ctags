// =============================================================================
// JavaScript Test File - Common Patterns
// =============================================================================
// This file contains common JavaScript patterns that developers would expect
// to navigate to using ctags. These are real-world patterns, not based on
// the ctags configuration.

// -----------------------------------------------------------------------------
// Classes
// -----------------------------------------------------------------------------

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }

  fetch() {
    console.log(`${this.name} fetches the ball`);
  }
}

export class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(callback);
    return this;
  }

  off(event, callback) {
    const callbacks = this.#listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
    return this;
  }

  emit(event, ...args) {
    const callbacks = this.#listeners.get(event) || [];
    callbacks.forEach(cb => cb(...args));
    return this;
  }
}

export default class Storage {
  #data = {};

  get(key) {
    return this.#data[key];
  }

  set(key, value) {
    this.#data[key] = value;
    return this;
  }

  has(key) {
    return key in this.#data;
  }

  delete(key) {
    delete this.#data[key];
    return this;
  }

  clear() {
    this.#data = {};
    return this;
  }
}

// -----------------------------------------------------------------------------
// Class with Static Members and Private Fields
// -----------------------------------------------------------------------------

class Counter {
  static #instances = 0;
  static defaultStep = 1;

  #count = 0;
  #step;

  constructor(initialValue = 0, step = Counter.defaultStep) {
    this.#count = initialValue;
    this.#step = step;
    Counter.#instances++;
  }

  increment() {
    this.#count += this.#step;
    return this;
  }

  decrement() {
    this.#count -= this.#step;
    return this;
  }

  get value() {
    return this.#count;
  }

  set value(newValue) {
    this.#count = newValue;
  }

  static getInstanceCount() {
    return Counter.#instances;
  }

  static reset() {
    Counter.#instances = 0;
  }
}

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

function multiply(a, b = 1) {
  return a * b;
}

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export async function retryFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (e) {
      if (i === retries - 1) throw e;
      await delay(1000 * (i + 1));
    }
  }
}

function* range(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

async function* asyncDataStream(urls) {
  for (const url of urls) {
    const data = await fetchData(url);
    yield data;
  }
}

// Immediately invoked (won't be tagged, but the pattern exists)
(function() {
  console.log('IIFE executed');
})();

// -----------------------------------------------------------------------------
// Variables and Constants
// -----------------------------------------------------------------------------

const API_URL = 'https://api.example.com';

const MAX_ITEMS = 100;

const CONFIG = {
  timeout: 5000,
  retries: 3,
  debug: false,
};

let currentPage = 1;

let isLoading = false;

var legacyVariable = 'old style';

export const VERSION = '1.0.0';

export let counter = 0;

// Arrow functions assigned to variables
const double = x => x * 2;

const sum = (a, b) => a + b;

const createUser = (name, email) => ({
  name,
  email,
  createdAt: new Date(),
});

const asyncOperation = async (data) => {
  await delay(100);
  return data;
};

const handleEvent = (event) => {
  console.log('Event:', event.type);
};

// -----------------------------------------------------------------------------
// Object with Methods (common pattern)
// -----------------------------------------------------------------------------

const utils = {
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  lowercase(str) {
    return str.toLowerCase();
  },

  async fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      return response;
    } finally {
      clearTimeout(id);
    }
  },

  *iterate(items) {
    for (const item of items) {
      yield item;
    }
  },
};

const mathHelpers = {
  PI: 3.14159,

  square(x) {
    return x * x;
  },

  cube(x) {
    return x * x * x;
  },

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
};

// -----------------------------------------------------------------------------
// Module Pattern (revealing module)
// -----------------------------------------------------------------------------

const calculator = (function() {
  let result = 0;

  function add(x) {
    result += x;
    return this;
  }

  function subtract(x) {
    result -= x;
    return this;
  }

  function getResult() {
    return result;
  }

  function reset() {
    result = 0;
    return this;
  }

  return {
    add,
    subtract,
    getResult,
    reset,
  };
})();

// -----------------------------------------------------------------------------
// Factory Functions
// -----------------------------------------------------------------------------

function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      return `Hi, I'm ${this.name}`;
    },
    haveBirthday() {
      this.age++;
      return this;
    },
  };
}

function createLogger(prefix) {
  const logs = [];

  return {
    log(message) {
      const entry = `[${prefix}] ${message}`;
      logs.push(entry);
      console.log(entry);
    },

    warn(message) {
      const entry = `[${prefix}] WARN: ${message}`;
      logs.push(entry);
      console.warn(entry);
    },

    error(message) {
      const entry = `[${prefix}] ERROR: ${message}`;
      logs.push(entry);
      console.error(entry);
    },

    getLogs() {
      return [...logs];
    },
  };
}

// -----------------------------------------------------------------------------
// Destructuring in Parameters (common pattern)
// -----------------------------------------------------------------------------

function processUser({ name, email, role = 'user' }) {
  return { name, email, role, processedAt: new Date() };
}

function mergeOptions({ timeout = 5000, retries = 3, ...rest }) {
  return { timeout, retries, ...rest };
}

const handleRequest = async ({ method, url, body = null }) => {
  const options = { method };
  if (body) options.body = JSON.stringify(body);
  return fetch(url, options);
};

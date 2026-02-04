// =============================================================================
// ES Module Test File - Common Patterns
// =============================================================================
// This file contains common ES module patterns that developers would expect
// to navigate to using ctags.

// -----------------------------------------------------------------------------
// Classes
// -----------------------------------------------------------------------------

class HttpClient {
  #baseUrl;
  #headers;

  constructor(baseUrl, defaultHeaders = {}) {
    this.#baseUrl = baseUrl;
    this.#headers = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  async get(path) {
    return this.#request('GET', path);
  }

  async post(path, body) {
    return this.#request('POST', path, body);
  }

  async put(path, body) {
    return this.#request('PUT', path, body);
  }

  async delete(path) {
    return this.#request('DELETE', path);
  }

  async #request(method, path, body = null) {
    const options = {
      method,
      headers: this.#headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.#baseUrl}${path}`, options);
    return response.json();
  }

  setHeader(key, value) {
    this.#headers[key] = value;
  }
}

export class Store {
  #state;
  #listeners = new Set();

  constructor(initialState = {}) {
    this.#state = initialState;
  }

  getState() {
    return { ...this.#state };
  }

  setState(updates) {
    this.#state = { ...this.#state, ...updates };
    this.#notify();
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #notify() {
    this.#listeners.forEach(listener => listener(this.#state));
  }
}

export default class Router {
  #routes = new Map();
  #currentRoute = null;

  constructor() {
    window.addEventListener('popstate', () => this.#handleRoute());
  }

  addRoute(path, handler) {
    this.#routes.set(path, handler);
    return this;
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.#handleRoute();
  }

  #handleRoute() {
    const path = window.location.pathname;
    const handler = this.#routes.get(path);
    if (handler) {
      this.#currentRoute = path;
      handler();
    }
  }

  getCurrentRoute() {
    return this.#currentRoute;
  }
}

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

export function createApp(config) {
  return {
    config,
    plugins: [],
    use(plugin) {
      this.plugins.push(plugin);
      return this;
    },
    mount(selector) {
      const el = document.querySelector(selector);
      this.plugins.forEach(p => p.install(this));
      return this;
    },
  };
}

export function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

export function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

export async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * Math.pow(2, i));
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cloneDeep);
  }
  const cloned = {};
  for (const key in obj) {
    cloned[key] = cloneDeep(obj[key]);
  }
  return cloned;
}

function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

async function parallel(tasks) {
  return Promise.all(tasks.map(task => task()));
}

async function series(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

function* enumerate(iterable) {
  let index = 0;
  for (const item of iterable) {
    yield [index++, item];
  }
}

async function* asyncMap(iterable, fn) {
  for await (const item of iterable) {
    yield fn(item);
  }
}

// -----------------------------------------------------------------------------
// Variables and Constants
// -----------------------------------------------------------------------------

export const VERSION = '2.0.0';

export const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments',
};

export let globalConfig = {
  debug: false,
  logLevel: 'info',
};

const INTERNAL_KEY = Symbol('internal');

const cache = new Map();

const defaultOptions = Object.freeze({
  timeout: 5000,
  retries: 3,
  backoff: 'exponential',
});

let requestCount = 0;

var legacySupport = true;

const identity = x => x;

const noop = () => {};

const isPromise = (value) => {
  return value && typeof value.then === 'function';
};

const isFunction = (value) => {
  return typeof value === 'function';
};

// -----------------------------------------------------------------------------
// Named Exports
// -----------------------------------------------------------------------------

export {
  HttpClient,
  delay,
  cloneDeep,
  debounce,
  parallel,
  series,
  enumerate,
  asyncMap,
  cache,
  defaultOptions,
  identity,
  noop,
  isPromise,
  isFunction,
};

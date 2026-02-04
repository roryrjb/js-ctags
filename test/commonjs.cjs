// =============================================================================
// CommonJS Test File - Common Patterns
// =============================================================================
// This file contains common CommonJS module patterns that developers would
// expect to navigate to using ctags.

// -----------------------------------------------------------------------------
// Classes
// -----------------------------------------------------------------------------

class Database {
  #connection = null;
  #config;

  constructor(config) {
    this.#config = config;
  }

  async connect() {
    this.#connection = await this.#createConnection();
    return this;
  }

  async #createConnection() {
    // Simulate connection
    return { connected: true };
  }

  async query(sql, params = []) {
    if (!this.#connection) {
      throw new Error('Not connected');
    }
    return [];
  }

  async disconnect() {
    this.#connection = null;
  }

  isConnected() {
    return this.#connection !== null;
  }
}

class Logger {
  static levels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  };

  #level;
  #prefix;

  constructor(prefix = '', level = Logger.levels.INFO) {
    this.#prefix = prefix;
    this.#level = level;
  }

  debug(message) {
    this.#log(Logger.levels.DEBUG, message);
  }

  info(message) {
    this.#log(Logger.levels.INFO, message);
  }

  warn(message) {
    this.#log(Logger.levels.WARN, message);
  }

  error(message) {
    this.#log(Logger.levels.ERROR, message);
  }

  #log(level, message) {
    if (level >= this.#level) {
      const prefix = this.#prefix ? `[${this.#prefix}] ` : '';
      console.log(`${prefix}${message}`);
    }
  }

  setLevel(level) {
    this.#level = level;
  }
}

class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }
    this.#events.get(event).push(listener);
    return this;
  }

  off(event, listener) {
    const listeners = this.#events.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  emit(event, ...args) {
    const listeners = this.#events.get(event) || [];
    listeners.forEach(fn => fn(...args));
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.on(event, wrapper);
  }
}

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

function createServer(options) {
  return {
    port: options.port || 3000,
    host: options.host || 'localhost',
    start() {
      console.log(`Server starting on ${this.host}:${this.port}`);
    },
    stop() {
      console.log('Server stopping');
    },
  };
}

function parseConfig(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

async function readFileAsync(path) {
  const fs = require('fs').promises;
  return fs.readFile(path, 'utf-8');
}

async function writeFileAsync(path, content) {
  const fs = require('fs').promises;
  return fs.writeFile(path, content, 'utf-8');
}

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

// -----------------------------------------------------------------------------
// Variables and Constants
// -----------------------------------------------------------------------------

const VERSION = '1.0.0';

const DEFAULT_PORT = 3000;

const CONFIG = {
  database: {
    host: 'localhost',
    port: 5432,
  },
  cache: {
    ttl: 3600,
  },
};

let instanceCount = 0;

var legacyFlag = true;

const formatBytes = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// -----------------------------------------------------------------------------
// Module Exports
// -----------------------------------------------------------------------------

module.exports = {
  Database,
  Logger,
  EventEmitter,
  createServer,
  parseConfig,
  readFileAsync,
  writeFileAsync,
  debounce,
  throttle,
  memoize,
  range,
  VERSION,
  DEFAULT_PORT,
  CONFIG,
  formatBytes,
  sleep,
};

module.exports.default = Database;

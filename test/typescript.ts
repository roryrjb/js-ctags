// =============================================================================
// TypeScript Test File - Common Patterns
// =============================================================================
// This file contains common TypeScript patterns that developers would expect
// to navigate to using ctags. These are real-world patterns, not based on
// the ctags configuration.

// -----------------------------------------------------------------------------
// Classes
// -----------------------------------------------------------------------------

class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }

  speak(): void {
    console.log(`${this.name} barks`);
  }

  fetch(): void {
    console.log(`${this.name} fetches the ball`);
  }
}

export class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    this.logs.push(message);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

export default class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    return response.json();
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `Area: ${this.area()}, Perimeter: ${this.perimeter()}`;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

// -----------------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserWithRole extends User {
  role: 'admin' | 'user' | 'guest';
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface EventHandler {
  (event: Event): void;
}

interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

// -----------------------------------------------------------------------------
// Type Aliases
// -----------------------------------------------------------------------------

type ID = string | number;

type Nullable<T> = T | null;

type UserRole = 'admin' | 'user' | 'guest';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type Callback<T> = (error: Error | null, result: T) => void;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

enum Status {
  Pending,
  Active,
  Completed,
  Cancelled,
}

enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  InternalError = 500,
}

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
  throw new Error('Unreachable');
}

function* range(start: number, end: number): Generator<number> {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

async function* asyncRange(start: number, end: number): AsyncGenerator<number> {
  for (let i = start; i < end; i++) {
    await delay(100);
    yield i;
  }
}

// -----------------------------------------------------------------------------
// Variables and Constants
// -----------------------------------------------------------------------------

const API_BASE_URL = 'https://api.example.com';

const MAX_RETRIES = 3;

let currentUser: User | null = null;

var legacyConfig = { debug: true };

export const DEFAULT_TIMEOUT = 5000;

export let mutableExport = 'can change';

const createLogger = (prefix: string) => {
  return (message: string) => console.log(`[${prefix}] ${message}`);
};

const handleClick = (event: MouseEvent): void => {
  console.log('Clicked at', event.clientX, event.clientY);
};

// -----------------------------------------------------------------------------
// Namespaces and Modules
// -----------------------------------------------------------------------------

namespace Utils {
  export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  export function lowercase(str: string): string {
    return str.toLowerCase();
  }

  export const VERSION = '1.0.0';
}

namespace Http {
  export namespace Errors {
    export class HttpError extends Error {
      constructor(public statusCode: number, message: string) {
        super(message);
      }
    }

    export class NotFoundError extends HttpError {
      constructor(message = 'Not found') {
        super(404, message);
      }
    }
  }
}

export namespace Config {
  export interface Options {
    timeout: number;
    retries: number;
  }

  export const defaults: Options = {
    timeout: 5000,
    retries: 3,
  };
}

// -----------------------------------------------------------------------------
// Class with Various Member Types
// -----------------------------------------------------------------------------

class CompleteExample {
  // Public properties
  name: string;
  readonly id: number;

  // Private properties
  private secret: string;
  private readonly createdAt: Date;

  // Protected properties
  protected internalState: number;

  // Static properties
  static count = 0;
  static readonly TYPE = 'example';
  private static secretKey = 'key';

  // ES2022 private fields
  #privateField: string;
  readonly #immutablePrivate: number;
  static #staticPrivate = 0;

  // Property with initializer
  items: string[] = [];

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
    this.secret = 'hidden';
    this.createdAt = new Date();
    this.internalState = 0;
    this.#privateField = 'private';
    this.#immutablePrivate = 42;
    CompleteExample.count++;
  }

  // Regular methods
  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  // Async method
  async fetchData(): Promise<string> {
    return 'data';
  }

  // Private method
  private validate(): boolean {
    return true;
  }

  // Protected method
  protected reset(): void {
    this.internalState = 0;
  }

  // Static methods
  static create(name: string): CompleteExample {
    return new CompleteExample(name, CompleteExample.count);
  }

  static async createAsync(name: string): Promise<CompleteExample> {
    await delay(100);
    return CompleteExample.create(name);
  }

  private static generateId(): number {
    return Math.random();
  }

  // Getters and setters
  get upperName(): string {
    return this.name.toUpperCase();
  }

  set upperName(value: string) {
    this.name = value.toLowerCase();
  }

  // Generic method
  transform<T>(value: T): T {
    return value;
  }

  // Method with overloads (implementation)
  process(value: string): string;
  process(value: number): number;
  process(value: string | number): string | number {
    return value;
  }
}

// -----------------------------------------------------------------------------
// Decorators (class and method should still be found)
// -----------------------------------------------------------------------------

function logged(target: any) {
  return target;
}

function measure(target: any, key: string, descriptor: PropertyDescriptor) {
  return descriptor;
}

@logged
class DecoratedService {
  @measure
  performAction(): void {
    console.log('Action performed');
  }
}

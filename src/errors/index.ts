export class TushareError extends Error {
  public code: number;
  public msg: string;

  constructor(code: number, msg: string) {
    super(`TuShare API Error [${code}]: ${msg}`);
    this.name = 'TushareError';
    this.code = code;
    this.msg = msg;
  }
}

export class RequestTimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timeout after ${timeout}ms`);
    this.name = 'RequestTimeoutError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(`Validation Error: ${message}`);
    this.name = 'ValidationError';
  }
}
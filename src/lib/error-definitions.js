export class BadRequestException extends Error {
  constructor(message) {
    super(typeof message === 'string' ? message : JSON.stringify(message)); // Convert object to string for Error
    this.name = 'BadRequestException';
    this.status = 400;
    //this.message = message;
  }
}

export class UnauthorizedException extends Error {
  constructor(message) {
    super(message);

    this.name = 'UnauthorizedException';
    this.status = 401;
  }
}

export class NoContentException extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoContentException';
    this.status = 204;
  }
}

export class UnprocessibleEntityException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnprocessibleEntityException';
    this.status = 422;
  }
}

export class ForbiddenException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenException';
    this.status = 403;
  }
}

export class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundException';
    this.status = 404;
  }
}

export class ConflictException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictException';
    this.status = 409;
  }
}

export class TooManyRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = 'TooManyRequestException';
    this.status = 429;
  }
}

export class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.status = 500;
  }
}

export class ServiceUnavailableException extends Error {
  constructor(message) {
    super(message); // <- add this

    this.name = 'ServiceUnavilableException';
    this.status = 503;
  }
}

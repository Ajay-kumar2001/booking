export abstract class AbstractError extends Error {
    abstract statusCode: number;
   abstract status: string;
   abstract error:string;
    constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, AbstractError.prototype);
    }
  
  }
  
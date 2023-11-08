import { AbstractError } from "./AbstractError";

export class CustomError extends AbstractError {
  statusCode: number;
  status: string;
  error: any;
  constructor(
    statusCode: number,
    status: string,
    public message: string,
    error: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = status || "error";
    this.message = message;
    this.error = error || "'";
    console.log(error)
    console.log("from error class", this.message, this.statusCode, this.status);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

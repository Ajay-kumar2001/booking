import { AbstractError } from './AbstractError';

export class CustomError extends AbstractError {
  statusCode: number;
  status: any;
  error: any;
  constructor(public message: string, statusCode: number, status: any,error:any) {
    super(message);
    this.statusCode = statusCode;
    this.status = status || 'error' ;
    this.message=message
    this.error=error||"'";
    console.log("from error class",this.message,this.statusCode,this.status)
    Object.setPrototypeOf(this, CustomError.prototype);
  }

 
  
}

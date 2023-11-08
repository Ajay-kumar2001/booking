import { rateLimit } from 'express-rate-limit'
import { NextFunction ,Request,Response} from 'express';
import { CustomError } from '../utils/CustomError';
import { CustomRequest } from '../utils/request-model';

export const rateLimiter = rateLimit({
	// 2 minutes
	windowMs: 2 * 60 * 1000, 
	 // Limit  IP to 3 requests per `window` (here, per 1 minutes)
	max: 3,
	// draft-6: RateLimit-* headers; draft-7: combined RateLimit header
	standardHeaders: 'draft-7', 
	// X-RateLimit-* headers
	legacyHeaders: true, 
	handler: (req:CustomRequest, res:Response, next:NextFunction) =>
		// response.status(options.statusCode).send(options.message),
		next(new CustomError(429,"limit exided","try again later",""))
		
	})

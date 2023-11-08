const jwt = require("jsonwebtoken");
import multer, { FileFilterCallback } from "multer";
import { CustomRequest } from "../utils/request-model";
/**
 * Middleware for verifying the expiration time of a JWT token.
 *
 * @param {CustomRequest} req - The custom request object.
 * @param {Response} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
export const tokenVerification = async (
  req: CustomRequest,
  res: any,
  next: any
) => {
  try {
    const token:string|undefined  = req.header("authorization");
  //  const array= token?.replace("Bearer","") 
  //  console.log(array)
  //  if (array.length===1){
  //     decodedToken=array[0] as string
  //     console.log("from frontend",decodedToken)
  //  }else{
  //   decodedToken=array[1] as string
  //   console.log("from swagger",decodedToken)

  //  }
    // Verifying the token for token expiration
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (error: any, decoded: any) => {
        if (error) {
          return res.status(401).json({
            code: res.statusCode,
            status: "failed",
            message: " invalid Token ",
          });
        } else {
          req.email = decoded._doc.email;
          req.id=decoded._doc._id
          next()
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "unSuccessful",
      code: res.statusCode,
      message: "internal server error",
    });
  }
};

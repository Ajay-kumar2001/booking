import joi,{ObjectSchema, object} from "joi"
import { OTP } from "../utils/reqOtp-interface"
export const otpValidation:ObjectSchema<OTP>=joi.object({
    OTP :  joi.number().required(),
})
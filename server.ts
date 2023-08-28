import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./config.env") });
import app from "./app";

const DB =
  process.env.DATABASE?.replace(
    "<password>",
    String(process.env.DATABASE_PASSWORD)
  ) || "";

const port: any = process.env.PORT || 3000;
const ipAddress: string = process.env.IP_ADDRESS || "";
const db_url: string = process.env.DATABASE || "";
mongoose.connect(db_url).then(() => console.log("DB connected"));

app.listen(port, ipAddress, () => {
  console.log(`app is running on  http//:${ipAddress}:${port}`);
});

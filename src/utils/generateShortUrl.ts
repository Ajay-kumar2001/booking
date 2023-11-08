import crypto from "crypto";
export const generateShortUrl = (data: string): string => {
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  const shortHash = hash.substr(0, 8); // You can adjust the length of the short hash

  return `http://192.168.0.226:3000/${shortHash}`;
};

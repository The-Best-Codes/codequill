// pages/api/meta/getDeviceIp.ts

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const networkInterfaces = os.networkInterfaces();
  let lanIp: string | undefined;

  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const networkInterface = networkInterfaces[interfaceName];
    if (!networkInterface) return;
    networkInterface.forEach((info) => {
      if (
        info.family === "IPv4" &&
        !info.internal &&
        info.address !== "127.0.0.1"
      ) {
        lanIp = info.address;
      }
    });
  });

  res.status(200).json({ address: lanIp || "127.0.0.1" });
}

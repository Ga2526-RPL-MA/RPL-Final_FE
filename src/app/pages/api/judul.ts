import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization;

    const response = await fetch("https://final-api.up.railway.app/api/judul", {
      headers: {
        Authorization: token || "",
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}

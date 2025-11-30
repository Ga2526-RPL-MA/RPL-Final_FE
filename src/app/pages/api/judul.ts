import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`/api/judul`, {
    headers: {
      Authorization: "Bearer YOUR_TOKEN_HERE", 
    },
  });

  const data = await response.json();

  res.status(200).json(data);
}

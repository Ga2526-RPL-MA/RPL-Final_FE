import type { NextApiRequest, NextApiResponse } from "next";

const backendBase = process.env.BACKEND_API_BASE || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const targetUrl = `${backendBase}/api/judul`
  try {
    const token = req.headers.authorization || ""
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: token,
      },
    })
    const data = await response.json()
    return res.status(response.status).json(data)
  } catch {
    return res.status(500).json({ message: "Server error" })
  }
}

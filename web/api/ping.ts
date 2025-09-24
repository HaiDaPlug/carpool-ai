// Force Node 20 for this function (works without vercel.json)
export const config = { runtime: "nodejs20.x" };

export default function handler(req: any, res: any) {
  res.status(200).json({ message: "pong", time: new Date().toISOString() });
}

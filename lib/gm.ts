import { createClient } from "@vercel/kv";
import { config } from "dotenv";

config();

export async function gm(fid: number) {
  const redis = createClient({
    url:"https://intense-worm-35509.upstash.io",
    token: 'AYq1ASQgNjNmYTIyYWItYjQ5Zi00OWEyLWIzZDQtM2U3YzUxZGI0NDIwYWYzYjRiZGZmMTk5NDAwZmIwMjEwNjA0YWIyNGM3OGU=',
  });
  const id = fid.toString();
  await redis.zincrby("gm", 1, id);
}

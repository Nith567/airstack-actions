import {
  Frog,
  getFarcasterUserDetails,
  validateFramesMessage,
} from "@airstack/frog";
import { devtools } from "@airstack/frog/dev";
import { serveStatic } from "@airstack/frog/serve-static";
import { neynar } from 'frog/hubs'
import { handle } from "@airstack/frog/vercel";
import { config } from "dotenv";

config();
const ADD_URL =
  "https://warpcast.com/~/add-cast-action?actionType=post&name=GM&icon=sun&postUrl=https%3A%2F%2Fairstack-actions.vercel.app%2Fapi%2Fgm"

export const app = new Frog({
  apiKey: '18e5882bb4bf142b680a7f532e2fdd1db',
  basePath: "/api",
  // browserLocation: ADD_URL,
  // hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string}),
});

// Cast action handler
app.hono.post("/gm", async (c) => {
  console.log(c);
  const body = await c.req.json();

  const { isValid, message } = await validateFramesMessage(body);
  const interactorFid = message?.data?.fid;
  const castFid = message?.data.frameActionBody.castId?.fid as number;
  const castHash = message?.data.frameActionBody.castId?.hash;
  if (isValid) {
    if (interactorFid === castFid) {
      return c.json({ message: "Nice try." }, 400);
    }
    const { data, error } = await getFarcasterUserDetails({
      fid: castFid,
    });
    if (error) {
      return c.json({ message: "Error. Try Again." }, 500);
    }

    let message = `GM ${castHash} !`;
    if (message.length > 30) {
      message = "GM!";
    }
    return c.json({ message });
  } else {
    return c.json({ message: "Unauthorized" }, 401);
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

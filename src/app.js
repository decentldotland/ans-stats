import express from "express";
import base64url from "base64url";
import cors from "cors";
import { polling, getAnsState, getStats } from "./utils/cache.js";

const app = express();

const port = process.env.PORT || 2023;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/users", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const encodedState = await getAnsState();
  const jsonRes = JSON.parse(base64url.decode(encodedState));
  res.send(jsonRes);
});

app.get("/stats", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const encodedStats = await getStats();
  const jsonRes = JSON.parse(base64url.decode(encodedStats));

  res.send(jsonRes);
});

app.listen(port, async () => {
  await polling();
  console.log(`listening at PORT: ${port}`);
});

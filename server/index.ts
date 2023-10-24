import express from "express";
import cors from "cors";
const app = express();
const port = 5174;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/api", (_req, res) => {
  res.send({
    l: Math.round(Math.random() * 100),
    r: Math.round(Math.random() * 100),
    c: Math.round(Math.random() * 100),
    ls: Math.round(Math.random() * 100),
    rs: Math.round(Math.random() * 100),
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

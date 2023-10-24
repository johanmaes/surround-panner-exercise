import express from "express";
import cors from "cors";
const app = express();
const port = 5174;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

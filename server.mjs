// server.mjs
import express from "express";
const { default: jsonServer } = await import("json-server"); // dynamic ESM import

const server = express();
const router = jsonServer.router("data/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  res.locals.originalQuery = { ...req.query };
  next();
});

server.use(router);

router.render = (req, res) => {
  let data = res.locals.data;
  if (Array.isArray(data)) {
    const q = res.locals.originalQuery || {};
    for (const [key, val] of Object.entries(q)) {
      if (key.endsWith("_like")) {
        const field = key.slice(0, -5);
        const re = new RegExp(String(val), "i");
        data = data.filter(item => re.test(String(item?.[field] ?? "")));
      }
    }
  }
  res.jsonp(data);
};

server.listen(8000, () => {
  console.log("JSON Server is running on http://localhost:8000");
});

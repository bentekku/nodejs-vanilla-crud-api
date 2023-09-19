const http = require("http");
require("dotenv").configDotenv();

const PORT = process.env.PORT || 5001;

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "GET":
      getReq(res, req);
      break;
    case "POST":
      postRes(res, req);
      break;
    case "PUT":
      putRes(res, req);
      break;
    case "DELETE":
      deleteRes(res, req);
      break;
    default:
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write(
        JSON.stringify({ title: "Not Found", message: "Route not found" })
      );
      res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

const requestBodyparser = require("../util/body-parse");
const writeToFile = require("../util/write-to-file");

module.exports = async (req, res) => {
  let baseURL = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  console.log(`baseURL: ${baseURL}`);
  let id = req.url.split("/")[3];
  console.log(`id: ${id}`);
  const regexV4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );
  if (!regexV4.test(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "UUID is not valid",
      })
    );
  } else if (baseURL === "/api/memes/" && regexV4.test(id)) {
    try {
      let body = await requestBodyparser(req);
      const index = req.memes.findIndex((meme) => {
        return meme.id === id;
      });
      if (index === -1) {
        res.statusCode = 404;
        res.write(
          JSON.stringify({ title: "Not Found", message: "Meme not found" })
        );
        res.end();
      } else {
        req.memes[index] = { id, ...body };
        writeToFile(req.memes);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(req.memes[index]));
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.write(
        JSON.stringify({ title: "Not Found", message: "Route not found" })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
  }
};

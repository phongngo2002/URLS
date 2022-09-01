import request from "request";
var rp = require("request-promise");
var cheerio = require("cheerio");

// const $ = cheerio.load(html);
// $(".list-occs").each((index, el) => {
//   const show = $(el).find(".occs a").text();
// });
export default function handler(req, res) {
  // for (const child_url of req.body) {
  request(req.body, function (error, response, html) {
    if (!response) {
      res.status(404).json({ error: "ERROR!" });
    } else {
      const $ = cheerio.load(html);
      // console.log($("*").text());
      res.status(200).json({ data: $("*").text() });
    }
  });
}

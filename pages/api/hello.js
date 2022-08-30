import request from "request";
var rp = require("request-promise");
var cheerio = require("cheerio");

// const $ = cheerio.load(html);
// $(".list-occs").each((index, el) => {
//   const show = $(el).find(".occs a").text();
// });
export default async function handler(req, res) {
  let a = null;
  for (const child_url of req.body) {
    request(child_url, function (error, response, html) {
      if (!response) {
        res.status(404).json({ error: "ERROR!" });
      } else {
        const $ = cheerio.load(html);
        a += $("*").text();
        return a;
      }
    });
  }

  res.status(200).json({ a });
}

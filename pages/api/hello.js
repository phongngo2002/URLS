import request from "request";
import News from "../../models/NewsModel";
import connectMongo from "../../utils/connectMongo";
import { base64_encode, normalizeText } from "../../utils/function";
var rp = require("request-promise");
var cheerio = require("cheerio");
require('dotenv').config();
const cloudinary = require('cloudinary').v2

export default function handler(req, res) {
  request(req.body, function (error, response, html) {

    if (!response) {
      res.status(404).json({ error: "ERROR!" });
    } else {
      const $ = cheerio.load(html);
      const posts = $("*").find('div.listview > ul > li.listitem.clearfix');
      async function connect() {
        await connectMongo();
        return 1;
      }
      connect().then(
        data => {
          let ids = [];
          posts.each(async function (i, e) {
            try {
              const { url } = await cloudinary.uploader.upload($(this).find('a.thumb').find('img').attr('data-src'), {
                folder: 'news',
                resource_type: "image"
              });
              var news = await new News({
                title: normalizeText($(this).find('a.title').text()),
                slug: $(this).find('a.title').attr('href'),
                desc: $(this).find('div.desc').text(),
                img: url,
                content: '',
                cate_id: '456465'
              }).save();
              ids.push({ id: news._id, slug: news.slug });

            } catch (error) {
              console.log(error);
              res.status(404).json({ name: 'John Doe' })
            }
          });
          setTimeout(function () {
            res.status(200).json({ data: ids });
          }, 7000);
        }
      )
    }
  });
}


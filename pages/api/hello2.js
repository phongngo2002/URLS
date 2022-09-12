import request from "request";
import Category from "../../models/CategoryModel";
import News from "../../models/NewsModel";
import { ade, abc, normalizeText } from "../../utils/function";
var cheerio = require("cheerio");
require('dotenv').config();
const cloudinary = require('cloudinary').v2
export default function handler(req, res) {
  const { id, link } = req.body;
  request(link, function (error, response, html) {
    if (error) {
      res.status(404).json({ errors: error });
    } else {
      let cateArr = [];
      const $ = cheerio.load(html);
      let content = $("*").find('.content-detail');
      const cate = $("*").find('div.breadcrumbs').find('span.breadcrumb');
      cate.each(function (i, e) {
        cateArr.push({
          text: $(this).find('a').text(),
          slug: $(this).find('a').attr('href')
        });
      })
      // content.find('script').each(function (i, e) {
      //   $(this).replaceWith('');
      // });
      content.find('ul').each(function (i, e) {
        $(this).replaceWith('');
      });
      content.find('a').each(function (i, e) {
        $(this).attr('href', '#');
      });
      content.find('img').each(async function (i, e) {
        const old_src = $(this).attr('data-src');
        const url = await abc(old_src);
        $(this).attr('src', url);
        $(this).attr('data-src', url);
      });
      async function kkkkk(id, html) {
        const cate = await Category.findOne({ title: cateArr[cateArr.length - 1].text });
        if (cate) {
          const result = await News.findOneAndUpdate({ _id: id }, { content: html, cate_id: cate._id });
        } else {
          const cate = await new Category({
            title: cateArr[cateArr.length - 1].text,
            slug: cateArr[cateArr.length - 1].slug
          });
          cate.save();
          const result = await News.findOneAndUpdate({ _id: id }, { content: html, cate_id: cate._id });
          return 1;
        }
      };

      setTimeout(() => {
        kkkkk(id, content.html());
        res.status(200).json({ status: 'success' });
      }, 2500)
        ;
    }
  });
}


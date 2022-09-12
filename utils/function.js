import Category from '../models/CategoryModel';
import connectMongo from './connectMongo';
const express = require('express');
const fs = require('fs');
const app = express();
export const normalizeText = (text) => {
  return text.replace(/\\n/g, '').trim();
};
export function base64_encode(file) {
  return "data:image/gif;base64," + fs.readFileSync(file, 'base64');
}
require('dotenv').config();
const cloudinary = require('cloudinary').v2
export async function abc(link) {
  const { url } = await cloudinary.uploader.upload(link, {
    folder: 'news',
    resource_type: "image"
  });

  return url;
};

export async function ade(data, i, parent) {
  connectMongo();
  const cate1 = await Category.findOne({ title: data[i].text }).exec();
  if (cate1 && cate1.title) {
    i++;
    if (i < data.length) {
      console.log(cate1._id);
      ade(data, i, cate1._id)
    }
  } else {
    if (data[i].text != '🏠') {
      const news = await new Category({
        title: data[i].text,
        parent_id: parent,
        slug: data[i].href
      }).save(function (error, cate) {
        i++;
        if (i < data.length) {
          console.log(cate._id);
          ade(data, i, cate._id)
        }
      });
    }
  }
}
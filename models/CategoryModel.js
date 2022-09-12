import { Schema, model, models } from 'mongoose';

const newSchema = new Schema({
  title: String,
  slug: String,
});

const Category = models.categories || model('categories', newSchema);

export default Category;
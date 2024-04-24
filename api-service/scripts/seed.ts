import sequelize from '../src/services/sequelize';
import { Product, Review } from '../src/models';
import * as fs from 'fs';
import * as path from 'path';
import { ProductType } from 'ct-common-lib/lib/models/Product';
import { ReviewType } from 'ct-common-lib/lib/models/Review';

async function readJsonFile<T>(filePath: string): Promise<T> {
  const absolutePath = path.join(__dirname, filePath);
  const data = await fs.promises.readFile(absolutePath, 'utf8');
  return JSON.parse(data) as T;
}

async function seedDatabase() {
  try {
    console.log("Checking and syncing database tables...");
    await sequelize.sync({ force: true });
    console.log("Database tables are ready.");

    console.log("Seeding products...");
    const productsData = await readJsonFile<ProductType[]>('mockProducts.json');
    await Product.bulkCreate(productsData);
    console.log("Products seeded!");

    console.log("Seeding reviews...");
    const reviewsData = await readJsonFile<ReviewType[]>('mockReviews.json');
    await Review.bulkCreate(reviewsData);
    console.log("Reviews added!");
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
}

seedDatabase();

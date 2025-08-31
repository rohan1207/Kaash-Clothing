import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import cloudinary from '../utils/cloudinary.js';

dotenv.config();

const UPLOAD_BASE_URL = process.env.UPLOAD_BASE_URL || 'https://kaash-clothing-q4td.onrender.com';

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connected');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      let updated = false;

      // Helper to migrate one asset
      const migrateAsset = async (asset) => {
        if (!asset?.url || !asset.url.startsWith('/uploads/')) return asset;
        const remoteUrl = `${UPLOAD_BASE_URL}${asset.url}`;
        try {
          const res = await cloudinary.uploader.upload(remoteUrl, {
            folder: 'products',
            resource_type: asset.type === 'video' ? 'video' : 'image',
          });
          updated = true;
          return {
            url: res.secure_url,
            public_id: res.public_id,
            type: asset.type || (res.resource_type === 'video' ? 'video' : 'image'),
          };
        } catch (err) {
          console.error(`Failed to migrate ${remoteUrl}:`, err.message);
          return asset; // keep original
        }
      };

      // mainImage
      if (product.mainImage) {
        product.mainImage = await migrateAsset(product.mainImage);
      }

      // additionalMedia
      if (product.additionalMedia && product.additionalMedia.length) {
        const migrated = [];
        for (const media of product.additionalMedia) {
          migrated.push(await migrateAsset(media));
        }
        product.additionalMedia = migrated;
      }

      if (updated) {
        await Product.updateOne({ _id: product._id }, {
          mainImage: product.mainImage,
          additionalMedia: product.additionalMedia
        });
        console.log(`Updated product ${product._id}`);
      }
    }

    console.log('Migration finished');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();

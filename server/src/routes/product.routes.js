import express from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  getCategoriesMeta,
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories/meta', getCategoriesMeta);
router.get('/:idOrSlug', getProductByIdOrSlug);

export default router;

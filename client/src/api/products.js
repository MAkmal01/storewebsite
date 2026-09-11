import api from './client.js';

export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductBySlug = async (idOrSlug) => {
  const { data } = await api.get(`/products/${idOrSlug}`);
  return data;
};

export const getCategoriesMeta = async () => {
  const { data } = await api.get('/products/categories/meta');
  return data;
};

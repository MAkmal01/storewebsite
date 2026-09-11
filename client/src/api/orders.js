import api from './client.js';

export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const trackOrder = async (query) => {
  const { data } = await api.get('/orders/track', { params: { query } });
  return data;
};

export const getProductReviews = async (productId) => {
  const { data } = await api.get(`/reviews/${productId}`);
  return data;
};

export const createReview = async (reviewData) => {
  const { data } = await api.post('/reviews', reviewData);
  return data;
};

export const subscribeNewsletter = async (email) => {
  const { data } = await api.post('/newsletter', { email });
  return data;
};

/**
 * Browser axios client for Express API (mutations + client reads).
 * Safe for Client Components. Do not use in Server Components — use api-server.js.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || '';
      if (
        errorMessage.includes('Invalid token') ||
        errorMessage.includes('Token expired') ||
        errorMessage.includes('jwt expired') ||
        errorMessage.includes('malformed jwt')
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const themeApi = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return { success: true };
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Products
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sort_by || params.sortBy) {
      queryParams.append('sort_by', params.sort_by || params.sortBy);
    }
    if (params.min_price || params.minPrice) {
      queryParams.append('min_price', params.min_price || params.minPrice);
    }
    if (params.max_price || params.maxPrice) {
      queryParams.append('max_price', params.max_price || params.maxPrice);
    }
    if (params.search) queryParams.append('search', params.search);

    const qs = queryParams.toString();
    const response = await api.get(
      `/products/category/${category}${qs ? `?${qs}` : ''}`
    );
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.get('/products/search', { params: { q: query } });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  createSingleSizeProduct: async (productData) => {
    const response = await api.post('/products/single-size', productData);
    return response.data;
  },

  createAllSizeProduct: async (productData) => {
    const response = await api.post('/products/all-sizes', productData);
    return response.data;
  },

  getNextSKU: async () => {
    const response = await api.get('/products/next-sku');
    return response.data;
  },

  // Reviews
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  getAllReviews: async (params = {}) => {
    const response = await api.get('/reviews/admin/all', { params });
    return response.data;
  },

  updateReviewStatus: async (id, status) => {
    const response = await api.put(`/reviews/admin/${id}/status`, { status });
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/admin/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getHierarchicalCategories: async () => {
    const response = await api.get('/categories/hierarchical');
    return response.data;
  },

  getCategoriesByLevel: async (level, parentId = null) => {
    const params = parentId ? { parent_id: parentId } : {};
    const response = await api.get(`/categories/level/${level}`, { params });
    return response.data;
  },

  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Sizes
  getSizes: async () => {
    const response = await api.get('/sizes');
    return response.data;
  },

  createSize: async (sizeData) => {
    const response = await api.post('/sizes', sizeData);
    return response.data;
  },

  updateSize: async (id, sizeData) => {
    const response = await api.put(`/sizes/${id}`, sizeData);
    return response.data;
  },

  deleteSize: async (id) => {
    const response = await api.delete(`/sizes/${id}`);
    return response.data;
  },

  // Orders
  createOrder: async (orderData) => {
    const response = await api.post('/orders/guest', orderData);
    return response.data;
  },

  getOrders: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // Upload
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // User profile (auth routes on Express)
  getUserProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Wishlist (may not exist on backend yet — kept for parity)
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post('/wishlist', { productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },
};

/** Soft-fail website settings for LogoContext (browser) */
export const websiteSettingsApi = {
  getWebsiteSettings: async () => {
    try {
      const response = await api.get('/website-settings', {
        signal: AbortSignal.timeout(5000),
      });
      return response.data;
    } catch {
      return { success: false, data: null, error: 'API_UNAVAILABLE' };
    }
  },

  getSettingByKey: async (key) => {
    try {
      const response = await api.get(`/website-settings/${key}`, {
        signal: AbortSignal.timeout(5000),
      });
      return response.data;
    } catch {
      return { success: false, data: null, error: 'API_UNAVAILABLE' };
    }
  },

  updateWebsiteSetting: async (id, value, imageFile = null) => {
    const formData = new FormData();
    formData.append('value', value);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await api.put(`/website-settings/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  initializeSettings: async () => {
    const response = await api.post('/website-settings/initialize');
    return response.data;
  },
};

export default api;

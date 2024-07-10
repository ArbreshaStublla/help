import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('API Request Error:', error);
    throw error; 
  }
);

export default {
  async getArticles() {
    try {
      const response = await apiClient.get('/article');
      return response;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  async getArticleById(id) {
    try {
      const response = await apiClient.get(`/article/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching article with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteArticle(id) {
    try {
      const response = await apiClient.delete(`/article/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting article with ID ${id}:`, error);
      throw error;
    }
  },

  async addArticle(formData) {
    try {
      const response = await apiClient.post('/article', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error adding article:', error);
      throw error;
    }
  },
};

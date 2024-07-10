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
};

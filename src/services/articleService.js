// src/services/articleService.js

import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

const articleService = {
  async getAllArticles() {
    const response = await axios.get(`${API_URL}/article`);
    return response.data;
  },
  async createArticle(articleData) {
    const formData = new FormData();
    formData.append('title', articleData.title);
    formData.append('category', articleData.category);
    formData.append('contents', JSON.stringify(articleData.contents));
    articleData.photos.forEach(photo => {
      formData.append('photos', photo);
    });
    const response = await axios.post(`${API_URL}/article`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  async updateArticle(articleId, articleData) {
    const formData = new FormData();
    formData.append('title', articleData.title);
    formData.append('category', articleData.category);
    formData.append('contents', JSON.stringify(articleData.contents));
    articleData.photos.forEach(photo => {
      formData.append('photos', photo);
    });
    const response = await axios.put(`${API_URL}/article/${articleId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  async deleteArticle(articleId) {
    await axios.delete(`${API_URL}/article/${articleId}`);
  }
};

export default articleService;

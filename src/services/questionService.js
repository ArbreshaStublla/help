
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

class QuestionService {
  async fetchQuestions() {
    try {
      const response = await axios.get(`${API_URL}questions/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error.message);
      console.error('Full error details:', error);
      throw error;
    }
  }

  async addQuestion(newQuestion) {
    try {
      const response = await axios.post(`${API_URL}questions/add`, newQuestion);
      return response.data;
    } catch (error) {
      console.error('Error adding question:', error.message);
      console.error('Full error details:', error);
      throw error;
    }
  }

  async answerQuestion(questionId, answerData) {
    try {
      const response = await axios.post(`${API_URL}questions/${questionId}/answer`, answerData);
      return response.data;
    } catch (error) {
      console.error('Error answering question:', error.message);
      console.error('Full error details:', error);
      throw error;
    }
  }

  async deleteQuestion(questionId) {
    try {
      await axios.delete(`${API_URL}questions/${questionId}`);
    } catch (error) {
      console.error('Error deleting question:', error.message);
      console.error('Full error details:', error);
      throw error;
    }
  }
}

export default new QuestionService();

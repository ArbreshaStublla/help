// videoService.js
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

class VideoService {
  async fetchVideos() {
    try {
      const response = await axios.get(`${API_URL}videos/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error.message);
      console.error('Full error details:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  }
}

export default new VideoService();

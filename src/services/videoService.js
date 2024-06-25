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

  async addVideo(newVideo) {
    try {
      const response = await axios.post(`${API_URL}videos/add`, newVideo);
      return response.data;
    } catch (error) {
      console.error('Error adding video:', error.message);
      console.error('Full error details:', error);
      throw error;
    }
  }

  async deleteVideo(videoId) {
    try {
      await axios.delete(`${API_URL}videos/${videoId}`);
    } catch (error) {
      console.error('Error deleting video:', error.message);
      console.error('Full error details:', error);
      throw error;
    }
  }
}

export default new VideoService();

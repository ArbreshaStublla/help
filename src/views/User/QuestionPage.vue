<template>
    <div class="question-answer">
      <!-- Display questions -->
      <div v-if="questions.length === 0" class="no-questions">No questions available.</div>
      <div v-else>
        <div v-for="question in questions" :key="question.questionId" class="question">
          <h2 class="question-text">{{ question.questionText }}</h2>
          
          <!-- Display existing answer if available -->
          <div v-if="question.answerText" class="answers">
            <h3 class="answer-title">Answer:</h3>
            <p class="answer">{{ question.answerText }}</p>
          </div>
          
          <!-- Display message if no answer is available -->
          <div v-else class="no-answers">
            <p>No answer yet.</p>
          </div>
        </div>
      </div>
  
      <!-- Form to submit a new question -->
      <div class="add-question">
        <h3 class="answer-title">Add Question:</h3>
        <form @submit.prevent="submitQuestion">
          <div class="form-group">
            <label for="questionText" class="label">Your Question:</label>
            <textarea v-model="questionText" required rows="3" class="input"></textarea>
          </div>
          <div class="form-group">
            <label for="userEmail" class="label">Your Email:</label>
            <input v-model="userEmail" type="email" required class="input" placeholder="example@example.com">
          </div>
          <button type="submit" class="button">Submit Question</button>
        </form>
      </div>
  
      <!-- Error and success messages -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        questions: [],
        questionText: '',
        userEmail: '',
        errorMessage: '',
        successMessage: ''
      };
    },
    created() {
      this.fetchQuestions();
    },
    methods: {
      async fetchQuestions() {
        try {
          const response = await axios.get('http://192.168.33.15:3000/questions/');
          this.questions = response.data;
        } catch (error) {
          console.error('Error fetching questions:', error);
          this.errorMessage = 'Error fetching questions';
        }
      },
      async submitQuestion() {
        this.errorMessage = '';
        this.successMessage = '';
  
        try {
          const response = await axios.post('http://192.168.33.15:3000/questions/add', {
            questionText: this.questionText,
            userId: 1, // Replace with actual userId if applicable
            userEmail: this.userEmail // Include userEmail in the request body
          });
          this.successMessage = 'Question added successfully!';
          this.questionText = '';
          this.userEmail = ''; // Clear userEmail after submission
  
          this.fetchQuestions();
        } catch (error) {
          console.error('Error adding question:', error);
          this.errorMessage = 'Error adding question';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .question-answer {
    margin-bottom: 20px;
  }
  .question {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  .question-text {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .answers {
    margin-top: 10px;
  }
  .answer-title {
    font-size: 16px;
    margin-bottom: 5px;
    color: #666;
  }
  .answer {
    margin-bottom: 5px;
    color: #444;
  }
  .no-answers,
  .no-questions {
    color: #888;
  }
  .add-question {
    background-color: #f9f9f9;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .label {
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
    color: #333;
  }
  .input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .button:hover {
    background-color: #45a049;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  .success {
    color: green;
    margin-top: 10px;
  }
  </style>
  
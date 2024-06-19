<template>
  <div class="question-answer">
 
    <div v-if="questions.length === 0" class="no-questions">No questions available.</div>
    <div v-else>
      <div v-for="question in questions" :key="question.questionId" class="question">
        <h2 class="question-text">{{ question.questionText }}</h2>
        
      
        <div v-if="question.answerText" class="answers">
          <div class="question-header">
            <div class="toggle-text" @click="toggleAnswer(question)">
              <!-- Remove the text "Show Answer" and "Hide Answer" -->
            </div>
            <span class="toggle-icon" @click="toggleAnswer(question)">
              {{ question.showAnswer ? '-' : '+' }}
            </span>
          </div>
          <p v-if="question.showAnswer" class="answer">{{ question.answerText }}</p>
        </div>
        
        <!-- Form to submit an answer (only visible if there's no existing answer) -->
        <div v-else>
          <form @submit.prevent="submitAnswer(question)">
            <div class="form-group">
              <label for="answerText" class="label">Your Answer:</label>
              <textarea v-model="question.newAnswerText" required rows="3" class="input"></textarea>
            </div>
            <div class="form-group">
              <label for="userId" class="label">Your User ID:</label>
              <input type="text" v-model="question.userId" required class="input" />
            </div>
            <button type="submit" class="button">Submit Answer</button>
          </form>
        </div>
        
        <!-- Error and success messages for each question -->
        <p v-if="question.errorMessage" class="error">{{ question.errorMessage }}</p>
        <p v-if="question.successMessage" class="success">{{ question.successMessage }}</p>
        
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questions: []
    };
  },
  created() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const data = await axios.get('http://192.168.33.15:3000/questions/');
        this.questions = data.data.map(question => ({
          ...question,
          newAnswerText: '',
          userId: '',
          errorMessage: '',
          successMessage: '',
          showAnswer: false // Initially hide the answer
        }));
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async submitAnswer(question) {
      question.errorMessage = '';
      question.successMessage = '';

      try {
        await axios.post(`http://192.168.33.15:3000/questions/${question.questionId}/answers`, {
          answerText: question.newAnswerText,
          userId: parseInt(question.userId)
        });
        question.successMessage = 'Answer added successfully!';
        question.newAnswerText = '';
        question.userId = '';

        // Refresh questions after successful submission
        this.fetchQuestions();
      } catch (error) {
        console.error('Error adding answer:', error);
        question.errorMessage = 'Error adding answer';
      }
    },
    toggleAnswer(question) {
      question.showAnswer = !question.showAnswer;
    }
  }
};
</script>

<style scoped>
.question-answer {
  margin-top: 20px;
}

.question {
 
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.question-text {
  font-size: 18px;
  margin-bottom: 10px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.toggle-icon {
  font-size: 24px;
  color: #666;
}

.toggle-text {
  font-size: 16px;
  color: #333;
  cursor: pointer;
  /* Ensure no text content takes up space */
  width: 0;
  overflow: hidden;
}

.answers {
  margin-top: 10px;
}

.answer {
  margin-bottom: 5px;
  color: #444;
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

.no-questions {
  color: #888;
  margin-top: 20px;
  font-size: 18px;
}

</style>

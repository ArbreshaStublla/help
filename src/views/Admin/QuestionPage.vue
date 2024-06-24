<template>
  <v-container>
    <div class="kthehu">
      <ButtonComponent :buttonText="showUnanswered ? 'Kthehu' : 'Përgjigju pyetjeve'" @click="toggleUnansweredQuestions" />
    </div>
    <div class="question-answer">
      <!-- Display questions -->
      <div v-if="filteredQuestions.length === 0" class="no-questions">No questions available.</div>
      <div v-else>
        <!-- Button to show unanswered questions -->
        
        <!-- Display filtered questions -->
        <div v-if="showUnanswered">
          <div v-for="question in paginatedUnansweredQuestions" :key="question.questionId" class="question">
            <h2 class="question-text">{{ question.questionText }}</h2>
            <!-- Form to submit an answer -->
            <form>
              <div class="form-group">
                <label for="answerText" class="label">Përgjigja juaj:</label>
                <textarea v-model="question.newAnswerText" required rows="3" class="input"></textarea>
              </div>
              <div class="form-group">
                <label for="userId" class="label">ID-ja juaj:</label>
                <input type="text" v-model="question.userId" required class="input" />
              </div>
              <!-- Move the Submit Answer button under the input fields -->
              <div class="form-group">
                <ButtonComponent buttonText="Dorëzo Përgjigjen" @click="submitAnswer(question)" />
              </div>
            </form>
            <!-- Error and success messages for each question -->
            <p v-if="question.errorMessage" class="error">{{ question.errorMessage }}</p>
            <p v-if="question.successMessage" class="success">{{ question.successMessage }}</p>
          </div>
          <!-- Pagination Component for Unanswered Questions -->
          <PaginationComponent
            :items="unansweredQuestions"
            :pageSize="pageSize"
            @pageChanged="handleUnansweredPageChange"
          />
        </div>
        
        <!-- Display existing answers -->
        <div v-else>
          <div v-for="question in paginatedAnsweredQuestions" :key="question.questionId" class="question">
            <h2 class="question-text">{{ question.questionText }}</h2>
            <div class="answers">
              <div class="question-header">
                <div class="toggle-text" @click="toggleAnswer(question)"></div>
                <span class="toggle-icon" @click="toggleAnswer(question)">
                  {{ question.showAnswer ? '-' : '+' }}
                </span>
              </div>
              <p v-if="question.showAnswer" class="answer">{{ question.answerText }}</p>
            </div>
          </div>
          <!-- Pagination Component for Answered Questions -->
          <PaginationComponent
            :items="answeredQuestions"
            :pageSize="pageSize"
            @pageChanged="handleAnsweredPageChange"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';
import ButtonComponent from '../../components/ButtonComponent.vue';
import PaginationComponent from '../../components/PaginationComponent.vue';

export default {
  components: {
    ButtonComponent,
    PaginationComponent
  },
  data() {
    return {
      questions: [],
      unansweredQuestions: [], // Array to store unanswered questions
      answeredQuestions: [],   // Array to store answered questions
      showUnanswered: false,   // Flag to toggle display of unanswered questions
      currentPageUnanswered: 1,
      currentPageAnswered: 1,
      pageSize: 5 // Number of questions per page
    };
  },
  created() {
    this.fetchQuestions();
  },
  computed: {
    filteredQuestions() {
      return this.showUnanswered ? this.unansweredQuestions : this.answeredQuestions;
    },
    paginatedUnansweredQuestions() {
      const startIndex = (this.currentPageUnanswered - 1) * this.pageSize;
      return this.unansweredQuestions.slice(startIndex, startIndex + this.pageSize);
    },
    paginatedAnsweredQuestions() {
      const startIndex = (this.currentPageAnswered - 1) * this.pageSize;
      return this.answeredQuestions.slice(startIndex, startIndex + this.pageSize);
    }
  },
  methods: {
    async fetchQuestions() {
      try {
        const data = await axios.get(`${process.env.VUE_APP_API_URL}questions/`)
       
        this.questions = data.data.map(question => ({
          ...question,
          newAnswerText: '',
          userId: '',
          errorMessage: '',
          successMessage: '',
          showAnswer: false 
        }));
        
       
        this.unansweredQuestions = this.questions.filter(question => !question.answerText);
        this.answeredQuestions = this.questions.filter(question => question.answerText);

      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async submitAnswer(question) {
      question.errorMessage = '';
      question.successMessage = '';

      try {
        await axios.post(`${process.env.VUE_APP_API_URL}questions/${question.questionId}/answers`, {
          answerText: question.newAnswerText,
          userId: parseInt(question.userId)
        });
        question.successMessage = 'Answer added successfully!';
        question.newAnswerText = '';
        question.userId = '';

      
        this.fetchQuestions();
      } catch (error) {
        console.error('Error adding answer:', error);
        question.errorMessage = 'Error adding answer';
      }
    },
    toggleAnswer(question) {
      question.showAnswer = !question.showAnswer;
    },
    toggleUnansweredQuestions() {
      this.showUnanswered = !this.showUnanswered;
    },
    handleUnansweredPageChange(page) {
      this.currentPageUnanswered = page;
    },
    handleAnsweredPageChange(page) {
      this.currentPageAnswered = page;
    }
  }
};
</script>

<style scoped>
form{
  margin-bottom: 70px;
}
.kthehu button {
  margin-top: -10px;
}
.question-answer {
  margin-top: 60px;
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
  align-items: flex-start;
  cursor: pointer;
}

.toggle-icon {
  font-size: 24px;
  color: #666;
  margin-bottom: 15px; 
}

.toggle-text {
  font-size: 16px;
  color: #333;
  cursor: pointer;
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

.form-group button{
  margin-right:910px;
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

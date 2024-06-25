<template>
  <v-container>
    <div class="add-question">
      <h3 class="answer-title">Shto Pyetje:</h3>
      <form @submit.prevent="submitQuestion">
        <div class="form-group">
          <label for="questionText" class="label">Pyetja juaj:</label>
          <textarea v-model="questionText" required rows="3" class="input"></textarea>
        </div>
        <div class="form-group">
          <label for="userEmail" class="label">Email-i juaj:</label>
          <input v-model="userEmail" type="email" required class="input">
        </div>
        <div class="dorezo">
          <ButtonComponent buttonText="Dorëzo Pyetjen" @click="submitQuestion" />
        </div>
      </form>
    </div>

    <div class="question-answer">
      <div v-if="filteredQuestions.length === 0" class="no-questions">Nuk ka pyetje në dispozicion.</div>
      <div v-else>
        <div v-for="question in paginatedQuestions" :key="question.questionId" class="question">
          <div class="question-header" @click="toggleAnswer(question)">
            <h2 class="question-text">{{ question.questionText }}</h2>
            <span class="accordion-icon" :class="{ 'open': question.showAnswer }" @click.stop="toggleAnswer(question)">+</span>
          </div>

          <div v-if="question.showAnswer" class="answers">
            <p class="answer" v-if="question.answerText">{{ question.answerText }}</p>
            <div v-else class="no-answers">
              <p>Ende pa përgjigje.</p>
            </div>
          </div>
        </div>
      </div>

      <PaginationComponent
        :items="filteredQuestions"
        :pageSize="pageSize"
        @pageChanged="handlePageChange"
      />

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ButtonComponent from '@/components/ButtonComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { debounce } from 'lodash'; 

export default {
  components: {
    ButtonComponent,
    PaginationComponent,
  },
  props: ['searchQuery'],
  data() {
    return {
      questionText: '',
      userEmail: '',
    };
  },
  computed: {
    ...mapState('question', ['errorMessage', 'successMessage', 'currentPage', 'pageSize']),
    ...mapGetters('question', ['filteredQuestions', 'paginatedQuestions']),
  },
  created() {
    this.fetchQuestions();
  },
  methods: {
    ...mapActions('question', ['fetchQuestions', 'addQuestion', 'toggleAnswer', 'handlePageChange']),
  
    submitQuestion: debounce(async function() {
      await this.addQuestion({
        questionText: this.questionText,
        userId: 1, 
        userEmail: this.userEmail,
      });
      this.questionText = '';
      this.userEmail = '';
    }, 500), 
    toggleAnswer(question) {
      this.toggleAnswerState(question);
    },
    toggleAnswerState(question) {
      question.showAnswer = !question.showAnswer;
    },
  },
};
</script>


<style scoped>
form {
  margin-bottom: 45px;
  position: relative;
}

.dorezo {
  position: absolute;
  top: -20px;
}

.question-answer {
  margin-bottom: 20px;
}

.question {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.question-text {
  font-size: 18px;
  margin-bottom: 10px;
}

.answers {
  margin-top: 10px;
}

.answer {
  margin-bottom: 5px;
  color: #444;
}

.no-answers,
.no-questions {
  color: #888;
}

.no-answers p {
  margin: 0;
}

.add-question {
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

.accordion-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.accordion-icon.open {
  transform: rotate(45deg);
}
</style>

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
          <label for="email" class="label">Email-i juaj:</label>
          <input v-model="email" type="email" @input="validateEmail" required class="input">
          <p v-if="emailErrorMessage" class="error">{{ emailErrorMessage }}</p>
        </div>
        <div class="dorezo">
          <ButtonComponent :disabled="isSubmitting || !isEmailValid" buttonText="Dorëzo Pyetjen" @click="submitQuestion" />
        </div>
      </form>
    </div>
    <div class="question-answer">
      <div v-if="filteredQuestions.length === 0 && !loading" class="no-questions">Nuk ka pyetje në dispozicion.</div>
      <div v-else>
        <div v-for="question in paginatedQuestions" :key="question.questionId" class="question">
          <div class="question-header" @click="toggleAnswer(question)">
            <h2 class="question-text">{{ question.questionText }}</h2>
            <span class="accordion-icon" :class="{ 'open': question.showAnswer }" @click.stop="toggleAnswer(question)">+</span>
          </div>

          <div v-if="question.showAnswer" class="answers">
            <div v-if="question.answerText" class="answer">
              <p v-html="formattedAnswer(question.answerText)"></p>
            </div>
            <div v-else class="no-answers">
              <p>Ende pa përgjigje.</p>
            </div>
          </div>
        </div>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
    <PaginationComponent
      v-if="filteredQuestions.length > 0"
      :items="filteredQuestions"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @pageChanged="handlePageChange"
    />
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ButtonComponent from '@/components/ButtonComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import swal from 'sweetalert';

export default {
  components: {
    ButtonComponent,
    PaginationComponent,
  },
  props: ['searchQuery'],
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      questionText: '',
      email: '',
      isSubmitting: false,
      emailErrorMessage: '',
    };
  },
  computed: {
    ...mapState('question', ['errorMessage']),
    ...mapGetters('question', ['questions']),

    filteredQuestions() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) return this.$store.state.question.questions.slice().reverse(); 

      return this.$store.state.question.questions.filter(question => {
        const questionText = question.questionText.toLowerCase();
        return questionText.includes(query);
      }).slice().reverse(); 
    },
    paginatedQuestions() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredQuestions.slice(start, end);
    },
    isEmailValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.email);
    },
  },
  created() {
    this.fetchQuestions();
  },
  methods: {
    ...mapActions('question', ['fetchQuestions', 'addQuestion', 'toggleAnswer']),

    validateEmail() {
      if (!this.isEmailValid) {
        this.emailErrorMessage = 'Email-i nuk është i vlefshëm.';
      } else {
        this.emailErrorMessage = '';
      }
    },

    submitQuestion: async function() {
      this.isSubmitting = true;

      if (!this.isEmailValid) {
        this.emailErrorMessage = 'Email-i nuk është i vlefshëm.';
        this.isSubmitting = false;
        return;
      }

      try {
        await this.addQuestion({
          questionText: this.questionText,
          userId: 1,
          email: this.email,
        });
        this.questionText = '';
        this.email = '';
        swal({
          title: "Sukses",
          text: "Pyetja është shtuar me sukses.",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        
        await this.fetchQuestions();
        
        this.currentPage = 1;
      } catch (error) {
        this.errorMessage = 'Ka ndodhur një problem gjatë dërgimit të pyetjes.';
      } finally {
        this.isSubmitting = false;
      }
    },

    handlePageChange(page) {
      this.currentPage = page;
    },
    toggleAnswer(question) {
      this.toggleAnswerState(question);
    },
    toggleAnswerState(question) {
      question.showAnswer = !question.showAnswer;
    },
    formattedAnswer(text) {
      if (text) {
        return text
          .split('\n').join('<br>')
          .split('  ').join('&nbsp;&nbsp;'); 
      }
      return '';
    },
  },
};
</script>

<style scoped>
.add-question {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
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
.dorezo{
  padding:30px 0;
}
</style>

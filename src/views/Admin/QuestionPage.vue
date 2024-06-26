<template>
  <v-container>
    <div class="kthehu">
      <ButtonComponent :buttonText="showUnanswered ? 'Kthehu' : 'Përgjigju pyetjeve'" @click="toggleUnansweredQuestions" />
    </div>
    <div class="question-answer">
      <div v-if="filteredQuestions.length === 0 && !loading" class="no-questions">Nuk ka pyetje në dispozicion.</div>
      <div v-else>
        <div v-if="showUnanswered">
          <div v-for="question in paginatedUnansweredQuestions" :key="question.questionId" class="question">
            <h2 class="question-text">{{ question.questionText }}</h2>
            <form @submit.prevent="submitAnswer(question)">
              <div class="form-group">
                <label for="answerText" class="label">Përgjigja juaj:</label>
                <textarea v-model="question.newAnswerText" required rows="3" class="input"></textarea>
              </div>
              <div class="form-group">
                <label for="userId" class="label">ID-ja juaj:</label>
                <input type="text" v-model="question.userId" required class="input" />
              </div>
              <div class="form-group">
                <ButtonComponent buttonText="Dorëzo Përgjigjen" />
              </div>
            </form>
            <p v-if="question.errorMessage" class="error">{{ question.errorMessage }}</p>
            <p v-if="question.successMessage" class="success">{{ question.successMessage }}</p>
          </div>
          <PaginationComponent
            :items="unansweredQuestions"
            :pageSize="pageSize"
            @pageChanged="handleUnansweredPageChange"
          />
        </div>
        <div v-else>
          <div v-for="question in filteredQuestions" :key="question.questionId" class="question">
            <h2 class="question-text">{{ question.questionText }}</h2>
            <div class="answers">
              <div class="question-header">
                <button class="delete-button" @click="confirmDelete(question.questionId)">
                  <i class="fas fa-trash"></i>
                </button>
                <div class="toggle-text" @click="toggleAnswer(question)">
                  {{ question.showAnswer ? '-' : '+' }}
                </div>
                <span class="toggle-icon" @click="toggleAnswer(question)">
                  {{ question.showAnswer ? '-' : '+' }}
                </span>
              </div>
              <p v-if="question.showAnswer" class="answer">{{ question.answerText }}</p>
            </div>
          </div>
          <PaginationComponent
            v-if="filteredQuestions.length > 0"
            :items="filteredQuestions"
            :pageSize="pageSize"
            @pageChanged="handlePageChange"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ButtonComponent from '../../components/ButtonComponent.vue';
import PaginationComponent from '../../components/PaginationComponent.vue';
import swal from 'sweetalert';

export default {
  components: {
    ButtonComponent,
    PaginationComponent
  },
  data() {
    return {
      showUnanswered: false,
      searchQuery: '', // New state to hold search query
      loading: false, // Flag to indicate loading state
    };
  },
  created() {
    this.fetchQuestions();
  },
  computed: {
    ...mapState('question', ['questions', 'currentPage', 'currentPageUnanswered', 'pageSize', 'errorMessage', 'successMessage']),
    ...mapGetters('question', ['filteredQuestions', 'paginatedQuestions', 'paginatedUnansweredQuestions', 'paginatedAnsweredQuestions']),
  },
  methods: {
    ...mapActions('question', ['fetchQuestions', 'answerQuestion', 'deleteQuestion', 'handlePageChange', 'handleUnansweredPageChange']),
    async submitAnswer(question) {
      try {
        await this.answerQuestion({ questionId: question.questionId, answerText: question.newAnswerText, userId: question.userId });
        question.successMessage = 'Përgjigja u shtua me sukses!';
        question.newAnswerText = '';
        question.userId = '';
        this.fetchQuestions();
      } catch (error) {
        console.error('Ka ndodhur një problem gjatë shtimit të përgjigjes:', error);
        question.errorMessage = 'Ka ndodhur një problem gjatë shtimit të përgjigjes';
      }
    },
    toggleAnswer(question) {
      question.showAnswer = !question.showAnswer;
    },
    toggleUnansweredQuestions() {
      this.showUnanswered = !this.showUnanswered;
    },
    handleUnansweredPageChange(page) {
      this.handleUnansweredPageChange(page);
    },
    handleAnsweredPageChange(page) {
      this.handleAnsweredPageChange(page);
    },
    confirmDelete(questionId) {
      swal({
        title: 'A jeni i sigurt?',
        text: 'Pasi ta fshini, nuk do të mund ta riktheni këtë pyetje!',
        icon: 'warning',
        buttons: ['Anulo', 'Po, fshije!'],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.deleteQuestion(questionId)
            .then(() => {
              swal('Pyetja është fshirë me sukses!', {
                icon: 'success',
              });
            })
            .catch((error) => {
              console.error('Ka ndodhur një gabim gjatë fshirjes së pyetjes:', error);
              swal('Oops! Ndodhi një gabim.', {
                icon: 'error',
              });
            })
            .finally(() => {
              this.fetchQuestions();
            });
        } else {
          swal('Pyetja është e sigurtë!', {
            icon: 'info',
          });
        }
      });
    },
  },
  watch: {
    searchQuery(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal.trim() === '') {
          // Reset filtering when search query is empty
          this.$store.commit('question/setFilter', null);
        } else {
          // Apply filtering when search query is not empty
          this.$store.commit('question/setFilter', newVal.trim());
        }
      }
    },
    questions() {
      // Reset loading state when questions are updated
      this.loading = false;
    },
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

form {
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
  position: relative; 
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
.form-group button {
  margin-right: 910px;
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
.delete-button {
  background: none;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
}
.delete-button:hover {
  color: #cc0000;
}
</style>

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
                <ButtonComponent buttonText="Dorëzo Përgjigjen" @click="submitAnswer(question)" />
              </div>
            </form>
            <p v-if="question.errorMessage" class="error">{{ question.errorMessage }}</p>
            <p v-if="question.successMessage" class="success">{{ question.successMessage }}</p>
          </div>
          <PaginationComponent
            :items="unansweredQuestions"
            :pageSize="pageSizeUnanswered"
            @pageChanged="handleUnansweredPageChange"
          />
        </div>
        <div v-else>
          <div v-for="question in paginatedAnsweredQuestions" :key="question.questionId">
            <div v-if="question.answerText" class="question">
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
                <button v-if="question.showAnswer" @click="toggleEditAnswer(question)" class="edit-button">
                  {{ question.editingAnswer ? 'Anulo' : 'Ndrysho përgjigjen' }}
                </button>
                <form v-if="question.editingAnswer" @submit.prevent="submitEditedAnswer(question)">
                  <div class="form-group">
                    <label for="editAnswerText" class="label">Ndrysho përgjigjen:</label>
                    <textarea v-model="question.editAnswerText" required rows="3" class="input"></textarea>
                  </div>
                  <div class="form-group">
                    <ButtonComponent buttonText="Ruaj Ndryshimet" @click="submitEditedAnswer(question)" />
                  </div>
                </form>
                <p v-if="question.errorMessage" class="error">{{ question.errorMessage }}</p>
                <p v-if="question.successMessage" class="success">{{ question.successMessage }}</p>
              </div>
            </div>
          </div>
          <PaginationComponent
            :items="filteredQuestions.filter(q => q.answerText)"
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
    };
  },
  computed: {
    ...mapState('question', ['loading', 'pageSize', 'pageSizeUnanswered']),
    ...mapGetters('question', [
      'filteredQuestions',
      'paginatedQuestions',
      'paginatedUnansweredQuestions',
      'paginatedAnsweredQuestions',
      'unansweredQuestions',
    ]),
  },
  created() {
    this.fetchQuestions();
  },
  methods: {
    ...mapActions('question', [
      'fetchQuestions',
      'answerQuestion',
      'editAnswer',
      'deleteQuestion',
      'handlePageChange',
      'handleUnansweredPageChange',
    ]),
    async submitAnswer(question) {
      try {
        await this.answerQuestion({
          questionId: question.questionId,
          answerText: question.newAnswerText,
          userId: question.userId,
        });
        question.successMessage = 'Përgjigja u shtua me sukses!';
        question.newAnswerText = '';
        question.userId = '';
        this.fetchQuestions();
        swal({
          title: 'Sukses!',
          text: 'Përgjigja u shtua me sukses!',
          icon: 'success',
          timer: 3000,
          buttons: false,
        });
      } catch (error) {
        console.error('Ka ndodhur një problem gjatë shtimit të përgjigjes:', error);
        question.errorMessage = 'Ka ndodhur një problem gjatë shtimit të përgjigjes';
      }
    },
    async submitEditedAnswer(question) {
      try {
        await this.editAnswer({
          questionId: question.questionId,
          answerText: question.editAnswerText,
        });
        question.successMessage = 'Përgjigja u ndryshua me sukses!';
        question.editingAnswer = false;
        question.editAnswerText = '';
        this.fetchQuestions();
        swal({
          title: 'Sukses!',
          text: 'Ndryshimi është kryer me sukses.',
          icon: 'success',
          timer: 3000,
          buttons: false,
        });
      } catch (error) {
        console.error('Ka ndodhur një problem gjatë ndryshimit të përgjigjes:', error);
        question.errorMessage = 'Ka ndodhur një problem gjatë ndryshimit të përgjigjes';
      }
    },
    toggleAnswer(question) {
      question.showAnswer = !question.showAnswer;
    },
    toggleEditAnswer(question) {
      question.editingAnswer = !question.editingAnswer;
      question.editAnswerText = question.answerText;
    },
    toggleUnansweredQuestions() {
      this.showUnanswered = !this.showUnanswered;
    },
    handleUnansweredPageChange(page) {
      this.handleUnansweredPageChange(page);
    },
    confirmDelete(questionId) {
      swal({
        title: 'A jeni i sigurt?',
        text: 'Kjo veprim do të fshijë përgjithmonë pyetjen dhe përgjigjet e saj!',
        icon: 'warning',
        buttons: ['Anulo', 'Fshij'],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await this.deleteQuestion(questionId);
          this.fetchQuestions();
          swal({
            title: 'Fshirë!',
            text: 'Pyetja dhe përgjigjet e saj janë fshirë.',
            icon: 'success',
            timer: 3000,
            buttons: false,
          });
        }
      });
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
.edit-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
.edit-button:hover {
  color: #0056b3;
}
</style>
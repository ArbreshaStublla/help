// Import your service for handling API calls
import QuestionService from '@/services/questionService';

export const question = {
  namespaced: true,

  state: {
    questions: [], // Array to hold questions
    loading: false, // Loading state
    currentPage: 1, // Current page for pagination
    currentPageUnanswered: 1, // Current page for unanswered questions pagination
    pageSize: 5, // Number of items per page for answered questions
    pageSizeUnanswered: 20, // Number of items per page for unanswered questions
    errorMessage: '', // Error message state
    successMessage: '', // Success message state
  },

  getters: {
    // Getter to fetch all questions
    filteredQuestions: state => state.questions,

    // Paginate questions based on current page and page size
    paginatedQuestions: state => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      return state.questions.slice(startIndex, startIndex + state.pageSize);
    },

    // Paginate unanswered questions based on current page and page size
    paginatedUnansweredQuestions: state => {
      const startIndex = (state.currentPageUnanswered - 1) * state.pageSizeUnanswered;
      const endIndex = startIndex + state.pageSizeUnanswered;
      return state.questions.filter(q => !q.answerText).slice(startIndex, endIndex);
    },

    // Paginate answered questions based on current page and page size
    paginatedAnsweredQuestions: state => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      return state.questions.filter(q => q.answerText).slice(startIndex, endIndex);
    },

    // Getter for current page
    currentPage: state => state.currentPage,

    // Getter for current unanswered page
    currentPageUnanswered: state => state.currentPageUnanswered,

    // Getter for page size
    pageSize: state => state.pageSize,

    // Getter for unanswered page size
    pageSizeUnanswered: state => state.pageSizeUnanswered,

    // Getter for error message
    errorMessage: state => state.errorMessage,

    // Getter for success message
    successMessage: state => state.successMessage,
  },

  actions: {
    // Action to fetch questions from the server
    async fetchQuestions({ commit }) {
      try {
        commit('SET_LOADING', true); // Set loading state to true
        const questions = await QuestionService.fetchQuestions(); // Call API to fetch questions
        commit('SET_QUESTIONS', questions); // Commit mutation to set questions in state
      } catch (error) {
        commit('SET_ERROR', 'Error fetching questions.'); // Handle error if fetch fails
        console.error('Error fetching questions:', error);
        throw error; // Throw error for further handling
      } finally {
        commit('SET_LOADING', false); // Set loading state to false after fetch completes
      }
    },

    // Action to add a new question
    async addQuestion({ commit, state }, newQuestion) {
      try {
        const question = await QuestionService.addQuestion(newQuestion); // Call API to add question
        commit('ADD_QUESTION', question); // Commit mutation to add question to state
        
        // Calculate new current page after adding a question
        const totalPages = Math.ceil(state.questions.length / state.pageSize);
        commit('SET_CURRENT_PAGE', totalPages); // Set to last page
        
        commit('SET_SUCCESS', 'Question added successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error adding question.'); // Handle error if add fails
        console.error('Error adding question:', error);
        throw error; // Throw error for further handling
      }
    },

    // Action to answer a question
    async answerQuestion({ commit }, { questionId, answerText, userId }) {
      try {
        await QuestionService.answerQuestion(questionId, { answerText, userId }); // Call API to answer question
        commit('SET_ANSWER', { questionId, answerText }); // Commit mutation to set answer
        commit('SET_SUCCESS', 'Answer added successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error answering question.'); // Handle error if answer fails
        console.error('Error answering question:', error);
        throw error; // Throw error for further handling
      }
    },

    // Action to edit an answer
    async editAnswer({ commit }, { questionId, answerText }) {
      try {
        await QuestionService.editAnswer(questionId, { answerText }); // Call API to edit answer
        commit('EDIT_ANSWER', { questionId, answerText }); // Commit mutation to edit answer
        commit('SET_SUCCESS', 'Answer edited successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error editing answer.'); // Handle error if edit fails
        console.error('Error editing answer:', error);
        throw error; // Throw error for further handling
      }
    },

    // Action to delete a question
    async deleteQuestion({ commit }, questionId) {
      try {
        await QuestionService.deleteQuestion(questionId); // Call API to delete question
        commit('DELETE_QUESTION', questionId); // Commit mutation to delete question
        commit('SET_SUCCESS', 'Question deleted successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error deleting question.'); // Handle error if delete fails
        console.error('Error deleting question:', error);
        throw error; // Throw error for further handling
      }
    },

    // Action to handle page change for questions pagination
    handlePageChange({ commit }, newPage) {
      commit('SET_CURRENT_PAGE', newPage); // Commit mutation to set current page
    },

    // Action to handle page change for unanswered questions pagination
    handleUnansweredPageChange({ commit }, newPage) {
      commit('SET_CURRENT_PAGE_UNANSWERED', newPage); // Commit mutation to set current unanswered page
    },
  },

  mutations: {
    // Mutation to set questions in state
    SET_QUESTIONS(state, questions) {
      state.questions = questions;
    },

    // Mutation to add a question to state
    ADD_QUESTION(state, question) {
      state.questions.push(question);
    },

    // Mutation to set loading state
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },

    // Mutation to set error message
    SET_ERROR(state, message) {
      state.errorMessage = message;
    },

    // Mutation to set success message
    SET_SUCCESS(state, message) {
      state.successMessage = message;
    },

    // Mutation to set current page
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },

    // Mutation to set current unanswered page
    SET_CURRENT_PAGE_UNANSWERED(state, page) {
      state.currentPageUnanswered = page;
    },

    // Mutation to set answer for a question
    SET_ANSWER(state, { questionId, answerText }) {
      const question = state.questions.find(q => q.questionId === questionId);
      if (question) {
        question.answerText = answerText;
      }
    },

    // Mutation to edit answer for a question
    EDIT_ANSWER(state, { questionId, answerText }) {
      const question = state.questions.find(q => q.questionId === questionId);
      if (question) {
        question.answerText = answerText;
      }
    },

    // Mutation to delete a question from state
    DELETE_QUESTION(state, questionId) {
      state.questions = state.questions.filter(q => q.questionId !== questionId);
    },
  },
};

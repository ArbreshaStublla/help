import QuestionService from '@/services/questionService';

export const question = {
  namespaced: true,

  state: {
    questions: [], // Array to store the questions
    loading: false, // Loading state
    currentPage: 1, // Current page of paginated questions
    currentPageUnanswered: 1, // Current page of paginated unanswered questions
    pageSize: 5, // Page size for paginated questions
    pageSizeUnanswered: 20, // Page size for paginated unanswered questions
    errorMessage: '', // Error message state
    successMessage: '', // Success message state
    searchQuery: '', // Search query state
  },

  getters: {
    // Getter to retrieve all questions
    filteredQuestions: state => {
      if (state.searchQuery.trim() === '') {
        return state.questions;
      } else {
        const lowerCaseQuery = state.searchQuery.toLowerCase().trim();
        return state.questions.filter(question =>
          question.title.toLowerCase().includes(lowerCaseQuery)
        );
      }
    },

    // Getter to retrieve paginated questions
    paginatedQuestions: (state, getters) => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      return getters.filteredQuestions.slice(startIndex, startIndex + state.pageSize);
    },

    // Getter to retrieve paginated unanswered questions
    paginatedUnansweredQuestions: (state, getters) => {
      const startIndex = (state.currentPageUnanswered - 1) * state.pageSizeUnanswered;
      const endIndex = startIndex + state.pageSizeUnanswered;
      return getters.filteredQuestions.filter(q => !q.answerText).slice(startIndex, endIndex);
    },

    // Getter to retrieve paginated answered questions
    paginatedAnsweredQuestions: (state, getters) => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      return getters.filteredQuestions.filter(q => q.answerText).slice(startIndex, endIndex);
    },

    // Getter to retrieve current page of paginated questions
    currentPage: state => state.currentPage,

    // Getter to retrieve current page of paginated unanswered questions
    currentPageUnanswered: state => state.currentPageUnanswered,

    // Getter to retrieve page size of paginated questions
    pageSize: state => state.pageSize,

    // Getter to retrieve page size of paginated unanswered questions
    pageSizeUnanswered: state => state.pageSizeUnanswered,

    // Getter to retrieve error message
    errorMessage: state => state.errorMessage,

    // Getter to retrieve success message
    successMessage: state => state.successMessage,

    // Getter to retrieve search query
    searchQuery: state => state.searchQuery,
  },

  actions: {
    // Action to fetch questions from the server
    async fetchQuestions({ commit }) {
      try {
        commit('SET_LOADING', true); // Set loading state to true
        const questions = await QuestionService.fetchQuestions(); // Call service to fetch questions
        commit('SET_QUESTIONS', questions); // Commit mutation to set questions in state
      } catch (error) {
        commit('SET_ERROR', 'Error fetching questions.'); // Handle error and set error message
        console.error('Error fetching questions:', error);
        throw error; // Rethrow error to propagate it further
      } finally {
        commit('SET_LOADING', false); // Set loading state to false after fetching
      }
    },

    // Action to add a new question
    async addQuestion({ commit, state }, newQuestion) {
      try {
        const question = await QuestionService.addQuestion(newQuestion); // Call service to add question
        commit('ADD_QUESTION', question); // Commit mutation to add question to state

        // Update current page based on new total pages
        const totalPages = Math.ceil(state.questions.length / state.pageSize);
        commit('SET_CURRENT_PAGE', totalPages);

        commit('SET_SUCCESS', 'Question added successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error adding question.'); // Handle error and set error message
        console.error('Error adding question:', error);
        throw error; // Rethrow error to propagate it further
      }
    },

    // Action to answer a question
    async answerQuestion({ commit }, { questionId, answerText, userId }) {
      try {
        await QuestionService.answerQuestion(questionId, { answerText, userId }); // Call service to answer question
        commit('SET_ANSWER', { questionId, answerText }); // Commit mutation to set answer
        commit('SET_SUCCESS', 'Answer added successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error answering question.'); // Handle error and set error message
        console.error('Error answering question:', error);
        throw error; // Rethrow error to propagate it further
      }
    },

    // Action to edit an answer
    async editAnswer({ commit }, { questionId, answerText }) {
      try {
        await QuestionService.editAnswer(questionId, { answerText }); // Call service to edit answer
        commit('EDIT_ANSWER', { questionId, answerText }); // Commit mutation to edit answer
        commit('SET_SUCCESS', 'Answer edited successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error editing answer.'); // Handle error and set error message
        console.error('Error editing answer:', error);
        throw error; // Rethrow error to propagate it further
      }
    },

    // Action to delete a question
    async deleteQuestion({ commit }, questionId) {
      try {
        await QuestionService.deleteQuestion(questionId); // Call service to delete question
        commit('DELETE_QUESTION', questionId); // Commit mutation to delete question
        commit('SET_SUCCESS', 'Question deleted successfully.'); // Set success message
      } catch (error) {
        commit('SET_ERROR', 'Error deleting question.'); // Handle error and set error message
        console.error('Error deleting question:', error);
        throw error; // Rethrow error to propagate it further
      }
    },

    // Action to handle page change for paginated questions
    handlePageChange({ commit }, newPage) {
      commit('SET_CURRENT_PAGE', newPage); // Commit mutation to set current page
    },

    // Action to handle page change for paginated unanswered questions
    handleUnansweredPageChange({ commit }, newPage) {
      commit('SET_CURRENT_PAGE_UNANSWERED', newPage); // Commit mutation to set current page for unanswered questions
    },

    // Action to update search query
    updateSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query); // Commit mutation to set search query
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

    // Mutation to set current page of paginated questions
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },

    // Mutation to set current page of paginated unanswered questions
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

    
    DELETE_QUESTION(state, questionId) {
      state.questions = state.questions.filter(q => q.questionId !== questionId);
    },

    
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query.toLowerCase().trim();
    },
  },
};

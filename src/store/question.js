// question.js

import QuestionService from '@/services/questionService';

export const question = {
  namespaced: true,

  state: {
    questions: [],
    loading: false,
    currentPage: 1,
    currentPageUnanswered: 1,
    pageSize: 5,
    errorMessage: '',
    successMessage: '',
  },

  getters: {
    filteredQuestions: state => state.questions,
    paginatedQuestions: state => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      return state.questions.slice(startIndex, startIndex + state.pageSize);
    },
    paginatedUnansweredQuestions: state => {
      const startIndex = (state.currentPageUnanswered - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      return state.questions.filter(q => !q.answerText).slice(startIndex, endIndex);
    },
    paginatedAnsweredQuestions: state => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      return state.questions.filter(q => q.answerText).slice(startIndex, endIndex);
    },
    
    
    currentPage: state => state.currentPage,
    currentPageUnanswered: state => state.currentPageUnanswered,
    pageSize: state => state.pageSize,
    errorMessage: state => state.errorMessage,
    successMessage: state => state.successMessage,
  },

  actions: {
    async fetchQuestions({ commit }) {
      try {
        commit('SET_LOADING', true);
        const questions = await QuestionService.fetchQuestions();
        commit('SET_QUESTIONS', questions);
      } catch (error) {
        commit('SET_ERROR', 'Error fetching questions.');
        console.error('Error fetching questions:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addQuestion({ commit, state }, newQuestion) {
      try {
        const question = await QuestionService.addQuestion(newQuestion);
        commit('ADD_QUESTION', question);
        
        // Calculate new current page after adding a question
        const totalPages = Math.ceil(state.questions.length / state.pageSize);
        commit('SET_CURRENT_PAGE', totalPages); // Set to last page
        
        commit('SET_SUCCESS', 'Question added successfully.');
      } catch (error) {
        commit('SET_ERROR', 'Error adding question.');
        console.error('Error adding question:', error);
        throw error;
      }
    },

    async answerQuestion({ commit }, { questionId, answerText, userId }) {
      try {
        await QuestionService.answerQuestion(questionId, { answerText, userId });
        commit('SET_ANSWER', { questionId, answerText });
        commit('SET_SUCCESS', 'Answer added successfully.');
      } catch (error) {
        commit('SET_ERROR', 'Error answering question.');
        console.error('Error answering question:', error);
        throw error;
      }
    },

    async editAnswer({ commit }, { questionId, answerText }) {
      try {
        await QuestionService.editAnswer(questionId, { answerText });
        commit('EDIT_ANSWER', { questionId, answerText });
        commit('SET_SUCCESS', 'Answer edited successfully.');
      } catch (error) {
        commit('SET_ERROR', 'Error editing answer.');
        console.error('Error editing answer:', error);
        throw error;
      }
    },

    async deleteQuestion({ commit }, questionId) {
      try {
        await QuestionService.deleteQuestion(questionId);
        commit('DELETE_QUESTION', questionId);
        commit('SET_SUCCESS', 'Question deleted successfully.');
      } catch (error) {
        commit('SET_ERROR', 'Error deleting question.');
        console.error('Error deleting question:', error);
        throw error;
      }
    },

    handlePageChange({ commit }, newPage) {
      commit('SET_CURRENT_PAGE', newPage);
    },

    handleUnansweredPageChange({ commit }, newPage) {
      commit('SET_CURRENT_PAGE_UNANSWERED', newPage);
    },
  },

  mutations: {
    SET_QUESTIONS(state, questions) {
      state.questions = questions;
    },
    ADD_QUESTION(state, question) {
      state.questions.push(question);
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, message) {
      state.errorMessage = message;
    },
    SET_SUCCESS(state, message) {
      state.successMessage = message;
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },
    SET_CURRENT_PAGE_UNANSWERED(state, page) {
      state.currentPageUnanswered = page;
    },
    SET_ANSWER(state, { questionId, answerText }) {
      const question = state.questions.find(q => q.questionId === questionId);
      if (question) {
        question.answerText = answerText;
      }
    },
    EDIT_ANSWER(state, { questionId, answerText }) {
      const question = state.questions.find(q => q.questionId === questionId);
      if (question) {
        question.answerText = answerText;
      }
    },
    DELETE_QUESTION(state, questionId) {
      state.questions = state.questions.filter(q => q.questionId !== questionId);
    },
  },
};

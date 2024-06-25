// src/store/modules/question.js

import QuestionService from '@/services/questionService';

export const question = {
  namespaced: true,

  state: {
    questions: [],
    loading: false,
    currentPage: 1,
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
    currentPage: state => state.currentPage,
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

    async addQuestion({ commit }, newQuestion) {
      try {
        const question = await QuestionService.addQuestion(newQuestion);
        commit('ADD_QUESTION', question);
        commit('SET_SUCCESS', 'Question added successfully.');
      } catch (error) {
        commit('SET_ERROR', 'Error adding question.');
        console.error('Error adding question:', error);
        throw error;
      }
    },

    async answerQuestion({ commit }, { questionId, answerText }) {
      try {
        await QuestionService.answerQuestion(questionId, { answerText });
        commit('SET_ANSWER', { questionId, answerText });
        commit('SET_SUCCESS', 'Answer added successfully.');
      } catch (error) {
        commit('SET_ERROR', 'Error answering question.');
        console.error('Error answering question:', error);
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

    async toggleAnswer({ commit }, question) {
      try {
        await QuestionService.toggleAnswer(question);
        commit('TOGGLE_ANSWER', question);
      } catch (error) {
        commit('SET_ERROR', 'Error toggling answer state.');
        console.error('Error toggling answer state:', error);
        throw error;
      }
    },

    async handlePageChange({ commit }, newPage) {
      try {
        commit('SET_CURRENT_PAGE', newPage);
      } catch (error) {
        commit('SET_ERROR', 'Error handling page change.');
        console.error('Error handling page change:', error);
        throw error;
      }
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
    SET_ANSWER(state, { questionId, answerText }) {
      const question = state.questions.find(q => q.questionId === questionId);
      if (question) {
        question.answerText = answerText;
      }
    },
    DELETE_QUESTION(state, questionId) {
      state.questions = state.questions.filter(q => q.questionId !== questionId);
    },
    TOGGLE_ANSWER(state, question) {
      question.showAnswer = !question.showAnswer;
    },
  },
};

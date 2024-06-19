<template>
    <div class="pagination-container" v-if="totalPages > 0">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="pageChanged"
        rounded
        class="text-center"
      ></v-pagination>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      pageSize: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        currentPage: 1
      };
    },
    computed: {
      totalPages() {
        if (!this.items || this.items.length === 0) {
          return 0;
        }
        return Math.ceil(this.items.length / this.pageSize);
      }
    },
    watch: {
      currentPage(newPage) {
        this.pageChanged(newPage);
      }
    },
    methods: {
      pageChanged(page) {
        this.$emit('pageChanged', page);
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination-container {
    margin-top: 20px;
  }
  </style>
  
<template>
  <div class="pagination-container" v-if="totalPages > 0">
    <button @click="previousPage" :disabled="currentPage === 1" class="arrow-button">
      
    </button>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @input="pageChanged"
      :next-icon="'fas fa-arrow-right'"
      :prev-icon="'fas fa-arrow-left'"
      :total-visible="5"
      rounded
      class="text-center"
    ></v-pagination>
    <button @click="nextPage" :disabled="currentPage === totalPages" class="arrow-button">
    </button>
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
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px;
  padding: 0;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.v-pagination__prev .v-btn,
.v-pagination__next .v-btn {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.v-pagination__prev .v-btn__content,
.v-pagination__next .v-btn__content {
  margin: 0 !important;
  padding: 0 !important;
}
</style>

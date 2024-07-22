<template>
  <div class="search-container">
    <span class="search-icon reversed">&#x1F50E;&#xFE0E;</span>
    <input type="text" placeholder="Kërkoni këtu" class="search-input" v-model="searchQuery" @input="updateSearch">
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    updateSearch() {
      this.$store.commit('setSearchQuery', this.searchQuery);
    }
  }
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  max-width: 600px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 5px 20px;
  font-size: 18px;
}

.search-icon {
  font-size: 24px;
  color: #1B4D3E;
  margin-right: 10px;
  transform: scaleX(-1); 
}

.search-icon.reversed {
  transform: scaleX(-1);
}
</style>

<template>
    <div class="form-container">
      <input type="text" v-model="title" placeholder="Enter article title" class="title-input">
      <RichTextEditor v-model="content" class="rich-text-editor" />
      <input type="file" ref="fileInput" @change="handleFileChange" class="file-input">
      <button @click="saveArticle" class="save-button">Save Article</button>
    </div>
  </template>
  
  <script>
  import RichTextEditor from '@/components/RichTextEditor.vue'; 
  import axios from 'axios';
  
  export default {
    components: {
      RichTextEditor,
    },
    data() {
      return {
        title: '',
        content: '',
        selectedFile: null, 
      };
    },
    methods: {
      saveArticle() {
        
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('content', this.content);
        formData.append('userId', 1); 
        
        if (this.selectedFile) {
          formData.append('image', this.selectedFile); 
        }
  
        
        axios.post('http://192.168.44.239:3000/article/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log('Article saved:', response.data);
          
          this.title = ''; 
          this.content = ''; 
          this.selectedFile = null; 
        })
        .catch(error => {
          console.error('Error saving article:', error);
        
        });
      },
      handleFileChange(event) {
        this.selectedFile = event.target.files[0]; 
      },
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    margin-bottom: 20px;
    padding: 20px;
  
    border-radius: 5px;
    
  }
  
  .title-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .rich-text-editor {
    margin-bottom: 10px;
  }
  
  .file-input {
    margin-bottom: 10px;
  }
  
  .save-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .save-button:hover {
    background-color: #0056b3;
  }
  </style>
  
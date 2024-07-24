<template>
  <div class="form-container">
    <input type="text" v-model="title" placeholder="Titulli i postimit" class="title-input">
    <RichTextEditor v-model="content" class="rich-text-editor" />
    <input type="file" ref="fileInput" @change="handleFileChange" class="file-input">
    <div class="buton-container">
      <ButtonComponent :buttonText="'Shto postimin'" @click="saveArticle"></ButtonComponent>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '../../components/ButtonComponent.vue';
import RichTextEditor from '@/components/RichTextEditor.vue'; 
import axios from 'axios';
import swal from 'sweetalert';

export default {
  components: {
    ButtonComponent,
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

      axios.post(`${process.env.VUE_APP_API_URL}article/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Article saved:', response.data);
        swal("Sukses!", "Postimi u shtua me sukses!", "success");
        this.$router.push({ name: 'homeadmin' });
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
  height: 100vh;
}

.file-input {
  margin-top: 40px;
}

.buton-container {
  margin-top: 20px;
}

.save-button:hover {
  background-color: #0056b3;
}
</style>

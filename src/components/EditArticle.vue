<template>
  <div class="edit-article-page">
    <v-container>
      <div class="form-container">
        <h2>Ndrysho Postimin</h2>
        <br>
        <form @submit.prevent="updateArticle">
          <v-text-field
            v-model="article.title"
            label="Titulli"
            required
          ></v-text-field>

          <div class="image-upload-container">
            <img v-if="article.imageUrl && !newImage" :src="getImageUrl(article.imageUrl)" class="image-preview" alt="Article Image"/>
            <img v-if="newImage" :src="newImage" class="image-preview" alt="New Image Preview"/>

            <v-file-input
              v-model="file"
              label="Ngarko një Imazh të Ri"
              accept="image/*"
              @change="handleFileChange"
            ></v-file-input>
          </div>

          <div class="editor-container">
            <div ref="editorContainer" class="quill-editor"></div>
          </div>
<div class="butoni">
  <button-component
            buttonText="Përditëso Postimin"
            @click="updateArticle"
          />
          <custom-button
            buttonText="Anulo"
            @click="cancelEdit"
          />
</div>
         
        
        </form>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import ButtonComponent from '@/components/ButtonComponent.vue'; 
import swal from 'sweetalert';

Quill.register('modules/imageResize', ImageResize);

export default {
  components: {
    ButtonComponent
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const article = ref({
      title: '',
      content: '',
      imageUrl: '',
    });
    const file = ref(null);
    const newImage = ref('');
    const editorContainer = ref(null);
    const editor = ref(null);

    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://192.168.44.239:3000/article/${route.params.id}`);
        article.value = response.data;
        
        if (editorContainer.value) {
          editor.value = new Quill(editorContainer.value, {
            theme: 'snow',
            modules: {
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ direction: 'rtl' }],
                [{ align: [] }],
                ['link', 'image', 'video', 'blockquote', 'code-block'],
                ['clean']
              ],
              imageResize: {},
            },
          });
          editor.value.root.innerHTML = article.value.content;  
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    const updateArticle = async () => {
      const formData = new FormData();
      formData.append('title', article.value.title);
      formData.append('content', editor.value.root.innerHTML);
      
      if (file.value) {
        formData.append('image', file.value);
      } else {
        formData.append('imageUrl', article.value.imageUrl); 
      }

      try {
        await axios.put(`http://192.168.44.239:3000/article/${route.params.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        swal({
          title: "Sukses!",
          text: "Postimi është përditësuar me sukses.",
          icon: "success",
          button: "OK",
        }).then(() => {
          router.push({ name: 'homeadmin', params: { id: route.params.id } });
        });
      } catch (error) {
        console.error('Error updating article:', error);
      }
    };
    const cancelEdit = () => {
      router.push({ name: 'articleDetails', params: { id: route.params.id } });
    };
    const getImageUrl = (relativePath) => {
      return `http://192.168.44.239:3000${relativePath}`;
    };

    const handleFileChange = (event) => {
      const newFile = event.target.files[0];
      if (newFile) {
        file.value = newFile;
        const reader = new FileReader();
        reader.onload = (e) => {
          newImage.value = e.target.result;
        };
        reader.readAsDataURL(newFile);
      }
    };

    onMounted(() => {
      fetchArticle();  
    });

    watch(() => article.value.content, (newContent) => {
      if (editor.value) {
        editor.value.root.innerHTML = newContent;
      }
    });

    return {
      article,
      file,
      newImage,
      updateArticle,
      cancelEdit,
      getImageUrl,
      handleFileChange,
      editorContainer,
    };
  },
};
</script>

<style scoped>
.form-container {
  margin: auto;
  padding: 20px;
}

.v-text-field,
.v-textarea,
.v-file-input {
  margin-bottom: 20px;
}

.editor-container {
  margin-bottom: 20px;
  height: 100vh;
}

.quill-editor {
  height: 100vh;
}

.image-upload-container {
  display: flex;
  align-items: center;
}

.image-preview {
  max-width: 50%;
  min-height: 200px;
  margin-bottom: 10px;
  margin-top: 30px;
  border-radius: 10px;
}
.butoni{
  margin-top:45px ;
  display: flex;
  
}
</style>

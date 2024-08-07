<template>
  <div>
    <div ref="editor"></div>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange">
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import axios from 'axios';

Quill.register('modules/imageResize', ImageResize);

export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const editor = ref(null);

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        await handleFileUpload(file);
      }
    };

    async function handleFileUpload(file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${process.env.VUE_APP_API_URL}article/upload`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


        const imageUrl = response.data.imageUrl;
        if (imageUrl) {
          const quill = editor.value.__quill;
          const range = quill.getSelection();
          quill.clipboard.dangerouslyPasteHTML(range.index, `<img src="${imageUrl}" class="editor-image">`);
        } else {
          console.error('Image URL not returned from server.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    onMounted(() => {
      const quillEditor = new Quill(editor.value, {
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
            [{ 'text-box': 'Textbox' }],
            ['clean']
          ],
          imageResize: {},
        },
      });


      quillEditor.on('text-change', () => {
        emit('update:modelValue', quillEditor.root.innerHTML);
      });

      
      if (props.modelValue) {
        quillEditor.root.innerHTML = props.modelValue;
      }

      
      const textboxButton = quillEditor.getModule('toolbar').container.querySelector('.ql-text-box');
      if (textboxButton) {
        textboxButton.addEventListener('click', () => {
          insertTextbox(quillEditor);
        });
      }

      
      function insertTextbox(quill) {
        const range = quill.getSelection();
        const position = quill.getBounds(range.index);
        const offsetX = position.left;
        const offsetY = position.top + position.height;

        const textbox = document.createElement('div');
        textbox.classList.add('textbox');
        textbox.style.left = `${offsetX}px`;
        textbox.style.top = `${offsetY}px`;
        textbox.contentEditable = true;
        textbox.draggable = true;
        textbox.innerHTML = 'Editable textbox';

        quill.clipboard.dangerouslyPasteHTML(range.index, textbox.outerHTML);
      }
    
      const editorElement = quillEditor.root.parentElement;
      editorElement.addEventListener('drop', handleImageDrop);

      function handleImageDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
          handleFileUpload(files[0]);
        }
      }

    
      editorElement.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      });
    });

    return {
      editor,
      handleFileChange,
    };
  },
};
</script>

<style>
@import "~quill/dist/quill.snow.css";

.ql-editor {
  white-space: pre-wrap; 
}

.editor-image {
  display: inline-block;
  margin: 0 10px; 
  max-width: 45%;
  vertical-align: middle;
}

.textbox {
  position: absolute;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  padding: 10px;
  min-width: 100px;
  min-height: 50px;
  resize: both;
  overflow: auto;
  cursor: move;
}
</style>

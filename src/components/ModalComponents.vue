<template>
  <v-dialog v-model="showModal" max-width="800">
    <v-card>
      <v-card-title class="modal-header">
        <slot name="header">
        
        </slot>
       
      </v-card-title>
      <v-card-text>
        <slot name="body">
        
        </slot>
      </v-card-text>
      <v-card-actions>
        <slot name="footer">
          <v-btn @click="closeModal" color="primary">Mbyll</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalComponent',
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-header {
    background-image: linear-gradient(to right top, #4776d0, #0082cc, #008bc1, #0091b3, #3495a4);
  color: white;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  background-color: #f8f9fa; 
  padding: 10px 20px;
  text-align: right;
}

/* .v-dialog:not(.v-dialog--fullscreen) {
  max-width: 800px !important;
} */


</style>

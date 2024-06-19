<template>
    <button
      class="button-23"
      :class="{ 'button-disabled': disabled }"
      @click="handleClick"
      :disabled="disabled"
      ref="buttonRef"
    >
      {{ buttonText }}
    </button>
  </template>
  
  <script>
  export default {
    name: 'CustomButton',
    props: {
      buttonText: {
        type: String,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      handleClick() {
        if (!this.disabled) {
          console.log('Button clicked!');
        }
      },
    },
    mounted() {
      const button = this.$refs.buttonRef;
      const parent = button.parentElement;
      parent.style.position = 'relative';
      button.style.position = 'absolute';
      button.style.top = '10px'; 
      button.style.right = '10px'; 
    },
  };
  </script>
  
  <style scoped>
  .button-23 {
    background-color: #FFFFFF;
    border: 1px solid #00008B;
    border-radius: 8px;
    box-sizing: border-box;
    color: #222222;
    cursor: pointer;
    display: inline-block;
    font-family: 'Circular', -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 13px 23px;
    text-align: center;
    text-decoration: none;
    touch-action: manipulation;
    transition: box-shadow .2s, -ms-transform .1s, -webkit-transform .1s, transform .1s;
    user-select: none;
    -webkit-user-select: none;
    width: auto;
  }
  
  .button-23:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
  }
  
  .button-23:active {
    background-color: #F7F7F7;
    border-color: #00008B;
    transform: scale(.96);
  }
  
  .button-disabled {
    border-color: #00008B;
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 1;
  }
  </style>
  
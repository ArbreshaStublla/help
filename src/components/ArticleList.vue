<template>
  <v-container class="custom-container">
    <div class="container" :class="{ 'right-panel-active': activeTab === 'signup' }">
      <div class="form-container sign-up-container">
        <h1>Krijo Llogari</h1>
        <form @submit.prevent="registerUser">
          <input type="text" placeholder="Përdoruesi" v-model="signupData.username" required />
          <input type="email" placeholder="Email" v-model="signupData.email" required />
          <input type="password" placeholder="Fjalëkalimi" v-model="signupData.password" required />
          
          <label>Select Role:</label>
          <select v-model="signupData.roleId" required>
            <option value="1">Admin</option>
            <option value="2">User</option>
          </select>

          <button class="butoni" type="submit">Regjistrohu</button>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <h1>Kyçu</h1>
        <form @submit.prevent="loginUser">
          <input type="email" placeholder="Email" v-model="loginData.email" required />
          <input type="password" placeholder="Fjalëkalimi" v-model="loginData.password" required />
          <button class="butoni1" type="submit">Kyçu</button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <div class="image"><v-img class="little-image" :src="require('@/assets/cmd.png')"></v-img></div>
            <p>Për të qëndruar të lidhur me ne, identifikohuni me të dhënat tuaja personale</p>
            <button class="ghost" @click="toggleTab('login')">Kyçu</button>
          </div>
          <div class="overlay-panel overlay-right">
            <div class="image"><v-img class="little-image" :src="require('@/assets/cmd.png')"></v-img></div>
            <p>Shkruani të dhënat tuaja personale dhe filloni udhëtimin me ne</p>
            <button class="ghost" @click="toggleTab('signup')">Regjistrohu</button>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      activeTab: 'login',
      loginData: {
        email: '',
        password: ''
      },
      signupData: {
        username: '',
        email: '',
        password: '',
        roleId: '' // Role selection added here
      }
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await fetch('http://192.168.33.15:3000/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const users = await response.json();
        const { email, password } = this.loginData;
        const user = users.find(user => user.email === email);

        if (user) {
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (isPasswordMatch) {
            alert('Login successful!');
          } else {
            alert('Invalid password');
          }
        } else {
          alert('User not found');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Failed to login. Please try again.');
      }
    },
    async registerUser() {
      try {
        const response = await fetch('http://192.168.33.15:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.signupData)
        });

        if (!response.ok) {
          throw new Error('Failed to register user');
        }

        const responseData = await response.json();
        alert(responseData.message);

        // Clear form data after successful registration
        this.signupData.username = '';
        this.signupData.email = '';
        this.signupData.password = '';
        this.signupData.roleId = '';

        // Optionally, redirect to login page or another route
      } catch (error) {
        console.error('Error registering user:', error);
        alert('Failed to register user. Please try again.');
      }
    },
    toggleTab(tab) {
      this.activeTab = tab;
    }
  }
};
</script>



<style scoped>

.little-image{
  width: 250px;
  height: 250px;
  margin-bottom: 100px;
}

.small-image {
  width: 250px; 
  height: 250px; 
  margin-left: 67px;
}

.sign-up-container h1 {
  font-size: 25px;
}

.butoni{
  margin-top: 70px;
}

.butoni1{
  margin-top: 110px;
}
.overlay-left h1 {
  margin-top: 90px;
  font-size: 27px;
}


.image{
  height: 200px ;

}
h1 {
  font-weight: bold;
  margin: 0;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.sign-up-container h1 {
  display: none;
}

.right-panel-active .sign-up-container h1 {
  display: block;
}

.sign-in-container h1 {
  display: block;
}

.right-panel-active .sign-in-container h1 {
  display: none;
}

p {
  font-size: 16px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

button {
  border-radius: 20px;
  border: 1px solid #fff;
  background-image: linear-gradient(to right top, #b6e5ee, #8fe9ed, #64ece2, #3aedcc, #25edad);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}

form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 50px;
  height: calc(100% - 50px);
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background-image: linear-gradient(to right top, #add8e6, #8be1e7, #71e8d8, #72edba, #90ee90);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);

}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.custom-container {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}
</style>


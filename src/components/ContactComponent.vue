<template>
  <div class="contact-section">
    <div class="content">
      <div class="contact-header">
        <h1>Na kontaktoni</h1>
        <p>Dëshironi të na kontaktoni? Kemi dëshirë të dëgjojmë nga ju. Ja si mund të na kontaktoni.</p>
      </div>
      <div class="img1">
        <img :src="require('@/assets/magicpattern-blob-1719232533326.png')" alt="Blob Image">
      </div>
    </div>
    <div class="contact-options">
      <div class="contact-card">
        <div class="icon reversed-icon">
          <i class="fas fa-phone"></i>
        </div>
        <h2>Komunikoni me ne</h2>
        <p>A jeni të interesuar për më shumë? Thjesht telefononi për të biseduar me ne.</p>
        <a href="tel:+38344631998" target="_blank">+38344631998</a>
      </div>
      <div class="contact-card">
        <div class="icon">
          <i class="fas fa-comments"></i>
        </div>
        <h2>Kontaktoni Mbështetjen për Klientë</h2>
        <div class="social-icons">
          <a href="https://www.facebook.com/profile.php?id=61551479152730" target="_blank"><i class="fab fa-facebook-square"></i></a>
          <a href="https://www.instagram.com/cmdsoftwares/" target="_blank"><i class="fab fa-instagram"></i></a>
          <a href="mailto:info@cmd-ks.com" target="_blank"><i class="fas fa-envelope"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactSection",
};
</script>

<style scoped>
.contact-section {
  background-image: linear-gradient(to right top, #4776d0, #0082cc, #008bc1, #0091b3, #3495a4);
  background-repeat: no-repeat;
  background-position: right center; 
  background-size: auto 100%; 
  height: 70vh;
  color: #fff;
  text-align: center;
  position: relative;
}

.content {
  padding: 5%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 900px; 
  margin: 20px auto; 
}

.contact-header {
  text-align: left;
}

.contact-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #fff;
}

.contact-header p {
  font-size: 1.2em;
  color: #ccc;
}

.img1 {
  width: 80%;
  text-align: right; 
}

.img1 img {
  margin-top: -80px !important;
  width: 100%; 
  height: auto; 
}

.contact-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: -100px; 
}

.contact-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #183c84;
  padding: 20px;
  max-width: 350px;
  width: 100%; 
  text-align: left;
  color: #333;
}

.contact-card .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
}

.contact-card .reversed-icon {
  transform: rotate(100deg);
}

.contact-card h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.contact-card p {
  font-size: 1em;
  color: #666;
  margin-bottom: 20px;
}

.contact-card a {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  color: #0066cc;
  text-decoration: none;
  font-weight: bold;
}

.social-icons {
  margin-top: 10px;
  text-align: center;
}

.social-icons a {
  display: inline-block;
  margin-right: 10px;
  color: #666; 
  font-size: 1.5em; 
  transition: color 0.3s ease; 
}

.social-icons a:hover {
  color: #3b5998;
}

.social-icons a:nth-child(2):hover {
  color: #c32aa3;
}

.social-icons a:nth-child(3):hover {
  color: #dd4b39;
}
</style>

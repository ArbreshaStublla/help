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
        <a href="tel:+38344631998">+38344631998</a>
      </div>
      <div class="contact-card">
        <div class="icon">
          <i class="fas fa-comments"></i>
        </div>
        <h2>Kontaktoni Mbështetjen për Konsumatorë</h2>
        <div class="social-icons">
          <a href="https://www.facebook.com/profile.php?id=61551479152730"><i class="fab fa-facebook-square"></i></a>
          <a href="https://www.instagram.com/cmdsoftwares/"><i class="fab fa-instagram"></i></a>
          <a href="mailto:info@cmd-ks.com"><i class="fas fa-envelope"></i></a>
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
  background-image: linear-gradient(to right top, #0047ab, #104197, #183c84, #1d3671, #1f305e);
  background-repeat: no-repeat;
  background-position: right center; /* Position the blob image to the right */
  background-size: auto 100%; /* Adjust size as needed */
  height: 70vh;
  color: #fff;
  text-align: center;
  position: relative;
}

.content {
  padding: 5%;
  display: flex;
  justify-content: space-between; /* Space elements apart */
  align-items: flex-start; /* Center vertically */
  max-width: 900px; /* Adjust max width as needed */
  margin: 20px auto; /* Center content horizontally */
}

.contact-header {
  text-align: left; /* Align text to the left */
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
  width: 80%; /* Adjust width of image container */
  text-align: right; /* Align image to the right within its container */
}

.img1 img {
  margin-top: -80px !important;
  width: 100%; /* Make the image fill its container */
  height: auto; /* Maintain aspect ratio */
}

.contact-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: -100px; /* Add spacing from the content above */
}

.contact-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #183c84;
  padding: 20px;
  max-width: 350px; /* Increased max-width */
  width: 100%; /* Ensures the card takes the full width up to the max-width */
  text-align: left;
  color: #333;
}

.contact-card .icon {
  display: flex;
  justify-content: center;
  align-items: center; /* Center vertically */
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
}

.contact-card .reversed-icon {
  transform: rotate(100deg); /* Rotate the icon 180 degrees */
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
  display: block;
  margin-top: 10px;
  color: #0066cc;
  text-decoration: none;
  font-weight: bold;
}

.social-icons {
  margin-top: 10px;
  text-align: center; /* Center the social icons horizontally */
}

.social-icons a {
  display: inline-block;
  margin-right: 10px;
  color: #666; /* Default color */
  font-size: 1.5em; /* Adjust size */
  transition: color 0.3s ease; /* Smooth transition for color change */
}

.social-icons a:hover {
  color: #3b5998; /* Facebook blue */
}

.social-icons a:nth-child(2):hover {
  color: #c32aa3; /* Instagram gradient */
}

.social-icons a:nth-child(3):hover {
  color: #dd4b39; /* Gmail red */
}
</style>

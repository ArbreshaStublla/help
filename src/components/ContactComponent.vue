<template>
    <div class="contact-section">
      <div class="contact-header">
        <h1>Get in touch</h1>
        <p>Want to get in touch? We'd love to hear from you. Here's how you can reach us.</p>
      </div>
      <div class="contact-options">
        <div class="contact-card">
          <div class="icon">
            <i class="fas fa-phone"></i>
          </div>
          <h2>Talk to Sales</h2>
          <p>Interested in our software? Just pick up the phone to chat with a member of our sales team.</p>
          <a href="tel:+18578295060">+1 857 829 5060</a>
          <a href="#">View all global numbers</a>
        </div>
        <div class="contact-card">
          <div class="icon">
            <i class="fas fa-comments"></i>
          </div>
          <h2>Contact Customer Support</h2>
          <p>Sometimes you need a little help from your friends. Or a support rep. Don’t worry... we’re here for you.</p>
          <button>Contact Support</button>
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
    background-color: #1a1a1a; /* Dark blue background */
    color: #fff;
    padding: 40px;
    height: 45vh;
    text-align: center;
  }
  
  .contact-header {
    margin-bottom: 40px;
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
  
  .contact-options {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .contact-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 350px; /* Increased max-width */
    width: 100%; /* Ensures the card takes the full width up to the max-width */
    text-align: left;
    color: #333;
  }
  
  .contact-card .icon {
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
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
  
  .contact-card a,
  .contact-card button {
    display: block;
    margin-top: 10px;
    color: #0066cc;
    text-decoration: none;
    font-weight: bold;
  }
  
  .contact-card button {
    background-color: #ff5c35; /* Orange color for the button */
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .contact-card button:hover {
    background-color: #e14e24; /* Darker orange on hover */
  }
  </style>
  
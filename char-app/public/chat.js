const socket = io();
const username = localStorage.getItem('chatUsername') || 'Anonymous';
document.getElementById('user-display').textContent = username;

// Function to generate a unique color for each user based on their username
function generateColor(user) {
  const hash = user.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = '#' + ((hash >> 8) & 0xFFFFFF).toString(16).padStart(6, '0');
  return color;
}

// Generate color for the current user
const userColor = generateColor(username); 

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

// Event listener for submitting a message
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value.trim()) {
    const msg = {
      user: username,
      text: input.value.trim(),
      time: new Date().toLocaleTimeString(),
      color: userColor // Attach the user color to the message
    };
    socket.emit('chat message', msg); // Emit the message to the server
    input.value = ''; // Clear the input after sending
  }
});

// Listen for incoming chat messages and display them
socket.on('chat message', function (msg) {
  const item = document.createElement('li');
  item.className = msg.user === username ? 'own' : 'other'; // Style the sender's messages differently

  // Display the message with the user's color
  item.innerHTML = `
    <strong style="color:${msg.color}">${msg.user}</strong> [${msg.time}]: ${msg.text}
  `;
  messages.appendChild(item); // Append the message to the message list

  // Automatically scroll to the bottom of the chat
  messages.scrollTop = messages.scrollHeight;
});

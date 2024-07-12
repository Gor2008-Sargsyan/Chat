const socket = io();
const messagesContainer = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");

const params = new URLSearchParams(window.location.search);
const token = params.get("token");
console.log(token);

if (token) {
  localStorage.setItem("token", token);
}else{
  window.location.href="/?message=Please login to enter the chat&status=fail"
}

socket.emit("joinRoom", token);

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMsg", { msg, token });
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMsg(data) {
  const div = document.createElement("div");
  const container = document.querySelector(".chat-messages");
  div.classList.add("message");
  div.innerHTML = `<p class='meta'>${data.username}
<span>${data.time}</span></p><p class='text'>${data.message}</p>`;
  container.appendChild(div);
}
socket.on("message", (data) => {
  outputMsg(data);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

socket.on("redirect", (data) => {
  alert(data.msg);
  window.location.href = data.url;
});

const btn =  document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if(leaveRoom){
    window.location = '../index.html';
  }
});

socket.on('usersInRoom', (data) => {
  outputRoom(data.room);
  outputUsersList(data.usersList);
})

const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

function outputRoom(room) {
  roomName.innerText = room;
}

function outputUsersList(users){
  usersList.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}



const emojiPicker = document.getElementById("emoji-picker");
const emojiButton = document.querySelector(".emoji");

emojiButton.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "none" ? "flex" : "none";
});

emojiPicker.addEventListener("click", (e) => {
  if (e.target.classList.contains("emoji")) {
    const emoji = e.target.dataset.emoji;
    const msgInput = document.getElementById("msg");
    msgInput.value += emoji;
    msgInput.focus();
  }
});

document.addEventListener("click", (e) => {
  if (!emojiButton.contains(e.target) && !emojiPicker.contains(e.target)) {
    emojiPicker.style.display = "none";
  }
});
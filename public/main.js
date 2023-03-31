const chatWindow = document.querySelector('.chatWindow');
const chatMsg = document.getElementById('chatMsg');
const userToken = document.getElementById('userToken');
const chatView = document.getElementById('chatView');

// eslint-disable-next-line no-undef
// const socket = io.connect('http://localhost:8080', { forceNew: true });
const socket = io();

// Conecto al server
socket.emit('askData');

const showInfo = (data) => {
  const div = document.createElement('div');
  const obj2String = (data) => {
    if (typeof data === 'object') {
      return JSON.stringify(data)
    } else {
      return data
    }
  }
  div.innerHTML = `<ul>`;
  for (const key in data) {
    div.innerHTML += `<li>${key}: ${obj2String(data[key])}</li>`;
  }
  div.innerHTML += `</ul>`;
  div.classList.add('infoView');
  document.getElementById('infoView').appendChild(div);
};

const renderInfoView = () => {
  fetch('./api/info')
  .then((response) => response.json())
  .then((data) => showInfo(data));
};


// Mando token al server
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('chatUserToken', userToken.value);
});

// Mando mensaje al server
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const mensaje = {
    message: chatMsg.value
  };
  socket.emit('chatBotQuery', mensaje);
  chatMsg.value = '';
});

// Función para mostrar mensajes en el chat
const outputMessage = (message) => {
  const chatLine = document.createElement('p');
  chatLine.classList.add('chatMessage');
  chatLine.innerHTML = `
  <p>
  <span class="chatFrom">${message.from}: </span>
  <span class="chatText"> (${message.message})/</span>
  </p>
  `;
  chatWindow.appendChild(chatLine);
};

// Mando mensaje a ventana chat
socket.on('chatBotQuery', (data) => {
  console.log('entre al bot');
  outputMessage(data);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Muestro el historial de mensajes en la ventana de chat
socket.on('chatLog', (data) => {
  console.log(data);
  data.map((message) => {
    outputMessage(message);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

window.onload = () => {
  renderInfoView();
};

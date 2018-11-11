var sendBtn = document.getElementById('sendBtn');
var textInput = document.getElementById('textInput');
var textarea = document.getElementById('textArea');

sendBtn.onclick = function () {
    //take the message from textinput
    var message = textInput.value;

    //emit to the server
    socket.emit("chat", message);
    //clear the inputtext
    textInput.value = "";
    //get server emit form server

    addMymessage(message);
}

function addMymessage(message) {
    if (message != '') {
        var li = document.createElement('li');
        var outsideDiv = document.createElement('div');
        outsideDiv.className = "outsideDiv";
        li.innerHTML = message;
        li.className = "mymessage ";
        outsideDiv.appendChild(li);
        textarea.appendChild(outsideDiv);

    }

}

function addOthermessage(message) {
    if (message != '') {
        var li = document.createElement('li');
        var outsideDiv = document.createElement('div');
        outsideDiv.className = "outsideDiv";
        li.innerHTML = message;
        li.className = "othermessage ";
        outsideDiv.appendChild(li);
        textarea.appendChild(outsideDiv);
    }

}


socket.on('chat', function (chat) {
    console.log("message on ");
    addOthermessage(chat);
});


textInput.addEventListener("keyup", function (event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        console.log("adasds");

        document.getElementById("sendBtn").click();
    }
});
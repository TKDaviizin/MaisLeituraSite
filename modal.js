
var modal = document.getElementById("login-modal");
var btn = document.getElementById("open-modal-btn");
var span = document.getElementsByClassName("close-button")[0];

// Quando o usuário clica no botão, o modal aparece
btn.onclick = function() {
  modal.style.display = "block";
}

// Quando o usuário clica no "x", o modal fecha
span.onclick = function() {
  modal.style.display = "none";
}

// Quando o usuário clica fora do modal, ele fecha
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
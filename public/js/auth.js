const miFormulario = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
            ? "http://localhost:8080/api/auth/"
            : "https://restserver-node-fefca7921dc0.herokuapp.com//api/auth/";

miFormulario.addEventListener('submit', ev => {
  ev.preventDefault();
  const formData = {};

  for (let el of miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }
  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(resp => resp.json())
    .then( ({msg, token}) => {
      if(msg) {
        return console.log(msg);
      }
      localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
      console.log(err);
    });
});

// Handler for the Google Sign-In response
function onSignIn(response) {
  if (response.credential) {
    const id_token = response.credential;
    const data = { id_token };

    fetch(url + 'google', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ token }) => {
        localStorage.setItem('token', token);
        window.location = 'chat.html';
      
      })
      .catch((error) => console.error("Error:", error));
  } else {
    console.error("No credential found");
  }
}

// Sign-out function
function signOut() {
  google.accounts.id.revoke(localStorage.getItem("token"), (done) => {
    console.log("User signed out.");
    localStorage.clear();
    location.reload();
  });
}

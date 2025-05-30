class LoginManual {
  constructor() {
    this.doLogin = this.doLogin.bind(this);
    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', this.doLogin);
  }
    doLogin(event) {
    console.log("Enviando login...")
    event.preventDefault();
    const loginUsername = document.querySelector("#username").value;
    const loginPassword = document.querySelector("#password").value;

    const loginBody = {
        username: loginUsername,
        password: loginPassword
    };

    const fetchOptions = {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginBody)
    };

    fetch('/loginmanual', fetchOptions)
        .then(async response => {
            if (!response.ok) {
            const error = await response.json();
            alert(error.mensaje);  // muestra mensaje si las credenciales están mal
            return;
            }
            window.location.href = '/'; // si fue exitoso, redirige
        })
        .catch(error => {
            console.error("Error en la solicitud de login:", error);
            alert("Hubo un error al intentar iniciar sesión.");
        });
        }

}

new LoginManual();

console.log("register cargado")

class Register {
  constructor() {
    this.doRegister = this.doRegister.bind(this);
    const registerForm = document.querySelector('#register-form');
    registerForm.addEventListener('submit', this.doRegister);
  }

  async doRegister(event) {
    event.preventDefault();
    const registerUsername = document.querySelector("#reg-username").value;
    const registerPassword = document.querySelector("#reg-password").value;

    const registerBody = {
      username: registerUsername,
      password: registerPassword
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerBody)
    };

    try {
      const res = await fetch('/register/', fetchOptions);
      if (res.ok) {
    window.location.href = '/login'; // redirige al login si todo va bien
  } else {
    const errRes = await res.json();
    alert('Error al registrarse');
  }
} catch (err) {
  alert('No se pudo conectar con el servidor');
}
  }
}

new Register();

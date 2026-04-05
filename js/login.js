let listUsers = JSON.parse(localStorage.getItem("users")) || [];
function signIn() {
    const inputEmail = document.querySelector(".login-email");
    const inputPassword = document.querySelector(".login-password");
    const errorEmail = document.querySelector(".error-email");
    const errorPassword = document.querySelector(".error-password");
    const msgSuccess = document.querySelector(".msg-success");
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    inputEmail.classList.remove("input-error");
    inputPassword.classList.remove("input-error");
    errorEmail.classList.remove("show");
    errorPassword.classList.remove("show");
    msgSuccess.classList.remove("show");
    inputEmail.style.borderColor = "#E5E7EB";
    inputPassword.style.borderColor = "#E5E7EB";
    let isValid = true;
    if(email === "") {
        errorEmail.innerText = "Please enter your email ...";
        errorEmail.classList.add("show");
        inputEmail.style.borderColor = "#FF0004";
        inputEmail.classList.add("input-error");
        isValid = false;
    } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        errorEmail.innerText = "Incorrect email or password!";
        errorEmail.classList.add("show");
        inputEmail.style.borderColor = "#FF0004";
        inputEmail.classList.add("input-error");
        isValid = false;
    }
    if(password === "") {
        errorPassword.innerText = "Please enter your password ...";
        errorPassword.classList.add("show");
        inputPassword.style.borderColor = "#FF0004";
        inputPassword.classList.add("input-error");
        isValid = false;
    }
    if(isValid) {
        let findUser = listUsers.find((user) => {
            return user.email === email && user.password === password;
        });
        if(findUser) {
            localStorage.setItem("currentUser", JSON.stringify(findUser));
            msgSuccess.innerText = "Sign In Successfully";
            msgSuccess.classList.add("show");
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1500);
        } else {
            errorPassword.innerText = "Incorrect email or password!";
            errorPassword.classList.add("show");
            inputPassword.style.borderColor = "#FF0004";
        }
    }
}
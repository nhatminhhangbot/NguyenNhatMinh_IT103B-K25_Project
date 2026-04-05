let listUsers = JSON.parse(localStorage.getItem("users")) || [];
function signUp() {
    const inputEmail = document.querySelector(".register-email");
    const inputPassword = document.querySelector(".register-password");
    const inputConfirmPassword = document.querySelector(".register-confirm-password");
    const errorEmail = document.querySelector(".error-email");
    const errorPassword = document.querySelector(".error-password");
    const errorConfirmPassword = document.querySelector(".error-confirm-password");
    const msgSuccess = document.querySelector(".msg-success");
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;
    inputEmail.classList.remove("input-error");
    inputPassword.classList.remove("input-error");
    inputConfirmPassword.classList.remove("input-error");
    errorEmail.classList.remove("show");
    errorPassword.classList.remove("show");
    errorConfirmPassword.classList.remove("show");
    msgSuccess.classList.remove("show");
    inputEmail.style.borderColor = "#E5E7EB";
    inputPassword.style.borderColor = "#E5E7EB";
    inputConfirmPassword.style.borderColor = "#E5E7EB";
    let isValid = true;
    if(email === "") {
        errorEmail.innerText = "Please enter your email ...";
        errorEmail.classList.add("show");
        inputEmail.style.borderColor = "#FF0004";
        inputEmail.classList.add("input-error");
        isValid = false; 
    } else if(email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        errorEmail.innerText = "Email format is invalid!";
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
    } else if(password.length < 6) {
        errorPassword.innerText = "Password must be at least 6 characters!";
        errorPassword.classList.add("show");
        inputPassword.style.borderColor = "#FF0004";
        inputPassword.classList.add("input-error");
        isValid = false;
    }
    if(confirmPassword === "") {
        errorConfirmPassword.innerText = "Please enter your confirm password ...";
        errorConfirmPassword.classList.add("show");
        inputConfirmPassword.style.borderColor = "#FF0004";
        inputConfirmPassword.classList.add("input-error");
        isValid = false;
    } else if(password !== confirmPassword) {
        errorConfirmPassword.innerText = "Confirm password does not match!";
        errorConfirmPassword.classList.add("show");
        inputConfirmPassword.style.borderColor = "#FF0004";
        inputConfirmPassword.classList.add("input-error");
        isValid = false;
    }
    if(isValid) {
        let newUser = { 
            email: email, 
            password: password 
        };
        listUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(listUsers));
        msgSuccess.innerText = "Sign Up Successfully";
        msgSuccess.classList.add("show");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    }
};
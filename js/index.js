const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownContent = document.querySelector(".dropdown-content");
const btnLogout = document.querySelector(".btn-logout");
function toggleDropdown() {
    dropdownContent.classList.toggle("show-dropdown");
}
function logOut() {
    let isConfirm = confirm("Bạn có chắc muốn đăng xuất?");
    if(isConfirm) {
        localStorage.removeItem("currentUser");
        window.location.href = "./pages/login.html";
    }
}
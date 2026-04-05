let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) {
    window.location.href = "./pages/login.html";
}
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownContent = document.querySelector(".dropdown-content");
const btnLogout = document.querySelector(".btn-logout");
function toggleDropdown() {
    dropdownContent.classList.toggle("show-dropdown");
}
function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}
function showAlert(title, message, type = 'info', confirmCallback = null) {
    const modal = document.getElementById("customAlert");
    const titleEl = document.getElementById("alertTitle");
    const msgEl = document.getElementById("alertMessage");
    const actionEl = document.getElementById("alertActions");
    titleEl.innerText = title;
    msgEl.innerText = message;
    if(type === 'confirm') {
        actionEl.innerHTML = `
            <button onclick="closeAlert()" class="btn-modal btn-cancel">Hủy</button>
            <button id="modalConfirmBtn" class="btn-modal ${title === 'Cảnh báo' ? 'btn-danger' : 'btn-confirm'}">Xác nhận</button>
        `;
        document.getElementById("modalConfirmBtn").onclick = () => {
            if (confirmCallback) confirmCallback();
            closeAlert();
        };
    } else {
        actionEl.innerHTML = `<button onclick="closeAlert()" class="btn-modal btn-confirm">OK</button>`;
    }
    modal.style.display = "flex";
}
function logOut() {
    showAlert("Cảnh báo", "Bạn có chắc muốn đăng xuất?", "confirm", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "./pages/login.html";
    });
}
const monthInput = document.querySelector(".month-box input");
const categoryName = document.querySelector(".category-name");
const categoryLimit = document.querySelector(".category-limit");
const categoriesList = document.querySelector(".categories-list");
const displayRemaining = document.querySelector(".remaining-box p:last-child");
let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || {};
let monthlyBudgets = JSON.parse(localStorage.getItem("monthlyBudgets")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editingId = null;
function displayRemainingBalance() {
    let selectedMonth = monthInput.value;
    let budgetData = monthlyBudgets.find(item => item.month === selectedMonth);
    let budgetAmount = budgetData ? Number(budgetData.budget) : 0;
    let totalSpent = transactions
        .filter(t => t.month === selectedMonth)
        .reduce((sum, t) => sum + Number(t.total), 0);
    let remaining = budgetAmount - totalSpent;
    if(displayRemaining) {
        displayRemaining.innerText = `${remaining.toLocaleString('vi-VN')} VND`;
    }
}
function renderCategories() {
    let selectedMonth = monthInput.value;
    let currentCategories = monthlyCategories[selectedMonth] || [];
    let html = "";
    displayRemainingBalance();
    for(let i = 0; i < currentCategories.length; i += 3) {
        html += `<div class="first-row-list">`;
        for(let j = i; j < i + 3 && j < currentCategories.length; j++) {
            let item = currentCategories[j];
            html += `
                <div class="category-item">
                    <img src="../assets/icons/Frame 5.png" class="item-icon">
                    <div class="item-content">
                        <span>${item.name}</span>
                        <p>${Number(item.limit).toLocaleString('vi-VN')} $</p>
                    </div>
                    <div class="item-actions">
                        <img src="../assets/icons/Close.png" class="btn-x" onclick="deleteCategory(${item.id})">
                        <img src="../assets/icons/Mode edit.png" class="btn-edit" onclick="openEditModal(${item.id})">
                    </div>
                </div>`;
        }
        html += `</div>`;
    }
    categoriesList.innerHTML = html;
}
function addCategory() {
    let selectedMonth = monthInput.value;
    let name = categoryName.value.trim();
    let limit = categoryLimit.value.trim();
    if(name === "" || limit === "") {
        showAlert("Thông báo", "Vui lòng nhập đầy đủ tên và số tiền!");
        return;
    }
    if(!monthlyCategories[selectedMonth]) {
        monthlyCategories[selectedMonth] = [];
    }
    let currentList = monthlyCategories[selectedMonth];
    let newId = currentList.length > 0 ? currentList[currentList.length - 1].id + 1 : 1;
    let newCategory = {
        id: newId,
        name: name,
        limit: Number(limit),
    }
    monthlyCategories[selectedMonth].push(newCategory);
    localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
    renderCategories();
    categoryName.value = "";
    categoryLimit.value = "";
}
monthInput.addEventListener("change", renderCategories);
renderCategories();
function openEditModal(id) {
    let selectedMonth = monthInput.value;
    let item = monthlyCategories[selectedMonth].find(i => i.id === id);
    if(item) {
        editingId = id;
        document.getElementById("editCategoryName").value = item.name;
        document.getElementById("editCategoryLimit").value = item.limit;
        document.getElementById("editModal").style.display = "flex";
    }
}
function editCategory() {
    let selectedMonth = monthInput.value;
    let newName = document.getElementById("editCategoryName").value.trim();
    let newLimit = document.getElementById("editCategoryLimit").value.trim();
    if(newName === "" || newLimit === "") {
        showAlert("Thông báo", "Vui lòng nhập đầy đủ tên và số tiền!");
        return;
    }
    let index = monthlyCategories[selectedMonth].findIndex(i => i.id === editingId);
    if(index !== -1) {
        monthlyCategories[selectedMonth][index].name = newName;
        monthlyCategories[selectedMonth][index].limit = Number(newLimit);
        localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
        renderCategories();
        closeEditModal();
    }
}
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
    editingId = null;
}
function deleteCategory(id) {
    let selectedMonth = monthInput.value;
    showAlert("Xác nhận", "Bạn có chắc muốn xóa danh mục này?", "confirm", () => {
        monthlyCategories[selectedMonth] = monthlyCategories[selectedMonth].filter(item => item.id !== id);
        monthlyCategories[selectedMonth].forEach((item, index) => {
            item.id = index + 1;
        });
        localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
        renderCategories();
    });
}
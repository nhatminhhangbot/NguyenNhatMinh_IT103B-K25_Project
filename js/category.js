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
            if(confirmCallback) {
                confirmCallback();
            }
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
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || [];
let monthlyBudgets = JSON.parse(localStorage.getItem("monthlyBudgets")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editingId = null;
function displayRemainingBalance() {
    let selectedMonth = monthInput.value;
    let monthData = monthlyCategories.find(item => item.month === selectedMonth);
    let currentCategories = monthData ? monthData.categories : [];
    let totalBudget = currentCategories.reduce((sum, item) => sum + Number(item.budget), 0);
    let totalSpent = transactions
        .filter(t => t.createdMonth === selectedMonth) 
        .reduce((sum, t) => sum + Number(t.total), 0);
    let remaining = totalBudget - totalSpent;
    if(displayRemaining) {
        displayRemaining.innerText = `${remaining.toLocaleString('vi-VN')} VND`;
        if(remaining < 0) {
            displayRemaining.style.color = "#EF4444";
        } else {
            displayRemaining.style.color = "#22C55E";
        }
    }
    if(monthData) {
        monthData.totalBudget = totalBudget;
        localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
    }
}
function renderCategories() {
    let selectedMonth = monthInput.value;
    let monthData = monthlyCategories.find(item => item.month === selectedMonth);
    let currentList = monthData ? monthData.categories : [];
    let html = "";
    displayRemainingBalance();
    for(let i = 0; i < currentList.length; i += 3) {
        html += `<div class="first-row-list">`;
        for(let j = i; j < i + 3 && j < currentList.length; j++) {
            let item = currentList[j];
            let originalCat = categories.find(c => c.id === item.categoryId);
            let displayName = originalCat ? originalCat.name : "N/A";
            html += `
                <div class="category-item">
                    <img src="../assets/icons/Frame 5.png" class="item-icon">
                    <div class="item-content">
                        <span>${displayName}</span>
                        <p>${Number(item.budget).toLocaleString('vi-VN')} $</p>
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
    let categoryExist = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    let categoryId;
    if(!categoryExist) {
        categoryId = categories.length > 0 ? categories[categories.length - 1].id + 1 : 1;
        categories.push({
            id: categoryId,
            name: name,
            imageUrl: "đường dẫn ảnh",
            status: true
        });
        localStorage.setItem("categories", JSON.stringify(categories));
    } else {
        categoryId = categoryExist.id;
    }
    let monthData = monthlyCategories.find(m => m.month === selectedMonth);
    let budgetInfo = monthlyBudgets.find(b => b.month === selectedMonth);
    let totalBudget = budgetInfo ? Number(budgetInfo.budget) : 0;
    if(!monthData) {
        monthData = {
            id: monthlyCategories.length > 0 ? monthlyCategories[monthlyCategories.length - 1].id + 1 : 1,
            month: selectedMonth,
            userId: currentUser.id || 1,
            totalBudget: totalBudget,
            categories: []
        };
        monthlyCategories.push(monthData);
    }
    let newSubId = monthData.categories.length > 0 ? monthData.categories[monthData.categories.length - 1].id + 1 : 1;
    monthData.categories.push({
        id: newSubId,
        categoryId: categoryId,
        budget: limit
    });
    localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
    renderCategories();
    categoryName.value = "";
    categoryLimit.value = "";
}
monthInput.addEventListener("change", renderCategories);
renderCategories();
function openEditModal(id) {
    let selectedMonth = monthInput.value;
    let monthData = monthlyCategories.find(m => m.month === selectedMonth);
    if(!monthData) {
       return; 
    }
    let item = monthData.categories.find(i => i.id === id); 
    if(item) {
        editingId = id;
        let originalCategory = categories.find(c => c.id === item.categoryId);
        document.getElementById("editCategoryName").value = originalCategory ? originalCategory.name : "";
        document.getElementById("editCategoryLimit").value = item.budget;
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
    let monthData = monthlyCategories.find(m => m.month === selectedMonth);
    if(!monthData) {
       return; 
    }
    let index = monthlyCategories[selectedMonth].findIndex(i => i.id === editingId);
    if(index !== -1) {
        monthData.categories[index].budget = Number(newLimit);
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
        let monthData = monthlyCategories.find(m => m.month === selectedMonth);
        if(monthData) {
            monthData.categories = monthData.categories.filter(item => item.id !== id);
            localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
            renderCategories();
            setTimeout(() => {
                showAlert("Thành công", "Đã xóa giao dịch thành công!", "info");
            });
        }
    });
}
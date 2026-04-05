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
const amountInput = document.querySelector(".input-amount");
const categorySelect = document.querySelector(".input-category-select"); 
const noteInput = document.querySelector(".input-note");  
const btnAdd = document.querySelector(".btn-add-spending");
const displayRemaining = document.querySelector(".remaining-box p:last-child");
const tableBody = document.querySelector("#history-table-body");
let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || {};
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
function renderCategories() {
    let selectedMonth = monthInput.value;
    let list = monthlyCategories[selectedMonth] || [];
    categorySelect.innerHTML = '<option value="" disabled selected>Danh mục chi tiêu</option>';
    list.forEach(item => {
        categorySelect.innerHTML += `<option value="${item.id}">${item.name}</option>`;
    });
}
function addSpending(e) {
    e.preventDefault();
    let month = monthInput.value;
    let amount = Number(amountInput.value);
    let note = noteInput.value;
    let categoryId = Number(categorySelect.value);
    let categoryName = categorySelect.options[categorySelect.selectedIndex].text;
    if(!amount || !note) {
        showAlert("Thông báo", "Vui lòng nhập đầy đủ số tiền và ghi chú!");
        return;
    }
    if(categorySelect.value === "") {
        showAlert("Thông báo", "Vui lòng chọn danh mục chi tiêu!");
        return;
    }
    let newId = transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1;
    let newTransaction = {
        id: newId,
        month: month,
        total: amount,
        description: note,
        categoryId: categoryId,
        categoryName: categoryName
    };
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    amountInput.value = "";
    noteInput.value = "";
    renderHistory();
}
function renderHistory() {
    let selectedMonth = monthInput.value;
    let monthlyBudgets = JSON.parse(localStorage.getItem("monthlyBudgets")) || [];
    let currentBudgetObj = monthlyBudgets.find(b => b.month === selectedMonth);
    let budgetLimit = currentBudgetObj ? Number(currentBudgetObj.budget) : 0;
    let html = "";
    let totalSpentInMonth = 0;
    let filtered = transactions.filter(t => t.month === selectedMonth);
    filtered.forEach((t, index) => {
        totalSpentInMonth += t.total;
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${t.categoryName}</td>
                <td>${t.total.toLocaleString()} $</td>
                <td>${t.description}</td>
                <td><img src="../assets/icons/Trash.png" onclick="deleteTransaction(${t.id})" alt=""></td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
    let balance = budgetLimit - totalSpentInMonth;
    displayRemaining.innerText = balance.toLocaleString('vi-VN') + " VND";
}
function deleteTransaction(id) {
    showAlert("Cảnh báo", "Bạn có chắc muốn xóa giao dịch này?", "confirm", () => {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderHistory();
    });
}
function changeMonth() {
    renderCategories();
    renderHistory();
}
renderCategories();
renderHistory();
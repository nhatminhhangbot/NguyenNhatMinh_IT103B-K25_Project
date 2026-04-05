let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) {
    window.location.href = "./pages/login.html";
}
let monthlyBudgets = JSON.parse(localStorage.getItem("monthlyBudgets")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownContent = document.querySelector(".dropdown-content");
const btnLogout = document.querySelector(".btn-logout");
const monthInput = document.querySelector(".month-box input");
const budgetInput = document.querySelector(".month-budget-box input");
const saveBtn = document.querySelector(".month-budget-box button");
const displayRemaining = document.querySelector(".remaining-box p:last-child");
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
function getBudgetByMonth(month) {
    return monthlyBudgets.find(item => item.month === month);
}
function totalSpentByMonth(month) {
    let totalSpent = 0;
    for(let i = 0; i < transactions.length; i++) {
        let t = transactions[i];
        if(t.month === month) { 
            totalSpent = totalSpent + Number(t.total);
        }
    }
    return totalSpent;
}
function renderFinancialData() {
    let selectedMonth = monthInput.value;
    let budgetData = getBudgetByMonth(selectedMonth);
    let spentAmount = totalSpentByMonth(selectedMonth);
    if(budgetData) {
        let budget = Number(budgetData.budget);
        let remaining = budget - spentAmount;
        budgetInput.value = budget;
        displayRemaining.innerText = `${remaining.toLocaleString('vi-VN')} VND`;
    } else {
        budgetInput.value = "";
        displayRemaining.innerText = "0 VND";
    }
}
function saveBudget() {
    let selectedMonth = monthInput.value;
    let budgetValue = budgetInput.value.trim();
    if(budgetValue === "") {
        showAlert("Thông báo", "Bạn chưa nhập ngân sách tháng này! Vui lòng nhập ngân sách.");
        return;
    }
    const index = monthlyBudgets.findIndex(item => item.month === selectedMonth);
    if(index !== -1) {
        monthlyBudgets[index].budget = Number(budgetValue);
    } else {
        monthlyBudgets.push({
            month: selectedMonth,
            budget: Number(budgetValue)
        });
    }
    localStorage.setItem("monthlyBudgets", JSON.stringify(monthlyBudgets));
    showAlert("Thành công", `Đã lưu ngân sách cho tháng ${selectedMonth}`);
    renderFinancialData();
}
monthInput.addEventListener("change", renderFinancialData);
saveBtn.addEventListener("click", saveBudget);
window.onload = renderFinancialData;
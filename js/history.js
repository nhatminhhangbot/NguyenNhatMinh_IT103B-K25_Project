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
let currentPage = 1;
const rowsPerPage = 5;
const monthInput = document.querySelector(".month-box input"); 
const amountInput = document.querySelector(".input-amount");
const categorySelect = document.querySelector(".input-category-select"); 
const noteInput = document.querySelector(".input-note");  
const btnAdd = document.querySelector(".btn-add-spending");
const displayRemaining = document.querySelector(".remaining-box p:last-child");
const tableBody = document.querySelector("#history-table-body");
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
function renderCategories() {
    let selectedMonth = monthInput.value;
    let monthData = monthlyCategories.find(item => item.month === selectedMonth);
    let currentList = monthData ? monthData.categories : [];
    categorySelect.innerHTML = '<option value="" disabled selected>Danh mục chi tiêu</option>';
    currentList.forEach(item => {
        let category = categories.find(c => c.id === item.categoryId);
        let name = category ? category.name : "Không xác định";
        categorySelect.innerHTML += `<option value="${item.id}">${name}</option>`;
    });
}
function addSpending(e) {
    e.preventDefault();
    let month = monthInput.value;
    let amount = Number(amountInput.value);
    let note = noteInput.value;
    let selectedMonth = monthInput.value;
    let monthlyCategoryId = Number(categorySelect.value);
    let monthDataObj = monthlyCategories.find(item => item.month === selectedMonth);
    let monthData = monthDataObj ? monthDataObj.categories : [];
    let currentCategory = monthData.find(c => Number(c.id) === monthlyCategoryId);
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
        userId: currentUser.id,
        createdMonth: month,
        total: amount,
        description: note,
        categoryId: currentCategory ? currentCategory.categoryId : null,
        monthlyCategoryId: monthlyCategoryId
    };
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    amountInput.value = "";
    noteInput.value = "";
    renderHistory();
}
function renderHistory() {
    let selectedMonth = monthInput.value;
    let searchValue = document.querySelector(".search-box input").value.toLowerCase();
    let sortValue = document.querySelector(".sort-by-price").value;
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let categories = JSON.parse(localStorage.getItem("categories")) || [];
    let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || [];
    let monthDataObj = monthlyCategories.find(item => item.month === selectedMonth);
    let currentMonthlyCategories = monthDataObj ? monthDataObj.categories : [];
    let budgetLimit = currentMonthlyCategories.reduce((sum, item) => sum + Number(item.budget), 0);
    let filtered = transactions.filter(t => 
        t.createdMonth === selectedMonth && 
        t.userId === currentUser.id &&
        t.description.toLowerCase().includes(searchValue)
    );
    if(sortValue === "asc") {
        filtered.sort((a, b) => a.total - b.total);
    } else if(sortValue === "desc") {
        filtered.sort((a, b) => b.total - a.total);
    }
    let totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    if(currentPage > totalPages) {
        currentPage = totalPages;
    }
    let start = (currentPage - 1) * rowsPerPage;
    let paginatedItems = filtered.slice(start, start + rowsPerPage);
    let html = paginatedItems.map((t, index) => {
        let categoryInfo = currentMonthlyCategories.find(c => Number(c.id) === Number(t.monthlyCategoryId));
        let category = categoryInfo ? categories.find(c => c.id === categoryInfo.categoryId) : null;
        return `
            <tr>
                <td>${start + index + 1}</td>
                <td>${category ? category.name : "N/A"}</td>
                <td>${Number(t.total).toLocaleString('vi-VN')} $</td>
                <td>${t.description}</td>
                <td><img src="../assets/icons/Trash.png" onclick="deleteTransaction(${t.id})" style="cursor:pointer"></td>
            </tr>`;
    }).join("");
    tableBody.innerHTML = html;
    let totalSpent = filtered.reduce((sum, t) => sum + Number(t.total), 0);
    let balance = budgetLimit - totalSpent;
    displayRemaining.innerText = balance.toLocaleString('vi-VN') + " VND";
    renderPagination(totalPages);
}
function renderPagination(totalPages) {
    let container = document.querySelector("#pagination-controls");
    if(!container) {
        return;
    }
    let html = "";
    html += `
        <button class="page-nav" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <img src="../assets/icons/arrow left.png" alt="Prev">
        </button>
    `;
    for(let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-number ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    html += `
        <button class="page-nav" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <img src="../assets/icons/arrow right.png" alt="Next">
        </button>
    `;
    container.innerHTML = html;
}
function changePage(page) {
    currentPage = page;
    renderHistory();
}
function deleteTransaction(id) {
    showAlert("Cảnh báo", "Bạn có chắc muốn xóa giao dịch này?", "confirm", () => {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderHistory();
    });
}
document.querySelector(".search-box input").oninput = () => { 
    currentPage = 1; 
    renderHistory(); 
};
document.querySelector(".sort-by-price").onchange = () => renderHistory();
function changeMonth() {
    currentPage = 1;
    renderCategories();
    renderHistory();
}
renderCategories();
renderHistory();
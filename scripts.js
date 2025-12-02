let balance = 100000;
let transactions = [];
let currentTab = 'deposit';

function switchTab(tab) {
    currentTab = tab;
    const depositForm = document.getElementById('depositForm');
    const withdrawForm = document.getElementById('withdrawForm');
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => btn.classList.remove('active'));

    if (tab === 'deposit') {
        depositForm.style.display = 'block';
        withdrawForm.style.display = 'none';
        tabBtns[0].classList.add('active');
    } else {
        depositForm.style.display = 'none';
        withdrawForm.style.display = 'block';
        tabBtns[1].classList.add('active');
    }

    hideMessage();
}

function updateBalance() {
    const balanceElement = document.getElementById('balanceAmount');
    balanceElement.textContent = '₹' + balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    updateLastUpdated();
}

function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    const now = new Date();
    lastUpdatedElement.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';

    setTimeout(() => {
        hideMessage();
    }, 5000);
}

function hideMessage() {
    const messageElement = document.getElementById('message');
    messageElement.style.display = 'none';
}

function addTransaction(type, amount) {
    const transaction = {
        type: type,
        amount: amount,
        date: new Date().toLocaleString()
    };
    transactions.unshift(transaction);

    if (transactions.length > 5) {
        transactions = transactions.slice(0, 5);
    }

    updateTransactionList();
}

function updateTransactionList() {
    const transactionList = document.getElementById('transactionList');
    
    if (transactions.length === 0) {
        transactionList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No transactions yet</p>';
        return;
    }

    transactionList.innerHTML = transactions.map(t => `
        <div class="transaction-item">
            <div>
                <div class="transaction-type ${t.type}">${t.type.toUpperCase()}</div>
                <div style="font-size: 12px; color: #666;">${t.date}</div>
            </div>
            <div class="transaction-amount" style="color: ${t.type === 'deposit' ? '#11998e' : '#ee0979'}">
                ${t.type === 'deposit' ? '+' : '-'}₹${t.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

document.getElementById('depositForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const amountInput = document.getElementById('depositAmount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showMessage('Please enter a valid positive amount', 'error');
        return;
    }

    if (amount > 1000000) {
        showMessage('Deposit amount cannot exceed ₹10,00,000', 'error');
        return;
    }

    balance += amount;
    updateBalance();
    addTransaction('deposit', amount);
    showMessage(`Successfully deposited ₹${amount.toFixed(2)}`, 'success');
    amountInput.value = '';
});

document.getElementById('withdrawForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const amountInput = document.getElementById('withdrawAmount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showMessage('Please enter a valid positive amount', 'error');
        return;
    }

    if (amount > balance) {
        showMessage('Insufficient balance! Cannot withdraw ₹' + amount.toFixed(2), 'error');
        return;
    }

    if (amount > 100000) {
        showMessage('Withdrawal amount cannot exceed ₹1,00,000 per transaction', 'error');
        return;
    }

    balance -= amount;
    updateBalance();
    addTransaction('withdraw', amount);
    showMessage(`Successfully withdrawn ₹${amount.toFixed(2)}`, 'success');
    amountInput.value = '';
});
    
updateBalance();
updateTransactionList();

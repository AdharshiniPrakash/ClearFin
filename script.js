window.onload = function () {
  displayTransactions();
  updateTxnDisplay();
};

function displayTransactions(filterType) {
  var txnData = JSON.parse(localStorage.getItem("transactions")) || [];
  if (txnData.length === 0) {
    clearTable();
    return;
  }

  var tableBody = document.getElementById("trnxTable");
  tableBody.innerHTML = "";

  if (filterType === "new") {
    txnData.sort(function (a, b) {
       console.log( new Date(b.timeStamp));
       console.log( new Date(b.timeStamp) - new Date(a.timeStamp));
      return new Date(b.timeStamp) - new Date(a.timeStamp);
    });
  } else if (filterType === "old") {
    txnData.sort(function (a, b) {
      return new Date(a.timeStamp) - new Date(b.timeStamp);
    });
  }

  txnData.forEach(function (txn, index) {
    if (!filterType || txn.type === filterType || filterType === "all" || filterType === "new" || filterType === "old") {
      
      const root = document.createElement("div");
      root.className = "my-2 flex flex-wrap lg:flex-nowrap justify-between items-center p-4 rounded-md lg:rounded-none border-2 border-slate-200 lg:border-0";

      const left = document.createElement("div");
      left.className = "order-1 w-[90%] lg:w-1/3 text-left flex items-center gap-2";

      var iconSrc =
        txn.type === "income"
          ? "resources/income.svg"
          : "resources/expense.svg";

      const iconWrap = document.createElement("div");
      const iconImg = document.createElement("img");
      iconImg.src = iconSrc;
      iconImg.alt = "";
      iconWrap.appendChild(iconImg);

      const meta = document.createElement("div");
      const titleEl = document.createElement("div");
      titleEl.className = "font-semibold text-md lg:min-w-0 overflow-hidden text-ellipsis";
      titleEl.textContent = txn.description;

      const dateEl = document.createElement("div");
      dateEl.className = "text-sm text-gray-600";
      dateEl.textContent = txn.time + (txn.edited ? " (edited)" : "");

      meta.appendChild(titleEl);
      meta.appendChild(dateEl);

      left.appendChild(iconWrap);
      left.appendChild(meta);

      const categoryEl = document.createElement("div");
      categoryEl.className = "text-left order-3 mt-5 lg:w-1/6 lg:m-0 lg:order-2 text-base";
      categoryEl.textContent = txn.category;

      const tagEl = document.createElement("div");
      tagEl.className = "hidden lg:block relative lg:w-1/6 lg:order-3 text-left text-base before:content-[''] before:absolute before:top-2 before:-left-4 before:aspect-square before:w-2 before:rounded-full before:bg-dark-" +
        txn.type;
      tagEl.textContent = txn.type.charAt(0).toUpperCase() + txn.type.slice(1);

      const amountEl = document.createElement("div");
      amountEl.className = "order-4 lg:order-4 mt-5 lg:m-0 lg:w-1/7 text-right font-semibold text-lg";
      amountEl.textContent = txn.amount;

      const optionsEl = document.createElement("div");
      optionsEl.className = "relative order-2 lg:order-5 cursor-pointer";

      const optImg = document.createElement("img");
      optImg.src = "resources/options.svg";
      optImg.alt = "";
      optionsEl.appendChild(optImg);

      const menu = document.createElement("div");
      menu.className = "txn-options-menu absolute right-0 top-full mt-2 bg-white border rounded shadow z-50";
      menu.style.display = "none";
      menu.style.minWidth = "110px";
      menu.innerHTML = `
            <div class="px-3 py-2 hover:bg-slate-100 cursor-pointer">Edit</div>
            <div class="px-3 py-2 hover:bg-slate-100 cursor-pointer">Delete</div>
            `;

      const editBtn = menu.children[0];
      const deleteBtn = menu.children[1];

      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.style.display = "none";
        editTransaction(index);
      });

      deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (confirm("Delete this transaction?")) {
          deleteTransaction(index, filterType);
          menu.style.display = "none";
        }
      });

      optionsEl.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });

      optionsEl.appendChild(menu);

      root.appendChild(left);
      root.appendChild(categoryEl);
      root.appendChild(tagEl);
      root.appendChild(amountEl);
      root.appendChild(optionsEl);

      tableBody.appendChild(root);
    }
  });
}

function clearTable() {
  var tableBody = document.getElementById("trnxTable");
  tableBody.innerHTML =
    '<div class="my-4 text-center text-md text-slate-500" >No transactions are done yet</div>';
}

function addNewTxn() {
  var amount = document.getElementById("amount").value;
  var description = document.getElementById("description").value;
  var type = document.getElementById("income").checked ? "income" : "expense";
  var timeStamp = getFormattedDateTime();
  var category = document.getElementById("category").value;

  if (amount && description) {
    var txnData = JSON.parse(localStorage.getItem("transactions")) || [];
    txnData.push({
      amount: parseFloat(amount),
      description: description,
      type: type,
      time: timeStamp,
      timeStamp: new Date().getTime(),
      category: category,
      edited: false,
    });
    localStorage.setItem("transactions", JSON.stringify(txnData));
    displayTransactions();
    updateTxnDisplay();
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
  } else {
    alert("Please fill in all fields.");
  }
}

function getFormattedDateTime(date = new Date()) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const pad = (n) => String(n).padStart(2, "0");

  const m = months[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  const hh24 = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const suffix = date.getHours() >= 12 ? "PM" : "AM";
  return `${m} ${d}, ${y} ${hh24}:${mm}${suffix}`;
}

function deleteTransaction(index, filterType) {
  var txnData = JSON.parse(localStorage.getItem("transactions")) || [];
  txnData.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(txnData));
  updateTxnDisplay();
  displayTransactions(filterType);
}

function editTransaction(index) {
  var txnData = JSON.parse(localStorage.getItem("transactions")) || [];
  var txn = txnData[index];
  if (!txn) return;

  var existing = document.getElementById("txnEditModal");
  if (existing) existing.remove();

  var modal = document.createElement("div");
  modal.id = "txnEditModal";
  modal.className =
    "fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50";
  modal.style.padding = "1rem";

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md" role="dialog" aria-modal="true">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-semibold">Edit Transaction</h3>
      </div>
      <div class="p-6 space-y-4">
        <label class="block">
          <div class="text-sm text-slate-600 mb-1">Amount</div>
          <input id="txn_edit_amount" type="number" step="0.01" class="w-full p-2 border rounded" />
        </label>
        <label class="block">
          <div class="text-sm text-slate-600 mb-1">Description</div>
          <input id="txn_edit_description" maxlength="35" type="text" class="w-full p-2 border rounded" />
        </label>
        <label class="block">
          <div class="text-sm text-slate-600 mb-1">Category</div>
          <select id="txn_edit_category" name="category"
                class="w-full p-2 border rounded">
                <option value="Salary">Salary</option>
                <option value="Grocery">Grocery</option>
                <option value="Dining">Dining</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Others">Others</option>
            </select>
        </label>
        <div>
          <div class="text-sm text-slate-600 mb-1">Type</div>
          <div class="flex gap-4">
            <label class="flex items-center gap-2"><input id="txn_edit_type_income" name="txn_edit_type" type="radio" value="income" /> Income</label>
            <label class="flex items-center gap-2"><input id="txn_edit_type_expense" name="txn_edit_type" type="radio" value="expense" /> Expense</label>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 border-t flex justify-end gap-3">
        <button id="txn_edit_cancel" class="px-4 py-2 rounded border">Cancel</button>
        <button id="txn_edit_save" class="px-4 py-2 rounded bg-dark-income text-white">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("txn_edit_amount").value = txn.amount;
  document.getElementById("txn_edit_description").value = txn.description;
  document.getElementById("txn_edit_category").value = txn.category || "";
  if (txn.type === "income") {
    document.getElementById("txn_edit_type_income").checked = true;
  } else {
    document.getElementById("txn_edit_type_expense").checked = true;
  }

  function closeModal() {
    var m = document.getElementById("txnEditModal");
    if (m) m.remove();
    document.removeEventListener("keydown", escHandler);
  }

  document
    .getElementById("txn_edit_save")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var newAmount = parseInt(
        document.getElementById("txn_edit_amount").value
      );
      var newDescription = document
        .getElementById("txn_edit_description")
        .value.trim();
      var newCategory = document.getElementById("txn_edit_category").value;
      var newType = document.getElementById("txn_edit_type_income").checked
        ? "income"
        : "expense";

      if (isNaN(newAmount) || newDescription === "") {
        alert("Please provide a valid amount and description.");
        return;
      }

      txnData[index] = {
        amount: newAmount,
        description: newDescription,
        category: newCategory,
        type: newType,
        time: txn.time,
        edited: true,
      };

      localStorage.setItem("transactions", JSON.stringify(txnData));
      closeModal();
      updateTxnDisplay();
      displayTransactions();
    });

  document
    .getElementById("txn_edit_cancel")
    .addEventListener("click", function (e) {
      e.preventDefault();
      closeModal();
    });

  modal.addEventListener("click", function (ev) {
    if (ev.target === modal) closeModal();
  });

  function escHandler(ev) {
    if (ev.key === "Escape") closeModal();
  }
  document.addEventListener("keydown", escHandler);
}

document.getElementById("trnxFilter").onclick = function (ev) {
  ev.stopPropagation();
  ev.preventDefault();
  document.getElementById("trnxFilterPopup").classList.toggle("hidden");
};
document.getElementById("allTxn").onclick = function (ev) {
  ev.stopPropagation();
  ev.preventDefault();
  displayTransactions("all");
};
document.getElementById("incomeTxn").onclick = function (ev) {
  ev.stopPropagation();
  ev.preventDefault();
  displayTransactions("income");
};
document.getElementById("expensesTxn").onclick = function (ev) {
  ev.stopPropagation();
  ev.preventDefault();
  displayTransactions("expense");
};
document.getElementById("newTxn").onclick = function (ev) {
  ev.stopPropagation();
  ev.preventDefault();
  displayTransactions("new");
};
document.getElementById("oldTxn").onclick = function (ev) {
  ev.stopPropagation();
  ev.preventDefault();
  displayTransactions("old");
};

document.addEventListener("click", function () {
  var elements = document.getElementsByClassName("txn-options-menu");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
  document.getElementById("trnxFilterPopup").classList.add("hidden");
});

function updateTxnDisplay() {
  var txnData = JSON.parse(localStorage.getItem("transactions")) || [];
  var income = 0;
  var expenses = 0;

  txnData.forEach(function (txn) {
    if (txn.type === "income") {
      income += txn.amount;
    } else if (txn.type === "expense") {
      expenses += txn.amount;
    }
  });

  document.getElementById("incomeDisplay").textContent =
    "₹ " + income.toFixed(2);
  document.getElementById("expensesDisplay").textContent =
    "₹ " + expenses.toFixed(2);
  document.getElementById("balanceDisplay").textContent =
    "₹ " + (income - expenses).toFixed(2);

  displayProgressBar(income, expenses);
}

function displayProgressBar(income, expenses) {
  var txnData = JSON.parse(localStorage.getItem("transactions")) || [];
  var obj = {};
  txnData.forEach(function (txn) {
        if (txn.type === "income") return;
        if(obj[txn.category]) {
            obj[txn.category] += txn.amount;
        } else {
            obj[txn.category] = txn.amount;
        }
  });
    var progressBarContainer = document.getElementById("progressBar");
    progressBarContainer.innerHTML = '';

    var labelContainer = document.getElementById("progressLabel");
    labelContainer.innerHTML = '';

    for(var category in obj) {
        var amount = obj[category];
        var color =  getRandomColor();
        amount = (amount / income) * 100;
        var barWrapper = document.createElement('div');
        barWrapper.className = 'h-full opacity-50';
        barWrapper.style.width = amount + '%';
        barWrapper.style.backgroundColor = color;
        progressBarContainer.appendChild(barWrapper);

        var barLabel = document.createElement('div');
        barLabel.className = "relative text-lg lg:text-sm text-stone-600 before:content-[''] before:absolute before:top-2 lg:before:top-1.5 before:-left-4 lg:before:-left-2.5 before:aspect-square before:w-3 lg:before:w-2 before:rounded-full before:bg-[" + color + "]";
        barLabel.innerHTML = category;
        barLabel.title = category + ' : ' + amount.toFixed(2)+'%';
        labelContainer.appendChild(barLabel);
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let cart = [];

let borrowedItems = {
    Printer: [],
    Ball: [],
    Book: [],
    Laptop: [],
    Projector: [],
    Desk: [],
    Calculator: [],
    Speaker: [],
    Extension: [],
}
let consumableItemsLog = {
    BondPaper: [],
    Tape: [],
    Ink: [],
    Marker: [],
    Ballpen: [],
    Stapler: [],
};


let stock = {
    BondPaper: 100,
    Ink: 10,
    Speaker: 10,
    Marker: 10,
    Ballpen: 20,
    Stapler: 100,
    Ball: 5,
    Book: 10,
    Printer: 5,
    Laptop: 5,
    Projector: 3,
    Desk: 10,
    Calculator: 20,
    Tape: 20,
    Extension: 5,

};

const consumableItems = ['BondPaper', 'Tape', 'Ink', 'Marker', 'Ballpen', 'Stapler'];
const returnableItems = ['Printer', 'Extension', 'Speaker', 'Calculator', 'Desk', 'Book', 'Ball', 'Projector', 'Laptop'];

const itemTypeDropdown = document.getElementById('itemType');
const itemsDropdown = document.getElementById('items');
const logList = document.getElementById('logList');
const cartItemList = document.getElementById('cartItemList');
const borrowedItemList = document.getElementById('borrowedList');


itemTypeDropdown.addEventListener('change', updateItemsDropdown);

function updateStockLocalStorage() {
    localStorage.setItem('stock', JSON.stringify(stock));
}

function addNewItem() {
    const itemName = prompt('Enter the name of the new item:');
    const itemQuantity = prompt('Enter the initial quantity of the new item:');
    const itemType = prompt('Enter the item type (consumable/returnable):').toLowerCase();

    if (!itemName || isNaN(itemQuantity) || !(itemType === 'consumable' || itemType === 'returnable')) {
        alert('Invalid input. Please provide valid information.');
        return;
    }

    stock[itemName] = parseInt(itemQuantity);
    updateStockDisplay();
    updateStockLocalStorage();

    if (itemType === 'returnable' && !returnableItems.includes(itemName)) {
        returnableItems.push(itemName);
        updateStockLocalStorage();
    }

    let items;
    if (itemType === 'consumable') {
        items = [...consumableItems];
        consumableItems.push(itemName);
    } else if (itemType === 'returnable') {
        items = [...returnableItems];
    } else {
        alert('Invalid item type. Please provide a valid item type.');
        return;
    }

    updateDropdown(items);
    alert(`New item '${itemName}' added to the inventory with ${itemQuantity} quantity.`);

    updateItemsDropdown();
    updateStockLocalStorage();
}

function updateConsumableItemsLogList() {
    const consumableItemsLogTableBody = document.getElementById('consumableItemsLogBody');
    consumableItemsLogTableBody.innerHTML = '';

    const allConsumableItems = [].concat(...Object.values(consumableItemsLog));

    allConsumableItems.forEach(item => {
        const row = consumableItemsLogTableBody.insertRow();

        const idNumberCell = row.insertCell();
        idNumberCell.textContent = item.idNumber;

        const departmentCell = row.insertCell();
        departmentCell.textContent = item.department;

        const dateCell = row.insertCell();
        dateCell.textContent = item.date;

        const itemTypeCell = row.insertCell();
        itemTypeCell.textContent = item.itemType;

        const quantityCell = row.insertCell();
        quantityCell.textContent = `${item.quantity} ${item.itemType}(s)`;

        const yearLevelCell = row.insertCell();
        yearLevelCell.textContent = item.yearLevel;
    });

    localStorage.setItem('consumableItemsLog', JSON.stringify(consumableItemsLog));

}




function clearForm() {
    document.getElementById('idNumber').value = '';
    document.getElementById('department').value = '';
    document.getElementById('yearLevel').value = '';
    document.getElementById('borrowDate').value = '';
    document.getElementById('itemType').value = '';
    document.getElementById('items').innerHTML = '';
    document.getElementById('itemQuantity').value = '';
    document.getElementById('borrowPurpose').value = '';

    cart = [];
    updateCartDisplay();

    const stockDisplay = document.getElementById('stockDisplay');
    if (stockDisplay) {
        stockDisplay.parentNode.removeChild(stockDisplay);
    }
}


window.onload = function () {
    const storedLog = localStorage.getItem('transactionLog');
    const storedBorrowedItems = localStorage.getItem('borrowedItems');

    if (storedLog) {
        logList.innerHTML = storedLog;
    }

    if (storedBorrowedItems) {
        borrowedItems = JSON.parse(storedBorrowedItems);
        updateBorrowedItemsList();
    }

    const storedStock = localStorage.getItem('stock');
    if (storedStock) {
        stock = JSON.parse(storedStock);
        updateStockDisplay();
    }

    const storedConsumableItemsLog = localStorage.getItem('consumableItemsLog');

    if (storedConsumableItemsLog) {
        consumableItemsLog = JSON.parse(storedConsumableItemsLog);
        updateConsumableItemsLogList();
    }
};

function updateCartDisplay() {
    cartItemList.innerHTML = '';
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.quantity} ${item.itemType}(s)`;
        cartItemList.appendChild(listItem);
    });
}

function updateDropdown(items) {
    itemsDropdown.innerHTML = '';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.text = item.charAt(0).toUpperCase() + item.slice(1);
        itemsDropdown.add(option);
    });
}

function updateItemsDropdown() {
    const selectedItemType = itemTypeDropdown.value;
    const items = selectedItemType === 'consumable' ? consumableItems : returnableItems;
    updateDropdown(items);
    updateStockDisplay();
}

function addToCart() {
    const itemType = itemsDropdown.value;
    const quantityInput = document.getElementById('itemQuantity');
    const quantity = parseInt(quantityInput.value, 10);

    if (quantity > 0) {
        if (stock[itemType] >= quantity) {
            const existingCartItem = cart.find(item => item.itemType === itemType);

            if (existingCartItem) {
                existingCartItem.quantity += quantity;
            } else {
                cart.push({ itemType, quantity });
            }

            alert(`${quantity} ${itemType}(s) added to cart.`);
            quantityInput.value = 1;
            updateCartDisplay();
            updateStockDisplay();
        } else {
            alert(`Not enough stock for ${itemType}. Available stock: ${stock[itemType]}`);
        }
    } else {
        alert('Please enter a valid quantity.');
    }
}


function checkout() {
    if (cart.length > 0) {
        const confirmCheckout = confirm('Are you sure you want to checkout?');
        if (confirmCheckout) {
            const idNumber = document.getElementById('idNumber').value;
            const department = document.getElementById('department').value;
            const yearLevel = document.getElementById('yearLevel').value;
            const borrowDate = document.getElementById('borrowDate').value;

            for (const item of cart) {
                stock[item.itemType] -= item.quantity;

                if (returnableItems.includes(item.itemType)) {
                    item.dueDate = calculateDueDate();
                    const borrowedItem = { ...item };






                    if (!borrowedItems[item.itemType]) {
                        borrowedItems[item.itemType] = [];
                    }

                    borrowedItem.idNumber = idNumber;
                    borrowedItem.department = department;
                    borrowedItem.date = borrowDate;
                    borrowedItem.yearLevel = yearLevel;
                    borrowedItems[item.itemType].push(borrowedItem);
                }
            }

            logTransaction('Borrowed', cart);
            cart = [];
            updateCartDisplay();
            updateStockDisplay();
            updateBorrowedItemsList();
            alert('Successfully Borrowed.');
        }
    } else {
        alert('Your cart is empty. Add items before checking out.');
    }
}


function showAllStock() {
    const stockList = [];
    for (const itemType in stock) {
        const quantity = stock[itemType];
        stockList.push(`${itemType}: ${quantity}`);
    }


    const modalContainer = document.createElement('div');
    modalContainer.classList.add('stock-modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('stock-modal-content');

    const modalHeader = document.createElement('h2');
    modalHeader.textContent = 'All Stock Items';

    const modalBody = document.createElement('ul');
    stockList.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        modalBody.appendChild(listItem);
    });

    const modalCloseButton = document.createElement('button');
    modalCloseButton.textContent = 'Close';
    modalCloseButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });


    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalCloseButton);
    modalContainer.appendChild(modalContent);


    document.body.appendChild(modalContainer);
}


function returnItems(idNumber) {
    const borrowedUserItems = [].concat(...Object.values(borrowedItems[idNumber]));

    if (borrowedUserItems.length === 0) {
        alert('No items to return for this user.');
        return;
    }

    const returnableItemsBorrowed = borrowedUserItems.filter(item => returnableItems.includes(item.itemType));

    if (returnableItemsBorrowed.length > 0) {
        let itemTypeToReturn;

        if (returnableItemsBorrowed.length > 1) {
            const returnableItemNames = returnableItemsBorrowed.map(item => item.itemType).join(', ');
            itemTypeToReturn = prompt(`Select the returnable item to return (${returnableItemNames}):`);

            if (!returnableItems.includes(itemTypeToReturn)) {
                alert('Invalid item type selected.');
                return;
            }
        } else {
            itemTypeToReturn = returnableItemsBorrowed[0].itemType;
        }

        const selectedItem = borrowedItems[idNumber].find(item => item.itemType === itemTypeToReturn);

        if (selectedItem) {
            const returnAll = confirm(`Do you want to return all ${selectedItem.itemType}(s)?`);

            if (returnAll) {
                stock[selectedItem.itemType] += selectedItem.quantity;
                alert(`${selectedItem.quantity} ${selectedItem.itemType}(s) returned.`);

                borrowedItems[idNumber].splice(borrowedItems[idNumber].indexOf(selectedItem), 1);
                updateBorrowedItemsList();
                updateStockDisplay();
            } else {
                const quantityToReturn = prompt(`Enter the quantity to return for ${selectedItem.itemType} (max ${selectedItem.quantity}):`);

                if (!isNaN(quantityToReturn) && parseInt(quantityToReturn) > 0 && parseInt(quantityToReturn) <= selectedItem.quantity) {
                    const userConfirmed = confirm(`Do you want to return ${quantityToReturn} ${selectedItem.itemType}(s)?`);

                    if (userConfirmed) {
                        selectedItem.quantity -= parseInt(quantityToReturn);
                        stock[selectedItem.itemType] += parseInt(quantityToReturn);

                        if (selectedItem.quantity === 0) {
                            borrowedItems[idNumber].splice(borrowedItems[idNumber].indexOf(selectedItem), 1);
                        }

                        alert(`${quantityToReturn} ${selectedItem.itemType}(s) returned.`);
                        updateBorrowedItemsList();
                        updateStockDisplay();
                    } else {
                        alert('Return action canceled.');
                    }
                } else {
                    alert('Invalid quantity entered.');
                }
            }
        } else {
            alert('Invalid item type selected.');
        }
    } else {
        alert('No returnable items to return for this user.');
    }
}






function calculateDueDate() {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 1);
    return dueDate.toISOString().split('T')[0];
}

let transactionNumber = 1;

function logTransaction(action, cart) {
    const idNumber = document.getElementById('idNumber').value;
    const department = document.getElementById('department').value;
    const yearLevel = document.getElementById('yearLevel').value;
    const date = document.getElementById('borrowDate').value;
    const borrowPurpose = document.getElementById('borrowPurpose').value;

    const logRow = document.createElement('tr');

    const transactionNumberCell = document.createElement('td');
    transactionNumberCell.textContent = transactionNumber;
    logRow.appendChild(transactionNumberCell);

    const idNumberCell = document.createElement('td');
    idNumberCell.textContent = idNumber;
    logRow.appendChild(idNumberCell);

    const departmentCell = document.createElement('td');
    departmentCell.textContent = department;
    logRow.appendChild(departmentCell);

    const yearLevelCell = document.createElement('td');
    yearLevelCell.textContent = yearLevel;
    logRow.appendChild(yearLevelCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = date;
    logRow.appendChild(dateCell);

    const itemsCell = document.createElement('td');
    itemsCell.textContent = cart.map(item => `${item.quantity} ${item.itemType}(s)`).join(', ');
    logRow.appendChild(itemsCell);

    const borrowPurposeCell = document.createElement('td');
    borrowPurposeCell.textContent = borrowPurpose;
    logRow.appendChild(borrowPurposeCell);

    logList.appendChild(logRow);


    cart.forEach(item => {
        if (consumableItems.includes(item.itemType)) {
            const consumableLogRow = document.createElement('tr');

            const consumableIdNumberCell = document.createElement('td');
            consumableIdNumberCell.textContent = idNumber;
            consumableLogRow.appendChild(consumableIdNumberCell);

            const consumableDepartmentCell = document.createElement('td');
            consumableDepartmentCell.textContent = department;
            consumableLogRow.appendChild(consumableDepartmentCell);

            const consumableDateCell = document.createElement('td');
            consumableDateCell.textContent = date;
            consumableLogRow.appendChild(consumableDateCell);

            const consumableItemTypeCell = document.createElement('td');
            consumableItemTypeCell.textContent = item.itemType;
            consumableLogRow.appendChild(consumableItemTypeCell);

            const consumableQuantityCell = document.createElement('td');
            consumableQuantityCell.textContent = item.quantity;
            consumableLogRow.appendChild(consumableQuantityCell);

            const consumableYearLevelCell = document.createElement('td');
            consumableYearLevelCell.textContent = yearLevel;
            consumableLogRow.appendChild(consumableYearLevelCell);

            consumableItemsLog[item.itemType].push({
                idNumber,
                department,
                date,
                itemType: item.itemType,
                quantity: item.quantity,
                yearLevel,
            });


            const consumableItemsLogBody = document.getElementById('consumableItemsLogBody');
            if (consumableItemsLogBody) {
                consumableItemsLogBody.appendChild(consumableLogRow);
            }
        }
    });

    transactionNumber++;

    localStorage.setItem('transactionLog', logList.innerHTML);
    localStorage.setItem('consumableItemsLog', JSON.stringify(consumableItemsLog));
}


itemsDropdown.addEventListener('change', updateStockDisplay);

function updateStockDisplay() {
    const selectedItem = itemsDropdown.value;
    const stockDisplay = document.getElementById('stockDisplay');

    if (stockDisplay) {
        stockDisplay.textContent = `Stock: ${stock[selectedItem]}`;
    } else {
        const stockDisplayContainer = document.createElement('div');
        stockDisplayContainer.id = 'stockDisplay';
        stockDisplayContainer.textContent = `Stock: ${stock[selectedItem]}`;

        itemsDropdown.parentNode.insertBefore(stockDisplayContainer, itemsDropdown.nextSibling);
    }
}
function restockItems() {
    let shouldAlert = false;

    for (const itemType in stock) {
        if (stock[itemType] <= 0) {
            restockItem(itemType);
        } else {
            shouldAlert = true;
        }
    }

    if (shouldAlert) {
        alert('The Restock Button will work if the stock goes to 0 sorry.');
    }

    updateStockDisplay();
}


function restockItem(itemType) {
    let restockAmount;

    do {
        restockAmount = prompt(`Restock ${itemType}: Enter the quantity to restock`, 0);

        if (restockAmount === null) {
            alert('Restocking canceled.');
            return;
        }

        restockAmount = restockAmount.trim();

        if (!restockAmount.match(/^\d+$/)) {
            alert('Invalid input. Please enter a positive integer.');
        } else {
            restockAmount = parseInt(restockAmount);
            if (restockAmount <= 0) {
                alert('Invalid input. Please enter a positive integer.');
            }
        }
    } while (!Number.isInteger(restockAmount) || restockAmount <= 0);

    stock[itemType] += restockAmount;
    alert(`${restockAmount} ${itemType}(s) restocked successfully.`);
}


function updateBorrowedItemsList() {
    const borrowedItemsTableBody = document.getElementById('borrowedItemsBody');
    borrowedItemsTableBody.innerHTML = '';

    const allBorrowedItems = [].concat(...Object.values(borrowedItems));


    const groupedItemsByUser = {};
    allBorrowedItems.forEach(item => {
        const key = item.idNumber;
        if (!groupedItemsByUser[key]) {
            groupedItemsByUser[key] = [item];
        } else {
            groupedItemsByUser[key].push(item);
        }
    });

    for (const key in groupedItemsByUser) {
        const userItems = groupedItemsByUser[key];

        userItems.forEach((item, index) => {
            const row = borrowedItemsTableBody.insertRow();


            if (index === 0) {
                const returnButtonCell = row.insertCell();
                const returnButton = document.createElement('button');
                returnButton.textContent = 'Return';
                returnButton.onclick = function () {
                    returnItems(item.itemType, item.quantity, 0);
                };
                returnButtonCell.appendChild(returnButton);
            } else {

                row.insertCell();
            }

            const idNumberCell = row.insertCell();
            idNumberCell.textContent = item.idNumber;

            const departmentCell = row.insertCell();
            departmentCell.textContent = item.department;

            const dateCell = row.insertCell();
            dateCell.textContent = item.date;

            const itemTypeCell = row.insertCell();
            itemTypeCell.textContent = item.itemType;

            const dueDateCell = row.insertCell();
            dueDateCell.textContent = item.dueDate;

            const quantityCell = row.insertCell();
            quantityCell.textContent = `${item.quantity} ${item.itemType}(s)`;

            const yearLevelCell = row.insertCell();
            yearLevelCell.textContent = item.yearLevel;
        });
    }


    localStorage.setItem('borrowedItems', JSON.stringify(borrowedItems));
}


function clearAllData() {
    const confirmClear = confirm('Are you sure you want to clear all data? This action cannot be undone.');
    if (confirmClear) {

        logList.innerHTML = '';
        localStorage.removeItem('transactionLog');


        consumableItemsLog = {
            BondPaper: [],
            Tape: [],
            Ink: [],
            Marker: [],
            Ballpen: [],
            Stapler: [],
        };
        updateConsumableItemsLogList();
        localStorage.removeItem('consumableItemsLog');


        borrowedItems = {
            Printer: [],
            Ball: [],
            Book: [],
            Laptop: [],
            Projector: [],
            Desk: [],
            Calculator: [],
            Speaker: [],
            Extension: [],
        };
        updateBorrowedItemsList();
        localStorage.removeItem('borrowedItems');


        stock = {
            BondPaper: 100,
            Ink: 10,
            Speaker: 10,
            Marker: 10,
            Ballpen: 20,
            Stapler: 100,
            Ball: 5,
            Book: 10,
            Printer: 5,
            Laptop: 5,
            Projector: 3,
            Desk: 10,
            Calculator: 20,
            Tape: 20,
            Extension: 5,
        };
        updateStockDisplay();
        updateStockLocalStorage();

        alert('All data cleared successfully, and stock reset to default values.');
    }
}

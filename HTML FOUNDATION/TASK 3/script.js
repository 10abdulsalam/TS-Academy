const shoppingForm = document.querySelector('#shopping-form');
const itemInput = document.querySelector('#item-input');
const shoppingList = document.querySelector('#shopping-list');
const summary = document.querySelector('#summary');
const itemCount = document.querySelector('#item-count');

const items = [];

function updateSummary() {
  const itemTotal = items.length;
  const itemWord = itemTotal === 1 ? 'item' : 'items';

  itemCount.textContent = `${itemTotal} ${itemWord}`;
  summary.textContent = itemTotal === 0
    ? 'Your shopping list is empty.'
    : `You currently have ${itemTotal} ${itemWord} on your shopping list.`;
}

function renderItems() {
  shoppingList.replaceChildren();

  items.forEach((item, index) => {
    const listItem = document.createElement('li');
    const itemName = document.createElement('span');
    const deleteButton = document.createElement('button');

    listItem.className = 'item';
    itemName.textContent = item;
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${item}`);
    deleteButton.addEventListener('click', () => {
      items.splice(index, 1);
      renderItems();
      updateSummary();
      itemInput.focus();
    });

    listItem.append(itemName, deleteButton);
    shoppingList.append(listItem);
  });
}

shoppingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newItem = itemInput.value.trim();
  if (!newItem) {
    itemInput.focus();
    return;
  }

  items.push(newItem);
  renderItems();
  updateSummary();
  shoppingForm.reset();
  itemInput.focus();
});

updateSummary();

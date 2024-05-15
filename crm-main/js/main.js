import { createClientModal, createDeleteClientModal } from "./modals.js"
import { getClientsData } from "./api.js"

export const modal = document.getElementById('modal')

const pageContainer = document.getElementById('page-container')
const tableBody = document.getElementById('tbody')
const preloader = document.getElementById('preloader')

export let handlers = {
  async onDelete(id) {
    await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE'
    }) 
    createClientsList(await getClientsData())
  },
  async onSave(clientData) {
    await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
      headers: {
        'Content-Type': 'application/json'
      }
    }) 
    createClientsList(await getClientsData())
  },
  async onEdit(clientData, id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    createClientsList(await getClientsData())
  }
}

function createIdCell(id) {
  const cell = document.createElement('td')
  cell.classList.add('table__cell', 'table__cell--id')
  cell.textContent = id
  return cell
}

function createFullNameCell(fullName) {
  const cell = document.createElement('td')
  cell.classList.add('table__cell', 'table__cell--fullname')
  cell.textContent = fullName
  return cell
}

function createDateCell(dateValue, timeValue) {
  const cell = document.createElement('td')
  const time = document.createElement('span')
  cell.classList.add('table__cell', 'table__cell--date')
  time.classList.add('table__time')
  cell.textContent = dateValue
  time.textContent = timeValue
  cell.append(time)
  return cell
}

function createContactsCell() {
  const cell = document.createElement('td')
  cell.classList.add('table__cell', 'table__cell--contacts')
  return cell
}

function createContactsList() {
  const list = document.createElement('ul')
  list.classList.add('table__social-list', 'list-reset')
  return list
}

function createContactsItem(social, value) {
  const item = document.createElement('li')
  const socialButton = document.createElement('button')
  item.classList.add('table__social-item')
  socialButton.classList.add('table__social-btn', 'btn-reset')
  socialButton.innerHTML = `
  <svg class="table__social-icon" width="16" height="16">
    <use xlink:href="images/sprites.svg#${social}"></use>
  </svg>`
  item.append(socialButton)
  return item;
}

function createActionsCell() {
  const cell = document.createElement('td');
  const editButton = document.createElement('button')
  const deleteButton = document.createElement('button')
  cell.classList.add('table__cell', 'table__cell--actions')
  editButton.classList.add('table__btn-edit', 'btn-reset')
  deleteButton.classList.add('table__btn-delete', 'btn-reset')
  editButton.textContent = 'Изменить'
  deleteButton.textContent = 'Удалить'
  cell.append(editButton)
  cell.append(deleteButton)
  return {
    cell,
    editButton,
    deleteButton,
  }
}

function createAddClientButton() {
  const addClientButton = document.createElement('button')
  addClientButton.classList.add('clients__btn-add')
  addClientButton.innerHTML = `
  <svg class="clients__icon-add" width="23" height="16">
    <use xlink:href="images/sprites.svg#add-client"></use>
  </svg>
  Добавить клиента`
  return addClientButton
}

function createLoaderMini(spinnerColor) {
  const loader = document.createElement('span')
  loader.classList.add('loader')
  loader.innerHTML = `
  <svg class="spinner ${spinnerColor}" width="16" height="16">
    <use xlink:href="images/sprites.svg#miniloader"></use>
  </svg>`
  return loader
}

function createShowMoreButton(number) {
  const item = document.createElement('li')
  const button = document.createElement('button')
  item.classList.add('table__social-item')
  button.classList.add('show-more', 'btn-reset')
  button.textContent = `+${number}`
  item.append(button)

  return {
    item,
    button,
  }
}

function formatDate(value) {
  const dateValue = new Date(value)
  const dateStr = String(dateValue)
  let dd = dateValue.getDate()
  if (dd < 10) dd = '0' + dd

  let mm = dateValue.getMonth() + 1
  if (mm < 10) mm = '0' + mm

  let yy = dateValue.getFullYear() 

  const date = `${dd}.${mm}.${yy}`
  const time = dateStr.substring(16, 21)

  return {
    date,
    time,
  }
}

function sort(arr, prop, btn) {
  let isClick = btn.classList.contains('sort')
  let sortData
  if (isClick) {
    sortData = arr.sort(function(a, b) {
      if (a[prop] < b[prop]) return - 1
    })
  } else {
    sortData = arr.sort(function(a, b) {
      if (a[prop] > b[prop]) return - 1
    })
  }
  createClientsList(sortData)
}

function filter(arr, input) {
  let inputValue = input.value.toLowerCase()
  let filterData = arr.filter(client => client.name.toLowerCase().includes(inputValue) || client.surname.toLowerCase().includes(inputValue) || client.lastName.toLowerCase().includes(inputValue))
  createClientsList(filterData)
}

function createTableRow(client) {
  const clientRow = document.createElement('tr')
  const clientIdCell = createIdCell(client.id)
  const clientFullNameCell = createFullNameCell(`${client.surname} ${client.name} ${client.lastName}`)
  const createDate = formatDate(client.createdAt)
  const updatedDate = formatDate(client.updatedAt)
  const clientDateCell = createDateCell(createDate.date, createDate.time)
  const clientUpdatedDateCell = createDateCell(updatedDate.date, updatedDate.time)
  const clientContactsCell = createContactsCell()
  const clientContactsList = createContactsList();
  const clientActionsCell = createActionsCell();

  clientRow.classList.add('table__row')

  client.contacts.forEach(contact => {
    let contactItemElement
    
    switch (contact.type) {
      case 'Телефон':
        contactItemElement = createContactsItem('tel', contact.value);
        break;
      case 'Email':
        contactItemElement = createContactsItem('mail', contact.value);
        break;
      case 'Facebook':
        contactItemElement = createContactsItem('fb', contact.value);
        break;
      case 'VK':
        contactItemElement = createContactsItem('vk', contact.value);
        break;
      default:
        contactItemElement = createContactsItem('contact', contact.value);
    }

    clientContactsList.append(contactItemElement)

    tippy(contactItemElement, {
      content: `${contact.value}`
    })
  })

  let contactslistItems = clientContactsList.childNodes
  if (contactslistItems.length > 5) {
    for (let i = 4; i < contactslistItems.length; i++) {
      contactslistItems[i].classList.add('invisible')
    }
    const moreNumber = contactslistItems.length - 4
    const showMoreButton = createShowMoreButton(moreNumber)
    clientContactsList.append(showMoreButton.item)

    showMoreButton.button.addEventListener('click', () => {
      for (let i = 4; i < contactslistItems.length; i++) {
        contactslistItems[i].classList.remove('invisible')
      }
      showMoreButton.item.remove()
    })
  }

  clientContactsCell.append(clientContactsList)
  clientRow.append(clientIdCell)
  clientRow.append(clientFullNameCell)
  clientRow.append(clientDateCell)
  clientRow.append(clientUpdatedDateCell)
  clientRow.append(clientContactsCell)
  clientRow.append(clientActionsCell.cell)

  clientActionsCell.deleteButton.addEventListener('click', () => {
    const loaderMini = createLoaderMini('spinner-red')
    clientActionsCell.deleteButton.prepend(loaderMini)
    modal.append(createDeleteClientModal(handlers ,client, clientRow))
    modal.classList.add('visible')
    setTimeout(() => {
      loaderMini.remove()
    }, 500);
  })

  clientActionsCell.editButton.addEventListener('click', () => {
    const loaderMini = createLoaderMini('spinner-purple')
    clientActionsCell.editButton.prepend(loaderMini)
    modal.append(createClientModal(handlers, client, clientRow))
    modal.classList.add('visible')
    setTimeout(() => {
      loaderMini.remove()
    }, 500);
  })

  return clientRow
}

async function createClientsList(clients) {
  tableBody.innerHTML = ''
  for (const client of clients) {
    const clientRow = createTableRow(client)
    tableBody.append(clientRow)
  }
}

async function createClientsApp() {
  const response = await fetch('http://localhost:3000/api/clients')
  const clientsData = await response.json()
  const sortButtons = document.querySelectorAll('.js-sort-btn')
  const searchFill = document.getElementById('search')
  const props = ['id', 'surname', 'createdAt', 'updatedAt']
  const addClientButton = createAddClientButton()

  createClientsList(clientsData)

  preloader.remove()

  for (let i = 0; i < sortButtons.length; i++) {
    sortButtons[i].addEventListener('click', () => {
      sortButtons[i].classList.toggle('sort')
      sort(clientsData, props[i], sortButtons[i])
    })
  }

  searchFill.addEventListener('input', () => {
    setTimeout(() => {
      filter(clientsData, searchFill)
    }, 750);
  })

  addClientButton.addEventListener('click', () => {
    modal.append(createClientModal(handlers))
    modal.classList.add('visible')
  })

  pageContainer.append(addClientButton)
}

createClientsApp()



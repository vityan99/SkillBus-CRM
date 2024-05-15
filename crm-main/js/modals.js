import { modal, handlers } from "./main.js";

function onClose(modalElemet) {
  modal.classList.remove('visible')
  modalElemet.remove()
}

function createCloseButton(element) {
  const closeButton = document.createElement('button')
  closeButton.classList.add('modal__btn-close', 'btn-reset')
  closeButton.innerHTML = `
  <svg width="29" height="29">
    <use xlink:href="images/sprites.svg#close"></use>
  </svg>`
  closeButton.addEventListener('click', () => {
    onClose(element)
  })
  return closeButton
}

function createModalBlock(className) {
  const block = document.createElement('div')
  block.classList.add(className)
  return block
}

function createModalTitle(title = 'Новый клиент', id = null) {
  const titleElement = document.createElement('h2')
  titleElement.classList.add('modal__title')
  titleElement.textContent = title
  if (id) {
    const clientId = document.createElement('span')
    clientId.classList.add('modal__client-id')
    clientId.textContent = `ID: ${id}`
    titleElement.append(clientId)
  }
  return titleElement
}

function createModalForm() {
  const form = document.createElement('form')
  form.classList.add('modal__form')
  return form
}

function createModalInput(placeholder, value = '', required = true) {
  const label = document.createElement('label')
  const labelText = document.createElement('span')
  const input = document.createElement('input')

  label.classList.add('modal__label')
  labelText.classList.add('modal__label-text')
  input.classList.add('modal__input')

  labelText.textContent = placeholder
  input.value = value
  input.setAttribute('pattern', '^[А-Яа-яЁё\s]+$')
  input.setAttribute('minlength', 2)

  label.append(labelText)
  label.append(input)

  if (required) {
    const symbol = document.createElement('span')
    symbol.classList.add('modal__label-symbol')
    symbol.textContent = '*'
    input.setAttribute('required', true)
    labelText.append(symbol)
  }

  if (value) {
    labelText.classList.add('transform-label')
  }

  input.addEventListener('input', () => {
    if (input.value) {
      labelText.classList.add('transform-label')
    } else (
      labelText.classList.remove('transform-label')
    )
  })

  return {
    label,
    input,
  }
}

function createModalContactsList() {
  const list = document.createElement('ul')
  list.classList.add('modal__contacts-list', 'list-reset')
  return list
}

function createModalContactItem() {
  const item = document.createElement('li')
  item.classList.add('modal__contacts-item')
  return item
}

function createContactSelect() {
  const select = document.createElement('select')
  const contactsOptions = ['Телефон', 'Email', 'Facebook', 'VK', 'Другое']

  contactsOptions.forEach(el => {
    const option = document.createElement('option')
    option.textContent = el
    option.value = el
    select.append(option)
  })

  return select
}

function createDeleteContactButton() {
  const button = document.createElement('button')
  button.classList.add('modal__contacts-btn-delete', 'btn-reset')
  button.setAttribute('type', 'button')
  button.innerHTML = `
  <svg class="delete-contact-icon" width="12" height="12">
    <use xlink:href="images/sprites.svg#delete-contact"></use>
  </svg>`
  return button
}

function createContactInput () {
  const input = document.createElement('input')
  input.classList.add('modal__contacts-input')
  input.placeholder = 'Введите данные контакта'
  input.setAttribute('required', true)
  return input
}

function setPhoneType (input) {
  const im = new Inputmask("+7 (999) 999-99-99")
  im.mask(input)
  input.setAttribute('minlength', 11)
}

function createContactBlock(type = null, value = '') {
  const contactItem = createModalContactItem()
  const selectElement = createContactSelect()
  const contactFill = createContactInput()
  const contactDeleteButton = createDeleteContactButton()

  selectElement.value = type
  contactFill.value = value

  if (type === null) {
    setPhoneType(contactFill)
  }

  selectElement.addEventListener('change', () => {
    contactFill.value = ''
    if (selectElement.value !== 'Телефон') {
      contactFill.inputmask.remove()
      contactFill.setAttribute('minlength', 2)
      contactFill.setAttribute('type', 'text')
    } else {
      contactFill.setAttribute('type', 'email')
    }

    if (selectElement.value === 'Телефон') {
      setPhoneType(contactFill)
    }
  })

  contactItem.append(selectElement)
  contactItem.append(contactFill)
  contactItem.append(contactDeleteButton)

  const choices = new Choices(selectElement, {
    position: 'bottom',
    itemSelectText: '',
    searchEnabled: false,
    shouldSort: false,
  })

  return {
    contactItem,
    contactDeleteButton,
  }
}

function createAddContactButton() {
  const addContactButton = document.createElement('button')
  addContactButton.classList.add('modal__btn-add', 'btn-reset')
  addContactButton.setAttribute('type', 'button')
  addContactButton.innerHTML = `
  <svg class="modal__icon-add" width="14" height="14">
    <use xlink:href="images/sprites.svg#add-contact"></use>
  </svg>
  Добавить контакт`
  return addContactButton
}

function createModalPrimaryButton(className, text) {
  const saveButton = document.createElement('button')
  saveButton.classList.add(className, 'btn-primary', 'btn-reset')
  saveButton.textContent = text
  return saveButton
}

function createModalSecondaryButton() {
  const secondaryButton = document.createElement('button')
  secondaryButton.classList.add('modal__btn-secondary', 'btn-reset')
  return secondaryButton
}

function createModalDescr() {
  const descr = document.createElement('p')
  descr.classList.add('modal__descr')
  descr.textContent = 'Вы действительно хотите удалить данного клиента?'
  return descr
}

function validation(inputArr) {
  inputArr.forEach(input => {
    input.value.trim()
    input.classList.remove('invalide')
    if (input.validity.valueMissing) {
      input.classList.add('invalide')
    } else if (input.validity.patternMismatch) {
      input.classList.add('invalide')
    } else if (input.validity.tooLong || input.validity.tooShort) {
      input.classList.add('invalide')
    } else if (input.validity.typeMismatch) {
      input.classList.add('invalide')
    }
  })
}

function createButtonLoader() {
  const loader = document.createElement('span') 
  loader.classList.add('btn-loader')
  loader.innerHTML = `
  <svg class="spinner btn-spinner" width="16" height="16">
    <use xlink:href="images/sprites.svg#miniloader"></use>
  </svg>`
  return loader
}

export function createDeleteClientModal({ onDelete }, client, row) {
  const modalContent = createModalBlock('modal__content')
  const modalСontainer = createModalBlock('delete__container')
  const modalCloseButton = createCloseButton(modalContent)
  const modalTitle = createModalTitle('Удалить клиента')
  const modalDescr = createModalDescr()
  const modalBtnsWrapper = createModalBlock('modal__btns')
  const modalDeleteButton = createModalPrimaryButton('modal__btn-delete', 'Удалить')
  const modalSecondaryButton = createModalSecondaryButton()

  modalTitle.classList.add('delete-title')
  modalSecondaryButton.textContent = 'Отменить'

  modalBtnsWrapper.append(modalDeleteButton)
  modalBtnsWrapper.append(modalSecondaryButton)
  modalСontainer.append(modalCloseButton)
  modalСontainer.append(modalTitle)
  modalСontainer.append(modalDescr)
  modalСontainer.append(modalBtnsWrapper)
  modalContent.append(modalСontainer)

  modalDeleteButton.addEventListener('click', () => {
    modalDeleteButton.disabled = true
    const loader = createButtonLoader()
    modalDeleteButton.prepend(loader)
    setTimeout(() => {
      onDelete(client.id)
      row.remove()
      onClose(modalContent)
    }, 750);
  })

  modalSecondaryButton.addEventListener('click', () => {
    onClose(modalContent)
  })

  return modalContent
}

export function createClientModal({ onSave, onEdit }, client = null, row) {
  const modalContent = createModalBlock('modal__content')
  const modalTop = createModalBlock('modal__container')
  const modalBottom = createModalBlock('modal__container')
  const modalContacts = createModalBlock('modal__contacts')
  const modalBtnsWrapper = createModalBlock('modal__btns')
  const modalTitle = client ? createModalTitle('Изменить данные', client.id) : createModalTitle()
  const modalCloseButton = createCloseButton(modalContent)
  const modalForm = createModalForm()
  const inputName = client ? createModalInput('Имя', client.name) : createModalInput('Имя')
  const inputSurname = client ? createModalInput('Фамилия', client.surname) : createModalInput('Фамилия')
  const inputLastname = client ? createModalInput('Отчество', client.lastName, false) : createModalInput('Отчество', '', false)
  const modalInputs = [inputSurname.input, inputName.input, inputLastname.input]
  const modalaAddContactButton = createAddContactButton()
  const modalContactsList = createModalContactsList()
  const errorWrapper = createModalBlock('modal__error-wrapper')
  const modalSaveButton = createModalPrimaryButton('modal__brn-save', 'Сохранить')
  const modalSecondaryButton = createModalSecondaryButton()

  let contactsBlocks = []

  function checkContacts() {
    if (contactsBlocks.length === 9) {
      modalBottom.append(modalaAddContactButton)
    }
  }

  if (client) {
    modalSecondaryButton.textContent = 'Удалить клиента'
    modalSecondaryButton.addEventListener('click', () => {
      onClose(modalContent)
      modal.append(createDeleteClientModal(handlers, client, row))
      modal.classList.add('visible')
    })
    client.contacts.forEach(contact => {
      const contactBlock = createContactBlock(contact.type, contact.value)
      const contactBlockItem = contactBlock.contactItem
      const contactBlockButton = contactBlock.contactDeleteButton
      contactBlockButton.addEventListener('click', () => {
        contactBlockItem.remove()
        contactsBlocks.pop()
        checkContacts()
      })
      modalContactsList.append(contactBlock.contactItem)
    })
  } else {
    modalSecondaryButton.textContent = 'Отменить'
    modalSecondaryButton.addEventListener('click', () => {
      onClose(modalContent)
    })
  }

  modalTop.append(modalCloseButton)
  modalTop.append(modalTitle)
  modalTop.append(inputSurname.label)
  modalTop.append(inputName.label)
  modalTop.append(inputLastname.label)
  modalBottom.append(modalContactsList)
  modalBottom.append(modalaAddContactButton)
  modalContacts.append(modalBottom)
  modalForm.append(modalTop)
  modalForm.append(modalContacts)
  modalBtnsWrapper.append(modalSaveButton)
  modalBtnsWrapper.append(modalSecondaryButton)
  modalContent.append(modalForm)
  modalContent.append(errorWrapper)
  modalContent.append(modalBtnsWrapper)

  modalaAddContactButton.addEventListener('click', () => {
    const contactBlock = createContactBlock()
    const contactBlockItem = contactBlock.contactItem
    const contactBlockButton = contactBlock.contactDeleteButton
    contactsBlocks.push(contactBlockItem)
    contactBlockButton.addEventListener('click', () => {
      contactBlockItem.remove()
      contactsBlocks.pop()
      checkContacts()
    })
    modalContactsList.append(contactBlockItem)
    if (contactsBlocks.length > 9) modalaAddContactButton.remove()
  })

  modalSaveButton.addEventListener('click', () => {
    errorWrapper.innerHTML = ''
    let contactsInputs = document.querySelectorAll('.modal__contacts-input')
    validation(contactsInputs)
    validation(modalInputs)

    if (modalForm.checkValidity()) {
      modalSaveButton.disabled = true
      const loader = createButtonLoader()
      modalSaveButton.prepend(loader)

      setTimeout(() => {
        let contactsArray = []
        const contactsItemsList = modalContactsList.childNodes
      
        contactsItemsList.forEach(el => {
          const selectValue = el.querySelector('select').value
          const inputValue = el.querySelector('input').value
          const contact = {
            type: selectValue,
            value: inputValue,
          }

          contactsArray.push(contact)
        })

        let data = {
          name: inputName.input.value,
          surname: inputSurname.input.value,
          lastName: inputLastname.input.value,
          contacts: contactsArray,
        }

        if (client) {
          onEdit(data, client.id)
        } else {
          onSave(data)
        }

        onClose(modalContent)
      }, 750);
    } else {
      const errorMassege = document.createElement('p')
      errorMassege.classList.add('error')
      errorMassege.textContent = 'Ошибка: новая модель организационной деятельности предполагает независимые способы реализации поставленных обществом задач!'
      errorWrapper.append(errorMassege)
    }
  })

  return modalContent
}


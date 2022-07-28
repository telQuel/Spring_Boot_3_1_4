const URL = "http://localhost:8080/rest/"
const tableAllUsers = document.querySelector('#allUsers')

async function loadUsersAllTable(url, table) {
    let tableBody = table.querySelector("tbody");
    let response = await fetch(url);
    let rows = await response.json();
    const keys = ["id", "firstName", "lastName", "age", "email", "roles", "Edit", "Delete"];

    tableBody.innerHTML = "<tr></tr>";
    table.className = "table table-striped";

    for (const row of rows) {
        let rowEl = document.createElement("tr")
        for (const key of keys) {
            let cellEl = document.createElement("td")
            if (key === "roles"&& row[key].length > 0) {
                if (row[key][1]) {
                    cellEl.textContent = row[key][0]["name"] + ", "
                }
                cellEl.textContent = row[key][0]["name"]
                rowEl.appendChild(cellEl)
                continue;
            }
            if (key === "Edit") {
                const button = document.createElement("button")
                button.className = "btn btn-info"
                button.id = 'editButton'
                button.type = "button"
                button.textContent = "Edit"
                button.setAttribute("data-bs-target", "#exampleModal3")
                button.setAttribute('data-bs-toggle', 'modal')
                button.addEventListener('click', () => {
                    let editModal = document.getElementById('editModal')
                    let modalEdit = new bootstrap.Modal(editModal)
                    let modalBody = editModal.getElementsByClassName('modal-body')[0].children[0].children

                    modalBody[0].children[1].value = row.id
                    modalBody[1].children[1].value = row.firstName
                    modalBody[2].children[1].value = row.lastName
                    modalBody[3].children[1].value = row.age
                    modalBody[4].children[1].value = row.email
                    modalBody[5].children[1].value = row.password
                    modalBody[6].children[1].innerHTML = ""

                    if (row['roles'].length > 0) {
                        if (row['roles'][1]) {
                            let option = document.createElement('option')
                            option.text = row['roles'][1]['name']
                            modalBody[6].children[1].add(option, null)
                        }
                        let option = document.createElement('option')
                        option.text = row['roles'][0]['name']
                        modalBody[6].children[1].add(option, null)
                    }
                    modalEdit.show({})
                })
                cellEl.appendChild(button)
                rowEl.appendChild(cellEl)
                continue;
            }
            if (key === "Delete") {
                const button = document.createElement("button")
                button.className = "btn btn-danger"
                button.id = 'deleteButton'
                button.type = "button"
                button.textContent = "Delete"
                button.addEventListener('click', () => {
                    let modalDelete = document.getElementById('deleteModal')
                    let modalBody = modalDelete.getElementsByClassName('modal-body')[0].children[0].children
                    let modalDel = new bootstrap.Modal(modalDelete)

                    modalBody[0].children[1].value = row.id
                    modalBody[1].children[1].value = row.firstName
                    modalBody[2].children[1].value = row.lastName
                    modalBody[3].children[1].value = row.age
                    modalBody[4].children[1].value = row.email
                    modalBody[5].children[1].value = row.password
                    modalBody[6].children[1].innerHTML = ""

                    if (row['roles'].length > 0) {
                        if (row['roles'][1]) {
                            let option = document.createElement('option')
                            option.text = row['roles'][1]['name']
                            modalBody[6].children[1].add(option, null)
                        }
                        let option = document.createElement('option')
                        option.text = row['roles'][0]['name']
                        modalBody[6].children[1].add(option, null)
                    }
                    modalDel.show({})
                })
                cellEl.appendChild(button)
                rowEl.appendChild(cellEl)
                continue;
            }
            cellEl.textContent = row[key]
            rowEl.appendChild(cellEl)
        }
        tableBody.appendChild(rowEl)
    }
    return response
}


loadUsersAllTable(URL, tableAllUsers)
setInterval(() => loadUsersAllTable(URL, tableAllUsers), 5000)


// Edit User
const editButton = document.querySelector('#editButton')

editButton.addEventListener('click', (event) => {
    event.preventDefault()
    let editModal = document.querySelector('#editModal')
    let editRole = editModal.querySelector('#role_edit')
    let arrayRoles = []

    if (editRole.length > 0) {
        let id = 1
        id = editRole[0].value === 'ROLE_ADMIN' ? id = 2 : id = 1
        let role = {id, name: editRole[0].value}
        arrayRoles.push(role)
        if (editRole.length > 1) {
            id = editRole[0].value === 'ROLE_USER' ? id = 1 : id = 2
            arrayRoles.push({id: editRole[1].value})
        }
    }

    const json = JSON.stringify({
        id: editModal.querySelector('#Id_edit').value,
        firstName: editModal.querySelector('#First_name_edit').value,
        lastName: editModal.querySelector('#LastName_edit').value,
        age: editModal.querySelector('#Age_edit').value,
        email: editModal.querySelector('#Email_edit').value,
        password: editModal.querySelector('#Password_edit').value,
        roles: arrayRoles
    })
    fetch(URL + 'updateUser', {
        method: 'PUT', headers: {'Content-Type': 'application/json'}, body: json
    }).then()
        .catch(e => console.log(e))

    loadUsersAllTable(URL, tableAllUsers)

    let modalEdit = bootstrap.Modal.getInstance(editModal)
    modalEdit.hide()
})

//Delete By Id
const deleteButton = document.querySelector('#deleteButton')

deleteButton.addEventListener('click', (event) => {
    event.preventDefault()

    let deleteModal = document.querySelector('#deleteModal')
    let deleteId = deleteModal.querySelector('#Id_delete')

    fetch(URL + `deleteUser/${deleteId.value}`, {
        method: 'DELETE'
    }).then()
        .catch(e => console.log(e))

    let modalDelete = bootstrap.Modal.getInstance(deleteModal)
    modalDelete.hide()
    loadUsersAllTable(URL, tableAllUsers)
})


loadUsersAllTable(URL, tableAllUsers)

//Add new user
const addUserButton = document.querySelector('#addNewUser')

addUserButton.addEventListener('click', (event) => {
    event.preventDefault()
    let formAdd = document.querySelector('#formAdd')
    let newName = formAdd.querySelector('#firstName_new')
    let newSurname = formAdd.querySelector('#lastName_new')
    let newAge = formAdd.querySelector('#age_new')
    let newEmail = formAdd.querySelector('#email_new')
    let newPassword = formAdd.querySelector('#password_new')
    let newRole = formAdd.querySelector('#role_new')
    let arrayRoles = []

    if (newRole[0].selected) {
        let id = 2
        id = newRole[0].value === 'ROLE_ADMIN' ? id = 2 : id = 1
        let role = {id, name: newRole[0].value}
        arrayRoles.push(role)
    }
    if (newRole[1].selected) {
        let id = 1
        id = newRole[1].value === 'ROLE_USER' ? id = 1 : id = 2
        let role = {id, name: newRole[1].value}
        arrayRoles.push(role)
    }

    let json = JSON.stringify({
        firstName: newName.value,
        lastName: newSurname.value,
        age: newAge.value,
        email: newEmail.value,
        password: newPassword.value,
        roles: arrayRoles
    })

    let hasErrorEmpty = false
    let objectJSON = JSON.parse(json)

    for (const jsonElement in objectJSON) {
        if (objectJSON[jsonElement] === "") {
            window.alert(jsonElement + " cannot be empty!")
            hasErrorEmpty = true
            break;
        }
    }

    if (!hasErrorEmpty) {
        fetch(URL + 'addNewUser', {
            credentials: 'include',
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: json
        }).then()
            .catch(e => console.log(e))
        window.alert("User added")
    }
    loadUsersAllTable(URL, tableAllUsers)
    newName.value = ""
    newSurname.value = ""
    newAge.value = ""
    newEmail.value = ""
    newPassword.value = ""
})
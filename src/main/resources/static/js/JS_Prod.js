const url = "http://localhost:8080/rest/"
const urlAddNewUser = "http://localhost:8080/rest/addNewUser"
const urlUpdateUser = "http://localhost:8080/rest/updateUser"
const tableAllUsers = document.querySelector('#allUsers')

async function loadUsersAllTable(url, table) {
    const tableBody = table.querySelector("tbody");
    const response = await fetch(url);
    const rows = await response.json();
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
                //const openModal = document.createElement("a")
                const button = document.createElement("button")
                button.className = "btn btn-info"
                button.id = 'editButton'
                button.type = "button"
                button.textContent = "Edit"
                button.setAttribute("data-bs-target", "#exampleModal3")
                button.setAttribute('data-bs-toggle', 'modal')
                button.setAttribute('user_id', row.id)
                button.addEventListener('click', () => {
                    let editModal = document.getElementById('editModal')
                    const modalEdit = new bootstrap.Modal(editModal)
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
                    console.log(modalBody)
                    console.log(modalBody[1])
                    console.log(modalBody[6].children[1])

                    const modalDel = new bootstrap.Modal(modalDelete)
                    const idDelete = document.querySelector('#Id_delete')

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


loadUsersAllTable(url, tableAllUsers)
setInterval(() => loadUsersAllTable(url, tableAllUsers), 5000)


// Edit User
const editButton = document.querySelector('#editButton')

editButton.addEventListener('click', (event) => {
    event.preventDefault()
    const editModal = document.querySelector('#editModal')
    console.log('submit')
    const editId = editModal.querySelector('#Id_edit')
    console.log(editId.value)
    const editName = editModal.querySelector('#First_name_edit')
    const editSurname = editModal.querySelector('#LastName_edit')
    const editAge = editModal.querySelector('#Age_edit')
    const editEmail = editModal.querySelector('#Email_edit')
    const editPassword = editModal.querySelector('#Password_edit')
    const editRole = editModal.querySelector('#role_edit')
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

    console.log(editRole[0].selected)
    console.log(arrayRoles)
    const json = JSON.stringify({
        id: editId.value,
        firstName: editName.value,
        lastName: editSurname.value,
        age: editAge.value,
        email: editEmail.value,
        password: editPassword.value,
        roles: arrayRoles
    })
    fetch(urlUpdateUser, {
        method: 'PUT', headers: {'Content-Type': 'application/json'}, body: json
    }).then()
        .catch(e => console.log(e))
    loadUsersAllTable(url, tableAllUsers)
})

//Delete By Id
const deleteButton = document.querySelector('#deleteButton')

deleteButton.addEventListener('click', (event) => {
    event.preventDefault()
    const deleteModal = document.querySelector('#deleteModal')
    console.log('submit_del')
    const deleteId = deleteModal.querySelector('#Id_delete')
    fetch(url + `deleteUser/${deleteId.value}`, {
        method: 'DELETE'
    }).then()
        .catch(e => console.log(e))
    loadUsersAllTable(url, tableAllUsers)
})


loadUsersAllTable(url, tableAllUsers)

//Add new user
const addUserButton = document.querySelector('#addNewUser')

addUserButton.addEventListener('click', (event) => {
    event.preventDefault()
    const formAdd = document.querySelector('#formAdd')
    const newName = formAdd.querySelector('#firstName_new')
    const newSurname = formAdd.querySelector('#lastName_new')
    const newAge = formAdd.querySelector('#age_new')
    const newEmail = formAdd.querySelector('#email_new')
    const newPassword = formAdd.querySelector('#password_new')
    const newRole = formAdd.querySelector('#role_new')
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

    const json = JSON.stringify({
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
        console.log(json);
        fetch(urlAddNewUser, {
            credentials: 'include',
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: json
        }).then()
            .catch(e => console.log(e))
        window.alert("User added")
    }
    loadUsersAllTable(url, tableAllUsers)
    newName.value = ""
    newSurname.value = ""
    newAge.value = ""
    newEmail.value = ""
    newPassword.value = ""
})
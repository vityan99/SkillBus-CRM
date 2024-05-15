export async function getClientsData() {
  const response = await fetch('http://localhost:3000/api/clients')  
  const data = await response.json()
  return data
}

export async function postNewClient(obj) {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify(obj)
  }) 
}

export async function patchClient(id, obj) {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(obj)
  }) 
}

export async function deleteClient(id) {
  fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'DELETE'
  }) 
}

export async function getClientData(id) {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`);
  return await response.json();
}


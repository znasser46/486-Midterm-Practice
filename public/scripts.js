
let editingId = null;


document.getElementById('nameForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;



 try {
    const url = editingId ? `/api/names/${editingId}` : '/api/names';
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    const result = await response.json();

    if (response.ok) {
      showMessage(result.message, 'success');
      document.getElementById('nameForm').reset();
      if (editingId) {
        editingId = null;
        document.querySelector('button[type="submit"]').textContent = 'Save Name';
      } 
      loadNames();
    } else {
      showMessage(result.error, 'error');
    }
  } catch (error) {
    showMessage('Error submitting form', 'error');
  }
});

async function loadNames() {
  try {
    const response = await fetch('/api/names');
    const names = await response.json();

    const namesList = document.getElementById('nameList');

    if (names.length === 0) {
      namesList.innerHTML = '<p>No names yet.</p>';
      return;
    }

    namesList.innerHTML = names.map(name => `
          <div class="record">
        <strong>${name.name}</strong> <br> <button class="edit-btn btn btn-secondary" onclick="editName('${name._id}', '${name.name}')">Edit</button> <button class="delete-btn btn btn-danger" onclick="deleteName('${name._id}')">Delete</button></div>
      <hr>
    `).join('');
  } catch (error) {
    document.getElementById('nameList').innerHTML = 'Error loading names';
  }
}


function editName(id, name) {
  editingId = id;
  document.getElementById('name').value = name;
  
  document.querySelector('button[type="submit"]').textContent = 'Update Budget';
  showMessage('Editing budget - click Update to save changes', 'success');
}






async function deleteName(id) {
  if (!confirm('Are you sure you want to delete this name?')) return;

  try {
    const response = await fetch(`/api/names/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (response.ok) {
      showMessage(result.message, 'success');
      loadNames();
    } else {
      showMessage(result.error, 'error');
    }
  } catch (error) {
    showMessage('Error deleting record', 'error');
  }
}


function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
  setTimeout(() => {
    messageDiv.innerHTML = '';
  }, 4000);
}

loadNames();


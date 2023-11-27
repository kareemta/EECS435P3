// Put a submit event listener to the formt with id 'create-donut-form'
document.getElementById('create-donut-form').addEventListener('submit', function(e) {
    // Don't let page reload automatically
    e.preventDefault();

});


// Make sure code is only executed when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // attach createDonutHandler to create-donut-form
    document.getElementById('create-donut-form').addEventListener('submit', createDonutHandler );
    getDonuts();
});

// Get the donuts from the database
function getDonuts() {
    // Make a get request to get donuts
    fetch('../main.php') 
    .then(response => response.json())
    .then(data => {
        displayDonuts(data);
    })

    .catch(error => console.error('Error:', error));
}

// Actually display the donuts
function displayDonuts(donuts) {
    const list = document.getElementById('donut-list');
    // Clear existing donut listings
    list.innerHTML = '';
    donuts.forEach(donut => {
        const div = document.createElement('div');
        div.className = 'donut';
        div.innerHTML = `
            <h3>${donut.Name}</h3>
            <p>${donut.Description}</p>
            <p>$${donut.Price}</p>
            <button onclick="deleteDonut('${donut.ID}')">Delete</button>
            <button onclick="populateEditForm('${donut.ID}', '${donut.Name}', '${donut.Description}', '${donut.Price}')">Edit</button>
        `;
        list.appendChild(div); // Add the div to the list
    });
}

function populateEditForm(id, name, descrip, price) {
    // Populate the form with donut data for editing
    document.getElementById('donut-id').value = id;
    document.getElementById('donut-name').value = name;
    document.getElementById('donut-descrip').value = descrip;
    document.getElementById('donut-price').value = price;
    // Change the form submit to update instead of create
    const form = document.getElementById('create-donut-form');
    form.removeEventListener('submit', createDonutHandler);
    form.addEventListener('submit', updateDonutHandler);
}

// handles form submission when creating a new donut
function createDonutHandler(e) {
    e.preventDefault();
   const id = document.getElementById('donut-id').value;
   const name = document.getElementById('donut-name').value;
   const descrip = document.getElementById('donut-descrip').value;
   const price = document.getElementById('donut-price').value;

   // create the donut with the information from the handler
   createDonut(id, name, descrip, price);
}
// Handles form submission when updating a new donut
function updateDonutHandler(e) {
    e.preventDefault();
    
    const id = document.getElementById('donut-id').value;
    const name = document.getElementById('donut-name').value;
    const descrip = document.getElementById('donut-descrip').value;
    const price = document.getElementById('donut-price').value;

    // update the donut with the information from the handler
    updateDonut(id, name, descrip, price);
}

// send a post request to create the new donut
function createDonut(id, name, descrip, price) {
    fetch('../main.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // convert data to json
        body: JSON.stringify({ID: id, Name: name, Description: descrip, Price: price })
    })
    .then (resp => resp.json())
    .then(data => {
        alert('Donut Has Been Successfully Created');
        console.log(data);
    })
    .catch(error => {
        console.error('Error', error);
    });
}
// send a put request to update an existing donut
function updateDonut(id, newName, newDescrip, newPrice) {
    fetch('../main.php', {
        method: 'PUT',
        headers: {
            // content type is for form data
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        // encode the data for the query
        body: `ID=${id}&Name=${newName}&Description=${newDescrip}&Price=${newPrice}`
    })
    .then(resp => resp.json())
    .then(data => {
        alert('Donut Has Been Successfully Updated');
        console.log(data);
    })
    .catch (error => {
        console.error('Error', error);
    });
}

// send a delete request so we can delete a donut
function deleteDonut(id) {
    fetch('../main.php', {
        method: 'DELETE',
       headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
       },
       body: `ID=${id}` 
    })

    .then(resp=> resp.json())
    .then(data => {
        alert('Donut Has Been Successfully Deleted');
        console.log(data);
    })
    .catch(error => {
        console.error('Error', error);
    });
}
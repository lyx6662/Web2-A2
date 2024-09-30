document.addEventListener('DOMContentLoaded', function () {
    // Get the ID from local storage.
    const ID = localStorage.getItem('ID');
    if (ID) {
        // Construct the URL using the ID.
        const url = 'http://localhost:3060/api/A2people/fundraiser/' + ID;
        // Send a request to fetch fundraiser data.
        fetch(url)
           .then(response => response.json())
           .then(data => {
                const dataDiv = document.getElementById('data');
                dataDiv.innerHTML = "";
                console.log(data);
                if (data) {
                    // Create a table to display fundraiser data.
                    const table = document.createElement('table');
                    const thead = table.createTHead();
                    const row = thead.insertRow();
                    const headers = ['Findraiser ID', 'ORGANIZER', 'CAPTION', 'TARGET_FUNDING', 'CURRENT_FUNDING', 'CITY', 'ACTIVE'];
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        row.appendChild(th);
                    });
                    const tbody = table.createTBody();
                    const dataRow = tbody.insertRow();
                    const values = [data.FUNDRAISER_ID, data.ORGANIZER, data.CAPTION, data.TARGET_FUNDING, data.CURRENT_FUNDING, data.CITY, data.ACTIVE === 1? 'true' : 'false'];
                    values.forEach((value, index) => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        dataRow.appendChild(td);
                    });
                    // Append the table to the dataDiv.
                    dataDiv.appendChild(table);
                } else {
                    dataDiv.textContent = "No fundraiser";
                }
            });
    }
});

function pay() {
    // Display an alert indicating that the feature is under development.
    alert('Features are under development');
}
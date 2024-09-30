document.addEventListener('DOMContentLoaded', function () {
    // Get the Radio_box element on the page.
    const Radio_box = document.getElementById('Radio_box');
    // Send a request to get category data.
    fetch('http://localhost:3060/api/A2people/gategory')
      .then(response => response.json())
      .then(data => {
            // Iterate over the category data.
            data.forEach(option => {
                // Ensure there is a NAME property in the data.
                if (option && option['NAME']) {
                    // Create a radio button input element.
                    const Select = document.createElement('input');
                    Select.type = 'radio';
                    Select.value = option['NAME'];
                    Select.id = 'Select_' + option['NAME'];
                    Select.name = 'option';
                    // Create a label element.
                    const label = document.createElement('label');
                    label.textContent = option['NAME'];
                    label.htmlFor = 'Select_' + option['NAME'];
                    // Add the radio button, label, and a line break to Radio_box.
                    Radio_box.appendChild(Select);
                    Radio_box.appendChild(label);
                    Radio_box.appendChild(document.createElement('br'));
                } else {
                    console.log('No data', option);
                }
            });
        })
      .catch(error => console.error('Error:', error));
});

document.getElementById('searchButton').addEventListener('click', () => {
    // Get the organizer name from the input box.
    const organizer = document.getElementById('organizer').value;
    // Get the city name from the input box.
    const city = document.getElementById('city').value;
    // Get the value of the checked radio button. If none is checked, it will be undefined.
    let name = document.querySelector('input[name = "option"]:checked')?.value;
    if (name === undefined) {
        name = '';
    }

    let searchParams = [];
    // Add the corresponding parameter name to the search parameter array based on whether there is an input value.
    if (organizer) searchParams.push('ORGANIZER');
    if (name) searchParams.push('NAME');
    if (city) searchParams.push('CITY');

    if (searchParams.length === 0 || (!organizer &&!name &&!city)) {
        const resultsDiv = document.getElementById('results');
        // If no filter is selected, display a warning message.
        const warningDiv = document.createElement('div');
        warningDiv.textContent = "Please select filters";
        warningDiv.style.color = 'orange';
        warningDiv.style.fontWeight = 'bold';
        resultsDiv.appendChild(warningDiv);
        return;
    }

    // Send a search request.
    fetch(`http://localhost:3060/api/A2people/Search/${searchParams.join(',')}?${organizer? `organizer=${organizer}` : ''}${name? `&categoryName=${name}` : ''}${city? `&city=${city}` : ''}`)
      .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
      .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            if (data.length > 0) {
                const table = document.createElement('table');
                const headerRow = table.insertRow();
                // Create table headers.
                ['ID', 'Organizer', 'Caption', 'Target Funding', 'Current Funding', 'City', 'Active', 'Category ID', 'LINK'].forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });

                data.forEach(fundraiser => {
                    const row = table.insertRow();
                    // Fill table row data.
                    [fundraiser.FUNDRAISER_ID, fundraiser.ORGANIZER, fundraiser.CAPTION, fundraiser.TARGET_FUNDING, fundraiser.CURRENT_FUNDING, fundraiser.CITY, fundraiser.ACTIVE === 1? 'true' : 'false', fundraiser.CATEGORY_ID].forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        row.appendChild(td);
                    });
                    // Create a hyperlink cell.
                    const linkCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = 'LINK';
                    link.style.cursor = 'pointer';
                    linkCell.appendChild(link);
                    row.appendChild(linkCell);

                    link.addEventListener("click", function () {
                        // Store the fundraiser ID in local storage.
                        localStorage.setItem("ID", fundraiser.FUNDRAISER_ID);
                        location.href = '/fundraiser';
                        console.log(localStorage.getItem("ID"));
                    });
                });

                resultsDiv.appendChild(table);
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.style.color = 'red';
                errorMessage.style.fontWeight = 'bold';
                errorMessage.textContent = 'No fundraiser was found';
                resultsDiv.appendChild(errorMessage);
            }
        })
      .catch(error => {
            console.error('Error fetching data:', error);
            if (error.message.includes('500')) {
                document.getElementById('results').textContent = 'Internal server error. Please check the server logs for more details.';
            } else if (error.message.includes('404')) {
                document.getElementById('results').textContent = 'Resource not found. Please select filters';
            } else if (error.message.includes('SyntaxError')) {
                document.getElementById('results').textContent = 'Received unexpected data. The server might not be returning JSON as expected.';
            } else {
                document.getElementById('results').textContent = 'An unknown error occurred while fetching data. Check the console for more details.';
            }
        });
});

function claerChechboxes() {
    // Clear the values of the organizer and city input boxes.
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    const Selected = document.querySelectorAll('input[id^="Select_"]');
    Selected.forEach(function (Selected) {
        Selected.checked = false;
    });
    const resultsDiv = document.getElementById('results');
    // Clear the content of the results display area.
    resultsDiv.textContent = "";
}
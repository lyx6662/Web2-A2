document.addEventListener('DOMContentLoaded', function () {
    const Radio_box = document.getElementById('Radio_box');
    fetch('http://localhost:3060/api/A2people/gategory')
     .then(response => response.json())
     .then(data => {
            data.forEach(option => {
                if (option && option['NAME']) {
                    const Select = document.createElement('input');
                    Select.type = 'radio';
                    Select.value = option['NAME'];
                    Select.id = 'Select_' + option['NAME'];
                    Select.name = 'option';
                    const label = document.createElement('label');
                    label.textContent = option['NAME'];
                    label.htmlFor = 'Select_' + option['NAME'];
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
    const organizer = document.getElementById('organizer').value;
    const city = document.getElementById('city').value;
    let name = document.querySelector('input[name = "option"]:checked')?.value;
    if (name === undefined) {
        name = '';
    }

    let searchParams = [];
    if (organizer) searchParams.push('ORGANIZER');
    if (name) searchParams.push('NAME');
    if (city) searchParams.push('CITY');

    if (searchParams.length === 0 || (!organizer &&!name &&!city)) {
        const resultsDiv = document.getElementById('results');
        const warningDiv = document.createElement('div');
        warningDiv.textContent = "Please select filters";
        warningDiv.style.color = 'orange';
        warningDiv.style.fontWeight = 'bold';
        resultsDiv.appendChild(warningDiv);
        return;
    }

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
                // Create header
                ['ID', 'Organizer', 'Caption', 'Target Funding', 'Current Funding', 'City', 'Active', 'Category ID', 'LINK'].forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });

                data.forEach(fundraiser => {
                    const row = table.insertRow();
                    // Fill row
                    [fundraiser.FUNDRAISER_ID, fundraiser.ORGANIZER, fundraiser.CAPTION, fundraiser.TARGET_FUNDING, fundraiser.CURRENT_FUNDING, fundraiser.CITY, fundraiser.ACTIVE === 1? 'true' : 'false', fundraiser.CATEGORY_ID].forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        row.appendChild(td);
                    });
                    // Create hyperlinked cells
                    const linkCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = 'LINK';
                    link.style.cursor = 'pointer';
                    linkCell.appendChild(link);
                    row.appendChild(linkCell);

                    link.addEventListener("click", function () {
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
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    document.querySelectorAll('input[id^="Select_"]');
    const Selected = document.querySelectorAll('input[id^="Select_"]');
        Selected.forEach(function (Selected) {
                Selected.checked = false;
    });
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = "";
}
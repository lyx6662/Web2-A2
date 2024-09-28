document.getElementById('searchButton').addEventListener('click', () => {
    const organizer = document.getElementById('organizer').value;
    const city = document.getElementById('city').value;
    const name = document.getElementById('name').value;

    let searchParams = [];
    if (organizer) searchParams.push('ORGANIZER');
    if (name) searchParams.push('NAME');
    if (city) searchParams.push('CITY');

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
                // 创建表头
                ['Organizer', 'Category Name', 'City'].forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });

                data.forEach(fundraiser => {
                    const row = table.insertRow();
                    // 填充数据行
                    [fundraiser.ORGANIZER, fundraiser.category_name, fundraiser.CITY].forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        row.appendChild(td);
                    });
                });

                resultsDiv.appendChild(table);
            } else {
                resultsDiv.textContent = 'No results found.';
            }
        })
      .catch(error => {
            console.error('Error fetching data:', error);
            if (error.message.includes('500')) {
                document.getElementById('results').textContent = 'Internal server error. Please check the server logs for more details.';
            } else if (error.message.includes('404')) {
                document.getElementById('results').textContent = 'Resource not found. Check the API path and if the server is running correctly.';
            } else if (error.message.includes('SyntaxError')) {
                document.getElementById('results').textContent = 'Received unexpected data. The server might not be returning JSON as expected.';
            } else {
                document.getElementById('results').textContent = 'An unknown error occurred while fetching data. Check the console for more details.';
            }
        });
});
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
                ['','Organizer', 'Category Name', 'City'].forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });

                data.forEach(fundraiser => {
                    const row = table.insertRow();
                    // 创建超链接单元格
                    const linkCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = 'LINK';
                    linkCell.appendChild(link);
                    row.appendChild(linkCell);
                    // 填充其他数据行
                    [fundraiser.ORGANIZER, fundraiser.category_name, fundraiser.CITY].forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        row.appendChild(td);
                    });
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
                errorMessage.textContent = '没有找到筹款人。';
                resultsDiv.appendChild(errorMessage);
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

function claerChechboxes() {
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    document.getElementById('name').value = '';
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = "";
}
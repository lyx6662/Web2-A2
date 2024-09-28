fetch("http://localhost:3060/api/A2people")
.then(response => response.json())
.then(data => {
    const dataDiv = document.getElementById('data');
    dataDiv.innerHTML = "";

    if (data.length > 0) {
        const table = document.createElement('table');
        const headerRow = table.insertRow();
        // 创建表头
        ['Organizer', 'Caption', 'Target Funding', 'Current Funding', 'City', 'Active', 'Category ID'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        data.forEach(fundraiser => {
            const row = table.insertRow();
            // 填充数据行
            [fundraiser.ORGANIZER, fundraiser.CAPTION, fundraiser.TARGET_FUNDING, fundraiser.CURRENT_FUNDING, fundraiser.CITY, fundraiser.ACTIVE === 1? 'true' : 'false', fundraiser.CATEGORY_ID].forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
        });

        dataDiv.appendChild(table);
    } else {
        dataDiv.textContent = "No data";
    }
})
.catch(error => {
    console.error("Error fetching data", error);
    document.getElementById('data').textContent = "Failed to load data";
});
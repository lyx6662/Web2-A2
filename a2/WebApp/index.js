fetch("http://localhost:3060/api/A2people")
  .then(response => response.json())
  .then(data => {
        const dataDiv = document.getElementById('data');
        dataDiv.innerHTML = "";

        if (data.length > 0) {
            const table = document.createElement('table');
            const headerRow = table.insertRow();
            // 创建表头
            ['ID', 'Organizer', 'Caption', 'Target Funding', 'Current Funding', 'City', 'Active', 'Category', 'LINK'].forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            data.forEach(fundraiser => {
                if (fundraiser.ACTIVE === 1) {
                    const row = table.insertRow();
                    // 填充数据行
                    [fundraiser.FUNDRAISER_ID, fundraiser.ORGANIZER, fundraiser.CAPTION, fundraiser.TARGET_FUNDING, fundraiser.CURRENT_FUNDING, fundraiser.CITY, fundraiser.ACTIVE === 1? 'true' : 'false', fundraiser.CATEGORY_ID].forEach(cellData => {
                        const td = document.createElement('td');
                        if (cellData === fundraiser.CATEGORY_ID) {
                            let categoryText;
                            switch (cellData) {
                                case 1:
                                    categoryText = 'Orphan';
                                    break;
                                case 2:
                                    categoryText = 'Poor Student';
                                    break;
                                case 3:
                                    categoryText = 'Disabled People';
                                    break;
                                default:
                                    categoryText = '';
                            }
                            td.textContent = categoryText;
                        } else {
                            td.textContent = cellData;
                        }
                        row.appendChild(td);
                    });
                    // 创建超链接单元格
                    const linkCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = 'LINK';
                    link.style.cursor = 'pointer';
                    link.style.color = 'blue';
                    link.style.textDecoration = 'underline';
                    linkCell.appendChild(link);
                    row.appendChild(linkCell);

                    link.addEventListener("click", function () {
                        localStorage.setItem("ID", fundraiser.FUNDRAISER_ID);
                        location.href = '/fundraiser';
                        console.log(localStorage.getItem("ID"));
                    });
                }
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
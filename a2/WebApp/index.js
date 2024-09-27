
        //call GET API to get a list of Concerts
        fetch("http://localhost:3060/api/A2people")
          .then(response => response.json())
          .then(data => {
            
            const dataDiv=document.getElementById('data');
            dataDiv.innerHTML="";

            if(data.length>0){
              data.forEach( fundraiser => {
                  const newP=document.createElement("p");
                  newP.textContent=`Organizer: ${fundraiser.ORGANIZER}, fundraiser ID: ${fundraiser.FUNDRAISER_ID}`;

                  dataDiv.appendChild(newP);
              });

            }
            else{
              dataDiv.textContent="No data";
            }
          })
          .catch(error=>{
            console.error("Error fecthing data",error);
            document.getElementById('data').textContent="Failed to load data";
          });

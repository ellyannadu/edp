document.addEventListener("DOMContentLoaded", function() {
    var modal = document.querySelectorAll(".modal");
    var modalBtns = document.querySelectorAll(".modalBtn");
    var close = document.querySelectorAll(".close");

    modalBtns.forEach(function(btn, index) {
        btn.onclick = function() {
            modal[index].style.display = "block";
            populateModal();
        }
    });

    close.forEach(function(btn) {
        btn.onclick = function() {
            // Close the modal associated with this close button
            var modal = btn.parentElement.parentElement;
            modal.style.display = "none";
          };
        });

        window.onclick = function(event) {
            modals.forEach(function(modal) {
              if (event.target == modal) {
                modal.style.display = "none";
              }
            });
          };


    function populateModal() {
        var employeeData = {
            id: "1",
            empNo: "111",
            firstName: "Juan Roberto Antonio",
            middleName: "Panget",
            lastName: "Tabudlong",
            birthdate: "1999-11-11",
            phoneNo: "09123456789",
            email: "arjtabudlong@gmail.com",
            address: "Purok Bading",
            barangay: "Brgy. Bading",
            city: "Davao",
            province: "Davao del Sur",
            zipCode: "8000",
            actions: '<div class="button-container">' + '<button id="updateBtn" class="modalBtn"><i class="fa-regular fa-pen-to-square"></i></button>' + '<button class="modalBtn"><i class="fa-solid fa-trash"></i></button>' + '</div>',
        };

        var modalBody = document.getElementById("employee-modal-body");
        modalBody.innerHTML = `
            <tr>
                <td>${employeeData.id}</td>
                <td>${employeeData.empNo}</td>
                <td>${employeeData.firstName}</td>
                <td>${employeeData.middleName}</td>
                <td>${employeeData.lastName}</td>
                <td>${employeeData.birthdate}</td>
                <td>${employeeData.phoneNo}</td>
                <td>${employeeData.email}</td>
                <td>${employeeData.address}</td>
                <td>${employeeData.barangay}</td>
                <td>${employeeData.city}</td>
                <td>${employeeData.province}</td>
                <td>${employeeData.zipCode}</td>
                <td>${employeeData.actions}</td>
            </tr>
            `;

    // Get the modal
    var updateModal = document.getElementById('updateModal');

    // Add event listener to the document
    document.addEventListener('click', function(event) {
        // If the clicked element is the updateBtn, display the updateModal
        if (event.target.id === 'updateBtn') {
            updateModal.style.display = 'block';
        }
    });
    }

    

           

            
        
});
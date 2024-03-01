document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("myModal");
    var infoButtons = document.querySelectorAll(".info-button");
    var span = document.getElementsByClassName("close")[0];

    infoButtons.forEach(function(button) {
        button.onclick = function() {
            modal.style.display = "block";
            populateModal(this);
        }
    });

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function populateModal(clickedButton) {
        var employeeData = {
            id: "1",
            empNo: "111",
            firstName: "Arj",
            middleName: "Panget",
            lastName: "Tabudlong",
            birthdate: "1999-11-11",
            phoneNo: "09123456789",
            email: "arjtabudlong@gmail.com",
            address: "tell the truth, it's horrendous",
            barangay: "it's modern / don't lie! / i'm not!",
            city: "Davao",
            province: "Davao del Sur",
            zipCode: "8000",
            actions: '<button class="delete-button"><i class="fa-solid fa-trash"></i></button>'
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
    }
});

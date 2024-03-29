
// Fetch all employees + populate dropdown
window.addEventListener('load', function() {
    getEmployeesAndPopulateList();

    employeeList.addEventListener('click', function(event) {
        const selectedItem = event.target.closest('.employee-list-item');
        if (selectedItem) {
            const selectedName = selectedItem.textContent.trim();
            const selectedValue = selectedItem.dataset.value;
            searchInput.value = selectedName;
            employeeIDInput.value = selectedValue;
            console.log('Selected Name ID:', selectedValue); // Log the selected name
            employeeList.style.display = 'none';
            searchInput.focus();
        }
    });

    employeeList2.addEventListener('click', function(event) {
        getEmployeesAndPopulateList();

        const selectedItem2 = event.target.closest('.employee-list-item');
        if (selectedItem2) {
            const selectedName2 = selectedItem2.textContent.trim();
            const selectedValue2 = selectedItem2.dataset.value;
            editSearchInput.value = selectedName2;
            editLeaveForm.elements['employee-id'].value = selectedValue2;
            console.log('Selected Name ID:', selectedValue2); // Log the selected name
            employeeList2.style.display = 'none';
            editSearchInput.focus();
        }
    });
});

// Filter employee list based on search input on edit modal
function filterList() {
    const searchText = editSearchInput.value.trim().toLowerCase();
    const listItems = employeeList2.getElementsByClassName('employee-list-item');

    // Show list when typing starts
    if (searchText.length > 0) {
        employeeList2.style.display = 'block';
        console.log('Employee List 2:', employeeList2.style.display);
         editLeaveForm.elements['employee-id'].value = ''; // Clear employee ID
    } else {
        employeeList2.style.display = 'none';
    }

    // Filter list items based on search text
    for (const item of listItems) {
        const itemName = item.textContent.trim().toLowerCase();
        if (itemName.includes(searchText)) {
            item.style.display = 'block'; // Show matching item
            console.log('Item:', item);
        } else {
            item.style.display = 'none'; // Hide non-matching item
        }
    }
}

editSearchInput.addEventListener('input', function() {
    filterList();
    console.log('Edit Search Input:', editSearchInput.value);
});

editSearchInput.addEventListener('click', function() {
    console.log('clicked');
    employeeList.style.display = 'block';
    filterList();
});


// Filter employee list based on search input
function filterList2() {
    const searchText = searchInput.value.trim().toLowerCase();
    const listItems = employeeList.getElementsByClassName('employee-list-item');

    // Show list when typing starts
    if (searchText.length > 0) {
        employeeList.style.display = 'block';
        employeeIDInput.value = ''; // Clear employee ID
    } else {
        employeeList.style.display = 'none';
    }

    // Filter list items based on search text
    for (const item of listItems) {
        const itemName = item.textContent.trim().toLowerCase();
        if (itemName.includes(searchText)) {
            item.style.display = 'block'; // Show matching item
        } else {
            item.style.display = 'none'; // Hide non-matching item
        }
    }
}

searchInput.addEventListener('input', filterList2);

searchInput.addEventListener('click', function() {
    employeeList.style.display = 'block';
    filterList2();
});
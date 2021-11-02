// Set up reusable variables

let newEmployee = {
  firstName: "",
  lastName: "",
  department: "Choose Department",
  departmentID: "reset",
  location: "Choose Location",
  locationID: "reset",
  email: "",
  id: "not assigned",
};

//full Data set
let staticResults;

//the search terms selected in the dropdown lists
let searchDept;
let searchLoc;

// temporary results based on filters
let results = [];
let searchResults = [];
let locations = [];
let departments = [];
let departmentOptions = [];

// used to send validation errors
let validateString = "";

$(document).ready(function () {
  initialiseData();
});

const initialiseData = () => {
  callApi("getAll", "GET", displayStaffData);
  callApi("getAllDepartments", "GET", getDepartmentData);
  callApi("getAllLocations", "GET", getLocationData);
  
};

// displayStaffData is used to display data from database and to display filtered search data
const displayStaffData = (data) => {
  if (data.data) {
    staticResults = data.data;
    results = data.data;
  } else {
    results = data;
  }
  $("#firstRow").html("");
  results.forEach((employee) => {
    $("#firstRow").append(`<tr key=${employee.id}>
    <td class="bigger">
             <p id="nameData"><strong>${employee.firstName} ${employee.lastName.toUpperCase()}</strong></p>
    </td>
    <td class="bigger">
             <p id="departmentData">${employee.department}</p>
    </td>
    <td class="bigger">
             <p id="locationData">${employee.location}</p>
    </td>
    <td class="smaller">         
         <div class="buttons">
         <button class="btn btn-secondary" type="button" id="view${employee.id}"><i class="far fa-eye"></i></button>
         <button class="btn btn-outline-dark" type="button" id="edit${employee.id}"><i class="far fa-edit"></i></button>
         <button class="btn btn-primary" type="button" id="delete${employee.id}" ><i class="far fa-trash-alt"></i></button>
        </div>  
    </td>
     </tr>`);
    $("#firstRow").on("click", `#view${employee.id}`, function () {
      $(".viewEmployee").show(
        viewStaff(employee.id)
      )
    });
    $("#firstRow").on("click", `#edit${employee.id}`, function () {
      $(".addEditForm").show(      
        editStaff(employee.id)
      )
    });
    $("#firstRow").on("click", `#delete${employee.id}`, function () {
      $(".viewEmployee").show(
        deleteStaff(employee.id)
      )
    });
  });
};

const getDepartmentData = (data) => {
  departments = data.data;
  departments.forEach((department) => {
    $("#selectDept").append(
      `<option value="${department.id}">${department.name}</option>`
    );
  });
};

const getLocationData = (data) => {
  locations = data.data;
  locations.forEach((location) => {
    $("#selectLoc").append(
      `<option value="${location.name}">${location.name}</option>`
    );
  });
};


//Generic function for API call
const callApi = (phpToCall, apiMethod, callbackFun, parameter1, parameter2, parameter3, parameter4, parameter5) => {
  $("#validation-text").html("");
  const apiUrl = `libs/php/${phpToCall}.php`;
  $.ajax({
    url: apiUrl,
    type: apiMethod,
    dataType: "json",
    data: {
      param1: parameter1,
      param2: parameter2,
      param3: parameter3,
      param4: parameter4,
      param5: parameter5,
    },
    crossOrigin: "",
    success: function (result) {
      callbackFun(result);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(
        `${apiUrl}: ajax call failed ${textStatus}. ${errorThrown}. ${jqXHR}`
      );
    },
  });
};

//show and hide commands

$(".close").click(function (e) {
  closeModal()
});

const closeModal = () => {
  $("#validation-text").html("");
  $(".modal").modal("hide");
  $(".addEditForm").hide()
  $(".viewEmployee").hide()
  $(".newDepartmentForm").hide()  
  $(".newLocationForm").hide()
 };

$("#hidingAddButton").click(function () {
  $(".addButtons").toggle();
});

$("#hidingSearchButton").click(function () {
  $(".thead-light").toggle();
  $("#resetHidingButton").toggle();
});



//opens modal to VIEW a staff record. This is also used in the DELETE command to view before deleting
const viewStaff = (id) => {
  let result = staticResults.filter((result) => result.id === id);
  $("#wholeName").html(`<strong>${result[0].firstName} ${result[0].lastName}</strong>`);
  $("#viewDepartment").html(`${result[0].department} department`);
  $("#viewLocation").html(`The ${result[0].location} office`);
  $("#emailFont").html(`${result[0].email}`);
  $("#staffid").html(`Employee ID ${result[0].id}`);
  $("#extraInfo").modal("show");
};

//opens modal to EDIT a staff record. Uses same form as the ADD employee command
const editStaff = (id) => {
  let result = results.filter((result) => result.id === id);
  let employeeLocation = locations.find((location) => location.name === result[0].location);
  result[0].locationID = employeeLocation.id;
  buildForm(result[0], "Edit", "Save Changes");

  $("#forename").val(result[0].firstName);
  $("#surname").val(result[0].lastName);
  $("#modalSelectLoc").val(result[0].locationID);
  $("#modalSelectDept").val(result[0].departmentID);
  $("#email").val(result[0].email);
  newEmployee.id = result[0].id;
    
  $("#extraInfo").modal("show");
};

//opens modal to DELETE a staff record
const deleteStaff = (id) => {
  viewStaff(id);
  $("#validation-text").html(`<div class="alert alert-warning">
  <strong>Are you sure you want to delete this employee?</strong><br>
  <button class="btn btn-primary" id="confirmDelete">Delete</button>
  <button class="btn btn-outline-dark close">Cancel</button>`);
  
  $("#confirmDelete").on("click", function () {
    resetData();
    callApi("deletePersonnelByID", "GET", deleteConfirmation, id);
  });
};

const deleteConfirmation = (data) => {
  closeModal()
  initialiseData()
  $("#viewDepartment").hide()
  $("#viewLocation").hide()
  $("#validation-text").html(`<div class="alert alert-success">
  <strong>Employee successfully deleted</strong><br>`)
  $("#extraInfo").modal("show");

  }

//opens modal to add a staff record - same form as edit employee
$("#addStaff").click(function (event) {
  $("#forename").val(" ");
  $("#surname").val(" ");
  $("#modalSelectLoc").val("reset");
  $("#modalSelectDept").val("reset");
  $("#email").val(" ");
  $("#staffid").val("Not assigned");
  event.preventDefault();

  buildForm(newEmployee, "Add", "Add Employee");
  $(".addEditForm").show()
  $("#extraInfo").modal("show");
  });

const buildForm = (employee, verb, commit) => {
  $("#verb").html(verb);
  $("#addOrEditStaff").html(commit);
  $("#employeeid").html(`Employee ID #${employee.id}`);

  $("#modalSelectLoc").html(
    `<option value="reset" selected>Choose location</option>`)  
  locations.forEach((location) => {
    $("#modalSelectLoc").append(
      `<option value="${location.id}">${location.name}</option>`)});

  $("#modalSelectDept").html(
     `<option value="reset" selected>Choose department</option>`)  
  departments.forEach((department) => {
    $("#modalSelectDept").append(
      `<option value="${department.id}">${department.name}</option>`);});

$("#modalSelectDept").change(function (e) {
    let selectedDept = e.currentTarget.value;
    if (selectedDept !== "reset" && selectedDept !== "resetSubset") {
      let locationHunt = departments.find(
        (department) => department.id === selectedDept
      );
      $("#modalSelectLoc").val(locationHunt.locationID);
    } else if (selectedDept === "reset") {
      $("#modalSelectLoc").val("reset");
    }
  });

  $("#modalSelectLoc").change(function (e) {
    let selectedLoc = e.currentTarget.value;
    if (selectedLoc === "reset") {
      departments.forEach((department) => {
        $("#modalSelectDept").append(
          `<option value="${department.id}">${department.name}</option>`
        );
      });
    } else {
      departmentOptions = departments.filter(
        (department) => department.locationID === selectedLoc
      );
      $("#modalSelectDept").html("");
      if (departmentOptions.length > 1) {
        $("#modalSelectDept").append(
          `<option value="resetSubset">Choose department</option>`
        );
      }
      departmentOptions.forEach((departmentAtLocation) => {
        $("#modalSelectDept").append(
          `<option value="${departmentAtLocation.id}">${departmentAtLocation.name}</option>`
        );
      });
    }
  });

  $("#addOrEditStaff").click(function (e) {
    e.preventDefault();
    addOrEditStaff(e);
  });
};

//opens modal to add a department
$("#addDept").click(function (event) {
  event.preventDefault();
  $("#newDepartment").val("")
  $("#selectDeptLocation").html(
    `<option value="reset" selected>Choose location</option>`)  
  locations.forEach((location) => {
    $("#selectDeptLocation").append(
      `<option value="${location.id}" loc-name="${location.name}">${location.name}</option>`
    );
  });  
  $(".newDepartmentForm").show();
  $("#extraInfo").modal("show");


//Add a department action
  $("#addNewDepartment").on("click", function () {
    let departmentName = $("#newDepartment").val().toLowerCase().replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase()});    
    validateField("new department", departmentName, 2, 20, lastDepartmentCheck)
  })
})
  //Check that the department added isn't a duplicate
  const lastDepartmentCheck = (departmentName) => {
    let locationID = $("#selectDeptLocation").val();
    if (locationID === "reset") {
      validateString = "The new department must be associated with a location"
      validationWarning(validateString);
    } else if (departments.find((department) => department.name === departmentName)) {
        validateString = `${departmentName} already exists within Company Directory. Duplicates are not allowed.`;
        validationWarning(validateString); 
    } else {
    let location = locations.find((location) => location.id === locationID);
    let locationName = location.name;
    callApi("insertDepartment", "GET", getNewDeptConfirmation, departmentName, locationID, locationName);
}
  }

//opens modal to add a location
$("#addLoc").click(function (event) {
  event.preventDefault();
  $("#newLocation").val("")
  $(".newLocationForm").show()
  $("#extraInfo").modal("show");
  $("#addNewLocation").on("click", function () {
    let location = $("#newLocation").val().toLowerCase().replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase()});
    validateField("new location", location, 2, 20, lastLocationCheck);
  }
  )})

  const lastLocationCheck = (location) => {
     if (locations.find((office) => office.name === location)) {
      validateString = `${location} already exists within Company Directory. Duplicates are not allowed.`;
      validationWarning(validateString); 
     }
     else {
      callApi("insertLocation", "GET", getNewLocConfirmation, location);
    }
  }


  const getNewLocConfirmation = (data) => {
    initialiseData();
    closeModal()
    $("#validation-text").html(`<div class="alert alert-success"><strong>${data.data} has been successfully added to the Company Directory. <br>Please add departments for this location.</strong></div>`)
    $("#extraInfo").modal("show");
    }

  const getNewDeptConfirmation = (data) => {
  initialiseData();
  closeModal()
  $("#extraInfo").modal("show");
  $("#validation-text").html(`<div class="alert alert-success"><strong>${data.data}</strong></div>`)
  }

// Data filters
// On whole name

$("#searchNames").on("input", function (e) {
  let lettersToSearch = e.currentTarget.value.toLowerCase();
  let searchData =
    $("#selectDept").val() === "reset" && $("#selectLoc").val() === "reset"
      ? staticResults
      : searchResults;

  results = searchData.filter((result) => {
    result.wholeName =
      result.firstName.toLowerCase() + result.lastName.toLowerCase();
    return result.wholeName.includes(lettersToSearch);
  });
  displayStaffData(results);
});

$("#selectDept").on("change", function (e) {
  searchDept = e.currentTarget.value;
  if (searchDept === "reset") {
  } else {
    const searchData = results;
    results = searchData.filter((result) => result.departmentID === searchDept);
    searchResults = results;
    displayStaffData(results);
  }
});

$("#selectLoc").on("change", function (e) {
  searchLoc = e.currentTarget.value;
  if (searchLoc === "reset") {
    resetData();
  } else {
    const searchData = results;
    results = searchData.filter((result) => result.location === searchLoc);
    searchResults = results;
    displayStaffData(results);
  }
});

const resetData = () => {
  displayStaffData(staticResults);
  $("#searchNames").val("");
  $("#selectDept").val("reset");
  $("#selectLoc").val("reset");
  newEmployee = {
    firstName: "",
    lastName: "",
    department: "Choose Department",
    departmentID: "reset",
    location: "Choose Location",
    locationID: "reset",
    email: "",
    id: "not assigned",
  };
  
};

$("#resetButton").click(function () {
  resetData();
});

$("#resetHidingButton").click(function () {
  resetData();
});

const addOrEditStaff = () => {
  newEmployee.firstName = $("#forename").val().toLowerCase().replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase()})  
  validateField("employee's first name", newEmployee.firstName, 2, 15, lastNameCheck)
}
const lastNameCheck = (firstName) => {
  newEmployee.lastName = $("#surname").val().toLowerCase().replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase()}) ;
  validateField("employee's last name", newEmployee.lastName, 2, 20, departmentCheck)
}
const departmentCheck = () => {
newEmployee.departmentID = $("#modalSelectDept").val();
newEmployee.locationID = $("#modalSelectLoc").val();

if (newEmployee.departmentID !== "reset" && newEmployee.locationID !== "reset") {
    newEmployee.email = $("#email").val().toLowerCase();

    (newEmployee.id !== "not assigned") ? validateField("email", newEmployee.email, 6, 30, updatePersonnel) :
    validateField("email", newEmployee.email, 6, 30, emailDuplicationCheck);
} else { 
  validateString = "The employee must be associated with a location and a department"
  validationWarning(validateString);
}
}

const emailDuplicationCheck = () => {
  if (staticResults.find((staff) => staff.email === newEmployee.email)) {
    validateString = "There is already an employee with this email address in the Company Directory. Duplicates are not allowed";
    validationWarning(validateString);
  } else {callApi("insertEmployee", "POST", getAddConfirmation, newEmployee.firstName, newEmployee.lastName,
    newEmployee.email, newEmployee.departmentID);
} 
}


const updatePersonnel = () => {
  callApi("updateEmployee", "GET", getEditConfirmation, newEmployee.firstName, newEmployee.lastName,
    newEmployee.email, newEmployee.departmentID, newEmployee.id);
}

const getAddConfirmation = (data) => {
  closeModal()
  initialiseData()
  $("#validation-text").html(`<div class="alert alert-success">
  <strong>${data.data[0]}</strong><br></div>`)
  $("#extraInfo").modal("show");
};

const getEditConfirmation = (data) => {
  closeModal()
  initialiseData()
  $("#validation-text").html(`<div class="alert alert-success">
  <strong>${data.data[0]}'s information has successfully been updated</strong><br></div>`)
  $("#extraInfo").modal("show");
};


const validationWarning = (validateString) => {
  $("#validation-text").html("");
  $("#validation-text").html(`<div class="alert alert-danger">
      <strong><p>Error!</p></strong> ${validateString} 
    </div>`);
};



const validateField = (field, fieldInput, min, max, lastCheckCallback) => {

if (fieldInput.length > max || fieldInput.length < min) {
  validateString = `The ${field} must be between ${min} and ${max} characters.`;
  validationWarning(validateString)
} else {
  validatePattern(field, fieldInput, lastCheckCallback)
}
}
const validatePattern = (field, fieldInput, lastCheckCallback) => {
  if (field === "email") {
    if (!fieldInput.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      validateString = `${fieldInput} does not seem to be a regularly formatted email address.`;
      validationWarning(validateString);
     } else {
      lastCheckCallback(fieldInput)
     }
  } else {
  
  if (!fieldInput.match(/^[A-Za-z -]+$/)) {
  validateString = `The ${field} must not contain any unusual characters.`;
  validationWarning(validateString);
 } else {
  lastCheckCallback(fieldInput)
 }
}
}
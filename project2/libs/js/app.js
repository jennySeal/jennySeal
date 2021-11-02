// Build add/edit employee modal form
const buildForm = (employee, verb, commit) => {
  $("#verb").html(verb);
  $("#addOrEditStaff").html(commit);
  $("#employeeid").html(`Employee ID #${employee.id}`);

  locations.forEach((location) => {
    $("#modalSelectLoc").append(
      `<option value="${location.id}">${location.name}</option>`)});

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

// temporary results based on filters
let results = [];
let searchResults = [];
let locations = [];
let departments = [];
let departmentOptions = [];
let validateString = "";

//the search terms selected in the dropdown lists
let searchDept;
let searchLoc;

//Generic function for API call
const callApi = (
  phpToCall,
  apiMethod,
  callbackFun,
  parameter1,
  parameter2,
  parameter3,
  parameter4,
  parameter5,
) => {
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

const getAllData = (data) => {
  if (data.data) {
    staticResults = data.data;
    results = data.data;
  } else {
    results = data;
  }
  $("#firstRow").html("");
  results.forEach(function callback(employee) {
    $("#firstRow").append(`<tr key=${employee.id}>
    <td class="bigger">
             <p id="nameData"><strong>${
               employee.firstName
             } ${employee.lastName.toUpperCase()}</strong></p>
    </td>
    <td class="bigger">
             <p id="departmentData">${employee.department}</p>
    </td>
    <td class="bigger">
             <p id="locationData">${employee.location}</p>
    </td>
    <td class="smaller">         
         <div class="buttons">
         <button class="btn btn-secondary" type="button" id="view${
           employee.id
         }")"><i class="far fa-eye"></i></button>
                 <button class="btn btn-outline-dark" id="edit${
                   employee.id
                 }""><i class="far fa-edit"></i></button>
                 <button class="btn btn-primary" id="delete${
                   employee.id
                 }" ><i class="far fa-trash-alt"></i></button>
        </div>  
    </td>
     </tr>`);
    $("#firstRow").on("click", `#view${employee.id}`, function () {
      viewStaff(employee.id);
    });
    $("#firstRow").on("click", `#edit${employee.id}`, function () {
      editStaff(employee.id);
    });
    $("#firstRow").on("click", `#delete${employee.id}`, function () {
      deleteStaff(employee.id);
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

const initialiseData = () => {
  callApi("getAll", "GET", getAllData);
  callApi("getAllDepartments", "GET", getDepartmentData);
  callApi("getAllLocations", "GET", getLocationData);
};

$(document).ready(function () {
  initialiseData();
});

//show and hide commands

$(".close").click(function (e) {
  closeModal()
});

const closeModal = () => {
  $("#validation-text").html("");
  $(".modal").modal("hide");
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
  console.log(result)
  $(".modal-body")
    .html(`<h3><strong>${result[0].firstName} ${result[0].lastName}</strong></h3>
        <p>${result[0].department} department</p><p>The ${result[0].location} Office</p><p id="emailFont">${result[0].email}</p><p class="right-align" id="employeeid">Employee ID ${result[0].id}`);
  $("#extraInfo").modal("show");
};

//opens modal to EDIT a staff record. Uses same form as the ADD employee command
const editStaff = (id) => {
  let result = results.filter((result) => result.id === id);
  let employeeLocation = locations.find(
    (location) => location.name === result[0].location
  );
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
  $(".modal-body")
    .append(`<p><strong>Are you sure you want to delete this employee?</strong></p>
  <button class="btn btn-primary" id="confirmDelete">Delete</button>
  <button class="btn btn-outline-dark close">Cancel</button>`);
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  });
  $("#confirmDelete").on("click", function () {
    resetData();
    callApi("deletePersonnelByID", "GET", deleteConfirmation, id);
  });
};

const deleteConfirmation = (data) => {
  callApi("getAll", "GET", getAllData);
  $(".modal-body").html("");
  $(".modal-body").append(`<p><strong>Employee successfully deleted</strong></p>
  <button class="btn btn-outline-dark close">Close</button>`);
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  });
};

//opens modal to add a staff record - same form as edit employee
$("#addStaff").click(function (event) {
  event.preventDefault();
  buildForm(newEmployee, "Add", "Add Employee");
  $("#extraInfo").modal("show");
});

//opens modal to add a department
$("#addDept").click(function (event) {
  event.preventDefault();
  $(".modal-body").html(`
                 
                 <label for="newDepartment"><p>Name of new department</p></label><br>
                 <input type="text" class="form-control" id="newDepartment" minlength="2" maxlength="20" pattern="(^[A-Za-z -]+$)" autocomplete="off" autocapitalize />
                 <br>
                 <label for="location"><p>Which office is this department part of? </p></label><br>
                 <select class="select" id="selectDeptLocation">
                 <option value="reset" selected>Choose location</option>
                 </select>
                 <br><br>
                 <button type="button" class="close btn btn-outline-dark" aria-label="Close">Cancel</button>
                 <button type="button" class="btn btn-primary" id="addNewDepartment">Add New Department</button>
                 `);

  locations.forEach((location) => {
    $("#selectDeptLocation").append(
      `<option value="${location.id}" loc-name="${location.name}">${location.name}</option>`
    );
  });

  $(".modal-body").on("click", `.close`, function () {
     closeModal();
  });
  $("#extraInfo").modal("show");

  $("#addNewDepartment").on("click", function () {
    let departmentName = $("#newDepartment").val().toLowerCase().replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase()});
    
    validateField("new department", departmentName, 2, 20, lastDepartmentCheck)
  })
})

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
    callApi("insertDepartment", "GET", getNewLocConfirmation, departmentName, locationID, locationName);
}
  }

//opens modal to add a location
$("#addLoc").click(function (event) {
  event.preventDefault();
  $(".modal-body").html(`
                 
                 <label for="newLoc"><p>Name of new business location</p></label>
                 <input type="text" class="form-control" id="newLocation" minlength="2" maxlength="20" required/>
                 <br>
                 <button type="button" class="close btn btn-outline-dark" aria-label="Close">Cancel</button>
                 <button type="button" class="btn btn-primary" id="addNewLocation">Add New Location</button>
                 `);
  $("#extraInfo").modal("show");
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  });
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


const validationWarning = (validateString) => {
  $("#validation-text").html("");
  $("#validation-text").append(`<div class="alert alert-danger">
      <strong><p>Error!</p></strong> ${validateString} 
    </div>`);
};

const getNewLocConfirmation = (data) => {
  initialiseData();
  $(".modal-body").html(`<p><strong>${data.data}</strong></p>
  <button class="btn btn-outline-dark close">Close</button>`);
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  });
};

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
  getAllData(results);
});

$("#selectDept").on("change", function (e) {
  searchDept = e.currentTarget.value;
  if (searchDept === "reset") {
    resetData();
  } else {
    const searchData = results;
    results = searchData.filter((result) => result.departmentID === searchDept);
    searchResults = results;
    getAllData(results);
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
    getAllData(results);
  }
});

const resetData = () => {
  getAllData(staticResults);
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
  resetData()
  buildForm(newEmployee, `${data.data[0]} <br><br>Continue to add `, "Add Another Employee");
  $("#extraInfo").modal("show");
};

const getEditConfirmation = (data) => {
  closeModal()
  initialiseData()
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
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

let locationForEditedDepartment = 0;

$(window).on("load", function () {
  //Run pre-loader
  initialiseData();
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $("#preloader").remove();
      });
  }
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
         }"><i class="far fa-eye"></i></button>
         <button class="btn btn-outline-dark" type="button" id="edit${
           employee.id
         }"><i class="far fa-edit"></i></button>
         <button class="btn btn-primary" type="button" id="delete${
           employee.id
         }" ><i class="far fa-trash-alt"></i></button>
        </div>  
    </td>
     </tr>`);
    $("#firstRow").on("click", `#view${employee.id}`, function () {
      $(".viewEmployee").show(viewStaff(employee.id));
    });
    $("#firstRow").on("click", `#edit${employee.id}`, function () {
      callApi("getAllLocations", "GET", getLocationData);
      let empId = employee.id;
      $(".addEditForm").show(
        callApi("getPersonnelByID", "GET", editStaff, empId)
      );
    });
    $("#firstRow").on("click", `#delete${employee.id}`, function () {
      $(".viewEmployee").show(deleteStaff(employee.id));
    });
  });
};

const getDepartmentData = (data) => {
  departments = data.data;
  $("#selectDept").html(
    `<option value="reset" selected>Search department</option>`
  );
  departments.forEach((department) => {
    $("#selectDept").append(
      `<option value="${department.id}">${department.name}</option>`
    );
  });
};

const getLocationData = (data) => {
  locations = data.data;
  $("#selectLoc").html(
    `<option value="reset" selected>Search location</option>`
  );
  locations.forEach((location) => {
    $("#selectLoc").append(
      `<option value="${location.name}">${location.name}</option>`
    );
  });
};

//Generic function for API call
const callApi = (
  phpToCall,
  apiMethod,
  callbackFun,
  parameter1,
  parameter2,
  parameter3,
  parameter4,
  parameter5
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

//show and hide commands

$(".close").click(function (e) {
  closeModal();
});

const closeModal = () => {
  $("#validation-text").html("");
  $(".modal").modal("hide");
  $(".addEditForm").hide();
  $(".viewEmployee").hide();
  $(".newDepartmentForm").hide();
  $(".newLocationForm").hide();
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
  $("#wholeName").html(
    `<strong>${result[0].firstName} ${result[0].lastName}</strong>`
  );
  $("#viewDepartment").html(`${result[0].department} department`);
  $("#viewLocation").html(`The ${result[0].location} office`);
  $("#emailFont").html(`${result[0].email}`);
  $("#extraInfo").modal("show");
};

//opens modal to EDIT a staff record. Uses same form as the ADD employee command
const editStaff = (data) => {
  let result = data.data.personnel;
  departments = data.data.department;

  buildForm(result, "Edit");

  $("#forename").val(result.firstName);
  $("#surname").val(result.lastName);
  $("#modalSelectDept").val(result.departmentID);
  $("#email").val(result.email);
  newEmployee.id = result.id;
  let employeeLocation = locations.find(
    (location) => location.name === result.locationName
  );
  result.locationID = employeeLocation.id;
  $("#modalSelectLoc").val(result.locationID);

  $("#extraInfo").modal("show");
};

//opens modal to DELETE a staff record
const deleteStaff = (id) => {
  viewStaff(id);
  $("#validation-text").html(`<div class="alert alert-warning">
  <strong>Are you sure you want to delete this employee?</strong><br>
  <button class="btn btn-primary" id="confirmDelete">Yes</button>
  <button class="btn btn-outline-dark close">No</button>`);
  $(".close").on("click", function () {
    closeModal();
  });
  $("#confirmDelete").on("click", function () {
    resetData();
    callApi("deletePersonnelByID", "GET", deleteConfirmation, id);
  });
};

const deleteConfirmation = (data) => {
  closeModal();
  initialiseData();
  $("#extraInfo").modal("show");
  $("#validation-text").html(`<div class="alert alert-danger">
    <strong>${data.data}</strong><br>`);
  
};

//opens modal to add a staff record - same form as edit employee
$("#addStaff").click(function (event) {
  event.preventDefault();
  $("#forename").val(" ");
  $("#surname").val(" ");
  $("#modalSelectLoc").val("reset");
  $("#modalSelectDept").val("reset");
  $("#email").val(" ");
  newEmployee.id = "not assigned";

  buildForm(newEmployee, "Add");
  $(".addEditForm").show();
  $("#extraInfo").modal("show");
});

const buildForm = (employee, verb) => {
  $("#verb").html(verb);

  $("#modalSelectLoc").html(
    `<option value="reset" selected>Choose location</option>`
  );
  locations.forEach((location) => {
    $("#modalSelectLoc").append(
      `<option value="${location.id}">${location.name}</option>`
    );
  });

  $("#modalSelectDept").html(
    `<option value="reset" selected>Choose department</option>`
  );
  departments.forEach((department) => {
    $("#modalSelectDept").append(
      `<option value="${department.id}">${department.name}</option>`
    );
  });

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
};

//opens modal to add a department
$("#addDept").click(function (event) {
  event.preventDefault();
  changingDepartmentData();
});

//Add a department action
$("#addNewDepartment").on("click", function () {
  let departmentName = $("#newDepartment")
    .val()
    .toLowerCase()
    .replace(/(\b[a-z](?!\s))/g, function (x) {
      return x.toUpperCase();
    });
  validateField("new department", departmentName, 2, 20, lastDepartmentCheck);
});

//Check that the department added isn't a duplicate
const lastDepartmentCheck = (departmentName) => {
  let locationID = $("#selectDeptLocation").val();
  if (locationID === "reset") {
    validateString = "The new department must be associated with a location";
    validationWarning(validateString);
  } else if (
    departments.find((department) => department.name === departmentName)
  ) {
    validateString = `${departmentName} already exists within Company Directory. Duplicates are not allowed.`;
    validationWarning(validateString);
  } else {
    let location = locations.find((location) => location.id === locationID);
    let locationName = location.name;
    callApi(
      "insertDepartment",
      "GET",
      getNewDeptConfirmation,
      departmentName,
      locationID,
      locationName
    );
  }
};

//opens modal to add/edit/delete a location
$("#addLoc").click(function (event) {
  event.preventDefault();
  changingLocationData();
});

// 
const changingLocationData = () => {
  callApi("getAllLocations", "GET", getLocationData);
  $("#newLocation").val("");
  $("#listLocations").html("");

  locations.forEach((locationToChange) => {
    $("#listLocations").append(
      `<div class="locationFlex" key=${locationToChange.id}><p>${locationToChange.name}</p>
       <div class="buttons">
       <button class="btn btn-outline-dark" type="button" id="edit${locationToChange.id}"><i class="far fa-edit"></i></button>
       <button class="btn btn-primary" type="button" id="delete${locationToChange.id}" ><i class="far fa-trash-alt"></i></button>
     </div> `
    );
    $("#listLocations").on("click", `#edit${locationToChange.id}`, function () {
      callApi("getLocationById", "GET", editLocationForm, locationToChange.id)
    });
    $("#listLocations").on(
      "click",
      `#delete${locationToChange.id}`,
      function () {
        $("#validation-text").html(`<div class="alert alert-warning">
      <strong>Are you sure you want to delete the ${locationToChange.name} office?</strong><br>
      <button class="btn btn-primary" id="confirmLocDelete">Yes</button>
      <button class="btn btn-outline-dark close">No</button>`);
        $(".close").on("click", function () {
          $("#validation-text").html("");
        });
        $("#confirmLocDelete").on("click", function () {
          
          callApi(
            "deleteLocationById",
            "GET",
            deleteConfirmation,
            locationToChange.id
          );
        });
      });
  });
  $(".newLocationForm").show();
  $("#extraInfo").modal("show");
};

//edit Location 
const editLocationForm = (data) => {
let locationToChange = data.data;
$("#validation-text").html(`<div class="alert alert-warning">
<label for="newLocationName" class="form-control-label">New name for <strong>${locationToChange.name} </strong>office</label>
<input type="text" id="newLocationName" class="form-control" autocapitalize>
<button class="btn btn-primary" id="confirmEdit" data=${locationToChange.id}>Save</button>
<button class="btn btn-outline-dark close">Cancel</button>`);

$(".close").on("click", function () {
  $("#validation-text").html("");
});

$("#confirmEdit").on("click", function () {
  $("#modalSelectLoc").html(
    `<option value="reset" selected>Choose location</option>`
  );
  locations.forEach((location) => {
    $("#modalSelectLoc").append(
      `<option value="${location.id}">${location.name}</option>`
    );
  });
  let location = $("#newLocationName")
    .val()
    .toLowerCase()
    .replace(/(\b[a-z](?!\s))/g, function (x) {
      return x.toUpperCase();
    });
  validateField(
    "new location",
    location,
    2,
    20,
    lastUpdateLocationCheck,
    locationToChange.id
  );
});
}



// edit and delete departments 
const changingDepartmentData = () => {
  callApi("getAllDepartments", "GET", getDepartmentData);
  $("#newDepartment").val("");
  $("#listDepartments").html("");
  departments.forEach((departmentToChange) => {
    $("#listDepartments").append(
      `<div class="departmentFlex" key=${departmentToChange.id}><p>${departmentToChange.name}</p>
       <div class="buttons">
       <button class="btn btn-outline-dark" type="button" id="edit${departmentToChange.id}"><i class="far fa-edit"></i></button>
       <button class="btn btn-primary" type="button" id="delete${departmentToChange.id}" ><i class="far fa-trash-alt"></i></button>
     </div> `
    );
    $("#listDepartments").on(
      "click",
      `#delete${departmentToChange.id}`,
      function () {
        $("#validation-text").html(`<div class="alert alert-warning">
        <strong>Are you sure you want to delete the ${departmentToChange.name} department?</strong><br>
        <button class="btn btn-primary" id="confirmDeptDelete">Yes</button>
        <button class="btn btn-outline-dark close">No</button>`);
        $(".close").on("click", function () {
          $("#validation-text").html("");
        });
        $("#confirmDeptDelete").on("click", function () {
          callApi(
            "deleteDepartmentById",
            "GET",
            deleteConfirmation,
            departmentToChange.id
          );
        });
      }
      );  
      $("#listDepartments").on("click", `#edit${departmentToChange.id}`, function () {
        callApi("getDepartmentById", "GET", editDepartmentForm, departmentToChange.id)
      })
});
  $("#selectDeptLocation").html(
    `<option value="reset" selected>Choose location</option>`
  );
  locations.forEach((location) => {
    $("#selectDeptLocation").append(
      `<option value="${location.id}" loc-name="${location.name}">${location.name}</option>`
    );
  });
  $(".newDepartmentForm").show();
  $("#extraInfo").modal("show");
};


const editDepartmentForm = (data) => {
let departmentToChange = data.data;
$("#validation-text").html(`<div class="alert alert-warning">
<label for="newDepartmentName" class="form-control-label"><strong>Edit department</strong></label>
<input type="text" id="newDepartmentName" class="form-control" autocapitalize ><br>

<label for="locationNew" class="form-control-label">Location</label> 
<select class="form-select" id="locationNew"><option value="reset">Choose Location</option></select><br>

<button class="btn btn-primary" id="confirmEditDept" data=${departmentToChange.id}>Save</button>
<button class="btn btn-outline-dark close">Cancel</button>`);
$("#locationNew").html(
  `<option value="reset" selected>Choose location</option>`
);
locations.forEach((location) => {
  $("#locationNew").append(
    `<option value="${location.id}">${location.name}</option>`
  );
});
$("#newDepartmentName").val(departmentToChange.name);
$("#locationNew").val(departmentToChange.locationID); 

$(".close").on("click", function () {
$("#validation-text").html("");
});

$("#confirmEditDept").on("click", function () {

locationForEditedDepartment = $("#locationNew").val()
let departmentName = $("#newDepartmentName")
.val()
.toLowerCase()
.replace(/(\b[a-z](?!\s))/g, function (x) {
  return x.toUpperCase();
})
validateField("new department", departmentName, 2, 30, callUpdateDepartment, departmentToChange.id)
})
}

$("#addNewLocation").on("click", function () {
  let location = $("#newLocation")
    .val()
    .toLowerCase()
    .replace(/(\b[a-z](?!\s))/g, function (x) {
      return x.toUpperCase();
    });
  validateField("new location", location, 2, 20, lastLocationCheck);
});

const lastLocationCheck = (location) => {
  if (locations.find((office) => office.name === location)) {
    validateString = `${location} already exists within Company Directory. Duplicates are not allowed.`;
    validationWarning(validateString);
  } else {
    callApi("insertLocation", "GET", getNewLocConfirmation, location);
  }
};

const lastUpdateLocationCheck = (location, locationId) => {
  if (locations.find((office) => office.name === location)) {
    validateString = `${location} already exists within Company Directory. Duplicates are not allowed.`;
    validationWarning(validateString);
  } else {
    callApi("updateLocation", "GET", getEditConfirmation, location, locationId);
  }
};

const callUpdateDepartment = (department, departmentId) => {
  
   callApi(
      "updateDepartment", "GET", getEditConfirmation, department, locationForEditedDepartment, departmentId)
  }


const getNewLocConfirmation = (data) => {
  initialiseData();
  closeModal();
  $("#validation-text").html(
    `<div class="alert alert-success"><strong>${data.data} has successfully been added to the Company Directory. <br>Please add departments for this location.</strong></div>`
  );
  $("#extraInfo").modal("show");
};

const getNewDeptConfirmation = (data) => {
  initialiseData();
  closeModal();
  $("#extraInfo").modal("show");
  $("#validation-text").html(
    `<div class="alert alert-success"><strong>${data.data}</strong></div>`
  );
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

$("#refreshButton").click(function () {
  location.reload(true);
});

$("#resetButton").click(function () {
  resetData();
});

$("#resetHidingButton").click(function () {
  resetData();
});

$("#addOrEditStaff").click(function () {
  newEmployee.firstName = $("#forename")
    .val()
    .toLowerCase()
    .replace(/(\b[a-z](?!\s))/g, function (x) {
      return x.toUpperCase();
    });
  validateField(
    "employee's first name",
    newEmployee.firstName,
    2,
    15,
    lastNameCheck
  );
});

const lastNameCheck = (firstName) => {
  newEmployee.lastName = $("#surname")
    .val()
    .toLowerCase()
    .replace(/(\b[a-z](?!\s))/g, function (x) {
      return x.toUpperCase();
    });
  validateField(
    "employee's last name",
    newEmployee.lastName,
    2,
    20,
    departmentCheck
  );
};
const departmentCheck = () => {
  newEmployee.departmentID = $("#modalSelectDept").val();
  newEmployee.locationID = $("#modalSelectLoc").val();
  if (
    newEmployee.departmentID === "reset" || newEmployee.departmentID === "resetSubset" || 
    newEmployee.locationID === "reset"
  ) {
    validateString =
      "The employee must be associated with a location and a department";
    validationWarning(validateString);
  } else {
    newEmployee.email = $("#email").val().toLowerCase();
    newEmployee.id !== "not assigned"
      ? validateField("email", newEmployee.email, 6, 40, updatePersonnel)
      : validateField("email", newEmployee.email, 6, 40, emailDuplicationCheck);
  }
};

const emailDuplicationCheck = () => {
  if (staticResults.find((staff) => staff.email === newEmployee.email)) {
    validateString =
      "There is already an employee with this email address in the Company Directory. Duplicates are not allowed";
    validationWarning(validateString);
  } else {
    callApi(
      "insertEmployee",
      "POST",
      getAddConfirmation,
      newEmployee.firstName,
      newEmployee.lastName,
      newEmployee.email,
      newEmployee.departmentID
    );
  }
};

const updatePersonnel = () => {
  callApi(
    "updateEmployee",
    "GET",
    getEditConfirmation,
    newEmployee.firstName,
    newEmployee.lastName,
    newEmployee.email,
    newEmployee.departmentID,
    newEmployee.id
  );
};

const getAddConfirmation = (data) => {
  closeModal();
  initialiseData();
  $("#validation-text").html(`<div class="alert alert-success">
  <strong>${data.data[0]}</strong><br></div>`);
  $("#extraInfo").modal("show");
};

const getEditConfirmation = (data) => {
  closeModal();
  initialiseData();

  $("#validation-text").html(`<div class="alert alert-success">
  <strong>${data.data[0]}'s information has successfully been updated</strong><br></div>`);
  $("#extraInfo").modal("show");
};

const validationWarning = (validateString) => {
  $("#validation-text").html("");
  $("#validation-text").html(`<div class="alert alert-danger">
      <strong><p>Error!</p></strong> ${validateString} 
    </div>`);
};

const validateField = (
  field,
  fieldInput,
  min,
  max,
  lastCheckCallback,
  extraField
) => {
  
    if (fieldInput.length > max || fieldInput.length < min) {
    validateString = `The ${field} must be between ${min} and ${max} characters.`;
    validationWarning(validateString);
  } else {
    validatePattern(field, fieldInput, lastCheckCallback, extraField);
  }
};
const validatePattern = (field, fieldInput, lastCheckCallback, extraField) => {
  if (field === "email") {
    if (
      !fieldInput.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      validateString = `${fieldInput} does not seem to be a regularly formatted email address.`;
      validationWarning(validateString);
    } else {
      lastCheckCallback(fieldInput);
    }
  } else {
    if (!fieldInput.match(/^[A-Za-z -]+$/)) {
      validateString = `The ${field} must not contain any unusual characters.`;
      validationWarning(validateString);
    } else {
      
      lastCheckCallback(fieldInput, extraField);
    }
  }
};

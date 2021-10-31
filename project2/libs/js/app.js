// Build add/edit employee modal form
const buildForm = (employee, verb, commit) => {
                 $(".modal-body").html(`<form id="editModal">
                 <p id="modal-start">${verb} employee details and save.</p>
                 <div class="row-flex">
                 <label for="forename"><p>First Name</p></label>
                 <input type="text" class="form-control" placeholder="${employee.firstName}" id="forename" required minlength="2" maxlength="15" pattern="(^[A-Za-z' -]+$)" autocomplete="off" autocapitalize>
                 </div><br> 
       
                 <div class="row-flex">
                 <label for="surname"><p>Surname</p></label>
                 <input type="text" class="form-control" placeholder="${employee.lastName}" id="surname" required minlength="2" maxlength="25" pattern="(^[A-Za-z -]+$)" autocapitalize autocomplete="off">
                 </div><br>
       
                 <div class="row-flex">
                 <label for="department"><p>Department</p></label>
                 <select class="select" id="modalSelectDept">
                 <option value="reset" selected>Choose department</option>
                 </select>
                 </div><br>
       
                 <div class="row-flex">
                 <label for="location"><p>Location</p></label>
                 <select class="select" id="modalSelectLoc">
                 <option value="reset" selected>Choose location</option>
                 </select>
                 </div><br>
               
                 <div class="row-flex">
                 <label for="email"><p>Email</p></label>
                 <input type="email" class="form-control" placeholder="${employee.email}" id="email" maxlength="30" required>
                 </div><br>
       
       
                 <button type="submit" class="btn btn-primary" id="addOrEditStaff">${commit}</button>
                 <p id="right-align"><sub>Employee id ${employee.id}</sub></p>
                 </form>`);

                 locations.forEach((location) => {
                  $("#modalSelectLoc").append(
                    `<option value="${location.id}">${location.name}</option>`
                  )})
                 departments.forEach((department) => {
                    $("#modalSelectDept").append(
                      `<option value="${department.id}">${department.name}</option>`
                    )})

                $("#modalSelectDept").change(function(e) {
                      let selectedDept = e.currentTarget.value;
                      if (selectedDept !== "reset" && selectedDept !== "resetSubset") {
                      let locationHunt = departments.find(department => department.id === selectedDept)
                      $("#modalSelectLoc").val(locationHunt.locationID);
                    } else if (selectedDept === "reset") {
                      $("#modalSelectLoc").val("reset");
                    }
                  
                  })

                $("#modalSelectLoc").change(function(e) {
                      let selectedLoc = e.currentTarget.value;
                      if (selectedLoc === "reset") {
                        departments.forEach((department) => {
                          $("#modalSelectDept").append(
                            `<option value="${department.id}">${department.name}</option>`
                          )})
      
                      } else {
                      departmentOptions = departments.filter(department => department.locationID === selectedLoc)
                      $("#modalSelectDept").html("")
                      if (departmentOptions.length > 1) {
                        $("#modalSelectDept").append(
                      `<option value="resetSubset">Choose department</option>`)
                        }
                      departmentOptions.forEach((departmentAtLocation) => {
                      $("#modalSelectDept").append(
                        `<option value="${departmentAtLocation.id}">${departmentAtLocation.name}</option>`
                      )
                    })}
                    })
                      
                    $("#addOrEditStaff").click(function(e) {
                        e.preventDefault()
                        addOrEditStaff(e)      
                        
 
                    })
              
}

const newEmployee = {
  firstName: "",
  lastName: "",
  department: "reset",
  location: "reset",
  email: "",
  id: "not assigned",
}

//full Data set
let staticResults;

// temporary results based on filters
let results = [];
let locations = [];
let departments = []
let departmentOptions = []


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
  parameter4
) => {
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
    },
    success: function (result) {
      callbackFun(result);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`${apiUrl}: ajax call failed ${textStatus}. ${errorThrown}. ${jqXHR}`);
    },
  });
};


const getAllData = (data) => {
  if (data.data) {
    staticResults = data.data;
    results = data.data
  }
  else {
    results = data;
  };
  $("#firstRow").html("");
  results.forEach(function callback(employee) {
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
         <button class="btn btn-secondary" type="button" id="view${employee.id}")"><i class="far fa-eye"></i></button>
                 <button class="btn btn-outline-dark" id="edit${employee.id}""><i class="far fa-edit"></i></button>
                 <button class="btn btn-primary" id="delete${employee.id}" ><i class="far fa-trash-alt"></i></button>
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
    )
  })
}

const getLocationData = (data) => {
  locations = data.data;
  
  locations.forEach((location) => {
    $("#selectLoc").append(
      `<option value="${location.name}">${location.name}</option>`
    )
  })
}

const initialiseData = () => {
  callApi("getAll", "GET", getAllData);
  callApi("getAllDepartments", "GET", getDepartmentData);
  callApi("getAllLocations", "GET", getLocationData);
}


$(document).ready(function () {
  initialiseData()
  });

//show and hide commands

$(".close").click(function (e) {
  $(".modal").modal("hide");
});

const closeModal = () => {
  $(".modal").modal("hide");
}

$("#hidingAddButton").click(function () {
  $(".addButtons").toggle();
});

$("#hidingSearchButton").click(function () {
  $(".thead-light").toggle();
});


//opens modal to view a staff record
const viewStaff = (id) => {
  let result = results.filter((result) => result.id === id);
  $(".modal-body")
    .html(`<h3><strong>${result[0].firstName} ${result[0].lastName}</strong></h3>
        <p>${result[0].department} department</p><p>The ${result[0].location} Office</p><p id="email">${result[0].email}</p><p id="right-align">Staff #${result[0].id}`);
  $("#extraInfo").modal("show");
};

//opens modal to edit a staff record
const editStaff = (id) => {
  let result = results.filter((result) => result.id === id)
  buildForm(result[0], "Edit", "Save Changes")
    
    $("#modalSelectLoc").val(result[0].location)
    $("#modalSelectDept").val(result[0].department)

  $("#extraInfo").modal("show");
};




//opens modal to delete a staff record
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
    
    resetData()
    callApi("deletePersonnelByID", "GET", deleteConfirmation, id)
  });  

}

const deleteConfirmation = (data) => {
  callApi("getAll", "GET", getAllData); 
 
  $(".modal-body").html("")
  $(".modal-body").append(`<p><strong>Employee successfully deleted</strong></p>
  <button class="btn btn-outline-dark close">Close</button>`);
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
})
}
//opens modal to add a staff record
$("#addStaff").click(function (event) {
  event.preventDefault();
  buildForm(newEmployee, 'Add', "Add Employee")
  $("#extraInfo").modal("show");
});

//opens modal to add a department
$("#addDept").click(function (event) {
  event.preventDefault();
  $(".modal-body").html(`
                 
                 <label for="newDept"><p>Name of new department</p></label><br>
                 <input type="text" class="form-control" id="newDept" minlength="2" maxlength="20" autocomplete="off">
                 <br>
                 <label for="location"><p>Which office is this department part of? </p></label><br>
                 <select class="select" id="modalSelectLoc">
                 <option value="reset" selected>Choose location</option>
                 </select>
                 <br><br>
                 <button type="button" class="close btn btn-outline-dark" aria-label="Close">Cancel</button>
                 <button class="btn btn-primary">Add New Department</button>
                 `);

                 locations.forEach((location) => {
                  $("#modalSelectLoc").append(
                    `<option value="${location.id}">${location.name}</option>`
                  )})
                 
                         
  $("#extraInfo").modal("show")
  $(".modal-body").on("click", `.close`, function () {
    closeModal();

})
});

//opens modal to add a location
$("#addLoc").click(function (event) {
  event.preventDefault()               
  $(".modal-body").html(`
 
                 <label for="newLoc"><p>Name of new business location</p></label>
                 <input type="text" class="form-control" id="newLocation" required minlength="2" maxlength="20" pattern="(^[A-Za-z' -]+$)" autocomplete="off" autocapitalize>
                 <br>
                 <button type="button" class="close btn btn-outline-dark" aria-label="Close">Cancel</button>
                 <button class="btn btn-primary" id="addNewLocation">Add New Location</button>
                 
                 `);
  $("#extraInfo").modal("show");
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  });
  $("#addNewLocation").on("click", function () {
    let locationName = $("#newLocation").val()
    callApi("insertLocation", "GET", getNewLocConfirmation, locationName);  
  });
});


const getNewLocConfirmation = (data) => {
  initialiseData()
  $(".modal-body").html(`<p><strong>${data.data}</strong></p>
  <button class="btn btn-outline-dark close">Close</button>`);
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  })
}


// Data filters 
// On whole name 

$("#searchNames").on('input', function(e) {
  let lettersToSearch = e.currentTarget.value.toLowerCase();

  let searchData = ($("#selectDept").val() === "reset" && $("#selectLoc").val() === "reset") ? staticResults : results; 
  

  results = searchData.filter((result) => {
  result.wholeName = result.firstName.toLowerCase() + result.lastName.toLowerCase();
  return result.wholeName.includes(lettersToSearch)  
  })
  getAllData(results)
})


$("#selectDept").on('change', function(e) {
  searchDept = e.currentTarget.value;
  if (searchDept === 'reset') {
    resetData() 
  } else {
  const searchData = results;
  results = searchData.filter(result => result.departmentID === searchDept)
  getAllData(results);
  }
})


$("#selectLoc").on('change', function(e) {
  searchLoc = e.currentTarget.value;
  if (searchLoc === 'reset') {
    resetData()
  } else {
  const searchData = results;
  results = searchData.filter(result => result.location === searchLoc)
  getAllData(results);
  }
})

const resetData = () => {
  getAllData(staticResults)
$('#searchNames').val("");
$('#selectDept').val("reset");
$('#selectLoc').val("reset");
}

$('#resetButton').click(function(){
  resetData()
})

//need to make the department an integer!!!
const addOrEditStaff = () => {
  let firstName = $('#forename').val()
  let lastName = $('#surname').val()
  let department = $('#modalSelectDept').val()
  let location = $('#modalSelectLoc').val()  
  let email = $('#email').val()
  callApi("insertEmployee", "POST", getAddEditConfirmation, firstName, lastName, email, department);
}

const getAddEditConfirmation = (data) => {
  callApi("getAll", "GET", getAllData); 
  buildForm(newEmployee, `${data.data[0]} <br><br>Continue to add `, "Add Another Employee")
  $("#extraInfo").modal("show");
};



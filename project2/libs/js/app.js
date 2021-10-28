// Build add/edit employee modal form
const buildForm = (employee, verb, commit) => {
                 $(".modal-body").html(`<form id="editModal">
                 <p id="modal-start">${verb} the employee details and save.</p>
                 <div class="row-flex">
                 <label for="forename"><p>First Name</p></label>
                 <input type="text" class="form-control" placeholder="${employee.firstName}" id="forename" required minlength="2" maxlength="15" pattern="(^[A-Za-z' -]+$)" autofocus>
                 </div><br> 
       
                 <div class="row-flex">
                 <label for="surname"><p>Surname</p></label>
                 <input type="text" class="form-control" placeholder="${employee.lastName}" id="surname" required minlength="2" maxlength="25" pattern="(^[A-Za-z -]+$)">
                 </div><br>
       
                 <div class="row-flex">
                 <label for="department"><p>Department</p></label>
                 <select class="form-control" id="modalSelectDept">
                 <option value="reset"></option>
                 </select>
                 </div><br>
       
                 <div class="row-flex">
                 <label for="location"><p>Location</p></label>
                 <select class="select" id="modalSelectLoc">
                 <option value="reset"></option>
                 </select>
                 </div><br>
               
                 <div class="row-flex">
                 <label for="email"><p>Email</p></label>
                 <input type="email" class="form-control" placeholder="${employee.email}" id="email" maxlength="30" required>
                 </div><br>
       
       
                 <button type="submit" class="btn btn-primary">${commit}</button>
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
                      
                    
              
}

const blankEmployee = {
  firstName: "",
  lastName: "",
  department: "",
  location: "",
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
      console.log(`${apiUrl}: ajax call failed ${textStatus}`);
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
  console.log(departments)
  departments.forEach((department) => {
    $("#selectDept").append(
      `<option value="${department.id}">${department.name}</option>`
    )
  })
}

const getLocationData = (data) => {
  locations = data.data;
  console.log(locations)
  locations.forEach((location) => {
    $("#selectLoc").append(
      `<option value="${location.name}">${location.name}</option>`
    )
  })
}

$(document).ready(function () {
  callApi("getAll", "GET", getAllData);
  callApi("getAllDepartments", "GET", getDepartmentData);
  callApi("getAllLocations", "GET", getLocationData);
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
  <button class="btn btn-primary">Delete</button>
  <button class="btn btn-outline-dark close">Cancel</button>`);
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  });
}

//opens modal to add a staff record
$("#addStaff").click(function (event) {
  event.preventDefault();
  buildForm(blankEmployee, 'Add', "Add Employee")
  $("#extraInfo").modal("show");
});

//opens modal to add a department
$("#addDept").click(function (event) {
  event.preventDefault();
  $(".modal-body").html(`<form id="addDeptForm">
                 
                 <label for="newDept"><p>Name of new department</p></label>
                 <input type="text" class="form-control" id="newDept" minlength="2" maxlength="20" autofocus>
                 <br>
                 <button type="button" class="close btn btn-outline-dark" aria-label="Close">Cancel</button>
                 <button type="submit" class="btn btn-primary">Add New Department</button>
                 
                 </form>`);
                         
  $("#extraInfo").modal("show")
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
})
});

//opens modal to add a location
$("#addLoc").click(function (event) {
  event.preventDefault();
  $(".modal-body").html(`<form id="addLocForm">
                 
                 <label for="newLoc"><p>Name of new business location</p></label>
                 <input type="text" class="form-control" id="newLocation" minlength="2" maxlength="20" autofocus>
                 <br>
                 <button type="button" class="close btn btn-outline-dark" aria-label="Close">Cancel</button>
                 <button type="submit" class="btn btn-primary">Add New Location</button>
                 
                 </form>`);
  $("#extraInfo").modal("show");
  $(".modal-body").on("click", `.close`, function () {
    closeModal();
  });
});



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




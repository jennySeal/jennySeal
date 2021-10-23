
const buttons = `<div id="buttons">
                 <button class="btn btn-secondary" id="view"><i class="far fa-eye"></i></button>
                 <button class="btn btn-outline-dark" id="edit"><i class="far fa-edit"></i></button>
                 <button class="btn btn-primary" id="delete"><i class="far fa-trash-alt"></i></button>
                 </div>`;
    
let results;



//Generic function for API call
const callApi = (phpToCall, apiMethod, callbackFun, parameter1, parameter2, parameter3, parameter4) => {
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
    results = data.data;
    results.forEach(function callback(employee, index) {
        $("#firstRow").append(`<tr key=${index}><td>
        <div id="card-flex">
        <div class="card">
             <p id="nameData">${employee.firstName} ${employee.lastName}</p>
             <p id="departmentData">${employee.department}</p>
             <p id="locationData">${employee.location}</p>
             
         </div>
         <div id="buttons">
                 <button class="btn btn-secondary" type="button" id="view${index}" name="${index}")"><i class="far fa-eye"></i></button>
                 <button class="btn btn-outline-dark" id="edit${index}""><i class="far fa-edit" value=${index}></i></button>
                 <button class="btn btn-primary" id="delete${index}" ><i class="far fa-trash-alt"></i></button>
                 </div>
         </div>
     </td>
     </tr>`)
     $("#firstRow").on("click", `#view${index}`, function(){
        viewStaff(index);
    });        
    });
};

$(document).ready(function() {
    callApi("getAll", "GET", getAllData);
    
    })

$("#closeModal").click(function () {
    $("#extraInfo").modal('hide');
  });

$("#hidingButton").click(function (event) {
   event.preventDefault()
   $("#extraInfo").modal('show');
  });



const viewStaff = (index) => {
    console.log(results[index])
    $(".modal-body").html(`<h3><strong>${results[index].firstName} ${results[index].lastName}</strong></h3>
    <p>${results[index].department} department</p><p>The ${results[index].location} Office</p><p id="email">${results[index].email}</p>`)
    $("#extraInfo").modal('show');
}



  $("#addStaff").click(function (event) {
    event.preventDefault()
    $("#extraInfo").modal('show');
   });


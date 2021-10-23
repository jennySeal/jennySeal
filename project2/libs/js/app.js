
const buttons = `<div id="buttons">
                 <button class="btn btn-secondary"><i class="far fa-eye"></i></button>
                 <button class="btn btn-outline-dark"><i class="far fa-edit"></i></button>
                 <button class="btn btn-primary"><i class="far fa-trash-alt"></i></button>
                 </div>`;
    



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
    const results = data.data;
    results.forEach(employee => {
        $("#firstRow").append(`<tr><td>
        <div id="card-flex">
        <div class="card">
             <p id="nameData">${employee.firstName} ${employee.lastName}</p>
             <p id="departmentData">${employee.department}</p>
             <p id="locationData">${employee.location}</p>
             
         </div>
         ${buttons}
         </div>
     </td>
     </tr>`)        
    });
};

  
callApi("getAll", "GET", getAllData);

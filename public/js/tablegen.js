

let users = $("#userid").html();

let database = JSON.parse(users);


for(item in database){
    delete database[item]._id;
    delete database[item]._email;
    delete database[item].osce_answer;
    delete database[item].osce_mark;
    delete database[item].rapid_answer;
    delete database[item].rapid_mark;
    delete database[item].__v;
    delete database[item].rapid_starttime;
    delete database[item].osce_starttime;
}


function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

let table = document.querySelector("table");
let data = Object.keys(database[0]);
generateTable(table, database);
generateTableHead(table, data);



window.setTimeout(function () {
    window.location.reload();
  }, 120000);

let toDoList = {
  toDos: [],
  maxItemNum: 0,
  getCurrent: function() { return this.toDos[this.maxItemNum-1]; },
  getFirstItemMatch: function(content) { 
    function locate(toDo) {
      return toDo.item == content;
    }
    return this.toDos.find(locate);
  },
  getItemIdx: function(searchToDo) {
    function locate(toDo) {
      return toDo.item == searchToDo.item;
    }
    return this.toDos.findIndex(locate);    
  },
  add: function(myToDo) {
    this.toDos.push(myToDo);
    this.maxItemNum ++;
  },
  delete: function(myToDo) {
    let location = this.getItemIdx(myToDo);
    this.toDos.splice(location, 1);
    this.maxItemNum --;
  }
}

//toDo object constructor (old way).
//function toDo(itemStr) {
//  this.item = itemStr;
//  this.addMeToList = function() { toDoList.add(this); }
//  this.deleteMeFromList = function() { toDoList.delete(this); }
//}

//toDo object class and constructor (new way).
class toDo {
  item;
  constructor(itemStr) {
    this.item = itemStr;   
  }
  addMeToList = () => toDoList.add(this);  //Arrow function format.  Could also be written as addMeToList = funtion() { toDoList.add(this) };
  deleteMeFromList = function() { toDoList.delete(this); };  //Anonymous function format.  Could also be written as deleteMeFromList = () => toDoList.delete(this);
}

let toDoTable = {
  tableElement: document.getElementById("toDoTable"),
  tableArray: [],
  addToTable: function() {
    let toDo = toDoList.getCurrent();
    let newRow = this.tableElement.insertRow(-1);

    // let col0Txt = `<td class="col1">${toDo.item}</td>`;  <--- doesn't work in IE.
    let col0Txt = '<td class="col1">' + toDo.item + '</td>';
    let col1Txt1 = '<td class="col2" onclick="colClick(this)">';
    let inputField = '<input class="chkbox" type="checkbox">';
    let col1Txt2 = '</td>';
    newRow.innerHTML = col0Txt + col1Txt1 + inputField + col1Txt2;
    //Scroll to the new item at the bottom of the list.
    document.getElementById("toDoTBody").scrollTop = document.getElementById("toDoTBody").scrollHeight; 

  },
  deleteFromTable: function() {
    for (let rowNum = this.tableArray.length-1; rowNum >= 0; rowNum--) {
      this.tableElement.deleteRow(this.tableArray[rowNum]);
    }
    this.tableArray.length = 0;  //reset the array of rows to be deleted.
    document.getElementById("toDoTBody").scrollTop = 1;  //Scroll to highest scroll position
  },
  subBtn: function(inputField) {
    let toDoTxt = document.getElementById(inputField);
    if (toDoTxt.value == '') alert("Must enter to-do item.")
    else {
      if (toDoList.getFirstItemMatch(toDoTxt.value) == undefined) {
        let newToDo = new toDo(toDoTxt.value);
        newToDo.addMeToList();
        toDoTxt.value = '';
        this.addToTable();
      } else alert("The To Do item you entered already exists.")
    }
  },
  delBtn: function() {
    let deletionTableRows = [];
    let deleteName = "";
    let tableRows = this.tableElement.getElementsByTagName("tr");

    for (let rowNum = 0; rowNum < tableRows.length; rowNum++) {
      let rowCols = tableRows[rowNum].getElementsByTagName("td");
      if (rowCols[1].getElementsByTagName("input")[0].checked) {  //if the checkbox column is checked
        deleteName = rowCols[0].innerHTML;  //the first column contains the to-do item text.
        let delToDo = new toDo(deleteName);
        delToDo.deleteMeFromList();
        this.tableArray.push(rowNum);
      }
    }
    this.deleteFromTable();
  },
  colClick: function(col) {
    let checked = col.getElementsByTagName("input")[0].checked;
    col.parentElement.className = (checked ? "checked" : "unchecked");
  }
}


function colClick(col) {
    toDoTable.colClick(col);
}


function subBtn() {
    toDoTable.subBtn(document.getElementsByTagName("input")[1].id);
}

function delBtn() {
    toDoTable.delBtn();
}

function modBtn() {
  //toDoTable.modBtn();
}

const toDoForm = document.getElementById("controlPanel");
const buttonList = toDoForm.getElementsByTagName("button");
console.log(buttonList);
for (let xx = 0; xx < buttonList.length; xx++ ) {
  switch (buttonList[xx].id) {
    case "addToDo": 
      buttonList[xx].addEventListener("click", subBtn);
      break;
    case "deleteToDo":
      buttonList[xx].addEventListener("click", delBtn);
      break;
    case "modifyToDo":
      buttonList[xx].addEventListener("click", modBtn);
      break;
    default:
      console.log(`Unknown form button ${buttonList[xx].id} to addEventListener in toDo.js`);
  }
}


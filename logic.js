var htmlWrapper = document.querySelector('body'),
  searchBox = document.querySelector('#searchBox'),
  searchNodeColor = "rgba(214,95,92,0.5)",
  colorChangedNode,
  defultNodeColor,
  hasSearched = false,
  htmlString,
  controlButtonsVar,
  length;

var todoListArray = [];

// Debuing only function.
function msg(str) {
  console.log(str);
}

// Run this code only when script first loads.
window.onload = function() {
  //localStorage.removeItem('arrayData', todoListArray);
  if (localStorage.getItem('arrayData', todoListArray)) {
    tableLoad();
  } else {
    addExampleData();
    tableSave();
  }
  tablePrint();
};

function tableLoad() {
  var string = localStorage.getItem('arrayData', string);
  todoListArray = JSON.parse(string);
}

function tableSave() {
  localStorage.setItem('arrayData', JSON.stringify(todoListArray));
}

function addExampleData() {
  todoListArray = [{
      tName: 'Cook some food',
      dateOfCom: '03/05/18',
      tPriority: 1
    }, {
      tName: 'Take out the trash',
      dateOfCom: '03/05/18',
      tPriority: 2
    },
    {
      tName: 'Go out for a jog',
      dateOfCom: '03/05/18',
      tPriority: 1
    },
    {
      tName: 'Clean the house',
      dateOfCom: '03/05/18',
      tPriority: 2
    }
  ];
}

function tableSave(nameInput, dateInput, prioInput) {
  todoListArray.push({
    tName: nameInput,
    dateOfCom: dateInput,
    tPriority: prioInput
  });
}

// Control modal visability.
function ctrlModalVis(vis) {
  var pageCover = document.querySelector('#pageCover'),
    modalBody = document.querySelector('#modalWrapper');

  if (vis == true) {
    pageCover.style.display = "block";
    modalBody.style.display = "flex";
  } else {
    pageCover.style.display = "none";
    modalBody.style.display = "none";
  }
}

function addTableBtns(j) {
  controlButtonsVar = document.querySelectorAll('.controlButtons');
  length = controlButtonsVar.length;
  let up = document.createElement('button');

  // Loop which empties the button html fields.
  for (let x = 0; x < length; x++) {
    controlButtonsVar[x].innerHTML = "";
  }

  for (let j = 0; j < length; j++) {
    if (j !== 0) {
      processTableBtn(j, 'up', true);
    } else {
      //processTableBtn(j,'up',false);
    }

    if (j !== length - 1) {
      processTableBtn(j, 'down', true);
    } else {
      //processTableBtn(j,'down',false);
    }
    processTableBtn(j, 'remove', true);
  }
}

function processTableBtn(j, bName, visibility) {
  if (bName == 'up') {
    let up = document.createElement('button');
    if (visibility == true) {
      up.textContent = 'up';
      up.className = 'up';
    } else {
      up.className = 'lockedBtn';
      // up.style.visibility = 'hidden';
    }
    controlButtonsVar[j].appendChild(up);
  } else if (bName == 'down') {
    let down = document.createElement('button');
    if (visibility == true) {
      down.textContent = "dw";
      down.className = 'down';
    } else {
      down.className = 'lockedBtn';
      // down.style.visibility = 'hidden';
    }
    controlButtonsVar[j].appendChild(down);
  } else if (bName == 'remove') {
    let remove = document.createElement('button');
    if (visibility == true) {
      remove.className = 'remove';
      remove.textContent = 'x';
    }
    controlButtonsVar[j].appendChild(remove);
  }
}

function createTableRow(input) {
  var nameInput = document.querySelector('#taskNameInput'),
    prioInput = document.querySelector('#taskPrioInput'),
    dateInput = document.querySelector('#taskDateInput');

  if (nameInput.value !== 0) {

    tableSave(nameInput.value, dateInput.value, prioInput.value);
    tablePrint();

    nameInput.value = '';
    prioInput.value = '';
    dateInput.value = '';

    ctrlModalVis(false);
    tableSave();
  }
}


function tableBtnRespond(btnClass, eventTarget) {
  let td = eventTarget.target.parentNode;
  let tr = td.parentNode;
  let tbody = tr.parentNode;

  if (btnClass == 'remove') {
    tbody.removeChild(tr);
  } else if (btnClass == 'up') {
    let prevTr = tr.previousElementSibling;
    tbody.insertBefore(tr, prevTr);
  } else if (btnClass == 'down') {
    let nextTr = tr.nextElementSibling;
    tbody.insertBefore(nextTr, tr);
  }
  addTableBtns();
}

/* */
function searchObjArray() {
  hasSearched = false;
  var tableNames = document.querySelectorAll('.tName');
  if (colorChangedNode) {
    colorChangedNode.style.background = defultNodeColor;
  }

  if (searchBox.value !== 0) {
    var uSearch = searchBox.value.toLowerCase();
    for (var i = 0; i < tableNames.length; i++) {
      if (tableNames[i].textContent.toLowerCase().match(uSearch)) {
        if (findWord(uSearch, tableNames[i].textContent.toLowerCase())) {
          var targetNode = tableNames[i].parentNode;
          defultNodeColor = targetNode.style.background;
          colorChangedNode = targetNode;
          colorChangedNode.style.background = searchNodeColor;
          hasSearched = true;
        }
      }
    }
  }
  searchBox.value = "";
}

/* */
function findWord(word, str) {
  return RegExp('\\b' + word + '\\b').test(str);
}

/* */
htmlWrapper.addEventListener('click', (event) => {
  if (event.target.tagName == 'BUTTON') {
    var bName = event.target.className;

    if (event.target.parentNode.className == "controlButtons") {
      tableBtnRespond(bName, event);
    }

    if (searchBox.value != 0 || hasSearched == true) {
      if (event.target.id == "srchBtn") {
        searchObjArray();
      }
    }

    if (event.target.id == "submitButton") {
      createTableRow();
    }

    if (event.target.id == "addBtn") {
      ctrlModalVis(true);
    } else if (event.target.id == "closeModal") {
      ctrlModalVis(false);
    }
  }
});

/* */
searchBox.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    searchObjArray();
  }
});

function tablePrint() {
  htmlString = '';
  htmlString += '<thead><tr><th scope="col">Task Name</th><th scope="col">Priority</th><th scope="col">Completion Date</th><th scope="col">Controls</th></tr></thead><tbody>';

  for (var i = 0; i < todoListArray.length; i++) {
    htmlString += '<tr><th scope="row" class="tName">' +
      todoListArray[i].tName + '</th><td>' +
      todoListArray[i].tPriority + '</td><td>' +
      todoListArray[i].dateOfCom +
      '</td><td class = "controlButtons"></td></tr>';
  }

  htmlString += '</tbody>';
  document.querySelector('#todoHTML').innerHTML = htmlString;
  addTableBtns();
}

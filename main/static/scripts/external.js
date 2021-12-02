count = 0;

/* Функция открытия окна ввода данных*/
function openTab(tabName) {
  cnt = document.getElementById("cellCount");
  itr = document.getElementById("iterCount");

  if (document.getElementById("graph") != NaN) {
    var allImg = document.getElementById("graph");
    if (allImg != null) {
      allImg.parentNode.removeChild(allImg);
    }
    document.getElementById("graph-outPut").style.display = "none";
    document.getElementById("btns").style.display = "none";
  }

  if (cnt.value == "" || itr.value == "") {
    alert("Заполните все поля");
    return false;
  } else {
    var elem;
    elem = document.getElementById(tabName);
    elem.style.display = "block";
    generateMatrix();
    getVect();
    getTh();
    getMem();
    getDisc();
    getInit();
    count += 1;
  }
}

/* Функция генерации матрицы влияния*/
function generateMatrix() {
  var cell = document.getElementById("cellCount").value;
  var tbl = document.createElement("table");
  tbl.insertRow(-1);

  if (count >= 1 || document.querySelectorAll("div.matrixId") != NaN) {
    var allInput = document.querySelectorAll("div.matrixId");
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].parentNode.removeChild(allInput[i]);
    }
    newDiv = document.createElement("div");
    newDiv.id = "matrixId";
    newDiv.className = "matrixId";
    document.getElementById("matrix").appendChild(newDiv);
  }

  for (var j = 0; j <= cell; j++)
    tbl.tBodies[0].rows[0].insertCell(-1).innerHTML = j || " ";
  tbl.tBodies[0].rows[0].id = "rowName";
  for (var i = 1; i <= cell; i++) {
    tbl.insertRow(-1).insertCell(-1).innerHTML = i;
    for (var j = 1; j <= cell; j++) {
      var input = document.createElement("input");
      input.id = input.name = "m_" + i + "_" + j;
      input.size = "5";
      input.required = true;
      tbl.tBodies[0].rows[i].insertCell(-1).appendChild(input);
    }
  }
  document.getElementById("matrixId").appendChild(tbl);
}

/* Функция создания полей ввода стохастического вектора*/
function getVect() {
  var cell = document.getElementById("cellCount").value;
  var fiel = document.createElement("table");
  fiel.insertRow(-1);
  if (count >= 1 || document.querySelectorAll("div.stochasticId") != NaN) {
    var allInput = document.querySelectorAll("div.stochasticId");
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].parentNode.removeChild(allInput[i]);
    }
    newDiv = document.createElement("div");
    newDiv.id = "stochasticId";
    newDiv.className = "stochasticId";
    document.getElementById("stochastic").appendChild(newDiv);
  }
  for (var j = 0; j <= 2; j++)
    if (j == 0) {
      fiel.tBodies[0].rows[0].insertCell(-1).innerHTML = " ";
    } else {
      fiel.tBodies[0].rows[0].insertCell(-1).innerHTML = "c" + j;
      fiel.tBodies[0].rows[0].id = "rowName";
    }
  for (var i = 1; i <= cell; i++) {
    fiel.insertRow(-1).insertCell(-1).innerHTML; // =i
    for (var j = 1; j <= 2; j++) {
      var input = document.createElement("input");
      input.id = input.name = "st_" + i + "_" + j;
      input.size = "5";
      input.required = true;
      // input.setAttribute("onchange", changeInp());
      input.onkeydown = changeInp;
      fiel.tBodies[0].rows[i].insertCell(-1).appendChild(input);
    }
  }
  document.getElementById("stochasticId").appendChild(fiel);
}

/*Функция создания полей ввода порога активации */
function getTh() {
  var cell = document.getElementById("cellCount").value;
  var box = document.createElement("div");
  box.id = "th-div";

  if (count >= 1 || document.querySelectorAll("div.thId") != NaN) {
    var allInput = document.querySelectorAll("div.thId");
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].parentNode.removeChild(allInput[i]);
    }
    newDiv = document.createElement("div");
    newDiv.id = "thId";
    newDiv.className = "thId";
    document.getElementById("th").appendChild(newDiv);
  }

  for (var i = 0; i < cell; i++) {
    var fiel = document.createElement("input");
    fiel.name = "th_" + i;
    fiel.required = true;
    box.appendChild(fiel);
  }
  box.className = "input-field";
  document.getElementById("thId").appendChild(box);
}

/*Функция создания полей ввода памяти */
function getMem() {
  var cell = document.getElementById("cellCount").value;
  var box = document.createElement("div");
  box.id = "mem-div";

  if (count >= 1 || document.querySelectorAll("div.memoryId") != NaN) {
    var allInput = document.querySelectorAll("div.memoryId");
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].parentNode.removeChild(allInput[i]);
    }
    newDiv = document.createElement("div");
    newDiv.id = "memoryId";
    newDiv.className = "memoryId";
    document.getElementById("memory").appendChild(newDiv);
  }

  for (var i = 0; i < cell; i++) {
    var fiel = document.createElement("input");
    fiel.name = "mem_" + i;
    fiel.required = true;
    box.appendChild(fiel);
  }
  box.className = "input-field";
  document.getElementById("memoryId").appendChild(box);
}

/*Функция создания полей ввода коэффициента дисконтирования */
function getDisc() {
  var cell = document.getElementById("cellCount").value;
  var box = document.createElement("div");
  box.id = "disc-div";

  if (count >= 1 || document.querySelectorAll("div.discId") != NaN) {
    var allInput = document.querySelectorAll("div.discId");
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].parentNode.removeChild(allInput[i]);
    }
    newDiv = document.createElement("div");
    newDiv.id = "discId";
    newDiv.className = "discId";
    document.getElementById("disc").appendChild(newDiv);
  }

  for (var i = 0; i < cell; i++) {
    var fiel = document.createElement("input");
    fiel.name = "disc_" + i;
    fiel.required = true;
    box.appendChild(fiel);
  }
  box.className = "input-field";
  document.getElementById("discId").appendChild(box);
}

/*Функция создания полей ввода начального состояния */
function getInit() {
  var cell = document.getElementById("cellCount").value;
  var box = document.createElement("div");
  box.id = "init-div";

  if (count >= 1 || document.querySelectorAll("div.initialId") != NaN) {
    var allInput = document.querySelectorAll("div.initialId");
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].parentNode.removeChild(allInput[i]);
    }
    newDiv = document.createElement("div");
    newDiv.id = "initialId";
    newDiv.className = "initialId";
    document.getElementById("initial").appendChild(newDiv);
  }

  for (var i = 0; i < cell; i++) {
    var fiel = document.createElement("input");
    fiel.name = "init_" + i;
    fiel.required = true;
    box.appendChild(fiel);
  }
  box.className = "input-field";
  document.getElementById("initialId").appendChild(box);
}

// Функция валидации полей
function validateForm(input) {
  var value = input.value;
  var rep = /[-\.;":'a-zA-Zа-яА-Я]/;
  if (rep.test(value)) {
    value = value.replace(rep, "");
    input.value = value;
  }
}

//
function showGraph() {
  return false;
}
// Функция автоматического заполнения 
function readFile(input) {

  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    console.log(reader.result);
    let res = reader.result;
    let count = res.split(';')[0];
    let iter = res.split(';')[1];

    console.log(count);

    document.getElementById("cellCount").value = count;
    document.getElementById("iterCount").value = iter;
    openTab("inputData");

    let matrix = res.split(';')[2];
    let p = -1;
    for (i = 0; i < count; i++) {
      for (j = 0; j < count; j++) {
        n = 'm_'+(i+1)+'_'+(j+1);
        p+=1;
        document.getElementById(n).value = matrix.split(',')[p];        
      }
    }

    let th = res.split(';')[3];
    for (i = 0; i < count; i++) {
      n = 'th_' + i;
      document.getElementsByName(n)[0].value = th.split(',')[i];
    }

    let mem = res.split(';')[4];
    for (i = 0; i < count; i++) {
      n = 'mem_' + i;
      document.getElementsByName(n)[0].value = mem.split(',')[i];
    }

    let disc = res.split(';')[5];
    for (i = 0; i < count; i++) {
      n = 'disc_' + i;
      document.getElementsByName(n)[0].value = disc.split(',')[i];
    }

    let init = res.split(';')[6];
    for (i = 0; i < count; i++) {
      n = 'init_' + i;
      document.getElementsByName(n)[0].value = init.split(',')[i];
    }

    let st = res.split(';')[7];
    p = -1;
    for (i = 0; i < count; i++) {
      for (j = 0; j < 2; j++) {
        n = 'st_'+(i+1)+'_'+(j+1);
        p+=1;
        document.getElementById(n).value = st.split(',')[p];        
      }
    }

  };

  reader.onerror = function() {
    console.log(reader.error);
  };


}

// Функция сохранение в БД 
function saveFile() {
  var str;
  count = document.getElementById("cellCount").value;
  str = String(count);
  str += ';'
  str += String(document.getElementById("iterCount").value);
  str += ';'
  for (i=0; i < count; i++) {
    for (j=0; j<count; j++) {
      n = 'm_'+(i+1)+'_'+(j+1);
      str += String(document.getElementById(n).value);
      if (i != (count-1) || j!=(count - 1)) {
        str += ','
      }      
    }
  }
  str += ';';

  for (i = 0; i < count; i++) {
    n = 'th_' + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != (count-1)) {
      str += ','
    }   
  }
  str += ';'

  for (i = 0; i < count; i++) {
    n = 'mem_' + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != (count-1)) {
      str += ','
    }   
  }
  str += ';'

  for (i = 0; i < count; i++) {
    n = 'disc_' + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != (count-1)) {
      str += ','
    }   
  }
  str += ';'

  for (i = 0; i < count; i++) {
    n = 'init_' + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != (count-1)) {
      str += ','
    }   
  }
  str += ';';


  for (i=0; i < count; i++) {
    for (j=0; j<count; j++) {
      n = 'st_'+(i+1)+'_'+(j+1);
      str += String(document.getElementById(n).value);
      if (i != (count-1) || j!=(count - 1)) {
        str += ','
      }      
    }
  }
  str += ';';



  console.log(str);
  var a = document.createElement('a'); 
  a.style.display = "none";
  a.id = 'a';
  document.getElementById("btns").appendChild(a);
  type = "text/plain";
  var file = new Blob([str], {type: type});
  a.href = URL.createObjectURL(file);

  nm = document.getElementById("FileName").value;  

  a.download = nm;
  a.click();

  
} 



// Функция сохранения данных
function downloadData() {
  var doc = new jsPDF();
  var imgData = document.getElementsByTagName("img");
  var PNGtoUrl = imgData[0].src;
  count = document.getElementById("cellCount").value;
  y = 10;
  doc.setFontSize(22);
  doc.text(75, y, "Network behavior");
  y+=10;
  doc.setFontSize(9);
  doc.text(20, y, "Number: " + count);
  y= y + 5;
  celly = y;
  doc.text(20, y, "Matrix: ")
  for (var i = 0; i < count; i++) {
    y+=4;
    x = 20;
    for (var j = 0; j < count; j++) {
      n = 'm_'+(i+1)+'_'+(j+1);
      doc.text(x, y, document.getElementById(n).value);
      x+=10;
    }
  }

  x+=40;
  doc.text(x, celly, "Activation Threshold: ")
  for (var i = 0; i<count; i++) {
    celly+=4;
    n = 'th_' + i;
    doc.text(x, celly, document.getElementsByName(n)[0].value);
  }

  y+=5;
  celly = y;
  doc.text(20, y, "Memory depth of agents: ")
  for (var i = 0; i<count; i++) {
    y+=4;
    n = 'mem_' + i;
    doc.text(20, y, document.getElementsByName(n)[0].value);
  }

  
  doc.text(x, celly, "Discount coefficient: ")
  for (var i = 0; i<count; i++) {
    celly+=4;
    n = 'disc_' + i;
    doc.text(x, celly, document.getElementsByName(n)[0].value);
  }

  y+=5;
  celly = y;
  doc.text(20, y, "Initial state of agents: ")
  for (var i = 0; i<count; i++) {
    y+=4;
    n = 'init_' + i;
    doc.text(20, y, document.getElementsByName(n)[0].value);
  }

  cellx = x;
  doc.text(cellx, celly, "Stochastic vector: ")
  for (var i = 0; i < count; i++) {
    celly+=4;
    cellx = x;
    for (var j = 0; j < 2; j++) {
      n = 'st_'+(i+1)+'_'+(j+1);
      doc.text(cellx, celly, document.getElementById(n).value);
      cellx+=10;
    }
  }

  y+=7;
  celly = y;
  doc.addImage(PNGtoUrl, "png", 20, celly, 150, 140);

  h = imgData[0].height;
  console.log(h);

  y+=h;
  var res = doc.autoTableHtmlToJson(document.getElementById("tblID"));
  doc.autoTable(res.columns, res.data, {
    startY: y,
    styles: {
      cellPadding: 0.1,
      overflow: "linebreak",
      valign: "middle",
      halign: "center",
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      minCellHeight: 5,
      rowHeight: 6
    },
    useCss: true
  });

  // doc.addText(20, 20, "Behavior");


  doc.save("protocol.pdf");
}

function changeInp() {
  if (count >= 1) {
    document.getElementById(this.id).onchange = function () {
      m = this.id;
      var last = m.slice(-1);
      if (last == "1") {
        m = m.substring(0, m.length - 1) + "2";
      } else {
        m = m.substring(0, m.length - 1) + "1";
      }

      var j = document.getElementById(m);
      b = 1 - document.getElementById(this.id).value;
      j.value = b.toFixed(2);
    };
  }
}

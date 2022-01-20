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
   }
  else {
    var elem;
    elem = document.getElementById(tabName);
    elem.style.display = "block";
    count += 1;
    showGraph();
  }
}

function showGraph() {
  return false;
}
// Функция чтения файла 
function readFile(input) {

  const selectedFile = input.files[0];

  let reader = new FileReader();
  reader.readAsText(selectedFile);

  reader.onload = function(){
    newDiv = document.createElement('div')
    newDiv.id = "txtInput";
    newDiv.className = "txtInput";
    newDiv.innerText = reader.result;
    document.getElementById("section-content").appendChild(newDiv);
    interData();
    openBox();
  }
}


function openBox() { 
  p = document.createElement('p')
  p.innerText = "Выберите параметры для фиксирования"
  document.getElementById("checkbox-section").appendChild(p);

  newDiv = document.createElement('div')
  newDiv.id = "checkboxes"
  document.getElementById("checkbox-section").appendChild(newDiv);
  
  nameArr = ['Матрица', 'Пороги','Начальное состояние','Память', 'Коэф. дисконтирования', 'Стохастический вектор']
  nameId = ['matrix_str','Th_str','init_str','mem_str','disc_str', 'st']
  for (i=0; i<6; i++) {
    var input = document.createElement('input');
    input.type="checkbox";
    input.id="inpID" + i;
    input.name = nameId[i];
    input.className = "form-check-input"

    
    var label = document.createElement('label');
    label.textContent = nameArr[i];
    label.id="lblID" + i;
    label.className = "labChk"
    label.setAttribute("for", input.id);
    
    document.getElementById("checkboxes").appendChild(label);
    label.parentNode.insertBefore(input, label);
  }


}

function interData(){
  sc = document.getElementById("txtInput").innerText;

  let res = sc.split("\n");
  console.log(res);

  let i = 0
  while (!res[i].includes("mem")) {
    i++
  }

  console.log(i);
  res[3] += " ";

  for (j = 4; j<i; j++) {
    res[3] += res[j]
  }
  
  res.splice(4, i-4);

  console.log(res);

  count = res[0].split(":")[1];
  iter = res[7].split(":")[1];
  
  console.log(iter)
  document.getElementById('cellCount').value = count;
  document.getElementById('iterCount').value = iter;

  nameId = ['matrix_str1','Th_str1','init_str1','mem_str1','disc_str1', 'st1']
  for (k = 1; k < 7; k++) {
    newInput = document.createElement('input')
    newInput.type = 'text'
    newInput.name = nameId[k-1]
    newInput.value = res[k].split(":")[1];
    document.getElementById("section-content").appendChild(newInput);
  }

  // document.getElementById("section-content").appendChild(cnt);
  // cnt

  // $.ajax({
  //     url: 'http://127.0.0.1:8000/',
  //     type: 'POST',
  //     data: {
  //       'matrix': matrix, 
  //       'Th': Th, 
  //       'init': init, 
  //       'mem': mem, 
  //       'disc': disc, 
  //       'st': st, 
  //     },

  //     success: function (data) {
  //     location.reload(true)
  //   }
  // });
}



// function readFile(input) {

//   let file = input.files[0];

//   let reader = new FileReader();

//   reader.readAsText(file);

//   reader.onload = function() {
//     console.log(reader.result);
//     let res = reader.result;
//     let count = res.split(';')[0];
//     let iter = res.split(';')[1];

//     console.log(count);

//     document.getElementById("cellCount").value = count;
//     document.getElementById("iterCount").value = iter;
//     openTab("inputData");

//     let matrix = res.split(';')[2];
//     let p = -1;
//     for (i = 0; i < count; i++) {
//       for (j = 0; j < count; j++) {
//         n = 'm_'+(i+1)+'_'+(j+1);
//         p+=1;
//         document.getElementById(n).value = matrix.split(',')[p];        
//       }
//     }

//     let th = res.split(';')[3];
//     for (i = 0; i < count; i++) {
//       n = 'th_' + i;
//       document.getElementsByName(n)[0].value = th.split(',')[i];
//     }

//     let mem = res.split(';')[4];
//     for (i = 0; i < count; i++) {
//       n = 'mem_' + i;
//       document.getElementsByName(n)[0].value = mem.split(',')[i];
//     }

//     let disc = res.split(';')[5];
//     for (i = 0; i < count; i++) {
//       n = 'disc_' + i;
//       document.getElementsByName(n)[0].value = disc.split(',')[i];
//     }

//     let init = res.split(';')[6];
//     for (i = 0; i < count; i++) {
//       n = 'init_' + i;
//       document.getElementsByName(n)[0].value = init.split(',')[i];
//     }

//     let st = res.split(';')[7];
//     p = -1;
//     for (i = 0; i < count; i++) {
//       for (j = 0; j < 2; j++) {
//         n = 'st_'+(i+1)+'_'+(j+1);
//         p+=1;
//         document.getElementById(n).value = st.split(',')[p];        
//       }
//     }

//   };

//   reader.onerror = function() {
//     console.log(reader.error);
//   };
// }

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

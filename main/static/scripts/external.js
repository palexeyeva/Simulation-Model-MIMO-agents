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

  reader.onload = function () {
    newDiv = document.createElement("div");
    newDiv.id = "txtInput";
    newDiv.className = "txtInput";
    newDiv.innerText = reader.result;
    document.getElementById("section-content").appendChild(newDiv);
    interData();
    openBox();
  };
}

function openBox() {
  p = document.createElement("p");
  p.innerText = "Выберите параметры для фиксирования";
  document.getElementById("checkbox-section").appendChild(p);

  newDiv = document.createElement("div");
  newDiv.id = "checkboxes";
  document.getElementById("checkbox-section").appendChild(newDiv);

  nameArr = [
    "Матрица",
    "Пороги",
    "Начальное состояние",
    "Память",
    "Коэф. дисконтирования",
    "Стохастический вектор",
  ];
  nameId = [
    "matrix_str",
    "Th_str",
    "init_str",
    "mem_str",
    "disc_str",
    "st_str",
  ];
  for (i = 0; i < 6; i++) {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = "inpID" + i;
    input.name = nameId[i];
    input.className = "form-check-input";

    var label = document.createElement("label");
    label.textContent = nameArr[i];
    label.id = "lblID" + i;
    label.className = "labChk";
    label.setAttribute("for", input.id);

    document.getElementById("checkboxes").appendChild(label);
    label.parentNode.insertBefore(input, label);
  }
}

function additionalInfo(opt) {
  if (document.getElementById("input-additional") != null) {
    document.getElementById("input-additional").remove();
  }

  if (document.getElementById("input-file") != null) {
    document.getElementById("input-file").remove();
  }

  console.log(opt.value);
  if (opt.value == "Influential") {
    addInf();
  } else if (opt.value == "ParamCommunityVK") {
    addParam(0);
    downloadFile(1);
  }  else if (opt.value == "TwoCommunity") {
    addParam(1);
    downloadFile(0);
  }
}

function downloadFile(fl) {
  newDiv = document.createElement("div");
  newDiv.id = "input-file";
  document.getElementById("add-section").appendChild(newDiv);

  // 
  inputDiv = document.createElement("div");
  inputDiv.id = "input-matrix";
  document.getElementById("input-file").appendChild(inputDiv);

  p = document.createElement("p");
  p.innerText = "Выберите файл с матрицей";
  document.getElementById("input-matrix").appendChild(p);

  input = document.createElement("input");
  input.type = "file";
  input.className = "form-control form-control-sm inp-file"
  input.name = "fileMatrix";
  input.id = "fileMatrix";
  document.getElementById("input-matrix").appendChild(input);

  // 
  if (fl) {
    inputDiv = document.createElement("div");
    inputDiv.id = "input-json";
    document.getElementById("input-file").appendChild(inputDiv);
  
    p = document.createElement("p");
    p.innerText = "Выберите файл json с параметрами агентов";
    document.getElementById("input-json").appendChild(p);
  
    input = document.createElement("input");
    input.type = "file";
    input.className = "form-control form-control-sm inp-file"
    input.name = "fileJson";
    input.id = "fileJson";
    document.getElementById("input-json").appendChild(input);
  }

}

function addParam(fl) {
  newDiv = document.createElement("div");
  newDiv.id = "input-additional";
  document.getElementById("add-section").appendChild(newDiv);

  p = document.createElement("h2");
  p.innerText = "Дополнительные параметры сети";
  p.id = "addParam";
  document.getElementById("input-additional").appendChild(p);

  newDiv = document.createElement("div");
  newDiv.id = "input-param";
  document.getElementById("input-additional").appendChild(newDiv);
  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-mem";
  inputDiv.className = "inp-add";
  document.getElementById("input-param").appendChild(inputDiv);

  var input = document.createElement("input");
  input.type = "number";
  input.name = "memA";
  input.id = "memA";
  input.value = "3";
  p2 = document.createElement("p");
  if (fl) {
    p2.innerText = "Глубина памяти для агентов";
  } else {
    p2.innerText = "Глубина памяти для аналитических агентов";
  }

  document
    .getElementById("input-mem")
    .appendChild(document.createElement("br"));
  document.getElementById("input-mem").appendChild(p2);
  document.getElementById("input-mem").appendChild(input);
  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-disc";
  inputDiv.className = "inp-add";
  document.getElementById("input-param").appendChild(inputDiv);

  var input = document.createElement("input");
  input.type = "number";
  input.name = "discA";
  input.id = "discA";
  input.value = "0.7";
  p3 = document.createElement("p");

  if (fl) {
    p3.innerText = "Коэффициент дисконтирования памяти агентов";
  } else {
    p3.innerText =
      "Коэффициент дисконтирования памяти для аналитических агентов";
  }

  document.getElementById("input-disc").appendChild(p3);
  document.getElementById("input-disc").appendChild(input);
  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-select";
  inputDiv.className = "inp-add";
  document.getElementById("input-param").appendChild(inputDiv);

  var select = document.createElement("select");
  select.className = "form-select form-select-sm";
  select.ariaLabel = ".form-select-sm example";
  select.name = "initial-options";

  var option = document.createElement("option");
  option.value = "init0";
  option.textContent = "В начальный момент времени агенты не активны";
  select.appendChild(option);

  var option = document.createElement("option");
  option.value = "init1";
  option.textContent =
    "В начальный момент времени агенты активны по первому типу";
  select.appendChild(option);

  var option = document.createElement("option");
  option.value = "init2";
  option.textContent = "Равномерное распределение типов активности";
  select.appendChild(option);

  p3 = document.createElement("p");
  p3.innerText = "Начальное состояние сети";
  if (fl) {
    document
    .getElementById("input-select")
    .appendChild(document.createElement("br"));
  }
  else {
    document
    .getElementById("input-select")
    .appendChild(document.createElement("br"));
  document
    .getElementById("input-select")
    .appendChild(document.createElement("br"));
  }

  document.getElementById("input-select").appendChild(p3);
  document.getElementById("input-select").appendChild(select);
  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-tact";
  inputDiv.className = "inp-add";
  document.getElementById("input-param").appendChild(inputDiv);

  var input = document.createElement("input");
  input.type = "number";
  input.name = "initTact";
  input.id = "initTact";
  input.value = "0";
  p3 = document.createElement("p");
  p3.innerText = "Такт начала первого импульса от генератора";

  document.getElementById("input-tact").appendChild(p3);
  document.getElementById("input-tact").appendChild(input);

  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-step";
  inputDiv.className = "inp-add";
  document.getElementById("input-param").appendChild(inputDiv);

  var input = document.createElement("input");
  input.type = "number";
  input.name = "step";
  input.id = "step";
  input.value = "4";
  p3 = document.createElement("p");
  p3.innerText = "Шаг генерации импульса";

  document
    .getElementById("input-step")
    .appendChild(document.createElement("br"));
  document.getElementById("input-step").appendChild(p3);
  document.getElementById("input-step").appendChild(input);

  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-select-type";
  inputDiv.className = "inp-add";
  document.getElementById("input-param").appendChild(inputDiv);

  var select = document.createElement("select");
  select.className = "form-select form-select-sm";
  select.ariaLabel = ".form-select-sm example";
  select.name = "initial-options";

  var option = document.createElement("option");
  option.value = "imp0";
  option.textContent =
    "Одновременный импульс от генераторов с разными типами активности";
  select.appendChild(option);

  var option = document.createElement("option");
  option.value = "imp1";
  option.textContent =
    "Поочередный импульс от генераторов с разными типами активности";
  select.appendChild(option);

  var option = document.createElement("option");
  option.value = "imp2";
  option.textContent =
    "Одновременный импульс от генераторов с одним типом активности";
  select.appendChild(option);

  var option = document.createElement("option");
  option.value = "imp3";
  option.textContent =
    "Поочередный импульс от генераторов с одним типом активности";
  select.appendChild(option);

  p3 = document.createElement("p");
  p3.innerText = "Тип генерации импульса";

  document
    .getElementById("input-select-type")
    .appendChild(document.createElement("br"));
  document.getElementById("input-select-type").appendChild(p3);
  document.getElementById("input-select-type").appendChild(select);
}

function addInf() {
  newDiv = document.createElement("div");
  newDiv.id = "input-additional";
  document.getElementById("add-section").appendChild(newDiv);

  p = document.createElement("h2");
  p.innerText = "Дополнительные параметры сети";
  p.id = "addParam";
  document.getElementById("input-additional").appendChild(p);

  newDiv = document.createElement("div");
  newDiv.id = "input-param-inf";
  document.getElementById("input-additional").appendChild(newDiv);
  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-R";
  inputDiv.className = "inp-add";
  document.getElementById("input-param-inf").appendChild(inputDiv);

  var input = document.createElement("input");
  input.type = "number";
  input.name = "inpR";
  input.id = "inpR";

  p2 = document.createElement("p");
  p2.innerText = "Сила воздействия влиятельного агента";


  document.getElementById("input-R").appendChild(p2);
  document.getElementById("input-R").appendChild(input);
  //
  inputDiv = document.createElement("div");
  inputDiv.id = "input-idAgent";
  inputDiv.className = "inp-add";
  document.getElementById("input-param-inf").appendChild(inputDiv);

  var input = document.createElement("input");
  input.type = "number";
  input.name = "idAgent";
  input.id = "idAgent";
  p3 = document.createElement("p");


  p3.innerText = "Номер такта для добавления влиятельного агента";


  document.getElementById("input-idAgent").appendChild(p3);
  document.getElementById("input-idAgent").appendChild(input);


}

function interData() {
  sc = document.getElementById("txtInput").innerText;

  let res = sc.split("\n");
  console.log(res);

  let i = 0;
  while (!res[i].includes("mem")) {
    i++;
  }

  console.log(i);
  res[3] += " ";

  for (j = 4; j < i; j++) {
    res[3] += res[j];
  }

  res.splice(4, i - 4);

  console.log(res);

  count = res[0].split(":")[1];
  iter = res[7].split(":")[1];
  cntType = res[8].split(":")[1];

  console.log(iter);
  document.getElementById("cellCount").value = count;
  document.getElementById("iterCount").value = iter;
  document.getElementById("cntType").value = cntType;

  nameId = [
    "matrix_str1",
    "Th_str1",
    "init_str1",
    "mem_str1",
    "disc_str1",
    "st_str1",
  ];
  for (k = 1; k < 7; k++) {
    newInput = document.createElement("input");
    newInput.type = "text";
    newInput.name = nameId[k - 1];
    newInput.value = res[k].split(":")[1];
    document.getElementById("section-content").appendChild(newInput);
  }
}

// Функция сохранение в БД
function saveFile() {
  var str;
  count = document.getElementById("cellCount").value;
  str = String(count);
  str += ";";
  str += String(document.getElementById("iterCount").value);
  str += ";";
  for (i = 0; i < count; i++) {
    for (j = 0; j < count; j++) {
      n = "m_" + (i + 1) + "_" + (j + 1);
      str += String(document.getElementById(n).value);
      if (i != count - 1 || j != count - 1) {
        str += ",";
      }
    }
  }
  str += ";";

  for (i = 0; i < count; i++) {
    n = "th_" + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != count - 1) {
      str += ",";
    }
  }
  str += ";";

  for (i = 0; i < count; i++) {
    n = "mem_" + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != count - 1) {
      str += ",";
    }
  }
  str += ";";

  for (i = 0; i < count; i++) {
    n = "disc_" + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != count - 1) {
      str += ",";
    }
  }
  str += ";";

  for (i = 0; i < count; i++) {
    n = "init_" + i;
    str += String(document.getElementsByName(n)[0].value);
    if (i != count - 1) {
      str += ",";
    }
  }
  str += ";";

  for (i = 0; i < count; i++) {
    for (j = 0; j < count; j++) {
      n = "st_" + (i + 1) + "_" + (j + 1);
      str += String(document.getElementById(n).value);
      if (i != count - 1 || j != count - 1) {
        str += ",";
      }
    }
  }
  str += ";";

  console.log(str);
  var a = document.createElement("a");
  a.style.display = "none";
  a.id = "a";
  document.getElementById("btns").appendChild(a);
  type = "text/plain";
  var file = new Blob([str], { type: type });
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
  y += 10;
  doc.setFontSize(9);
  doc.text(20, y, "Number: " + count);
  y = y + 5;
  celly = y;
  doc.text(20, y, "Matrix: ");
  for (var i = 0; i < count; i++) {
    y += 4;
    x = 20;
    for (var j = 0; j < count; j++) {
      n = "m_" + (i + 1) + "_" + (j + 1);
      doc.text(x, y, document.getElementById(n).value);
      x += 10;
    }
  }

  x += 40;
  doc.text(x, celly, "Activation Threshold: ");
  for (var i = 0; i < count; i++) {
    celly += 4;
    n = "th_" + i;
    doc.text(x, celly, document.getElementsByName(n)[0].value);
  }

  y += 5;
  celly = y;
  doc.text(20, y, "Memory depth of agents: ");
  for (var i = 0; i < count; i++) {
    y += 4;
    n = "mem_" + i;
    doc.text(20, y, document.getElementsByName(n)[0].value);
  }

  doc.text(x, celly, "Discount coefficient: ");
  for (var i = 0; i < count; i++) {
    celly += 4;
    n = "disc_" + i;
    doc.text(x, celly, document.getElementsByName(n)[0].value);
  }

  y += 5;
  celly = y;
  doc.text(20, y, "Initial state of agents: ");
  for (var i = 0; i < count; i++) {
    y += 4;
    n = "init_" + i;
    doc.text(20, y, document.getElementsByName(n)[0].value);
  }

  cellx = x;
  doc.text(cellx, celly, "Stochastic vector: ");
  for (var i = 0; i < count; i++) {
    celly += 4;
    cellx = x;
    for (var j = 0; j < 2; j++) {
      n = "st_" + (i + 1) + "_" + (j + 1);
      doc.text(cellx, celly, document.getElementById(n).value);
      cellx += 10;
    }
  }

  y += 7;
  celly = y;
  doc.addImage(PNGtoUrl, "png", 20, celly, 150, 140);

  h = imgData[0].height;
  console.log(h);

  y += h;
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
      rowHeight: 6,
    },
    useCss: true,
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

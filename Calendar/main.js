let dateNow = new Date();
let currentYear = dateNow.getFullYear();
let currentMonth = dateNow.getMonth() + 1;//getMonth()返回數字 0(一月)~11(十二月)

let day_list = ['日', '一', '二', '三', '四', '五', '六'];
let todayDate = `${dateNow.getFullYear()}.${dateNow.getMonth() + 1}.${dateNow.getDate()}(${day_list[dateNow.getDay()]})`

const addTodoBtn = document.querySelector("#addTodoBtn");
const tbody = document.querySelector("#tbody");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const addBtn = document.querySelector("#addBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const modifyBtn = document.querySelector("#modifyBtn");

addTodoBtn.addEventListener("click", function () {
    //Model切換
    addBtn.classList.remove("d-none");
    deleteBtn.classList.add("d-none");
    modifyBtn.classList.add("d-none");
    document.querySelector(".modal-title").textContent = "新增行程";
    document.querySelector("#modifyTime").textContent = '';


    let inputs = document.querySelectorAll('.form-control');
    inputs.forEach(x => {
        x.value = '';
    })
})

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
addBtn.addEventListener("click", addTodo);
deleteBtn.addEventListener("click", deleteOrModifyTodo);
modifyBtn.addEventListener("click", deleteOrModifyTodo);

showCalendar(currentYear, currentMonth);
setClock();

function setClock() {
    setInterval(function () {
        var today = new Date();
        var hh = today.getHours();
        var mm = today.getMinutes();
        var ss = today.getSeconds();
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        ss = ss < 10 ? "0" + ss : ss;
        document.querySelector("#clock").textContent = `${todayDate} ${hh}:${mm}:${ss}`;

    }, 1000);
}

function showCalendar(year, month) {
    document.querySelector("#year").textContent = year;
    document.querySelector("#month").textContent = month;
    renderDayBlock(year, month);
}

function renderDayBlock(currentYear, currentMonth) {
    tbody.innerHTML = '';
    let curMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    let curMonthFirstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    let count = 1;

    for (let i = 0; i < 6; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let td = document.createElement("td");
            td.classList.add("dayBlock");

            if (i == 0 && j < curMonthFirstDay) {//處理第一條row
                td.classList.add("bg-light")
            }
            else if (count > curMonthDays) {//處理最後一條row
                td.classList.add("bg-light")
            }
            else {
                td.classList.add("bg-white")
                td.setAttribute("id", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${count.toString().padStart(2, "0")}`);
                td.textContent = count;
                count++
            }
            tr.append(td);
        }
        tbody.append(tr);
    }

    showTodoData(currentYear, currentMonth);
}

function prev() {
    currentYear = (currentMonth == 1) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth == 1) ? 12 : currentMonth - 1;
    showCalendar(currentYear, currentMonth);
}

function next() {
    currentYear = (currentMonth == 12) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth == 12) ? 1 : currentMonth + 1;
    showCalendar(currentYear, currentMonth);
}


function addTodo(value) {
    let titleVal = document.querySelector("#title").value;
    let dateVal = document.querySelector("#date").value;
    let timeVal = document.querySelector("#time").value;
    let contentsVal = document.querySelector("#contents").value;
    let colorVal = document.querySelector("#color").value;
    let positionVal = document.querySelector("#position").value;
    if (titleVal == '' || dateVal == '' || timeVal == '' || contentsVal == '') {
        Swal.fire('標題,日期,時間或內容不能為空', '', 'warning').then(() => {
            return;
        });
    }
    else {
        if (typeof value == "string") {//判斷是否為刪除或修改事件
            localStorage.removeItem(value);
        }
        saveToLocalStorage(titleVal, dateVal, timeVal, contentsVal, colorVal, positionVal);
        $('#todoModal').modal('hide');
        showCalendar(currentYear, currentMonth);
    }
}

function saveToLocalStorage(title, date, time, contents, color, position) {
    let data = {
        title: title,
        date: date,
        time: time,
        contents: contents,
        color: color,
        position: position,
        updateTime: new Date().toLocaleString()
    }
    localStorage.setItem(Date.now(), JSON.stringify(data));
}


function showTodoData(year, month) {

    for (var i = 0; i < localStorage.length; i++) {
        let data = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let dataDate = data.date;

        if ((year + "-" + month.toString().padStart(2, "0")) == dataDate.substring(0, 7)) {//判斷是否為該月事項
            let datakey = localStorage.key(i);
            let title = (data.title).toString();
            let targetTD = document.getElementById(dataDate);//querySelector不支援搜尋數字開頭的ID所以要改用getElementById
            let button = document.createElement("button");
            button.classList.add("btn", "btn-block", "text-left", "border", "border-secondary", "rounded")
            button.style.backgroundColor = data.color;
            button.textContent = title.length <= 5 ? title : title.substring(0, 5) + "...";
            button.dataset.toggle = "modal";
            button.dataset.target = "#todoModal"

            button.addEventListener("click", function () {
                //Model切換
                addBtn.classList.add("d-none");
                deleteBtn.classList.remove("d-none");
                modifyBtn.classList.remove("d-none");
                document.querySelector(".modal-title").textContent = "修改行程";
                document.querySelector("#modifyTime").textContent = `更新時間：${data.updateTime}`;

                deleteBtn.setAttribute("value", datakey);
                modifyBtn.setAttribute("value", datakey);

                document.querySelector("#title").value = data.title;
                document.querySelector("#date").value = dataDate;
                document.querySelector("#time").value = data.time;
                document.querySelector("#contents").value = data.contents;
                document.querySelector("#color").value = data.color;
                document.querySelector("#position").value = data.position;
            })
            targetTD.append(button);
        }
    }
}

function deleteOrModifyTodo() {
    if (this.id == "deleteBtn") {
        localStorage.removeItem(this.value);
        $('#todoModal').modal('hide');
        showCalendar(currentYear, currentMonth);
    }
    else {
        addTodo(this.value);
    }
}
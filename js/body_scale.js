// 放入你部署後產生的 網頁應用程式網址
const scriptURL = "https://script.google.com/macros/s/AKfycbxdYsrOnwhcGzGfRzaV2MHnl35ftdx1J7KW_X3R4p9kEs9F_B1_-1lJCgc1JrFMVPCYhw/exec"

// READ
document.forms['read'].addEventListener('submit', e => {
    readMethod(e);
})

// 每次操作後都呼叫他，以呼叫API重新繪製頁面表格
function readMethod(e) {

    // 禁用預設方法，避免送出表單後頁面跳轉
    e.preventDefault();

    // jquery的 ajax，使用GET方法
    $.ajax({
        url: scriptURL,
        type: "GET",
        data: {"target" : $("#target").val()},
        //dataType : "text",

        // 若成功，執行以下...
        success: function (response) {
            console.log(response);
            display(response);
        },

        // 若失敗，執行以下...
        error: function () {
            console.log('read 失敗');
            console.log($("#target").val());
        }
    });
};

// 用 <table> 標籤元素，繪製頁面
function display(formData) {

    // 先清空內容
    document.getElementById("table").innerHTML = "";
    let content = "<table><thead><th>feeling</th><th>name</th><th>message</th></thead><tbody>";

    // header 不需要繪製，所以 shift 掉
    formData.shift();

    let readName = document.getElementById("readName");

    // 若 input 元素為空值，則繪製整張表格
    if (readName.value == "") {
        for (let i in formData) {
            content += "<tr><td>" + formData[i][0] + "</td>";
            content += "<td>" + formData[i][1] + "</td>";
            content += "<td>" + formData[i][2] + "</td></tr>";
        }
        content += "</tbody></table>";
        document.getElementById("table").innerHTML = content;

        // 若不為空，則繪製指定的 row
    } else {
        for (let i in formData) {
            if (formData[i][1] == readName.value) {
                content += "<tr><td>" + formData[i][0] + "</td>";
                content += "<td>" + formData[i][1] + "</td>";
                content += "<td>" + formData[i][2] + "</td></tr>";
            };
        }
        content += "</tbody></table>";
        document.getElementById("table").innerHTML = content;
    }
}

// CREATE
document.forms['create'].addEventListener('submit', e => {
    e.preventDefault();
    $.ajax({
        url: scriptURL,
        type: "POST",
        data: new FormData(document.forms['create']),
        contentType: false,
        processData: false,
        success: function (response) {
            console.log(response);
            alert("create 成功")
            readMethod(e);
        },
        error: function () {
            console.log('create 失敗');
        }
    });

    // 送出表單後清空 input 的值
    document.forms['create'].reset();
});

// UPDATE
document.forms['update'].addEventListener('submit', e => {
    e.preventDefault();
    $.ajax({
        url: scriptURL,
        type: "POST",
        data: new FormData(document.forms["update"]),
        contentType: false,
        processData: false,
        success: function (response) {
            console.log(response);
            alert("update 成功");
            readMethod(e);
        },
        error: function () {
            console.log('update 失敗');
        }
    });
    console.log([...new FormData(document.forms["update"])]);
    document.forms['update'].reset();
})

document.forms['delete'].addEventListener('submit', e => {
    e.preventDefault();
    $.ajax({
        url: scriptURL,
        type: "POST",
        data: new FormData(document.forms["delete"]),
        contentType: false,
        processData: false,
        success: function (response) {
            console.log(response);
            alert("delete 成功");
            readMethod(e);
        },
        error: function () {
            console.log('delete 失敗');
        }
    });
    console.log([...new FormData(document.forms["delete"])]);
    document.forms['delete'].reset();
})

$(function(){
    $(".username").attr("value", localStorage.getItem("username"));
    console.log(localStorage.getItem("username"));
})
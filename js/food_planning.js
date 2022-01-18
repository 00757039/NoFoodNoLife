// 放入你部署後產生的 網頁應用程式網址
const scriptURL = "https://script.google.com/macros/s/AKfycbxdYsrOnwhcGzGfRzaV2MHnl35ftdx1J7KW_X3R4p9kEs9F_B1_-1lJCgc1JrFMVPCYhw/exec"


//得到username
$(function () {
    $(".username").attr("value", localStorage.getItem("username"));
    console.log(localStorage.getItem("username"));
})

//所有表單送出時統一設定日期
document.forms['read'].addEventListener('submit', e => {
    let dt = $('#datepicker_r').val();
    $('.date').attr('value', dt.replace('T', ' '));
    readMethod(e);
    window.alert('read complete, please see the resault.');
})

// 每次操作後都呼叫他，以呼叫API重新繪製頁面表格
function readMethod(e) {

    // 禁用預設方法，避免送出表單後頁面跳轉
    e.preventDefault();

    // jquery的 ajax，使用GET方法
    $.ajax({
        url: scriptURL,
        type: "GET",
        data: { "target": $("#target").val() },//要操作的工作表，這裡是運動紀錄(4)
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

//設定'刪除表單'
function setDeleteRow(i) {
    document.getElementById("deleteRow").setAttribute("value", String(i));
    $("#submitDel").click();
}

//隱藏/顯示'修改表單'
function setUpdateRowToggle(i) {
    $("#toUpdate" + String(i)).slideToggle();
}

//設定'修改表單'
function setUpdate(i) {
    $("#username").attr("value", $("#toUpdate" + String(i) + 'username').val());
    $("#date").attr("value", $("#toUpdate" + String(i) + 'datetime-local').val().replace('T', ' '));
    $("#updateRow").attr("value", $("#toUpdate" + String(i) + 'updateRow').val());
    $("#how_to_eat").attr("value", $("#toUpdate" + String(i) + 'how_to_eat').val());
    $("#what_to_eat").attr("value", $("#toUpdate" + String(i) + 'what_to_eat').val());
    
    $("#submitUp").click();
}

// 用 <table> 標籤元素，繪製頁面
function display(formData) {

    // 先清空內容
    document.getElementById("table").innerHTML = "";
    let content = '<table class="table"><thead><th>date&time</th><th>how_to_eat</th><th>what_to_eat</th></thead><tbody>';

    // header 不需要繪製，所以 shift 掉
    formData.shift();

    $(".username").attr("value", localStorage.getItem("username"));

    let username = document.getElementsByClassName("username")[1];
    let date = document.getElementById("datepicker_r");

    let tr_css = '';
    let td_css = '';

    //沒有日期就輸出全部，有則輸出指定日期資料
    if (date.value == "") {
        for (let i in formData) {
            switch (i % 4) {
                case 0: tr_css = '<tr class="table-primary" id="' + i + '_th_tr">';
                    td_css = '<td class="table-primary">';
                    break;
                case 1: tr_css = '<tr class="table-success" id="' + i + '_th_tr">';
                    td_css = '<td class="table-success">';
                    break;
                case 2: tr_css = '<tr class="table-danger" id="' + i + '_th_tr">';
                    td_css = '<td class="table-danger">';
                    break;
                case 3: tr_css = '<tr class="table-warning" id="' + i + '_th_tr">';
                    td_css = '<td class="table-warning">';
                    break;
            }

            if (formData[i][0] == username.value) {
                content += tr_css + td_css + '<button class="btn btn-danger" onclick="setDeleteRow(' + i + ');">delete</button>    '
                    + '<button class="btn btn-dark" onclick="setUpdateRowToggle(' + String(i) + ');">update</button><br>' + formData[i][1] + "</td>";
                content += td_css + formData[i][2] + "</td>";
                content += td_css + formData[i][3] + "</td>";
                content += '<tr><td colspan=8><form id="toUpdate' + String(i) + '" name="update_to_linked_form" style="display: none">' +
                    '<input type="text" name="method" value="UPDATE" hidden>' +
                    '<input id="toUpdate' + String(i) + 'updateRow" type="number" name="updateRow" placeholder="updateRow" value="' + String(i) + '" hidden>' +
                    '<input  type="text" name="target" value="4" hidden>' +
                    '<input id="toUpdate' + String(i) + 'username" class="username" name="username" value="' + localStorage.getItem("username") + '" hidden>' +
                    '<input id="toUpdate' + String(i) + 'datetime-local" type="datetime-local" name="datetime-local" value="">' +
                    '<select id="toUpdate' + String(i) + 'how_to_eat" name="how_to_eat">' +
                    '<option disabled selected>' + formData[i][2] + '</option>' +
                    '<option>地中海飲食法</option>' +
                    '<option>間歇性斷食</option>' +
                    '<option>低碳飲食</option>' +
                    '<option>低熱量容積飲食</option>' +
                    '<option>穴居人飲食法</option>' +
                    '<option>得舒飲食</option>' +
                    '</select>' +
                    '<input id="toUpdate' + String(i) + 'what_to_eat" type="text" name="what_to_eat" value="' + formData[i][3] + '" placeholder="what_to_eat" required>' +
                    '<input type="button" value="update" onclick="setUpdate(' + String(i) + ');"></form></td></tr>';
            }
        }
    }
    else {
        for (let i in formData) {
            console.log(date.value);
            console.log(formData[i][1].substr(0, 10));

            switch (i % 4) {
                case 0: tr_css = '<tr class="table-primary">';
                    td_css = '<td class="table-primary">';
                    break;
                case 1: tr_css = '<tr class="table-success">';
                    td_css = '<td class="table-success">';
                    break;
                case 2: tr_css = '<tr class="table-danger">';
                    td_css = '<td class="table-danger">';
                    break;
                case 3: tr_css = '<tr class="table-warning">';
                    td_css = '<td class="table-warning">';
                    break;
            }
            if (formData[i][0] == username.value && formData[i][1].substr(0, 10) == date.value.substr(0, 10)) {
                content += tr_css + td_css + '<button class="btn btn-danger" onclick="setDeleteRow(' + i + ');">delete</button>    '
                    + '<button class="btn btn-dark" onclick="setUpdateRowToggle(' + String(i) + ');">update</button><br>' + formData[i][1] + "</td>";
                content += td_css + formData[i][2] + "</td>";
                content += td_css + formData[i][3] + "</td>";
                content += '<tr><td colspan=8><form id="toUpdate' + String(i) + '" name="update_to_linked_form" style="display: none">' +
                    '<input type="text" name="method" value="UPDATE" hidden>' +
                    '<input id="toUpdate' + String(i) + 'updateRow" type="number" name="updateRow" placeholder="updateRow" value="' + String(i) + '" hidden>' +
                    '<input  type="text" name="target" value="4" hidden>' +
                    '<input id="toUpdate' + String(i) + 'username" class="username" name="username" value="' + localStorage.getItem("username") + '" hidden>' +
                    '<input id="toUpdate' + String(i) + 'datetime-local" type="datetime-local" name="datetime-local" value="">' +
                    '<select id="toUpdate' + String(i) + 'how_to_eat" name="how_to_eat">' +
                    '<option disabled selected>' + formData[i][2] + '</option>' +
                    '<option>地中海飲食法</option>' +
                    '<option>間歇性斷食</option>' +
                    '<option>低碳飲食</option>' +
                    '<option>低熱量容積飲食</option>' +
                    '<option>穴居人飲食法</option>' +
                    '<option>得舒飲食</option>' +
                    '</select>' +
                    '<input id="toUpdate' + String(i) + 'what_to_eat" type="text" name="what_to_eat" value="' + formData[i][3] + '" placeholder="what_to_eat" required>' +
                    '<input type="button" value="update" onclick="setUpdate(' + String(i) + ');"></form></td></tr>';
            }
        }
    }

    //表格展示
    content += "</tbody></table>";
    let hasResault = 0;
    hasResault = content.indexOf('</tr>');
    (hasResault == -1) ? (content = 'No Resault Founded.') : content = content;
    document.getElementById("table").innerHTML = content;
}

// CREATE
document.forms['create'].addEventListener('submit', e => {
    let dt = $('#datepicker_c').val();
    $('.date').attr('value', dt.replace('T', ' '));
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
    $('#datapicker').attr('value', '');
});

// UPDATE
document.forms['update'].addEventListener('submit', e => {
    //$('.date').attr('value', $('#datepicker').val());
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
    //$('#datapicker').attr('value', '');
})

document.forms['delete'].addEventListener('submit', e => {
    //$('.date').attr('value', $('#datepicker').value);
    e.preventDefault();
    console.log($('#deleteRow').val());
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
    $('#datapicker').attr('value', '');
})

//載入網頁自動read一次
window.addEventListener('load', function () {
    $.ajax({
        url: scriptURL,
        type: "GET",
        data: { "target": $("#target").val() },//要操作的工作表，這裡是運動紀錄(4)
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
}, false);
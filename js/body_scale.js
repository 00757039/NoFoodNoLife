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
    $("#height").attr("value", $("#toUpdate" + String(i) + 'height').val());
    $("#weight").attr("value", $("#toUpdate" + String(i) + 'weight').val());

    $("#submitUp").click();
}

// 用 <table> 標籤元素，繪製頁面
function display(formData) {

    // 先清空內容
    document.getElementById("table").innerHTML = "";
    let content = '<table class="table"><thead><th>date&time</th><th>height(cm)</th><th>weight(kg)</th><th>BMI</th></thead><tbody>';

    // header 不需要繪製，所以 shift 掉
    formData.shift();

    $(".username").attr("value", localStorage.getItem("username"));

    let username = document.getElementsByClassName("username")[1];

    let date = ['', '', '', '', '', '', '', '', '', ''];
    let height = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let weight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let BMI = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let tr_css = '';
    let td_css = '';

    let a = 9;

    formData.sort(function (x, y) {//照時間排序
        return -(x[1].localeCompare(y[1]));
    })

    //輸出最近十筆資料
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
            let bmi = Math.round(((formData[i][3]) / ((formData[i][2] / 100) * (formData[i][2] / 100)) + Number.EPSILON) * 100) / 100;
            content += tr_css + td_css + '<button class="btn btn-danger" onclick="setDeleteRow(' + i + ');">delete</button>    '
                + '<button class="btn btn-dark" onclick="setUpdateRowToggle(' + String(i) + ');">update</button><br>' + formData[i][1] + "</td>";
            content += td_css + formData[i][2] + "</td>";
            content += td_css + formData[i][3] + "</td>";
            content += td_css + String(bmi) + "</td>";
            content += '<tr><td colspan=8><form id="toUpdate' + String(i) + '" name="update_to_linked_form" style="display: none">' +
                '<input type="text" name="method" value="UPDATE" hidden>' +
                '<input id="toUpdate' + String(i) + 'updateRow" type="number" name="updateRow" placeholder="updateRow" value="' + String(i) + '" hidden>' +
                '<input  type="text" name="target" value="5" hidden>' +
                '<input id="toUpdate' + String(i) + 'username" class="username" name="username" value="' + localStorage.getItem("username") + '" hidden>' +
                '<input id="toUpdate' + String(i) + 'datetime-local" type="datetime-local" name="datetime-local" value="">' +
                '<input id="toUpdate' + String(i) + 'height" type="number" name="height" value="' + formData[i][2] + '" placeholder="height" required step="0.01">' +
                '<input id="toUpdate' + String(i) + 'weight" type="number" name="weight" value="' + formData[i][3] + '" placeholder="weight" required step="0.01">' +
                '<input type="button" value="update" onclick="setUpdate(' + String(i) + ');"></form></td></tr>';


            date[a] = formData[i][1].substr(0, 10);
            height[a] = formData[i][2];
            weight[a] = formData[i][3];
            BMI[a] = bmi;
            a--;
        }
    }

    //表格展示
    content += "</tbody></table>";
    let hasResault = 0;
    hasResault = content.indexOf('</tr>');
    (hasResault == -1) ? (content = 'No Resault Founded.') : content = content;
    document.getElementById("table").innerHTML = content;

    //chart展示
    if (hasResault > -1) {
        google.charts.load('current', { packages: ['corechart', 'line'] });
        google.charts.setOnLoadCallback(drawChart_weight);
        google.charts.setOnLoadCallback(drawChart_height);
        google.charts.setOnLoadCallback(drawChart_bmi);

        function drawChart_weight() {

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Date');
            data.addColumn('number', 'Weight');

            data.addRows([
                [date[0], weight[0]],
                [date[1], weight[1]],
                [date[2], weight[2]],
                [date[3], weight[3]],
                [date[4], weight[4]],
                [date[5], weight[5]],
                [date[6], weight[6]],
                [date[7], weight[7]],
                [date[8], weight[8]],
                [date[9], weight[9]]
            ]);

            var options = {
                hAxis: {
                    title: 'Time'
                },
                vAxis: {
                    title: 'kg'
                },
                width: '900px',
                height: '500px'
            };

            var chart = new google.visualization.LineChart(document.getElementById('linechart_material_1'));
            chart.draw(data, options);
        }

        function drawChart_height() {

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Date');
            data.addColumn('number', 'Height');

            data.addRows([
                [date[0], height[0]],
                [date[1], height[1]],
                [date[2], height[2]],
                [date[3], height[3]],
                [date[4], height[4]],
                [date[5], height[5]],
                [date[6], height[6]],
                [date[7], height[7]],
                [date[8], height[8]],
                [date[9], height[9]]
            ]);

            var options = {
                hAxis: {
                    title: 'Time'
                },
                vAxis: {
                    title: 'cm'
                },
                width: 900,
                height: 500
            };

            var chart = new google.visualization.LineChart(document.getElementById('linechart_material_2'));
            chart.draw(data, options);
        }

        function drawChart_bmi() {

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Date');
            data.addColumn('number', 'BMI');

            data.addRows([
                [date[0], BMI[0]],
                [date[1], BMI[1]],
                [date[2], BMI[2]],
                [date[3], BMI[3]],
                [date[4], BMI[4]],
                [date[5], BMI[5]],
                [date[6], BMI[6]],
                [date[7], BMI[7]],
                [date[8], BMI[8]],
                [date[9], BMI[9]]
            ]);

            var options = {
                hAxis: {
                    title: 'Time'
                },
                vAxis: {
                    title: 'Kg/m^2'
                },
                width: 900,
                height: 500
            };

            var chart = new google.visualization.LineChart(document.getElementById('linechart_material_3'));
            chart.draw(data, options);
        }
    }
    else {
        document.getElementById('linechart_material').innerHTML = 'Data is not complite.';
    }
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
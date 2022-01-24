$("#signup").hide();

function toggle() {
	// toggle log in / sign up
	if ($(".button > a").html() === "Log in!") {
		// change title
		$(".header > h3").text("Log in");

		//change method to log in
		$("#login").show();
		$("#signup").hide();

		$(".button > a").text("Sign up?");
		isError = 0;
		hasLengthen = 0;
	}
	else {
		// change title
		$(".header > h3").text("Sign up");

		//change method to sign up
		$("#signup").show();
		$("#login").hide();

		$(".button > a").text("Log in!");
		isError = 0;
		hasLengthen = 0;
	}
}

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

		// 若成功，執行以下...
		success: function (response) {
			//console.log(response);
			display(response);
		},

		// 若失敗，執行以下...
		error: function () {
			console.log('read 失敗');
		}
	});
};

// 用 <table> 標籤元素，繪製頁面
function display(formData) {

	// 先清空內容
	document.getElementById("table").innerHTML = "";
	let content = "";

	// header 不需要繪製，所以 shift 掉
	formData.shift();

	let readName = document.getElementById("readName");
	let readName2 = document.getElementById("readName2");

	// 若 input 元素為空值，則繪製整張表格
	if (readName.value == "" || readName2.value == "") {
		content = "Please input your username and password!!!";
		document.getElementById("table").innerHTML = content;

		// 若不為空，則繪製指定的 row
	} else {
		for (let i in formData) {
			if (formData[i][0] == readName.value && formData[i][1] == readName2.value) {
				localStorage.setItem("username", formData[i][0]);
				content = formData[i][0] + ', welcome!';
				window.location.href = "main.html?ToSend=" + content;
				break;
			};
		}
		if (content == "") {
			content = "Your username or password is incorrect!!!"
		}
		//var usernameToSend = $("#table").innerHTML;
		window.alert(content);
		document.getElementById("table").innerHTML = content;
	}
}

// CREATE
document.forms['create'].addEventListener('submit', e => {
	// 禁用預設方法，避免送出表單後頁面跳轉
	e.preventDefault();

	var invaild = 0;//檢查重複

	// jquery的 ajax，使用GET方法
	console.log("read");
	$.ajax({
		url: scriptURL,
		type: "GET",
		data: {"target" : $("#target").val()},

		// 若成功，執行以下...
		success: function (response) {
			invaild =  checkIsVaild(response, invaild);
			if (!invaild) {
				createUser();
			}
		},

		// 若失敗，執行以下...
		error: function () {
			console.log('read 失敗');
		}
	});
});

function checkIsVaild(response, invaild) {//檢查帳號是否被使用
	let content = "";
	console.log(response);
	if (createName.value == "" || createName2.value == "") {
		content = "Please input your username and password to create!!!";
		invaild = 1;
	}
	else {
		for (let i in response) {
			if (response[i][0] == createName.value) {
				console.log(createName.value);
				content = "Username has been used!";
				invaild = 1;
				break;
			};
		}
	}
	document.getElementById("table").innerHTML = content;
	window.alert(content);
	return invaild;
}
function createUser() {
	$.ajax({
		url: scriptURL,
		type: "POST",
		data: new FormData(document.forms['create']),
		contentType: false,
		processData: false,
		success: function (response) {
			console.log(response);
			//alert("create 成功");
			//readMethod(e);
		},
		error: function () {
			console.log('create 失敗');
		}
	});

	// 送出表單後清空 input 的值
	document.forms['create'].reset();
	//change method to log in
	window.alert("Success! Please log in again!");
	$("#login").show();
	$("#signup").hide();
}

/*function sendUserName() {
	setTimeout(function(){
		var usernameToSend = $("#table").innerHTML;
		window.location.href = "food_planing.html?ToSend=" + usernameToSend;
	}, 5000);
}*/
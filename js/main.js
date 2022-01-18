var value = 0;
$("#to_toggle").rotate({
    bind: {
        click: function () {
            value += 180;
            $(this).rotate({
                animateTo: value
            })
        }
    }
});

$(function () {
    $("#to_toggle").click(function () {
        $("#data_play").slideToggle("slow");
    });
});

$("#toDiet").click(function () {
    value = 0;
    $("#showRecord").show();
    $("#to_toggle").rotate(value);

    $("#diet_record").show();
    $("#sports_record").hide();
    $("#body_scale").hide();
    $('div[dir]').attr('style', 'position: relative; width: 100%; height: 100%;');
});

$("#toSports").click(function () {
    value = 0;
    $("#showRecord").show();
    $("#to_toggle").rotate(value);

    $("#sports_record").show();
    $("#diet_record").hide();
    $("#body_scale").hide();
});

$("#toBodyScale").click(function () {
    value = 0;
    $("#showRecord").show();
    $("#to_toggle").rotate(value);

    $("#body_scale").show();
    $("#sports_record").hide();
    $("#diet_record").hide();
});

$(function () {
    $(".username").attr("value", receiveUserName());
    //console.log(receiveUserName());
})

function receiveUserName() {
    var gottenUserName;
    var fromLogin = window.location.search;
    console.log(localStorage.getItem("username"));
    if (fromLogin.indexOf("?") != 1) {
        gottenUserName = fromLogin.substring(fromLogin.indexOf("=") + 1);
    }
    return gottenUserName;
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
    console.log("登出成功");
};
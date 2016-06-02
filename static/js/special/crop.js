window.onload = function () {
    var browser = {
        versions: function() {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息 
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if ( (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) ) {
        intro_img="ios";
    } else {
        intro_img="android";
        $(".copyright .ios").hide();
    }

    CONFIG = {};
}
function getConfig () {
    CONFIG.pieces = !!Number($("#pieces").val())?Number($("#pieces").val()):3;
    CONFIG.copyright_ifneed = $("#copyright_ifneed").prop("checked");
    CONFIG.copyright_backgroundColor = checkColor($("#copyright_backgroundColor").val())?$("#copyright_backgroundColor").val():'';
    CONFIG.copyright_fontColor = checkColor($("#copyright_fontColor").val())?$("#copyright_fontColor").val():'';
    CONFIG.data = [];
    var trs = $(".parameter-setter table tbody tr");
    for (var i = 0; i < trs.length; i++) {
        var o = {};
        o.x = Number($(trs[i]).find('[data-param="x"]').html());
        o.y = Number($(trs[i]).find('[data-param="y"]').html());
        o.width = Number($(trs[i]).find('[data-param="width"]').html());
        o.height = Number($(trs[i]).find('[data-param="height"] input').val());
        CONFIG.data.push(o);
    }
}
function cutImg (img,data) {
    if (!data || data.length == 0) {
        var data = [];
        for (var i = 0; i < CONFIG.pieces; i++) {
            data.push({
                width: img.width,
                height: img.height / CONFIG.pieces,
                x: 0,
                y: img.height / CONFIG.pieces * i
            })
        }
    }
    var img_arr = [];
    for (var i = 0; i < data.length; i++) {
        var canvas = document.createElement("canvas");  
        canvas.width = data[i].width;
        canvas.height = data[i].height;
        canvas.getContext("2d").drawImage(img,data[i].x,data[i].y,data[i].width,data[i].height,0,0,data[i].width,data[i].height); 
        if (i == data.length - 1 && CONFIG.copyright_backgroundColor == "") {
            var last_piece_data = canvas.getContext("2d").getImageData(0,0,data[i].width,data[i].height);
            var r = last_piece_data.data[data[i].width*data[i].height-4];
            var g = last_piece_data.data[data[i].width*data[i].height-3];
            var b = last_piece_data.data[data[i].width*data[i].height-2];
            if (!checkColor($("#copyright_backgroundColor").val())) {
                CONFIG.copyright_backgroundColor = rgb2hex([r,g,b]);
            }
        }
        var cut_img = new Image();
        cut_img.src = canvas.toDataURL("image/jpeg");
        img_arr.push(cut_img);
    }
    
    return img_arr;
}
function allImagesLoaded () {
    renderCutResult(newimages[0]);
}
function renderCutResult (img) {
    getConfig();
    document.querySelector("#cut-imgs").innerHTML = '';
    var imgs = cutImg(img,CONFIG.data);
    document.querySelector("#img").src = img.src;
    for (var i = 0; i < imgs.length; i++) {
        var temp = document.createElement("img");
        temp.src = imgs[i].src;
        document.querySelector("#cut-imgs").appendChild(temp);
    }
    if (CONFIG.copyright_ifneed) {
        var copyright = document.createElement("p");
        copyright.className = "copyright";
        copyright.style.backgroundColor = CONFIG.copyright_backgroundColor;
        copyright.style.color = !!CONFIG.copyright_fontColor?CONFIG.copyright_fontColor:'#666666';
        copyright.innerHTML = '活动规则解释权归PP万惠理财所有<br /><span class="ios">活动由PP万惠理财提供，与苹果公司无关<br /></span>如有疑问请联系在线客服或拨打10101212'
        document.querySelector("#cut-imgs").appendChild(copyright);
        if (intro_img == "android") {
            $(".copyright .ios").hide();
        }
    }
    return imgs;
}
function renderPreview (img) {
    fixY();
    getConfig();
    var borders = document.querySelector(".work-area .borders");
    borders.innerHTML = '';
    for (var i = 0; i < CONFIG.data.length; i++) {
        var border = document.createElement("div");
        border.className = "border";
        border.style.height = CONFIG.data[i].height / img.width *  $(borders).width() + "px";
        borders.appendChild(border);
    }
}
function preloadimages(imgs){
    newimages=[];
    var count = imgs.length;
    var t = 0;
    for (var i = 0; i < count; i++){
        newimages[i]=new Image();
        newimages[i].src = imgs[i];
        newimages[i].onload = function () {
            t++;
            if (t == count) {
                allImagesLoaded(); 
            }
        }
    }
}
function fixY () {
    var trs = $(".parameter-setter table tbody tr");
    var currentY = 0;
    for (var i = 0; i < trs.length; i++) {
        $(trs[i]).find('[data-param="y"]').html(currentY);
        currentY += Number($(trs[i]).find('[data-param="height"] input').val());
    }
}
function rgb2hex(rgb) {
    var decimal = Number(rgb[0]) * 65536 + Number(rgb[1]) * 256 + Number(rgb[2]);
    return "#" + zero_fill_hex(decimal, 6);

    function zero_fill_hex(num, digits) {
        var s = num.toString(16);
        while (s.length < digits)
            s = "0" + s;
        return s;
    }
}
function checkColor (color) {
    var p1 = /#[a-f0-9]{6}/;
    var p2 = /#[a-f0-9]{3}/;
    return (p1.test(color) && color.length == 7) || (p2.test(color) && color.length == 4);
}
$(document).ready(function(){
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
	AdjustToWindow();
})
$(window).resize(function(){
	AdjustToWindow();
});
function AdjustToWindow() {
	var win_width = $(window).width();
    var win_height = $(window).height();
    $(".img-box").html("");
    for (var i = 0; i < CONFIG.imgs.length; i++) {
    	var box = $('<div class="box-100 box' + (i + 1) + '"></div>');
    	box.css("height",win_width*CONFIG.imgs[i].height/CONFIG.imgs[i].width);
    	if(win_width>500){
			box.css("background","url(" + CONFIG.imgs[i].bg_a + ") no-repeat");
		}else{
			box.css("background","url(" + CONFIG.imgs[i].bg_b + ") no-repeat");
		}
		box.css("background-size","cover");
		$(".img-box").append(box);
    }
    $("title").html(CONFIG.title);
	$("body").css("background-color",CONFIG.copyrightBackgroundColor);
	$(".copyright").css("color",CONFIG.copyrightColor);
	if (!CONFIG.showCopyright) {
		$(".copyright").hide();
	}
}
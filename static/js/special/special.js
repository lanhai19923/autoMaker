//实例化一个plupload上传对象
var uploader = new plupload.Uploader({
    browse_button : 'file', //触发文件选择对话框的按钮，为那个元素id
    url : '/upload/uploadImg', //服务器端的上传页面地址
    //flash_swf_url : 'js/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
    //silverlight_xap_url : 'js/Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
    unique_names: true,
    drop_element: 'drag-file-in',
    multi_selection: false,
    container: 'upload-wrap',
});   
//在实例对象上调用init()方法进行初始化
uploader.init();
//绑定各种事件，并在事件监听函数中做你想做的事
uploader.bind('PostInit', function(uploader){
  document.getElementById('start_upload').onclick = function(){
    uploader.start();
  }
})
uploader.bind('FilesAdded',function(uploader,files){
  plupload.each(files, function(file) {
    console.log(file.getSource().relativePath);
    document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
  });
});
uploader.bind('UploadProgress',function(uploader,file){
  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
});
uploader.bind('FileUploaded',function(uploader,file,responseObject){
  var res = JSON.parse(responseObject.response);
  if (res.status == true) {
    $("#upload-wrap").hide();
    $(".page1 .work-area").show();

    var newimage = new Image();
    var cutImgs;
    newimage.src = res.url;
    newimage.onload = function () {
      $(".page1 .work-area img").attr("src",res.url);
      cutImgs = renderCutResult(newimage);

      $(".parameter-setter input").on("change",function(){
        cutImgs = renderCutResult(newimage);
      })
      $("#preview").on("click",function(){
        cutImgs = renderCutResult(newimage);
      })
      $("#addData").on("click",function(){
        $("#addData").text("再增加一条数据");
        $(".parameter-setter table").show();
        var x = 0;
        var y = 0;
        var width = newimage.width;
        var height = 200;
        $(".parameter-setter table tbody").append('<tr><td data-param="x">' + x + '</td><td data-param="y">' + y + '</td><td data-param="width">' + width + '</td><td data-param="height"><input type="text" class="form-control" placeholder="" value="' + height + '"></td></tr>');
        renderPreview(newimage);
        $(".parameter-setter table input").off("keyup").on("keyup",function(){
          renderPreview(newimage);
        })
      })
      $("#pack").on("click",function(){
        var uploadData = {};
        uploadData["imgs"] = [];
        for (var i = 0; i < cutImgs.length; i++) {
          uploadData["imgs"][i] = {};
          uploadData["imgs"][i]["bg_a"] = cutImgs[i].src;
          uploadData["imgs"][i]["bg_b"] = cutImgs[i].src;
          uploadData["imgs"][i]["width"] = cutImgs[i].width;
          uploadData["imgs"][i]["height"] = cutImgs[i].height;
        }
        uploadData["title"] = $("#title").val();
        uploadData["showCopyright"] = CONFIG.copyright_ifneed;
        uploadData["copyrightColor"] = !!CONFIG.copyright_fontColor?CONFIG.copyright_fontColor:'#666666';
        uploadData["copyrightBackgroundColor"] = !!CONFIG.copyright_backgroundColor?CONFIG.copyright_backgroundColor:'#ffffff';
        console.log(uploadData);
        $.ajax({
          url:'http://' + window.location.host + '/upload/packup',
          data: {
            qData:JSON.stringify(uploadData)
          },
          type: 'post',
          dataType: 'json',
          //contentType:'text/plain',
          //dataType: 'multipart/form-data',
          success: function(data){
            if (data.status) {
              console.log(data.link)
              window.location = data.link;
            }
          }
        })
      })
      
    }
  }
});
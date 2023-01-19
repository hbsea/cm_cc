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


      //add a butten  import
var a = '<div class="cp-bg1">' +  '<!--会员-->' +  '<div class="c5-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(1)"/>' +  '</div>' +  '<!--黄金会员-->' +  '<div class="c6-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(2)"/>' +  '</div>' +  '<!--加油立减-->' +  '<div class="c7-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(3)"/>' +  '</div>' +  '<!--居家好物-->' +  '<div class="c8-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(4)"/>' +  '</div>' +  '</div>' +
  '<div class="cp-bg">' +	'<!--咪咕-->' +	'<div class="c1-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="stop_iv(iv1)">' +	'</div>' +	'<!--咪咕视频-->' +	'<div class="c2-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="stop_iv(iv2)">' +	'</div>' +	'<!--咪咕快游-->' + '<div class="c3-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="stop_iv(iv3)">' +	'</div>' +	'<!--咪咕阅读-->' +  '<div class="c4-bg">' +
    '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="stop_iv(iv4)">' +	'</div>' +	'</div>'
 $('.bg').append(a);

function gkill(type) {
var params = {
    'channelId': type,
    'order': 999,
    'userPhone': userPhone
};
$.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/seckill/saveMenuClick',
    async: true,
    success: function(data) {         
        var params = {
            'channelId': channelId,
            'userPhone': userPhone,
            'operationType': type
        };
        $.ajax({
            type: 'POST',
            data: params,
            url: '/weixin/activi/seckill/seckill',
            async: true,
            success: function(data) {                
                $('.rule-item-content').append("$" + (new Date().getMinutes()) + ":" + (new Date().getSeconds()) + "||status:" + data.status + "||desc:" + data.desc + "||type:" + type + "<br>");
            }
        });
    }
});
}

var epyt;
var ivn,iv1,iv2,iv3,iv4;
function kill(epyt) {
  ivn=setInterval(function() { gkill(epyt);}, 2000);//默认等待时间2048
  switch(epyt){
    case 1:
        iv1 = ivn;
        break;
    case 2:
        iv2 = ivn;
        break;
    case 3:
        iv3 = ivn;
        break;
    case 4:
        iv4 = ivn;
        break;
  }  
}
function stop_iv(iv){
   clearInterval(iv);
}

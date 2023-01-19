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
function kill(epyt) {  
  setInterval(function() {
      gkill(epyt);
  },
    5000);//默认等待时间2048
}

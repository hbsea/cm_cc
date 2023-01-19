var channelId = $('#channelId').val();
var userPhone = $('#userPhone').val();
var status;
//下一周第一场开始截止时间
var need4Time = $('#needTime').val();
//第一场开始的时间
var need1Time = $('#need1Time').val();
//第二场开始的时间
var need2Time = $('#need2Time').val();
//第三场开始的时间
var need3Time = $('#need3Time').val();
//第一场结束的时间
var endLast1Time = $('#endLast1Time').val();
//第二场结束的时间
var endLast2Time = $('#endLast2Time').val();
//第三场结束的时间
var endLast3Time = $('#endLast3Time').val();
var stage1StartDay = $('#stage1StartDay').val(); //开始日期
var stage1StartTime = $('#stage1StartTime').val(); //开始时间
var stage1EndTime = $('#stage1EndTime').val(); //结束时间
var stage2StartTime = $('#stage2StartTime').val();
var stage2EndTime = $('#stage2EndTime').val(); //结束时间
var stage3StartTime = $('#stage3StartTime').val();
var stage3EndTime = $('#stage3EndTime').val(); //结束时间
var nextStartDay = $('#nextStartDay').val(); //下一期开始时间
//reids中存储的每个阶段每种奖品的剩余数量
var s1P1Num = $('#s1P1Num').val();
var s1P2Num = $('#s1P2Num').val();
var s1P3Num = $('#s1P3Num').val();
var s1P4Num = $('#s1P4Num').val();
var s2P1Num = $('#s2P1Num').val();
var s2P2Num = $('#s2P2Num').val();
var s2P3Num = $('#s2P3Num').val();
var s2P4Num = $('#s2P4Num').val();
var s3P1Num = $('#s3P1Num').val();
var s3P2Num = $('#s3P2Num').val();
var s3P3Num = $('#s3P3Num').val();
var s3P4Num = $('#s3P4Num').val();
var selected;
//本周是否已参与，1为已参与，其他为未参与
var iscanyu = $('#iscy').val();
//10元奖品是否已经秒杀，1为已秒杀
var p1HasMs = 0;
//50元奖品是否已经秒杀，1为已秒杀
var p2HasMs = 0;
//100元奖品是否已经秒杀，1为已秒杀
var p3HasMs = 0;
//200元奖品是否已经秒杀，1为已秒杀
var p4HasMs = 0;
var cd;
var sk;
$(function () {
  /*
  layer.open({
    content: '中国移动APP',
    btn: [
      '   确定   '
    ],
    yes: function () {
      layer.closeAll();
    }
  });
  */
  var a = '<div class="cp-bg1">' +
  '<!--铂金会员-->' +
  '<div class="c5-bg">' +
  '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(1)"/>' +
  '</div>' +
  '<!--黄金会员-->' +
  '<div class="c6-bg">' +
  '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(2)"/>' +
  '</div>' +
  '<!--加油立减-->' +
  '<div class="c7-bg">' +
  '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(3)"/>' +
  '</div>' +
  '<!--居家好物-->' +
  '<div class="c8-bg">' +
  '<img class="order" src="../../imgh5/img/seckill/order.png" onclick="kill(4)"/>' +
  '</div>' +
   '</div>'
  $('.hfq-bg').after(a);
  
  var userStatus = $('#userStatus').val();
  if (userStatus != 1) {
    $('.public-box').show();
    $('.not').show();
  } else {
    //协议签订
    getAgreement();
  }
  var currentEndTime;
  if (new Date().valueOf() < need1Time) {
    status = '-100';
    currentEndTime = need1Time;
  }
  if (new Date().valueOf() >= need1Time && new Date().valueOf() < endLast1Time) {
    status = '100';
    currentEndTime = endLast1Time;
  }
  if (new Date().valueOf() >= endLast1Time && new Date().valueOf() < need2Time) {
    status = '-200';
    currentEndTime = need2Time;
  }
  if (new Date().valueOf() >= need2Time && new Date().valueOf() < endLast2Time) {
    status = '200';
    currentEndTime = endLast2Time;
  }
  if (new Date().valueOf() >= endLast2Time && new Date().valueOf() < need3Time) {
    status = '-300';
    currentEndTime = need3Time;
  }
  if (new Date().valueOf() >= need3Time && new Date().valueOf() < endLast3Time) {
    status = '300';
    currentEndTime = endLast3Time;
  }
  if (new Date().valueOf() >= endLast3Time && new Date().valueOf() < need4Time) {
    status = '-400';
    currentEndTime = need4Time;
  }  //第一秒有延迟，调用render()立即显示

  render();
  //立即计算倒计时
  var now = new Date().valueOf();
  var between = currentEndTime - now + 1000;
  var ft = _formatTime(between);
  var day = ft.d;
  var hour = ft.h;
  var minute = ft.m;
  var seconds = ft.s;
  if (day == 0 && hour == 0) {
    $('.h').hide();
  }
  if (day == 0 && hour == 0 && minute == 0) {
    $('.h').hide();
    $('.m').hide();
  }
  if (day != 0) {
    $('.h').text(_cover(day) + '天' + _cover(hour) + '时');
    $('.h').show();
  }
  if (hour != 0) {
    if (day == 0) {
      $('.h').text(_cover(hour) + '时');
    }
    $('.h').show();
  }
  if (minute != 0) {
    $('.m').show();
  }
  $('.m').text(_cover(minute) + '分');
  $('.s').text(_cover(seconds) + '秒');
  //初始化
  cd = new countDown(1000);
  sk = new seckillController({
    serverUrl: '/weixin/activi/',
    isGetServerTime: true,
    fixDelay: 10 * 1000, //10秒钟自动获取一次服务器时间，纠正now
    isFix: false,
    countDown: cd,
    localJsTime: new Date().valueOf(),
    endTime: currentEndTime,
  });
});
//初始化活动数据
function seckillController(config) {
  var self = this;
  var defaultOptions = {
    now: new Date().valueOf(),
    template: '{d}:{h}:{m}:{s}',
    serverUrl: '/',
    isGetServerTime: false,
    delay: 1000,
    isFix: false,
    fixDelay: 3 * 1000,
    countDown: new countDown(1000),
    localJsTime: new Date().valueOf(),
    end: function () {
      //完成一个倒计时
      selected = 0;
    },
    endTime: new Date().valueOf() + 5 * 1000 * 60,
    render: function (outstring) {
      //根据当前时间，实时判断status值
      if (self.now < need1Time) {
        status = '-100';
      }
      if (self.now >= need1Time && self.now < endLast1Time) {
        status = '100';
      }
      if (self.now >= endLast1Time && self.now < need2Time) {
        status = '-200';
      }
      if (self.now >= need2Time && self.now < endLast2Time) {
        status = '200';
      }
      if (self.now >= endLast2Time && self.now < need3Time) {
        status = '-300';
      }
      if (self.now >= need3Time && self.now < endLast3Time) {
        status = '300';
      }
      if (self.now >= endLast3Time && self.now < need4Time) {
        status = '-400';
      }
      render();
      //格式化输出天、时、分、秒，如果最大的数为0，即隐藏
      var dateArr = outstring.split(':');
      var day = dateArr[0];
      var hour = dateArr[1];
      var minute = dateArr[2];
      var seconds = dateArr[3];
      if (day == 0 && hour == 0) {
        $('.h').hide();
      }
      if (day == 0 && hour == 0 && minute == 0) {
        $('.h').hide();
        $('.m').hide();
      }
      if (day != 0) {
        $('.h').text(_cover(day) + '天' + _cover(hour) + '时');
        $('.h').show();
      }
      if (hour != 0) {
        if (day == 0) {
          $('.h').text(_cover(hour) + '时');
        }
        $('.h').show();
      }
      if (minute != 0) {
        $('.m').show();
      }
      $('.m').text(_cover(minute) + '分');
      $('.s').text(_cover(seconds) + '秒');
    }
  };
  for (var i in defaultOptions) {
    this[i] = config[i] || defaultOptions[i];
  }
  this.init();
}
seckillController.prototype = {
  constructor: seckillController,
  init: function () {
    var self = this;
    //根据变量判断是否获取一次服务器的时间
    if (self.isGetServerTime) {
      self.getNowTime(function (now) {
        self.now = now;
        self.localJsTime = new Date().valueOf();
      });
    } else {
      self.now = new Date().valueOf();
      self.localJsTime = new Date().valueOf();
    }    //同步时间

    self.countDown.add(function () {
      var nowJsTime = new Date().valueOf(); //5.1
      var correctJsDate = self.localJsTime + self.delay; //5
      self.localJsTime = nowJsTime;
      var offset = nowJsTime - correctJsDate; //快0.1
      self.now = self.now + self.delay + offset;
      self.render(self.getOutString());
      if (status == '-100' && self.now >= need1Time - 1000) {
        self.endTime = endLast1Time;
        self.end();
      }
      if (status == '100' && self.now >= endLast1Time - 1000) {
        self.endTime = need2Time;
        self.end();
      }
      if (status == '-200' && self.now >= need2Time - 1000) {
        self.endTime = endLast2Time;
        self.end();
      }
      if (status == '200' && self.now >= endLast2Time - 1000) {
        self.endTime = need3Time;
        self.end();
      }
      if (status == '-300' && self.now >= need3Time - 1000) {
        self.endTime = endLast3Time;
        self.end();
      }
      if (status == '300' && self.now >= endLast3Time - 1000) {
        self.endTime = need4Time;
        self.end();
      }
    });
    if (self.isFix) {
      var fixCountDown = new countDown(self.fixDelay);
      fixCountDown.add(function () {
        self.getNowTime(function (now) {
          self.now = now;
          self.localJsTime = new Date().valueOf();
        });
      });
    }
  },
  getBetween: function () {
    var self = this;
    return _formatTime(self.endTime - self.now);
  },
  getOutString: function () {
    var between = this.getBetween();
    return this.template.replace(/{(\w*)}/g, function (m, key) {
      return between.hasOwnProperty(key) ? between[key] : '';
    });
  },
  getNowTime: function (cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', this.serverUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 3) {
        var now = xhr.getResponseHeader('Date');
        cb(new Date(now).valueOf());
        this.localJsTime = new Date().valueOf();
      }
    };
    xhr.send(null);
  },
  setEndTime: function (endTime) {
    var self = this;
    self.endTime = endTime;
  }
};
function countDown(delay) {
  var self = this;
  this._queue = [
  ];
  setInterval(function () {
    for (var i = 0; i < self._queue.length; i++) {
      self._queue[i]();
    }
  }, delay);
}
countDown.prototype = {
  constructor: countDown,
  add: function (cb) {
    this._queue.push(cb);
    return this._queue.length - 1;
  },
  remove: function (index) {
    this._queue.splice(index, 1);
  }
};
function _cover(num) {
  return num < 10 ? '0' + num : num;
}
function _formatTime(ms) {
  var dd = parseInt(ms / 1000 / 60 / 60 / 24, 10); //天
  var hh = parseInt((ms / 1000 / 60 / 60) % 24, 10); //时
  var mm = parseInt((ms / 1000 / 60) % 60, 10); //分
  var ss = parseInt((ms / 1000) % 60, 10); //秒
  return {
    d: dd,
    h: hh,
    m: mm,
    s: ss
  };
}//查询是否已经签订协议

function getAgreement() {
  var params = {
    'channelId': channelId,
    'userPhone': userPhone
  };
  $.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/seckill/getAgreement',
    async: true,
    success: function (data) {
      if (data.status == 200) {
        if (data.result == 0) {
          $('.public-box').show();
          $('.dh_ts_div_suc').show();
        }
      }
    }
  });
}
function close_xyts() {
  $('.public-box').hide();
  $('.dh_ts_div_suc').hide();
}
function uncheck() {
  var ischeck = $('#gou').attr('style');
  if (ischeck.indexOf('display: none') > 0) {
    $('#gou').show();
  } else {
    $('#gou').hide();
  }
}//活动协议

function xyqr() {
  var params = {
    'channelId': channelId
  };
  $.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/seckill/getXY',
    async: true,
    success: function (data) {
      if (data.status == 200) {
        $('.xy_content').html(data.result);
        $('#xy_div1').show();
      } else {
        layer.open({
          content: '协议加载失败，请稍后再试...',
          skin: 'msg',
          time: 3, //3秒后自动关闭
        });
      }
    }
  });
}
function closexy() {
  $('#xy_div1').hide();
}//签订协议

function agreement(aName) {
  var ischeck = $('#gou').attr('style');
  if (ischeck.indexOf('display: none') > 0) {
    layer.open({
      content: '请先阅读并同意协议',
      skin: 'msg',
      time: 3, //3秒后自动关闭
    });
    return;
  }  //保存协议签订记录

  var params = {
    'channelId': channelId,
    'userPhone': userPhone,
    'aName': aName
  };
  $.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/seckill/agreement',
    async: true,
    success: function (data) {
      if (data.status == 200) {
        $('.public-box').hide();
        $('.dh_ts_div_suc').hide();
      } else {
        layer.open({
          content: '协议签订异常，请稍后再试',
          skin: 'msg',
          time: 3, //3秒后自动关闭
        });
      }
    }
  });
}//秒杀操作

function seckill(type) {
  //saveShareRecord(type);
  layer.open({
    type: 2,
    shadeClose: false
  });
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
    success: function (data) {
      var userStatus = $('#userStatus').val();
      if (userStatus != 1) {
        $('.public-box').show();
        $('.not').show();
      } else {
        //检查是否已经签订协议
        var params = {
          'channelId': channelId,
          'userPhone': userPhone
        };
        $.ajax({
          type: 'POST',
          data: params,
          url: '/weixin/activi/seckill/getAgreement',
          async: true,
          success: function (data) {
            if (data.status == 200) {
              if (data.result == 0) {
                $('.public-box').show();
                $('.dh_ts_div_suc').show();
              } else if (data.result >= 1) {
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
                  beforeSend: function () {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.match(/leadeon/i) != 'leadeon') {
                      ajax.abort();
                    }                    //layer.open({type: 2});

                  },
                  success: function (data) {
                    var si_n = '移动电商，周三来秒杀';
                    var si_s = data.desc;
                    // WT.si_x = 20 点击办理
                    Webtrends.multiTrack({
                      argsa: [
                        'WT.si_n',
                        si_n,
                        'WT.si_s',
                        si_s,
                        'WT.si_x',
                        '20'
                      ]
                    });
                    layer.closeAll();
                    if (data.status == 3) {
                      layer.open({
                        content: '请勿频繁操作~',
                        skin: 'msg',
                        time: 3, //3秒后自动关闭
                      });
                    } else if (data.status == - 2) {
                      $('.ts-suc-span1').text('很遗憾，该奖券已被抢完~');
                      $('.ts-suc-span2').text('快快秒杀其他奖券吧！');
                      $('.public-box').show();
                      $('.suc_ts_div').show();
                      //更新剩余奖品数量
                      $('#sy_num' + data.rvalue1).text(0);
                      $('#p' + data.rvalue1 + '_seckill').hide();
                      $('#p' + data.rvalue1 + '_get_0').show();
                      switch (status) {
                        case '100':
                          switch (data.rvalue1) {
                            case 1:
                              s1P1Num = 0;
                              break;
                            case 2:
                              s1P2Num = 0;
                              break;
                            case 3:
                              s1P3Num = 0;
                              break;
                            case 4:
                              s1P4Num = 0;
                              break;
                          }
                          break;
                        case '200':
                          switch (data.rvalue1) {
                            case 1:
                              s2P1Num = 0;
                              break;
                            case 2:
                              s2P2Num = 0;
                              break;
                            case 3:
                              s2P3Num = 0;
                              break;
                            case 4:
                              s2P4Num = 0;
                              break;
                          }
                          break;
                        case '300':
                          switch (data.rvalue1) {
                            case 1:
                              s3P1Num = 0;
                              break;
                            case 2:
                              s3P2Num = 0;
                              break;
                            case 3:
                              s3P3Num = 0;
                              break;
                            case 4:
                              s3P4Num = 0;
                              break;
                          }
                          break;
                      }
                    } else if (data.status == - 3) {
                      $('.public-box').show();
                      $('.dh_ts_div').show();
                      $('#p' + type + '_seckill').hide();
                      $('#p' + type + '_bkcy').show();
                      switch (type) {
                        case 1:
                          p1HasMs = 1;
                          break;
                        case 2:
                          p2HasMs = 1;
                          break;
                        case 3:
                          p3HasMs = 1;
                          break;
                        case 4:
                          p4HasMs = 1;
                          break;
                      }
                    } else if (data.status == 200) {
                      //秒杀成功弹框
                      $('.ts-suc-span1').text('手速超人！');
                      $('.ts-suc-span2').text('恭喜您秒杀到' + data.desc + '~');
                      $('.public-box').show();
                      $('.suc_ts_div').show();
                      $('#p1_seckill').hide();
                      $('#p2_seckill').hide();
                      $('#p3_seckill').hide();
                      $('#p4_seckill').hide();
                      //更新剩余奖品数量
                      $('#sy_num' + data.rvalue1).text(data.rvalue2);
                      $('#p1_iscy').show();
                      $('#p2_iscy').show();
                      $('#p3_iscy').show();
                      $('#p4_iscy').show();
                      if (data.rvalue2 == 0) {
                        $('#p' + data.rvalue1 + '_iscy').hide();
                        $('#p' + data.rvalue1 + '_get_0').show();
                      }
                      iscanyu = 1;
                      switch (status) {
                        case '100':
                          switch (data.rvalue1) {
                            case 1:
                              s1P1Num = data.rvalue2;
                              break;
                            case 2:
                              s1P2Num = data.rvalue2;
                              break;
                            case 3:
                              s1P3Num = data.rvalue2;
                              break;
                            case 4:
                              s1P4Num = data.rvalue2;
                              break;
                          }
                          break;
                        case '200':
                          switch (data.rvalue1) {
                            case 1:
                              s2P1Num = data.rvalue2;
                              break;
                            case 2:
                              s2P2Num = data.rvalue2;
                              break;
                            case 3:
                              s2P3Num = data.rvalue2;
                              break;
                            case 4:
                              s2P4Num = data.rvalue2;
                              break;
                          }
                          break;
                        case '300':
                          switch (data.rvalue1) {
                            case 1:
                              s3P1Num = data.rvalue2;
                              break;
                            case 2:
                              s3P2Num = data.rvalue2;
                              break;
                            case 3:
                              s3P3Num = data.rvalue2;
                              break;
                            case 4:
                              s3P4Num = data.rvalue2;
                              break;
                          }
                          break;
                      }                      // WT.si_x = 99 办理成功

                      Webtrends.multiTrack({
                        argsa: [
                          'WT.si_n',
                          si_n,
                          'WT.si_s',
                          si_s,
                          'WT.si_x',
                          '99'
                        ]
                      });
                    } else if (data.status == - 200 || data.status == - 300) {
                      layer.open({
                        // content: "秒杀成功，奖品发放失败，失败原因："+data.desc,
                        content: '秒杀成功，奖品发放失败，后续会进行补发，请耐心等待',
                        skin: 'msg',
                        time: 100, //3秒后自动关闭
                      });
                      // WT.si_x = -99 办理失败
                      Webtrends.multiTrack({
                        argsa: [
                          'WT.si_n',
                          si_n,
                          'WT.si_s',
                          si_s,
                          'WT.si_x',
                          '-99',
                          'WT.errCode',
                          data.desc
                        ]
                      });
                    } else {
                      layer.open({
                        content: '系统繁忙，请稍后再试',
                        skin: 'msg',
                        time: 3, //3秒后自动关闭
                      });
                      // WT.si_x = -99 办理失败
                      Webtrends.multiTrack({
                        argsa: [
                          'WT.si_n',
                          si_n,
                          'WT.si_s',
                          si_s,
                          'WT.si_x',
                          '-99',
                          'WT.errCode',
                          data.desc
                        ]
                      });
                    }
                  }
                });
              }
            }
          }
        });
      }
    }
  });
}//活动规则

function rule() {
  var params = {
    'channelId': channelId
  };
  $.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/seckill/getActRule',
    async: true,
    success: function (data) {
      if (data.status == 200) {
        $('.rule-item-content').html(data.result);
      } else {
        layer.open({
          content: '系统繁忙，请稍后再试...',
          skin: 'msg',
          time: 3, //3秒后自动关闭
        });
      }
    }
  });
  $('.rule-content').show();
}
function closeRule() {
  $('.rule-content').hide();
}
function close_not() {
  $('.public-box').hide();
  $('.not').hide();
}
function close_suc() {
  $('.public-box').hide();
  $('.suc_ts_div').hide();
}//我的奖品

function myprize() {
  var userStatus = $('#userStatus').val();
  if (userStatus != 1) {
    $('.public-box').show();
    $('.not').show();
  } else {
    var userStatus = $('#userStatus').val();
    if (userStatus != 1) {
      $('.public-box').show();
      $('.not').show();
    } else {
      var params = {
        'channelId': channelId,
        'userPhone': userPhone
      };
      $.ajax({
        type: 'POST',
        data: params,
        url: '/weixin/activi/seckill/getMyPrize',
        async: true,
        success: function (data) {
          if (data.status == 200) {
            var html = '';
            $('.prize-item-content').empty();
            if (data.opList.length == 0) {
              html = '<span class="noprize">您还没有获得任何奖品噢~</span>';
              $('.prize-item-content').append(html);
            } else {
              $.each(data.opList, function (index, value) {
                var time = value.dayTime.substring(4, 5).replace('0', '') + value.dayTime.substring(5, 6) + '月' + value.dayTime.substring(6, 8) + '日';
                var prize = value.operationName;
                var prizeStatus = value.prizeStatus;
                if (prizeStatus == 1) { //已使用
                  html = '<div class="prize-item">' +
                  '<div class="prize-item-1">' +
                  '<span style="color:#9C9C9C">' + time + '</span>' +
                  '<span>' + prize + '</span>' +
                  '<span><img src="../../imgh5/img/seckill/yff.png" /></span>' +
                  '</div></div>';
                } else {
                  html = '<div class="prize-item">' +
                  '<div class="prize-item-1">' +
                  '<span style="color:#9C9C9C">' + time + '</span>' +
                  '<span>' + prize + '</span>' +
                  '<span><img onclick="qqdd()" src="../../imgh5/img/seckill/dff.png" /></span>' +
                  '</div></div>';
                }
                $('.prize-item-content').append(html);
              });
            }
            $('.prize-content').show();
          } else {
            layer.open({
              content: '系统繁忙，请稍后再试...',
              skin: 'msg',
              time: 3, //3秒后自动关闭
            });
          }
        }
      });
    }
  }
};
//黔券多多界面
function qqdd() {
  window.location.href = 'https://qqdd.gz.chinamobile.com/dccp-portal/gz/quanyihui/qyhComponentIndex.ajax?pageId=guizhouquanyizhuanqu';
}
function close_prize() {
  $('.prize-content').hide();
}//本周已参与提示

function iscy() {
  $('.ts-iscy').show();
  setTimeout(function () {
    $('.ts-iscy').hide();
  }, 3000);
}
function close_not() {
  $('.public-box').hide();
  $('.dh_ts_div').hide();
}//咪咕产品办理页面

function order(t) {
  var params = {
    'channelId': channelId,
    'order': t,
    'userPhone': userPhone
  };
  $.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/seckill/saveMenuClick',
    async: true,
    beforeSend: function () {
      layer.open({
        type: 2
      });
    },
    success: function (data) {
    }
  });
  if (t == 1) {
    window.location.href = 'https://plus.migu.cn/c/0uzhcq'; //咪咕音乐
  } else if (t == 2) {
    window.location.href = 'https://plus.migu.cn/c/0us0fe'; //咪咕视频
  } else if (t == 3) {
    window.location.href = 'https://plus.migu.cn/c/0u9wxj'; //咪咕快游
  } else if (t == 4) {
    window.location.href = 'https://plus.migu.cn/c/0u1zbg'; //咪咕阅读
  } else if (t == 5) {
    window.location.href = 'https://dev.coc.10086.cn/coc2/web-kataobao/ptvip/index.html?channelId=P00000010998&pageId=1386587330419818496&sellerId=SXZQQYTjkBbjh'; //铂金会员
  } else if (t == 6) {
    window.location.href = 'http://wap.gz.10086.cn/waps/static/activity/polyPage/polyPage.html?polyId=55270345H'; //黄金会员
  } else if (t == 7) {
    window.location.href = 'https://qqdd.gz.chinamobile.com/dccp-portal/gz/quanyihui/qyhComponentIndex.ajax?pageId=chezhuquanyi'; //加油立减
  } else if (t == 8) {
    window.location.href = 'https://qqdd.gz.chinamobile.com/dccp-portal/gz/quanyihui/qyhComponentIndex.ajax?pageId=kangyi22'; //居家好物
  }
}
function updateData()
{
  var params = {
    'userPhone': userPhone
  };
  $.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/seckill/getSeckillDate',
    async: true,
    success: function (data) {
      //reids中获取每个阶段每种奖品的剩余数量
      s1P1Num = data.rvalue1;
      s1P2Num = data.rvalue2;
      s1P3Num = data.rvalue3;
      s1P4Num = data.rvalue4;
      s2P1Num = data.rvalue5;
      s2P2Num = data.rvalue6;
      s2P3Num = data.rvalue7;
      s2P4Num = data.rvalue8;
      s3P1Num = data.rvalue9;
      s3P2Num = data.rvalue10;
      s3P3Num = data.rvalue11;
      s3P4Num = data.rvalue12;
      iscanyu = data.rvalue13;
      // 定时器刷新有1秒延迟，立即刷新一次显示
      render();
    }
  });
}//未到时间

function noTime() {
  $('#p1_get').show();
  $('#p2_get').show();
  $('#p3_get').show();
  $('#p4_get').show();
  $('#p1_get_0').hide();
  $('#p2_get_0').hide();
  $('#p3_get_0').hide();
  $('#p4_get_0').hide();
  $('#p1_iscy').hide();
  $('#p2_iscy').hide();
  $('#p3_iscy').hide();
  $('#p4_iscy').hide();
  $('#p1_seckill').hide();
  $('#p2_seckill').hide();
  $('#p3_seckill').hide();
  $('#p4_seckill').hide();
  $('#p1_bkcy').hide();
  $('#p2_bkcy').hide();
  $('#p3_bkcy').hide();
  $('#p4_bkcy').hide();
  $('#p1_yjs').hide();
  $('#p2_yjs').hide();
  $('#p3_yjs').hide();
  $('#p4_yjs').hide();
}//已结束

function yjs() {
  $('#p1_get').hide();
  $('#p2_get').hide();
  $('#p3_get').hide();
  $('#p4_get').hide();
  $('#p1_get_0').hide();
  $('#p2_get_0').hide();
  $('#p3_get_0').hide();
  $('#p4_get_0').hide();
  $('#p1_iscy').hide();
  $('#p2_iscy').hide();
  $('#p3_iscy').hide();
  $('#p4_iscy').hide();
  $('#p1_seckill').hide();
  $('#p2_seckill').hide();
  $('#p3_seckill').hide();
  $('#p4_seckill').hide();
  $('#p1_bkcy').hide();
  $('#p2_bkcy').hide();
  $('#p3_bkcy').hide();
  $('#p4_bkcy').hide();
  $('#p1_yjs').show();
  $('#p2_yjs').show();
  $('#p3_yjs').show();
  $('#p4_yjs').show();
}//已参与

function hasCy() {
  $('#p1_yjs').hide();
  $('#p2_yjs').hide();
  $('#p3_yjs').hide();
  $('#p4_yjs').hide();
  $('#p1_get').hide();
  $('#p2_get').hide();
  $('#p3_get').hide();
  $('#p4_get').hide();
  $('#p1_get_0').hide();
  $('#p2_get_0').hide();
  $('#p3_get_0').hide();
  $('#p4_get_0').hide();
  $('#p1_iscy').show();
  $('#p2_iscy').show();
  $('#p3_iscy').show();
  $('#p4_iscy').show();
  $('#p1_seckill').hide();
  $('#p2_seckill').hide();
  $('#p3_seckill').hide();
  $('#p4_seckill').hide();
  $('#p1_bkcy').hide();
  $('#p2_bkcy').hide();
  $('#p3_bkcy').hide();
  $('#p4_bkcy').hide();
}//不可参与

function bkCy() {
  $('#p1_yjs').hide();
  $('#p2_yjs').hide();
  $('#p3_yjs').hide();
  $('#p4_yjs').hide();
  $('#p1_get').hide();
  $('#p2_get').hide();
  $('#p3_get').hide();
  $('#p4_get').hide();
  $('#p1_get_0').hide();
  $('#p2_get_0').hide();
  $('#p3_get_0').hide();
  $('#p4_get_0').hide();
  $('#p1_iscy').hide();
  $('#p2_iscy').hide();
  $('#p3_iscy').hide();
  $('#p4_iscy').hide();
  $('#p1_seckill').hide();
  $('#p2_seckill').hide();
  $('#p3_seckill').hide();
  $('#p4_seckill').hide();
  $('#p1_bkcy').show();
  $('#p2_bkcy').show();
  $('#p3_bkcy').show();
  $('#p4_bkcy').show();
}// 秒杀

function ms() {
  $('#p1_yjs').hide();
  $('#p2_yjs').hide();
  $('#p3_yjs').hide();
  $('#p4_yjs').hide();
  $('#p1_get').hide();
  $('#p2_get').hide();
  $('#p3_get').hide();
  $('#p4_get').hide();
}//保存分享点击记录

function saveShareRecord(type) {
  var params = {
    'channelId': type,
    'userPhone': userPhone
  };
  $.ajax({
    type: 'POST',
    data: params,
    url: '/weixin/activi/enjoyYouThink/saveMenuClick',
    async: true,
    success: function (data) {
    }
  });
}
$('.t1').click(function () {
  var text = $('.time-date-t1').text();
  if (text == '秒杀结束') {
    return;
  }
  if (status == '100') {
    sk.endTime = endLast1Time;
  } 
  else {
    sk.endTime = need1Time;
  }
  selected = '1';
  updateData();
});
$('.t2').click(function () {
  var text = $('.time-date-t2').text();
  if (text == '秒杀结束') {
    return;
  }
  if (status == '200') {
    sk.endTime = endLast2Time;
  } 
  else {
    sk.endTime = need2Time;
  }
  selected = '2';
  updateData();
});
$('.t3').click(function () {
  var text = $('.time-date-t3').text();
  if (text == '秒杀结束') {
    return;
  }
  if (status == '300') {
    sk.endTime = endLast3Time;
  } 
  else {
    sk.endTime = need3Time;
  }
  selected = '3';
  updateData();
});
$('.t4').click(function () {
  sk.endTime = need4Time;
  selected = '4';
  updateData();
});
function render() {
  switch (status) {
    case '-100':
      switch (selected) {
          //第一阶段未开始，选中了1阶段
        case '1':
        default:
          $('.t1').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_ing');
          $('.time-t1').text(stage1StartTime + '-' + stage1EndTime);
          $('.time-date-t1').css('font-size', '1.5vh');
          $('.time-date-t1').text(stage1StartDay + ',敬请期待');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need1Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置按钮状态
          noTime();
          break;
          //第一阶段未开始，选中了2阶段
        case '2':
          $('.t2').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.time-t1').text(stage1StartTime + '-' + stage1EndTime);
          $('.time-date-t1').css('font-size', '1.5vh');
          $('.time-date-t1').text(stage1StartDay + ',敬请期待');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need2Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s2P1Num);
          $('#sy_num2').text(s2P2Num);
          $('#sy_num3').text(s2P3Num);
          $('#sy_num4').text(s2P4Num);
          //设置按钮状态
          noTime();
          break;
          //第一阶段未开始，选中了3阶段
        case '3':
          $('.t3').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_ing');
          $('.time-t1').text(stage1StartTime + '-' + stage1EndTime);
          $('.time-date-t1').css('font-size', '1.5vh');
          $('.time-date-t1').text(stage1StartDay + ',敬请期待');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need3Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s3P1Num);
          $('#sy_num2').text(s3P2Num);
          $('#sy_num3').text(s3P3Num);
          $('#sy_num4').text(s3P4Num);
          //设置按钮状态
          noTime();
          break;
      }
      break;
    case '100':
      switch (selected) {
          //第一阶段正在秒杀，选中了1阶段
        case '1':
        default:
          $('.t1').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_ing');
          $('.time-t1').text(stage1StartTime + '-' + stage1EndTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀中');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = endLast1Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离本场结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置按钮状态
          if (iscanyu == 1) {
            hasCy();
            break;
          }
          ms();
          if (s1P1Num == 0) {
            $('#p1_seckill').hide();
            $('#p1_iscy').hide();
            $('#p1_bkcy').hide();
            $('#p1_get_0').show();
          } else if (p1HasMs == 1) {
            $('#p1_seckill').hide();
            $('#p1_iscy').hide();
            $('#p1_get_0').hide();
            $('#p1_bkcy').show();
          } else {
            $('#p1_iscy').hide();
            $('#p1_get_0').hide();
            $('#p1_bkcy').hide();
            $('#p1_seckill').show();
          }
          if (s1P2Num == 0) {
            $('#p2_seckill').hide();
            $('#p2_iscy').hide();
            $('#p2_bkcy').hide();
            $('#p2_get_0').show();
          } else if (p2HasMs == 1) {
            $('#p2_seckill').hide();
            $('#p2_iscy').hide();
            $('#p2_get_0').hide();
            $('#p2_bkcy').show();
          } else {
            $('#p2_iscy').hide();
            $('#p2_get_0').hide();
            $('#p2_bkcy').hide();
            $('#p2_seckill').show();
          }
          if (s1P3Num == 0) {
            $('#p3_seckill').hide();
            $('#p3_iscy').hide();
            $('#p3_bkcy').hide();
            $('#p3_get_0').show();
          } else if (p3HasMs == 1) {
            $('#p3_seckill').hide();
            $('#p3_iscy').hide();
            $('#p3_get_0').hide();
            $('#p3_bkcy').show();
          } else {
            $('#p3_iscy').hide();
            $('#p3_get_0').hide();
            $('#p3_bkcy').hide();
            $('#p3_seckill').show();
          }
          if (s1P4Num == 0) {
            $('#p4_seckill').hide();
            $('#p4_iscy').hide();
            $('#p4_bkcy').hide();
            $('#p4_get_0').show();
          } else if (p4HasMs == 1) {
            $('#p4_seckill').hide();
            $('#p4_iscy').hide();
            $('#p4_get_0').hide();
            $('#p4_bkcy').show();
          } else {
            $('#p4_iscy').hide();
            $('#p4_get_0').hide();
            $('#p4_bkcy').hide();
            $('#p4_seckill').show();
          }
          break;
          //第一阶段秒杀中，选中了2阶段
        case '2':
          $('.t2').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_ing');
          $('.time-t1').text(stage1StartTime + '-' + stage1EndTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀中');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need2Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s2P1Num);
          $('#sy_num2').text(s2P2Num);
          $('#sy_num3').text(s2P3Num);
          $('#sy_num4').text(s2P4Num);
          //设置按钮状态
          noTime();
          break;
          //第一阶段秒杀中，选中了3阶段
        case '3':
          $('.t3').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_ing');
          $('.time-t1').text(stage1StartTime + '-' + stage1EndTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀中');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need3Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s3P1Num);
          $('#sy_num2').text(s3P2Num);
          $('#sy_num3').text(s3P3Num);
          $('#sy_num4').text(s3P4Num);
          //设置按钮状态
          noTime();
          break;
      }
      break;
    case '-200':
      switch (selected) {
          //第一阶段结束，第二阶段未开始,选中了第1阶段
        case '1':
          $('.t1').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_end');
          $('.t2').addClass('t2_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-t2').text(stage2StartTime + '-' + stage2EndTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need2Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第一场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置按钮状态
          yjs();
          break;
          //第一阶段结束，第二阶段未开始,选中了第2阶段
        case '2':
        default:
          $('.t2').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_end');
          $('.t2').addClass('t2_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime + '-' + stage2EndTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need2Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s2P1Num);
          $('#sy_num2').text(s2P2Num);
          $('#sy_num3').text(s2P3Num);
          $('#sy_num4').text(s2P4Num);
          //设置按钮状态
          noTime();
          break;
          //第一阶段结束，第二阶段未开始,选中了第3阶段
        case '3':
          $('.t3').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_end');
          $('.t2').addClass('t2_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime + '-' + stage2EndTime);
          $('.time-date-t2').text('未到时间');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need3Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s3P1Num);
          $('#sy_num2').text(s3P2Num);
          $('#sy_num3').text(s3P3Num);
          $('#sy_num4').text(s3P4Num);
          //设置按钮状态
          noTime();
          break;
      }
      break;
      //第二阶段正在秒杀中
    case '200':
      switch (selected) {
          //第二阶段正在秒杀中,选择了第一阶段
        case '1':
          $('.t1').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_end');
          $('.t2').addClass('t2_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime + '-' + stage2EndTime);
          $('.time-date-t2').text('秒杀中');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            self.endTime = endLast2Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第一场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置按钮状态
          yjs();
          break;
        case '2':
        default:
          $('.t2').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_end');
          $('.t2').addClass('t2_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime + '-' + stage2EndTime);
          $('.time-date-t2').text('秒杀中');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = endLast2Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离本场结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s2P1Num);
          $('#sy_num2').text(s2P2Num);
          $('#sy_num3').text(s2P3Num);
          $('#sy_num4').text(s2P4Num);
          //设置按钮状态
          if (iscanyu == 1) {
            hasCy();
            break;
          }
          ms();
          if (s2P1Num == 0) {
            $('#p1_seckill').hide();
            $('#p1_iscy').hide();
            $('#p1_bkcy').hide();
            $('#p1_get_0').show();
          } else if (p1HasMs == 1) {
            $('#p1_seckill').hide();
            $('#p1_iscy').hide();
            $('#p1_get_0').hide();
            $('#p1_bkcy').show();
          } else {
            $('#p1_iscy').hide();
            $('#p1_get_0').hide();
            $('#p1_bkcy').hide();
            $('#p1_seckill').show();
          }
          if (s2P2Num == 0) {
            $('#p2_seckill').hide();
            $('#p2_iscy').hide();
            $('#p2_bkcy').hide();
            $('#p2_get_0').show();
          } else if (p2HasMs == 1) {
            $('#p2_seckill').hide();
            $('#p2_iscy').hide();
            $('#p2_get_0').hide();
            $('#p2_bkcy').show();
          } else {
            $('#p2_iscy').hide();
            $('#p2_get_0').hide();
            $('#p2_bkcy').hide();
            $('#p2_seckill').show();
          }
          if (s2P3Num == 0) {
            $('#p3_seckill').hide();
            $('#p3_iscy').hide();
            $('#p3_bkcy').hide();
            $('#p3_get_0').show();
          } else if (p3HasMs == 1) {
            $('#p3_seckill').hide();
            $('#p3_iscy').hide();
            $('#p3_get_0').hide();
            $('#p3_bkcy').show();
          } else {
            $('#p3_iscy').hide();
            $('#p3_get_0').hide();
            $('#p3_bkcy').hide();
            $('#p3_seckill').show();
          }
          if (s2P4Num == 0) {
            $('#p4_seckill').hide();
            $('#p4_iscy').hide();
            $('#p4_bkcy').hide();
            $('#p4_get_0').show();
          } else if (p4HasMs == 1) {
            $('#p4_seckill').hide();
            $('#p4_iscy').hide();
            $('#p4_get_0').hide();
            $('#p4_bkcy').show();
          } else {
            $('#p4_iscy').hide();
            $('#p4_get_0').hide();
            $('#p4_bkcy').hide();
            $('#p4_seckill').show();
          }
          break;
        case '3':
          $('.t3').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').addClass('t1_end');
          $('.t2').addClass('t2_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime + '-' + stage2EndTime);
          $('.time-date-t2').text('秒杀中');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            self.endTime = need3Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s3P1Num);
          $('#sy_num2').text(s3P2Num);
          $('#sy_num3').text(s3P3Num);
          $('#sy_num4').text(s3P4Num);
          //设置按钮状态
          noTime();
          break;
      }
      break;
    case '-300':
      switch (selected) {
        case '1':
          $('.t1').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').addClass('t3_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime + '-' + stage3EndTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need3Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第一场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置按钮状态
          yjs();
          break;
        case '2':
          $('.t2').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').addClass('t3_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime + '-' + stage3EndTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need3Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第二场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s2P1Num);
          $('#sy_num2').text(s2P2Num);
          $('#sy_num3').text(s2P3Num);
          $('#sy_num4').text(s2P4Num);
          //设置按钮状态
          yjs();
          break;
        case '3':
        default:
          $('.t3').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').addClass('t3_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime + '-' + stage3EndTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = need3Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s3P1Num);
          $('#sy_num2').text(s3P2Num);
          $('#sy_num3').text(s3P3Num);
          $('#sy_num4').text(s3P4Num);
          //设置按钮状态
          noTime();
          break;
      }
      break;
    case '300':
      switch (selected) {
        case '1':
          $('.t1').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').addClass('t3_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime + '-' + stage3EndTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = endLast3Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第一场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置按钮状态
          yjs();
          break;
        case '2':
          $('.t2').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').addClass('t3_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime + '-' + stage3EndTime);
          $('.time-date-t3').text('未到时间');
          if (sk) {
            sk.endTime = endLast3Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第二场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s2P1Num);
          $('#sy_num2').text(s2P2Num);
          $('#sy_num3').text(s2P3Num);
          $('#sy_num4').text(s2P4Num);
          //设置按钮状态
          yjs();
          break;
        case '3':
        default:
          $('.t3').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').addClass('t3_ing');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').css('font-size', '2vh');
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime + '-' + stage3EndTime);
          $('.time-date-t3').text('秒杀中');
          if (sk) {
            sk.endTime = endLast3Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离本场结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s3P1Num);
          $('#sy_num2').text(s3P2Num);
          $('#sy_num3').text(s3P3Num);
          $('#sy_num4').text(s3P4Num);
          //设置按钮状态
          if (iscanyu == 1) {
            hasCy();
            break;
          }
          ms();
          if (s3P1Num == 0) {
            $('#p1_seckill').hide();
            $('#p1_iscy').hide();
            $('#p1_bkcy').hide();
            $('#p1_get_0').show();
          } else if (p1HasMs == 1) {
            $('#p1_seckill').hide();
            $('#p1_iscy').hide();
            $('#p1_get_0').hide();
            $('#p1_bkcy').show();
          } else {
            $('#p1_iscy').hide();
            $('#p1_get_0').hide();
            $('#p1_bkcy').hide();
            $('#p1_seckill').show();
          }
          if (s3P2Num == 0) {
            $('#p2_seckill').hide();
            $('#p2_iscy').hide();
            $('#p2_bkcy').hide();
            $('#p2_get_0').show();
          } else if (p2HasMs == 1) {
            $('#p2_seckill').hide();
            $('#p2_iscy').hide();
            $('#p2_get_0').hide();
            $('#p2_bkcy').show();
          } else {
            $('#p2_iscy').hide();
            $('#p2_get_0').hide();
            $('#p2_bkcy').hide();
            $('#p2_seckill').show();
          }
          if (s3P3Num == 0) {
            $('#p3_seckill').hide();
            $('#p3_iscy').hide();
            $('#p3_bkcy').hide();
            $('#p3_get_0').show();
          } else if (p3HasMs == 1) {
            $('#p3_seckill').hide();
            $('#p3_iscy').hide();
            $('#p3_get_0').hide();
            $('#p3_bkcy').show();
          } else {
            $('#p3_iscy').hide();
            $('#p3_get_0').hide();
            $('#p3_bkcy').hide();
            $('#p3_seckill').show();
          }
          if (s3P4Num == 0) {
            $('#p4_seckill').hide();
            $('#p4_iscy').hide();
            $('#p4_bkcy').hide();
            $('#p4_get_0').show();
          } else if (p4HasMs == 1) {
            $('#p4_seckill').hide();
            $('#p4_iscy').hide();
            $('#p4_get_0').hide();
            $('#p4_bkcy').show();
          } else {
            $('#p4_iscy').hide();
            $('#p4_get_0').hide();
            $('#p4_bkcy').hide();
            $('#p4_seckill').show();
          }
          break;
      }
      break;
    case '-400':
      switch (selected) {
        case '4':
        default:
          $('.t4').attr('style', 'background: white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').removeClass('t3_ing');
          $('.t3').addClass('t3_end');
          $('.t4').addClass('t4_show');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('秒杀结束');
          $('.time-date-t4').css('position', 'relative');
          $('.time-date-t4').css('top', '4%');
          $('.t4').show();
          $('.time-t4').text(stage1StartTime);
          $('.time-date-t4').css('font-size', '1.5vh');
          $('.time-date-t4').text(nextStartDay + ',敬请期待');
          if (sk) {
            sk.endTime = need4Time;
          }
          $('.time-last').show();
          $('.time-title').text('距离活动开始');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置立即秒杀按钮状态
          noTime();
          break;
        case '1':
          $('.t1').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').removeClass('t3_ing');
          $('.t3').addClass('t3_end');
          $('.t4').addClass('t4_show');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('秒杀结束');
          $('.t4').show();
          $('.time-t4').text(stage1StartTime);
          $('.time-date-t4').css('font-size', '1.5vh');
          $('.time-date-t4').text(nextStartDay + ',敬请期待');
          if (sk) {
            sk.endTime = need4Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第一场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s1P1Num);
          $('#sy_num2').text(s1P2Num);
          $('#sy_num3').text(s1P3Num);
          $('#sy_num4').text(s1P4Num);
          //设置立即秒杀按钮状态
          yjs();
          break;
        case '2':
          $('.t2').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t3').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').removeClass('t3_ing');
          $('.t3').addClass('t3_end');
          $('.t4').addClass('t4_show');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('秒杀结束');
          $('.time-date-t4').css('position', 'relative');
          $('.time-date-t4').css('top', '4%');
          $('.t4').show();
          $('.time-t4').text(stage1StartTime);
          $('.time-date-t4').css('font-size', '1.5vh');
          $('.time-date-t4').text(nextStartDay + ',敬请期待');
          if (sk) {
            sk.endTime = need4Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第二场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s2P1Num);
          $('#sy_num2').text(s2P2Num);
          $('#sy_num3').text(s2P3Num);
          $('#sy_num4').text(s2P4Num);
          //设置立即秒杀按钮状态
          yjs();
          break;
        case '3':
          $('.t3').attr('style', 'background-color:white; border-radius: 5px;');
          $('.t1').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t2').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t4').attr('style', 'background: linear-gradient(#fef4e9 2%,#f5d9b0 5%,#fae6c9 20%,#f5d9b0 60%); border-radius: 5px;');
          $('.t1').removeClass('t1_ing');
          $('.t1').addClass('t1_end');
          $('.t2').removeClass('t2_ing');
          $('.t2').addClass('t2_end');
          $('.t3').removeClass('t3_ing');
          $('.t3').addClass('t3_end');
          $('.t4').addClass('t4_show');
          $('.time-t1').text(stage1StartTime);
          $('.time-date-t1').text('秒杀结束');
          $('.time-t2').text(stage2StartTime);
          $('.time-date-t2').text('秒杀结束');
          $('.time-t3').text(stage3StartTime);
          $('.time-date-t3').text('秒杀结束');
          $('.time-date-t4').css('position', 'relative');
          $('.time-date-t4').css('top', '4%');
          $('.t4').show();
          $('.time-t4').text(stage1StartTime);
          $('.time-date-t4').css('font-size', '1.5vh');
          $('.time-date-t4').text(nextStartDay + ',敬请期待');
          if (sk) {
            sk.endTime = need4Time;
          }
          $('.time-last').hide();
          $('.time-title').text('第三场秒杀已结束');
          //设置剩余奖品数量
          $('#sy_num1').text(s3P1Num);
          $('#sy_num2').text(s3P2Num);
          $('#sy_num3').text(s3P3Num);
          $('#sy_num4').text(s3P4Num);
          //设置立即秒杀按钮状态
          yjs();
          break;
      }
      break;
  }
}


///////////////////////////////


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
    1);//默认等待时间2048
}

sps.quesIndex = function(b) {
    var c = "0";
    var d = $.cookie("ex_range_" + b);
    c = 28;
    $.cookie("ex_range_" + b, c, {
        path: "/sps/",
        expires: 1
    })
    if (typeof(c) == "string") {
        c = c.replace(/"/g, "")
    }
    jQuery.ajax({
        type: "post",
        url: sps.url.exercies.shiti + "?paperId=" + b + "&series=" + c,
        success: function(e) {
            console.log(e)
            sps.quesIndexView(e);
            sps.initExercises(b, c, e);
            return e
        },
        error: function(g, f, h) {}
    })
};
g = sps.quesIndex("6558");
sps.myCommit1 = function(validate) {
    var ids = $("#hids").val();
    sps.getScore();
    $.cookie("ex_ids", ids, {
        path: "/sps/",
        expires: 1
    });
    $.cookie("ex_pId", $("#hid").val().replace(/"/g, ""), {
        path: "/sps/",
        expires: 1
    });
    var loginUser = base.getCookie("loginUser", loginUser);
    if (loginUser == "" || loginUser == "undefined" || typeof(loginUser) == "undefined") {
        sps.popwinOpenTextForOutLine(false);
        return
    }
    var userAccount = loginUser.userAccount;
    var domainCode = loginUser.domainCode;
    var sid = base.getCookie("loginUser").sid;
    var paperId = $.cookie("ex_pId");
    var series = $.cookie("ex_range_" + paperId);
    var userAnswer = $.cookie("ex_per_" + userAccount);
    var userAnswerObj = eval(userAnswer);
    //答案处：
    var my_anwser = '[{"questionId":"883479","answerNo":"C"},{"questionId":"883484","answerNo":"B"},{"questionId":"883488","answerNo":"A"},{"questionId":"883483","answerNo":"C"},{"questionId":"883485","answerNo":"A"},{"questionId":"883476","answerNo":"D"},{"questionId":"883486","answerNo":"B"},{"questionId":"883492","answerNo":"A"},{"questionId":"883468","answerNo":"ABC"},{"questionId":"883480","answerNo":"ABCD"},{"questionId":"883491","answerNo":"AD"},{"questionId":"883473","answerNo":"ABCD"},{"questionId":"883490","answerNo":"ABCD"},{"questionId":"883470","answerNo":"ABCD"},{"questionId":"883507","answerNo":"ABCD"},{"questionId":"883558","answerNo":"1"},{"questionId":"883549","answerNo":"1"},{"questionId":"883547","answerNo":"1"},{"questionId":"883550","answerNo":"1"},{"questionId":"883560","answerNo":"0"}]'
    var timecur = sps.getExerciesTimecur();
    let userCodes = base.getCookie("captch_0_" + timecur + "_" + loginUser.userAccount);
    let sk = $("#sk").val();
    var key = CryptoJS.enc.Utf8.parse(sps.url.captch.key);
    var iv = CryptoJS.enc.Utf8.parse(sps.url.captch.iv);
    var kEncode = CryptoJS.enc.Utf8.parse(sk);
    var encryptedK = CryptoJS.AES.encrypt(kEncode, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var secretKey = CryptoJS.enc.Base64.stringify(encryptedK.ciphertext);
    jQuery.ajax({
        type: "post",
        async: false,
        url: sps.url.courseware.commitExercises,
        data: {
            domainCode: domainCode,
            userAccount: userAccount,
            paperId: paperId,
            series: series,
            myExamAnswer: my_anwser,
            ssid: sid,
            type: 1,
            validate: validate,
            timestamp: new Date(),
            terminalCode: "pc",
            courseId: $("#courseId").val(),
            secretKey: secretKey,
            vCodes: JSON.stringify(userCodes)
        },
        success: function(data) {
            if (data.code != 200) {
                if (data.code == 301) {
                    window.location.reload()
                } else {
                    base.addCookie("loginUser", null, {
                        path: "/",
                        expires: -1
                    });
                    sps.popwinOpenTextForOutLine(false)
                }
            } else {
                var examScore = 0;
                if (!!data.data.examScore) {
                    examScore = data.data.examScore
                }
                var rightNum = 0;
                if (!!data.data.rightNum) {
                    rightNum = data.data.rightNum
                }
                var errorNum = 0;
                if (!!data.data.errorNum) {
                    errorNum = data.data.errorNum
                }
                var noAnswer = 0;
                if (!!data.data.noAnswer) {
                    noAnswer = data.data.noAnswer
                }
                $.cookie("sps.error.ids", null, {
                    expires: -1
                });
                var userAccount = base.getCookie("loginUser").userAccount;
                var paperTitle = "";
                var userTime = parseInt(sps.onlineHour * 60) + parseInt(sps.onlineMinute);
                var courseId = base.getUrlParameters().courseId;
                base.addCookie("ex_per_" + userAccount, null, {
                    path: "/sps/",
                    expires: -1
                });
                var timecur = sps.getExerciesTimecur();
                base.addCookie("captch_0_" + timecur + "_" + userAccount, null, {
                    path: "/sps/",
                    expires: -1
                });
                sessionStorage.removeItem("exerciesTimecur");
                base.addCookie("ex_res_" + userAccount, userAnswer, {
                    path: "/sps/",
                    expires: 1
                });
                window.location.href = "/sps/practice/t/practice_4_t.html?ids=" + ids + "&id=" + $("#hid").val() + "&userTime=" + userTime + "&paperName=" + paperName + "&loginUserAccount=" + userAccount + "&courseId=" + courseId + "&s=" + examScore + "&rNum=" + rightNum + "&eNum=" + errorNum + "&nNum=" + noAnswer + "&timeStr=" + data.data.timeStr + "&series=" + series
            }
        }
    })
};
sps.myCommit1(true);

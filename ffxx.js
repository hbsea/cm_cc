var answerdata;
sps.mmyyCommit1 = function(validate) {
	var ids = $("#hids").val();
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
	var jsonArray = new Array();
	var ary = ids.substring(0, ids.length - 1).split(",");
	$.each(ary, function(j, questionItem) {
		var isAns = false;
		$.each(userAnswerObj, function(index, item) {
			if (questionItem == index) {
				isAns = true;
				jsonArray.push({
					questionId: index,
					answerNo: userAnswerObj[index].replace(/;/g, "")
				})
			}
		});
		if (!isAns) {
			jsonArray.push({
				questionId: questionItem,
				answerNo: ""
			})
		}
	});
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
			myExamAnswer: JSON.stringify(jsonArray),
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
			console.log(data);
			p=data.data.paperAnswer;
			var n = CryptoJS.enc.Utf8.parse(sps.url.captch.key);
			var f = CryptoJS.enc.Utf8.parse(sps.url.captch.iv);
			var o = CryptoJS.AES.decrypt(p, n, {
				iv: f,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});
			o = o.toString(CryptoJS.enc.Utf8);
			o = o.replace(/\u0000/g, '');
			let arr = o.split(';');
			answerData = arr[arr.length - 1];
			answerdata = jQuery.parseJSON(answerData);
			var qIdlist = $("#hids").val().split(",");
			answerarr=[]
			console.log(answerdata)
			for(var i = 0; i < answerdata.length; i++) {
				answerarr.push({'questionId':qIdlist[i],"answerNo":answerdata[i].answerNo})
				}
				
			myExamAnswer = JSON.stringify(jsonArray)(answerarr)
			
		}
	})
};

sps.mmyyCommit = function() {
	var d = $("#hids").val();
	var b = false;
	var f = d.substring(0, d.length - 1).split(",");
	var c = parseInt($("#curti").text()) - 1;
	var e = f[f.length - 1];
	sps.saveLastexe(c);
	var a = sps.getCaptcha();
	sps.mmyyCommit1("");
};

sps.mmyyCommit2 = function(validate, mmyyansewr) {
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
	var my_anwser = mmyyansewr;
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
				window.location.href = "/sps/practice/t/practice_4_t.html?ids=" + ids + "&id=" + $(
						"#hid").val() + "&userTime=" + userTime + "&paperName=" + paperName +
					"&loginUserAccount=" + userAccount + "&courseId=" + courseId + "&s=" + examScore +
					"&rNum=" + rightNum + "&eNum=" + errorNum + "&nNum=" + noAnswer + "&timeStr=" + data
					.data.timeStr + "&series=" + series
			}
		}
	})
};
sps.mmyyCommit();
console.log(answerdata);

sps.mmyyCommit2("");

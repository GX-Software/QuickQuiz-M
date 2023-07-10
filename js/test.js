
var qstnList = [];
var ansList = [], userList = [], markList = [], delList = [];
var qstnIndex = 0;
var schCount = 0, mchCount = 0, jdgCount = 0;
var schMax = 0, mchMax = 0, jdgMax = 0;
var testTime = 0, testTimeSave = 0, startTest = false;

function testNightMode(tip)
{
	nightMode(tip);
	
	if (document.getElementById("test").style.display != "none") {
		showQuestion();
	}
}

function initQstnCount()
{
	nightMode(false);
	qstnList.splice(0, qstnList.length);
	
	schMax = getQstnMax("s-choise");
	mchMax = getQstnMax("m-choise");
	jdgMax = getQstnMax("judge");
	checkInput();
	
	document.getElementById("schMax").innerHTML = schMax ? ("（0-" + schMax + "）") : "（无）";
	document.getElementById("mchMax").innerHTML = mchMax ? ("（0-" + mchMax + "）") : "（无）";
	document.getElementById("jdgMax").innerHTML = jdgMax ? ("（0-" + jdgMax + "）") : "（无）";
}

function getQstnMax(typeStr)
{
	var ret = 0;
	var qstn = getXMLMain().getElementsByTagName("qstn");
	
	for (i = 0; i < qstn.length; i++) {
		var parent = qstn[i].parentNode;
		if (parent.getAttribute("type") != "group" &&
			qstn[i].getAttribute("type") == typeStr) {
			ret++;
		}
	}
	
	return ret;
}

function checkInput()
{
	var count = parseInt(document.getElementById("schCount").value);
	if (isNaN(count)) {
		count = 0;
	}
	else {
		count = Math.max(0, count);
		count = Math.min(count, schMax);
	}
	document.getElementById("schCount").value = count;
	
	count = parseInt(document.getElementById("mchCount").value);
	if (isNaN(count)) {
		count = 0;
	}
	else {
		count = Math.max(0, count);
		count = Math.min(count, mchMax);
	}
	document.getElementById("mchCount").value = count;
	
	count = parseInt(document.getElementById("jdgCount").value);
	if (isNaN(count)) {
		count = 0;
	}
	else {
		count = Math.max(0, count);
		count = Math.min(count, jdgMax);
	}
	document.getElementById("jdgCount").value = count;
	
	count = parseInt(document.getElementById("timeLimit").value);
	if (isNaN(count)) {
		count = 0;
	}
	else {
		count = Math.max(0, count);
		count = Math.min(count, 180);
	}
	document.getElementById("timeLimit").value = count;
}

function resetPage()
{
	document.getElementById("count").style.display = "";
	document.getElementById("test").style.display = "none";
	document.getElementById("pause").style.display = "none";
	document.getElementById("pausescreen").style.display = "none";
}

function makeQuiz()
{
	getQstnCount();
	
	qstnList.splice(0, qstnList.length);
	ansList.splice(0, ansList.length);
	
	var randString = document.getElementById("name").value;
	if (!randString.length) {
		Math.seed = parseInt(Math.random() * 99999999);
	}
	else {
		Math.seed = bkdrHash(randString) % 100000000;
	}
	
	var r = document.getElementById("rand").checked;
	addQuestion("s-choise", schCount, r);
	addQuestion("m-choise", mchCount, r);
	addQuestion("judge", jdgCount, false);
	testTimeSave = testTimeSave * 60;
	testTime = 0;
	
	userList.length = qstnList.length;
	delList.length = qstnList.length;
	markList.length = qstnList.length;
	for (var i = 0; i < qstnList.length; i++) {
		userList[i] = "";
		delList[i] = "";
		markList[i] = false;
	}
	
	document.getElementById("count").style.display = "none";
	document.getElementById("test").style.display = "";
	document.getElementById("pause").style.display = "";
	
	document.getElementById("doingfunc").style.display = "";
	document.getElementById("onlyfalse").style.display = "none";
	document.getElementById("onlytxt").style.display = "none";
	
	showLibraryInfo();
	
	startTest = true;
	qstnIndex = 0;
	
	document.getElementById("switch").innerHTML = "结束答题";
	showQuestion();
	enableAllChoise(true);
	showTimeLeft();
	
	document.getElementById("resolve-hr").style.display = "none";
	document.getElementById("resolve-div").style.display = "none";
	document.getElementById("resolve-p").style.display = "none";
}

function getQstnCount()
{
	schCount = parseInt(document.getElementById("schCount").value);
	mchCount = parseInt(document.getElementById("mchCount").value);
	jdgCount = parseInt(document.getElementById("jdgCount").value);
	
	testTimeSave = parseInt(document.getElementById("timeLimit").value);
}

function addQuestion(typeStr, count, r)
{
	var i, lastCount = 0;
	var qstn = getXMLMain().getElementsByTagName("qstn");
	var tmpList = [];
	var optList;
	
	for (i = 0; i < qstn.length; i++) {
		var parent = qstn[i].parentNode;
		if (parent.getAttribute("type") != "group" &&
			qstn[i].getAttribute("type") == typeStr) {
			tmpList.push(qstn[i].cloneNode(true));
			tmpList[lastCount].opt = [];
			optList = qstn[i].getElementsByTagName("opt");
			for (var j = 0; j < optList.length; ++j) {
				tmpList[lastCount].opt.push(optList[j].cloneNode(true));
			}
			if (r) {
				randomList(tmpList[lastCount].opt);
			}
			lastCount++;
		}
	}
	randomList(tmpList);
	
	count = Math.min(lastCount, count);
	for (i = 0; i < count ; i++) {
		qstnList.push(tmpList[i]);
		addAnswer(tmpList[i]);
	}
}

function addAnswer(qstn)
{
	switch(qstn.getAttribute("type"))
	{
	case "s-choise":
	case "m-choise":
		addChoiseAns(qstn);
		break;
		
	case "judge":
		if (qstn.getElementsByTagName("ans")[0].childNodes[0].nodeValue == "t") {
			ansList.push("a");
		}
		else {
			ansList.push("b");
		}
		break;
	}
}

function addChoiseAns(qstn)
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var optNode;
	var strAns = "";
	
	for (var i = 0; i < optIndex.length; i++) {
		optNode = qstn.opt[i];
		if (!optNode) {
			break;
		}
		
		if (optNode.getAttribute("ans") == "t") {
			strAns += optIndex[i];
		}
	}
	
	ansList.push(strAns);
}

function prefixInteger(num, n)
{
    return (Array(n).join(0) + num).slice(-n);
}

function showTimeLeft()
{
	if (testTimeSave > 0 && testTime > testTimeSave) {
		testTime = testTimeSave;
		switchFunc(false);
	}
	
	if (!startTest) {
		return;
	}
	else if (testTimeSave > 0) {
		var use = testTimeSave - testTime;
		
		var h = parseInt(use / 3600);
		var m = parseInt((use % 3600) / 60);
		var s = parseInt(use % 60);
	
		document.getElementById("timeLeft").innerHTML = "剩余时间：" + h + ":" + prefixInteger(m, 2) + ":" + prefixInteger(s, 2);
	}
	else {
		var h = parseInt(testTime / 3600);
		var m = parseInt((testTime % 3600) / 60);
		var s = parseInt(testTime % 60);
		
		document.getElementById("timeLeft").innerHTML = "实际用时：" + h + ":" + prefixInteger(m, 2) + ":" + prefixInteger(s, 2);
	}
	
	testTime++;
	setTimeout('showTimeLeft(false)', 1000);
}

function showLibraryInfo()
{
	document.getElementById("title").innerHTML = 
		("题库名称：" + getXMLMain().getElementsByTagName("title")[0].childNodes[0].nodeValue);
}

function showQuestionInfo()
{
	document.getElementById("qstnCount").innerHTML =
		("当前题目：" + (qstnIndex + 1) + "/" + qstnList.length);
		
	var qstn = qstnList[qstnIndex];
	var qstnType;
	
	var cust = parseInt(qstn.getAttribute("cust"));
	if (cust > 0) {
		qstnType = getXMLMain().getElementsByTagName("cust")[cust - 1].childNodes[0].nodeValue;
	}
	else {
		switch(qstn.getAttribute("type"))
		{
		case "s-choise":
			qstnType = "单选题";
			break;
			
		case "m-choise":
			qstnType = "多选题";
			break;
			
		case "judge":
			qstnType = "判断题";
			break;
		}
	}
	
	document.getElementById("qstnType").innerHTML = "题目类型：" + qstnType;
}

function showQuestion()
{
	showQuestionInfo();
	
	var qstn = qstnList[qstnIndex];
	var str = "";

	try {
		str = qstn.getElementsByTagName("desc")[0].childNodes[0].nodeValue;
		str = replaceReturn(str);
	} catch (error) {
		str = "";
	}
	document.getElementById("desc").innerHTML = str;

	if (qstn.getElementsByTagName("img").length) {
		var imglist = qstn.getElementsByTagName("img");
		var i;

		for (i = 0, str = ""; i < imglist.length; ++i) {
			if (imglist[i].getAttribute("loc") == "desc") {
				str += "<img src='";
				str += imglist[i].childNodes[0].nodeValue;
				str += "' style='max-width:90%;'/>";
			}
		}
		document.getElementById("img").style.display = "";
		document.getElementById("img").innerHTML = str;
	}
	else {
		document.getElementById("img").style.display = "none";
	}
		
	switch(qstn.getAttribute("type"))
	{
	case "s-choise":
		showSChoise(qstn);
		showUserAns("single-", "stxt-");
		break;
		
	case "m-choise":
		showMChoise(qstn);
		showUserAns("multi-", "mtxt-");
		break;
		
	case "judge":
		showJudge(qstn);
		showUserAns("single-", "stxt-");
		break;
	}
	
	document.getElementById("mark").checked = markList[qstnIndex];
	showDel(qstn);
	
	if (!startTest) {
		var resolve = qstn.getElementsByTagName("res");
		if (resolve && resolve.length) {
			var str = "";

			document.getElementById("resolve-hr").style.display = "";
			document.getElementById("resolve-div").style.display = "";
			document.getElementById("resolve-p").style.display = "none";

			try {
				str = resolve[0].childNodes[0].nodeValue;
				str = replaceReturn(str);
			} catch (error) {
				str = "";
			}
			
			if (qstn.getElementsByTagName("img").length) {
				var imglist = qstn.getElementsByTagName("img");
				var i;
				for (i = 0; i < imglist.length; ++i) {
					if (imglist[i].getAttribute("loc") == "res") {
						str += "<img src='";
						str += imglist[i].childNodes[0].nodeValue;
						str += "' style='max-width:90%;'/>";
					}
				}
			}
			document.getElementById("resolve-p").innerHTML = str;
		}
		else {
			document.getElementById("resolve-hr").style.display = "none";
			document.getElementById("resolve-div").style.display = "none";
			document.getElementById("resolve-p").style.display = "none";
		}
	}
	else {
		document.getElementById("resolve-hr").style.display = "none";
		document.getElementById("resolve-div").style.display = "none";
		document.getElementById("resolve-p").style.display = "none";
	}
}

function showPreQstn()
{
	saveCurUserAns();
	
	if (startTest || !document.getElementById("onlyfalse").checked) {
		qstnIndex--;
		if (qstnIndex < 0) {
			qstnIndex = qstnList.length - 1;
		}
	}
	else {
		for (var i = (qstnIndex + qstnList.length - 1) % qstnList.length; i != qstnIndex; i = (i + qstnList.length - 1) % qstnList.length) {
			if (ansList[i] != userList[i]) {
				qstnIndex = i;
				break;
			}
		}
	}

	showQuestion();
}

function showNextQstn()
{
	saveCurUserAns();
	
	if (startTest || !document.getElementById("onlyfalse").checked) {
		qstnIndex++;
		if (qstnIndex >= qstnList.length) {
			qstnIndex = 0;
		}
	}
	else {
		for(var i = (qstnIndex + 1) % qstnList.length; i != qstnIndex; i = (i + 1) % qstnList.length) {
			if (ansList[i] != userList[i]) {
				qstnIndex = i;
				break;
			}
		}
	}
	
	showQuestion();
}

function showSChoise(qstn)
{
	document.getElementById("single").style.display = "";
	document.getElementById("multi").style.display = "none";
	
	var i;
	var optNode, htmlNode;
	var optText;
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var max = Math.min(optIndex.length, qstn.opt.length);
	
	// 显示各选项
	for (i = 0; i < max; i++) {
		optNode = qstn.opt[i];
		optText = optNode.childNodes[0].nodeValue;
		if (!optText) {
			continue;
		}
		
		document.getElementById("single-" + optIndex[i]).style.display = "";
		
		htmlNode = document.getElementById("stxt-" + optIndex[i]);
		htmlNode.style.display = "";
		htmlNode.innerHTML = optText + "<br />";
	}
	
	// 隐藏剩余的选项
	for (; i < optIndex.length; i++) {
		document.getElementById("single-" + optIndex[i]).style.display = "none";
		document.getElementById("stxt-" + optIndex[i]).style.display = "none";
	}
}

function showMChoise(qstn)
{
	document.getElementById("single").style.display = "none";
	document.getElementById("multi").style.display = "";
	
	var i;
	var optNode, htmlNode;
	var optText;
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var max = Math.min(optIndex.length, qstn.opt.length);
	
	// 显示各选项
	for (i = 0; i < max; i++) {
		optNode = qstn.opt[i];
		optText = optNode.childNodes[0].nodeValue;
		if (!optText) {
			continue;
		}
		
		document.getElementById("multi-" + optIndex[i]).style.display = "";
		
		htmlNode = document.getElementById("mtxt-" + optIndex[i]);
		htmlNode.style.display = "";
		htmlNode.innerHTML = optText + "<br />";
	}
	
	// 隐藏剩余的选项
	for (; i < optIndex.length; i++) {
		document.getElementById("multi-" + optIndex[i]).style.display = "none";
		document.getElementById("mtxt-" + optIndex[i]).style.display = "none";
	}
}

function showJudge(qstn)
{
	document.getElementById("single").style.display = "";
	document.getElementById("multi").style.display = "none";
	
	var optNode;
	var optIndex = ["c", "d", "e", "f", "g", "h"];
	
	document.getElementById("single-a").style.display = "";
	document.getElementById("stxt-a").style.display = "";
	document.getElementById("stxt-a").innerHTML = "正确<br />";
	
	document.getElementById("single-b").style.display = "";
	document.getElementById("stxt-a").style.display = "";
	document.getElementById("stxt-b").innerHTML = "错误<br />";
	
	// 隐藏多余的选项
	for (i = 0; i < optIndex.length; i++) {
		document.getElementById("single-" + optIndex[i]).style.display = "none";
		document.getElementById("stxt-" + optIndex[i]).style.display = "none";
	}
}

function showUserAns(strNode, strText)
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	
	for (var i = 0; i < optIndex.length; i++) {
		if (userList[qstnIndex].indexOf(optIndex[i]) >= 0) {
			document.getElementById(strNode + optIndex[i]).checked = true;
		}
		else {
			document.getElementById(strNode + optIndex[i]).checked = false;
		}
		
		var node = document.getElementById(strText + optIndex[i]);
		if (!startTest) {
			if (ansList[qstnIndex].indexOf(optIndex[i]) >= 0) {
				node.style.textDecoration = "";
				node.style.color = "green";
				node.style.fontWeight = "bold";
				if (night) {
					node.innerHTML = "&#10003 " + node.innerHTML;
				}
			}
			else if (userList[qstnIndex].indexOf(optIndex[i]) >= 0) {
				node.style.textDecoration = "line-through";
				node.style.color = "red";
				node.style.fontWeight = "";
			}
			else {
				node.style.textDecoration = "";
				node.style.color = "";
				node.style.fontWeight = "";
			}
		}
		else {
			node.style.textDecoration = "";
			node.style.color = "";
			node.style.fontWeight = "";
		}
	}
}

function saveCurUserAns()
{
	if (startTest) {
		var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
		var strAns = "";
		
		var strNode;
		switch(qstnList[qstnIndex].getAttribute("type"))
		{
		case "s-choise":
		case "judge":
			strNode = "single-";
			break;
			
		case "m-choise":
			strNode = "multi-";
			break;
		}
		
		for (var i = 0; i < optIndex.length; i++) {
			if (document.getElementById(strNode + optIndex[i]).checked) {
				strAns += optIndex[i];
			}
		}
		
		userList[qstnIndex] = strAns;
	}
	
	markList[qstnIndex] = document.getElementById("mark").checked;
}

function showDel()
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var strNode;

	switch(qstnList[qstnIndex].getAttribute("type"))
	{
	case "s-choise":
	case "judge":
		strNode = "stxt-";
		break;
		
	case "m-choise":
		strNode = "mtxt-";
		break;
	}

	for (var i = 0; i < optIndex.length; i++) {
		if (delList[qstnIndex].indexOf(optIndex[i]) >= 0) {
			document.getElementById(strNode + optIndex[i]).style.textDecoration = "line-through";
		}
		else {
			document.getElementById(strNode + optIndex[i]).style.textDecoration = "";
		}
	}
}

function switchFunc(ask)
{
	if (startTest) {
		saveCurUserAns();
		
		if (ask) {
			var unDone = checkAllDone();
			if (unDone >= 0) {
				if (!confirm("您有尚未作答的题目。确认结束？")) {
					qstnIndex = unDone;
					showQuestion();
					return;
				}
			}
			else {
				if (!confirm("您确认要结束答题并开始评分吗？")) {
					return;
				}
			}
		}
			
		var currect = 0;
		for (var i = 0; i < qstnList.length; i++) {
			if (ansList[i] === userList[i]) {
				currect++;
			}
		}
		
		var percent = currect / qstnList.length * 100;
		var h = parseInt(testTime / 3600);
		var m = parseInt((testTime % 3600) / 60);
		var s = parseInt(testTime % 60);
		var t = "共" + qstnList.length + "题，答对" + currect + "题\n正确率：" + percent.toFixed(2) + "%\n用时：";
		if (h > 0) {
			t += (h + "小时");
		}
		if (m > 0) {
			t += (m + "分钟");
		}
		if (s > 0) {
			t += (s + "秒");
		}
		alert(t);
		
		document.getElementById("timeLeft").innerHTML = "用时：" + h + ":" + m + ":" + s +
			"，得分：" + currect + "/" + qstnList.length + "(" + percent.toFixed(2) + "%)";
		
		document.getElementById("switch").innerHTML = "重新开始";
		document.getElementById("doingfunc").style.display = "none";
		
		if (currect != qstnList.length) {
			document.getElementById("onlyfalse").style.display = "";
			document.getElementById("onlytxt").style.display = "";
			
			for(var i = 0; i < qstnList.length; i++) {
				if (ansList[i] != userList[i]) {
					qstnIndex = i;
					break;
				}
			}
		}
		
		startTest = false;
		showQuestion();
		enableAllChoise(false);
		document.getElementById("pause").style.display = "none";
	}
	else {
		resetPage();
	}
}

function enableAllChoise(enable)
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	
	for (var i = 0; i < optIndex.length; i++) {
		document.getElementById("single-" + optIndex[i]).disabled = enable ? null : true;
	}
	
	for (var i = 0; i < optIndex.length; i++) {
		document.getElementById("multi-" + optIndex[i]).disabled = enable ? null : true;
	}
}

function checkAllDone()
{
	for (var i = 0; i < qstnList.length; i++) {
		if (!userList[i].length) {
			return i;
		}
	}
	
	return -1;
}

function showNextUnDone()
{
	saveCurUserAns();
	
	if (!userList[qstnIndex].length) {
		return;
	}
	
	for (var i = (qstnIndex + 1) % userList.length; i != qstnIndex; i = (i + 1) % userList.length) {
		if (!userList[i].length) {
			qstnIndex = i;
			showQuestion();
			return;
		}
	}
	
	alert("您已经答完了全部题目。好好检查呀！:P");
}

function showNextMark()
{
	saveCurUserAns();
	
	for (var i = (qstnIndex + 1) % markList.length; i != qstnIndex; i = (i + 1) % markList.length) {
		if (markList[i]) {
			qstnIndex = i;
			showQuestion();
			return;
		}
	}
}

function clickLable(e, id, idx)
{
	var qstn = qstnList[qstnIndex];
	var i = delList[qstnIndex].indexOf(idx);
	var ret = true;
	
	if (!document.getElementById(id).checked && i < 0) {
		return;
	}
	
	if (i < 0) {
		delList[qstnIndex] += idx;
		document.getElementById(id).checked = false;
		if (window.event) {
			window.event.returnValue = false;
		}
		else {
			e.preventDefault();
		}
	}
	else {
		delList[qstnIndex] = delList[qstnIndex].slice(0, i) + delList[qstnIndex].slice(i + 1);
		document.getElementById(id).checked = false;
		if (window.event) {
			window.event.returnValue = false;
		}
		else {
			e.preventDefault();
		}
	}

	showDel();
}

function goToQstn()
{
	var idx = parseInt(document.getElementById("goTo").value);
	if (isNaN(idx)) {
		document.getElementById("goTo").value = "";
		return;
	}
	else {
		idx = Math.max(1, idx);
		idx = Math.min(idx, qstnList.length);
	}
	
	qstnIndex = idx - 1;
	showQuestion();
	
	document.getElementById("goTo").value = "";
}

function searchQstn()
{
	var searchTxt = document.getElementById("search").value;
	if (!searchTxt) {
		return;
	}
	
	for (i = (qstnIndex + 1) % qstnList.length; i != qstnIndex; i = (i + 1) % qstnList.length) {
		if (matchQstn(qstnList[i], searchTxt)) {
			break;
		}
	}

	if (i == qstnIndex && !matchQstn(qstnList[i], searchTxt)) {
		alert("未找到包含关键字“" + searchTxt + "”的题目");
		return;
	}

	qstnIndex = i;
	showQuestion();
}

function pause()
{
	startTest = false;
	
	document.getElementById("test").style.display = "none";
	document.getElementById("pausescreen").style.display = "";
}

function goOnTest()
{
	startTest = true;
	showTimeLeft();
	
	document.getElementById("test").style.display = "";
	document.getElementById("pausescreen").style.display = "none";
}
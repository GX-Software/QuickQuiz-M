
var page = 0;

var qstnList;
var showList = [];

var openList = [false, false, false, false, false, false, false, false, false, false];

function initSpyList()
{
	nightMode(false);
	
	qstnList = getXMLMain().getElementsByTagName("qstn");
	
	showList.splice(0, showList.length);
	showSpyList();
}

function resetOpenList()
{
	for (var i = 0; i < 10; i++) {
		openList[i] = false;
	}
}

function getQstnDesc(qstn)
{
	var str;
	try {
		str = qstn.getElementsByTagName("desc")[0].childNodes[0].nodeValue;
	} catch (error) {
		str = "";
	}

	return str;
}

function showSpyList()
{
	for (var i = 0; i < 10; i++) {
		if (page * 10 + i >= showList.length) {
			break;
		}
		
		document.getElementById("hr" + i).style.display = "";
		
		document.getElementById("h" + i).innerHTML = makeEllipsis(getQstnDesc(qstnList[showList[page * 10 + i]]), true);
		document.getElementById("h" + i).style.display = "";
		
		document.getElementById("div" + i).innerHTML = makeAnswer(qstnList[showList[page * 10 + i]]);
		document.getElementById("div" + i).style.display = "";
	}
	
	if (i < 10) {
		if (i == 0) {
			document.getElementById("hr" + i).style.display = "";
		
			if (document.getElementById("find").value.length) {
				document.getElementById("h" + i).innerHTML = "找不到任何结果！";
			}
			else {
				document.getElementById("h" + i).innerHTML = "请输入您要查找的关键字";
			}
			document.getElementById("h" + i).style.display = "";
			
			document.getElementById("div" + i).innerHTML = "";
			document.getElementById("div" + i).style.display = "none";
			
			i++;
		}
		document.getElementById("hr" + i).style.display = "";
		
		for (; i < 10; i++) {
			document.getElementById("hr" + (i + 1)).style.display = "none";
			document.getElementById("h" + i).style.display = "none"; 
			document.getElementById("div" + i).style.display = "none";
		}
	}
	else {
		document.getElementById("hr" + (i)).style.display = "";
	}
	
	var count = Math.max(1, Math.ceil(showList.length / 10));
	document.getElementById("index").innerHTML = "第" + (page + 1) + "页，共" + count + "页";
	if (count <= 1) {
		document.getElementById("jumpto").style.display = "none";
	}
	else {
		document.getElementById("jumpto").style.display = "";
	}
	
	if (page <= 0) {
		document.getElementById("pre").style.display = "none";
	}
	else {
		document.getElementById("pre").style.display = "";
	}
	
	if ((page + 1) * 10 >= showList.length) {
		document.getElementById("next").style.display = "none";
	}
	else {
		document.getElementById("next").style.display = "";
	}
	
	window.scrollTo(0, 0);
}

function makeEllipsis(str, e)
{
	if (e) {
		if (str.length <= 40) {
			return str;
		}
		
		var el = str.slice(0, 40);
		el += "...";
		return el;
	}
	else {
		return str;
	}
}

function makeAnswer(q)
{
	var ans = "";
	var optIndex = ["A", "B", "C", "D", "E", "F", "G", "H"];
	
	switch(q.getAttribute("type"))
	{
	case "s-choise":
	case "m-choise":
		{
			var opt = q.getElementsByTagName("opt");
			for (var i = 0; i < opt.length; i++) {
				if (opt[i].getAttribute("ans") == "t") {
					if (ans.length > 0) {
						ans += "<br />";
					}
					ans += "(" + optIndex[i] + ")";
					ans += opt[i].childNodes[0].nodeValue;
				}
			}
		}
		break;
		
	case "judge":
		if (q.getElementsByTagName("ans")[0].childNodes[0].nodeValue == "t") {
			ans = "正确";
		}
		else {
			ans = "错误";
		}
		break;
		
	case "blank":
		{
			var blk = q.getElementsByTagName("blk");
			for (var i = 0; i < blk.length; i++) {
				if (ans.length > 0) {
					ans += "<br />";
				}
				ans += (i + 1) + "、";
				ans += blk[i].childNodes[0].nodeValue;
			}
		}
		break;
		
	case "text":
		ans = q.getElementsByTagName("ans")[0].childNodes[0].nodeValue;
		break;
	}
	
	return ans;
}

function findString()
{
	var findStr = document.getElementById("find").value;
	if (!findStr.length) {
		if (!showList.length) {
			showSpyList();
		}
		return;
	}
	
	showList.splice(0, showList.length);
	for (var i = 0; i < qstnList.length; i++) {
		if (qstnList[i].getAttribute("type") != "group" && matchQstn(qstnList[i], findStr)) {
			showList.push(i);
		}
	}
	
	page = 0;
	resetOpenList();
	showSpyList();
}

function openClose(index)
{
	if (index >= showList.length) {
		return;
	}
	
	document.getElementById("h" + index).innerHTML = makeEllipsis(getQstnDesc(qstnList[showList[page * 10 + index]]), openList[index]);
	openList[index] = !openList[index];
}

function prePage()
{
	page--;
	if (page <= 0) {
		page = 0;
	}
	
	resetOpenList();
	showSpyList();
}

function nextPage()
{
	page++;
	if ((page + 1) * 10 >= showList.length) {
		page = Math.ceil(showList.length / 10) - 1;
	}
	
	resetOpenList();
	showSpyList();
}

function jumpPage()
{
	var pageText = document.getElementById("jumpIndex").value;
	if (!pageText || !pageText.length) {
		return;
	}
	
	page = parseInt(pageText);
	page = Math.max(1, Math.min(page, Math.ceil(showList.length / 10))) - 1;
	
	document.getElementById("jumpIndex").value = "";
	
	resetOpenList();
	showSpyList();
}

function clearFind()
{
	document.getElementById("find").value = "";
	document.getElementById("find").focus();
}
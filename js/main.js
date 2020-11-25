
var xmlList;
var fileName = "", libName = "";

function indexNightMode(tip)
{
	nightMode(tip);
	
	if (night)
	{
		document.getElementById("titleicon").src = "img/iconnight.png";
	}
	else
	{
		document.getElementById("titleicon").src = "img/icon.png";
	}
}

function initMain()
{
	indexNightMode(false);
}

function openFile()
{
	document.getElementById("curlib").innerHTML = "当前题库：未打开";
	
	var selectedFile = document.getElementById('open').files[0];
	if (!selectedFile)
	{
		alert("打开题库文件失败！");
		return;
	}
	
	fileName = selectedFile.name;

	var reader = new FileReader();
	reader.readAsText(selectedFile);
	reader.onload = function(evt)
	{
		var i = evt.target.result.indexOf("<?xml");
		if (i < 0)
		{
			alert("题库格式可能已被破坏，无法打开！");
			return;
		}
		var t = evt.target.result.substr(i);
		
		self.parent.global.xmlMain = (new DOMParser()).parseFromString(t, "text/xml");
		if (!self.parent.global.xmlMain)
		{
			alert("题库格式可能已被破坏，无法打开！");
			return;
		}
		libName = self.parent.global.xmlMain.getElementsByTagName("title")[0].childNodes[0].nodeValue;
		
		document.getElementById("curlib").innerHTML = "当前题库：" + libName;
		
		var o = document.getElementById('open');
		o.outerHTML = o.outerHTML;
	}
}

function checkOpenLib()
{
	if (getXMLMain() || libName)
	{
		if (confirm("当前已打开题库《" + libName + "》，确认打开新题库？")) {
			return;
		}
		
		if(window.event)
		{
			window.event.returnValue = false;
		}
		else
		{
			e.preventDefault();
		}
	}
}

function setBtnHref(url)
{
	if (!getXMLMain())
	{
		alert("请先打开题库");
		return;
	}
	
	location.href = url;
}

window.onpageshow = function(event)
{
	if (event.persisted)
	{
		window.location.reload();
		// 尝试解决Safari回滚后不能回到顶端的问题（不一定能解决）
		window.scrollTo(0, 0);
	}
	
	if (getXMLMain())
	{
		libName = getXMLMain().getElementsByTagName("title")[0].childNodes[0].nodeValue;
		document.getElementById("curlib").innerHTML = "当前题库：" + libName;
	}
}

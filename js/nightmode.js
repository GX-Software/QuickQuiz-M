
var styleElem = null, tipElem = null;
var fontColor = 30;
var night = false;

function nightMode(tip)
{
	// 初始化时
	if (!tip)
	{
		switch(getCookie("night"))
		{
		case "true":
			night = true;
			break;
			
		case "false":
			night = false;
			break;
			
		default:
			{
				// 初始化夜间模式
				var today = new Date();
				var month = today.getMonth(), hour = today.getHours();
				night = false;
				
				// 冬季夜间模式默认为23时至次日7时
				if (month > 10 || month < 3)
				{
					if (today.getHours() >= 23 || today.getHours() <= 6)
					{
						night = true;
					}
				}
				// 其余时段夜间模式默认为23时至次日6时
				else
				{
					if (today.getHours() >= 23 || today.getHours() <= 5)
					{
						night = true;
					}
				}
			}
		}
	}
	else
	{
		night = !night;
	}
	
	if (night)
	{
		styleElem = createCSS('body,body *', setStyle(fontColor), styleElem);
		styleElem = createCSS('hr', setHrStyle(fontColor), styleElem);
		styleElem = createCSS('input[type = "text"], input[type = "number"], input[type = "password"]', setInputStyle(fontColor), styleElem);
		
		if (tip)
		{
			showTip();
		}
		
		document.getElementById("night").innerHTML = "正常模式";
	}
	else
	{
		removeTip();
		
		try
		{
			if (styleElem)
			{
				document.getElementsByTagName("head")[0].removeChild(styleElem);
				styleElem = null;
			}
		}
		catch(err)
		{
			for (var i = styleElem.rules.length - 1; i >= 0; i--)
			{
				styleElem.removeRule(i);
			}
		}
		
		document.getElementById("night").innerHTML = "夜间模式";
	}
	
	setCookie("night", night ? "true" : "false", 12);
}

function setStyle(fontColor)
{
	var colorArr=[fontColor, fontColor, fontColor];
	return 'background-color:#000 !important;color:RGB(' + colorArr.join('%,') + '%) !important;';
}

function setHrStyle(hrColor)
{
	var colorArr=[fontColor, fontColor, fontColor];
	return 'background-color:RGB(' + colorArr.join('%,') + '%) !important;height:1px !important;border:none !important;';
}

function setInputStyle(hrColor)
{
	var colorArr=[fontColor, fontColor, fontColor];
	return 'border-color:RGB(' + colorArr.join('%,') + '%) !important;';
}

function createCSS(sel, decl, elem)
{
	var h = document.getElementsByTagName('head')[0], styleE = elem;
	if(!styleE)
	{
		// 为IE8及以下浏览器
		if (document.all)
		{
			styleE = document.createStyleSheet();
		}
		else
		{
			var s = document.createElement('style');
			s.setAttribute('type','text/css');
			styleE = h.appendChild(s);
			styleE.appendChild(document.createTextNode(""));
		}
	}

	try
	{
		styleE.addRule(sel, decl)
	}
	catch(err)
	{
		styleE.childNodes[0].nodeValue = styleE.childNodes[0].nodeValue + sel + ' {' + decl + '}';
	}
	
	return styleE;
};

function showTip()
{
	tipElem = document.createElement('div'), body = document.getElementsByTagName('body')[0];
	tipElem.innerHTML = '夜间模式开启';
	tipElem.style.cssText = 
		'background-color:#3FA9FB !important; \
		color:#fff !important; \
		font-size:14px;height:20px; line-height:20px; \
		position:fixed; left:0; top:0; text-align:center; \
		width:100%; z-index:99999;';
		
	body.appendChild(tipElem);
	setTimeout("removeTip()", 3000)
}

function removeTip()
{
	if (!tipElem)
	{
		return;
	}
	
	document.getElementsByTagName('body')[0].removeChild(tipElem)
	tipElem = null;
}
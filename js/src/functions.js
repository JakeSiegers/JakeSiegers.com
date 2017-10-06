var touchMode = false;

function addCls(el,clsToAdd){
	if(el.className.trim() === ''){
		el.className += clsToAdd;
	}else{
		el.className += " "+clsToAdd;
	}
}

function removeCls(el,clsToRemove){
	var classes = el.className.split(" ");
	var newClasses = [];
	classes.forEach(function(cls){
		if(cls !== clsToRemove){
			newClasses.push(cls);
		}
	});
	el.className = newClasses.join(" ");
}

function showTitle(){
	var title = document.getElementById('title');
	var menu = document.getElementById('menu');
	setTimeout(function() {
		title.style.transition = "opacity 0.5s ease";
		menu.style.transition = "opacity 0.5s ease";
	},0);

	setTimeout(function() {
		title.style.opacity = 1;
		menu.style.opacity = 1;
	},100);

	centerContent();
	setTimeout(function(){
		var titleWrap = document.getElementById('titleWrap');
		titleWrap.style.transition = "all 0.5s ease";
	},0);
}

function initMenu(){
	document.getElementById('emailLink').onclick = function(event){
		event.preventDefault();
		changeContent('email','purple');
	};

	document.getElementById('projectLink').onclick = function(event){
		event.preventDefault();
		changeContent('portfolio','green');
	};

	document.body.addEventListener('touchstart', function(e){
		if(!touchMode) {
			var boxes = document.getElementsByClassName('zoomBox');
			for(var i = 0;i<boxes.length;i++){
				addCls(boxes[i],'zoomBoxTouch');
			}
			touchMode = true;
		}
	}, false);

	/*
	//Hover Links
	var links = {
		'emailLink':'red',
		'projectLink':'green',
		'gitHubLink':'brown'
	};

	for(var id in links){
		document.getElementById(id).onmouseover = function(event){
			currentColorPalette = visColors[links[event.target.id]];
		};
		document.getElementById(id).onmouseout = function(){
			currentColorPalette = selectedColor;
		};
	}

	*/
}

var screenshots = {
	'mg':5,
	'mgvis':3,
	'alex':4,
	'bbqk':3,
	'puzzle':3,
	'node':3
};

var screenshotCount = 0;
function showScreenshots(event,screenshotSet){
	event.preventDefault();
	if(screenshotCount > 0){
		//already loading images!
		return;
	}
	//addCls(event.target.parent,'zoomBoxTouch');
	event.target.innerHTML = '<span style="color:#009688;">[ LOADING... ]</span>';
	//screenshotCount = screenshots[screenshotSet].length;
	var screenshotContent = document.getElementById('screenshotContent');
	var html = '<a class="projectBack" onclick="changeContent(\'portfolio\',\'green\')" >[ Back to Projects ]</a>';
	html += '<div class="contentSubTitle">Click or tap any screenshot to view full size</div>';
	//html += '<div class="masonry">';
	for(var i=1;i<=screenshots[screenshotSet];i++){
		html +='<a href="img/screenshots/'+screenshotSet+i+'.jpg" target="_blank"><img src="img/screenshots/'+screenshotSet+i+'.jpg" class="screenshot"/></a>';
		var downloadingImage = new Image();
		screenshotCount++;
		downloadingImage.onload = function(){
			screenshotCount--;
			if(screenshotCount === 0){
				changeContent('screenshot','green');
				event.target.innerHTML = '[ Screenshots ]';
			}
		};
		downloadingImage.src = 'img/screenshots/'+screenshotSet+i+'.jpg';
	}
	//html += '</div>';
	screenshotContent.innerHTML = html;
}

var contentType = null;
var contentTimeout = null;
var inTransition = false;

function changeContent(type,color){
	if(screenshotCount > 0){
		//already loading images!
		return;
	}
	if(sendingEmail){
		return;
	}
	//Don't change when currently in a transition
	if(inTransition){
		return;
	}
	//var content = document.getElementById('content');
	//console.log(contentType,content.offsetHeight);
	if(contentType === type){
		vis.setColorPalette('orange');
		closeContent();
	}else if(contentType !== null){
		closeContent(true);
        if(contentTimeout!==null){
        	clearTimeout(contentTimeout);
		}
        contentTimeout = setTimeout(function(){
			showContent(type,color);
        },500);
	} else{
		showContent(type,color)
	}
}

function closeContent(noCenter){
	inTransition = true;
	setTimeout(function(){
		inTransition = false;
	},500);
	var content = document.getElementById('content');
	if(!noCenter) {
		centerContent(-content.offsetHeight);
	}
	removeCls(content,'showContent');
	content.style.height = '0px';
	contentType = null;
}

function showContent(type,color){
	inTransition = true;
	setTimeout(function(){
		inTransition = false;
	},500);
	var content = document.getElementById('content');
	vis.setColorPalette(color);
	var newContent = document.getElementById(type + 'Content');
	content.innerHTML = newContent.innerHTML;
	centerContent(newContent.offsetHeight);
	addCls(content,'showContent');
	content.style.height = newContent.offsetHeight+'px';
	contentType = type;
}

function centerContent(buffer){

	if(contentType !== null) {
		var content = document.getElementById('content');
		var activeContent = document.getElementById(contentType + 'Content');
		content.style.height = activeContent.offsetHeight + 'px';
	}

	if(!buffer){
		buffer = 0;
	}
	var titleWrap = document.getElementById('titleWrap');

	var screenHeight = window.innerHeight;
	var newMargin = 30;
	var totalHeight = titleWrap.offsetHeight + buffer;
	if((totalHeight/2) > screenHeight/2){
		newMargin = 20;
	}else{
		newMargin = (screenHeight/2)-(totalHeight/2);
	}

	titleWrap.style.marginTop = newMargin+'px';
}

var sendingEmail = false;

function sendMessage(btn){
	if(sendingEmail){
		return;
	}
	var fields = btn.parentElement.getElementsByClassName("formField");
	var postData = [];
	for(var i = 0;i<fields.length;i++){
		postData.push(fields[i].name+'='+encodeURI(fields[i].value));
		removeCls(fields[i],'formError');
	}

	var http = new XMLHttpRequest();
	var url = "mail.php";
	var params = postData.join("&");
	http.open("POST", url, true);

	btn.style.backgroundColor = 'rgba(255,255,255,0.3)';
	btn.innerHTML = 'Sending...';
	sendingEmail = true;

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState === 4) {
			sendingEmail = false;
			var reply = {};
			try{
				reply = JSON.parse(http.responseText);
				if(reply.success === true){
					btn.parentElement.reset();
					btn.style.backgroundColor = '#81C784';
					btn.innerHTML = 'Message Sent, Thanks!';
				}else{
					for(var i in reply.fields){
						//console.log(btn.parentElement);
						var field = document.getElementsByName(reply.fields[i])[0];
						addCls(field,'formError');
						btn.innerHTML = reply.error;
					}
				}
			}catch(e){
				btn.style.backgroundColor = '#E57373';
				btn.innerHTML = 'Unknown Error, Sorry!';
			}
		}
	};

	http.send(params);
}


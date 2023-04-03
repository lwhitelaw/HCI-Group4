
function getDataObject() {
	var data = localStorage.getItem("clockdata");
	if (data === null) return {};
	return JSON.parse(data);
}

function setDataObject(obj) {
	if (obj === null) return;
	localStorage.setItem("clockdata",JSON.stringify(obj));
}

function getUIObject() {
	var data = sessionStorage.getItem("uidata");
	if (data === null) return {};
	return JSON.parse(data);
}

function setUIObject(obj) {
	if (obj === null) return;
	sessionStorage.setItem("uidata",JSON.stringify(obj));
}

/* index.html */

function injectWidgets() {
	var container = document.getElementById("widgetcontainer");
	var objdata = getDataObject();
	
	// no widgetlist, so do nothing here
	if (objdata.widgetlist === undefined) return;
	
	// process widgets
	var id = 0;
	for (widget of objdata.widgetlist) {
		if (widget.type === "recurring") {
			// recurring schedule widget
			var div = document.createElement("div");
			div.id = "widget" + id;
			div.innerHTML = generateRecurringHTML(widget,id);
			// make script
			var script = document.createElement("script");
			script.text = generateRecurringScript(widget,id);
			
			container.appendChild(div);
			container.appendChild(script);
		}
		id++;
	}
}

function injectEvents() {
	var container = document.getElementById("upcoming");
	var objdata = getDataObject();
	
	// no eventlist, so do nothing here
	if (objdata.eventlist === undefined) return;
	
	// process events
	for (event of objdata.eventlist) {
		var li = document.createElement("li");
		var str = event.name;
		if (event.extrainfo !== undefined && event.extrainfo.length > 0) {
			str += "(" + event.extrainfo + ")";
		}
		str += " - " + numToDay(event.day) + " " + event.time;
		li.innerHTML = str;
		container.appendChild(li);
	}
}

/* upcoming.html */

function injectEventsUpcoming() {
	var container = document.getElementById("upcoming");
	var objdata = getDataObject();
	
	// no eventlist, so do nothing here
	if (objdata.eventlist === undefined) return;
	
	// process events
	var index = 0;
	for (event of objdata.eventlist) {
		var li = document.createElement("li");
		var spanstr = `
			<span class="right">
				<!-- <a class="grey-gradient" href="#">Edit</a> -->
				<a id="delete${index}" bindindex=${index} class="red-gradient" href="upcoming.html">Delete</a>
			</span>
		`;
		var str = event.name;
		if (event.extrainfo !== undefined && event.extrainfo.length > 0) {
			str += "(" + event.extrainfo + ")";
		}
		str += " - " + numToDay(event.day) + " " + event.time + spanstr;
		li.innerHTML = str;
		container.appendChild(li);
		index++;
	}
	var idlength = index;
	// bind listeners
	for (var i = 0; i < idlength; i++) {
		var capture = i; // to avert a JavaScript quirk in loops
		document.getElementById("delete" + capture).addEventListener("click",() => {
			deleteItem(capture);
		});
	}
}

function numToDay(num) {
	switch (num) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";
		case 6: return "Saturday";
		default: return "Unknown";
	}
}

function dayToNum(day) {
	switch (day.toLowerCase()) {
		case "sunday": return 0;
		case "monday": return 1;
		case "tuesday": return 2;
		case "wednesday": return 3;
		case "thursday": return 4;
		case "friday": return 5;
		case "saturday": return 6;
		default: return -1;
	}
}

/* Recurring schedule */

function generateRecurringHTML(widget,id) {
	return `
		<p id="widget${id}"></p>
	`;
}

function generateRecurringScript(widget,id) {
	return `
		function widget${id}init() {
			function widget${id}run() {
				var elem = document.getElementById("widget${id}");
				var str = "${widget.name} - ";
				elem.innerHTML = "${widget.name} - ${widget.time}";
			}
			setInterval(widget${id}run, 1000);
		}
		setTimeout(widget${id}init);
	`;
}

/* end recurring schedule */

function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if(hh === 0) {
      hh = 12;
  }
  if(hh > 12){
      hh = hh - 12;
      session = "PM";
   }

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
   ss = (ss < 10) ? "0" + ss : ss;
    
   let time = hh + ":" + mm + ":" + ss + " " + session;

   document.getElementById("digitalClock").innerText = time; 
   let t = setTimeout(function(){ currentTime() }, 1000);
}

function currentDate(){
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var months = [ "January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December" ];
	
	if(day<10){day='0'+day} if(month<10){month='0'+month}
	
	month = months[month - 1];
	
	
	today = month + ', '+ day;
	
	
	document.getElementById("todayDate").innerText = today;
}

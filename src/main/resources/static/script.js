
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

/* Injection of new clock */
function injectClocks() {
	var container = document.getElementById("Clockcontainer");
	var objdata = getDataObject();
	
	//if no clock do nothing
	if (objdata.clocklist === undefined) return;
	
	//process clock
	var id = 0;
	for (clock of objdata.clocklist) {
		if (clock.type === "newClock") {
			//create clock
			var td = document.createElement("td");
			td.id = "clock" + id;
			td.innerHTML = generateRecurringClock(clock, id);
			//make script
			var script = document.createElement("script");
			script.text = generateRecurringClockScript(clock, id);
			
			container.appendChild(td);
			container.appendChild(script);
			
			
		}
		id++;
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

/* injection of clock fucntions */
function generateRecurringClock(clock, id) {
	
	return `
		<h3 class="clock${id}Label" id = "clock${id}Label" style="position: relative;left:15%;padding-bottom:10pt;">${clock.name}</h3>
		<div id="clock${id}" class="analogClock">
				<div class="outer-clock-face">
				<div class="marking marking-one"></div>
				<div class="marking marking-two"></div>
				<div class="marking marking-three"></div>
				<div class="marking marking-four"></div>
				<div class="inner-clock-face">
				<div id="clock${id}HHand" class="hand hour-hand"></div>
				<div id="clock${id}MHand" class="hand min-hand"></div>
				<div id="clock${id}SHand" class="hand second-hand"></div>
       					</div>
       					</div>
       					</div>
		<div id="clock${id}digitalClock" class="digitalClockWidget" style="position: relative;left:20%;"></div>
	`;
	
}

function generateRecurringClockScript(clock, id){
	return `
		function clock${id}init() {  
			const secondHand = document.getElementById('clock${id}SHand');
			const minsHand = document.getElementById('clock${id}MHand');
			const hourHand = document.getElementById('clock${id}HHand');
			const timeZoneValue = ${clock.timeZoneValue};
	
			function clock${id}setDate() {
	 			const now = new Date();
	
	  			const seconds = now.getUTCSeconds();
	  			const secondsDegrees = ((seconds / 60) * 360) + 90;
	  			secondHand.style.transform = "rotate(" + secondsDegrees + "deg)";
	 
	  			const mins = now.getUTCMinutes();
	  			const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
	  			minsHand.style.transform = "rotate(" + minsDegrees + "deg)";
	 			
	  			now.getUTCHours();
	  		 	now.setUTCHours(timeZoneValue);
	  			const hour = now.getUTCHours();
	  			const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
	  			hourHand.style.transform = "rotate("+ hourDegrees + "deg)";
				}
			function clock${id}Time() {
			  let date = new Date();
			  let timeZoneValue = ${clock.timeZoneValue};
			  date.getUTCHours();
			  date.setUTCHours(timeZoneValue);
			  let hh = date.getUTCHours();
			  let mm = date.getUTCMinutes();
			  let ss = date.getUTCSeconds();
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
			
			   document.getElementById("clock${id}digitalClock").innerText = time; 
			   let t = setTimeout(function(){ clock${id}Time() }, 1000);
			}	
				
				
			clock${id}setDate();
			setInterval(clock${id}setDate, 1000);
			clock${id}Time();
		}
		setTimeout(clock${id}init);
	`;
	
}
/* end of clock injection functions */

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
				// tricky shunting the obj through JSON
				var pri = JSON.parse("${JSON.stringify(widget).replaceAll('"','\\"')}");
				if (isScheduleToday(pri)) {
					str += "Today ";
				} else {
					if (pri.sunday) str += "Sunday ";
					if (pri.monday) str += "Monday ";
					if (pri.tuesday) str += "Tuesday ";
					if (pri.wednesday) str += "Wednesday ";
					if (pri.thursday) str += "Thursday ";
					if (pri.friday) str += "Friday ";
					if (pri.saturday) str += "Saturday ";
				}
				elem.innerHTML = str + "${widget.time}";
			}
			setInterval(widget${id}run, 1000);
		}
		setTimeout(widget${id}init);
	`;
}

function isScheduleToday(widget) {
	var now = new Date();
	if (widget.sunday && now.getDay() === 0) return true;
	if (widget.monday && now.getDay() === 1) return true;
	if (widget.tuesday && now.getDay() === 2) return true;
	if (widget.wednesday && now.getDay() === 3) return true;
	if (widget.thursday && now.getDay() === 4) return true;
	if (widget.friday && now.getDay() === 5) return true;
	if (widget.saturday && now.getDay() === 6) return true;
	return false;
}
/* end recurring schedule */

/* main page clock functions */
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
/* main page clock functions */

/* add clock functions */
function currentTimeWidget() {
  let date = new Date();
  let timeZoneValue = document.getElementById("timeZoneSelected").value;
  date.getUTCHours();
  date.setUTCHours(timeZoneValue);
  let hh = date.getUTCHours();
  let mm = date.getUTCMinutes();
  let ss = date.getUTCSeconds();
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

   document.getElementById("digitalClockWidget").innerText = time; 
   let t = setTimeout(function(){ currentTimeWidget() }, 1000);
}
/* AddClock Functions end */

/* Add New Event to Upcoming functions */
function generateRecurringEventHTML(eventitem, id){
	return `
	<li id="eventitem${id}li"></li>	
	`;
}

function generateRecurringEventScript(eventitem, id) {
	return `
		function eventitem${id}init() {
			function eventitem${id}run() {
				var elem = document.getElementById("eventitem${id}li");
				var str = "${eventitem.eventday} - ${eventitem.name} - ";
				elem.innerHTML = "${eventitem.eventday} - ${eventitem.name} - ${eventitem.time}";
			}
			setInterval(eventitem${id}run, 1000);
		}
		setTimeout(eventitem${id}init);
	`;
}
/* end of Add New Event to Upcoming */




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

function generateRecurringClock(clock, id) {
	
	return `
		<h3 class="clock${id}Label" id = "clock${id}Label" style="position: relative;left:20%;">${clock.name}</h3>
		<div id="clock${id}" class="analogClock">
				<div class="outer-clock-face">
				<div class="marking marking-one"></div>
				<div class="marking marking-two"></div>
				<div class="marking marking-three"></div>
				<div class="marking marking-four"></div>
				<div class="inner-clock-face">
				<div class="clock${id}hand hour-hand" style="width: 30%;z-index: 3;"></div>
				<div class="clock${id}hand min-hand" style="height: 3px;z-index: 10;width: 40%;"></div>
				<div class="clock${id}hand second-hand" style="background: #ee791a;width: 45%;height: 2px;"></div>
       					</div>
       					</div>
       					</div>
		<div id="clock${id}digitalClock" class="digitalClockWidget" style="position: relative;left:20%;"></div>
	`;
	
}


function generateRecurringClockScript(clock, id){
	return `
		function clock${id}init() {  
			const secondHand = document.querySelector('clock${id}hand.second-hand');
			const minsHand = document.querySelector('clock${id}hand.min-hand');
			const hourHand = document.querySelector('div.clock${id}hand.hour-hand');
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
			setTimeout(clock${id}init);
		}
	`;
	
}
/* end of injection */

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

/* AddClock Functions */





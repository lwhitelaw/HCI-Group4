
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

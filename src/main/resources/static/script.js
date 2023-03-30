
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
<<<<<<< Updated upstream
}
=======
}

function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if(hh === 0){
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

  document.getElementById("clock").innerText = time; 
  let t = setTimeout(function(){ currentTime() }, 1000);
}

function currentDate(){
	var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}

mm = months[mm - 1];


today = mm + ', '+ dd;


document.getElementById("date").innerText = today;
}

currentDate();
currentTime();

setTimeout(init);
>>>>>>> Stashed changes

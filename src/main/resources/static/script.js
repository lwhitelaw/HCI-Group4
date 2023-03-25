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
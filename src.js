// Changes XML to JSON
function xmlToJson(xml) {
    
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

function parseXml(xml) {
var dom = null;
if (window.DOMParser) {
    try { 
        dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
    } 
    catch (e) { dom = null; }
}
else if (window.ActiveXObject) {
    try {
        dom = new ActiveXObject('Microsoft.XMLDOM');
        dom.async = false;
        if (!dom.loadXML(xml)) // parse error ..

            window.alert(dom.parseError.reason + dom.parseError.srcText);
    } 
    catch (e) { dom = null; }
}
else
    alert("cannot parse xml string!");
return dom;
}

function addZero(i) {
    if (i < 10) {i = "0" + i}
        return i;
}

function tConvert (time) {
// Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
}

async function call(){
    //let response = await fetch('https://api.translink.ca/rttiapi/v1/stops/61112/estimates?apikey=8dBFRSNBr4HQDO6mi9Ee&count=1');
    let response = await fetch('https://api.translink.ca/rttiapi/v1/stops/61112/estimates?apikey=8dBFRSNBr4HQDO6mi9Ee&count=1', {
        headers: {
            'content-type': "application/JSON"
            }
        }
    );
    let json = await response.json();
    /*
    let data = await response.text();

    //let test = parseXml(data);
    let json_data =  parseXml(data);
    let json = JSON.parse(JSON.stringify(xmlToJson(json_data)));
    */
    const time = (json["NextBuses"]["NextBus"]["Schedules"]["Schedule"]["ExpectedLeaveTime"]["#text"]).split(" ")[0];
    const countdown = (json["NextBuses"]["NextBus"]["Schedules"]["Schedule"]["ExpectedCountdown"]["#text"]).split(" ")[0];
    const updated_time = new Date();
    var tdisplay = document.getElementById('time_display').textContent = "Scheduled Departure: " + time;
    var cdisplay = document.getElementById('countdown_display').textContent = "In " + countdown + " Minute(s)";
    var udisplay = document.getElementById('updated_display').textContent = "Last Updated: " + tConvert(addZero(updated_time.getHours()) + ":" + addZero(updated_time.getMinutes()) + ":" + addZero(updated_time.getSeconds()));
}

function toggle(){
    var s = document.getElementById('switch').checked;
    if (s == true){
        var body = document.getElementById('body').style.backgroundColor = "#333333"; 
        var title = document.getElementById('title').style.color = "#ffffff";
        localStorage.setItem("theme", "dark");
    } else {
        var body = document.getElementById('body').style.backgroundColor = "#eaeaea"; 
        var title = document.getElementById('title').style.color = "#000000";
        localStorage.setItem("theme", "light");
    }
}

function settheme() {
    var theme = localStorage.getItem('theme');
    var button = document.getElementById('switch');
    if (theme == "light"){
        console.log('light')
        //console.log(button.checked);
        //var body = document.getElementById('body').style.backgroundColor = "#eaeaea"; 
        //var title = document.getElementById('title').style.color = "#000000";
    } else {
        console.log('dark')
        //var body = document.getElementById('body').style.backgroundColor = "#333333"; 
        //var title = document.getElementById('title').style.color = "#ffffff";
    }
}

settheme();

window.onload = call;



/*
To be added
-provide input fields to specify which bus and which stop number
-store user data to keep track if user wants light/dark theme (localstorage)
*/

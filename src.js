var lasttime = new Date();
var stop = '61112';
var route = '33';
var stop_objects = []
var route_nums = []

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
    console.log(stop);
    let response = await fetch('https://api.translink.ca/rttiapi/v1/stops/'+stop+'/estimates?apikey=8dBFRSNBr4HQDO6mi9Ee&count=1&routeNo='+route);

    
    
    let data = await response.text();

    let test = parseXml(data);
    let json_data =  parseXml(data);
    let json = JSON.parse(JSON.stringify(xmlToJson(json_data)));

    console.log(json);
    
    var tdisplay = document.getElementById('time_display')
    var cdisplay = document.getElementById('countdown_display')
    
    lasttime = new Date();
    
    try {
        
        const time = (json["NextBuses"]["NextBus"]["Schedules"]["Schedule"]["ExpectedLeaveTime"]["#text"]).split(" ")[0];
        const countdown = (json["NextBuses"]["NextBus"]["Schedules"]["Schedule"]["ExpectedCountdown"]["#text"]).split(" ")[0];

        tdisplay.textContent = "Scheduled Departure: " + time;
        cdisplay.textContent = "In " + countdown + " Minute(s)";
    }
    catch(err) {
        console.log(err);
        tdisplay.textContent = "No Bus Scheduled";
        cdisplay.textContent = "N/A";
    }
}

function updatetime(){
    const updated_time = new Date();
    //var udisplay = document.getElementById('updated_display').textContent = "Last Updated: " + tConvert(addZero(updated_time.getHours()) + ":" + addZero(updated_time.getMinutes()) + ":" + addZero(updated_time.getSeconds()));
    var lastupdated = (30 - (Math.floor((updated_time-lasttime)/1000)));
    var udispalay = document.getElementById('updated_display').textContent = "Updating In "+ lastupdated.toString() + " Second(s)";
}

function toggle(){
    var s = document.getElementById('switch').checked;
    if (s == true){
        document.getElementById('body').style.backgroundColor = "#333333"; 
        document.getElementById('title').style.color = "#ffffff";
        document.getElementById('stops_display').style.color = "#ffffff";
        document.getElementById('moon').src = "moon3.png";
        document.getElementById('stop#').style.color = "#ffffff";
        document.getElementById('route#').style.color = "#ffffff";
        document.getElementById('footer').style.color = "#ffffff";
        document.getElementById('openapilink').style.color = "#ffffff";
        document.getElementById('github_icon').style.backgroundColor = "#ffffff";

        localStorage.setItem("theme", "dark");
    } else {
        document.getElementById('body').style.backgroundColor = "#eaeaea"; 
        document.getElementById('title').style.color = "#000000";
        document.getElementById('stops_display').style.color = "#000000";
        document.getElementById('moon').src = "moon2.png";
        document.getElementById('stop#').style.color = "#000000";
        document.getElementById('route#').style.color = "#000000";
        document.getElementById('footer').style.color = "#000000";
        document.getElementById('openapilink').style.color = "#000000";
        document.getElementById('github_icon').style.backgroundColor = "#000000";

        localStorage.setItem("theme", "light");
    }
}

function resetstyles(){
    var body = document.getElementById('body').style.transition = "background-color 0.5s";
    var sw = document.getElementById('switch').style.transition = ".4s";
    const links = document.querySelector("input");

    for (let i = 0; i < links.length; i++){
        const link = links[i];

        document.documentElement.style.setProperty('--tran', '0.4s');
    }
    var sw_before = document.getElementById('switch').style.setProperty('--tran', "0.4s");
}

function settheme() {
    var body = document.getElementById('body');
    var title = document.getElementById('title');
    var title2 = document.getElementById('stops_display');

    var theme = localStorage.getItem('theme');
    if (theme == "light"){
        body.style.backgroundColor = "#eaeaea"; 
        title.style.color = "#000000";
        title2.style.color = "#000000";
        //please fix this
        document.getElementById('moon').src = "moon2.png";
        document.getElementById('stop#').style.color = "#000000";
        document.getElementById('route#').style.color = "#000000";
        document.getElementById('footer').style.color = "#000000";
        document.getElementById('openapilink').style.color = "#000000";
        document.getElementById('github_icon').style.backgroundColor = "#000000";

    } else {
        body.style.backgroundColor = "#333333"; 
        title.style.color = "#ffffff";
        title2.style.color = "#ffffff";
        document.getElementById('moon').src = "moon3.png";
        document.getElementById('stop#').style.color = "#ffffff";
        document.getElementById('route#').style.color = "#ffffff";
        document.getElementById('footer').style.color = "#ffffff";
        document.getElementById('openapilink').style.color = "#ffffff";
        document.getElementById('github_icon').style.backgroundColor = "#ffffff";
        document.getElementById('stop#').color = "#ffffff";
        document.getElementById('route#').color = "#ffffff";
        var button = document.getElementById('switch');
        button.checked = !button.checked;
        setTimeout(resetstyles, 1000);

        var stop_list = document.getElementById('stops').style.opacity = 0;
        var stop_list = document.getElementById('routes').style.opacity = 0;

        //body.style.transition = "background-color 0.5s";
        //.4s
    }
}

function getlocation(){
    navigator.geolocation.getCurrentPosition(showPosition, error, geoOptions);
}

async function showPosition(position){
    var distance = document.getElementById('distance').value * 100;
    console.log(distance);
    var lat = position["coords"]["latitude"];
    lat = Number.parseFloat(lat).toFixed(6);
    
    var lon = position["coords"]["longitude"];
    lon = Number.parseFloat(lon).toFixed(6);
    
    let response = await fetch('https://api.translink.ca/rttiapi/v1/stops?apikey=8dBFRSNBr4HQDO6mi9Ee&lat='+lat+'&long='+lon+'&radius='+distance);
    let data = await response.text();

    let test = parseXml(data);
    let json_data =  parseXml(data);
    let json = JSON.parse(JSON.stringify(xmlToJson(json_data)));

    try {
        json = json["Stops"]["Stop"];
    } catch(err){
        alert('No Stops In A Radius of '+distance+'m');
    }
    
    
    var list = document.getElementById('stops');

    list.innerHTML = "";

    document.getElementById('stops_display').style.opacity = 1;

    for (let i = 0; i<Object.keys(json).length; i++){
        var entry = document.createElement('button');
        var information = {
            atstreet: json[i]["AtStreet"]["#text"], 
            distance: json[i]["Distance"]["#text"], 
            city: json[i]["City"]["#text"], 
            name: json[i]["Name"]["#text"], 
            direction: json[i]["Name"]["#text"].slice(0, 2),
            onstreet: json[i]["OnStreet"]["#text"], 
            routes: json[i]["Routes"]["#text"], 
            stopno: json[i]["StopNo"]["#text"]
        }
        stop_objects.push(information);
        var text = information["direction"]+ " " + information["onstreet"] + " at " + information["atstreet"] + "\n" + "Stop # "+information["stopno"] + "\n" + "Distance: " + information["distance"]+"m";
        entry.appendChild(document.createTextNode(text));
        
        entry.id = i;
        entry.className = 'stops';
        list.appendChild(entry);
        list.style.opacity = 1;
    }

    var queries  = document.querySelectorAll('.stops');

    for (let i = 0; i < queries.length; i++){
        queries[i].addEventListener('click', loadroutes);
        setTimeout(() => {queries[i].style.opacity = 1; window.scrollTo(0, document.body.scrollHeight); }, i*10);
    }
}

async function loadroutes(event){
    document.getElementById('routes').scrollIntoView({block: 'center', inline: 'center'});
    var routes = document.getElementById('routes');
    var route_numbers = stop_objects[event.target.id]["routes"];
    document.getElementById('input').value = stop_objects[event.target.id]["stopno"];
    route_numbers = route_numbers.split(", ");
    route_nums = route_numbers;
    var list = document.getElementById('routes');
    list.style.opacity = 1;
    list.innerHTML = "";

    for (i = 0; i<route_numbers.length; i++){
        var entry = document.createElement('button');

        let response = await fetch('https://api.translink.ca/rttiapi/v1/routes/'+route_numbers[i]+'?apikey=8dBFRSNBr4HQDO6mi9Ee');
        let data = await response.text();

        let test = parseXml(data);
        let json_data =  parseXml(data);
        let json = JSON.parse(JSON.stringify(xmlToJson(json_data)));

        var text = json["Route"]["RouteNo"]["#text"] + " " + json["Route"]["Name"]["#text"];

        entry.appendChild(document.createTextNode(text));

        entry.id = i;

        entry.className = 'routes';

        list.appendChild(entry);

    }

    var queries  = document.querySelectorAll('.routes');

    for (let i = 0; i < queries.length; i++){
        queries[i].addEventListener('click', changeroute);
    }
}

function changeroute(event) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var input = document.getElementById('input2').value = route_nums[event.target.id];
}

function error(){
    alert('Could Not Retrieve Location.')
}

const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
}

function get_bus(){
    stop = document.getElementById('input').value;
    route = document.getElementById('input2').value;
    call();
}

window.addEventListener("load", call);
window.addEventListener("load", updatetime);
window.addEventListener("load", settheme);
//window.onload = call;
//window.onload = updatetime;

var interval = window.setInterval(call, 30000); //automatically update every 30 seconds
var update_interval = window.setInterval(updatetime, 1000);



/*
To be added
-provide input fields to specify which bus and which stop number
-troubleshoot inaccurate location data
-add distance option for filtering bus stops nearby
-make slider filter by distance automatically without pressing search again
*/

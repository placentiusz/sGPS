var returnHTML="GPS not ready!w";
var id;
var lastCrd;
var tripDistance = 0;
var lock = navigator.requestWakeLock('screen');
var posDIV = document.getElementById("pos");
var speedDIV = document.getElementById("speed");
var messageDIV = document.getElementById("message");
var distanceDIV = document.getElementById("distance");

var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
		
	/* main function */
	function findDistance(cor1,cor2) {
		var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km;
		
		// get values for lat1, lon1, lat2, and lon2
        //t1 = frm.lat1.value;
        t1 = cor1.latitude;
        //n1 = frm.lon1.value;
        n1 = cor1.longitude;
        //t2 = frm.lat2.value;
        t2 = cor2.latitude;
		//n2 = frm.lon2.value;
        n2 = cor2.longitude;
        
		// convert coordinates to radians
		lat1 = deg2rad(t1);
		lon1 = deg2rad(n1);
		lat2 = deg2rad(t2);
		lon2 = deg2rad(n2);
		
		// find the differences between the coordinates
		dlat = lat2 - lat1;
		dlon = lon2 - lon1;
		
		// here's the heavy lifting
		a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
		c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
		dm = c * Rm; // great circle distance in miles
		dk = c * Rk; // great circle distance in km
		
		// round the results down to the nearest 1/1000
		mi = round(dm);
		km = round(dk);
		
		// display the result
		// frm.mi.value = mi;
        //frm.km.value = km;
        return km;
	}
	
	
	// convert degrees to radians
	function deg2rad(deg) {
		rad = deg * Math.PI/180; // radians = degrees * pi/180
		return rad;
	}
	
	
	// round to the nearest 1/1000
	function round(x) {
		return Math.round( x * 1000) / 1000;
	}
	


window.addEventListener("load", function() {
  console.log("My GPS  load wakelock");
});
var options = {
  enableHighAccuracy: false ,
  timeout: 5000,
  maximumAge: 0
};
function roundToTwo(num) {    
  return +(Math.round(num + "e+2")  + "e-2");
}

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  console.log(`Speed: ${crd.speed} meters per sec.`);
  speedDIV.innerText = `Speed: ${ roundToTwo(crd.speed * 3.6)} km/h.`;
  posDIV.innerText = `${crd.latitude} ${crd.longitude}`;
  messageDIV.innerText = 'Get GPS fix';
  
  if( lastCrd != null) {
    if( crd.speed >0 ) tripDistance = tripDistance + findDistance(crd,lastCrd);
    distanceDIV.innerText = `Distance: ${tripDistance} km`;
  }

  lastCrd = pos.coords;
  console.log(`Cor: ${lastCrd.latitude}`);
  
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  messageDIV.innerText =  err.message;
}

id = navigator.geolocation.watchPosition(success, error, options);

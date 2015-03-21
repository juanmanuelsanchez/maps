    var map;
	//var lat;
	//var lon;
	var cityStr;

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
	

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // gets the values of the input tags to do the searchs in NYT and Wikipedia
    var streetStr= $('#street').val();
	    cityStr= $('#city').val();
	var address= streetStr + ',' + cityStr;
    $greeting.text("So you want to live at " + address + " ?");
	
   // load a streetview of the choosen city from google maps streetview api
	//var streetView= 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
	//$body.append('<img class="bgimg" src="' + streetView + '" >');
	
   //load a mapview of the chossen city from google maps api
  /* function initialize() {
	         //lat = placeData.geometry.cityStr.lat();  
             //lon = placeData.geometry.cityStr.lng();  
	var mapOptions= {
	   zoom:8,
	   center: new google.maps.LatLng(-34.397, 150.644)
	};
	map= new google.maps.Map(document.getElementById('mapDiv'), mapOptions);
	   
   }*/
	
	
 var nyTimesUrl= 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +cityStr+ '&sort=newest&api-key=f0331a394e4a5cd0ad8270cfcf7332a7:14:70756973';
 
var wikipediaUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search=' +cityStr+ '&format=json&callback=wikiCallback';
 //var wikipediaUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search=' +cityStr+ '&format=json&callback=wikiCallback';
 	 
  
  // load nyTimes articles from de NYTimes API and chains a error method in case of loading failure
$.getJSON( nyTimesUrl, function( data ) {
	$nytElem.text('New York Times articles about: ' + cityStr);
var articles= data.response.docs;
for (var i=0; i< articles.length; i++) {
	
	var article= articles[i];
	$nytElem.append('<li class= "article">' + '<a href= "'+ article.web_url+ '">' +article.headline.main+ '</a>' +
	'<p>' + article.snippet + ' </p> ' + '</li>');
  };
}).error(function(e){ 
	
	$nytHeaderElem.text("New York articles Could not be loaded");
	})


     // JSONP error handling (there's no a specific error handling for JSONP in JQuery) with setTimeout
	 var wikiRequestTimeout= setTimeout(function() {
		 $wikiElem.text("failed to get wikipedia resources");
	 }, 8000);
	 
	 
    // load wikipedia data 
	$.ajax({
		url: wikipediaUrl,
		dataType:"jsonp",
		success: function(response){
		
		
			var articles=response[1];
			for(var j=0 ; j<articles.length; j++){
				var article= articles[j];
				var url= 'http://en.wikipedia.org/wiki/' + article;
				$wikiElem.append('<li><a href= "'+ url + '">' + article + '</a></li>');
			};
			
			clearTimeout(wikiRequestTimeout); //Clears setTimeout function in case of successful request
		}
	});
	
	
	
	
	
	
	console.log(cityStr);
    return false; // we cancel the submit action by calling .preventDefault() on the event object
	              // or by returning false from our handler, which is the case.
    
	
};

function initialize() {
	         
	var mapOptions= {
	   zoom:8,
	   center: new google.maps.LatLng(-34.397, 150.644)
	};
	map= new google.maps.Map(document.getElementById('mapDiv'), mapOptions);
	   
   };

//google.maps.event.addDomListener(window, 'load', initialize);
$('#form-container').submit(loadData);///It's (loadData) and not, because it's a parameter
                                     // that we have to pass to prevent the default "submit form" behaviour
$('#form-container').submit(initialize);
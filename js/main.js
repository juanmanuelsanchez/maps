
  (function() {

    var foursquareplaces=[];

  	var model= {

      currentCity:null,
      currentStreet:null,
      currentAddress:null,
      foursquarePlaces:[],
      locations:[],
      

  	};

  	var octopus= {

          init: function(){

          	view.init();
          
         },

         setCurrentCity: function(city) {
    
           model.currentCity= city;
        },

        setCurrentStreet: function(street) {
    
           model.currentStreet= street;
        },

        setCurrentAddress: function(address) {
    
           model.currentAddress= address;
        },

        setCurrentLocations: function() {

          for (var i=0; i<arguments.length; i++) {
          model.locations.push(arguments[i]);
          }
        },

        setCurrentFoursquarePlaces: function(places) {
         
          
           
        }, 

        getCurrentCity: function() {

          return model.currentCity;
        },

        getCurrentStreet: function() {

          return model.currentStreet;
        },

        getCurrentAddress: function() {

          return model.currentAddress;
        },

        getCurrentLocation: function() {

          return model.locations;
        },

        getCurrentFoursquarePlaces: function() {
         
          return model.foursquarePlaces;
        
        },

  	};


  	var view= {


  		init:function(){

          $('#form-container').submit(this.render);

  		},

        render:function(){

        var $body= $('body');
    		var $wikiElem= $('#wikipedia-links');
    		var $nytHeaderElem= $('#nytimes-header');
    		var $nytElem= $('#nytimes-articles');
        var $foursquareElem= $('#foursquare-places');
    		var $greeting= $('#greeting');
    		    $wikiElem.text("");
            $nytElem.text("");
            $foursquareElem.text("");
        this.shopStr= $('#shop').val();
    		this.streetStr= $('#street').val();
	      this.cityStr= $('#city').val();
	      this.address= this.streetStr + ',' + this.cityStr;
        this.location= this.shopStr + ',' + this.address;
        $greeting.text("So you want to live at " + this.address + " ? ");
        console.log(this.address);
        console.log(this.location);

        octopus.setCurrentStreet(this.streetStr);
        octopus.setCurrentCity(this.cityStr);
        octopus.setCurrentAddress(this.address);
        octopus.setCurrentLocations(this.location);


        var clientID='WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5';
        var clientSecret='RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2';
        var nyTimesUrl='http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +this.cityStr+ '&sort=newest&api-key=f0331a394e4a5cd0ad8270cfcf7332a7:14:70756973';
 
        var wikipediaUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search=' +this.cityStr+ '&format=json&callback=wikiCallback';
        //var foursquareUrl='https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&&client_id=' + clientID+ '&client_secret=' + clientSecret + '&v=20130815&query=sushi';
        //var foursquareUrl='https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&&client_id=WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5&client_secret=RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2&v=20130815&query=sushi';
        //var foursquareUrl='https://api.foursquare.com/v2/venues/explore?near=' +this.cityStr+ '&&client_id=WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5&client_secret=RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2&v=20130815&query=sushi';
        var foursquareUrl='https://api.foursquare.com/v2/venues/explore?near=' +this.cityStr+ '&&client_id=' +clientID+ '&client_secret=' +clientSecret+ '&v=20130815&query=sushi';
        
        
            //Ajax request for nyTimes
            $.getJSON( nyTimesUrl, function( data ) {
	           $nytElem.text('New York Times articles about: ' + this.cityStr);
               var articles= data.response.docs;
               for (var i=0; i< articles.length; i++) {
	
	            var article= articles[i];
	            $nytElem.append('<li class= "article">' + '<a href= "'+ article.web_url+ '">' +article.headline.main+ '</a>' +'<p>' + article.snippet + ' </p> ' + '</li>');
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

          //Ajax request for Foursquare:
          $.getJSON(foursquareUrl, function(data) {
            var city=octopus.getCurrentCity();
             $foursquareElem.text('Foursquare places in:' + city);
               var places= data.response.groups[0].items;
               
               //console.log(places);
            
              for (var i=0; i< places.length; i++) {
  
              var place= places[i];
              var name= place.venue.name;
              var address=place.venue.location.address;
              var location= name + ',' + address + ',' + city;
              octopus.setCurrentLocations(location);
             $foursquareElem.append('<li class= "article">' + place.venue.name + '</li>');

              model.foursquarePlaces.push({
                    
                    name: name,
                    address: address,
                    ubication: name + ',' + address + ',' + city

                });

              //foursquareplaces.push(location);
               
              };
             
             
              
              
             }).error(function(e){ 
  
             $foursquareElem.text("New York articles Could not be loaded");
          });
            

         //view.renderMap();
           view.renderGeocode();

	        //console.log(this.cityStr);
            return false;
    	},

      renderMap: function() {
          var map;
          var locations;
          var latlng= new google.maps.LatLng(40.748817, -73.985428);
          var mapOptions= {

            zoom: 8,
            center:latlng
          }

           map= new google.maps.Map(document.getElementById('mapDiv'), mapOptions);

  
        var address= octopus.getCurrentCity();
        var geocoder= new google.maps.Geocoder();
        geocoder.geocode({'address':address}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
              
              map.setCenter(results[0].geometry.location);
              var marker= new google.maps.Marker({
                  
                  map: map,
                  position: results[0].geometry.location

              });
            }else{

              alert('Geocode was not successfull fot the following reason: ' + status);
            }
      



        });


      },

      renderGeocode: function() {
          var map;     
          var mapOptions = {
          disableDefaultUI: false

          };
   
          map = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);

         

         function locationFinder() {
           //var sushiRestaurants= octopus.getCurrentFoursquarePlaces();
           //console.log(sushiRestaurants);

           //var i=0;
           var j=0;
           var locationsData= octopus.getCurrentLocation();
           //console.log(locationsData);
           //var locationsData2= octopus.getCurrentFoursquarePlaces();
           //console.log(locationsData2);
          // var length= locationsData2.length;
          var locations=[];
         

           
           /*for (j; j<locationsData.length; j++){

               var inputLocation= locationsData[j];
               locations.push(inputLocation);
                 
           }*/
        
      
           /*for (i=0; i<length; i++) {
               
          
               var location= locationsData2[i];
               var placesLocations= location.ubication;
               
               locations.push(placesLocations);
         }*/

           /*for(var item in locationsData){

              var ubicacion= locationsData[item].ubication;
              locations.push(ubicacion);
           }*/

          /* for(j; j<sushiRestaurants.length; j++) {

               var sushiRestaurant= sushiRestaurants[j];
               locations.push(sushiRestaurant);
           }*/


          //console.log(placesLocations);
          //console.log(locations);

          /*for (j; j<locationsData.length; j++){
          
          var location= locationsData[j];
          locations.push(location);

        }
        console.log(locations);
        return locations;*/
        return locationsData;
      }


        function createMapMarker(placeData) {

   
          var lat = placeData.geometry.location.lat();  
          var lon = placeData.geometry.location.lng();  
          var name = placeData.formatted_address;   
          var bounds = window.mapBounds;            

          var marker = new google.maps.Marker({
           map: map,
           position: placeData.geometry.location,
           title: name
         });
    
         var infoWindow = new google.maps.InfoWindow({
         content: name
         });

         google.maps.event.addListener(marker, 'click', function() {
         infoWindow.open(map, marker);
         });

         bounds.extend(new google.maps.LatLng(lat, lon));
    
         map.fitBounds(bounds);

         map.setCenter(bounds.getCenter());

        }


      function callback(results, status) {
        var i=0;
        var length= results.length;
        console.log(length);
       if (status == google.maps.places.PlacesServiceStatus.OK) {
       //createMapMarker(results[0])
          for(i; i<length; i++ ) {
         
         createMapMarker(results[i]);

         }


        }
      }

      function pinPoster(locations) {
       
        var service = new google.maps.places.PlacesService(map);
    
        for (place in locations) {

        var request = {
          query: locations[place]
        }

         service.textSearch(request, callback);
        }
      }


        window.mapBounds = new google.maps.LatLngBounds();

  
        locations = locationFinder();
        pinPoster(locations);

       

        window.addEventListener('resize', function(e) {
        map.fitBounds(mapBounds);
          

          })
      }

    };
   
  octopus.init();

}());


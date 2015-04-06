
   

  (function() {

    var foursquareplaces=[];

  
  
   
  	var model= {

      currentCity: null,
      cities:["Bilbao"],
      foursquarePlaces:[],
      locations:[],
      data:[],
      

  	};

  	var octopus= {

          init: function(){
            model.currentCity= model.cities[0];
          	viewApp.init();
 
         },

         setCurrentCity: function(city) {
    
           model.cities.unshift(city);
        },


        setCurrentLocations: function(location) {

          model["locations"]=location;
        },

        resetCurrentLocations: function() {

         model["locations"]=null;
        },

        setCurrentFoursquarePlaces: function(place) {
         
          model["foursquarePlaces"]=place; 
        }, 

        setData: function(data) {

          model.data= data;

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

        getData: function() {
         
          return model.data;

        }

  	};


  	var viewApp= {


  		init: function(){

        
       var $body=$('body');
       //var $wikiElem=$('#wikipedia-links');
       //var $nytHeaderElem= $('#nytimes-header');
       //var $nytElem= $('#nytimes-articles');
       var $foursquareElem= $('#foursquare-places');
       var $greeting= $('.greeting');
           //$wikiElem.text("");
           //$nytElem.text("");
           $foursquareElem.text("");
           //$greeting.text("");

       var currentCity= octopus.getCurrentCity();
       console.log(currentCity);
       $greeting.text= ("So you want to eat sushi at " + currentCity + " ? ");
       var clientID='WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5';
       var clientSecret='RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2';
       //var nyTimesUrl='http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +currentCity+ '&sort=newest&api-key=f0331a394e4a5cd0ad8270cfcf7332a7:14:70756973';
       //var wikipediaUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search=' +currentCity+ '&format=json&callback=wikiCallback';
       var foursquareUrl='https://api.foursquare.com/v2/venues/explore?near=' +currentCity+ '&&client_id=' +clientID+ '&client_secret=' +clientSecret+ '&v=20130815&query=sushi';
       var lugares=[];
       var places=[];

       //Ajax requests
      /* $.getJSON( nyTimesUrl, function( data ) {
         var city= octopus.getCurrentCity();
         $nytElem.text('New York Times articles about: ' + city);
         var articles= data.response.docs;
         for (var i=0; i< articles.length; i++) {
              var article= articles[i];
              $nytElem.append('<li class= "article">' + '<a href= "'+ article.web_url+ '">' +article.headline.main+ '</a>' +'<p>' + article.snippet + ' </p> ' + '</li>');
         };

       }).error(function(e){ 
  
         $nytHeaderElem.text("New York articles Could not be loaded");

       })*/


       //JSONP error handling (there's no a specific error handling for JSONP in JQuery) with setTimeout
        /*var wikiRequestTimeout= setTimeout(function() {

          $wikiElem.text("failed to get wikipedia resources");

        }, 8000);
   
   
       //load wikipedia data 
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
            
            //Clears setTimeout function in case of successful request
            clearTimeout(wikiRequestTimeout); 
           
          }

        });*/

        //Ajax request for Foursquare inside a callback function
        function getDataFoursquare(callback) {

          $.getJSON(foursquareUrl, function(data) {

              var places=[];  
              places= data.response.groups[0].items;
              var locations=[];
              var city= octopus.getCurrentCity();
              for (var i=0; i< places.length; i++) {
  
                var place= places[i];
                var name= place.venue.name;
                var address=place.venue.location.address;
                var country= "ES";
                var location= name+ ' , ' +address+ ' , ' +city+ ' , '+country;
             
                locations.push(location);

                //callback(locations);
                callback(locations, places);
             }
              
          }).error(function(e){ 
  
              $foursquareElem.text("Foursquare articles Could not be loaded");

          });

              return false;

         }

         getDataFoursquare(function(locationsData, placeData){

      
            lugares= locationsData.slice(6,-3);
            places= placeData;

          
            octopus.setCurrentLocations(lugares);
            octopus.setCurrentFoursquarePlaces(places);
            //viewList.init();
            viewMap.init();
            //viewAdmin.init();
           

         })


             return false;

      }

    };


    var viewList= {

      init: function() {

         this.currentCity=octopus.getCurrentCity();
         this.listItems= octopus.getCurrentLocation();
         var $foursquareElem= $('#foursquare-places');
             $foursquareElem.text('Foursquare places in: ' + this.currentCity);
         
         var j=0;
         var listItemsLength= this.listItems.length;

         for(j; j<listItemsLength; j++){
          
          var lugar= this.listItems[j];
          $foursquareElem.append('<li class= "article">' + lugar + '</li>');
           
          }
       }

    };

  

    var viewMap= {

      init: function() {
          var showButton= document.getElementById("show");
          var hideButton= document.getElementById("hide");
          var markers=[];
          var map;     
          var locations;
          var data;
          var listItems=[];
              listItems= octopus.getCurrentLocation();
          var mapOptions = {

          disableDefaultUI: true

          };

          var listSuggestions=[];
   
          map = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);

         // Initialize autocomplete with local lookup:
            $('#autocomplete').devbridgeAutocomplete({
                lookup: listItems,
                minChars: 1,
                onSearchComplete: function (lookup, suggestions) {
                  
                  //console.log(suggestions);
                  
                  for(suggestion in suggestions){

                     var location= suggestions[suggestion].value;
                     listSuggestions.push(location);
                  }

                  //console.log(listSuggestions);
                  pinPoster(listSuggestions);

                },
                onSelect: function (suggestion) {

                  //console.log(suggestion.value);
<<<<<<< HEAD
                  var newList=[];
                  var newLocation= suggestion.value;
                  newList.push(newLocation);
                  clearMarkers();
                  pinPoster(newList);
                  //clearMarkers();
                  //locations= newLocation;
                 //pinPoster(locations);
                //$('#selection').html('You selected: ' + suggestion.value);
                //createMapMarker(suggestion.value);
                

                //showMarkers();
               
                //return suggestion.value;

                  var newList=[];
                  var newLocation=suggestion.value;
                  newList.push(newLocation);
                  //console.log(newList);
                  clearMarkers();
                  pinPoster(newList);

                },
                showNoSuggestionNotice: true,
                noSuggestionNotice: 'Sorry, no matching results'

            });

      
        function locationFinder() {
          //console.log(suggestion);
          //var locations= octopus.getCurrentCity();
          var locations= octopus.getCurrentLocation();
          console.log(locations);
          var places= octopus.getCurrentFoursquarePlaces();
          //console.log(places);


           return locations;
        }

        function createMapMarker(placeData) {
          data= placeData;
          console.log(data);
          var lat = placeData.geometry.location.lat();  
          var lon = placeData.geometry.location.lng();  
          var address = placeData.formatted_address;
          var name= placeData.name;
          var bounds = window.mapBounds;            

          var marker = new google.maps.Marker({

            map: map,
            position: placeData.geometry.location,
            title: name+ ", "+address

          });
          
          markers.push(marker);

          var infoWindow = new google.maps.InfoWindow({

            content: name+ ", "+address
          });

          google.maps.event.addListener(marker, 'click', function() {

            infoWindow.open(map, marker);
          });

          bounds.extend(new google.maps.LatLng(lat, lon));
    
          map.fitBounds(bounds);

          map.setCenter(bounds.getCenter());

        }

        function resetMarkers(place) {
            
            var placeName=place;
     
           
          for (item in data){

            var name= data[item].name;
            var address= data[item].formatted_address;

             if (name===placeName + address){

              console.log("Eureka!");
             }
          }

        }


        function callback(results, status) {
      
          if (status == google.maps.places.PlacesServiceStatus.OK) {

            createMapMarker(results[0])

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

        function setAllMap(map) {
          var j=0;
          var length= markers.length;
          for(j; j<length; j++) {

            markers[j].setMap(map);
          }

        }

        function clearMarkers() {

          setAllMap(null);
        }

        function showMarkers() {

          setAllMap(map);

        }

       
        window.mapBounds = new google.maps.LatLngBounds();

  
        locations = locationFinder();
        pinPoster(locations);//Puede trabajar indistintamente con uno o más parámetros y debería ir en el closure

       
        window.addEventListener('resize', function(e) {

          map.fitBounds(mapBounds);
          

        })

        showButton.addEventListener('click', function() {
    
        
        showMarkers();

    
        }, false);


        hideButton.addEventListener('click', function() {
    
         clearMarkers();
    
         }, false);


      }

    };


    var viewAdmin= {

      init: function () {

        $('#form-container').submit(this.search);

      },

      search: function () {

        this.city= $('#city').val();
        octopus.setCurrentCity(this.city);

        octopus.init();

        return false;
        
      }



    };
   
  octopus.init();

}());


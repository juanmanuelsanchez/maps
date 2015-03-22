
  (function() {


  	var model= {

      currentCity:null,
      currentStreet:null,
      currentAddress:null

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

        getCurrentCity: function() {

          return model.currentCity;
        },

        getCurrentStreet: function() {

          return model.currentStreet;
        },

        getCurrentAddress: function() {

          return model.currentAddress;
        },


  	};


  	var view= {


  		init: function() {

          $('#form-container').submit(this.render);

  		},

        render: function() {

        var $body= $('body');
    		var $wikiElem= $('#wikipedia-links');
    		var $nytHeaderElem= $('#nytimes-header');
    		var $nytElem= $('#nytimes-articles');
    		var $greeting= $('#greeting');
    		    $wikiElem.text("");
            $nytElem.text("");
        
    		this.streetStr= $('#street').val();
	      this.cityStr= $('#city').val();
	      this.address= this.streetStr + ',' + this.cityStr;
        $greeting.text("So you want to live at " + this.address + " ? ");
        console.log(this.address);

        octopus.setCurrentStreet(this.streetStr);
        octopus.setCurrentCity(this.cityStr);
        octopus.setCurrentAddress(this.address);



        var nyTimesUrl= 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +this.cityStr+ '&sort=newest&api-key=f0331a394e4a5cd0ad8270cfcf7332a7:14:70756973';
 
        var wikipediaUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search=' +this.cityStr+ '&format=json&callback=wikiCallback';
             

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

         view.renderMap();

	        console.log(this.cityStr);
            return false;
          
    	},

      renderMap: function() {
          var map;
          var latlng= new google.maps.LatLng(40.748817, -73.985428);
          var mapOptions= {

            zoom: 8,
            center:latlng
          }

           map= new google.maps.Map(document.getElementById('mapDiv'), mapOptions);

  
        //var address= octopus.getCurrentCity().toString();
        var address= $('#city').val();
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



    };
  
  octopus.init();

}());


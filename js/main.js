
  (function() {


  	var model= {



  	};

  	var octopus= {

          init: function(){

          	view.init();
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

    		var streetStr= $('#street').val();
	        var cityStr= $('#city').val();
	        var address= streetStr + ',' + cityStr;
                $greeting.text("So you want to live at " + address + " ? ");
                console.log(address);
            var nyTimesUrl= 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +cityStr+ '&sort=newest&api-key=f0331a394e4a5cd0ad8270cfcf7332a7:14:70756973';
 
            var wikipediaUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search=' +cityStr+ '&format=json&callback=wikiCallback';
             

            $.getJSON( nyTimesUrl, function( data ) {
	           $nytElem.text('New York Times articles about: ' + cityStr);
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
	
	        console.log(cityStr);
            return false;

    	},

    };
  
  octopus.init();

}());


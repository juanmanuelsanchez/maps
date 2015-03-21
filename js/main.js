
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

    		this.streetStr= $('#street').val();
	      this.cityStr= $('#city').val();
	      this.address= this.streetStr + ',' + this.cityStr;
                $greeting.text("So you want to live at " + this.address + " ? ");
                console.log(this.address);
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
	
	        console.log(this.cityStr);
            return false;

    	},

    };
  
  octopus.init();

}());


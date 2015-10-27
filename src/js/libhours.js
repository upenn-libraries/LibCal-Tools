/* LibCal "Today's Hours" Utilities
   Requires: jQuery
   Author: Ivan Goldsmith at Penn Libraries
   Description: This script fetches our library hours from LibCal, and inserts them into the HTML in any tags that use the "libhours-" classes.
   https://github.com/upenn-libraries/LibCal-Tools
   
   To insert hours into your page:
   Update this script with your institutional data, and include the script in your desired page. Then, you may do any of the following:
   -- For the hours chart, place a tag with the class "libhours-chart" into your page: <div class="libhours-chart"></div>
   -- For an individual library's hours, insert a tag (div, span, p, whatever you want) with the class "libhours-" + the appropriate class ending for your library.
      For example, Annenberg Library's hours can be inserted with: <div class="libhours-annenberg"></div>
      The full list of class name endings can be found below; the list is called "libData".
      Please do not give these tags any other classes; the script will get confused. If you add additional classes for styling, please add the classes to a wrapper/parent div.
       
      Note: If you put text or other contents into the libhours tags, the hours will be appended to the end of the contents. For example,
      <div class="libhours-dental">Dental Library </div> will result in the following output on your page: "Dental Library Hours, Dec. 10: 8am - 12am"

      Also note that when the tags get filled by this script, the class names will be changed to libhours-LIBNAME-filled. (So, "libhours-dental-filled", etc.)
      This prevents the tags from getting filled multiple times if the script gets run more than once for some reason, such as if the script gets inserted more than
      once due to being brought in by templates or boxes on sites like LibGuides.
*/

jQuery.noConflict();
jQuery(document).ready(function($){

	/************ CONFIGURATION ************/

	/** Put your iid (Institution ID) here. **/
	var iid = 335; //Penn Libraries
	
	/** This object contains all possible class name endings, and corresponding library information: libIDs, calendar URLs, and (optional) alternate names for hours chart.
		Each library also has a "jsonData" property added to it when we retrieve the data from LibCal.
		Biddle Law has a non-numeric libID because it is not in LibCal at all; we are adding it in manually. You can see we insert its "jsonData" property by hand.
		NOTE: The order of this list determines the order of the libraries in the hours chart! Reorder at your stylistic discretion. **/
	var libData = {
		"annenberg" : {"libID": 306, "calURL": "http://www.library.upenn.edu/hours/annenberg.html"},
		"bll" : {"libID": "BLL", "calURL": "https://www.law.upenn.edu/library/", "jsonData": {name:"Biddle Law Library", hours:"", url:"http://www.law.upenn.edu/bll/"}},
		"biomed" : {"libID": 305, "calURL": "http://www.library.upenn.edu/hours/biomed.html"},
		"chemistry" : {"libID": 412, "calURL": "http://www.library.upenn.edu/hours/chemistry.html"},
		"dental" : {"libID": 425, "calURL": "http://www.library.upenn.edu/hours/dental.html", "altName": "Dental Library"},
		"edcom" : {"libID": 168, "calURL": "http://www.library.upenn.edu/hours/edcom.html"},
		"finearts" : {"libID": 427, "calURL": "http://www.library.upenn.edu/hours/finearts.html", "altName": "Fine Arts Library"},
		"imgcoll" : {"libID": 643, "calURL": "http://www.library.upenn.edu/hours/fineartsimage.html"},
		"kislak" : {"libID": 429, "calURL": "http://www.library.upenn.edu/hours/kislak.html"},
		"rbm" : {"libID": 455, "calURL": "http://www.library.upenn.edu/hours/reading.html", "altName": "Kislak Center Reading Room"},
		"goldstein": {"libID": 683, "calURL": "http://www.library.upenn.edu/hours/gallery.html"},
		"furness": {"libID": 684, "calURL": "http://www.library.upenn.edu/hours/furness.html"},
		"lcajs" : {"libID": 431, "calURL": "http://www.library.upenn.edu/hours/lcajs.html"},
		"libra" : {"libID": 430, "calURL": "http://www.library.upenn.edu/hours/libra.html"},
		"lippincott" : {"libID": 433, "calURL": "http://www.library.upenn.edu/hours/lippincott.html"},
		"mpa" : {"libID": 434, "calURL": "http://www.library.upenn.edu/hours/mpa.html"},
		"museum" : {"libID": 435, "calURL": "http://www.library.upenn.edu/hours/museum.html"},
		"music" : {"libID" : 436, "calURL": "http://www.library.upenn.edu/hours/music.html"},
		"ormandy" : {"libID": 453, "calURL": "http://www.library.upenn.edu/hours/ormandy.html"},
		"pennhosp" : {"libID": 410, "calURL": "http://www.library.upenn.edu/hours/pennhosp.html"},
		"vp" : {"libID": 437, "calURL": "http://www.library.upenn.edu/hours/vp.html"},
		"vpusc" : {"libID": 457, "calURL": "http://www.library.upenn.edu/hours/vpusc.html", "altName": "Van Pelt Undergrad. Study Center"},
		"vpcafe" : {"libID": 685, "calURL": "http://www.library.upenn.edu/hours/cafe.html"},
		"vpill" : {"libID": 650, "calURL": "http://www.library.upenn.edu/hours/vpill.html"},
		"vpref" : {"libID": 686, "calURL": "http://www.library.upenn.edu/hours/vpref.html"},
		"vetc" : {"libID": 438, "calURL": "http://www.library.upenn.edu/hours/vetc.html", "altName": "Veterinary Library - Campus"},
		"vetnbc" : {"libID": 456, "calURL": "http://www.library.upenn.edu/hours/vetnbc.html", "altName": "Veterinary Library - NBC"},
		"wic" : {"libID": 166, "calURL": "http://www.library.upenn.edu/hours/wic.html"},
		"vitale" : {"libID": 167, "calURL": "http://www.library.upenn.edu/hours/medialab.html"}
	};
	
	/** These are the libIDs of all libraries to be shown in the hours chart; feel free to add and remove libraries as needed. **/
	var chartLibraries = [306, "BLL", 305, 412, 425, 168, 427, 429, 431, 430, 433, 434, 435, 453, 455, 437, 457, 438, 456, 166];

	/***************************************/

	/** Retrieve & store the library information from LibCal, then begin inserting data into the page. **/
	$.ajax({
		url: "https://api3.libcal.com/api_hours_today.php?iid="+iid+"&lid=0&format=json",
		type: 'GET',
		cache: false,
		dataType: 'jsonp'
	})
		.done( function (data) {
			$.each(data.locations, function(i, location) {
				var hours = ": " + location.rendered;
				var data = {name:location.name, hours:hours, url:location.url};
				try {
					getLibraryByID(location.lid).jsonData = data;
				} catch (e) {
					// Uncomment to see the libraries in LibCal that are not in our libData list.
					// console.log("Unknown library in JSON data! " + e + ", name: " + location.name);
				}
			});

			// Start filling the page with hours.
			insertHours();
		})
		.fail( function (xhr, status, error) {
			if (typeof console != "undefined") {
				console.error("LibCalJSON: HTTP-GET failure. Status: " + status + ", Error: " + error);
			}
		});
		
	/** This function finds all HTML elements with libhours-* classes, and inserts the proper hours/HTML. **/
	function insertHours() {
		var date = todaysDate();
		$("[class^='libhours-']").each(function(i, item) {
			var libname = $(this).attr("class").split("-")[1];
			var text;
			if (libname == "chart") {
				// Display a temporary "loading" indicator while the chart gets built.
				$('<div class="libhours-loading">Hours table loading; please wait...</div>').insertBefore($(this));
				// Insert the initial HTML to be filled in with the full hours chart.
				text = '<div id="homepagehours"><ul class="homeul left"></ul></div>';
				$(this).replaceWith(text);
				insertChart();
				// Remove "loading" indicator now that the chart has been inserted.
				$(".libhours-loading").remove();
			} else if ($(this).attr("class").split("-")[2]) {
				// This div has already been filled, so skip over it.
				return;
			} else {
				if (libname in libData) {
					var library = libData[libname];
					text = '<a href="'+ library.calURL +'">Hours</a>, ' + date + library.jsonData.hours;
				} else {
					text = "ERROR: Unknown library name '"+libname+"'.";
					if (typeof console != "undefined") {
						console.error(text);
					}
				}
				$(this).append(text);
				// Change the class to mark that this div has been filled.
				$(this).removeClass("libhours-"+libname).addClass("libhours-"+libname+"-filled");
			}
		});
	}
	
	/** This function builds, inserts, and styles the hours chart (for the main homepage and any other pages that need it). **/
	function insertChart() {
		//Hide the div containing this section until we are finished populating it, so people don't see a weird, half-loaded list.
		$("#homepagehours").hide();
	
		// Dynamically build the <ul> of library information, and add into the page.
		for (var key in libData) {
			library = libData[key];
			// Only add libraries specified in the chartLibraries array.
			if ($.inArray(library.libID, chartLibraries) < 0) {
				continue;
			}
			// If we have specified an alternative library name to display, use it. Otherwise, use the name passed to us from LibCal.
			var displayName = library.jsonData.name;
			if (library.hasOwnProperty("altName")) {
				displayName = library.altName;
			}
			
			var li = $('<li></li>');
			var libName = $('<a></a>')
				.text(displayName)
				.attr('href', library.jsonData.url)
				.appendTo(li);
			li.append("&#160;");
			var libHours = $('<a></a>')
				.text("hours")
				.addClass("hours")
				.attr('href', library.calURL)
				.appendTo(li);
			li.append(library.jsonData.hours);
			$('ul.left').append(li);
		}

		// Run the function that makes columns and styles <ul>s and <li>s.
		formatChart();

		// When everything is finished, unhide the container div.
		$("#homepagehours").show();
	}
	
	/** This function gets a library from the libData list, given its libID. **/
	function getLibraryByID(lid) {
		for (var key in libData) {
			var lib = libData[key];
			if (lib.libID === lid) {
				return lib;
			}
		}
		throw "Couldn't find library with libID: " + lid;
	}
	
	/** This function returns a string containing today's date in MMM DD format. **/
	function todaysDate() {
		var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
		var today = new Date();
		return months[today.getMonth()] + " " + today.getDate();
	}

	/** This function splits the hours chart into 2 columns (left and right). **/
	function formatChart() {
		var itemNum = $('#homepagehours ul.homeul.left li').length;
		var parity = itemNum % 2;
		var firstHalfSize = Math.floor(itemNum/2) + parity;

		if (firstHalfSize > 0) {
			var firstHalf = '';
			$('#homepagehours ul.homeul.left li').slice(0, firstHalfSize).each(function() {
				firstHalf = firstHalf + $(this)[0].outerHTML;
			});
			
			var secondHalf = '';

			$('#homepagehours ul.homeul.left li').slice(firstHalfSize).each(function() {
				secondHalf = secondHalf + $(this)[0].outerHTML;
			});
			
			var finalHtml = '<ul class="homeul left">' + firstHalf + '</ul><ul class="homeul right">' + secondHalf + '<li class="morehoursinfo"><a href="http://www.library.upenn.edu/locations/">more info...</a></li></ul>';
			$('#homepagehours ul.homeul.left').replaceWith(finalHtml);

			$('#homepagehours ul.homeul.left li:nth-child(odd), #homepagehours ul.homeul.right li:nth-child(odd)').addClass('even'); // :odd uses zero-indexing
			$('#homepagehours ul.homeul.left li:nth-child(even), #homepagehours ul.homeul.right li:nth-child(even)').addClass('odd');
		}
	}
}); //end jQuery
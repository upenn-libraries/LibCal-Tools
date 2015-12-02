/**
 * LibCal Mobile Hours
 * Requires: jQuery
 * Author: Ivan Goldsmith at Penn Libraries
 * Description: This script fetches weekly library hours from LibCal and displays them in a mobile-friendly list.
 * https://github.com/upenn-libraries/LibCal-Tools
 */

jQuery(function($){

	/************ CONFIGURATION ************/
	/* Put your iid (Institution ID) here. */
	var iid = 335; //Penn Libraries

	/* How many weeks do you want? (Can be between 1 and 52.) */
	var numWeeks = 52;

	/* Where should the calendar be inserted? This should be a div that is displayed only on mobile screens.
		If the div does not exist yet and you would like to create it with jQuery, feel free to do so here. */
	var $mobileContainer = $("#holdmobilecalendar");
	/***************************************/

	/* Determine which lid (Library ID) to use. Should be an attribute in a hidden element on the page. 
		For example, Annenberg Library's hours page will have this hidden somewhere: <div id="mobile-lid" data-lid="306" style="display:none;"></div>
		Alternatively, you may hard code the lid here, if you don't want this dynamic multi-calendar functionality. */
	var currentLid = $("#mobile-lid").attr("data-lid");

	/** If an LID was found, do the AJAX call. **/
	if (currentLid) {
		/** Retrieve the hours from LibCal, then add to the page. **/
		$.ajax({
			url: "https://api3.libcal.com/api_hours_grid.php?iid="+iid+"&lid="+currentLid+"&weeks="+numWeeks+"&format=json",
			type: 'GET',
			cache: false,
			dataType: 'jsonp'
		})
			.done( function (data) {
				insertMobileChart(data[Object.keys(data)[0]]);
			})
			.fail( function (xhr, status, error) {
				if (typeof console != "undefined") {
					console.error("Mobile LibCalJSON: HTTP-GET failure. Status: " + status + ", Error: " + error);
				}
			});
	} //end if(currentLid)

	/** Builds and inserts the mobile hours widget, given data retrieved from LibCal. **/
	function insertMobileChart(library) {
		for (var i=0; i<library.weeks.length; i++) {
			var $weekContainer = $('<div class="mobileweek" style="display: none;" data-heading="testing"></div>');
			if (i === 0) {
				$weekContainer.addClass("visible");
			}
			var week = library.weeks[i];
			for (var day in week) {
				var formattedDate = day + ", " + formatDate(week[day].date) + ": ";
				var isToday = checkIfToday(week[day].date);
				if (day === "Monday") {
					// Give each week a heading of "Month, YYYY" based on first day of the week.
					$weekContainer.attr("data-heading", formatDate(week[day].date, true));
				}
				var formattedHours = week[day].rendered;
				// If open, make sure multiple sets of hours are separated by a line break (otherwise, it wraps to the next line).
				if (week[day].times.status === "open") {
					formattedHours = formattedHours.replace(/\. /g, ",</br>"); // The API splits sets of hours with a period.
				}
				$weekContainer.append('<div class="mobilerow '+isToday+'"><div class="mobiledate">'+formattedDate+'</div><div class="mobilehours">'+formattedHours+'</div></div>');
			}
			$mobileContainer.append($weekContainer);
		}

		// Add alternating classes to rows for styling.
		$(".mobilerow").each(function(index) {
			if (index % 2 === 0) {
				$(this).addClass("mobileeven");
			} else {
				$(this).addClass("mobileodd");
			}
		});

		// Add navigation buttons.
		$mobileContainer.prepend('<div class="mobileconsole"><button class="mobilenav prev">&#171;</button><div class="mobiletitle"></div><button class="mobilenav next">&#187;</button></div>');
		$(".mobiletitle").text($(".visible").attr("data-heading"));
		updateButtons();
		$(".mobilenav").click(function() {
			if ($(this).hasClass("next")) {
				// Next Button. If there is a next week, go to it.
				if ($(".visible").next(".mobileweek").length) {
					$(".visible").removeClass("visible").next().addClass("visible");
				}
			} else if ($(this).hasClass("prev")) {
				// Prev Button. If there is a previous week, go to it.
				if ($(".visible").prev(".mobileweek").length) {
					$(".visible").removeClass("visible").prev().addClass("visible");
				}
			}
			// Update the month & year between the nav buttons.
			$(".mobiletitle").text($(".visible").attr("data-heading"));
			updateButtons();
		});
	}

	/** Enables and disables next and prev buttons. **/
	function updateButtons() {
		// If there is no next month, disable the next button.
		if ($(".visible").next(".mobileweek").length) {
			$(".next").prop("disabled", false);
		} else {
			$(".next").prop("disabled", true);
		}
		// If there is no previous month, disable the prev button.
		if ($(".visible").prev(".mobileweek").length) {
			$(".prev").prop("disabled", false);
		} else {
			$(".prev").prop("disabled", true);
		}
	}

	/** Formats dates from YYYY-MM-DD into "MMM, DD" or "Month YYYY" (for header) **/
	function formatDate(date, isHeader) {
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var jsDate = new Date(date);
		if (isHeader) {
			return fullMonths[jsDate.getUTCMonth()] + " " + jsDate.getUTCFullYear();
		} else return months[jsDate.getUTCMonth()] + " " + jsDate.getUTCDate();
	}

	/** Checks if a given date is today. If it is, return a special class for styling. Otherwise, return empty string. **/
	var today = new Date();
	function checkIfToday(date) {
		var givenDate = new Date(date);
		if (givenDate.getUTCDate() === today.getUTCDate() &&
			givenDate.getUTCMonth() === today.getUTCMonth() &&
			givenDate.getUTCFullYear() === today.getUTCFullYear()) {
			return "today";
		} else return "";
	}

}); //end jQuery
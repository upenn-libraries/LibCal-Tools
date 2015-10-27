/**
 * Responsive Styling Configuration
 * Requires: jQuery
 * Author: Web Unit at Penn Libraries
 * Description: Listens to window size and adds appropriate classes to the body for responsive styling.
 * https://github.com/upenn-libraries/LibCal-Tools
 */

jQuery(function($) {

	/*------------- RESPONSIVE CONFIGURATION -------------*/
	function responsiveConfig() {
		if ($(window).width() > 768) { // desktop
			$('body').addClass("desktop").removeClass("tablet").removeClass("phone"); //just in case
		} //end of desktop config

		else if ($(window).width() > 480) {	// 480 < width <= 768
			$('body').removeClass("desktop").addClass("tablet").removeClass("phone");
		} //end of tablet config

		else {
			$('body').removeClass("desktop").addClass("tablet").addClass("phone");
		} //end of phone config
	}
	/* Initialize responsive configuration when you first come to the page. */
	responsiveConfig();

	/* When you resize your window, the timeout feature ensures responsiveConfig only gets executed at the end of a window-resize action. */
	$(window).resize(responsiveConfig);
	/*------------- END RESPONSIVE CONFIGURATION -------------*/

}); //end jQuery
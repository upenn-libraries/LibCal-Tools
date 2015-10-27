# LibCal Hours Tools #
This repository exists for those of us who need to squeeze advanced functionality out of our [LibCal](http://springshare.com/libcal/) Hours. Sometimes, the pre-built widgets aren't cut out for the job, and that's where this suite of Javascript tools comes in handy. These tools were built to manage hours for many libraries; we use LibCal to manage the hours of 30+ separate locations! LibCal's pre-built widgets were cumbersome, hence this code was born.

You can use these scripts as-is, tweak them to your needs, or use them as examples to learn from and build your own custom solutions. It depends entirely on what best fits your needs.

These scripts require [jQuery](https://jquery.com/download/). Of course, a bare Javascript implementation is possible, but it's not on our current list of priorities; we're open to pull requests, though!

All you need to do to use these scripts out-of-the-box is add your institution-specific info (such as your institution ID and library IDs) to a few variables at the beginning of the scripts. I've left our Penn-specific data in place to serve as easy placeholders to replace with your own data.

After adding your info to the scripts, we recommend minifying the scripts before using them. If you don't already have a preferred method for doing this, you can paste the script into a minification tool such as [JSCompress](http://jscompress.com/). Easy peasy!

## [libhours.js](src/js/libhours.js): Today's Hours++ ##
This script is a sophisticated version of the standard "Today's Hours" widget. Rather than managing individual scripts in every single place you want to display a library's hours, you can instead use this master script to manage all hours for all libraries. This script will insert the correct hours into any libhours-div you place on the page.
We built this script when we migrated to Libcal from an old, homegrown Perl-based calendar system, where we could insert an ["include" tag](https://en.wikipedia.org/wiki/Server_Side_Includes) to make hours appear. This JS solution emulates that behavior.
One example of this script in action is at the [Penn Libraries Locations Page](http://www.library.upenn.edu/locations/); all hours were fetched and inserted by this single script.

This script also provides a custom chart of Today's Hours for a hand-selected list of libraries. See it in action at the [Penn Libraries Hours Page](http://www.library.upenn.edu/hours/).

**HOW TO USE:**
You need to configure a few variables at the top of the script:

* `iid`: Your Institution ID.
* `libData`: A list of data about libraries whose hours you want to display. For each library you want to include, you need to give it a nickname, add its Library ID, a URL to its calendar, and (optional) an alternative name to display in the hours chart, if preferred (this name overrides the name listed in LibCal; useful for awkwardly long names). Each library will look as follows: `"nickname" : {"libID": 777, "calURL": "http://mylibrary.edu/hours/sampleLibrary.html", "altName": "Sample Library"}`
* `chartLibraries`: A list of Library IDs of the libraries you want to include in the hours chart (if you want to use it at all).

After that, include the script in any page you want to add hours.
If you want to display a single library's hours, insert a div that refers to the library's nickname: `<div class="libhours-nickname"></div>`
If you want to display the hours chart, insert this div: `<div class="libhours-chart"></div>`

That's it! From there, the script will take care of the rest. If you use the chart, you might want to add some CSS to style it:

#### [libhours-chart.css](src/css/libhours-chart.css) ####
This is our default stylesheet for the libhours chart. Use it as-is, modify it, or write your own styles.

## [libhours-mobile.js](src/js/libhours-mobile.js): Mobile Hours for a Mobile World ##
This is a custom mobile view of a single library's hours, displayed weekly instead of monthly. We built this because the full calendar widget looks great on desktop, but not-so-great on mobile. Assuming you have one calendar per page, you can use this same script for all your calendars.
To see this script in action, check out [Van Pelt Library's hours](http://www.library.upenn.edu/hours/vp.html) on a mobile device (or resize your browser window).

**HOW TO USE:**
You need to configure a few variables at the top of the script:

* `iid`: Your Institution ID.
* `numWeeks`: Indicates how many weeks to fetch (from 1 to 52).
* `$mobileContainer`: Specifies which div to insert the mobile hours into.
Somewhere in your page, you also need to add a hidden div that contains the Library ID that pertains to this calendar (this is so the same script can be used for all of your calendars). For example, Annenberg Library's hours page will have this hidden somewhere: `<div id="mobile-lid" data-lid="306" style="display:none;"></div>`
If you only have a single calendar or simply don't want this functionality, you can hard code the Library ID in the script (var `currentLid`) instead.

Finally, add the script to your page and let it do its magic!

#### [libhours-mobile.css](src/css/libhours-mobile.css) ####
This contains the default styling for the libhours-mobile widget. Use it out-of-the-box, tweak it, or replace it entirely with your own custom CSS.

## [responsive-config.js](src/js/responsive-config.js): Responsive Styling Made Easy ##
*OPTIONAL SCRIPT.* If you don't already have a method of implementing responsive design, this script is for you! It contains a function that applies classes to the body for responsive styling. By default, it adds classes for "phone", "tablet", and "desktop" sizes.

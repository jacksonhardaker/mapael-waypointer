var mapaelWaypointer = (function ($) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	$(window).load(function () {
		console.log('Initialising Mapel Waypointer');

		// Load city plots
		$.getJSON('/wp-content/plugins/mapael-waypointer/public/js/mw-cities.json').complete(function (data) {
			var cities = data.responseJSON;
			console.log(cities);

			// Initialise map
			$(".mw__map-container").mapael({
				map: {
					name: "world_countries",
					cssClass: 'mw__map-container__svg'
				},
				plots: {
					'paris': cities.paris,
					'newyork': {
						latitude: 40.667,
						longitude: -73.833,
						tooltip: { content: "NYC" }
					},
					'tokyo': {
						latitude: 35.687418,
						longitude: 139.692306,
						tooltip: { content: 'Tokyo' }
					}
				},
				links: {}
			});

		});

	});

})(jQuery);

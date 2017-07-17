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
	var vm = {};

	$(window).load(function () {
		console.log('Initialising Mapel Waypointer');

		// Load args from the html (saved by the php code)
		var args = $('[data-side="mw-map-front"]').data('params');
		args.cities = args.cities ? args.cities.split(',') : {};
		var maps = {
			'world': 'world_countries'
		};

		// Load city plots
		$.getJSON('/wp-content/plugins/mapael-waypointer/public/js/mw-cities.json').complete(function (data) {
			vm.cities = data.responseJSON;

			var selectedCities = args.cities.map(function (selectedCity) {
				return vm.cities[selectedCity.trim()];
			}).reduce(function (accumulator, current) {

				// Add tooltip
				current.tooltip = { content: current.city };

				// Remap to attribute and return
				accumulator[current.city.toLowerCase()] = current;
				return accumulator;
			}, {});
			//console.log(selectedCities);

			// Initialise map
			$(".mw__map-container").mapael({
				map: {
					name: maps[args.map],
					cssClass: 'mw__map-container__svg'
				},
				plots: selectedCities,
				links: {}
			});

		});

		var waypoints = $('.mw__waypoint').waypoint({
			handler: function (direction) {
				var $element = $(this.element);

				switch (direction) {
					case 'down':
						triggerDownAction($element.data('waypoint-type'), $element);
						break;
					case 'up':
						triggerUpAction($element.data('waypoint-type'), $element);
						break;
				}
			}
		});
	});

	function triggerDownAction(type, $element) {
		switch (type) {
			case 'plot':
				addPlot($element.data('waypoint-name'));
				break;
			case 'link':
				addLink($element.data('waypoint-to'), $element.data('waypoint-from'));
				break;
		}
	}

	function triggerUpAction(type, $element) {
		switch (type) {
			case 'plot':
				removePlot($element.data('waypoint-name'));
				break;
			case 'link':
				removeLink($element.data('waypoint-to'), $element.data('waypoint-from'));
				break;
		}
	}

	function addPlot(cityName) {
		console.log(['Adding a new plot: ', cityName].join(''));
		cityName = cityName.trim();

		var newPlots = {};
		newPlots[cityName] = vm.cities[cityName];
		newPlots[cityName].tooltip = { content: newPlots[cityName].city };

		$('.mw__map-container').trigger('update', {
			newPlots: newPlots,
			animDuration: 300
		});
	}

	function removePlot(cityName) {
		console.log(['Removing a new plot: ', cityName].join(''));
		cityName = cityName.trim();

		$('.mw__map-container').trigger('update', {
			deletePlotKeys: [cityName],
			animDuration: 300
		});
	}

	function addLink(to, from) {
		console.log(['Adding a new link: ', to, ' ', from].join(''));

		var newLinks = {};
		newLinks[[from, to].join('')] = {
			factor: generateRandomFactor(),
			between: [from, to]
		};

		$('.mw__map-container').trigger('update', {
			newLinks: newLinks,
			animDuration: 300
		});
	}

	function removeLink(to, from) {
		console.log(['Removing a new link: ', to, ' ', from].join(''));

		$('.mw__map-container').trigger('update', {
			deleteLinkKeys: [[from, to].join('')],
			animDuration: 300
		});
	}

	function generateRandomFactor() {
		return ((Math.floor(Math.random() * (27 - 9 + 1) + 9)) - 18) / 10;
	}

})(jQuery);

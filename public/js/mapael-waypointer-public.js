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
	var vm = {
		zoomSpeed: 600,
		waypointIndex: -1
	};

	$(window).load(function () {
		console.log('Initialising Mapel Waypointer');

		// Load args from the html (saved by the php code)
		vm.args = $('[data-side="mw-map-front"]').data('params');
		vm.args.cities = vm.args.cities ? vm.args.cities.split(',') : {};
		vm.args.zoom = vm.args.zoom === 'true' ? true : false;
		var maps = {
			'world': 'world_countries',
			'worldmercator': 'world_countries_mercator',
			'worldmiller': 'world_countries_miller'
		};

		// Move the map a few layouts outwards.
		$(".mw__map-container").appendTo('.site-container');

		// Load city plots
		$.getJSON('/wp-content/plugins/mapael-waypointer/public/js/mw-cities.json').complete(function (data) {
			vm.cities = data.responseJSON;
			console.log(data);

			var selectedCities = vm.args.cities.map(function (selectedCity) {
				return vm.cities[selectedCity.trim()];
			}).reduce(function (accumulator, current) {
				if (current) {
					// Add tooltip
					current.tooltip = { content: current.city };

					// Add full lat/lng, if needed.
					current.latitude = current.latitude ? current.latitude : current.lat;
					current.longitude = current.longitude ? current.longitude : current.lng;

					// Remap to attribute and return
					accumulator[current.city.toLowerCase()] = current;
				}
				return accumulator;
			}, {});

			// Initialise map
			$(".mw__map-container").mapael({
				map: {
					name: maps[vm.args.map],
					cssClass: 'mw__map-container__svg',
					defaultPlot: {
						size: 7
					}
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
		vm.waypointIndex++;

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
		vm.waypointIndex--;

		switch (type) {
			case 'plot':
				removePlot($element.data('waypoint-name'));
				break;
			case 'link':
				removeLink($element.data('waypoint-to'), $element.data('waypoint-from'));
				break;
		}

		if (vm.waypointIndex === -1 && vm.args.zoom) {
			$('.mw__map-container').trigger('zoom', {
				level: '0',
				animDuration: vm.zoomSpeed
			});
		}
	}

	function addPlot(cityName) {
		//console.log(['Adding a new plot: ', cityName].join(''));
		cityName = cityName.trim();

		var newPlots = {};
		newPlots[cityName] = vm.cities[cityName];
		newPlots[cityName].tooltip = { content: newPlots[cityName].city };

		$('.mw__map-container').trigger('update', {
			newPlots: newPlots,
			animDuration: 300
		});

		if (vm.args.zoom) {
			$('.mw__map-container').trigger('zoom', {
				level: '3',
				latitude: newPlots[cityName].latitude,
				longitude: newPlots[cityName].longitude,
				animDuration: vm.zoomSpeed
			});
		}
	}

	function removePlot(cityName) {
		//console.log(['Removing a new plot: ', cityName].join(''));
		cityName = cityName.trim();

		$('.mw__map-container').trigger('update', {
			deletePlotKeys: [cityName],
			animDuration: 300
		});
	}

	function addLink(to, from) {
		//console.log(['Adding a new link: ', to, ' ', from].join(''));

		var newLinks = {};
		newLinks[[from, to].join('')] = {
			factor: generateRandomFactor(),
			between: [from, to]
		};

		$('.mw__map-container').trigger('update', {
			newLinks: newLinks,
			animDuration: 300
		});

		if (vm.args.zoom) {
			$('.mw__map-container').trigger('zoom', {
				level: '1',
				latitude: vm.cities[to].latitude,
				longitude: vm.cities[to].longitude,
				animDuration: vm.zoomSpeed
			});
		}
	}

	function removeLink(to, from) {
		//console.log(['Removing a new link: ', to, ' ', from].join(''));

		$('.mw__map-container').trigger('update', {
			deleteLinkKeys: [[from, to].join('')],
			animDuration: 300
		});

		if (vm.args.zoom) {
			$('.mw__map-container').trigger('zoom', {
				level: '1',
				latitude: vm.cities[from].latitude,
				longitude: vm.cities[from].longitude,
				animDuration: vm.zoomSpeed
			});
		}
	}

	function generateRandomFactor() {
		return ((Math.floor(Math.random() * (27 - 9 + 1) + 9)) - 18) / 10;
	}

})(jQuery);

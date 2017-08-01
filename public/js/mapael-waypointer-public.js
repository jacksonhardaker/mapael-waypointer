var mapaelWaypointer = (function ($) {
	'use strict';

	var vm = {
		zoomSpeed: 600,
		waypointIndex: -1
	};

	$(window).on('load', function () {
		if ($(".mw__map-container")[0]) {
			console.log('Initialising Mapel Waypointer');

			// Load args from the html (saved by the php code)
			vm.args = $('[data-side="mw-map-front"]').data('params');
			vm.args.cities = vm.args.cities ? vm.args.cities.split(',') : {};
			vm.args.zoom = vm.args.zoom === 'true' ? true : false;
			var maps = {
				'world': 'world_countries',
				'worldmercator': 'world_countries_mercator',
				'worldmiller': 'world_countries_miller',
				'srilanka': 'sri_lanka'
			};

			// Move the map a few layouts outwards.
			$(".mw__map-container").appendTo('.site-container');

			// Load city plots
			$.getJSON('wp-content/plugins/mapael-waypointer/public/js/mw-cities.json').complete(function (data) {
				vm.cities = data.responseJSON;
				console.log(vm.cities);
				var selectedCities = vm.args.cities.map ? vm.args.cities.map(function (selectedCity) {
					selectedCity = selectedCity.trim();

					// Add key attribute and return
					var city = vm.cities[selectedCity];
					city.key = selectedCity;
					return city;
				}).reduce(function (accumulator, current) {
					if (current) {
						// Add tooltip
						current.tooltip = { content: current.city };

						// Add full lat/lng, if needed.
						current.latitude = current.latitude ? current.latitude : current.lat;
						current.longitude = current.longitude ? current.longitude : current.lng;

						// Remap to attribute and return
						accumulator[current.key.toLowerCase()] = current;
					}
					return accumulator;
				}, {}) : {};

				// Initialise map
				$(".mw__map-container").mapael({
					map: {
						name: maps[vm.args.map],
						cssClass: 'mw__map-container__svg',
						defaultPlot: {
							size: 4
						}
					},
					plots: selectedCities,
					links: {},
					zoom: {
						animEasing: 'ease-in',
						animDuration: vm.zoomSpeed
					}
				});

				// Set SVG height
				$(".mw__map-container").find('svg').height($(window).height());

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
		}
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
				level: '0'
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
				level: '5',
				latitude: newPlots[cityName].latitude,
				longitude: newPlots[cityName].longitude
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
		//console.log(['Adding a new link: ', from, ' ', to].join(''));

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
				level: '2',
				latitude: vm.cities[to].latitude,
				longitude: vm.cities[to].longitude
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
				level: '2',
				latitude: vm.cities[from].latitude,
				longitude: vm.cities[from].longitude
			});
		}
	}

	var previousArcDirection = 'under';

	function generateRandomFactor() {
		var factor = ((Math.floor(Math.random() * (27 - 9 + 1) + 9)) - 18) / 10;
		factor = (factor >= 0 && factor < 0.3) ? factor + 0.3 : factor;
		factor = (factor < 0 && factor > -0.3) ? factor - 0.3 : factor;


		switch (previousArcDirection) {
			case 'under':
				if (factor < 0) {
					factor = factor * -1;
				}

				previousArcDirection = 'over';
				break;
			case 'over':
				if (factor > 0) {
					factor = factor * -1;
				}

				previousArcDirection = 'under';
				break;
		}

		return factor;
	}

})(jQuery);

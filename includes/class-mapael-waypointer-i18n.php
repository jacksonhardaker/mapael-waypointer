<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://www.jacksonhardaker.com
 * @since      1.0.0
 *
 * @package    Mapael_Waypointer
 * @subpackage Mapael_Waypointer/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Mapael_Waypointer
 * @subpackage Mapael_Waypointer/includes
 * @author     Jackson Hardaker <jackson@jacksonhardaker.com>
 */
class Mapael_Waypointer_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'mapael-waypointer',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}

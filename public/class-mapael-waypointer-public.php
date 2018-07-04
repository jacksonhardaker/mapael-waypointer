<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://www.jacksonhardaker.com
 * @since      1.0.0
 *
 * @package    Mapael_Waypointer
 * @subpackage Mapael_Waypointer/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Mapael_Waypointer
 * @subpackage Mapael_Waypointer/public
 * @author     Jackson Hardaker <jackson@jacksonhardaker.com>
 */
class Mapael_Waypointer_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Display word count stats with shortcode.
	 *
	 * @since 	1.0.0
	 * @param	array	$atts	Shortcode attributes.
	 */
	 
	 public function mw_register_shortcodes() {

		function mw_map_shortcode($dataParams) { 
		
			$html = '<div class="mw__map-container">'
				. '<div hidden data-side="mw-map-front" data-params="' . htmlspecialchars(json_encode($dataParams), ENT_QUOTES, "UTF-8") . '"></div>'
        		. '<div class="mw__map-container__svg"></div>'
				. '</div>';
			return $html;
		}
		add_shortcode( 'mw-map' , 'mw_map_shortcode' );

		function mw_waypoint_shortcode($dataParams) {
			switch ($dataParams['type']) {
				case "city":
					return '<div class="mw__waypoint-wrapper"><div class="mw__waypoint mw__waypoint--plot" data-waypoint-type="plot" data-waypoint-name="' . $dataParams['city-name'] . '"></div></div>';
				break;
				case "route":
					return '<div class="mw__waypoint-wrapper"><div class="mw__waypoint mw__waypoint--link" data-waypoint-type="link" data-waypoint-from="' . $dataParams['from'] . '" data-waypoint-to="' . $dataParams['to'] . '"></div></div>';
				break;
			} ?>
		<?php }
		add_shortcode( 'mw-waypoint' , 'mw_waypoint_shortcode' );
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Mapael_Waypointer_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Mapael_Waypointer_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/mapael-waypointer-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Mapael_Waypointer_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Mapael_Waypointer_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( 'jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js', array(), null, true );
		wp_enqueue_script( 'waypoints', 'https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js', array( 'jquery' ), null, true );
		wp_enqueue_script( 'raphael', 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.7/raphael.min.js', array(), null, true );
		wp_enqueue_script( 'mapael', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mapael/2.1.0/js/jquery.mapael.min.js', array( 'jquery', 'raphael' ), null, true );
		wp_enqueue_script( 'mapael-world_countries', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mapael/2.1.0/js/maps/world_countries.min.js', array( 'mapael' ), null, true );
		wp_enqueue_script( 'mapael-world_countries_mercator', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mapael/2.1.0/js/maps/world_countries_mercator.min.js', array( 'mapael' ), null, true );
		wp_enqueue_script( 'mapael-world_countries_miller', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mapael/2.1.0/js/maps/world_countries_miller.min.js', array( 'mapael' ), null, true );
		wp_enqueue_script( 'mapael-world_countries_miller', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mapael/2.1.0/js/maps/world_countries_miller.min.js', array( 'mapael' ), null, true );
		wp_enqueue_script( 'sri-lanka-map', plugin_dir_url( __FILE__ ) . 'js/sri_lanka.min.js', array( 'mapael' ), null, true );
		wp_enqueue_script( 'croatia-map', plugin_dir_url( __FILE__ ) . 'js/croatia.min.js', array( 'mapael' ), null, true );
		wp_enqueue_script( 'japan-map', plugin_dir_url( __FILE__ ) . 'js/japan.min.js', array( 'mapael' ), null, true );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/mapael-waypointer-public.min.js', array( 'jquery', 'mapael', 'waypoints' ), null, true );
	}
	
}

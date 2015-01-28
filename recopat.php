<?php
/*
Plugin Name: recopat
Plugin URI: http://recopat.r-ako.com
Description: So that you can display the form that you created in recopat. recopat is a simple form creation services.
Author:Relyon Ako Inc.
Author URI: http://www.r-ako.com
Version: 1.0
License: GPLv2
Text Domain: recopat
Domain Path: /languages/
*/

/*  Copyright 2012 Relyon Ako Inc. (email : support@r-ako.com)

	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License, version 2, as
	published by the Free Software Foundation.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

function recopat_loaded ( ) {

	$domain = dirname ( plugin_basename ( __FILE__ ) );
	load_plugin_textdomain ( $domain , false , $domain . '/languages/' );

}
add_action ( 'plugins_loaded' , 'recopat_loaded' );


function add_recopat_scripts ( ) {

	wp_enqueue_script ( 'get_form_api' , plugins_url ( "js/get_form_api.js",  __FILE__ ) );
	wp_enqueue_script ( 'set_form_api' , plugins_url ( "js/set_form_api.js",  __FILE__ ) );
	wp_enqueue_script ( 'recopat_prototype' , plugins_url ( "js/prototype.js",  __FILE__ ) );

}
add_action ( 'wp_enqueue_scripts', 'add_recopat_scripts' );

function recopat_shortcode ( $atts ) {

	extract ( shortcode_atts ( array ( 'html' => date ( "Y" )."/".date ( "m" )."/form.html" ) , $atts ) );

	$upload_dir = wp_upload_dir ( );
	$file = $upload_dir [ "basedir" ]."/".$html;

	$flg = false;
	$js_flg = false;
	$css_flg = false;

	$recopat = "";

	// Read form html file
	if ( file_exists ( $file ) ) {
		if ( ( $fp = fopen ( $file , "r" ) ) !== FALSE ) {
			while ( ( $line = fgets ( $fp , 2000 ) ) !== FALSE ) {

				// Match to html tags
				switch ( true ) {
					case preg_match ( "/\<body/" , $line ) :
						$xml = preg_replace ( "/\<body onload=\"/" , "" , $line );
						$xml = preg_replace ( "/\"\>$/" , "" , $xml );

						$recopat .= '<script type="text/javascript">'.$xml.'</script>';

						$flg = true;
						break;

					case preg_match ( "/\<link/" , $line ) :
						if ( preg_match ( "/href=\"/" , $line ) ) {
							$line = preg_replace ( "/href=\"/" , "href=\"" . get_stylesheet_directory_uri ( )."/" , $line );
							$recopat .= $line;
						}
						break;

					case preg_match ( "/\<style.*\>.*\<\/style\>$/" , $line ) :
						$recopat .= $line;
						break;

					case preg_match ( "/<style.*>$/" , $line ) :
						$recopat .= $line;
						$css_flg = true;
						break;

					case preg_match ( "/<\/style>$/" , $line ) :
						$recopat .= $line;
						$css_flg = false;
						break;

					case preg_match ( "/\<script.*\>\<\/script\>/" , $line ) :
						if ( !preg_match ( "/\"(prototype|set_form_api|get_form_api)/" , $line ) ) {
							$line = preg_replace ( "/src=\"/" , "src=\"" . get_stylesheet_directory_uri ( )."/" , $line );
							$recopat .= $line;
						}
						break;

					case preg_match ( "/\<script.*\>$/" , $line ) :
						$recopat .= $line;
						$js_flg = true;
						break;

					case preg_match ( "/\<\/script>$/" , $line ) :
						$recopat .= $line;
						$js_flg = false;
						break;

					default :
						if ( $js_flg || $css_flg ) {
							$recopat .= $line;
						}

						if ( $flg ) {
							if ( preg_match ( "/body/" , $line ) ) {
								$flg = false;
							} else {
								$recopat .= $line;
							}
						}
						break;
				}
			}
			fclose ( $fp );
		}
	}

	return $recopat;

}
add_shortcode ( "recopat" , "recopat_shortcode" );

?>
/*
 * jQuery etScroller v1.0.0 - http://www.enjoitech.com/
 *
 * TERMS OF USE - jQuery etScroller
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2011 Masaki Fujimoto
 * All rights reserved.
 * 
 */

(function( $ ) {

	var methods = {
		init: function(options) {

			var settings = {
				vscroll: true,
				hscroll: false,
				hide: false,
				overflow: false
			};

			return this.each(function(){
				if ( options ) { 
					$.extend( settings, options );
				}

				// create wrapper and container
				var $wrapper = $('<div class="etScroller_wrapper" />');
				var $content = $('<div class="etScroller_content" />');
				$content.append($(this).html());
				$wrapper.append($content);
				$(this).empty();
				$(this).append($wrapper);

				// disable auto text size adjust for iOS
				$(this).css("-webkit-text-size-adjust", "none");

				// change overflow settings of this
				$wrapper.css({
					'width': $(this).width(),
					'height': $(this).height(),
					'position': 'relative',
					'z-index': 0
				});

				if(settings.overflow) {
					$wrapper.css('overflow', "auto");
				}
				else {
					$wrapper.css('overflow', "hidden");
				}

				// change content's styles
				$content.css({position: "absolute", "z-index": 1});

				// create vertical scrollbar
				var $vbar = $('<div class="etScroller_vbar" />');
				var bar_height = $wrapper.height() * $wrapper.height() / $content.height();
				var vmin = -1 * $content.height() + $wrapper.height();	// minimum position that content can go
				var vmax = $wrapper.height() - bar_height;	// maximum position that scrollbar can go
				$vbar.css({
					"width": "12px",
					"height": bar_height + "px",
					"background-color": "#666",
					"position": "absolute",
					"top": 0,
					"right": 0,
					"opacity": 0.3,
					"z-index": 2,
					"border-radius": "6px",
					"-moz-border-radius": "6px",
					"-webkit-border-radius": "6px"
				});
				if($wrapper.height() >= $content.height() || settings.overflow || !settings.vscroll) {
					bar_height = $wrapper.height();
					$vbar.css({height: bar_height + "px", opacity: 0.0});
				}
				$wrapper.append($vbar);

				// create horizontal scrollbar
				var $hbar = $('<div class="etScroller_hbar" />');
				var bar_width = $wrapper.width() * $wrapper.width() / $content.width();
				var hmin = -1 * $content.width() + $wrapper.width();
				var hmax = $wrapper.width() - bar_width;	// maximum position that scrollbar can go
				$hbar.css({
					"width": bar_width + "px",
					"height": "12px",
					"background-color": "#666",
					"position": "absolute",
					"top": $wrapper.height() - 12 + "px",
					"left": 0,
					"opacity": 0.3,
					"z-index": 2,
					"border-radius": "6px",
					"-moz-border-radius": "6px",
					"-webkit-border-radius": "6px"
				});
				if($wrapper.width() >= $content.width() || settings.overflow || !settings.hscroll) {
					bar_width = $wrapper.width();
					$hbar.css({width: bar_width + "px", opacity: 0.0});
				}
				$wrapper.append($hbar);


				// smartphone
				$content.bind('touchstart', function(e){
					var oe = e.originalEvent;
					var pos = $(this).position();
					var first_touch = {'x': oe.touches[0].pageX, 'y': oe.touches[0].pageY};
					var last_touch = {'x': oe.touches[0].pageX, 'y': oe.touches[0].pageY};
					var speed = {'x': 0, 'y': 0};

					$content.stop();
					$vbar.stop();
					$hbar.stop();

					$("body").bind('touchmove', function(evt){
						var oevt = evt.originalEvent;
  
						// save speed and last touch point
						speed = {
							'x': last_touch.x - oevt.touches[0].pageX,
							'y': last_touch.y - oevt.touches[0].pageY
						};
						last_touch = {'x': oevt.touches[0].pageX, 'y': oevt.touches[0].pageY};


						if(settings.vscroll) {
							if (pos.top >= 0 && speed.y < -2) {
								methods.didTouchEnd();
								return;
							}
							else if (pos.top <= vmin && speed.y > 2) {
								methods.didTouchEnd();
								return;
							}
						}

						if(settings.hscroll) {
							if (pos.left >= 0 && speed.x < -2) {
								methods.didTouchEnd();
								return;
							}
							else if (pos.left <= hmin && speed.x > 2) {
								methods.didTouchEnd();
								return;
							}
						}

						var cur_top = parseInt(pos.top) - parseInt(first_touch.y) + parseInt(oevt.touches[0].pageY);
						var cur_left = parseInt(pos.left) - parseInt(first_touch.x) + parseInt(oevt.touches[0].pageX);

						if ( cur_top > 0 ) {
							cur_top = 0;
						}
						else if ( cur_top < vmin ) {
							cur_top = vmin;
						}
						if (cur_left > 0) {
							cur_left = 0;
						}
						else if (cur_left < hmin ) {
							cur_left = hmin;
						}

						evt.preventDefault();

						if(settings.vscroll) {
							$content.css({
								"top": cur_top + "px"
							});
							var bar_top = -1 *  $wrapper.height() * cur_top / $content.height();
							$vbar.css("top", bar_top + "px");
						}
						if(settings.hscroll) {
							$content.css({
								"left": cur_left + "px"
							});
							var bar_left = -1 *  $wrapper.width() * cur_left / $content.width();
							$hbar.css("left", bar_left + "px");
						}
					});
					$("body").bind('touchend', function(evt){

						var cpos = $content.position();

							var last_top = cpos.top - speed.y * 5;
							if ( last_top > 0 ) {
								last_top = 0;
							}
							else if ( last_top < vmin ) {
								last_top = vmin;
							}
							var bar_top = -1 *  $wrapper.height() * last_top / $content.height();

							var last_left = cpos.left - speed.x * 5;
							if ( last_left > 0 ) {
								last_left = 0;
							}
							else if ( last_left < hmin ) {
								last_left = hmin;
							}
							var bar_left = -1 *  $wrapper.width() * last_left / $content.width();

						if(settings.vscroll && settings.hscroll) {
							$content.animate({top: last_top + 'px', left: last_left + 'px'}, 400, 'easeOutQuad');
							$vbar.animate({top: bar_top + 'px'}, 400, 'easeOutQuad');
							$hbar.animate({left: bar_left + 'px'}, 400, 'easeOutQuad');
						}
						else if(settings.hscroll) {
							$content.animate({left: last_left + 'px'}, 400, 'easeOutQuad');
							$hbar.animate({left: bar_left + 'px'}, 400, 'easeOutQuad');
						}
						else if(settings.vscroll) {
							$content.animate({top: last_top + 'px'}, 400, 'easeOutQuad');
							$vbar.animate({top: bar_top + 'px'}, 400, 'easeOutQuad');
						}
						methods.didTouchEnd();
					});
				});

				// viewport change(zoom etc)
				$(window).resize(function(e) {
					bar_height = $wrapper.height() * $wrapper.height() / $content.height();
					$vbar.css({ "height": bar_height + "px" });
					vmin = -1 * $content.height() + $wrapper.height();
					if($wrapper.height() >= $content.height() || settings.overflow || !settings.vscroll) {
						bar_height = $wrapper.height();
						$vbar.css({'height': bar_height + "px", opacity: 0.0});
					}

					bar_width = $wrapper.width() * $wrapper.width() / $content.width();
					$hbar.css({ "width": bar_width + "px" });
					hmin = -1 * $content.width() + $wrapper.width();
					if($wrapper.width() >= $content.width() || settings.overflow || !settings.hscroll) {
						bar_width = $wrapper.width();
						$hbar.css({'width': bar_width + "px", opacity: 0.0});
					}
				});

				if( !settings.overflow ) {

					if( settings.vscroll ) {
						// wheel mouse - horizontal scrolling by wheel isn't supported
						$content.bind('mousewheel DOMMouseScroll', function(e) {
							var delta = 0;
				 			if (!e) e = window.event;
				
						    // normalize the delta
						    if (e.wheelDelta) {
						        // IE and Opera
						        delta = e.wheelDelta / 24;
						    } else if (e.detail) {
						        // W3C
						        delta = -e.detail / 2;
						    }
				
							var pos = $(this).position();
							var new_top = pos.top + delta * 4;
		
							if ( new_top > 0 ) {
								new_top = 0;
								if(pos.top >= 0) {
									return;
								}
							}
							else if ( new_top < vmin ) {
								new_top = vmin;
								if(pos.top <= vmin ) {
									return;
								}
							}
							e.preventDefault();
							var bar_top = -1 *  $wrapper.height() * new_top / $content.height();
				
							$content.css({top: new_top + 'px'});
							$vbar.css({top: bar_top + 'px'});
						});
		
						// normal mouse action on vertical scrollbar
						$vbar.mousedown(function(e){
							var pos = $(this).position();
							var start = pos.top;
							methods.unselectablize();
		
							$("body").mousemove(function(evt){
								evt.preventDefault();
								var cur_top = start + evt.pageY - e.pageY;
								if ( cur_top < 0 ) cur_top = 0;
								if ( cur_top > vmax ) cur_top = vmax;
								$vbar.css("top", cur_top);
		
								var content_top = -1 * $content.height() / $wrapper.height() * cur_top;
								$content.css("top", content_top);
							});
							$("body").mouseup(function(e){
								$(this).unbind('mousemove');
								$(this).unbind('mouseup');
								methods.selectablize();
							});
						});
					}

					if( settings.hscroll ) {
						// normal mouse action on horizontal scrollbar
						$hbar.mousedown(function(e){
							var pos = $(this).position();
							var start = pos.left;
							methods.unselectablize();
		
							$("body").mousemove(function(evt){
								evt.preventDefault();
								var cur_left = start + evt.pageX - e.pageX;
								if ( cur_left < 0 ) cur_left = 0;
								if ( cur_left > hmax ) cur_left = hmax;
								$hbar.css("left", cur_left);
		
								var content_left = -1 * $content.width() / $wrapper.width() * cur_left;
								$content.css("left", content_left);
							});
							$("body").mouseup(function(e){
								$(this).unbind('mousemove');
								$(this).unbind('mouseup');
								methods.selectablize();
							});
						});
					}
				}
			});
		},

		didTouchEnd: function() {
			$("body").unbind('touchmove');
			$("body").unbind('touchend');
		},

		selectablize: function() {
			$("body").css({
				'-moz-user-select':'text',
				'-webkit-user-select':'auto',
				'user-select':'all'
       		}).onselectstart = function() { return true; };

       		$("body").find("*").each(function() {
       			$(this).attr('unselectable', 'off');
       		});
		},

		unselectablize: function() {
			$("body").css({
				'-moz-user-select':'none',
				'-webkit-user-select':'none',
				'user-select':'none'
       		}).onselectstart = function() { return false; };

       		$("body").find("*").each(function() {
       			$(this).attr('unselectable', 'on');
       		});
		},

		debug: function() {
			alert('debug');
		}
	};
	
 	$.fn.etScroller = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
		else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};

})( jQuery );
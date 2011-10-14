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
				$(this).css("-webkit-text-size-adjust", "none");

				// change overflow settings of this
				$wrapper.css({"width": $(this).width(), "height": $(this).height()});
				$wrapper.css("overflow-x", "hidden");
				$wrapper.css("overflow-y", "hidden");
				$wrapper.css("position", "relative");
				$content.css({"position": "absolute", "z-index": 1});
				$content.css({"width": $(this).width()});

				// create scrollbar
				var $bar = $('<div class="etScroller_bar" />');
				var bar_height = $wrapper.height() * $wrapper.height() / $content.height();
				$bar.css({
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
				if($wrapper.height() >= $content.height()) {
					bar_height = $wrapper.height();
					$bar.css({height: bar_height + "px", opacity: 0.0});
				}
				$wrapper.append($bar);

				var min = -1 * $content.height() + $wrapper.height();

				// smartphone
				$content.bind('touchstart', function(e){
					var oe = e.originalEvent;
					var pos = $(this).position();
					var start = pos.top;
					var tstart = oe.touches[0].pageY;
					var last_touch = oe.touches[0].pageY;
					var speed = 0;

					$("body").bind('touchmove', function(evt){
						var oevt = evt.originalEvent;
						speed = last_touch - oevt.touches[0].pageY;
						last_touch = oevt.touches[0].pageY;
						var cur_top = parseInt(start) - parseInt(tstart) + parseInt(oevt.touches[0].pageY);

						if ( cur_top > 0 ) {
							cur_top = 0;
							if( start >= 0 ) {
								return;
							}
						}
						else if ( cur_top < min ) {
							cur_top = min;
							if( start <= min)  {
								return;
							}
						}
						evt.preventDefault();

						$content.css({"top": cur_top + "px"});
						$content.find('p').css({"font-size": "16px"});

						var bar_top = -1 *  $wrapper.height() * cur_top / $content.height();
						$bar.css("top", bar_top + "px");
					});
					$("body").bind('touchend', function(evt){

						var cpos = $content.position();
						var last_top = cpos.top - speed * 5;
						if ( last_top > 0 ) {
							last_top = 0;
						}
						else if ( last_top < min ) {
							last_top = min;
						}
						var bar_top = -1 *  $wrapper.height() * last_top / $content.height();

						$content.animate({top: last_top + 'px'}, 400, 'easeOutQuad');
						$bar.animate({top: bar_top + 'px'}, 400, 'easeOutQuad');

						$(this).unbind('touchmove');
						$(this).unbind('touchend');
					});
				});

				// viewport change(zoom etc)
				$(window).resize(function(e) {
					var bar_height = $wrapper.height() * $wrapper.height() / $content.height();
					$bar.css({ "height": bar_height + "px" });
					min = -1 * $content.height() + $wrapper.height();
				});

				// wheel mouse
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
					else if ( new_top < min ) {
						new_top = min;
						if(pos.top <= min ) {
							return;
						}
					}
					e.preventDefault();
					var bar_top = -1 *  $wrapper.height() * new_top / $content.height();
		
					$content.css({top: new_top + 'px'});
					$bar.css({top: bar_top + 'px'});
				});

				// normal mouse on scrollbar
				$bar.mousedown(function(e){
					var pos = $(this).position();
					var start = pos.top;
					var max = $wrapper.height() - bar_height;
					$("body").css({
						'-moz-user-select':'none',
						'-webkit-user-select':'none',
						'user-select':'none'
               		}).onselectstart = function() { return false; };
               		$("body").find("*").each(function() {
               			$(this).attr('unselectable', 'on');
               		});

					$("body").mousemove(function(evt){
						evt.preventDefault();
						var cur_top = start + evt.pageY - e.pageY;
						if ( cur_top < 0 ) cur_top = 0;
						if ( cur_top > max ) cur_top = max;
						$bar.css("top", cur_top);

						var content_top = -1 * $content.height() / $wrapper.height() * cur_top;
						$content.css("top", content_top);
					});
					$("body").mouseup(function(e){
						$(this).unbind('mousemove');
						$(this).unbind('mouseup');
						$(this).css({
							'-moz-user-select':'text',
							'-webkit-user-select':'auto',
							'user-select':'all'
	               		}).onselectstart = function() { return true; };
					});
				});
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
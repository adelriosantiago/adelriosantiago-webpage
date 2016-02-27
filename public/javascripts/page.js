var Page = (function() {

	var $container = $( '.sliding_one' ),
		$bookBlock = $( '#bb-bookblock' ),
		$items = $bookBlock.children(),
		itemsCount = $items.length,
		current = 0,
		bb = $( '#bb-bookblock' ).bookblock( {
			speed : detectSmoothify(),
			perspective : 2000,
			shadowSides	: 0.8,
			shadowFlip	: 0.4,
			onEndFlip : function(old, page, isLimit) {
				current = page;
				// update TOC current
				updateTOC();
				// updateNavigation
				updateNavigation( isLimit );
				// initialize jScrollPane on the content div for the new item
				/*setJSP( 'init' );*/
				// destroy jScrollPane on the content div for the old item
				/*setJSP( 'destroy', old );*/
			}
		} ),
		$navNext = $( '#bb-nav-next' ),
		$navPrev = $( '#bb-nav-prev' ).hide(),
		$menuItems = $container.find( 'ul.menu-toc > li' ),
		$tblcontents = $( '#tblcontents' ),
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		supportTransitions = Modernizr.csstransitions;


    function detectSmoothify() {
        var smoothify = ['Chrome', 'Firefox', '', '']; //Add browsers in which turning pages should be smoothed
        var BrowserDetect = {
            init: function () {
                this.browser = this.searchString(this.dataBrowser) || "Other";
                this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
            },
            searchString: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var dataString = data[i].string;
                    this.versionSearchString = data[i].subString;

                    if (dataString.indexOf(data[i].subString) !== -1) {
                        return data[i].identity;
                    }
                }
            },
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index === -1) {
                    return;
                }

                var rv = dataString.indexOf("rv:");
                if (this.versionSearchString === "Trident" && rv !== -1) {
                    return parseFloat(dataString.substring(rv + 3));
                } else {
                    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
                }
            },

            dataBrowser: [
                {string: navigator.userAgent, subString: "Edge", identity: "MS Edge"},
                {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
                {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
                {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
                {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
                {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
                {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
            ]

        };
        BrowserDetect.init();

        if (smoothify.indexOf(BrowserDetect.browser) > -1) {
            return 400;
        }
        return 80;
    }

    function init() {
		// initialize jScrollPane on the content div of the first item
		/*setJSP( 'init' );*/
		initEvents();
	}
	
	function initEvents() {
		// add navigation events
		$navNext.on( 'click', function() {
			$(".container-border").animate({ scrollTop: 0 }, "fast", function() {
                bb.next();
                return false;
            });
		});

		$navPrev.on( 'click', function() {
            $(".container-border").animate({ scrollTop: 0 }, "fast", function() {
                bb.prev();
                return false;
            });
		} );
		
		// add swipe events
		$items.on( {
			'swipeleft'		: function( event ) {
				if( $container.data( 'opened' ) ) {
					return false;
				}
				$(".container-border").animate({ scrollTop: 0 }, "fast", function() {
                    bb.next();
                    return false;
                });
			},
			'swiperight'	: function( event ) {
				if( $container.data( 'opened' ) ) {
					return false;
				}
				$(".container-border").animate({ scrollTop: 0 }, "fast", function() {
                    bb.prev();
                    return false;
                });
			}
		} );

		// show table of contents
		$tblcontents.on( 'click', toggleTOC );

		// click a menu item
		$menuItems.on( 'click', function() {
			var $el = $( this ),
				idx = $el.index(),
				
				
				
				jump = function() {
                    $(".container-border").animate({ scrollTop: 0 }, "fast", function() {
                        bb.jump( idx + 1 );
                    });
				};
			
			//current !== idx ? closeTOC( jump ) : closeTOC(); //The old way of jumping pages when the TOC (left side panel) has to close first
			jump(); //The new way to jump between pages
			
			return false;
		} );

		/*// reinit jScrollPane on window resize
		$( window ).on( 'debouncedresize', function() {
			// reinitialise jScrollPane on the content div
			setJSP( 'reinit' );
		} );*/
	}

	/*function setJSP( action, idx ) {
		
		var idx = idx === undefined ? current : idx,
			$content = $items.eq( idx ).children( 'div.content' ),
			apiJSP = $content.data( 'jsp' );
		
		if( action === 'init' && apiJSP === undefined ) {
			$content.jScrollPane({verticalGutter : 0, hideFocus : true });
		}
		else if( action === 'reinit' && apiJSP !== undefined ) {
			apiJSP.reinitialise();
		}
		else if( action === 'destroy' && apiJSP !== undefined ) {
			apiJSP.destroy();
		}

	}*/

	function updateTOC() {
		$menuItems.removeClass( 'menu-toc-current' ).eq( current ).addClass( 'menu-toc-current' );
	}

	function updateNavigation( isLastPage ) {
		
		if( current === 0 ) {
			$navNext.show();
			$navPrev.hide();
		}
		else if( isLastPage ) {
			$navNext.hide();
			$navPrev.show();
		}
		else {
			$navNext.show();
			$navPrev.show();
		}

	}

	function toggleTOC() {
		var opened = $container.data( 'opened' );
		opened ? closeTOC() : openTOC();
	}

	function openTOC() {
		$navNext.hide();
		$navPrev.hide();
		$container.addClass( 'slideRight' ).data( 'opened', true );
	}

	function closeTOC( callback ) {

		updateNavigation( current === itemsCount - 1 );
		$container.removeClass( 'slideRight' ).data( 'opened', false );
		if( callback ) {
			if( supportTransitions ) {
				$container.on( transEndEventName, function() {
					$( this ).off( transEndEventName );
					callback.call();
				} );
			}
			else {
				callback.call();
			}
		}

	}

	return { init : init };

})();

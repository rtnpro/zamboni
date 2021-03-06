// Init site search suggestions and populate the suggestions container.
(function() {
    // MKT search init.
    // Disable suggestions on Gaia for now.
    if (!z.capabilities.gaia || z.enableSearchSuggestions) {
        $('#search #search-q').searchSuggestions($('#site-search-suggestions'),
                                                 processResults, 'MKT');
    }

    var previous_request = null;

    function processResults(settings) {
        if (!settings) {
            return;
        }

        var li_item = template(
            '<li><a href="{url}"><span>{name}</span></a></li>'
        );

        var new_request = $.ajaxCache({
            url: settings['$results'].attr('data-src'),
            data: settings['$form'].serialize() + '&cat=' + settings.category,
            newItems: function(formdata, items) {
                var eventName,
                    listitems = '';

                if (items !== undefined) {
                    $.each(items, function(i, item) {
                        var d = {
                            url: escape_(item.url) || '#'
                        };
                        if (item.name) {
                            d.name = escape_(item.name);
                            // Append the item only if it has a name.
                            listitems += li_item(d);
                        }
                    });
                }

                // Populate suggestions and make them visible.
                if (listitems) {
                    settings['$results'].find('ul').html(listitems);
                    settings['$results'].addClass('visible')
                                        .trigger('resultsUpdated', [items]);
                    $('#site-header').addClass('suggestions');
                }
            }
        });

        abortRequest();
        previous_request = new_request;
    }

    function abortRequest() {
        if (previous_request !== null) {
            previous_request.abort();
            previous_request = null;
        }
    }

    z.page.on('startfragmentload', function() {
        abortRequest();
        $('#site-search-suggestions').trigger('dismiss');
    });

})();

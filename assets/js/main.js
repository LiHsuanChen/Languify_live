/*******************
    LANGUIFY FUNCTIONS
*******************/ 
    $('[data-lang-code]').click(function(){
        $(this).toggleClass('active');
        if ( $('[data-lang-code].active').length > 0 ) {
            $('.btn#filter-languages').removeClass('disabled');
            $('.btn#filter-languages').show('slow');
        } else {
            $('.btn#filter-languages').addClass('disabled');
            $('.btn#filter-languages').hide('slow');
        }
    });

    $('.btn#filter-languages').click(function(){
        var queryValues = ''
        $('[data-lang-code].active').each(function(key){
            queryValues += $(this).data('lang-code') + ',';
        });
        
        if ( queryValues != '' ) {
            window.location.href = "?languages="+queryValues;
        }
    });

/*******************
    GENERAL EVENT BINDINGS
*******************/ 
    //Toggles the view of channels on each product
    $('[data-mytoggler]').click(function(){
        var toToggle = $(this).data('mytoggler');
        $( toToggle ).toggle('slow');
    });

    // Initializing qtip for better tooltips
    $('[title!=""]').qtip({
        position: { my: 'top right', at: 'bottom right' }
    });

    // Initializing table sorter
    var dataTable = $('table').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": false,
        "sDom" : ''
    });
    $('input#search-box').on('keypress focusout', function(){
        dataTable.fnFilter( $(this).val() );
    });

    // Show getting started
    $('a#toggle-getting-started').click(function(){
        $('.row#introduction').toggle('fast');
        $('.row#getting-started').toggle('fast');
    });

    $('a#show-introduction').click(function(){
        $('.row#introduction').show();
        $('.row#getting-started').hide();
        window.location.href = "#introduction";
    });

    $('a#show-getting-started').click(function(){
        $('.row#introduction').hide();
        $('.row#getting-started').show();
        window.location.href = "#getting-started";
    });

    // Feedback submission
    $('.btn[name="send-feedback"]').click(function(){
        var $this = $(this);
        $this.addClass('disabled');

        var email = $('input[name="feedback-email"]').val();
        var message = $('textarea[name="feedback-message"]').val();
        
        if ( message.length == 0 ) {
            alert("Message should not be empty");
            $this.removeClass('disabled');
            return false;
        }

        var r = confirm("Send feedback?");
            if ( r == true ) {
                // User clicked OK
                // Proceed to save this group
                $.ajax({
                    url: '/api/feedbacks',
                    type: 'POST',
                    dataType: "JSON",
                    data: {
                        'email' : email,
                        'message': message
                    },
                    success: function(response) {
                        if ( response.status == 'success' ) {
                            $('input[name="feedback-email"]').attr('disabled', true);
                            $('textarea[name="feedback-message"]').attr('disabled', true);
                            $this.html('<i class="fa fa-check"></i> Message sent');
                        }
                        console.log(response.message);
                    }, 
                    error: function(response) {
                        alert('Fail: API could not be reached.');
                        $this.removeClass('disabled');
                        console.log(response);
                    }
                });
            } else {
                $this.removeClass('disabled');               
            }
    });


    // Persona logout
    $('.btn#user-logout').click(function(){
        navigator.id.logout()
    });

/*******************
    GENERAL HELPER FUNCTIONS
*******************/ 
    /*******************
        Adapted from: 
        http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    *******************/ 
    function shadeColor(color, percent) {  
        var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }

    /*******************
        Adapted from: 
        http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
    *******************/ 
    function rgb2hex(rgb) {
        if (  rgb.search("rgb") == -1 ) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
        }
    }
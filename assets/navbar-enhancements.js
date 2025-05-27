$(document).ready(function(){
    // Fix dropdown scroll issues
    $(window).off('scroll.dropdown');
    
    // Ensure dropdowns stay visible during scroll
    var dropdownTimer;
    $('.ul-menu li').hover(
        function() {
            clearTimeout(dropdownTimer);
            $(this).find('.submenu_ul, .megamenu').show().css('z-index', '999999');
        },
        function() {
            var dropdown = $(this).find('.submenu_ul, .megamenu');
            dropdownTimer = setTimeout(function() {
                dropdown.hide();
            }, 100);
        }
    );
    
    // Override scroll behavior that might hide dropdowns
    $(window).on('scroll', function() {
        if ($('.submenu_ul:hover, .megamenu:hover, .ul-menu li:hover').length > 0) {
            return false;
        }
    });
});

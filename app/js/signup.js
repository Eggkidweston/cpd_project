(function ($) {
    $('input').iCheck({
        checkboxClass: 'icheckbox_minimal-orange',
        radioClass: 'iradio_minimal-orange',
        increaseArea: '20%'
    });
})(jQuery);

(function ($) {
    var firstInput = $('section').find('input[type=text], input[type=email]').filter(':visible:first');
    if (firstInput != null) {
        firstInput.focus();
    }

    // $('section').waypoint(function (direction) {
    //     var target = $(this).find('input[type=text], input[type=email]').filter(':visible:first');
    //     target.focus();
    // }, { offset: 300 }
    // ).waypoint(function (direction) {
    //     var target = $(this).find('input[type=text], input[type=email]').filter(':visible:first');
    //     target.focus();
    // }, {
    //     offset: -400
    // });
    
    // $('[data-animation-delay]').each(function () {
    //     var animationDelay = $(this).data("animation-delay");
    //        alert(animationDelay);
    //     $(this).css({
    //         "-webkit-animation-delay": animationDelay,
    //         "-moz-animation-delay": animationDelay,
    //         "-o-animation-delay": animationDelay,
    //         "-ms-animation-delay": animationDelay,
    //         "animation-delay": animationDelay
    //     });
    // });

        alert();
    $('[data-animation]').waypoint(function (direction) {
        if (direction == "down") {
            $(this).addClass("animated " + $(this).data("animation"));
        }
    }, {
        offset: '90%'
    }).waypoint(function (direction) {
        if (direction == "up") {
            $(this).removeClass("animated " + $(this).data("animation"));
        }
    }, {
        offset: '100%'
    });
})(jQuery);

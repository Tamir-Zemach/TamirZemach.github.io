// assets/js/main.js
(function ($) {
  const $window = $(window),
        $body = $('body'),
        $nav = $('#nav');

  // Breakpoints
  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: [null, '736px'],
  });

  // Initial animation
  $window.on('load', function () {
    window.setTimeout(() => {
      $body.removeClass('is-preload');
    }, 100);
  });

  // Scrolly
  $('#nav a, .scrolly').scrolly({
    speed: 1000,
    offset: () => $nav.height()
  });

  // Formspree AJAX submission
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    fetch('https://formspree.io/f/mjkozwkz', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        form.reset();
        $('#popup').addClass('show');
      } else {
        alert('Oops! Something went wrong.');
      }
    });
  });
})(jQuery);
var dashboard = (function() {
    return{
        gauge: function dashGauge(curVal, maxVal) {
    var opts = {
        angle: 0.5, // The span of the gauge arc
        lineWidth: 0.12, // The line thickness
        radiusScale: 1, // Relative radius


        limitMax: false, // If false, max value increases automatically if value > maxValue
        limitMin: false, // If true, the min value of the gauge will be fixed
        colorStart: '#31cb88', // Colors
        colorStop: '#31cb88', // just experiment with them
        strokeColor: '#eceff1', // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true // High resolution support
    };
    var target = document.getElementById('gauge'); // your canvas element
    var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = maxVal; // set max gauge value
    gauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
    gauge.animationSpeed = 32; // set animation speed (32 is default value)
    gauge.set(curVal); // set actual value
    },
    month:function monthChart() {
        var data = {
            labels: ['محرم', 'صفر', 'ربيع', 'ربيع', 'جماد', 'جماد2', 'رجب'],
            series: [
                [4, 3, 7, 5, 10, 3, 4]
            ]
        };

        var options = {
            seriesBarDistance: 10,
            axisX: {
                // On the x-axis start means top and end means bottom
                showGrid: false
            },
            axisY: {
                // On the y-axis start means left and end means right
                showGrid: false,
                showLabel: false,
                offset: 0
            },
            reverseData: true,
            chartPadding: {
                bottom: 15
            }
        };



        var monthChart = new Chartist.Bar('.month-chart', data, options);
        monthChart.on('draw', function(data) {
            // If this draw event is of type bar we can use the data to create additional content
            if (data.type === 'bar') {
                // We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value


                data.group.append(new Chartist.Svg('circle', {
                    cx: data.x2,
                    cy: data.y2,
                    r: 9
                }, 'ct-slice-pie'));
                data.group.append(new Chartist.Svg('circle', {
                    cx: data.x2,
                    cy: data.y1,
                    r: 9
                }, 'ct-slice-pie'));
            }

        });
    },
    year:function yearChart() {
        var yearChart = new Chartist.Line('.year-chart', {
            labels: [1, 2, 3, 4, 5, 6, 7, 8],
            series: [
                [5, 9, 7, 8, 5, 3, 5, 4]
            ]
        }, {
            low: 0,
            showArea: true,
            areaBase: 0,
            lineSmooth: false,
            chartPadding: {
                top: 5,
                right: 0,
                bottom: 0,
                left: 0
            },
            fullWidth: true,
            axisX: {
                // On the x-axis start means top and end means bottom
                showLabel: false,
                showGrid: false,
                offset: 0
            },
            axisY: {
                // On the y-axis start means left and end means right
                showGrid: false,
                showLabel: false,
                offset: 0
            },
        });
        var seq = 0,
            delays = 80,
            durations = 500;

        // Once the chart is fully created we reset the sequence
        yearChart.on('created', function() {
            seq = 0;
        });
        yearChart.on('draw', function(data) {
            seq++;
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 2000 * data.index,
                        dur: 2000,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                window.data = data
                data.element.animate({
                    y1: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: data.y,
                        easing: 'easeOutQuart'
                    },
                    y2: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: data.y,
                        easing: 'easeOutQuart'
                    },
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'easeOutQuart'
                    }
                });
            }
        });
    }
}
})(dashboard||{})






jQuery(document).ready(function($) {



    $('[data-toggle="tooltip"]').tooltip()


    $('#addEvent').css('transform', 'scale(1)');
    $('#addEvent img').css({
        'transform': 'rotate(0deg)',
        'zoom': 1
    });



    if ($('.event-settings').length > 0) {
        var stretchyNavs = $('.event-settings');

        stretchyNavs.each(function() {
            var stretchyNav = $(this),
                stretchyNavTrigger = stretchyNav.find('.event-settings--trigger');

            stretchyNavTrigger.on('click', function(event) {
                event.preventDefault();
                stretchyNav.toggleClass('event-settings--visible');
            });
        });

        $(document).on('click', function(event) {
            (!$(event.target).is('.event-settings--trigger') && !$(event.target).is('.event-settings--trigger span')) && stretchyNavs.removeClass('event-settings--visible');
        });

    }

// convert image svg into svg

jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

});

// step wizard

 var navListItems = $('div.setup-panel div a'),
          allWells = $('.setup-content'),
          allNextBtn = $('.nextBtn');

  allWells.hide();

  navListItems.click(function (e) {
      e.preventDefault();
      var $target = $($(this).attr('href')),
              $item = $(this);

      if (!$item.hasClass('disabled')) {
        navListItems.removeClass('active');
        $item.addClass('active').removeClass('disabled');
          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();
      }
  });

  allNextBtn.click(function(){
      var curStep = $(this).closest('.setup-content'),
          curStepBtn = curStep.attr('id'),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children('a'),
          curStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]'),
          curInputs = curStep.find('input[type=\'text\'],input[type=\'url\']'),
          isValid = true;

      $('.form-group').removeClass('has-error');
      for(var i=0; i<curInputs.length; i++){
          if (!curInputs[i].validity.valid){
              isValid = false;
              $(curInputs[i]).closest('.form-group').addClass('has-error');
          }
      }

      if (isValid){
              curStepWizard.addClass('done').removeClass('active');
                nextStepWizard.removeClass('disabled').trigger('click');}
  });

  $('div.setup-panel div a').eq(0).trigger('click');


// upload image

if ($('.upload-image').length >0 ) {
    $('.upload-image').uploadPreview({
        width: '100%',
        height: '200px',
        backgroundSize: 'cover',
        fontSize: '16px',
        borderRadius: '2px',
        border: '2px dashed #dedede',
        lang: 'ar', //language
    });
}


});
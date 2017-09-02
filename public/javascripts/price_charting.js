
$(document).ready(function(){

  var seriesOptions = [],
    seriesCounter = 0,
    names = ['bitcoin', 'ethereum'];

/**
 * Create the chart when all data is loaded
 * @returns {undefined}
 */
function createChart() {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
}

$.each(names, function (i, name) {

    $.get('../prices/' + name.toLowerCase(), function (data) {

        seriesOptions[i] = {
            name: name,
            data: data
        };

        // As we're loading the data asynchronously, we don't know what order it will arrive. So
        // we keep a counter and create the chart when all the data is loaded.
        seriesCounter += 1;

        if (seriesCounter === names.length) {
            createChart();
        }
    });
});






 //  $.get( "../prices/XZC", function( res ) {
 //    var ohlc = [],
 //    volume = [],
 //    dataLength = res.data.length,
 //   // set the allowed units for data grouping
 //   groupingUnits = [
 //     [
 //       'hour', // unit name
 //       [4, 12, 24, 48] // allowed multiples
 //     ],
 //     [
 //       'month', [1, 2, 3, 4, 6]
 //     ]
 //   ],
 //
 //   i = 0;
 // for (i; i < dataLength; i += 1) {
 //   ohlc.push([
 //     parseInt(res.data[i].time), // the date
 //     parseFloat(res.data[i].open), // open
 //     parseFloat(res.data[i].high), // high
 //     parseFloat(res.data[i].low), // low
 //     parseFloat(res.data[i].close) // close
 //   ]);
 //
 //   volume.push([
 //     parseInt(res.data[i].time), // the date
 //     parseFloat(res.data[i].volume) // the volume
 //   ]);
 // }
 //
 //
 // // create the chart
 // Highcharts.stockChart('container', {
 //
 //   rangeSelector: {
 //     selected: 1
 //   },
 //
 //   title: {
 //     text: 'Francs'
 //   },
 //
 //   yAxis: [{
 //     labels: {
 //       align: 'right',
 //       x: -3
 //     },
 //     title: {
 //       text: 'OHLC'
 //     },
 //     height: '60%',
 //     lineWidth: 2
 //   }, {
 //     labels: {
 //       align: 'right',
 //       x: -3
 //     },
 //     title: {
 //       text: 'Volume'
 //     },
 //     top: '65%',
 //     height: '35%',
 //     offset: 0,
 //     lineWidth: 2
 //   }],
 //
 //   tooltip: {
 //     split: true
 //   },
 //
 //   series: [{
 //     type: 'candlestick',
 //     name: 'FRN',
 //     upColor: 'green',
 //    color: 'red',
 //     data: ohlc,
 //     dataGrouping: {
 //       units: groupingUnits
 //     }
 //   }, {
 //     type: 'column',
 //     name: 'Volume',
 //     data: volume,
 //     yAxis: 1,
 //     dataGrouping: {
 //       units: groupingUnits
 //     }
 //   }]
 // });
// });


})

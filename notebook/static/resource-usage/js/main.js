// define([
//     'jquery',
//     'base/js/utils'
// ], function ($, utils) {
//     function setupDOM() {
        
//     }

//     function humanFileSize(size) {
//         var i = Math.floor(Math.log(size) / Math.log(1024));
//         return (size / Math.pow(1024, i)).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
//     }

//     var displayMetrics = function () {
//         if (document.hidden) {
//             // Don't poll when nobody is looking
//             return;
//         }
//         $.getJSON({
//             url: utils.get_body_data('baseUrl') + 'api/metrics/v1',
//             success: function (data) {
//                 totalMemoryUsage = humanFileSize(data['rss']);

//                 var limits = data['limits'];
//                 var display = totalMemoryUsage;

//                 if (limits['memory']) {
//                     if (limits['memory']['rss']) {
//                         maxMemoryUsage = humanFileSize(limits['memory']['rss']);
//                         display += " / " + maxMemoryUsage
//                     }
//                     if (limits['memory']['warn']) {
//                         $('#jupyter-resource-usage-display').addClass('jupyter-resource-usage-warn');
//                     } else {
//                         $('#jupyter-resource-usage-display').removeClass('jupyter-resource-usage-warn');
//                     }
//                 }

//                 $('#jupyter-resource-usage-mem').text(display);
//             }
//         });
//     };


// setupDOM();
// displayMetrics();
// setInterval(displayMetrics, 1000 * 5);

// }




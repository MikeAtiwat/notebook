// var bind = function bind(obj) {
//   var slice = [].slice;
//   var args = slice.call(arguments, 1),
//     self = this,
//     nop = function() {
//     },
//     bound = function() {
//       return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
//     };
//   nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
//   bound.prototype = new nop();
//   return bound;
// };
// Function.prototype.bind = Function.prototype.bind || bind ;

// define([
//     'jquery',
//     'base/js/utils'
// ], function ($, utils) {

//     var resource_usage  = function() {
//         setupDOM();
//         displayMetrics();
//         // Update every five seconds, eh?
//         setInterval(displayMetrics, 1000 * 5);

//         document.addEventListener("visibilitychange", function () {
//             // Update instantly when user activates notebook tab
//             // FIXME: Turn off update timer completely when tab not in focus
//             if (!document.hidden) {
//                 displayMetrics();
//             }
//         }, false);       
//     }

//     function setupDOM() {
//         $('#maintoolbar-container').append(
//             $('<div>').attr('id', 'jupyter-resource-usage-display')
//                 .addClass('btn-group')
//                 .addClass('pull-right')
//                 .append(
//                     $('<strong>').text('Memory: ')
//                 ).append(
//                 $('<span>').attr('id', 'jupyter-resource-usage-mem')
//                     .attr('title', 'Actively used Memory (updates every 5s)')
//             )
//         );
//         // FIXME: Do something cleaner to get styles in here?
//         $('head').append(
//             $('<style>').html('.jupyter-resource-usage-warn { background-color: #FFD2D2; color: #D8000C; }')
//         );
//         $('head').append(
//             $('<style>').html('#jupyter-resource-usage-display { padding: 2px 8px; }')
//         );
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

// });
define([
    'jquery',
    'base/js/utils'
], function ($, utils) {

    var ResourceUsage  = function() {
        setupDOM();
        displayMetrics();
        // Update every five seconds, eh?
        setInterval(displayMetrics, 1000 * 2);

        document.addEventListener("visibilitychange", function () {
            // Update instantly when user activates notebook tab
            // FIXME: Turn off update timer completely when tab not in focus
            if (!document.hidden) {
                displayMetrics();
            }
        }, false);       
    }

    function setupDOM() {
        $('#maintoolbar-container').append(
            $('<div>').attr('id', 'jupyter-resource-usage-display')
                .addClass('btn-group')
                .addClass('pull-right')
                .append(
                    $('<strong>').text('Memory: ')
                ).append(
                $('<span>').attr('id', 'jupyter-resource-usage-mem')
                    .attr('title', 'Actively used Memory (updates every 5s)')
            )
                .append(
                    $('<div>').attr('id', 'MemProgress').append($('<div>').attr('id', 'MemBar'))
                    )
                .append(
                    $('<strong>').text(' CPU: ')
                ).append(
                $('<span>').attr('id', 'jupyter-resource-usage-cpu')
                    .attr('title', 'Actively used CPU (updates every 5s)')
            )
                .append(
                    $('<div>').attr('id', 'CpuProgress').append($('<div>').attr('id', 'CpuBar'))
                    )
        );


        // FIXME: Do something cleaner to get styles in here?
        $('head').append(
            $('<style>').html('.jupyter-resource-usage-warn { background-color: #FFD2D2; color: #D8000C; }')
        );
        $('head').append(
            $('<style>').html('#jupyter-resource-usage-display { padding: 2px 8px; }')
        );
    }

    function humanFileSize(size) {
        var i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    var displayMetrics = function () {
        if (document.hidden) {
            // Don't poll when nobody is looking
            return;
        }
        $.getJSON({
            url: utils.get_body_data('baseUrl') + 'api/metrics/v1',
            success: function (data) {
                totalMemoryUsage = humanFileSize(data['rss']);

                var limits = data['limits'];
                var totalCpuUsage = data['cpu_percent'];
                if (totalCpuUsage >= 100){
                    totalCpuUsage = 100;
                }
                var display = totalMemoryUsage;
                var display_cpu = totalCpuUsage;


                if (limits['memory']) {
                    if (limits['memory']['rss']) {
                        maxMemoryUsage = humanFileSize(limits['memory']['rss']);
                        display += " / " + maxMemoryUsage
                        var percent_use_mem = (data['rss']/limits['memory']['rss'])*25
                        var e_mem = document.getElementById("MemBar");
                        e_mem.style.width = percent_use_mem + "px"
                        // console.log(membar.style)
                    }
                    if (limits['memory']['warn']) {
                        $('#jupyter-resource-usage-display').addClass('jupyter-resource-usage-warn');
                    } else {
                        $('#jupyter-resource-usage-display').removeClass('jupyter-resource-usage-warn');
                    }
                }

                $('#jupyter-resource-usage-mem').text(display);
                $('#jupyter-resource-usage-cpu').text(display_cpu);
                var e_cpu = document.getElementById("CpuBar");
                var width_cpu = totalCpuUsage*0.25
                if (totalCpuUsage >= 80) {
                    e_cpu.style.backgroundColor = "red";
                }else{
                    e_cpu.style.backgroundColor = "green";
                }
                e_cpu.style.width = width_cpu + "px"
            }
        });
    };
    return {'ResourceUsage': ResourceUsage};

});
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'require',
    './toolbar',
    './celltoolbar',
    'base/js/i18n',
    'base/js/utils'
], function($, requirejs, toolbar, celltoolbar, i18n, utils) {
    "use strict";

    var MainToolBar = function (selector, options) {
        /**
         * Constructor
         *
         * Parameters:
         *  selector: string
         *  options: dictionary
         *      Dictionary of keyword arguments.
         *          events: $(Events) instance
         *          notebook: Notebook instance
         **/
        toolbar.ToolBar.apply(this, [selector, options] );
        this.events = options.events;
        this.notebook = options.notebook;

        this._make();
        this._create_resource();
        displayMetrics();
        setInterval(displayMetrics, 1000 * 5);
        document.addEventListener("visibilitychange", function () {
            // Update instantly when user activates notebook tab
            // FIXME: Turn off update timer completely when tab not in focus
            if (!document.hidden) {
                displayMetrics();
            }
        }, false);

        Object.seal(this);
    };

    MainToolBar.prototype = Object.create(toolbar.ToolBar.prototype);

    MainToolBar.prototype._create_resource = function() {
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
        );
        $('#maintoolbar-container').append(
            $('<div>').attr('id', 'jupyter-resource-usage-display')
                .addClass('btn-group')
                .addClass('pull-right')
                .append(
                    $('<strong>').text('CPU: ')
                ).append(
                $('<span>').attr('id', 'jupyter-resource-usage-cpu')
                    .attr('title', 'Actively used CPU (updates every 5s)')
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

    MainToolBar.prototype._human_file_size = function (size) {
        var i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    function humanFileSize(size) {
        var i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    var displayMetrics = function () {
       
      $.getJSON({url: utils.get_body_data('baseUrl') + 'api/metrics/v1/list',
            success: function (data) {
        console.log(utils.get_body_data(data))}
      })
        if (document.hidden) {
            // Don't poll when nobody is looking
            return;
        }
        $.getJSON({
            url: utils.get_body_data('baseUrl') + 'api/metrics/v1',
            success: function (data) {
                var totalMemoryUsage = humanFileSize(data['rss']);
                var totalCpuUsage = data['cpu_percent'];
                // console.log(totalMemoryUsage)
                // console.log(data)
                var limits = data['limits'];
                var display_mem = totalMemoryUsage;
                var display_cpu = totalCpuUsage;

                if (limits['memory']) {
                    if (limits['memory']['rss']) {
                        var maxMemoryUsage = humanFileSize(limits['memory']['rss']);
                        display_mem += " / " + maxMemoryUsage
                    }
                    if (limits['memory']['warn']) {
                        $('#jupyter-resource-usage-display').addClass('jupyter-resource-usage-warn');
                    } else {
                        $('#jupyter-resource-usage-display').removeClass('jupyter-resource-usage-warn');
                    }
                }

                $('#jupyter-resource-usage-cpu').text(display_cpu);
                $('#jupyter-resource-usage-mem').text(display_mem);
            }
        });
    };

    MainToolBar.prototype._make = function () {
        var grps = [
          [
            ['jupyter-notebook:save-notebook'],
            'save-notbook'
          ],
          [
            ['jupyter-notebook:save-notebook'],
            'save-notbook'
          ],
          [
            ['jupyter-notebook:save-notebook'],
            'save-notbook'
          ],
          [
            ['jupyter-notebook:save-notebook', 'jupyter-notebook:insert-cell-below', 'jupyter-notebook:save-notebook'],
            'save-notbook'
          ],
          [
            ['jupyter-notebook:insert-cell-below'],
            'insert_above_below'],
          [
            ['jupyter-notebook:cut-cell',
             'jupyter-notebook:copy-cell',
             'jupyter-notebook:paste-cell-below'
            ] ,
            'cut_copy_paste'],
          [
            ['jupyter-notebook:move-cell-up',
             'jupyter-notebook:move-cell-down'
            ],
            'move_up_down'],
          [ [new toolbar.Button('jupyter-notebook:run-cell-and-select-next',
                {label: i18n.msg._('Run')}),
             'jupyter-notebook:interrupt-kernel',
             'jupyter-notebook:confirm-restart-kernel',
             'jupyter-notebook:confirm-restart-kernel-and-run-all-cells'
            ],
            'run_int'],
         ['<add_celltype_list>'],
         [
           ['jupyter-notebook:show-command-palette'],
           'cmd_palette']
        ];
        this.construct(grps);
    };

    MainToolBar.prototype._pseudo_actions = {};

    // add a cell type drop down to the maintoolbar.
    // triggered when the pseudo action `<add_celltype_list>` is
    // encountered when building a toolbar.
    MainToolBar.prototype._pseudo_actions.add_celltype_list = function () {
        var that = this;
        var multiselect = $('<option/>').attr('value','multiselect').attr('disabled','').text('-');
        var sel = $('<select/>')
            .attr('id','cell_type')
            .attr('aria-label', i18n.msg._('combobox, select cell type'))
            .attr('role', 'combobox')
            .addClass('form-control select-xs')
            .append($('<option/>').attr('value','code').text(i18n.msg._('Code')))
            .append($('<option/>').attr('value','markdown').text(i18n.msg._('Markdown')))
            .append($('<option/>').attr('value','raw').text(i18n.msg._('Raw NBConvert')))
            .append($('<option/>').attr('value','heading').text(i18n.msg._('Heading')))
            .append(multiselect);
        this.notebook.keyboard_manager.register_events(sel);
        this.events.on('selected_cell_type_changed.Notebook', function (event, data) {
            if (data.editable === false) {
                sel.attr('disabled', true);
            } else {
                sel.removeAttr('disabled');
            }

            if (that.notebook.get_selected_cells_indices().length > 1) {
                multiselect.show();
                sel.val('multiselect');
            } else {
                multiselect.hide();
                if (data.cell_type === 'heading') {
                    sel.val('Markdown');
                } else {
                    sel.val(data.cell_type);
                }
            }
        });
        sel.change(function () {
            var cell_type = $(this).val();
            switch (cell_type) {
            case 'code':
                that.notebook.cells_to_code();
                break;
            case 'markdown':
                that.notebook.cells_to_markdown();
                break;
            case 'raw':
                that.notebook.cells_to_raw();
                break;
            case 'heading':
                that.notebook._warn_heading();
                that.notebook.to_heading();
                sel.val('markdown');
                break;
            case 'multiselect':
                break;
            default:
                console.log(i18n.msg._("unrecognized cell type:"), cell_type);
            }
            that.notebook.focus_cell();
        });
        return sel;

    };

    return {'MainToolBar': MainToolBar};
});

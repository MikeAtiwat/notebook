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

    var ToolCell = function (selector, options) {
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
  

        Object.seal(this);
    };

    ToolCell.prototype = Object.create(toolbar.ToolBar.prototype);


    ToolCell.prototype._make = function () {
        var grps = [
          [
            ['jupyter-notebook:insert-select-cell-below','jupyter-notebook:insert-markdown-below'],
            'insert_above_below']
        ];
        this.construct(grps);
    };

    ToolCell.prototype._pseudo_actions = {};

    // add a cell type drop down to the maintoolbar.
    // triggered when the pseudo action `<add_celltype_list>` is
    // encountered when building a toolbar.
    ToolCell.prototype._pseudo_actions.add_celltype_list = function () {
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

    return {'ToolCell': ToolCell};
});

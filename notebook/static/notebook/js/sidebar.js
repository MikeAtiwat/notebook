// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'base/js/utils',
], function($, utils){
    "use strict";

    var SideBar = function (selector) {
        this.selector = selector;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.bind_events();
        }
    };


    SideBar.prototype.bind_events = function () {
        var that = this;
        this.element.find("#open_btn").click(function () {
			  document.getElementById("mySidebar").style.width = "250px";
			  document.getElementById("main").style.marginLeft = "250px";
			  document.getElementById('open_btn').id = 'close_btn';
        });
        this.element.find("#close_btn").click(function () {
			  document.getElementById("mySidebar").style.width = "0";
			  document.getElementById("main").style.marginLeft = "0";
			  document.getElementById('close_btn').id = 'open_btn';
        });
    };

    return {'SideBar': SideBar};
});



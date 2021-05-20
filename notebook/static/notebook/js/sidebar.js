// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'base/js/utils',
], function($, utils){
    "use strict";

    var SideBar = function (selector) {
        this.selector = selector;
        this.open = false;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.bind_events();
        }
    };


    SideBar.prototype.bind_events = function () {
        var that = this;
        var open_true = this.open
        this.element.find("#open_btn").click(function () {
        if(!open_true){
			  document.getElementById("mySidebar").style.width = "250px";
			  document.getElementById("main").style.marginLeft = "250px";
			  this.open = true;
    	}else{
			  document.getElementById("mySidebar").style.width = "0";
			  document.getElementById("main").style.marginLeft = "0";
			  this.open = false;    		
    	}
    
    });
    };
    return {'SideBar': SideBar};
});

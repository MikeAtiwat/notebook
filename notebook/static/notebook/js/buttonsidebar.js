// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'base/js/utils',
], function($, utils){
    "use strict";

    var ButtonSideBar = function (selector) {
        this.selector = selector;
        this.open = false;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.bind_events();
        }
    };


    ButtonSideBar.prototype.bind_events = function () {
        var that = this;
        this.element.find("#open_btn").click(function () {
         var open_true = this.open
         console.log(open_true)
        if(!open_true){
        document.getElementById("mySidebar").style.width = "1000px";
        // document.getElementById("main").style.marginRight = "250px";
        document.getElementById("site").style.marginRight = "1000px";
        document.getElementById("notebook_panel").style.marginRight = "1000px";
        document.getElementById("header").style.marginRight = "1000px";
        this.open = true;
      }else{
        document.getElementById("mySidebar").style.width = "0";
        // document.getElementById("main").style.marginRight = "0";
        document.getElementById("site").style.marginRight = "0";
        document.getElementById("notebook_panel").style.marginRight = "0";
        document.getElementById("header").style.marginRight = "0";
        this.open = false;        
      }

    
    });
    };


    return {'ButtonSideBar': ButtonSideBar};
});
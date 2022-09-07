sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function(Controller) {
    'use strict';
    return Controller.extend("vkc.mkt.stk.controller.BaseController",{
    x: "Kesav",
    pi: 3.14,
    haveSomeReuseFunction: function(){
        alert("Executed from the BaseController");
    }
    

    })
});
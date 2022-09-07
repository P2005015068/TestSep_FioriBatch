sap.ui.define([
    'vkc/mkt/stk/controller/BaseController',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller,Filter,FilterOperator) {
    'use strict';
    return Controller.extend("vkc.mkt.stk.controller.view1",{
    onInit: function(){
         // this.haveSomeReuseFunction();
         // we get the router object from Component.js
         this.oRouter =  this.getOwnerComponent().getRouter();
    },
    onPressView1: function(sFruitIndex){
        this.oRouter.navTo("second",{
            fruitId:sFruitIndex
        });
        // Get the Parent Object
        //  var oAppCon = this.getView().getParent();
        // Navigate to Second View
        // oAppCon.to("idView2");
    },
    onDelete: function(oEvent){
        // Get the object of the listitem on which the user clicked to delete
        var itemToBeDeleted = oEvent.getParameter("listItem");
        // get the object of the list control
        // var oList = this.getView().byId("idList"); instead the below statement object of the list control.
        var oList = oEvent.getSource();
        // ask list control to delete the item
        oList.removeItem(itemToBeDeleted);
    },

    onListItemSelect: function(oEvent){
        // get the item which was selected by the user
        var oSelectedItem = oEvent.getParameter("listItem");
        // path of the element(memory) of the selected item
        var sPath = oSelectedItem.getBindingContextPath();
        // get the view2 object
        //var oSplitApp = this.getView().getParent().getParent();
        // var oView2 = oSplitApp.getDetailPages()[0];
        // bind the element of selected item to v2 -element binding
        //oView2.bindElement(sPath);
        // what I want to add extra coding tomorrow
        // --> /fruits/3
        var sIndex = sPath.split("/")[sPath.split("/").length - 1];
        this.onPressView1(sIndex);
        // extra coding
    },
    onSearch: function(oEvent){
      // Step1: get to know what is searched by user
         var sText = oEvent.getParameter("query");
      // step2: Construct a filter object
        
         var oFilter1 = new Filter("Category" ,FilterOperator.Contains, sText);
        //  var oFilter2 = new Filter("type" ,FilterOperator.Contains, sText);
      // Step3: Get the List object
        //  var aFilter = [oFilter1,oFilter2]
        //  var oFilter = new Filter({
        //       filters:aFilter,
        //       and:false
        //  });    
         var oList = this.getView().byId("idList");
      // Step4: Inject the filter inside the bining of the items
         oList.getBinding("items").filter(oFilter1);
    },
    onAddProduct: function(){
        this.oRouter.navTo("add");
    }

    })
});
sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("vkc.mkt.stk.Component",{
        // metadata is used link our manifest file because all the application configuration
        // will be contained inside the manifest
    metadata: {
          manifest: "json"
    },
    // init function is like Initialisation of our component file usally we will
    // call the base class contructor 
    init: function(){
        //super->constructor();  the syntax to call constructor in Abap
         UIComponent.prototype.init.apply(this);
         // Get Router from parent class
         var oRouter = this.getRouter();
         // scan manifest.json for routing configuration
         oRouter.initialize();
    },
    // We will initalise view and return back
    // createContent: function(){
    //     // Instantiate(Create Object) of root vew
    //     var oView = sap.ui.view({
    //        viewName: "vkc.mkt.stk.view.App",
    //        id: "idAppView",
    //        type: "XML"
    //     })
    //     // create both views object
    //     var oView1 = sap.ui.view({
    //         viewName: "vkc.mkt.stk.view.view1",
    //         id: "idView1",
    //         type: "XML"
    //      })
    //      var oView2 = sap.ui.view({
    //         viewName: "vkc.mkt.stk.view.view2",
    //         id: "idView2",
    //         type: "XML"
    //      })
    //      // Get the Container control object which is inside the root view
    //      var oAppContainerControl = oView.byId("idAppCon");
    //      // Add views inside the Container control - Pages aggregatin and addPage method 
    //      return oAppContainerControl.addMasterPage(oView1).addDetailPage(oView2);
    // },
    // Destructor - Clean up the code
    destroy: function(){

    }
    })
});
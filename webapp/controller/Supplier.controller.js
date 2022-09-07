sap.ui.define([
    'vkc/mkt/stk/controller/BaseController'
], function(Controller) {
    'use strict';
    return Controller.extend("vkc/mkt/stk/controller/Supplier",{
       onInit: function(){
           this.oRouter = this.getOwnerComponent().getRouter();
           this.oRouter.getRoute("suppl").attachMatched(this.herculis, this);        
       },
       herculis: function(oEvent){
           var sSupplierId = oEvent.getParameter("arguments").supplierId;
           var sPath = "/suppliers/"+sSupplierId;
           this.getView().bindElement(sPath);
       }
        
    });
});
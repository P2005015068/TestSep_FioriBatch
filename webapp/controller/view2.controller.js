sap.ui.define([
    'vkc/mkt/stk/controller/BaseController',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/DisplayListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller,MessageBox,MessageToast,Fragment,DisplayListItem,Filter,FilterOperator) {
    'use strict';
    return Controller.extend("vkc.mkt.stk.controller.view2",{
    onInit: function(){
          // Step 1: get the router object from the component
          this.oRouter = this.getOwnerComponent().getRouter();
          // Step 2: I register a routeMatched function which will get called
                 // every timewe navigate or reach to detail route
          this.oRouter.getRoute("second").attachMatched(this.herculis,this);
    },
    herculis: function(oEvent){
        // step 1: whatever is the end point - extract the fruit id
           var sFruitId = oEvent.getParameter("arguments").fruitId;
        // step 2: construct the path of the element
           var sPath = "/"+sFruitId;
        // step 3: Bind the element with my current view
           this.getView().bindElement(sPath, {
            expand: "ToSupplier"
           });
    },
    onSupplierSelect: function(oEvent){
           // step 1: get the selected item of the object from the table
           var oSelectedItem = oEvent.getParameter("listItem");
           // step 2: get the path of the selected item(Memory Location)
           var sPath = oSelectedItem.getBindingContextPath();
           // step 3: Extract index
           var sIndex = sPath.split("/")[sPath.split("/").length - 1];
           // step 4: Drill down to next screen by passing the index of the supplier
           this.oRouter.navTo("suppl",{
               supplierId : sIndex
           });   
           
    },
    oSupplierPopup:null,
    onFilterSupplier: function(){
          var that=this;
          if(!this.oSupplierPopup){
                Fragment.load({
                fragmentName:"vkc.mkt.stk.fragments.popup",
                type:"XML",
                id:"supplier",
                controller:this
             }).then(function(oFragment){
                //inside the callback/promise, we cannot access the pointer viz. our controller object
                //but we can access local variables of caller function
                that.oSupplierPopup=oFragment;
                that.oSupplierPopup.setTitle("suppliers")
                //Grant the access of all  resources which view also has access to - model
                //allowing parasite(fragment) to access body part(model) through immune system(view)
                that.getView().addDependent(that.oSupplierPopup);
                that.oSupplierPopup.bindAggregation("items",{
                     path:'/suppliers',
                     template: new DisplayListItem({
                           label:'{name}',
                           value:'{city}'
                     })
                });
                that.oSupplierPopup.open();
             }); 
          }
          else{
              this.oSupplierPopup.open();
          }
            
    },
    oCityPopup:null,
    oField:null,
    onCityHelp: function(oEvent){
        this.oField=oEvent.getSource();
        var that=this;
        if(!this.oCityPopup){
             Fragment.load({
                 fragmentName:"vkc/mkt/stk/fragments/popup",
                 id:"city",
                 type:"XML",
                 controller:this
             }).then(function(oFragment){
                 that.oCityPopup=oFragment,
                 that.oCityPopup.setTitle("Cities");
                 that.oCityPopup.setMultiSelect(false);
                 that.getView().addDependent(that.oCityPopup);
                 that.oCityPopup.bindAggregation("items",{
                      path:'/cities',
                      template: new DisplayListItem({
                          label:"{name}",
                          value:"{famousFor}"
                      }) 
                 });
                 that.oCityPopup.open();
             });
            }
        else{
          this.oCityPopup.open();  
        }
    },
    onSearchPopup: function(oEvent){
      // step 1:  what user type in search field
         var sValueToBeSearched = oEvent.getParameter("value");
      // step 2: prepare a filter for  search
         var oFilter = new Filter("name",FilterOperator.Contains,sValueToBeSearched);
      // step 3: Inject Filter
         var oPopup = oEvent.getSource();
         oPopup.getBinding("items").filter(oFilter);
    },
    onConfirm: function(oEvent){
         // we need to read Id of the fragment because of that this confirm event triggered.
         var sId = oEvent.getSource().getId();
         if (sId.indexOf("city") != -1)
         {
            //step 1: get the selected Item
             var oSelectedItem = oEvent.getParameter("selectedItem");
           //step 2: Get the data of selected Item
            var sData = oSelectedItem.getLabel();
       
          //step 3: We need the object of the input field and set the data
           this.oField.setValue(sData);
         }
         else{
            var aSelItem = oEvent.getParameter("selectedItems");
            var aFilter = [];

            //consturct a new filter object
            for(let i = 0; i < aSelItem.length; i++){
               const oElement = aSelItem[i];
               aFilter.push(new Filter("name",FilterOperator.EQ, oElement.getLabel()));                
            } 
            // Inject the filter with the table with OR operator
            var oFilter = new Filter({
                filters:aFilter,
                and:false
            });
            var oTable = this.getView().byId("idTabSupp");
            oTable.getBinding("items").filter(oFilter);
         }         
        
    },
    onSave: function(){
        var oResource= this.getView().getModel('i18n');
        var oResourceBundle = oResource.getResourceBundle();
        MessageBox.confirm("Do you Want to Save",{
            onClose: function(status){
                if (status === "OK"){
                    var oMsgText = oResourceBundle.getText("XMSG_SUCCESS");
                    MessageToast.show(oMsgText);
                }else
                {
                    MessageBox.error("oops! Something is wrong with us ");
                }
                
            }
        });
    }

    })
});
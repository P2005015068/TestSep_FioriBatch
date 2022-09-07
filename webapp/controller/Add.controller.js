sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    "sap/ui/core/Fragment",
    "sap/m/DisplayListItem",
], function(Controller,JSONModel,MessageToast,MessageBox,Fragment,DisplayListItem) {
    'use strict';
    return Controller.extend("vkc.mkt.stk.controller.Add",{
    onInit: function(){
        var oJSONModel = new JSONModel();
        // Local Model with already tested payload which needs to be 
        // sent to OData Services
        oJSONModel.setData({
           "prodData": {
                "ProductID": "",
                "TypeCode": "PR",
                "Category": "Notebooks",
                "Name": "",
                "Description": "",
                "SupplierID": "0100000046",
                "SupplierName": "SAP",
                "CurrencyCode": "USD",
                "Price": "0.00",
                "DimUnit": "CM",
                "TaxTarifCode": 1,
                "NameLanguage": "EN",
                "DescriptionLanguage": "EN",
                "MeasureUnit": "EA"
           }
        });
        this.getView().setModel(oJSONModel,"great");
        this.oLocalModel = oJSONModel;
        this.setMode("Create");
    },
    onClear: function(){
       this.oLocalModel.setData({
        "prodData": {
            "ProductID": "",
            "TypeCode": "PR",
            "Category": "Notebooks",
            "Name": "",
            "Description": "",
            "SupplierID": "0100000046",
            "SupplierName": "SAP",
            "CurrencyCode": "USD",
            "Price": "0.00",
            "DimUnit": "CM",
            "TaxTarifCode": 1,
            "NameLanguage": "EN",
            "DescriptionLanguage": "EN",
            "MeasureUnit": "EA"
          }
       });
       this.setMode("Create");
    },
    onSave: function(){
        //Steo 1: Prepare Payload and perform pre-checks
        var oPayload = this.oLocalModel.getProperty("/prodData");
        if (!oPayload.ProductID || !oPayload.Name){
            MessageBox.error("Dude, Please enter Correct Data");
            return;
        }
        //Step 2: get the data model object
        var oDataModel = this.getView().getModel();
        //Step 3: trigger the Post request to send the data from fiori to sap
        if(this.mode === "Create") {
        oDataModel.create("/ProductSet",oPayload,{
            //Step 4: Handle Call backs - if Save was Success
            success: function(){
                  MessageToast.show("This Record have been saved to SAP S4/HANA");     
                  },
             //Step 4: Handle Call backs - if Save failed in SAP
            error: function(oError){
                MessageToast.show("Oops! save has been rejected");     
                }
        });
        } else {
            oDataModel.update("/ProductSet('"+ this.prdID +"')",oPayload,{
            //Step 4: Handle Call backs - if Update was Success
            success: function(){
                    MessageToast.show("This Record have been Updated to SAP S4/HANA");     
                    },
               //Step 4: Handle Call backs - if Save failed in SAP
              error: function(oError){
                  MessageToast.show("Oops! Update has been rejected");     
                  }
            });
        }
        
    },
    onDelete:function(oEvent){
           //Step 1: get OData model object
           var oDataModel = this.getView().getModel();
           //Step 2: call delete - remove 
           var that = this;
           oDataModel.remove("/ProductSet('"+ this.prdID +"')",{
               success: function(){
                  //Step 3: Handle Call Back
                  MessageToast.show(" Deleted is now finished!"); 
                  that.onClear();
               }
           });  
    },
    mode:"Create",
    prdID:null,
    setMode:function(sMode){
        this.mode = sMode; 
        if(sMode === "Create") {
             this.getView().byId("name").setEnabled(true);
             this.getView().byId("idSave").setText("Save");
             this.getView().byId("idDelete").setEnabled(false);
        }else
        {
            this.getView().byId("name").setEnabled(false);
            this.getView().byId("idSave").setText("Update");
            this.getView().byId("idDesc").focus();
            this.getView().byId("idDelete").setEnabled(true);
        }
    },
    onLoadSingle:function(oEvent){
          //Step 1: Get the Id of the product entered by the user
          this.prdID = oEvent.getSource().getValue();
          this.prdID = this.prdID.toUpperCase();
          oEvent.getSource().setValue(this.prdID);
          //Step 2: send a GET SINGLE Call to our OData using model
          var oDataModel = this.getView().getModel();
          // We can not access this pointer inside the callback so we
          // create a local variable in function which can be accessed  
          // as 'this' inside callbacks
          var that=this;
          oDataModel.read("/ProductSet('"+ this.prdID +"')",{
             success: function(data){
                     //Step 3: Success response - set this to local model
                     that.oLocalModel.setProperty("/prodData",data);
                     that.setMode("Edit");
             },
             error: function(){
                  //Step 4: Handle Error
                  MessageToast.show("The product Does not exist");
                  that.setMode("Create");
             }

          });
          
    },
    oSupplierPopup:null,
    oField:null,
    onF4Supplier: function(oEvent){
        var that=this;
        if(!this.oSupplierPopup){
             Fragment.load({
                 fragmentName:"vkc/mkt/stk/fragments/popup",
                 id:"supplier",
                 type:"XML",
                 controller:this
             }).then(function(oFragment){
                 that.oSupplierPopup=oFragment,
                 that.oSupplierPopup.setTitle("Select Supplier");
                 that.oSupplierPopup.setMultiSelect(false);
                 that.getView().addDependent(that.oSupplierPopup);
                 that.oSupplierPopup.bindAggregation("items",{
                      path:'/BusinessPartnerSet',
                      template: new DisplayListItem({
                          label: "{CompanyName}",
                          value: "{BusinessPartnerID}"
                      }) 
                 });
                 that.oSupplierPopup.open();
             });
            }
        else{
          this.oSupplierPopup.open();  
        }
    },
    onConfirm: function(oEvent){
           //step 1: get the selected Item
            var oSelectedItem = oEvent.getParameter("selectedItem");
          //step 2: Get the data of selected Item
           var sData = oSelectedItem.getValue();
      
         //step 3: We need the object of the input field and set the data
          this.oLocalModel.setProperty("/prodData/SupplierID",sData);
          this.oLocalModel.setProperty("/prodData/SupplierName",oSelectedItem.getLabel());

   }

    })
});

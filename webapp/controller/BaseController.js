sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
    ],
    function(Controller, History) {
      "use strict";
  
      return Controller.extend("FeedbackApp.controller.BaseController", {
        getRouter: function(){
            return this.getOwnerComponent().getRouter();
        },
        navigateTo: function(sStr){
            this.getRouter().navTo(sStr);
        },
        navigateWithParam: function(sStr, sStr1, sStr2){
          this.getRouter().navTo(sStr,{
            sStr1 : sStr2
          });
        },
        onLogOut: function () {
            var oRouter = this.getRouter();
            oRouter.navTo("RouteLoginPage", {}, true);
        },
        getText: function(sValue){
          return this.getView().getModel("i18n").getResourceBundle().getText(sValue);
        },
        getModel: function(sValue){
          return this.getView().getModel(sValue);
        }
      });
    }
  );
  
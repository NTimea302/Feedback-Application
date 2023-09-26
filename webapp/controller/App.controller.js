sap.ui.define(
    [
        "FeedbackApp/controller/BaseController"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("FeedbackApp.controller.App", {
        onInit() {
          this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
          //new JSONModel -> property: logged in
          //set model
          //in main controller verificam
        }
      });
    }
  );
  
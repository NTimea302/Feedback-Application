/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "FeedbackApp/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("FeedbackApp.Component", {
            metadata: {
                manifest: "json",
               
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oGlobalModel = new JSONModel ({
                    loggedIn: false,
                    loggedPNR: ""
                });

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // // set device model
			    // var oDeviceModel = new JSONModel(Device);
			    // oDeviceModel.setDefaultBindingMode("OneWay");
			    // this.setModel(oDeviceModel, "device");

                // set the device model
                this.setModel(oGlobalModel, "oGlobalModel");
                this.setModel(models.createDeviceModel(), "device");
            },
            getContentDensityClass : function () {
                if (!this._sContentDensityClass) {
                    if (!Device.support.touch) {
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
		    }
        });
    }
);
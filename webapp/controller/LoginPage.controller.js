sap.ui.define([
	"FeedbackApp/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'sap/ui/core/Fragment'
], function (Controller, MessageBox, MessageToast, JSONModel, Fragment) {
	"use strict";

	return Controller.extend("FeedbackApp.controller.LoginPage", {

		onInit: function () {
			const oDataLogin = {
				inputEmail: "",
				inputPassword: "",
				isLoginEnabled: false
			};
			var oModelLogin = new JSONModel(oDataLogin);
			this.getView().setModel(oModelLogin, "loginModel");

			const oDataReset = {
				isResetEnabled: false
			}
			var oModelReset = new JSONModel(oDataReset);
			this.getView().setModel(oModelReset, "resetModel");

		},

		onInputChangedReset: function () {
			var oModel = this.getView().getModel("resetModel");
			var oEmail = this.getView().byId("idEmailReset");
			var oEmailValue = oEmail.getValue();
			if (oEmailValue != "") {
				oModel.setProperty("/isResetEnabled", true);
			}
			else {
				oModel.setProperty("/isResetEnabled", false);
			}
		},


		onInputChanged: function () {
			var oModel = this.getView().getModel("loginModel");
			var oEmail = this.getView().byId("idEmail");
			var oEmailValue = oEmail.getValue();
			var oPassword = this.getView().byId("idPassword");
			var oPasswordValue = oPassword.getValue();
			
			oEmail.setValueState("None");
			oPassword.setValueState("None");

			if (oEmailValue != "" && oPasswordValue != "") {
				oModel.setProperty("/isLoginEnabled", true);
			}
			else {
				oModel.setProperty("/isLoginEnabled", false);
			}
		},

		onLoginClick: function () {
			var oGlobalModel = this.getOwnerComponent().getModel("oGlobalModel");
			var oModel = this.getView().getModel();
			var oEmail = this.getView().byId("idEmail");
			var oPnr = this.getView().getModel("idPnr");
			var oEmailValue = oEmail.getValue();
			var oPassword = this.getView().byId("idPassword");
			var oPasswordValue = oPassword.getValue();

			const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail|yahoo|MHP|YAHOO|GMAIL|mhp\.com|ro|en|COM|RO|EN|DE|IT|ES|HU|de|it|es|hu$/;

			if (oEmailValue != "" && oPasswordValue != "") {
				if (!gmailRegex.test(oEmailValue)) {
					MessageBox.error(oEmailValue + " " + this.getText("emailFormatValidationError"));
					oEmail.setValueState("Error");
					oPassword.setValueState("None");
				}
				else {
					oEmailValue = oEmailValue.toUpperCase();
					oPasswordValue = oPasswordValue.toUpperCase();

					oModel.callFunction("/Login", {
						method: "POST",

						urlParameters: { "Email": oEmailValue, "Password": oPasswordValue },
						success: function (oData, response) {
							oEmail.setValue("");
							oPassword.setValue("");
							oEmail.setValueState("None");
							oPassword.setValueState("None");

							const oModel = this.getView().getModel();
							oModel.setProperty("/isLoginEnabled", false);


							if (response.data.MessageText != "Invalid email or password.") {

								oGlobalModel.setProperty("/loggedIn", true);
								oGlobalModel.setProperty("/loggedPNR", response.data.MessagePNR);
								oGlobalModel.setProperty();
								
								this.getRouter().navTo("Main", {
									pnr: response.data.MessagePNR
								});

							}
							else {
								MessageBox.error(this.getText("invalidEmailPassValidationError"));
								oModel.setProperty("/isLoginEnabled", false);
								oEmail.setValueState("Error");
								oPassword.setValueState("Error");
							}

						}.bind(this),
						error: function (oError) {
							MessageToast.show(this.getText("incorrectCredentialsValidationError"), {
								duration: 3000,
								width: "15rem",
								my: "center bottom",
								at: "center bottom",
								of: window,
								offset: "0 -50",
							});
						}.bind(this)
					});
				}
			}

		},

		onForgotClick: function (oEvent) {
			if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "FeedbackApp.view.fragments.ForgotPassword"
				});
			}
			this.pDialog.then(function (oDialog) {
				oDialog.open();
			})
		},

		onRegisterOptionClick: function (oEvent) {
			this.navigateTo("Register");
		},

		onCancelReset: function () {
			this.byId("idForgotPasswordFragment").close();
		},

		onResetClick : function(){
            var oEmail = this.getView().byId("idEmailReset");
            var oEmailValue = oEmail.getValue();
			const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail|yahoo|MHP|YAHOO|GMAIL|mhp\.com|ro|en|COM|RO|EN|DE|IT|ES|HU|de|it|es|hu$/;
            if(oEmailValue != ""){
                if (!gmailRegex.test(oEmailValue)) {
                    MessageToast.show(oEmailValue + " is not a valid email address format!"), {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50",
                    };
                    oEmail.setValueState("Error");
                }
                else{

                    var oModel = this.getView().getModel();
                    oModel.callFunction("/forgotPassword", { 
						        method:"POST",
								urlParameters: {"email_forgot" : oEmailValue},    
								success: function(oData, response) { 
                                    MessageToast.show("You will receive an email with your new password at address " + oEmailValue), {
                                        duration: 3000,
                                        width: "30rem",
                                        my: "center bottom",
                                        at: "center bottom",
                                        of: window,
                                        offset: "0 -50",
                                    };
									this.byId("idForgotPasswordFragment").close();
								}.bind(this),      
								error: function(oError){ 
									MessageToast.show("Email not sent"), {
                                        duration: 3000,
                                        width: "15rem",
                                        my: "center bottom",
                                        at: "center bottom",
                                        of: window,
                                        offset: "0 -50",
                                    };
									this.byId("idForgotPasswordFragment").close();
								}.bind(this)   
								                
					});
                }
            }
        },

	});
});
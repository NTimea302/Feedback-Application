sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("FeedbackApp.controller.RegisterPage", {
		onInit: function () {
			const oData = {
				inputName: "",
				inputEmail: "",
				inputPassword: "",
				inputConfirmPassword: "",
				isRegisterEnabled: false
			};
			const oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "registerModel");
		},

		onNavBackReg: function () {
			this.getOwnerComponent().getRouter().navTo("RouteLoginPage");
		},

		onInputChanged: function () {
			const oModel = this.getView().getModel("registerModel");

			var oName = this.getView().byId("idName");
			var oNameValue = oName.getValue();

			var oEmail = this.getView().byId("idEmail");
			var oEmailValue = oEmail.getValue();

			var oPassword = this.getView().byId("idPassword");
			var oPasswordValue = oPassword.getValue();

			var oConfirmPassword = this.getView().byId("idConfirmPassword");
			var oConfirmPasswordValue = oConfirmPassword.getValue();

			oConfirmPassword.setValueState("None");

			if (oNameValue != "" &&
				oEmailValue != "" &&
				oPasswordValue != "" &&
				oConfirmPasswordValue != "") {
				oModel.setProperty("/isRegisterEnabled", true);
			}
			else {
				oModel.setProperty("/isRegisterEnabled", false);
			}
		},

		onRegisterClick: function () {
			const oModel = this.getView().getModel();

			var oName = this.getView().byId("idName");
			var oNameValue = oName.getValue();

			var oEmail = this.getView().byId("idEmail");
			var oEmailValue = oEmail.getValue();

			var oPassword = this.getView().byId("idPassword");
			var oPasswordValue = oPassword.getValue().toUpperCase();

			var oConfirmPassword = this.getView().byId("idConfirmPassword");
			var oConfirmPasswordValue = oConfirmPassword.getValue().toUpperCase();

			const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail|yahoo|mhp\.com|ro|en|de|it|es|hu$/;

			if (oNameValue != "" &&
				oEmailValue != "" &&
				oPasswordValue != "" &&
				oConfirmPasswordValue != "") {
				var problems = "";
				var problemsCount = 0;
				if (!gmailRegex.test(oEmailValue)) {
					problemsCount += 1;
					problems += oEmailValue + " is not a valid email address format!" + "\n";
					oEmail.setValueState("Error");
					oPassword.setValueState("None");
					oConfirmPassword.setValueState("None");
				}
				if (oPasswordValue != oConfirmPasswordValue) {
					problemsCount += 1;
					problems += "The passwords do not match! Please try again.";
					oConfirmPassword.setValueState("Error");
					oConfirmPassword.setValue("");
					oModel.setProperty("/isRegisterEnabled", false);
				}

				if (problemsCount > 0) {
					MessageBox.error(problems);
				}
				else {
					var d = new Date();
					var oEntry = {
						//PNR: "111000",
						Name: oNameValue.toUpperCase(),
						Email: oEmailValue.toUpperCase(),
						Password: oPasswordValue,
						Career_level: "JUNIOR",
						Fiscal_year: d
					};
					var sPath = '/EmployeeSet';
					oModel.create(sPath, oEntry, {
						success: function (oData) {
							MessageToast.show("Successfully registered", {
								duration: 3000,
								width: "15rem",
								my: "center bottom",
								at: "center bottom",
								of: window,
								offset: "0 -50",
							});

							this.getView().setBusy(false);
							oName.setValue("");
							oEmail.setValue("");
							oPassword.setValue("");
							oConfirmPassword.setValue("");

							oName.setValueState("None");
							oEmail.setValueState("None");
							oPassword.setValueState("None");
							oConfirmPassword.setValueState("None");

							oModel.setProperty("/isRegisterEnabled", false);

							this.getOwnerComponent().getRouter().navTo("RouteLoginPage");
						}.bind(this),
						error: function (oResponse) {
							console.log("Registration on error");
							this.getView().setBusy(false);
							MessageToast.show("Registration error", {
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
	});
})
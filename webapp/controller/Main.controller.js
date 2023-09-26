sap.ui.define([
    './Formatter',
    'FeedbackApp/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/library',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], 
function(Formatter, Controller, JSONModel, mobileLibrary, MessageToast, MessageBox, Fragment, Filter, FilterOperator) {
"use strict";

    return Controller.extend("FeedbackApp.controller.Main", {
        formatter: Formatter,

        onInit: function () {
            const oChangeData = {
                isChangeEnabled: false
            };
            
            setInterval(this.refreshPEGList.bind(this), 10000);

            const oChangeModel = new JSONModel(oChangeData);
            this.getView().setModel(oChangeModel, "changeModel");

            var oRouter = this.getRouter();
            oRouter.getRoute("Main").attachPatternMatched(this._onObjectMatched, this);
            MessageToast.show("Logged in successfully!");
            const oUserData = {
                pnr: "",
                careerLevel: "",
                name: ""
            };
            const oUserModel = new JSONModel(oUserData);
            this.getView().setModel(oUserModel, "userModel");


            const oPEGData = {
                inputBusinessArea: "",
                inputProjectID: "",
                inputProjectName: "",
                inputProjectDays: "",
                inputNameEvaluator: "",
                isRequestEnabled: false
            };
            const oPEGModel = new JSONModel(oPEGData);
			this.getView().setModel(oPEGModel, "PEGModel");


            const oFeedbackData = {
                isSendEnabled: false
            };
            const oFeedbackModel = new JSONModel(oFeedbackData);
			this.getView().setModel(oFeedbackModel, "feedbackModel");
        },

        refreshPEGList: function() {
            var oModel = this.getView().getModel();
            oModel.refresh();
        },

        onNavBack: function () {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            var oRouter = this.getOwnerComponent().getRouter();
            
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } 
            else {
                oRouter.navTo("RouteLoginPage", {}, true);
            }
        },

        onFilterFeedback: function (oEvent) {
            var selected = oEvent.getSource();
            var selectedItem = selected.getSelectedItem(); // Use getSelectedItem() method
            ///sap/opu/odata/sap/Z_CJ2_APP_SRV/EmployeeSet('836100')/EmployeeToPeg?$filter=Status eq 'COMPLETE'
            if (selectedItem) {
                var selectedKey = selectedItem.getKey();
                var selectedText = selectedItem.getText();
            
                console.log("Selected Key: " + selectedKey);
                console.log("Selected Text: " + selectedText);
            }
        },
        
        onSearch: function (oEvent) {
            var sQuery = this.getView().byId("idSearchField").getValue();
            var oTable = this.getView().byId("idPEGTable");
            var oBinding = oTable.getBinding("items");
            
                var aFilters = [];
                if(sQuery){
                    aFilters.push(new Filter("Project_name", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("Name_evaluator", FilterOperator.Contains, sQuery));
                }
                var oSelect = this.getView().byId("idSelect");
                var sStatus = oSelect.getSelectedKey();
                if (sStatus) {
                    aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
                }
                oBinding.filter(aFilters);
        },
        
        onSearchFeedback: function (oEvent) {
            var sQuery = this.getView().byId("idSearchFieldFeedback").getValue();
            var oTable = this.getView().byId("idFeedbackTable");
            var oBinding = oTable.getBinding("items");
        
            var aFilters = [];
        
            if (sQuery) {
                aFilters.push(new Filter("Pnr_sender", sap.ui.model.FilterOperator.EQ, sQuery));
            }
        
            var oBindingContext = this.getView().getBindingContext();
            var sLoggedUserPNR = oBindingContext.getProperty("PNR");
        
            var oSelect = this.getView().byId("idSelect1");
            var sStatus = oSelect.getSelectedKey();
            if (sStatus) {
                if (sStatus === "SENT") {
                    aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
                }
                if (sStatus === "RECEIVED") {
                    aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
                }
            }
            oBinding.filter(aFilters);
        },

        onSearchEnter: function(oEvent) {
            if (oEvent.getParameter("query")) {
                this.applyFilters();
            }
        },

        onFilterFeedback: function(oEvent){
            /// de facut functie care isi da seama unde e pnr-ul logat,la reveived sau la sent
            var oBinding = oTable.getBinding("items");
            
                var aFilters = [];
                if(sQuery){
                    aFilters.push(new Filter("Project_name", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("Name_evaluator", FilterOperator.Contains, sQuery));
                }
                var oSelect = this.getView().byId("idSelect");
                var sStatus = oSelect.getSelectedKey();
                if (sStatus) {
                    aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
                }
                oBinding.filter(aFilters);
        },

        onStatusSelectChange: function() {
            this.applyFilters();
        },


        applyFilters: function(oEvent) {
            var oTable = this.getView().byId("idPEGTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            // Filter based on SearchField value
            var oSearchField = this.getView().byId("idSearchField");
            var sQuery = oSearchField.getValue();
            alert(sQuery);
            if(!sQuery){
                oBinding.filter([]);
            }
            else{
                aFilters.push(new Filter("Project_name", FilterOperator.Contains, sQuery));
                aFilters.push(new Filter("Name_evaluator", FilterOperator.Contains, sQuery));
            }

            // Filter based on Select value
            var oSelect = this.getView().byId("idSelect");
            var sStatus = oSelect.getSelectedKey();
            if (sStatus) {
                aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
            }
            oBinding.filter(aFilters);
        },

        onInputChanged : function(){
            const oModel = this.getView().getModel("changeModel");
            var oEmail = this.getView().byId("idEmailChange");
            var oEmailValue = oEmail.getValue();  
            var oNewPassword = this.getView().byId("idNewPassword");
            var oNewPasswordValue = oNewPassword.getValue();
            var oNewPasswordConfirmed = this.getView().byId("idNewPassword2");
            var oNewPasswordConfirmedValue = oNewPasswordConfirmed.getValue();

            oNewPasswordConfirmed.setValueState("None");

            if (oEmailValue != "" && oNewPasswordValue != "" && oNewPasswordConfirmedValue != ""){
                    oNewPassword.setValueState("None");
					oNewPasswordConfirmed.setValueState("None");
                    oModel.setProperty("/isChangeEnabled",true);
            }
            else {
                oNewPassword.setValueState("None");
				oNewPasswordConfirmed.setValueState("None");
                oModel.setProperty("/isChangeEnabled",false);
            }
        },

        onChangeClick : function(){
            var oEmail = this.getView().byId("idEmailChange");
            var oEmailValue = oEmail.getValue();  
            var oNewPassword = this.getView().byId("idNewPassword");
            var oNewPasswordValue = oNewPassword.getValue().toUpperCase();
            var oNewPasswordConfirmed = this.getView().byId("idNewPassword2");
            var oNewPasswordConfirmedValue = oNewPasswordConfirmed.getValue().toUpperCase();

            var oBindingContext = this.getView().getBindingContext();
            var sPnr = oBindingContext.getProperty("PNR");
            var sName = oBindingContext.getProperty("Name");
            var sCL = oBindingContext.getProperty("Career_level");
            var sFY = oBindingContext.getProperty("Fiscal_year");
                   
            var oModel = this.getView().getModel();

            var oUser={ 
                PNR: sPnr,
                Name: sName,
                Email: oEmailValue,
                Password: oNewPasswordValue,
                Career_level: sCL,
                Fiscal_year: sFY
            };

            console.log(oUser);

            if (oNewPasswordValue != oNewPasswordConfirmedValue) {
                oNewPasswordConfirmed.setValueState("Error");
                oNewPasswordConfirmed.setValue("");
                MessageBox.error("The passwords do not match! Please try again.");
            }
            else{

            oModel.update("/EmployeeSet(PNR='" + sPnr + "')", oUser, {
                success: function (oData) {
                    this.getView().setBusy(false);
                    MessageToast.show("Password changed successfully!", {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50"
                    });
                }.bind(this),
                error: function (oResponse) {
                    this.getView().setBusy(false);
                    MessageToast.show("Failed changing password!", {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50",
                    });
                }.bind(this)
            });

            this.byId("idChangePasswordFragment").close();
            oNewPassword.setValue("");
            this.getView().byId("idNewPassword2").setValue("");
        }
        },


        formatToCamelCase: function(sValue) {
            if (sValue) {
                const words = sValue.toLowerCase().split(' ');
                for (let i = 0; i < words.length; i++) {
                    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
                }
                return words.join(' ');
            }
            return "";
        },

        onPressFeedbackItem : function(oEvent){
            var oView = this.getView();
            var oClikedItem = oEvent.getSource();
            var sPath = oClikedItem.getBindingContext().getPath();

            if(!this.pDialog12){
                Fragment.load({id: this.getView().getId(), 
                                name: "FeedbackApp.view.fragments.ExpandFEEDBACK",
                                controller: this
                }).then(function (pDialog) {
                        this.pDialog12 = pDialog;
                        oView.addDependent(pDialog);
                        pDialog.bindElement(sPath);
                        pDialog.open();
                }.bind(this))
            }
            else
            {
                this.pDialog12.bindElement(sPath);
                this.pDialog12.open();
            }
        },

        onPressPEGItem : function(oEvent){
            var oView = this.getView();
            var oClikedItem = oEvent.getSource();
            var sPath = oClikedItem.getBindingContext().getPath();

            var oBindingContext = this.getView().getBindingContext();
            var sCareerLevel = oBindingContext.getProperty("Career_level");
            var sName = oBindingContext.getProperty("Name");
            var sPnr = oBindingContext.getProperty("PNR");

            var oModel = this.getModel("userModel");

            oModel.setProperty("/pnr", sPnr);
            oModel.setProperty("/careerLevel", sCareerLevel);
            oModel.setProperty("/name", sName);

            if(!this.pDialog11){
                Fragment.load({id: this.getView().getId(), 
                                name: "FeedbackApp.view.fragments.ExpandPEG",
                                controller: this
                }).then(function (pDialog) {
                        this.pDialog11 = pDialog;
                        oView.addDependent(pDialog);
                        sPath = oEvent.getSource().getBindingContext().getPath();
                        pDialog.bindElement(sPath);
                        pDialog.open();
                }.bind(this))
            }
            else
            {
                sPath = oEvent.getSource().getBindingContext().getPath();
                this.pDialog11.bindElement(sPath);
                this.pDialog11.open();
            }

        },
        
        _onObjectMatched : function (oEvent) {
            var oView = this.getView();
            let sPnr = oEvent.getParameter("arguments").pnr;
            let oModel = this.getModel();
            var oGlobalModel = this.getOwnerComponent().getModel("oGlobalModel");

            var isLoggedIn = oGlobalModel.getProperty("/loggedIn");
            var oLoggedPNR = oEvent.getParameter("arguments").pnr;
            var loggedPNR = oGlobalModel.getProperty("/loggedPNR");
            if (isLoggedIn === true && loggedPNR === sPnr){

                let sPath = "/EmployeeSet('" + sPnr + "')";
                oModel.metadataLoaded().then(function () {
                    oView.bindElement(sPath, {
                        events: {
                            dataReceived: function (oEvent) {
                                console.log(sPnr);
                            }
                        },
                        parameters: {
                            expand: 'EmployeeToPeg, EmployeeToFeedback'
                        }
                    });
                });
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteLoginPage", {}, true);
            }
        },

        onRequestPEG : function () {
            if (!this.pDialog1) {
                this.pDialog1 = this.loadFragment({
                    name: "FeedbackApp.view.fragments.RequestPEG"
                });
            } 
            this.pDialog1.then(function(oDialog1) {
                oDialog1.open();
                
            })
        },

        onChangePasswordClick : function(oEvent){
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "FeedbackApp.view.fragments.ChangePassword"
                });
            } 
            this.pDialog.then(function(oDialog) {
                oDialog.open();
            })
        },

        onIconClick: function (oEvent){
            if (!this.oPopover) {
                this.oPopover = sap.ui.xmlfragment("FeedbackApp.view.fragments.SettingsPopover", this);
                this.getView().addDependent(this.oPopover);
               }  
            this.oPopover.openBy(oEvent.getSource());
        },

        onInputRequestChanged: function () {
            const oModel = this.getView().getModel("PEGModel");

            var oBusinessArea = this.getView().byId("idInputBusinessAreaReq");
            var oProjectID = this.getView().byId("idInputProjectIdReq");
            var oProjectName = this.getView().byId("idInputProjectNameReq");
            var oProjectDays = this.getView().byId("idInputProjectDaysReq");
            var oNameEvaluator = this.getView().byId("idInputNameEvaluatorReq");

            var oBusinessAreaValue = oBusinessArea.getValue();
            var oProjectIDValue = oProjectID.getValue();
            var oProjectNameValue = oProjectName.getValue();
            var oProjectDaysValue = oProjectDays.getValue();
            var oNameEvaluatorValue = oNameEvaluator.getValue();

            if( oBusinessAreaValue != "" && 
                oProjectIDValue != "" && 
                oProjectNameValue != "" && 
                oProjectDaysValue != "" && oNameEvaluatorValue != "")
                {
                    oModel.setProperty("/isRequestEnabled",true);
                }
                else {
                    oModel.setProperty("/isRequestEnabled",false);
                }
        },

        onInputSendFeedbackChanged: function () {
            var oView = this.getView(); 
            const oModel = oView.getModel("feedbackModel");
            
            var oEmployeeNameValue = oView.byId("idComboBoxFeedback").getValue();

            if( oEmployeeNameValue != "")
                {
                    oModel.setProperty("/isSendEnabled",true);
                }
                else {
                    oModel.setProperty("/isSendEnabled",false);
                }
        },

        onFillPEG: function  () {
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "FeedbackApp.view.fragments.FillPEG"
                });
            } 
            this.pDialog.then(function(oDialog) {
                oDialog.open();
            })
        },

        onRequestFeedback : function () {
            if (!this.pDialog2) {
                this.pDialog2 = this.loadFragment({
                    name: "FeedbackApp.view.fragments.RequestFeedback"
                });
            } 
            this.pDialog2.then(function(oDialog2) {
                oDialog2.open();
            })
        },

        onSendFeedback : function (oEvent) {
            var oView = this.getView();
            var oClikedItem = oEvent.getSource();
            var sPath = oClikedItem.getBindingContext().getPath();

            if(!this.pDialog3){
                Fragment.load({id: this.getView().getId(), 
                                name: "FeedbackApp.view.fragments.SendFeedback",
                                controller: this
                }).then(function (pDialog) {
                        this.pDialog3 = pDialog;
                        oView.addDependent(pDialog);
                        // sPath = oEvent.getSource().getBindingContext().getPath();
                        pDialog.bindElement(sPath);
                        pDialog.open();
                }.bind(this))
            }
            else
            {
                // sPath = oEvent.getSource().getBindingContext().getPath();
                this.pDialog3.bindElement(sPath);
                this.pDialog3.open();
            }
        },

        onCancelChange: function(){
            this.byId("idChangePasswordFragment").close();
        },


        onCancelFeedbackBtnExp : function () {
            this.byId("idExpandFeedbackExp").close();
        },

        onDonePEGBtnExp : function () {
            var idPEG = parseInt(this.getView().byId("idIDPEG").getText());
        
            var oBindingContext = this.getView().getBindingContext();
            var sPnr1 = oBindingContext.getProperty("PNR");
            const oModel = this.getView().getModel();
            var grd = this.getView().byId("idRatingAverageExp").getText();

            var idPEG = parseInt(this.getView().byId("idIDPEG").getText(), 10);

            var oBusinessArea = this.getView().byId("idInputBusinessAreaExp").mProperties.value;
            var oProjectID = this.getView().byId("idInputProjectIdExp").mProperties.value;
            var oProjectName = this.getView().byId("idInputProjectNameExp").mProperties.value;
            var oProjectDays = this.getView().byId("idInputProjectDaysExp").mProperties.value;
            var oNameEvaluator = this.getView().byId("idInputNameEvaluatorExp").mProperties.value;
            var oExpertise = this.getView().byId("idRatingExpertiseExp").mProperties.value;
            var oNetworking = this.getView().byId("idRatingNetworkingExp").mProperties.value;
            var oTeaming = this.getView().byId("idRatingTeamingExp").mProperties.value;
            var oPassion = this.getView().byId("idRatingPassionExp").mProperties.value;
            var oAutonomy = this.getView().byId("idRatingAutonomyExp").mProperties.value;

            var oExpertiseTA = this.getView().byId("idExpertiseDetailsTA").mProperties.value;
            var oNetworkingTA = this.getView().byId("idNetworkDetailsTA").mProperties.value;
            var oTeamingTA = this.getView().byId("idTeamingDetailsTA").mProperties.value;
            var oPassionTA = this.getView().byId("idPassionDetailsTA").mProperties.value;
            var oAutonomyTA = this.getView().byId("idAutonomyDetailsTA").mProperties.value;

            var d = new Date();
            let sPnr = this.getView().byId("idPNRFragmentExp").getValue();
            let sName = this.getView().byId("idNameFragmentExp").getValue();
            let sCareerLevel = this.getView().byId("idCarrLevFragmentExp").getValue();
            var sStatus = "COMPLETE";
            var oEntryPEG = {
                Id_peg: idPEG,
                Pnr_employee: sPnr,
                Pnr_manager: sPnr1,
                Grade: grd,
                Status: sStatus,
                Year_peg: 2023,
                Name_employee: sName,
                Career_level: sCareerLevel,
                Business_area: oBusinessArea,
                Project_days: parseInt(oProjectDays),
                Name_evaluator: oNameEvaluator,
                Date_peg: d,
                Expertise_Skills: oExpertise,
                Expertise_Details: oExpertiseTA,
                Network_skills: oNetworking,
                Network_details: oNetworkingTA,
                Teaming_skills: oTeaming,
                Teaming_details: oTeamingTA,
                Passion_skills: oPassion,
                Passion_details: oPassionTA,
                Autonomy_skills: oAutonomy,
                Autonomy_details: oAutonomyTA,
                Id_project: oProjectID,
                Project_name: oProjectName
            };

            var sPath = "/Peg2Set(Id_peg=" + idPEG + ")";
            oModel.update(sPath, oEntryPEG, {
                success: function (oData) {
                    this.getView().setBusy(false);
                    MessageToast.show(this.getText("PEG Completed!"), {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50"
                    });
                    this.byId("idExpandPEG").close();
                }.bind(this),
                error: function (oResponse) {
                    this.getView().setBusy(false);
                    MessageToast.show(this.getText("Failed completing PEG"), {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50",
                    });
                    this.byId("idRequestPEGExp").close();
                }.bind(this)
            });


            this.byId("idExpandPEG").close();
        },

        onCancelPEGBtnExp : function () {
            this.byId("idExpandPEG").close();
        },

        onCancelSendFeedbackBtn : function () {
            var oView=this.getView();
            
            var oEmployeeName = oView.byId("idComboBoxFeedback");
            var oAnonimity = oView.byId("idAnonimity");
            var oSoftSkillsRating = oView.byId("ratingSoft");
            var oSoftSkillsDetails = oView.byId("idSoftTA");
            var oHardSkillsRating = oView.byId("ratingTech");
            var oHardSkillsDetails = oView.byId("idHardTA");
            var oOtherSkillsRating = oView.byId("ratingOther");
            var oOtherSkillsDetails = oView.byId("idOtherTA");

            oEmployeeName.setValue("");
            oSoftSkillsRating.setValue(0);
            oSoftSkillsDetails.setValue("");
            oHardSkillsRating.setValue(0);
            oHardSkillsDetails.setValue("");
            oOtherSkillsRating.setValue(0);
            oOtherSkillsDetails.setValue("");
            oAnonimity.setSelected(false);

            this.byId("idSendFeedback").close();
        }, 

        onSendFeedbackBtn : function () {
            const oView = this.getView();
            const oModel = oView.getModel();

            var oBindingContext = this.getView().getBindingContext();
            var sPnr1 = oBindingContext.getProperty("PNR");

            var oUserName = oView.byId("idUserName");
            var oEmployeeName = oView.byId("idComboBoxFeedback");
            var oAnonimity = oView.byId("idAnonimity");
            var oSoftSkillsRating = oView.byId("ratingSoft");
            var oSoftSkillsDetails = oView.byId("idSoftTA");
            var oHardSkillsRating = oView.byId("ratingTech");
            var oHardSkillsDetails = oView.byId("idHardTA");
            var oOtherSkillsRating = oView.byId("ratingOther");
            var oOtherSkillsDetails = oView.byId("idOtherTA");

            var hs = parseFloat(oHardSkillsRating.getValue());
            var ss = parseFloat(oSoftSkillsRating.getValue());
            var os = parseFloat(oOtherSkillsRating.getValue());
            var or = (hs + ss + os)/3;

            var oEntryFeedback = {
                Pnr_sender: sPnr1,
                Pnr_reciever: "0",
                Name_sender: oUserName.getText().toUpperCase(),
                Name_reciever: oEmployeeName.getValue().toUpperCase(),
                Anonimity: oAnonimity.getSelected(),
                Hard_skills: hs.toFixed(1),
                Hard_details: oHardSkillsDetails.getValue(),
                Soft_skills: ss.toFixed(1),
                Soft_details: oSoftSkillsDetails.getValue(),
                Other_skills: os.toFixed(1),
                Other_details: oOtherSkillsDetails.getValue(),
                Or_feedback: or.toFixed(1),
                Status: ""
            };

            var sPath = '/Feedback2Set';
            oModel.create(sPath, oEntryFeedback, {
                success: function (oData) {
                    this.getView().setBusy(false);
                    MessageToast.show(this.getText("successfullFeedback"), {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50",
                    });
                    oEmployeeName.setValue("");
                    oSoftSkillsRating.setValue(0);
                    oSoftSkillsDetails.setValue("");
                    oHardSkillsRating.setValue(0);
                    oHardSkillsDetails.setValue("");
                    oOtherSkillsRating.setValue(0);
                    oOtherSkillsDetails.setValue("");
                    oAnonimity.setSelected(false);
                }.bind(this),
                error: function (oResponse) {
                    oView.setBusy(false);
                    MessageToast.show(this.getText("failedFeedback"), {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50",
                    });
                    oEmployeeName.setValue("");
                    oSoftSkillsRating.setValue(0);
                    oSoftSkillsDetails.setValue("");
                    oHardSkillsRating.setValue(0);
                    oHardSkillsDetails.setValue("");
                    oOtherSkillsRating.setValue(0);
                    oOtherSkillsDetails.setValue("");
                }.bind(this)
                
            });

            this.byId("idSendFeedback").close();
        }, 

        onCancelRequestFeedbackBtn : function () {
            this.byId("idRequestFeedback").close();
        }, 

        onRequestFeedbackBtn : function () {
            this.byId("idRequestFeedback").close();
        }, 

        onDonePEGBtnReq : function (oEvent) {
            const oView = this.getView();
            const oModel = oView.getModel();

            var oBusinessArea = oView.byId("idInputBusinessAreaReq");
            var oProjectID = oView.byId("idInputProjectIdReq");
            var oProjectName = oView.byId("idInputProjectNameReq");
            var oProjectDays = oView.byId("idInputProjectDaysReq");
            var oNameEvaluator = oView.byId("idInputNameEvaluatorReq");
            var oExpertise = oView.byId("idRatingExpertiseReq");
            var oNetworking = oView.byId("idRatingNetworkingReq");
            var oTeaming = oView.byId("idRatingTeamingReq");
            var oPassion = oView.byId("idRatingPassionReq");
            var oAutonomy = oView.byId("idRatingAutonomyReq");

            var d = new Date();
            let sPnr = oView.byId("idPNRFragmentReq").getText();
            let sName = oView.byId("idNameFragmentReq").getText();
            let sCareerLevel = oView.byId("idCarrLevFragmentReq").getText();
            var oEntryPEG = {
                Pnr_employee: sPnr,
                Pnr_manager: "",
                Grade: "0.0",
                Status: "PENDING",
                Year_peg: 2023,
                Name_employee: sName,
                Career_level: sCareerLevel,
                Business_area: oBusinessArea.getValue(),
                Project_days: parseInt(oProjectDays.getValue()),
                Name_evaluator: oNameEvaluator.getValue().toUpperCase(),
                Date_peg: d,
                Expertise_Skills: oExpertise.getValue(),
                Expertise_Details: "",
                Network_skills: oNetworking.getValue(),
                Network_details: "",
                Teaming_skills: oTeaming.getValue(),
                Teaming_details: "",
                Passion_skills: oPassion.getValue(),
                Passion_details: "",
                Autonomy_skills: oAutonomy.getValue(),
                Autonomy_details: "",
                Id_project: oProjectID.getValue(),
                Project_name: oProjectName.getValue()
            };

            var sPath = '/Peg2Set';
            oModel.create(sPath, oEntryPEG, {
                success: function (oData) {
                    this.getView().setBusy(false);
                    MessageToast.show(this.getText("successfulPEG"), {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50"
                    });
                    oBusinessArea.setValue("");
                    oProjectID.setValue("");
                    oProjectName.setValue("");
                    oProjectDays.setValue("");
                    oNameEvaluator.setValue("");
                    oExpertise.setValue(0);
                    oNetworking.setValue(0);
                    oTeaming.setValue(0);
                    oPassion.setValue(0);
                    oAutonomy.setValue(0);
                    this.byId("idRequestPEG").close();

                    this.getModel().callFunction("/requestFeedback", {
                                    method: "POST",
                                    urlParameters: {"pnr_s" : sPnr, "name_manager" : oNameEvaluator.getValue()},
                                    success: jQuery.proxy("/requestFeedback", this)
                                });

                }.bind(this),
                error: function (oResponse) {
                    oView.setBusy(false);
                    MessageToast.show(this.getText("failedPEG"), {
                        duration: 3000,
                        width: "15rem",
                        my: "center bottom",
                        at: "center bottom",
                        of: window,
                        offset: "0 -50"
                    });
                    oBusinessArea.setValue("");
                    oProjectID.setValue("");
                    oProjectName.setValue("");
                    oProjectDays.setValue("");
                    oNameEvaluator.setValue("");
                    oExpertise.setValue(0);
                    oNetworking.setValue(0);
                    oTeaming.setValue(0);
                    oPassion.setValue(0);
                    oAutonomy.setValue(0);
                    this.byId("idRequestPEG").close();
                }.bind(this)
            });
            this.byId("idRequestPEG").close();
        },

        onCancelPEGBtnReq : function () {
            const oView = this.getView();
           
            var oBusinessArea = oView.byId("idInputBusinessAreaReq");
            var oProjectID = oView.byId("idInputProjectIdReq");
            var oProjectName = oView.byId("idInputProjectNameReq");
            var oProjectDays = oView.byId("idInputProjectDaysReq");
            var oNameEvaluator = oView.byId("idInputNameEvaluatorReq");
            var oExpertise = oView.byId("idRatingExpertiseReq");
            var oNetworking = oView.byId("idRatingNetworkingReq");
            var oTeaming = oView.byId("idRatingTeamingReq");
            var oPassion = oView.byId("idRatingPassionReq");
            var oAutonomy = oView.byId("idRatingAutonomyReq");

            oBusinessArea.setValue("");
            oProjectID.setValue("");
            oProjectName.setValue("");
            oProjectDays.setValue("");
            oNameEvaluator.setValue("");
            oExpertise.setValue(0);
            oNetworking.setValue(0);
            oTeaming.setValue(0);
            oPassion.setValue(0);
            oAutonomy.setValue(0);

            this.byId("idRequestPEG").close();
        },

        onSelect: function(oEvent) {
            var bSelected = oEvent.getParameter("selected"),
                sText = oEvent.getSource().getText(),
                oTable = this.byId("idProductsTable"),
                aSticky = oTable.getSticky() || [];

            if (bSelected) {
                aSticky.push(sText);
            } else if (aSticky.length) {
                var iElementIndex = aSticky.indexOf(sText);
                aSticky.splice(iElementIndex, 1);
            }

            oTable.setSticky(aSticky);
        },
        formatBindingPathToString: function(bindingPath) {
            return bindingPath.replace("{myModelPnr>/oPnr}", "");
        },

        s2ab: function(s) {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		},
		
		getExcel: function(oEvent) {
            //var oBindingContext = this.getView().getBindingContext();
            var sPegId = this.getView().byId("idIDPEG").getText();
            console.log(sPegId);
			var successGetExcel = function(oData, oResponse) {
				if (oData.getExcel) {
					var a = window.document.createElement('a');
					var blob = new Blob([this.s2ab(atob(oData.getExcel.Val))], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					});
					a.href = window.URL.createObjectURL(blob);
					a.download = 'PegExport.xlsx';

					// Append anchor to body.
					document.body.appendChild(a);
					a.click();

					// Remove anchor from body
					document.body.removeChild(a);
				}
			};

			this.getModel().callFunction("/getExcel", {
				method: "GET",
				urlParameters: {"Id_Peg" : sPegId},
				success: jQuery.proxy(successGetExcel, this)
			});
		},
    });
});
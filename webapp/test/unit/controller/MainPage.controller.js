/*global QUnit*/

sap.ui.define([
	"FeedbackApp/controller/LoginPage.controller"
], function (Controller) {
	"use strict";

	QUnit.module("LoginPage Controller");

	QUnit.test("I should test the LoginPage controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

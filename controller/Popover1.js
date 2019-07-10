sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.qm20.controller.Popover1", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.qm20.view.Popover1", this);
			this._bInit = false;
		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		// onDownload: function () {

		// 	var oModel = this.getView().getModel(),
		// 		oExtensionProperties = this.getView().getModel();
		// 	oModel.read(oExtensionProperties.getProperty("/FormPDFSet"), {
		// 		success: function (oData) {
		// 			if (oData.Printed) {
		// 				//if (typeof safari !== "undefined") {
		// 				// var oWindow = safari.application.openBrowserWindow();
		// 				// oWindow.activeTab.url = oData.__metadata.media_src;
		// 				//} else {
		// 				sap.m.URLHelper.redirect(oData.__metadata.media_src, true);
		// 				//}
		// 			} else {
		// 				sap.m.MessageToast.show("DOWNLOAD_ERROR");
		// 			}
		// 		}.bind(this)
		// 	});
		// },

		onDownload: function () {
			var oView = this.getView(),
				oTable = oView.byId("sap_Responsive_Page_0-content-build_simple_Table-1559072229084"),
				aContexts = oTable.getSelectedContexts(), 
				mProperty = aContexts.length > 0 && Object.assign({}, aContexts[0].getProperty()),
				oModel = oView.getModel(),
				sPath = oModel.createKey("/FormPDFSet", {
					ebeln: mProperty.ebeln,
					ebelp: mProperty.ebelp
				});
				
			oModel.read(sPath, {
				success: function (oData, Response) {
					sap.m.URLHelper.redirect(new URL(oData.__metadata.media_src).pathname, true);
				}
			});
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},
		_onButtonPress: function () {
			return new Promise(function (fnResolve) {
				var sTargetPos = "center center";
				sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;

				this.onDownload();
				sap.m.MessageToast.show("Impressão INC02 feita", {
					onClose: fnResolve,
					duration: 0 || 3000,
					at: sTargetPos,
					my: sTargetPos
				});
			}.bind(this)
			).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPress1: function () {
			return new Promise(function (fnResolve) {
				var sTargetPos = "center center";
				sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
				sap.m.MessageToast.show("Impressão Aditamento feita", {
					onClose: fnResolve,
					duration: 0 || 3000,
					at: sTargetPos,
					my: sTargetPos
				});
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPress2: function () {

			this.close();

		},
		onInit: function () {

			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);
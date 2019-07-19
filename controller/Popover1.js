sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (ManagedObject, MessageBox, Utilities, History, Filter, FilterOperator) {

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

		onDownload: function () {
	var oView = this.getView(),
				oTable = oView.byId("sap_Responsive_Page_0-content-build_simple_Table-1559072229084"),
				aProperties = oTable.getSelectedContexts().map(function (oContext) {
					return Object.assign({}, oContext.getProperty());
				}),
				oModel = oView.getModel();

			var requestBody = {
				"spoolId": 1,
				"nameForm": "INC02",
				"HeaderToDataNav": aProperties.map(function (mContext) {
					return {
						ebeln: mContext.ebeln,
						ebelp: mContext.ebelp
					};
				})
			};

			oModel.create("/HeaderPDFSet", requestBody, {
				success: function (oData) {
			
				var	oFilter = new Filter({
				and: true,
				filters: aProperties.map(function (mContext) {
					return new Filter({
						filters: [
							new Filter("spoolid", FilterOperator.EQ, oData.spoolId.toString()),
							
						],
					});
				})
			});
				 oModel.read("/FormPDFSet", {
				filters: [oFilter],
				 success: function (oData) {
					sap.m.URLHelper.redirect(new URL(oData.results[0].__metadata.media_src).pathname);
				},
				error: function (err) {
					sap.m.MessageToast.show("Erro ao Gerar Link de Donwload");	
				}

			});

				},
				error: function () {
					sap.m.MessageToast.show("Erro ao Gerar Spool");
				}

			});


		},

		onDownloadAdi: function () {
			var oView = this.getView(),
				oTable = oView.byId("sap_Responsive_Page_0-content-build_simple_Table-1559072229084"),
				aProperties = oTable.getSelectedContexts().map(function (oContext) {
					return Object.assign({}, oContext.getProperty());
				}),
				oModel = oView.getModel();

			var requestBody = {
				"spoolId": 1,
				"nameForm": "ADITAMENTO",
				"HeaderToDataNav": aProperties.map(function (mContext) {
					return {
						ebeln: mContext.ebeln,
						ebelp: mContext.ebelp
					};
				})
			};

			oModel.create("/HeaderPDFSet", requestBody, {
				success: function (oData) {
			
				var	oFilter = new Filter({
				and: true,
				filters: aProperties.map(function (mContext) {
					return new Filter({
						filters: [
							new Filter("spoolid", FilterOperator.EQ, oData.spoolId.toString()),
							
						],
					});
				})
			});
				 oModel.read("/FormPDFSet", {
				filters: [oFilter],
				 success: function (oData) {
					sap.m.URLHelper.redirect(new URL(oData.results[0].__metadata.media_src).pathname);
				},
				error: function (err) {
					sap.m.MessageToast.show("Erro ao Gerar Link de Donwload");	
				}

			});

				},
				error: function () {
					sap.m.MessageToast.show("Erro ao Gerar Spool");
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
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPress1: function () {
			return new Promise(function (fnResolve) {
				var sTargetPos = "center center";
				sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
				this.onDownloadAdi();
				sap.m.MessageToast.show("Impressão Aditamento feita", {
					onClose: fnResolve,
					duration: 0 || 3000,
					at: sTargetPos,
					my: sTargetPos
				});
			}.bind(this)).catch(function (err) {
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
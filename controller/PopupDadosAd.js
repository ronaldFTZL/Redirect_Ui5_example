sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History" 
], function(ManagedObject, MessageBox, Utilities, MessageToast, History) {

	return ManagedObject.extend("com.sap.build.standard.qm20.controller.PopupDadosAd", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.qm20.view.PopupDadosAd", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},

		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},

		open: function() {
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

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		

		
		
//		Ação do botão Confirmar
		_onButtonPress: function() {
		
			if ( parseInt(this.getView().byId("impu1").getValue()) > "100" ||
				 parseInt(this.getView().byId("impu2").getValue()) > "100" ||
				 parseInt(this.getView().byId("impu3").getValue()) > "100" ) {
				MessageToast.show("Os campos de percentual não podem exceder 100%!");
				return;
			}
			
			this.close();	
		},
		
		
//		Retorna valores originais da tabela
		_onButtonPress1: function() {
			this.getView().getModel().resetChanges();
			this.close();

		},
		onInit: function() {
			this._oDialog = this.getControl();

			
		},
		onExit: function() {
			this._oDialog.destroy();

		}
		
	});
}, /* bExport= */ true);

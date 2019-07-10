sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Dialog4", "./Dialog3", "./Popover1", "./Dialog1", "./Dialog2", "./PopupDadosAd",
	"./utilities",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function(BaseController, MessageBox, Dialog4, Dialog3, Popover1, Dialog1, Dialog2, PopupDadosAd, Utilities, MessageToast, Filter, History, JSONModel, DateFormat, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.qm20.controller.Page1", {
		handleRouteMatched: function(oEvent) {
			var oParams = {};

			if (oEvent.getParameter("data").context) {
				this.sContext = oEvent.getParameter("data").context;
			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};
					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		
		_onPageNavButtonPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function(oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		_onButtonPress: function(oEvent) {

			var sDialogName = "Dialog1";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog1(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();
			
			},
			
			
		_onButtonPress1: function(oEvent) {

			var sDialogName = "Dialog2";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog2(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		
		_onButtonPress4: function(oEvent) {
			var lineIndex = this.getView().byId("sap_Responsive_Page_0-content-build_simple_Table-1559072229084").getSelectedIndices();
			var bindingContext =  this.getView().byId("sap_Responsive_Page_0-content-build_simple_Table-1559072229084").getRows()[lineIndex[0]].getBindingContext();
			var vPath = bindingContext.sPath;
			
//  		Verifica se foi selecionada apenas uma unica linha
			if ( lineIndex.length >= 2 ){
                    MessageToast.show("Selecione apenas um registro por vez!");
                    return;
                    
            } else if ( lineIndex.length == 0 ){
                    MessageToast.show("Selecione uma linha para atualizar as informações!"); 
                    return;
            }
			
			
			
			if( bindingContext.getProperty("ddsqm") == true ||
			    bindingContext.getProperty("ddsqm") == "X"  ){
				    MessageToast.show("Infomações vindas de QM não podem ser alteradas"); 
                    return;
			}
			
			
			if( bindingContext.getProperty("stats") == "2" ){
				    MessageToast.show("Não é possível efetuar alterações itens já finalizados"); 
                    return;
			}

			var sDialogName = "PopupDadosAd";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new PopupDadosAd(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			// var context = oEvent.getSource().getBindingContext();
			// oDialog._oControl.setBindingContext(context);
			oDialog._oControl.bindObject({
				path: vPath
			});

			oDialog.open();

		},
		// _onOverflowToolbarButtonPress: function(oEvent) {

		// 	this.mSettingsDialogs = this.mSettingsDialogs || {};
		// 	var sSourceId = oEvent.getSource().getId();
		// 	var oDialog = this.mSettingsDialogs["ViewSettingsDialog1"];

		// 	var confirmHandler = function(oConfirmEvent) {
		// 		var self = this;
		// 		var sFilterString = oConfirmEvent.getParameter('filterString');
		// 		var oBindingData = {};

		// 		/* Grouping */
		// 		if (oConfirmEvent.getParameter("groupItem")) {
		// 			var sPath = oConfirmEvent.getParameter("groupItem").getKey();
		// 			oBindingData.groupby = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("groupDescending"), true)];
		// 		} else {
		// 			// Reset the group by
		// 			oBindingData.groupby = null;
		// 		}

		// 		/* Sorting */
		// 		if (oConfirmEvent.getParameter("sortItem")) {
		// 			var sPath = oConfirmEvent.getParameter("sortItem").getKey();
		// 			oBindingData.sorters = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("sortDescending"))];
		// 		}

		// 		/* Filtering */
		// 		oBindingData.filters = [];
		// 		// The list of filters that will be applied to the collection
		// 		var oFilter;
		// 		var vValueLT, vValueGT;

		// 		vValueLT = oDialog.getModel().getProperty("/Data/vValueLT");
		// 		vValueGT = oDialog.getModel().getProperty("/Data/vValueGT");
		// 		if (vValueLT !== "" || vValueGT !== "") {
		// 			oFilter = this.getCustomFilter("Data", vValueLT, vValueGT);
		// 			oBindingData.filters.push(oFilter);
		// 			sFilterString = sFilterString ? sFilterString + ', ' : 'Filtered by: ';
		// 			sFilterString += this.getCustomFilterString(false, "Data", oFilter.sOperator, vValueLT, vValueGT);
		// 		}

		// 		// Simple filters (String)
		// 		var mSimpleFilters = {},
		// 			sKey;
		// 		for (sKey in oConfirmEvent.getParameter("filterKeys")) {
		// 			var aSplit = sKey.split("___");
		// 			var sPath = aSplit[1];
		// 			var sValue1 = aSplit[2];
		// 			var oFilterInfo = new sap.ui.model.Filter(sPath, "EQ", sValue1);

		// 			// Creating a map of filters for each path
		// 			if (!mSimpleFilters[sPath]) {
		// 				mSimpleFilters[sPath] = [oFilterInfo];
		// 			} else {
		// 				mSimpleFilters[sPath].push(oFilterInfo);
		// 			}
		// 		}

		// 		for (var path in mSimpleFilters) {
		// 			// All filters on a same path are combined with a OR
		// 			oBindingData.filters.push(new sap.ui.model.Filter(mSimpleFilters[path], false));
		// 		}

		// 		aCollections.forEach(function(oCollectionItem) {
		// 			var oCollection = self.getView().byId(oCollectionItem.id);
		// 			var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
		// 			var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
		// 			if (oBindingInfo.model === "kpiModel") {
		// 				oCollection.getObjectBinding().refresh();
		// 			} else {
		// 				oCollection.bindAggregation(oCollectionItem.aggregation, {
		// 					model: oBindingInfo.model,
		// 					path: oBindingInfo.path,
		// 					parameters: oBindingInfo.parameters,
		// 					template: oBindingInfo.template,
		// 					templateShareable: true,
		// 					sorter: oBindingOptions.sorters,
		// 					filters: oBindingOptions.filters
		// 				});
		// 			}

		// 			// Display the filter string if necessary
		// 			if (typeof oCollection.getInfoToolbar === "function") {
		// 				var oToolBar = oCollection.getInfoToolbar();
		// 				if (oToolBar && oToolBar.getContent().length === 1) {
		// 					oToolBar.setVisible(!!sFilterString);
		// 					oToolBar.getContent()[0].setText(sFilterString);
		// 				}
		// 			}
		// 		}, this);
		// 	}.bind(this);

		// 	function resetFiltersHandler() {

		// 		oDialog.getModel().setProperty("/Data/vValueLT", "");
		// 		oDialog.getModel().setProperty("/Data/vValueGT", "");

		// 	}

		// 	function updateDialogData(filters) {
		// 		var mParams = {
		// 			context: oReferenceCollection.getBindingContext(),
		// 			success: function(oData) {
		// 				var oJsonModelDialogData = {};
		// 				// Loop through each entity
		// 				oData.results.forEach(function(oEntity) {
		// 					// Add the distinct properties in a map
		// 					for (var oKey in oEntity) {
		// 						if (!oJsonModelDialogData[oKey]) {
		// 							oJsonModelDialogData[oKey] = [oEntity[oKey]];
		// 						} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
		// 							oJsonModelDialogData[oKey].push(oEntity[oKey]);
		// 						}
		// 					}
		// 				});

		// 				var oDialogModel = oDialog.getModel();

		// 				oJsonModelDialogData["Data"] = {
		// 					vValueLT: (oDialogModel && oDialogModel.getProperty("/Data")) ? oDialogModel.getProperty("/Data/vValueLT") : "",
		// 					vValueGT: (oDialogModel && oDialogModel.getProperty("/Data")) ? oDialogModel.getProperty("/Data/vValueGT") : ""
		// 				};

		// 				if (!oDialogModel) {
		// 					oDialogModel = new sap.ui.model.json.JSONModel();
		// 					oDialog.setModel(oDialogModel);
		// 				}
		// 				oDialogModel.setData(oJsonModelDialogData);
		// 				oDialog.open();
		// 			}
		// 		};
		// 		var sPath;
		// 		var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
		// 		// In KPI mode for charts, getBindingInfo would return the local JSONModel
		// 		if (sModelName === "kpiModel") {
		// 			sPath = oReferenceCollection.getObjectBinding().getPath();
		// 		} else {
		// 			sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
		// 		}
		// 		mParams.filters = filters;
		// 		oModel.read(sPath, mParams);
		// 	}

		// 	if (!oDialog) {
		// 		oDialog = sap.ui.xmlfragment({
		// 			fragmentName: "com.sap.build.standard.qm20.view.ViewSettingsDialog1"
		// 		}, this);
		// 		oDialog.attachEvent("confirm", confirmHandler);
		// 		oDialog.attachEvent("resetFilters", resetFiltersHandler);

		// 		this.mSettingsDialogs["ViewSettingsDialog1"] = oDialog;
		// 	}

		// 	var aCollections = [];

		// 	aCollections.push({
		// 		id: "sap_Responsive_Page_0-content-build_simple_Table-1559072229084",
		// 		// aggregation: "items"
		// 		aggregation: "rows"
		// 	});

		// 	var oReferenceCollection = this.getView().byId(aCollections[0].id);
		// 	// var oSourceBindingContext = oReferenceCollection.getBindingContext();
		// 	var oSourceBindingContext = oReferenceCollection.getRows();
		// 	var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

		// 	// toggle compact style
		// 	jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
		// 	var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id].filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
		// 	updateDialogData(designTimeFilters);

		// },
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		getCustomFilter: function(sPath, vValueLT, vValueGT) {
			if (vValueLT !== "" && vValueGT !== "") {
				return new sap.ui.model.Filter([
					new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.GT, vValueGT),
					new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.LT, vValueLT)
				], true);
			}
			if (vValueLT !== "") {
				return new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.LT, vValueLT);
			}
			return new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.GT, vValueGT);

		},
		getCustomFilterString: function(bIsNumber, sPath, sOperator, vValueLT, vValueGT) {
			switch (sOperator) {
				case sap.ui.model.FilterOperator.LT:
					return sPath + (bIsNumber ? ' (Less than ' : ' (Before ') + vValueLT + ')';
				case sap.ui.model.FilterOperator.GT:
					return sPath + (bIsNumber ? ' (More than ' : ' (After ') + vValueGT + ')';
				default:
					if (bIsNumber) {
						return sPath + ' (More than ' + vValueGT + ' and less than ' + vValueLT + ')';
					}
					return sPath + ' (After ' + vValueGT + ' and before ' + vValueLT + ')';
			}

		},
		filterCountFormatter: function(sValue1, sValue2) {
			return sValue1 !== "" || sValue2 !== "" ? 1 : 0;

		},
		_onButtonPress2: function(oEvent) {

			var sDialogName = "Dialog4";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog4(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onButtonPress3: function(oEvent) {
			
			var sDialogName = "Dialog3";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog3(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onOverflowToolbarButtonPress1: function(oEvent) {

			var sPopoverName = "Popover1";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover1(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("PreferredLeftOrFlip");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		},
		
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_Responsive_Page_0-content-build_simple_Table-1559072229084",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		},
		
		
		getItens: function(itItens) {		
			
			 var aSelectedItems = [];
			
			for (var i=0; i<itItens.getSelectedIndices().length;i++) {
				
				aSelectedItems.push(itItens.getSelectedIndices()[i]);
				}
			
			// Retorna todos os itens selecionados na tela
			return aSelectedItems;
		},



		changeItens: function( ivStats ) {	
			
//			Busca itens selecionados na tela
			var aItems  = this.getView().byId('sap_Responsive_Page_0-content-build_simple_Table-1559072229084');
			var ltIndex = this.getView().getController().getItens(aItems);
			var oModel  = this.getView().getModel();
			
			
//			Define status a ser modificado e texto do novo Status
			if (ivStats === "1") {
				var modifStats	  = ""		 ;
				var modifStatsTxt = "Emitido";
			} else {
				modifStats    = "1"			;
				modifStatsTxt = "Finalizado";
			}
			
	
//			Modifica itens
			for (var i=0; i<ltIndex.length;i++) {
    		
    		if (oModel.getProperty(aItems.getRows()[ltIndex[i]].getBindingContext().sPath + "/stats") === modifStats ) {
    			
    			oModel.setProperty(aItems.getRows()[ltIndex[i]].getBindingContext().sPath +"/stats"	   , ivStats       );
				oModel.setProperty(aItems.getRows()[ltIndex[i]].getBindingContext().sPath +"/stats_txt", modifStatsTxt );	
    			}  
			}	
		},
		 
		_onSearchFieldLiveChangeD: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			this.bindListSearchD(this.pushFiltrosD(sQuery));
		},

		pushFiltrosD: function (sQuery) {
			var oFilters = [];
			oFilters.push(new Filter("matnr", sap.ui.model.FilterOperator.Contains, sQuery));
			oFilters.push(new Filter("ebeln", sap.ui.model.FilterOperator.Contains, sQuery));
			var orFilters = [];
			orFilters.push(new Filter(oFilters, false));
			return orFilters;
		},

		bindListSearchD: function (Filtro) {
			var list = this.byId("sap_Responsive_Page_0-content-build_simple_Table-1559072229084");
			var binding = list.getBinding();
			binding.filter(Filtro, "Application");
		},
		
		
		
		
		
		
		
		
		
		
		_onOverflowToolbarButtonExport: function (oEvent) {
			// var lvPath	= oEvent.getSource().getParent().getBindingContext().sPath + "/to_zewm_cds_i_conf";
			var lvPath	= this.getView().byId("sap_Responsive_Page_0-content-build_simple_Table-1559072229084").getBinding().sPath;
			var oExport = new Export({
			
				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType : new ExportTypeCSV({
					separatorChar : ";"
				}),

				// Pass in the model created above
				models : this.getView().getModel(),
				
				// binding information for the rows aggregation
				rows : {
					path : lvPath
				},

				// column definitions with column name and binding info for the content

				columns : [
					{
					name : "Material",
					template : {
						content : "{matnr}"
					}	 
				}, {
					name : "Quantidade",
					template : {
						content : "{menge}"
					}	 
				}, {
					name : "Lote",
					template : {
						content : "{lote}"
					}
				}, {
					name : "Pedido",
					template : {
						content : "{ebeln}"
					}
				}, {
					name : "Item",
					template : {
						content : "{ebelp}"
					}
				}, {
					name : "Lote Agrícola",
					template : {
						content : "{loteagr}"
					}
				}, {
					name : "Empresa",
					template : {
						content : "{bukrs}"
					}
				}, {
					name : "Licença",
					template : {
						content : "{licen}"
					}
				}, {
					name : "Data Importação",
					template : {
						content : "{ path: 'dtimp', type: 'sap.ui.model.odata.type.DateTime', formatOptions: { pattern: 'dd/MM/yyyy' }}"
					}
				}, {
					name : "Status",
					template : {
						content : "{stats_txt}"
					}
				}, { 
					name : "Impressão",
					template : {
						content : "{impre_txt}"
					}
				}, {
					name : "Dados QM",
					template : {
						content : "{= ${ddsqm} === 'X' ? true : false }"
					}
				}, {
					name : "Nacionalidade",
					template : {
						content : "{nacio}"
					}
				}, {
					name : "Nome",
					template : {
						content : "{nome}"
					}
				}, {
					name : "Endereço",
					template : {
						content : "{ender}"
					}
				}, {
					name : "Resp. Certificado de Análise",
					template : {
						content : "{respca}"
					}	
				}, {
					name : "Cargo",
					template : {
						content : "{cargo}"
					}
				}, {
					name : "País",
					template : {
						content : "{pais}"
					}
				}, {
					name : "Empresa",
					template : {
						content : "{emp}"
					}
				}, {
					name : "Data da recepção",
					template : {
						content : "{dtresp}"
					}
				}, {
					name : "Data da análise",
					template : {
						content : "{dtanalis}"
					}
				}, {
					name : "Impureza 1",
					template : {
						content : "{impu1_txt}"
					}
				}, {
					name : "%",
					template : {
						content : "{impu1}"
					}
				}, {
					name : "Impureza 2",
					template : {
						content : "{impu2_txt}"
					}	
				}, {
					name : "%",
					template : {
						content : "{impu2_txt}"
					}	
				}, {
					name : "Impureza 3",
					template : {
						content : "{impu3_txt}"
					}	
				}, {
					name : "%",
					template : {
						content : "{impu3_txt}"
					}	
				}, {
					name : "Responsável pela amostragem",
					template : {
						content : "{respamo}"
					}
				}]
			});

			// download exported file
			oExport.saveFile().catch(function(oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});
		},
	
		


		
	});
}, /* bExport= */ true);

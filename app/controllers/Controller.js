class Controller {
	constructor () {
		return {
			Admin: {
				VisitController: require('./Admin/VisitController')
			},
			Client: {
				PlanController: require('./Client/PlanController'),
				VisitController: require('./Client/VisitController'),
				ReportController: require('./Client/ReportController'),
				PartnerController: require('./Client/PartnerController'),
				ProductController: require('./Client/ProductController'),
				InventoryController: require('./Client/InventoryController'),
				PointofSalesController: require('./Client/PointofSalesController'),
				PartnerAddressController: require('./Client/PartnerAddressController'),
				ParnterContactController: require('./Client/PartnerContactController'),
				SalesQuotationController: require('./Client/SalesQuotationController'),
			},
			Default: {
				AuthController: require('./AuthController'),
				MasterController: require('./MasterController'),
			}
		}
	}
}

module.exports = new Controller()
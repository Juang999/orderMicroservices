class Controller {
	constructor () {
		return {
			Admin: {
				VisitController: require('./Admin/VisitController')
			},
			Client: {
				ProductController: require('./Client/ProductController'),
				PartnerController: require('./Client/PartnerController'),
				PlanController: require('./Client/PlanController'),
				PartnerAddressController: require('./Client/PartnerAddressController'),
				ParnterContactController: require('./Client/PartnerContactController'),
				VisitController: require('./Client/VisitController'),
				SalesQuotationController: require('./Client/SalesQuotationController'),
				ReportController: require('./Client/ReportController'),
				PointofSalesController: require('./Client/PointofSalesController')
			},
			Default: {
				AuthController: require('./AuthController'),
				MasterController: require('./MasterController'),
			}
		}
	}
}

module.exports = new Controller()
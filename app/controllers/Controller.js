const Controller = {
	Admin: {
		SalesQuotationController: require('./Admin/SalesQuotationController')
	},
	Client: {
		ProductController: require('./Client/ProductController'),
		PriceController: require('./Client/PriceController'),
		PartnerController: require('./Client/PartnerController'),
		PlanController: require('./Client/PlanController'),
		PartnerAddressController: require('./Client/PartnerAddressController'),
		ParnterContactController: require('./Client/PartnerContactController'),
		VisitController: require('./Client/VisitController'),
		SalesQuotationController: require('./Client/SalesQuotationController')
	},
	Default: {
		AuthController: require('./AuthController'),
		MasterController: require('./MasterController'),
	}
}

module.exports = Controller
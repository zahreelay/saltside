var express = require('express');
var router = express.Router();
var api = require('../lib/api');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/*
* Task 1:
* Make models alphabetically sortable (ascending, descending, default)
*/
router.get('/models', function(req, res, next) {
	// use api to get models and render output
	api.fetchModels().then(function(models){
		var order = req.query && req.query.order  ;
		if(order == 'asc'){
			models = models.sort();
		}else if(order == 'desc'){
			models = models.sort().reverse();
		}
		res.render('models',{models:models});
	},function(err){
		res.render(error);
	});
});

/*
* Task 2:
* Make services filterable by type (repair, maintenance, cosmetic)
*/
router.get('/services', function(req, res, next) {
	// use api to get services and render output
	var type = req.query && req.query.type ;
	api.fetchServices().then(function(services){
		if(type){
			services = services.filter(function(service){
				return (service.type == type) ;
			});
		}
		
		res.render('services',{services:services});
	},function(err){
		res.render(error);
	});
});

/*
* Task 3:
* Bugfix: Something prevents reviews from being rendered
* Make reviews searchable (content and source)
*/
router.get('/reviews', function(req, res, next) {
	var text = req.query && req.query.text;
	return Promise.all([api.fetchCustomerReviews(), api.fetchCorporateReviews()])
		.then(function(reviews) {
			reviews = Array.prototype.concat.apply([],reviews);
			console.log(reviews.length);
			if(text){
				reviews = reviews.filter(function(review){
					return review.content.indexOf(text) > -1 ||
							review.source.indexOf(text) > -1 ;

				});
			}
			res.render('reviews', {reviews: reviews});
		},function(err){
			res.render(error);
		});
});

module.exports = router;

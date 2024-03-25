var express = require('express');
var router = express.Router();


router.get('/',function(req,res,next){
    res.render('intro',{ title: 'Express' })
})
module.exports = router
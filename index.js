const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

//const endpoint = require('./application/endpoint');
//const jsonql = require('./modules/es5/jsonql');

const app = express();

app.listen(80, () => console.log('golden-square@80'));

app.use(express.static(path.join(__dirname, 'public'), {'extensions':['html']}));

//app.use('/jsonql',
//  bodyParser.json({type:'*/*', strict:false}),
//  jsonql.express(endpoint)
//);

app.use(function(err, req, res, next){
  res.status(500).json({errors:err.toString()});
});
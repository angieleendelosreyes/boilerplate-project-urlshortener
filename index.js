require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
const dns = require('dns');
const url = require('url');


// Basic Configuration
const port = process.env.PORT || 3000;
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const options = {
    all:true,
};

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


let array = [];

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:id', function(req, res) {
  console.log('/api/shorturl',parseInt(req.params.id));
  
  var output = array.filter(function(value){ 
    console.log(typeof value.short_url, typeof parseInt(req.params.id), value.short_url===parseInt(req.params.id));
          return value.short_url===parseInt(req.params.id);
        })
  res.redirect(output[0].original_url);
});
// /api/shorturl
app.post('/api/shorturl',urlencodedParser, function(req, res) {
  console.log('/shorturl', req.body.url);

  u = url.parse(req.body.url)
  if(u.host == null){
        res.json({error: 'invalid url'})
      }
  dns.lookup(u.host, options, (err, address, family) =>
    {
      if(err){
        // console.log(err);
        res.json({error: 'invalid url'})
      }
      else{

        // console.log('ARray', array);
 
        var output = array.filter(function(value){ 
          return value.original_url===req.body.url;
        })
        
        // console.log('output', output, output.length);

        if(output.length === 0){
          array.push({ original_url : req.body.url, short_url : array.length + 1});
          // console.log(array);
          
            res.json(array[array.length - 1]);
          }
        else{
          res.json(output[0])
        }
        }



        
        
    }
  )
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

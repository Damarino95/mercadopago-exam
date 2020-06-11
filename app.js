var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require("mercadopago");
 
var app = express();
const port = process.env.PORT || 3000

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/approved', function (req, res) {
    res.render('approved', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

app.get('/rejected', function (req, res) {
    res.render('rejected', req.query);
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

mercadopago.configure({
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
});
 

app.post('/hola', function (req, res) {
    res.send('[POST]Saludos desde express');
    console.log(req.query);
});

app.get('/pagar', function(req, res){
    
    // Crea un objeto de preferencia
    let preference = {
        items: [
            {
                id: '1234',
                title: req.query.title,
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: req.query.img,
                quantity: Number(req.query.unit),
                currency_id: 'ARS',
                unit_price: Number(req.query.price)
            }
        ],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
                area_code: "11",
                number: 22223333
            },
            address: {
                street_name: "False",
                street_number: 123,
                zip_code: "1111"
            }
        },
        payment_methods: {
            excluded_payment_types: [
                {
                    id: 'atm'
                }
            ],
            excluded_payment_methods: [
                {
                    id: 'amex'
                }
            ],
            installments: 6,
            
        },
        back_urls: {
            success: 'http://localhost:3000/approved',
            failure: 'http://localhost:3000/rejected',
            pending: 'http://localhost:3000/pending'
        },
        notification_url: 'https://webhook.free.beeceptor.com',
        external_reference: "damian.marino95@gmail.com",
        auto_return: 'approved'
    };

    mercadopago.preferences.create(preference)
      .then(function(response){
        res.redirect(response.body.init_point);
      }).catch(function(error){
        console.log(error);
    });
});


app.listen(port, () => {
    console.log('Server is up on port ' + port)
  })
const express = require('express');

const cors = require('cors');

// const testStripeKey = process.env.TEST_STRIPE;
const testStripeKey =
  process.env.TEST_STRIPE ||
  'sk_test_51PMADwRtorj52eamj42PVhENi4pZTMEOlOuP68cHhlxC4dZiqzfE955gCc2UB2aoZpdjolU9j6H1Gy5HvZgjMpdh00lx4pDAfC';

const stripe = require('stripe')(testStripeKey);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// const whitelist = ['http://localhost:3000', 'http://localhost:4200', 'https://api.stripe.com', 'https://vineyardsinandes.web.app', 'https://tupungatowineco.com'];
// const options = {
//   origin: (origin, callBack) => {
//     if (whitelist.includes(origin)) {
//       callBack(null, true)
//     } else {
//       callBack(new Error('no permission'))
//     }
//   }
// }

// app.use(cors(options));

app.use(cors());

app.get('/api', (req, res) => {
  const gol = {
    algo_importante: 'somos nosotros server expres',
  };
  res.send(gol);
});

app.get('/api/test', (req, res) => {
  const gol = {
    algo: 'somos nosotros',
    testkey: testStripeKey,
  };
  // console.log("TESTEANDO");
  res.send(gol);
});

app.post('/api/create_user', async (req, res) => {
  const user = req.body.user;
  console.log('aca etamos');
  console.log(user);
  const customer = await stripe.customers.create(user);
  console.log(customer);
  res.send(customer);
});

app.get('/api/get_user', async (req, res) => {
  const user_stripeID = req.body.user.stripeID;
  console.log('aca  etamos get_user');
  // console.log(user);
  console.log(user_stripeID);
  const customer = await stripe.customers.retrieve(user_stripeID);
  console.log(customer);
  res.send(customer);
});

app.get('/api/get_prices', async (req, res) => {
  console.log('aca estamos pidiendo precios');
  const prices = await stripe.prices.list({
    limit: 8,
  });
  console.log(prices);
  res.send(prices);
});

app.get('/api/get_products', async (req, res) => {
  console.log('aca estamos pidiendo precios');
  const products = await stripe.products.list({
    limit: 8,
  });
  console.log(products);
  res.send(products);
});

app.get('/api/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:4200/success',
    cancel_url: 'http://localhost:4200/cancel',
  });

  res.redirect(303, session.url);
  // res.send(session.url);
});


app.listen(3000, () => {
  console.log('We are in port ==>  ' + port);
});

module.exports = app;

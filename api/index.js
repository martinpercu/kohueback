const express = require('express');

const cors = require('cors');


// const testStripeKey = process.env.PAYMENT_KEY;
// const testStripeKey = process.env.TEST_STRIPE || 'sk_test_51PMADwRtorj52eamj42PVhENi4pZTMEOlOuP68cHhlxC4dZiqzfE955gCc2UB2aoZpdjolU9j6H1Gy5HvZgjMpdh00lx4pDAfC';
const testStripeKey = process.env.TEST_STRIPE;


// const domainURL = process.env.DOMAIN_URL;
const domainURL = 'https://vineyardsinandes.web.app';
// const domainURL = process.env.DOMAIN_URL || 'http://localhost:4200';

const stripe = require('stripe')(testStripeKey);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// const whitelist = ['http://localhost:3000', 'http://localhost:4200', 'https://api.stripe.com', 'https://vineyardsinandes.web.app', 'https://tupungatowineco.com', 'https://kohuewines.com'];
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
  res.send(gol);
});

app.post('/api/create_user', async (req, res) => {
  const user = req.body.user;
  const customer = await stripe.customers.create(user);
  console.log(customer);
  res.send(customer);
});

app.post('/api/update_user', async (req, res) => {
  const userID = req.body.stripeId;
  const user = req.body.user;
  console.log(userID);
  console.log(user);
  const customer = await stripe.customers.update(
    userID,
    user
  );
  // console.log(customer);
  res.send(customer);
});


app.get('/api/get_customers', async (req, res) => {
  console.log('aca estamos pidiendo productos');
  const customers = await stripe.customers.list({
    limit: 5,
  });
  console.log(customers);
  res.send(customers);
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
  console.log('aca estamos pidiendo productos');
  const products = await stripe.products.list({
    limit: 8,
  });
  console.log(products);
  res.send(products);
});

app.post('/api/create-checkout-session', async (req, res) => {
  const user = req.body.user;
  // console.log(user);
  const product = req.body.product;
  // console.log(product);
  const quantity = req.body.quantity;
  // console.log(quantity);
  const customerStripeId = req.body.user.stripeCustomerId;
  const stripeShippingId = req.body.stripeShippingId;
  const priceProductId = req.body.priceProductId
  console.log(priceProductId);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // price: 'price_1Q1F0sRtorj52eam1OYBp40D',
        // price: 'price_1QC1OKRtorj52eamW0qSiCnd',
        price: priceProductId,
        quantity: quantity,
      }
    ],
    customer: customerStripeId,
    // customer_email: user_email,
    automatic_tax: {
      enabled: true,
    },
    billing_address_collection: 'required',
    customer_update: {
      // address: auto,
      shipping: 'auto'
    },
    shipping_options: [
      {
        shipping_rate: stripeShippingId
      },
      // {
      //   shipping_rate: "shr_1Pzh4nRtorj52eamvxRLabqL"
      // },
      // {
      //   shipping_rate: "shr_1Pzh4ERtorj52eamXRL27RHT"
      // }
    ],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US']
    },
    success_url: `${domainURL}/members`,
    cancel_url: `${domainURL}/members`,
    locale: 'en'

  });

  const respuesta = {
    url: session.url,
  };
  res.send(respuesta);
});


app.get('/api/payment_intents', async (req, res) => {
  const payment_intents = await stripe.paymentIntents.list({
    limit: 8,
  });
  // console.log(payment_intents);
  res.send(payment_intents);
});

app.post('/api/payment_intents_by_user', async (req, res) => {
  const user = req.body.user;
  console.log(user);
  const userID = req.body.user.stripeCustomerId;
  console.log(userID);
  const payment_intents = await stripe.paymentIntents.list({
    customer: userID,
    limit: 8,
  });
  // console.log(payment_intents);
  res.send(payment_intents);
});

app.get('/api/sessions', async (req, res) => {
  const sessions = await stripe.checkout.sessions.list({
    customer: 'cus_Qt114pJ4zIWSFU',
    limit: 5,
  });
  res.send(sessions);
});

app.get('/api/sessionsItems', async (req, res) => {
  const sessions = await stripe.checkout.sessions.retrieve(
    'cs_test_a1sbxqs3qmnsnNPty2vexvdGg7YOOQ2kucHDuTu0bZ443dYo1bQK9NmLtC',
    {
    expand: ['line_items'],
    });
  res.send(sessions);
});



app.listen(3000, () => {
  console.log('We are in port ==>  ' + port);
});

module.exports = app;

const express = require('express');

const cors = require('cors');

// const testStripeKey = process.env.PAYMENT_KEY;
const testStripeKey = process.env.TEST_STRIPE || 'sk_test_51PMADwRtorj52eamj42PVhENi4pZTMEOlOuP68cHhlxC4dZiqzfE955gCc2UB2aoZpdjolU9j6H1Gy5HvZgjMpdh00lx4pDAfC';
// const testStripeKey = process.env.TEST_STRIPE;


// const domainURL = process.env.DOMAIN_URL;
// const domainURL = 'https://kohuewines.com';
const domainURL = process.env.DOMAIN_URL || 'http://localhost:4200';

const stripe = require('stripe')(testStripeKey);

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:3000',
      'https://vineyardsinandes.web.app',
      'https://tupungatowineco.com',
      'https://kohuewines.com',
      'https://kohueback.vercel.app'
    ];

    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// CORS debe ir ANTES de express.json()
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Middleware de parsing después de CORS
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
// app.use(cors());

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
  const customer = await stripe.customers.update(userID, user);
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
  console.log(req.body);

  const user = req.body.user;
  // console.log(user);
  const product = req.body.product;
  // console.log(product);
  const quantity = req.body.quantity;
  // console.log(quantity);
  const customerStripeId = req.body.user.stripeCustomerId;
  const stripeShippingId = req.body.stripeShippingId;
  const priceProductId = req.body.priceProductId;
  const californiaTaxId = req.body.californiaTaxId;
  console.log(priceProductId);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // price: 'price_1Q1F0sRtorj52eam1OYBp40D',
        // price: 'price_1QC1OKRtorj52eamW0qSiCnd',
        price: priceProductId,
        quantity: quantity,
        tax_rates: [californiaTaxId],
      },
    ],
    customer: customerStripeId,
    // customer_email: user_email,
    automatic_tax: {
      enabled: false,
    },
    billing_address_collection: 'required',
    customer_update: {
      // address: auto,
      shipping: 'auto',
    },
    shipping_options: [
      {
        shipping_rate: stripeShippingId,
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
      allowed_countries: ['US'],
    },
    success_url: `${domainURL}/succes`,
    cancel_url: `${domainURL}/members`,
    locale: 'en',
  });

  const respuesta = {
    url: session.url,
  };
  res.send(respuesta);
});


app.post('/api/create-checkout-session-test-price', async (req, res) => {
  console.log(req.body);

  // const user = req.body.user;
  // console.log(user);
  // const product = req.body.product;
  // console.log(product);
  const quantity = req.body.quantity;
  // console.log(quantity);
  const customerStripeId = req.body.user.stripeCustomerId;
  const stripeShippingId = req.body.stripeShippingId;
  const priceProductId = req.body.priceProductId;
  const californiaTaxId = req.body.californiaTaxId;
  const shippingCost = req.body.shippingCost;

  const itemsInLine = {
        price: priceProductId,
        quantity: quantity,
        tax_rates: [californiaTaxId],
  };

  const booleanAutoTax = { enabled: false };

  // Crear una tarifa de envío con el valor recibido del frontend
  const shippingRate = await stripe.shippingRates.create({
    display_name: 'Envío personalizado',
    type: 'fixed_amount',
    fixed_amount: {
      amount: shippingCost * 100, // Convertir a centavos (Stripe usa la unidad más pequeña)
      currency: 'usd', // Ajusta según tu moneda
    },
  });
  console.log(shippingRate);

  const session = await stripe.checkout.sessions.create({
    line_items: [ itemsInLine ],
    customer: customerStripeId,
    // customer_email: user_email,
    automatic_tax: booleanAutoTax,
    billing_address_collection: 'required',
    customer_update: {
      // address: auto,
      shipping: 'auto',
    },
    shipping_options: [
      {
        shipping_rate: shippingRate.id,
      }
      // {
      //   shipping_rate: stripeShippingId,
      // }
    ],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    success_url: `${domainURL}/succes`,
    cancel_url: `${domainURL}/members`,
    locale: 'en',
  });

  const respuesta = {
    url: session.url,
  };
  res.send(respuesta);
});

app.post('/api/directlink-create-checkout-session', async (req, res) => {
  const quantity = req.body.quantity;
  // console.log(quantity);
  const stripeShippingId1 = req.body.stripeShippingId1;
  const stripeShippingId2 = req.body.stripeShippingId2;
  const stripeShippingId3 = req.body.stripeShippingId3;
  const priceProductId = req.body.priceProductId;
  const californiaTaxId = req.body.californiaTaxId;
  // console.log(priceProductId);
  // console.log("quantity abajo");
  // console.log(quantity);


  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceProductId,
        quantity: quantity,
        tax_rates: [californiaTaxId],
      },
    ],
    metadata: {
      reseller: 'ONE BOTTLE',
    },
    automatic_tax: {
      enabled: false,
    },
    billing_address_collection: 'required',
    shipping_options: [
      {
        shipping_rate: stripeShippingId1,
      },
      {
        shipping_rate: stripeShippingId2,
      },
      {
        shipping_rate: stripeShippingId3,
      },
    ],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    success_url: `${domainURL}/success_offering`,
    // cancel_url: `${domainURL}/offering`,
    cancel_url: `${domainURL}/offer1`,
    locale: 'en',
    // metadata: {
    //   reseller: 'Mario'
    // }
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
    },
  );
  res.send(sessions);
});

app.get('/api/customers/orders/:id', async (req, res) => {
  console.log('estamos aca');
  try {
    const { id } = req.params;
    const customerId = id;

    const fullOrders = await stripe.paymentIntents.list({
      customer: customerId, // The customer whose payment history you want
      limit: 10, // Optional: You can adjust the limit to control how many records to fetch
    });

    console.log(fullOrders.data); // Log or process the list of PaymentIntents
    res.send(fullOrders);
  } catch (error) {
    console.error('Error retrieving payment history:', error);
  }
});

app.get('/api/customers/sessions/:id', async (req, res) => {
  console.log('sessions aca');
  try {
    const { id } = req.params;
    const customerId = id;
    // List all Checkout Sessions for the customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 200, // Optional: You can adjust the limit
    });

    // Log the session IDs and other details
    sessions.data.forEach((session) => {
      console.log(`Checkout Session ID: ${session.id}`);
      console.log(`Session Status: ${session.status}`);
      console.log(
        `Amount Total: ${session.amount_total / 100} ${session.currency}`,
      );
      console.log(
        `Created: ${new Date(session.created * 1000).toLocaleString()}`,
      );
    });
    console.log(sessions);

    res.send(sessions.data);
  } catch (error) {
    console.error('Error retrieving Checkout Sessions:', error);
  }
});

app.post('/api/sessions/products-in-session', async (req, res) => {
  console.log('products-in-session aca');
  try {
    const sessionsIds = req.body;
    console.log(req.body);

    const allLineItems = [];

    // Loop through each sessionId
    for (const sessionId of sessionsIds) {
      // Retrieve the line items for each session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        sessionId,
        {
          limit: 100, // Adjust based on your needs (pagination supported)
        },
      );
      // Retrieve the Checkout Session using the session ID
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Convert the Unix timestamp to a JavaScript Date object
      const createdAt = new Date(session.created * 1000); // Multiply by 1000 to convert from seconds to milliseconds

      // Collect the line items
      allLineItems.push({
        sessionId,
        createdAt: createdAt,
        lineItems: lineItems.data,
      });
    }

    // lineItems.data.forEach(item => {
    //   console.log(`Product: ${item.description}`);
    //   console.log(`Quantity: ${item.quantity}`);
    //   console.log(`Amount: ${item.amount_total / 100} ${item.currency}`);
    // });

    console.log(allLineItems);

    res.send(allLineItems);
  } catch (error) {
    console.error('Error retrieving Checkout Session line items:', error);
  }
});

app.listen(3000, () => {
  console.log('We are in port ==>  ' + port);
});

module.exports = app;

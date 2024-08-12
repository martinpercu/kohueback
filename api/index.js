const express = require("express");

const cors = require("cors");
const stripe = require("stripe")("sk_test_51PMADwRtorj52eamj42PVhENi4pZTMEOlOuP68cHhlxC4dZiqzfE955gCc2UB2aoZpdjolU9j6H1Gy5HvZgjMpdh00lx4pDAfC");

const app = express();
const port = process.env.PORT || 3000;

const testStripeKey = process.env.TEST_STRIPE;


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
  algo_importante: 'somos nosotros server expres'
};
  res.send(gol)
});


app.get('/api/test', (req, res) => {
  const gol = {
    algo: 'somos nosotros',
    testkey: testStripeKey
  };
  // console.log("TESTEANDO");
  res.send(gol)
});

app.post('/api/create_user', async (req, res) => {
  const user = req.body.user;
  console.log('aca etamos');
  console.log(user);
  const customer = await stripe.customers.create(user);
  console.log(customer);
  res.send(customer)
});

app.get('/api/get_user', async (req, res) => {
  const user_stripeID = req.body.user.stripeID;
  console.log('aca  etamos get_user');
  // console.log(user);
  console.log(user_stripeID);
  const customer = await stripe.customers.retrieve(user_stripeID);
  console.log(customer);
  res.send(customer)
});





app.listen(3000, () => {
  console.log('We are in port ==>  ' + port);
});


module.exports = app


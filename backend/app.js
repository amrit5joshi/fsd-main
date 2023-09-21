const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51NscgDL6VyPCdQrFp1Kz5Lr1SMS6DERCRaTN9nVMfRe70DCX15etVuQsSEtzrzQdwc36q2t7BKJLtww5F07j4byb00JtBiqv8g');
var cors = require('cors');
app.use(cors({
    origin: "http://localhost:3000",
  }));
app.use(express.json());

app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, currency, description, paymentMethod } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method: paymentMethod,
      confirm: true,
      return_url: 'http://localhost:3000'
    });
    res.json(paymentIntent);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/transactions/:id/refund', async (req, res) => {
  try {
    const transactionId = req.params.id;

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    // Refund the payment intent
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
    });

    res.json(refund);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscriptions', async (req, res) => {
  try {
      // in actual project, we will have already existing customer, here we just created a user to demonstate the subscription functionality
    const customer = await stripe.customers.create({        
        email: "amrit@gmail.com",
        name: "amrit",
        payment_method: "pm_card_visa",
        invoice_settings: {
          default_payment_method: "pm_card_visa",
        },
      });
      // creating product to subscribe
      const product = await stripe.products.create({
        name:"my product",
        description: "description of my product",
        type: 'service', 
        active: true, 
      });
    // attaching price to the product
    const price = await stripe.prices.create({
        unit_amount: 1000,
        currency: "usd",
        product: product.id,
        recurring:{
            'interval': 'month',
            'interval_count': 6
        },        
        });
      // creating the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
    });

    res.json(subscription);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

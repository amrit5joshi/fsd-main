import './App.css';
import {useState} from 'react';

const App = () => {
  const [transactionId, setTransactionId] = useState();
  const [customerId, setCustomerId] = useState();
  const [priceId, setPriceId] = useState();

  const submitTransaction = async () => {
    const amount = 1000;
    const currency = 'usd';
    const description = 'New Transaction';
    const paymentMethod = 'pm_card_visa'; 

    try {
      const response = await fetch('http://localhost:3001/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, description, paymentMethod }),
      });

      const paymentIntent= await response.json();
      setTransactionId(paymentIntent.id)
      console.log('Payment intent details:', paymentIntent);
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  const refundTransaction = async (transactionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/transactions/${transactionId}/refund`, {
        method: 'POST',
      });

      const refund = await response.json();
      console.log('Refund message:', refund);
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  const createSubscription = async () => {
    const priceId = 'price_id_here';
    const customerId = 'customer_id_here';

    try {
      const response = await fetch('http://localhost:3001/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, customerId }),
      });

      const subscription = await response.json();
      console.log('Subscription details:', subscription);
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  return (
    <div>
      <button onClick={submitTransaction}>Submit Transaction</button>
      <button onClick={() => refundTransaction(transactionId)}>
        Refund Transaction
      </button>
      <button onClick={createSubscription}>Create Subscription</button>
    </div>
  );
};

export default App;
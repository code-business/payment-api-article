import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

const MyCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URI}/create-payment-intent`,
          {
            amount: 1000, // Replace with the actual amount in cents
            currency: "INR", // Replace with the actual currency
          }
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchClientSecret();
  }, []);

  const handlePayment = async (event) => {
    event.preventDefault();

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      console.error("Payment failed:", error);
    } else {
      console.log("Payment succeeded:", paymentIntent);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      {/* 4000 0035 6000 0008 test card for India  */}
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <MyCheckoutForm />
    </Elements>
  );
};

export default App;

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(cors());

// Add your routes and other server configurations
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Hello, World!" });
});

// Example endpoint for creating a payment intent
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({
      status: "failed",
      message: "Insufficient data provided",
    });
  }

  try {
    let paymentIntentData = {
      amount,
      currency,
      description: "Trying Stripe using Node.js and React!!!",
    };

    if (currency !== "INR") {
      paymentIntentData.shipping = {
        name: "Sandip",
        address: {
          line1: "Code B",
          city: "Navi Mumbai",
          postal_code: "400708",
          state: "Maharashtra",
          country: "IN",
        },
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    res.json({ status: "success", clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

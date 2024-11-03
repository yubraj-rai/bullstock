const express = require("express");
const stripe = require("stripe")("sk_test_51QFejRD5fVcCMFTPfaKO2rbwwZtITsrhgalRVaYM7ImVdyYOoTGpcqPpp5PEVjjyyVpCtvh5QzU9TdrKRts2BlFV001YFJOKnR");
const cors = require("cors");
const router = express.Router();

router.use(cors());

router.get("/", (req, res) => {
  res.json({ message: "It Works" });
});

router.post("/pay", async (req, res) => {
  const { token, amount } = req.body;

  try {
    // Step 1: Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10 * 100, // Stripe expects the amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Step 2: Confirm the PaymentIntent with token as payment method
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method_data: {
          type: "card",
          card: {
            token: token.id, // Use token.id here
          },
        },
      }
    );

    res.status(200).json(confirmedPaymentIntent);
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

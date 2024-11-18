import { Router, Request, Response } from "express";
import stripe from "../utils/stripeInstance";

// Initialize Stripe
const router = Router();

router.post("/add-funds", async (req: Request, res: Response) => {
  try {
    const charge = await stripe.charges.create({
      amount: 1000000, // Amount in cents (e.g., 100000 = $1000)
      currency: "cad",
      source: "tok_bypassPending", // Test token to bypass pending state
      description: "Adding test funds to platform account",
    });
    console.log("Test charge created successfully:", charge);
    res.status(200).json({ success: true, charge });
  } catch (err) {
    if (err instanceof stripe.errors.StripeError) {
      console.error("Stripe error:", err.message);
      res.status(500).json({ success: false, error: err.message });
    } else {
      console.error("Unexpected error:", err);
      res
        .status(500)
        .json({ success: false, error: "Unexpected error occurred" });
    }
  }
});

export default router;

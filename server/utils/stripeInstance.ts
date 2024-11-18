import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-10-28.acacia" as any,
});


// Confirm Stripe initialization or log an error if the secret key is missing
if (process.env.STRIPE_SECRET_KEY) {
  console.log("Stripe initialized successfully with the provided secret key.");
} else {
  console.error(
    "Stripe secret key is missing or undefined. Please check your environment variables."
  );
}

// Export the initialized Stripe instance for use across the application
export default stripe;

/**
 * Interface for payment options passed to the service.
 */
interface PaymentOptions {
  planName: 'Pro' | 'Creator Pro Max';
  amount: number; // The amount in INR
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

/**
 * Initiates the Razorpay payment process.
 * This function encapsulates the Razorpay checkout logic, making it reusable.
 *
 * @param {PaymentOptions} options - The payment configuration.
 */
export const initiatePayment = ({ planName, amount, onSuccess, onFailure }: PaymentOptions) => {
  // Razorpay requires the amount in the smallest currency unit (e.g., paise for INR).
  const amountInPaise = amount * 100;

  const options = {
    // The key is now sourced from environment variables, configured via Vite.
    key: process.env.RAZORPAY_KEY_ID, 
    amount: amountInPaise,
    currency: "INR",
    name: "CreatorTune",
    description: `Subscription for CreatorTune - ${planName} Plan`,
    
    /**
     * This handler is called on successful payment.
     * In a real-world app, you MUST send the payment IDs to your backend for verification.
     * @param response - Contains payment details like razorpay_payment_id.
     */
    handler: function (response: any) {
      console.log("Frontend success handler executed:", response);
      // Here, you would typically call a backend endpoint to verify the signature.
      // For this example, we directly call the onSuccess callback.
      onSuccess();
    },
    
    // Prefill is optional, but can improve user experience if the user is logged in.
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    
    notes: {
      plan_name: planName,
    },
    
    theme: {
      color: "#8A2BE2", // A purple color matching the app's theme.
    },
    
    /**
     * This handler is called when the user closes the Razorpay modal without completing payment.
     */
    modal: {
      ondismiss: function () {
        onFailure("Payment was cancelled by the user.");
      },
    },
  };
  
  // Developer check: Ensure the key is present in the environment.
  if (!options.key || options.key === 'undefined') {
    onFailure("Payment gateway is not configured. Please set the VITE_RAZORPAY_KEY_ID environment variable.");
    return;
  }


  // Check if Razorpay script is loaded
  if (!window.Razorpay) {
    onFailure("Razorpay SDK could not be loaded. Please check your internet connection and try again.");
    return;
  }

  const rzp = new window.Razorpay(options);

  // Listen for payment failure events
  rzp.on('payment.failed', function (response: any) {
    console.error("Payment failed event:", response.error);
    onFailure(`Payment failed. Reason: ${response.error.description}. Please try again.`);
  });
  
  // Open the Razorpay checkout modal
  rzp.open();
};
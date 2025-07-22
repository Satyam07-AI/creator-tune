/**
 * Sends a contact form message to a configured webhook endpoint.
 * If the webhook is not configured, it simulates a successful submission for development purposes.
 *
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} message - The user's message.
 * @throws {Error} If the submission fails with a configured webhook.
 */
export const sendContactMessage = async (name: string, email: string, message: string): Promise<void> => {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl === 'undefined') {
    console.log("Contact webhook URL is not configured. Simulating successful submission.");
    console.log("--- MOCK CONTACT SUBMISSION ---");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log("-------------------------------");
    // Simulate a successful API call for a better UX in dev/unconfigured environments.
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: "CreatorTune Contact Form",
      embeds: [{
        title: "New Support Message",
        color: 15277667, // Purple color
        fields: [
          { name: "Name", value: name, inline: true },
          { name: "Email", value: email, inline: true },
          { name: "Message", value: message }
        ],
        timestamp: new Date().toISOString()
      }]
    }),
  });

  if (!response.ok) {
    // Attempt to get more info from the response body if possible
    const errorBody = await response.text();
    console.error("Failed to send contact message. Status:", response.status, "Body:", errorBody);
    throw new Error("There was a problem sending your message. Please try again.");
  }
};

import { getModels } from "../../models/registry.js";

// All providers are mocked for the prototype — they log clearly instead of
// calling a real email/SMS/WhatsApp API. Swapping in a real provider means
// replacing the body of these three functions only.
const MockEmailProvider = {
  send: (to, subject, body) => console.log(`[MOCK EMAIL]\nTo: ${to}\nSubject: ${subject}\n${body}\n`),
};
const MockWhatsAppProvider = {
  send: (to, body) => console.log(`[MOCK WHATSAPP]\nTo: ${to}\n${body}\n`),
};
const MockSMSProvider = {
  send: (to, body) => console.log(`[MOCK SMS]\nTo: ${to}\n${body}\n`),
};

export const NotificationService = {
  async sendOTP(identifier, channel, otp) {
    const body = `Your SETU verification code is ${otp}. (Demo build: this code is always 1111.)`;
    if (channel === "whatsapp") MockWhatsAppProvider.send(identifier, body);
    else if (channel === "sms") MockSMSProvider.send(identifier, body);
    else MockEmailProvider.send(identifier, "Your SETU verification code", body);
  },

  async sendConsentRequestEmail(email) {
    MockEmailProvider.send(
      email,
      "Action required: Review your SETU document access",
      "SETU generated your approval-readiness checklist. Your permission is required to check documents in your selected source against that checklist. No documents are attached to this email — sign in to SETU to review and respond."
    );
  },

  async sendInApp(userId, title, body) {
    const { Notification } = getModels();
    return Notification.create({ userId, title, body });
  },
};

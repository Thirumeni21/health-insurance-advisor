/**
 * =========================================================================
 * ADVISOR DETAILS — FILL THIS IN
 * =========================================================================
 * 
 * Replace these placeholders with your actual information whenever ready.
 * When you provide your phone number and email, the contact action buttons
 * on the website will automatically connect to them.
 */

export interface AdvisorConfig {
  name: string;
  phone: string;
  email: string;
  designation: string;
  additionalDetails: string;
  // Direct action links (optional - can be updated once phone/email is added)
  phoneRaw?: string;       // e.g. "+919876543210" for tel: links
  whatsappRaw?: string;    // e.g. "919876543210" for https://wa.me/ links
}

export const ADVISOR_CONFIG: AdvisorConfig = {
  name: "[YOUR NAME HERE]",
  phone: "[YOUR PHONE NUMBER HERE]",
  email: "[YOUR EMAIL HERE — OPTIONAL]",
  designation: "Health Insurance Advisor",
  additionalDetails: "[YOUR DETAILS HERE — OPTIONAL]",
  phoneRaw: "",
  whatsappRaw: "",
};

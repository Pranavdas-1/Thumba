import Razorpay from "razorpay";

export function isRazorpayTestKey(keyId: string): boolean {
  return keyId.startsWith("rzp_test_");
}

export function getPublicRazorpayKey(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}

export function createRazorpayInstance(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID || "";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "";

  if (!key_id || !key_secret) {
    throw new Error("Razorpay test keys are not configured in .env");
  }
  if (!isRazorpayTestKey(key_id)) {
    throw new Error("Only Razorpay test-mode keys (rzp_test_) are allowed");
  }

  return new Razorpay({ key_id, key_secret });
}

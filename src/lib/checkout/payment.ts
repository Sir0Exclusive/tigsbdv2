export type PaymentMethod = "cod" | "bkash" | "nagad" | "card";
export type PaymentIntent = { status: "pending"; method: PaymentMethod };

export interface PaymentProvider {
  createIntent(input: { orderId: string; amountCents: number; currency: string; method: PaymentMethod }): Promise<PaymentIntent>;
}

export class PlaceholderPaymentProvider implements PaymentProvider {
  async createIntent(input: { orderId: string; amountCents: number; currency: string; method: PaymentMethod }): Promise<PaymentIntent> {
    return { status: "pending", method: input.method };
  }
}
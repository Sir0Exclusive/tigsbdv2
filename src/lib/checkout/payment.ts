export type PaymentIntent = { status: "pending"; method: "placeholder" };

export interface PaymentProvider {
  createIntent(input: { orderId: string; amountCents: number; currency: string }): Promise<PaymentIntent>;
}

export class PlaceholderPaymentProvider implements PaymentProvider {
  async createIntent(): Promise<PaymentIntent> {
    return { status: "pending", method: "placeholder" };
  }
}
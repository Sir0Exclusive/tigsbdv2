import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
  firstName: z.string().trim().min(1, "Enter your first name.").max(80),
  lastName: z.string().trim().min(1, "Enter your last name.").max(80),
  address1: z.string().trim().min(3, "Enter your address.").max(160),
  address2: z.string().trim().max(160).optional().default(""),
  city: z.string().trim().min(2, "Enter your city.").max(80),
  region: z.string().trim().min(2, "Enter your region.").max(80),
  postalCode: z.string().trim().min(2, "Enter your postal code.").max(20),
  country: z.string().trim().min(2, "Enter your country.").max(80),
  shippingMethod: z.literal("standard"),
  idempotencyKey: z.string().uuid(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
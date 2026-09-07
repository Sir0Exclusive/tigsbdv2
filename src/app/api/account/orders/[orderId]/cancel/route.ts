import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { cancelCustomerOrder } from "@/lib/orders";

type Props = { params: Promise<{ orderId: string }> };
export async function POST(_request: Request, { params }: Props) { try { const user=await requireUser(); const {orderId}=await params; await cancelCustomerOrder(user.id,orderId); return NextResponse.json({ok:true}); } catch(error) { return NextResponse.json({error:error instanceof Error?error.message:"Unable to cancel order."},{status:400}); } }
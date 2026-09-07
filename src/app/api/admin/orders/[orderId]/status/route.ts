import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser, updateOrderStatus } from "@/lib/orders";

type Props = { params: Promise<{ orderId: string }> };
export async function PATCH(request: Request, { params }: Props) { try { const { orderId }=await params; const input=z.object({ status:z.enum(["confirmed","processing","shipped","delivered","cancelled"]), note:z.string().max(500).optional() }).parse(await request.json()); const {user}=await requireAdminUser(); await updateOrderStatus(user.id,orderId,input.status,input.note); return NextResponse.json({ok:true}); } catch(error) { return NextResponse.json({error:error instanceof Error?error.message:"Unable to update order."},{status:400}); } }
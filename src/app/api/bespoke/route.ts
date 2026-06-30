import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BespokeInquiry } from '@/models/BespokeInquiry';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { craft, dimensions, userName, userEmail, userWhatsApp } = body;
    
    if (!craft || !dimensions || !userName || !userEmail || !userWhatsApp) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const inquiry = await BespokeInquiry.create({
      craft,
      dimensions,
      userName,
      userEmail,
      userWhatsApp
    });
    
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

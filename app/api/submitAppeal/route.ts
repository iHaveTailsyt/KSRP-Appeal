import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { username, reason, appeal, devID, punishmentID, appealStatus } = body;  // Added more fields

  // Add your KSRP branding to the embed
  const embed = {
    title: '🚨 **KSRP Appeal Submission** 🚨',
    color: 0xFF4500, // KSRP brand color (you can modify this)
    fields: [
      { name: 'Username', value: username },
      { name: 'Reason for Punishment', value: reason },
      { name: 'Appeal Text', value: appeal },
      { name: 'Timestamp', value: new Date().toISOString() }, // Adding timestamp for appeal submission
    ],
    footer: {
      text: 'KSRP - DevOps Team',
      icon_url: 'https://your-ksrp-logo-url-here.com/logo.png', // Add your KSRP logo URL here
    },
    timestamp: new Date().toISOString(),
  };

  try {
    // Send the appeal information to Discord webhook
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'KSRP Appeal System',
        avatar_url: 'https://your-ksrp-avatar-url-here.com/avatar.png', // Add your KSRP avatar URL here
        embeds: [embed],
      }),
    });

    return NextResponse.json({ message: 'Appeal sent to Discord successfully' });
  } catch (err) {
    console.error('Error sending to webhook:', err);
    return NextResponse.json({ error: 'Failed to send appeal' }, { status: 500 });
  }
}

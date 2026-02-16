import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting map (simple in-memory solution)
const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string, maxRequests: number = 5, windowMs: number = 3600000): boolean {
  const now = Date.now()
  const userRequests = rateLimitMap.get(ip) || []

  // Filter out old requests outside the window
  const recentRequests = userRequests.filter((time) => now - time < windowMs)

  if (recentRequests.length >= maxRequests) {
    return true
  }

  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)

  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { name, email, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ message: 'Invalid field types' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
    }

    // Length validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ message: 'Name must be between 2 and 100 characters' }, { status: 400 })
    }

    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json({ message: 'Message must be between 10 and 5000 characters' }, { status: 400 })
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'aryanraj.dev.net@gmail.com',
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
          <h2 style="color: #22d3ee; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">📬 New Contact Form Submission</h2>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #22d3ee;">${escapeHtml(email)}</a></p>
          <div style="margin-top: 24px; padding: 20px; background: #1e293b; border-radius: 8px; border-left: 4px solid #22d3ee;">
            <p style="margin: 0 0 8px 0;"><strong style="color: #94a3b8;">Message:</strong></p>
            <p style="margin: 0; line-height: 1.6;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #64748b;">This email was sent from your portfolio contact form.</p>
        </div>
      `,
    })

    if (error) {
      console.error('[Contact Form] Resend error:', error)
      return NextResponse.json({ message: 'Failed to send email. Please try again.' }, { status: 500 })
    }

    console.log(`[Contact Form] Email sent successfully. ID: ${data?.id}`)

    return NextResponse.json(
      { message: 'Message sent successfully! I will get back to you soon.' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ message: 'An error occurred. Please try again.' }, { status: 500 })
  }
}

// Helper function to escape HTML (if needed for email)
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

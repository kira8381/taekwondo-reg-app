import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const ADMIN_EMAIL = "kirubelfikir5@gmail.com"

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    const emailBody = `
      <h2>New Competitor Registration</h2>
      <p><strong>Name:</strong> ${record.full_name}</p>
      <p><strong>Email:</strong> ${record.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${record.phone}</p>
      <p><strong>Club:</strong> ${record.club}</p>
      <p><strong>Age Category:</strong> ${record.age_category}</p>
      <p><strong>Weight:</strong> ${record.weight_category} kg</p>
      <p><strong>Payment Method:</strong> ${record.payment_method}</p>
      <p><strong>Fee:</strong> ${record.registration_fee} ETB</p>
      <hr/>
      <p>Review the details in the Admin Panel.</p>
    `

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Taekwondo Registration <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `New Registration: ${record.full_name}`,
        html: emailBody,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
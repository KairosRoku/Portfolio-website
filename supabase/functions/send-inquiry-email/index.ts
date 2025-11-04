import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InquiryData {
  name: string;
  email: string;
  discord: string;
  rigType: string;
  deadline: string;
  canStream: string;
  reference: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: InquiryData = await req.json();

    const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B6F47; border-bottom: 2px solid #D4A574; padding-bottom: 10px;">
            New Commission Inquiry
          </h2>
          
          <div style="background-color: #f9f5f0; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Discord:</strong> ${data.discord || 'Not provided'}</p>
            <p><strong>Rig Type:</strong> ${data.rigType}</p>
            <p><strong>Desired Deadline:</strong> ${data.deadline || 'Not specified'}</p>
            <p><strong>Can Stream Rigging Process:</strong> ${data.canStream}</p>
            <p><strong>Reference Links:</strong> ${data.reference || 'Not provided'}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #8B6F47;">Project Details:</h3>
            <p style="background-color: #f9f5f0; padding: 15px; border-radius: 8px; white-space: pre-wrap;">
              ${data.message}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #D4A574; font-size: 12px; color: #666;">
            <p>This is an automated email from your portfolio commission system.</p>
          </div>
        </div>
      </body>
    </html>
    `;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Commission Inquiries <noreply@kairoroku.com>",
        to: "kairoroku@gmail.com",
        subject: `New Commission Inquiry from ${data.name}`,
        html: emailContent,
        reply_to: data.email,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${emailResponse.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

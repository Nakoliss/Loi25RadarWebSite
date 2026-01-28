import nodemailer from "nodemailer";

export interface ContactFormEmail {
  name: string;
  email: string;
  phone?: string;
  domain?: string;
  auditType?: string;
  message?: string;
  locale?: string;
  timestamp: string;
}

// Email configuration from environment variables
const resolvedPort = parseInt(process.env.SMTP_PORT || "587");
const resolvedSecure =
  process.env.SMTP_SECURE === "true" || resolvedPort === 465;
const requireTLS = process.env.SMTP_REQUIRE_TLS === "true";

const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: resolvedPort,
  secure: resolvedSecure, // true for 465 (SSL), false for 587 (STARTTLS)
  requireTLS,
  auth: {
    user: process.env.SMTP_USER, // mailbox address (e.g., user@domain.com)
    pass: process.env.SMTP_PASS?.replace(/\s+/g, ""), // app-specific password (remove spaces)
  },
};

// Destination emails
const CONTACT_FORM_TO_EMAIL =
  process.env.CONTACT_EMAIL_TO?.trim() || "info@solutionsimpactweb.com";

/**
 * Create nodemailer transporter
 */
function createTransporter() {
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    console.warn(
      "Email service not configured. Missing variables:",
      !EMAIL_CONFIG.auth.user ? "SMTP_USER" : "",
      !EMAIL_CONFIG.auth.pass ? "SMTP_PASS" : "",
    );
    return null;
  }

  return nodemailer.createTransport(EMAIL_CONFIG);
}

/**
 * Format email content based on form data
 */
function formatEmailContent(formData: ContactFormEmail): {
  subject: string;
  html: string;
  text: string;
} {
  const language = formData.locale || "fr";

  // Subject line
  const subject = `📢 Nouveau Lead: ${formData.name} - ${formData.auditType || "Audit"}`;

  // HTML content
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .field strong { color: #059669; }
        .badge { background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .message-box { background: #F3F4F6; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; }
        .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Loi 25 Radar</h1>
        <p>Nouvelle demande de scan / contact</p>
      </div>
      
      <div class="content">
        <div class="field">
          <strong>Nom:</strong> ${formData.name}
        </div>
        
        <div class="field">
          <strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a>
        </div>
        
        ${formData.phone ? `<div class="field"><strong>Téléphone:</strong> ${formData.phone}</div>` : ""}
        ${formData.domain ? `<div class="field"><strong>Site Web:</strong> <a href="${formData.domain}">${formData.domain}</a></div>` : ""}
        
        <div class="field">
          <strong>Type de demande:</strong> <span class="badge">${formData.auditType || "Non spécifié"}</span>
        </div>
        
        <div class="field">
          <strong>Langue:</strong> ${language === "fr" ? "🇫🇷 Français" : "🇺🇸 Anglais"}
        </div>
        
        <div class="field">
          <strong>Reçu le:</strong> ${new Date(formData.timestamp).toLocaleString()}
        </div>
        
        ${
          formData.message
            ? `
        <div class="field">
          <strong>Message:</strong>
          <div class="message-box">${formData.message.replace(/\n/g, "<br>")}</div>
        </div>
        `
            : ""
        }
      </div>
      
      <div class="footer">
        <p>Envoyé via le formulaire Loi 25 Radar</p>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const text = `
Loi 25 Radar — Nouveau Lead

Nom: ${formData.name}
Email: ${formData.email}
Téléphone: ${formData.phone || "Non fourni"}
Site Web: ${formData.domain || "Non fourni"}
Forfait: ${formData.auditType || "Non spécifié"}

Message:
${formData.message || "Aucun message"}

Reçu le: ${new Date(formData.timestamp).toLocaleString()}
  `.trim();

  return { subject, html, text };
}

/**
 * Send contact form email
 */
export async function sendContactEmail(
  formData: ContactFormEmail,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log("------- EMAIL SIMULATION (SMTP Not Configured) -------");
      console.log(JSON.stringify(formData, null, 2));
      console.log("------------------------------------------------------");
      return { success: true, messageId: "simulated-no-config" };
    }

    const { subject, html, text } = formatEmailContent(formData);

    // Use CONTACT_EMAIL_TO as FROM address if it's an alias, otherwise use SMTP_USER
    const fromEmail =
      CONTACT_FORM_TO_EMAIL ||
      EMAIL_CONFIG.auth.user ||
      "no-reply@loi25radar.com";

    const mailOptions = {
      from: `"Loi 25 Radar" <${fromEmail}>`,
      to: CONTACT_FORM_TO_EMAIL,
      replyTo: formData.email,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Failed to send email:", error);

    if (error?.responseCode === 535) {
      console.error(
        "❌ AUTHENTICATION ERROR: It looks like your SMTP password is incorrect.",
      );
      console.error(
        "👉 TIP: If you have 2FA enabled on Zoho, you MUST use an 'App Password', not your main login password.",
      );
      console.error(
        "   Go to Zoho Accounts > Security > App Passwords to generate one.",
      );
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

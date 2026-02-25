import nodemailer from "nodemailer";

type InquiryPayload = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  referenceProject: string;
  referenceImage: string;
};

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string | string[]) => void;
  json?: (body: unknown) => void;
  end: (body?: string) => void;
};

const inquiryRecipient = "iletisim@demonteconcept.com";

const toStringValue = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const parseBody = (body: unknown): Record<string, unknown> => {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  if (typeof body === "object") {
    return body as Record<string, unknown>;
  }

  return {};
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sendJson = (res: ApiResponse, statusCode: number, payload: Record<string, unknown>) => {
  res.status(statusCode);
  if (typeof res.json === "function") {
    res.json(payload);
    return;
  }
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendJson(res, 405, { success: false, error: "Method not allowed" });
    return;
  }

  const body = parseBody(req.body);
  const payload: InquiryPayload = {
    fullName: toStringValue(body.fullName),
    company: toStringValue(body.company),
    email: toStringValue(body.email),
    phone: toStringValue(body.phone),
    projectType: toStringValue(body.projectType),
    message: toStringValue(body.message),
    referenceProject: toStringValue(body.referenceProject),
    referenceImage: toStringValue(body.referenceImage),
  };

  if (!payload.fullName || !payload.email || !payload.message) {
    sendJson(res, 400, {
      success: false,
      error: "Missing required fields: fullName, email, message",
    });
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(payload.email)) {
    sendJson(res, 400, { success: false, error: "Invalid email address" });
    return;
  }

  const smtpHost = process.env.EMAIL_SMTP_HOST;
  const smtpPort = Number(process.env.EMAIL_SMTP_PORT || "");
  const smtpUser = process.env.EMAIL_SMTP_USER;
  const smtpPass = process.env.EMAIL_SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    sendJson(res, 500, {
      success: false,
      error: "Email service is not configured",
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const safePayload = {
    fullName: escapeHtml(payload.fullName),
    company: escapeHtml(payload.company || "-"),
    email: escapeHtml(payload.email),
    phone: escapeHtml(payload.phone || "-"),
    projectType: escapeHtml(payload.projectType || "-"),
    message: escapeHtml(payload.message),
    referenceProject: escapeHtml(payload.referenceProject || "-"),
    referenceImage: escapeHtml(payload.referenceImage || "-"),
  };

  try {
    await transporter.sendMail({
      from: `Demonte Mobilya Website <${smtpUser}>`,
      to: inquiryRecipient,
      replyTo: payload.email,
      subject: `New Inquiry - ${payload.fullName}${payload.referenceProject ? ` (Ref: ${payload.referenceProject})` : ""}`,
      text: [
        `Full Name: ${payload.fullName}`,
        `Company: ${payload.company || "-"}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone || "-"}`,
        `Project Type: ${payload.projectType || "-"}`,
        `Reference Project: ${payload.referenceProject || "-"}`,
        `Reference Image: ${payload.referenceImage || "-"}`,
        "",
        "Message:",
        payload.message,
      ].join("\n"),
      html: `
        <h2>New Inquiry</h2>
        <p><strong>Full Name:</strong> ${safePayload.fullName}</p>
        <p><strong>Company:</strong> ${safePayload.company}</p>
        <p><strong>Email:</strong> ${safePayload.email}</p>
        <p><strong>Phone:</strong> ${safePayload.phone}</p>
        <p><strong>Project Type:</strong> ${safePayload.projectType}</p>
        <p><strong>Reference Project:</strong> ${safePayload.referenceProject}</p>
        <p><strong>Reference Image:</strong> ${safePayload.referenceImage}</p>
        <p><strong>Message:</strong><br/>${safePayload.message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    sendJson(res, 200, { success: true });
  } catch {
    sendJson(res, 500, {
      success: false,
      error: "Failed to send inquiry",
    });
  }
}

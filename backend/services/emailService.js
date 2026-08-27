// services/email.service.js
const { Resend } = require("resend");

const BRAND_NAME = "EbRahaStyle";
const SENDER_EMAIL = "no-reply@ebrahastyle.com";
const SENDER = `${BRAND_NAME} <${SENDER_EMAIL}>`;

const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

class EmailService {
  constructor() {
    const apiKey = process.env.RESEND_API_KEY?.trim();

    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY is missing from the environment variables",
      );
    }

    this.brandName = BRAND_NAME;
    this.senderEmail = SENDER_EMAIL;
    this.sender = SENDER;
    this.resend = new Resend(apiKey);
  }

  async sendEmail(mailOption = {}) {
    const recipients = Array.isArray(mailOption.to)
      ? mailOption.to
      : [mailOption.to];

    const cleanedRecipients = recipients
      .filter(Boolean)
      .map((email) => String(email).trim());

    if (
      cleanedRecipients.length === 0 ||
      cleanedRecipients.some((email) => !isValidEmail(email))
    ) {
      throw new Error("A valid recipient email address is required");
    }

    /*
     * مقدار from اینجا به‌صورت اجباری تنظیم می‌شود.
     * در نتیجه هیچ‌کدام از متدها نمی‌توانند مقدار from
     * را undefined یا نامعتبر ارسال کنند.
     */
    const finalMailOption = {
      ...mailOption,
      from: SENDER,
      to: Array.isArray(mailOption.to)
        ? cleanedRecipients
        : cleanedRecipients[0],
    };

    console.log("Sending email from:", JSON.stringify(finalMailOption.from));

    console.log("Sending email to:", JSON.stringify(finalMailOption.to));

    const { data, error } = await this.resend.emails.send(finalMailOption);

    if (error) {
      console.error("Resend API error:", error);

      const resendError = new Error(error.message || "Resend API error");

      resendError.statusCode = error.statusCode;
      resendError.name = error.name || "ResendError";

      throw resendError;
    }

    return data;
  }

  async sendVerificationCode(email, code) {
    const mailOption = {
      to: email,
      subject: `${this.brandName} — Your verification code`,
      html: `
        <div style="padding:40px 16px;background:#eee8df;font-family:Arial,sans-serif;color:#1a1614;">
          <div style="max-width:560px;margin:auto;background:#fffdf9;border:1px solid #d8cec2;padding:42px;">
            <p style="margin:0;color:#b59263;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
              Curated luxury · Dubai
            </p>

            <h1 style="margin:12px 0 32px;font-family:Georgia,serif;font-size:34px;font-weight:400;">
              ${this.brandName}
            </h1>

            <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:400;">
              Verify your email
            </h2>

            <p style="color:#625b56;line-height:1.7;">
              Use the private code below to complete your registration.
            </p>

            <div style="margin:30px 0;padding:20px;background:#3a1422;color:#fff;text-align:center;font-family:Georgia,serif;font-size:34px;letter-spacing:10px;">
              ${code}
            </div>

            <p style="color:#8d837c;font-size:12px;">
              This code is valid for 5 minutes. If you did not request it,
              you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      const data = await this.sendEmail(mailOption);

      console.log("Verification email sent:", data);

      return {
        success: true,
        message: "Email sent successfully",
        data,
      };
    } catch (error) {
      console.error("Email sending error:", error);

      return {
        success: false,
        message: error.message || "Failed to send email",
      };
    }
  }

  async sendPasswordResetEmail(email, resetLink, userName = "") {
    const mailOption = {
      to: email,
      subject: `${this.brandName} — Reset your password`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#fffdf9;border:1px solid #d8cec2;color:#1a1614;">
          <p style="color:#b59263;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
            Secure account access
          </p>

          <h1 style="font-family:Georgia,serif;color:#1a1614;font-weight:400;">
            ${this.brandName}
          </h1>

          <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:400;">
            Reset your password
          </h2>

          ${
            userName
              ? `<p>Hello <strong>${userName}</strong>,</p>`
              : "<p>Hello,</p>"
          }

          <p>
            We received a request to reset your password.
            Click the button below to reset it:
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a
              href="${resetLink}"
              style="background-color:#5a2135;color:white;padding:14px 32px;text-decoration:none;display:inline-block;font-size:12px;letter-spacing:2px;text-transform:uppercase;"
            >
              Reset Password
            </a>
          </div>

          <p>
            Or copy and paste this link into your browser:
          </p>

          <p style="background:#f5f5f5;padding:10px;word-break:break-all;font-size:12px;">
            ${resetLink}
          </p>

          <p>
            This link is valid for <strong>1 hour</strong>.
          </p>

          <p>
            If you didn't request this, please ignore this email
            and your password will remain unchanged.
          </p>

          <hr style="margin:20px 0;">

          <p style="color:#888;font-size:12px;">
            For security, never share this link with anyone.
          </p>
        </div>
      `,
    };

    try {
      const data = await this.sendEmail(mailOption);

      console.log("Password reset email sent:", data);

      return {
        success: true,
        message: "Password reset email sent successfully",
        data,
      };
    } catch (error) {
      console.error("Password reset email error:", error);

      return {
        success: false,
        message: error.message || "Failed to send reset email",
      };
    }
  }

  createOrderItemsRows(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      return `
        <tr>
          <td
            colspan="6"
            style="padding:20px;text-align:center;color:#888;"
          >
            No items found
          </td>
        </tr>
      `;
    }

    return items
      .map((item) => {
        const price = toNumber(item.price);

        const discountPrice =
          item.discount_price !== null &&
          item.discount_price !== undefined &&
          item.discount_price !== ""
            ? toNumber(item.discount_price, price)
            : price;

        const quantity = Math.max(1, toNumber(item.quantity, 1));

        const total = discountPrice * quantity;

        return `
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;text-align:left;">
              ${item.name || "-"}
            </td>

            <td style="padding:10px;text-align:center;">
              ${quantity}
            </td>

            <td style="padding:10px;text-align:center;">
              ${item.size || "-"}
            </td>

            <td style="padding:10px;text-align:right;text-decoration:line-through;">
              ${price.toFixed(2)} AED
            </td>

            <td style="padding:10px;text-align:right;">
              ${discountPrice.toFixed(2)} AED
            </td>

            <td style="padding:10px;text-align:right;">
              ${total.toFixed(2)} AED
            </td>
          </tr>
        `;
      })
      .join("");
  }

  async sendOrderConfirmationEmail(orderDetails = {}) {
    const {
      customerEmail,
      customerName,
      orderId,
      orderDate,
      items = [],
      totalAmount,
      paymentMethod,
    } = orderDetails;

    const shippingAddress = orderDetails.shippingAddress || {};

    const itemsList = this.createOrderItemsRows(items);

    const finalTotalAmount = toNumber(totalAmount).toFixed(2);

    const mailOption = {
      to: customerEmail,
      subject: `${this.brandName} — Order #${orderId} confirmed`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#eee8df;padding:24px;color:#1a1614;">
          <div style="text-align:center;margin-bottom:30px;">
            <p style="color:#b59263;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
              Order confirmation
            </p>

            <h1 style="font-family:Georgia,serif;color:#1a1614;margin:0;font-size:38px;font-weight:400;">
              ${this.brandName}
            </h1>

            <p style="color:#625b56;">
              Thank you for choosing our collection.
            </p>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h2 style="font-family:Georgia,serif;color:#5a2135;margin-top:0;font-weight:400;">
              Order confirmed ✓
            </h2>

            <p>
              Dear
              <strong>${customerName || "Customer"}</strong>,
            </p>

            <p>
              Your order has been successfully placed
              and is being processed.
            </p>

            <div style="background:#f0f0f0;padding:15px;border-radius:5px;margin:15px 0;">
              <p style="margin:5px 0;">
                <strong>Order Number:</strong>
                #${orderId || "-"}
              </p>

              <p style="margin:5px 0;">
                <strong>Order Date:</strong>
                ${orderDate || "-"}
              </p>

              <p style="margin:5px 0;">
                <strong>Payment Method:</strong>
                ${paymentMethod || "-"}
              </p>
            </div>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;overflow-x:auto;">
            <h3 style="margin-top:0;">
              Order Summary
            </h3>

            <table style="width:100%;border-collapse:collapse;min-width:650px;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:10px;background:#f5f5f5;">
                    Product
                  </th>

                  <th style="text-align:center;padding:10px;background:#f5f5f5;">
                    Qty
                  </th>

                  <th style="text-align:center;padding:10px;background:#f5f5f5;">
                    Size
                  </th>

                  <th style="text-align:right;padding:10px;background:#f5f5f5;">
                    Original Price
                  </th>

                  <th style="text-align:right;padding:10px;background:#f5f5f5;">
                    Price
                  </th>

                  <th style="text-align:right;padding:10px;background:#f5f5f5;">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                ${itemsList}
              </tbody>

              <tfoot>
                <tr style="border-top:2px solid #ddd;">
                  <td
                    colspan="5"
                    style="padding:10px;text-align:right;font-weight:bold;"
                  >
                    Total:
                  </td>

                  <td style="padding:10px;text-align:right;font-weight:bold;color:#4CAF50;">
                    ${finalTotalAmount} AED
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="margin-top:0;">
              Shipping Address
            </h3>

            <p style="margin:5px 0;">
              ${shippingAddress.full_name || "-"}
            </p>

            <p style="margin:5px 0;">
              ${shippingAddress.phone || "-"}
            </p>

            <p style="margin:5px 0;">
              ${shippingAddress.address || "-"}
            </p>

            <p style="margin:5px 0;">
              ${shippingAddress.city || "-"},
              ${shippingAddress.province || "-"}
            </p>

            <p style="margin:5px 0;">
              Postal Code:
              ${shippingAddress.postal_code || "-"}
            </p>
          </div>

          <div style="background:#3a1422;color:white;padding:15px;text-align:center;">
            <p style="margin:0;">
              We'll notify you once your order ships!
            </p>
          </div>

          <hr style="margin:20px 0;">

          <p style="color:#888;font-size:12px;text-align:center;">
            Need help? Reply to this email and our
            client-care team will assist you.
            <br>
            © ${new Date().getFullYear()}
            ${this.brandName}. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      const data = await this.sendEmail(mailOption);

      console.log("Order confirmation email sent:", data);

      return {
        success: true,
        message: "Order confirmation email sent to customer",
        data,
      };
    } catch (error) {
      console.error("Order confirmation email error:", error);

      return {
        success: false,
        message: error.message || "Failed to send order confirmation",
      };
    }
  }

  async sendNewOrderNotificationToWorker(orderDetails = {}) {
    const {
      customerName,
      customerEmail,
      orderId,
      orderDate,
      items = [],
      totalAmount,
      paymentMethod,
    } = orderDetails;

    const shippingAddress = orderDetails.shippingAddress || {};

    const itemsList = this.createOrderItemsRows(items);

    const finalTotalAmount = toNumber(totalAmount).toFixed(2);

    const adminEmail = (process.env.ADMIN_EMAIL || this.senderEmail).trim();

    const mailOption = {
      to: adminEmail,
      subject: `${this.brandName} admin — New order #${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;background:#eee8df;padding:24px;color:#1a1614;">
          <div style="text-align:center;margin-bottom:30px;background:#3a1422;padding:24px;">
            <p style="margin:0 0 8px;color:#dbc49e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
              ${this.brandName} administration
            </p>

            <h1 style="color:white;margin:0;font-family:Georgia,serif;font-weight:400;">
              New order received
            </h1>

            <p style="color:white;margin:5px 0 0;">
              Action Required - Process This Order
            </p>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h2 style="color:#5a2135;margin-top:0;font-family:Georgia,serif;font-weight:400;">
              Customer information
            </h2>

            <p>
              <strong>Customer Name:</strong>
              ${customerName || "-"}
            </p>

            <p>
              <strong>Customer Email:</strong>
              ${customerEmail || "-"}
            </p>

            <p>
              <strong>Order Number:</strong>
              #${orderId || "-"}
            </p>

            <p>
              <strong>Order Date:</strong>
              ${orderDate || "-"}
            </p>

            <p>
              <strong>Payment Method:</strong>
              ${paymentMethod || "-"}
            </p>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;overflow-x:auto;">
            <h3 style="margin-top:0;">
              Order Items
            </h3>

            <table style="width:100%;border-collapse:collapse;min-width:650px;">
              <thead>
                <tr style="background:#5a2135;color:white;">
                  <th style="text-align:left;padding:10px;">
                    Product
                  </th>

                  <th style="text-align:center;padding:10px;">
                    Qty
                  </th>

                  <th style="text-align:center;padding:10px;">
                    Size
                  </th>

                  <th style="text-align:right;padding:10px;">
                    Original Price
                  </th>

                  <th style="text-align:right;padding:10px;">
                    Price
                  </th>

                  <th style="text-align:right;padding:10px;">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                ${itemsList}
              </tbody>

              <tfoot>
                <tr style="border-top:2px solid #ddd;">
                  <td
                    colspan="5"
                    style="padding:10px;text-align:right;font-weight:bold;"
                  >
                    Total Amount:
                  </td>

                  <td style="padding:10px;text-align:right;font-weight:bold;color:#ff9800;font-size:18px;">
                    ${finalTotalAmount} AED
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="margin-top:0;">
              Shipping Address
            </h3>

            <p style="margin:5px 0;">
              <strong>Recipient:</strong>
              ${shippingAddress.full_name || "-"}
            </p>

            <p style="margin:5px 0;">
              <strong>Phone:</strong>
              ${shippingAddress.phone || "-"}
            </p>

            <p style="margin:5px 0;">
              <strong>Address:</strong>
              ${shippingAddress.address || "-"}
            </p>

            <p style="margin:5px 0;">
              <strong>City:</strong>
              ${shippingAddress.city || "-"},
              ${shippingAddress.province || "-"}
            </p>

            <p style="margin:5px 0;">
              <strong>Postal Code:</strong>
              ${shippingAddress.postal_code || "-"}
            </p>
          </div>

          <div style="background:#ffebcc;padding:15px;border-radius:8px;text-align:center;">
            <p style="margin:0;">
              <strong>⚠️ Action Required:</strong>
              Please process this order and prepare
              for shipment.
            </p>

            <p style="margin:5px 0 0;">
              Order requires attention within 24 hours.
            </p>
          </div>

          <hr style="margin:20px 0;">

          <p style="color:#888;font-size:12px;text-align:center;">
            This is an automated notification from
            ${this.brandName}.
            <br>
            Please process this order as soon as possible.
          </p>
        </div>
      `,
    };

    try {
      const data = await this.sendEmail(mailOption);

      console.log("Order notification sent to admin:", data);

      return {
        success: true,
        message: "Order notification sent to admin",
        data,
      };
    } catch (error) {
      console.error("Admin notification email error:", error);

      return {
        success: false,
        message: error.message || "Failed to send admin notification",
      };
    }
  }

  async sendOrderNotifications(orderDetails = {}) {
    try {
      const [customerResult, workerResult] = await Promise.all([
        this.sendOrderConfirmationEmail(orderDetails),
        this.sendNewOrderNotificationToWorker(orderDetails),
      ]);

      return {
        success: customerResult.success && workerResult.success,
        customer: customerResult,
        worker: workerResult,
      };
    } catch (error) {
      console.error("Order notifications error:", error);

      return {
        success: false,
        error: error.message || "Failed to send order notifications",
      };
    }
  }
}

module.exports = new EmailService();

// services/email.service.js
const { Resend } = require("resend");

class EmailService {
  constructor() {
    this.brandName = process.env.BRAND_NAME || "EbRahaStyle";
    this.senderEmail = process.env.RESEND_FROM_EMAIL;
    this.sender = `${this.brandName} <${this.senderEmail}>`;
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(mailOption) {
    const { data, error } = await this.resend.emails.send(mailOption);

    if (error) {
      throw error;
    }

    return data;
  }

  async sendVerificationCode(email, code) {
    const mailOption = {
      from: this.sender,
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
      await this.sendEmail(mailOption);

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("Email sending error:", error);

      return {
        success: false,
        message: "Failed to send email",
      };
    }
  }

  async sendPasswordResetEmail(email, resetLink, userName = "") {
    const mailOption = {
      from: this.sender,
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

          <p>Or copy and paste this link into your browser:</p>

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

          <hr style="margin:20px 0;" />

          <p style="color:#888;font-size:12px;">
            For security, never share this link with anyone.
          </p>
        </div>
      `,
    };

    try {
      await this.sendEmail(mailOption);

      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error) {
      console.error("Password reset email error:", error);

      return {
        success: false,
        message: "Failed to send reset email",
      };
    }
  }

  // ارسال ایمیل تأیید سفارش به مشتری
  async sendOrderConfirmationEmail(orderDetails) {
    const {
      customerEmail,
      customerName,
      orderId,
      orderDate,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = orderDetails;

    const itemsList = items
      .map(
        (item) => `
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;text-align:left;">
              ${item.name}
            </td>

            <td style="padding:10px;text-align:center;">
              ${item.quantity}
            </td>

            <td style="padding:10px;text-align:center;">
              ${item.size || "-"}
            </td>

            <td style="padding:10px;text-align:right;text-decoration:line-through;">
              $${item.price.toFixed(2)}
            </td>

            <td style="padding:10px;text-align:right;">
              $${item.discount_price.toFixed(2)}
            </td>

            <td style="padding:10px;text-align:right;">
              $${(item.discount_price * item.quantity).toFixed(2)}
            </td>
          </tr>
        `,
      )
      .join("");

    const mailOption = {
      from: this.sender,
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
              Thank you for choosing our edit.
            </p>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h2 style="font-family:Georgia,serif;color:#5a2135;margin-top:0;font-weight:400;">
              Order confirmed ✓
            </h2>

            <p>
              Dear <strong>${customerName}</strong>,
            </p>

            <p>
              Your order has been successfully placed and is being processed.
            </p>

            <div style="background:#f0f0f0;padding:15px;border-radius:5px;margin:15px 0;">
              <p style="margin:5px 0;">
                <strong>Order Number:</strong> #${orderId}
              </p>

              <p style="margin:5px 0;">
                <strong>Order Date:</strong> ${orderDate}
              </p>

              <p style="margin:5px 0;">
                <strong>Payment Method:</strong> ${paymentMethod}
              </p>
            </div>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="margin-top:0;">
              Order Summary
            </h3>

            <table style="width:100%;border-collapse:collapse;">
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
                    Price Without Discount
                  </th>

                  <th style="text-align:right;padding:10px;background:#f5f5f5;">
                    Price With Discount
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
                    $${totalAmount.toFixed(2)}
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
              ${shippingAddress.full_name}
            </p>

            <p style="margin:5px 0;">
              ${shippingAddress.phone}
            </p>

            <p style="margin:5px 0;">
              ${shippingAddress.address}
            </p>

            <p style="margin:5px 0;">
              ${shippingAddress.city}, ${shippingAddress.province}
            </p>

            <p style="margin:5px 0;">
              Postal Code: ${shippingAddress.postal_code}
            </p>
          </div>

          <div style="background:#3a1422;color:white;padding:15px;text-align:center;">
            <p style="margin:0;">
              We'll notify you once your order ships!
            </p>
          </div>

          <hr style="margin:20px 0;" />

          <p style="color:#888;font-size:12px;text-align:center;">
            Need help? Reply to this email and our client-care team will assist you.
            <br>
            © ${new Date().getFullYear()} ${this.brandName}. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.sendEmail(mailOption);

      return {
        success: true,
        message: "Order confirmation email sent to customer",
      };
    } catch (error) {
      console.error("Order confirmation email error:", error);

      return {
        success: false,
        message: "Failed to send order confirmation",
      };
    }
  }

  // ارسال ایمیل سفارش جدید به ادمین
  async sendNewOrderNotificationToWorker(orderDetails) {
    const {
      customerName,
      customerEmail,
      orderId,
      orderDate,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = orderDetails;

    const itemsList = items
      .map(
        (item) => `
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;text-align:left;">
              ${item.name}
            </td>

            <td style="padding:10px;text-align:center;">
              ${item.quantity}
            </td>

            <td style="padding:10px;text-align:center;">
              ${item.size || "-"}
            </td>

            <td style="padding:10px;text-align:right;text-decoration:line-through;">
              $${item.price.toFixed(2)}
            </td>

            <td style="padding:10px;text-align:right;">
              $${item.discount_price.toFixed(2)}
            </td>

            <td style="padding:10px;text-align:right;">
              $${(item.discount_price * item.quantity).toFixed(2)}
            </td>
          </tr>
        `,
      )
      .join("");

    const mailOption = {
      from: this.sender,
      to: process.env.ADMIN_EMAIL || this.senderEmail,
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
              <strong>Customer Name:</strong> ${customerName}
            </p>

            <p>
              <strong>Customer Email:</strong> ${customerEmail}
            </p>

            <p>
              <strong>Order Number:</strong> #${orderId}
            </p>

            <p>
              <strong>Order Date:</strong> ${orderDate}
            </p>

            <p>
              <strong>Payment Method:</strong> ${paymentMethod}
            </p>
          </div>

          <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="margin-top:0;">
              Order Items
            </h3>

            <table style="width:100%;border-collapse:collapse;">
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
                    Price Without Discount
                  </th>

                  <th style="text-align:right;padding:10px;">
                    Price With Discount
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
                    $${totalAmount.toFixed(2)}
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
              ${shippingAddress.full_name}
            </p>

            <p style="margin:5px 0;">
              <strong>Phone:</strong>
              ${shippingAddress.phone}
            </p>

            <p style="margin:5px 0;">
              <strong>Address:</strong>
              ${shippingAddress.address}
            </p>

            <p style="margin:5px 0;">
              <strong>City:</strong>
              ${shippingAddress.city}, ${shippingAddress.province}
            </p>

            <p style="margin:5px 0;">
              <strong>Postal Code:</strong>
              ${shippingAddress.postal_code}
            </p>
          </div>

          <div style="background:#ffebcc;padding:15px;border-radius:8px;text-align:center;">
            <p style="margin:0;">
              <strong>⚠️ Action Required:</strong>
              Please process this order and prepare for shipment.
            </p>

            <p style="margin:5px 0 0;">
              Order requires attention within 24 hours.
            </p>
          </div>

          <hr style="margin:20px 0;" />

          <p style="color:#888;font-size:12px;text-align:center;">
            This is an automated notification from ${this.brandName}.
            <br>
            Please process this order as soon as possible.
          </p>
        </div>
      `,
    };

    try {
      await this.sendEmail(mailOption);

      return {
        success: true,
        message: "Order notification sent to worker",
      };
    } catch (error) {
      console.error("Worker notification email error:", error);

      return {
        success: false,
        message: "Failed to send worker notification",
      };
    }
  }

  // ارسال ایمیل به مشتری و ادمین
  async sendOrderNotifications(orderDetails) {
    try {
      const customerResult =
        await this.sendOrderConfirmationEmail(orderDetails);

      const workerResult =
        await this.sendNewOrderNotificationToWorker(orderDetails);

      return {
        success: customerResult.success && workerResult.success,
        customer: customerResult,
        worker: workerResult,
      };
    } catch (error) {
      console.error("Order notifications error:", error);

      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new EmailService();

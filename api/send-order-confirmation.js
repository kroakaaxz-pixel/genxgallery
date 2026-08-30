import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildOrderEmail({ orderId, customerName, items, totalPrice, shippingAddress }) {
  const date = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #E0DCD6;font-family:Inter,sans-serif;font-size:14px;color:#3D3D3D;">
          ${item.name}
          ${item.options ? `<br/><span style="font-size:12px;color:#6B6B6B;">${item.options}</span>` : ''}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #E0DCD6;font-family:Inter,sans-serif;font-size:14px;color:#3D3D3D;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #E0DCD6;font-family:Inter,sans-serif;font-size:14px;color:#1A1A1A;text-align:right;font-weight:600;">
          ₹${item.price.toLocaleString('en-IN')}
        </td>
      </tr>`
    )
    .join('');

  const addressBlock = shippingAddress
    ? `
    <tr>
      <td style="padding:0 0 24px 0;">
        <p style="margin:0 0 4px 0;font-family:Inter,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B;">
          Delivery Address
        </p>
        <p style="margin:0;font-family:Inter,sans-serif;font-size:14px;color:#3D3D3D;line-height:1.6;">
          ${shippingAddress}
        </p>
      </td>
    </tr>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;color:#1A1A1A;letter-spacing:-0.5px;">
                Gen X <span style="color:#C23B22;">Gallery</span>
              </p>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:#FFFFFF;border:1px solid #E0DCD6;padding:40px;">
              <!-- Title -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 8px 0;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#B0341F;">
                      Order Confirmed
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 24px 0;">
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:600;color:#1A1A1A;letter-spacing:-0.5px;">
                      Thank you, ${customerName || 'there'}.
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 32px 0;">
                    <p style="margin:0;font-size:15px;color:#3D3D3D;line-height:1.7;">
                      Your order has been placed and is being prepared. We'll send you a shipping
                      notification once it's on its way.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Info -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#FAF8F5;border-radius:2px;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B;">
                      Order ID
                    </p>
                    <p style="margin:4px 0 0 0;font-size:14px;font-weight:600;color:#1A1A1A;font-family:monospace;">
                      ${orderId}
                    </p>
                  </td>
                  <td style="width:16px;"></td>
                  <td style="padding:12px 16px;background-color:#FAF8F5;border-radius:2px;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B;">
                      Date
                    </p>
                    <p style="margin:4px 0 0 0;font-size:14px;font-weight:600;color:#1A1A1A;">
                      ${date}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Items Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:0 0 12px 0;border-bottom:2px solid #1A1A1A;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6B6B6B;">
                      Items
                    </p>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <td style="padding:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B;">
                      Product
                    </td>
                    <td style="padding:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B;text-align:center;">
                      Qty
                    </td>
                    <td style="padding:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B;text-align:right;">
                      Price
                    </td>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Total -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="padding:16px 0 0 0;border-top:2px solid #1A1A1A;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;color:#6B6B6B;">
                          Shipping
                        </td>
                        <td style="font-size:14px;color:#6B6B6B;text-align:right;">
                          Free
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0 0;font-size:16px;font-weight:700;color:#1A1A1A;">
                          Total
                        </td>
                        <td style="padding:12px 0 0 0;font-size:20px;font-weight:700;color:#C23B22;text-align:right;">
                          ₹${totalPrice.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${addressBlock}
            </td>
          </tr>

          <!-- Footer Note -->
          <tr>
            <td style="padding:32px 0 0 0;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:#6B6B6B;">
                "Premium framed prints for people who care about what's on their walls."
              </p>
              <p style="margin:0;font-size:12px;color:#B8B2A8;">
                © 2026 Gen X Gallery · genxgallery.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, items, totalPrice, orderId, shippingAddress } = req.body;

  if (!email || !items || !totalPrice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set — skipping order confirmation email');
    return res.status(200).json({ sent: false, reason: 'API key not configured' });
  }

  try {
    const html = buildOrderEmail({
      orderId: orderId || `GXG-${Date.now().toString(36).toUpperCase()}`,
      customerName: name,
      items: items.map((item) => ({
        name: item.product?.name || item.name,
        options: [
          item.options?.sizeLabel,
          item.options?.materialName,
          item.options?.textureName,
        ]
          .filter(Boolean)
          .join(' · '),
        quantity: item.quantity,
        price: (item.options?.sizePrice || item.product?.price || 0) * item.quantity,
      })),
      totalPrice,
      shippingAddress,
    });

    await resend.emails.send({
      from: 'Gen X Gallery <orders@genxgallery.com>',
      to: email,
      subject: `Order Confirmed — ${orderId || 'Gen X Gallery'}`,
      html,
    });

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return res.status(200).json({ sent: false, reason: 'Email send failed' });
  }
}

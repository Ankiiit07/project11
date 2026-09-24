// Email templates for order emails (Cafe at Once).
// Kept separate from the function so a "Shipped" email can reuse the layout later.

const BRAND = {
  name: 'Cafe at Once',
  brown: '#8B4513',
  cream: '#FAF6F0',
  supportEmail: 'support@cafeatonce.com',
  supportPhone: '+91 7979837079',
};

export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const inr = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

function layout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:Segoe UI,Arial,sans-serif;color:#333;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="background:${BRAND.brown};color:#fff;padding:28px 24px;text-align:center;">
  <div style="font-size:22px;font-weight:700;">${BRAND.name}</div>
  <div style="font-size:14px;opacity:.9;margin-top:4px;">Real coffee in 5 seconds</div>
</td></tr>
<tr><td style="padding:28px 24px;">${bodyHtml}</td></tr>
<tr><td style="background:#2b2b2b;color:#ddd;padding:18px 24px;text-align:center;font-size:13px;line-height:1.6;">
  Questions? Reply to this email or write to
  <a href="mailto:${BRAND.supportEmail}" style="color:#ffb347;">${BRAND.supportEmail}</a>
  · ${BRAND.supportPhone}<br>© ${new Date().getFullYear()} ${BRAND.name}
</td></tr>
</table></td></tr></table></body></html>`;
}

/**
 * order = {
 *   orderId, orderDate, paymentId, paymentMethod,
 *   customer: { firstName, lastName, email, phone, address, city, state, zipCode },
 *   items: [{ name, quantity, price, type }],
 *   subtotal, discount, shipping, tax, total,
 *   awbCode, courierName, estimatedDelivery, trackingUrl, orderUrl
 * }
 */
export function renderCustomerEmail(order) {
  const c = order.customer;
  const rows = order.items
    .map(
      (i) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #eee;">
    <div style="font-weight:600;">${escapeHtml(i.name)}${i.type === 'subscription' ? ' <span style="font-size:12px;color:#8B4513;">(subscription)</span>' : ''}</div>
    <div style="font-size:13px;color:#777;">Qty ${Number(i.quantity)} × ${inr(i.price)}</div>
  </td>
  <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;white-space:nowrap;">${inr(i.price * i.quantity)}</td>
</tr>`
    )
    .join('');

  const line = (label, value, bold = false) =>
    `<tr><td style="padding:4px 0;${bold ? 'font-weight:700;font-size:17px;' : 'color:#555;'}">${label}</td>
     <td style="padding:4px 0;text-align:right;${bold ? 'font-weight:700;font-size:17px;color:' + BRAND.brown + ';' : ''}">${value}</td></tr>`;

  const shippingBlock = order.awbCode
    ? `<p style="margin:0 0 6px;"><strong>Courier:</strong> ${escapeHtml(order.courierName || 'Assigned')}</p>
       <p style="margin:0 0 6px;"><strong>AWB:</strong> ${escapeHtml(order.awbCode)}</p>
       ${order.trackingUrl ? `<p style="margin:0;"><a href="${escapeHtml(order.trackingUrl)}" style="color:${BRAND.brown};">Track your shipment →</a></p>` : ''}`
    : `<p style="margin:0;">We'll email you the tracking link once your order ships.</p>`;

  const html = layout(
    `Order confirmed #${order.orderId}`,
    `<h2 style="margin:0 0 8px;font-size:20px;">Hi ${escapeHtml(c.firstName)}, your order is confirmed ☕</h2>
<p style="margin:0 0 20px;color:#555;line-height:1.6;">Thanks for ordering from ${BRAND.name}. We're packing your coffee and will ship it soon.</p>

<table role="presentation" width="100%" style="background:${BRAND.cream};border-radius:8px;padding:14px 16px;margin-bottom:20px;font-size:14px;">
  <tr><td><strong>Order</strong> #${escapeHtml(order.orderId)}</td><td style="text-align:right;">${formatDate(order.orderDate)}</td></tr>
  <tr><td colspan="2" style="padding-top:6px;color:#555;">Paid online via Razorpay · Payment ID ${escapeHtml(order.paymentId)}</td></tr>
</table>

<table role="presentation" width="100%" style="font-size:15px;">${rows}</table>

<table role="presentation" width="100%" style="font-size:15px;margin-top:12px;">
  ${line('Subtotal', inr(order.subtotal))}
  ${order.discount ? line('Discount', '− ' + inr(order.discount)) : ''}
  ${line('Shipping', order.shipping ? inr(order.shipping) : 'Free')}
  ${order.tax ? line('Tax', inr(order.tax)) : ''}
  ${line('Total paid', inr(order.total), true)}
</table>

<h3 style="margin:24px 0 8px;font-size:16px;color:${BRAND.brown};">Shipping to</h3>
<div style="border-left:4px solid ${BRAND.brown};background:${BRAND.cream};padding:12px 14px;border-radius:6px;font-size:14px;line-height:1.6;">
  ${escapeHtml(`${c.firstName} ${c.lastName}`)}<br>${escapeHtml(c.address)}<br>
  ${escapeHtml(`${c.city}, ${c.state} ${c.zipCode}`)}<br>${escapeHtml(c.phone)}
</div>

<h3 style="margin:24px 0 8px;font-size:16px;color:${BRAND.brown};">Delivery</h3>
<div style="font-size:14px;line-height:1.6;">
  ${order.estimatedDelivery ? `<p style="margin:0 0 6px;"><strong>Estimated:</strong> ${escapeHtml(order.estimatedDelivery)}</p>` : ''}
  ${shippingBlock}
</div>

<div style="text-align:center;margin:28px 0 4px;">
  <a href="${escapeHtml(order.orderUrl)}" style="background:${BRAND.brown};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;display:inline-block;">View your order</a>
</div>`
  );

  const text = [
    `Hi ${c.firstName}, your Cafe at Once order is confirmed.`,
    ``,
    `Order #${order.orderId} · ${formatDate(order.orderDate)}`,
    `Payment ID: ${order.paymentId}`,
    ``,
    ...order.items.map((i) => `- ${i.name} x${i.quantity}: ${inr(i.price * i.quantity)}`),
    ``,
    `Subtotal: ${inr(order.subtotal)}`,
    ...(order.discount ? [`Discount: -${inr(order.discount)}`] : []),
    `Shipping: ${order.shipping ? inr(order.shipping) : 'Free'}`,
    ...(order.tax ? [`Tax: ${inr(order.tax)}`] : []),
    `Total paid: ${inr(order.total)}`,
    ``,
    `Shipping to: ${c.firstName} ${c.lastName}, ${c.address}, ${c.city}, ${c.state} ${c.zipCode}`,
    order.awbCode
      ? `Courier: ${order.courierName || 'Assigned'} · AWB ${order.awbCode}${order.trackingUrl ? ` · ${order.trackingUrl}` : ''}`
      : `We'll email you the tracking link once your order ships.`,
    ``,
    `View your order: ${order.orderUrl}`,
    `Questions? ${BRAND.supportEmail} · ${BRAND.supportPhone}`,
  ].join('\n');

  return {
    subject: `Order confirmed ☕ #${order.orderId} – Cafe at Once`,
    html,
    text,
  };
}

export function renderAdminEmail(order, warnings = []) {
  const c = order.customer;
  const items = order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ');
  const warn = warnings.length
    ? `<p style="background:#fff3cd;padding:10px;border-radius:6px;"><strong>Check:</strong> ${warnings.map(escapeHtml).join('<br>')}</p>`
    : '';
  const html = layout(
    `New order #${order.orderId}`,
    `<h2 style="margin:0 0 12px;">New order · ${inr(order.total)}</h2>${warn}
<p style="line-height:1.7;font-size:14px;margin:0;">
<strong>Order:</strong> #${escapeHtml(order.orderId)}<br>
<strong>Payment ID:</strong> ${escapeHtml(order.paymentId)}<br>
<strong>Customer:</strong> ${escapeHtml(`${c.firstName} ${c.lastName}`)} · ${escapeHtml(c.email)} · ${escapeHtml(c.phone)}<br>
<strong>Items:</strong> ${escapeHtml(items)}<br>
<strong>Ship to:</strong> ${escapeHtml(`${c.address}, ${c.city}, ${c.state} ${c.zipCode}`)}<br>
<strong>AWB:</strong> ${escapeHtml(order.awbCode || 'Not created yet — check Shiprocket')}
</p>`
  );
  const text = `New order #${order.orderId} · ${inr(order.total)}
${warnings.length ? 'CHECK: ' + warnings.join(' | ') + '\n' : ''}Payment ID: ${order.paymentId}
Customer: ${c.firstName} ${c.lastName} · ${c.email} · ${c.phone}
Items: ${items}
Ship to: ${c.address}, ${c.city}, ${c.state} ${c.zipCode}
AWB: ${order.awbCode || 'Not created yet'}`;
  return { subject: `🛒 New order #${order.orderId} – ${inr(order.total)}`, html, text };
}

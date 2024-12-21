export const deliveryEmailTemplate = ({
    orderId,
    deliveryDate,
    products,
    totalAmount,
  }: {
    orderId: string;
    deliveryDate: string;
    products: { name: string; qty: number; price: number }[];
    totalAmount: number;
  }) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delivery Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; }
    .order-info { margin-bottom: 20px; }
    .order-info p { margin: 5px 0; }
    .order-items { width: 100%; border-collapse: collapse; }
    .order-items th, .order-items td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    .order-total { font-weight: bold; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Your Order Has Been Delivered!</h2>
        <p>Order ID: ${orderId}</p>
        <p>Delivery Date: ${deliveryDate}</p>
      </div>
      <div class="order-info">
        <p>Hi there,</p>
        <p>Your order has been successfully delivered. Here’s a summary of your purchase:</p>
      </div>
      <table class="order-items">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product) => `
            <tr>
              <td>${product.name}</td>
              <td>${product.qty}</td>
              <td>RWF ${product.price.toFixed(2)}</td>
            </tr>`
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="order-total">Total:</td>
            <td class="order-total">RWF ${totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@kadosh.com">support@kadosh.com</a>.</p>
    </div>
  </body>
  </html>
  `;
  
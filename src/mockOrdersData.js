// src/mockOrdersData.js
const generateMockOrders = (customerId) => {
  const paymentMethods = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash on Delivery", "Wallet"];
  const statuses = ["Delivered", "Shipped", "Processing", "Cancelled", "Returned"];
  const offerTypes = ["New Year Sale", "Weekend Special", "Member Discount", "Flash Sale", "Festival Offer", "No Discount"];

  const orders = [];
  const baseId = customerId * 1000;

  for (let i = 1; i <= 6; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const randomOffer = Math.random() > 0.3 ? offerTypes[Math.floor(Math.random() * offerTypes.length)] : "No Discount";
    const discount = randomOffer !== "No Discount" ? parseFloat((Math.random() * 50 + 5).toFixed(2)) : 0;
    const total = parseFloat((Math.random() * 400 + 50).toFixed(2));
    const finalTotal = discount > 0 ? parseFloat((total - discount).toFixed(2)) : total;

    orders.push({
      id: baseId + i,
      order_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      total_amount: total,
      final_amount: finalTotal,
      status: randomStatus,
      payment_method: randomPayment,
      offer_type: randomOffer,
      discount_applied: discount,
      items_count: Math.floor(Math.random() * 5) + 1
    });
  }

  return orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
};

export default generateMockOrders;
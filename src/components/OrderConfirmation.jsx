import { useEffect, useState } from 'react';

export default function OrderConfirmation({ order, onContinueShopping }) {
  const [trackingStatus, setTrackingStatus] = useState('');

  useEffect(() => {
    if (!order?.id) return;
    let active = true;
    fetch(`/api/orders/track/${encodeURIComponent(order.id)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Tracking status is unavailable.');
        return result.order;
      })
      .then((trackedOrder) => {
        if (active) setTrackingStatus(`Current status: ${trackedOrder.status}`);
      })
      .catch((error) => {
        if (active) setTrackingStatus(error.message);
      });
    return () => { active = false; };
  }, [order?.id]);

  return (
    <div className="order-confirmation container">
      <section className="order-confirmation__card" aria-live="polite">
        <span className="order-confirmation__check" aria-hidden="true">✓</span>
        <p className="checkout-page__eyebrow">Thank you</p>
        <h1>Your order is confirmed</h1>
        <p>
          {order?.paymentMethod === 'cod'
            ? 'Your order is recorded and set to Cash on Delivery.'
            : 'Your order is recorded. Card payments are not processed by this demo store.'}
        </p>
        {order?.id && <p className="order-confirmation__number">Tracking number: <strong>{order.id}</strong></p>}
        {Number.isFinite(order?.total) && <p className="order-confirmation__total">Order total: <strong>${order.total.toFixed(2)}</strong></p>}
        {trackingStatus && <p className="order-confirmation__number" role="status">{trackingStatus}</p>}
        <button type="button" className="checkout-page__primary" onClick={onContinueShopping}>Continue shopping</button>
      </section>
    </div>
  );
}

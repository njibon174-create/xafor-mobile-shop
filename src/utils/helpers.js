export function generateTrackingId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, '0');
  return `XAF-${dateStr}-${random}`;
}

export function formatBDT(amount) {
  return `৳${Number(amount).toLocaleString('bn-BD')}`;
}

export function getDeliveryCharge(division, deliveryType) {
  if (deliveryType === 'pickup') return 0;
  if (division === 'Dhaka') return 80;
  return 120;
}

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Khulna',
  'Rajshahi',
  'Barishal',
  'Rangpur',
  'Mymensingh',
];

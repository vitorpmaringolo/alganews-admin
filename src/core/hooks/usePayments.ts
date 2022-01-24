import { useState, useCallback } from 'react';
import { Payment, PaymentService } from 'vitorpmaringolo-sdk';

export default function usePayments() {
  const [payments, setPayments] = useState<Payment.Paginated>();

  const fetchPayments = useCallback(async (query: Payment.Query) => {
    const payments = await PaymentService.getAllPayments(query);
    setPayments(payments);
  }, []);

  return {
    payments,
    fetchPayments,
  };
}

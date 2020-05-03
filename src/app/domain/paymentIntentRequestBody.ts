export interface paymentIntentReq {
    amount?: number,
    currency?: string,
    payment_method_types?: string[],
    receipt_email?: string
}

export interface Product {
  id: string;
  name: string;
  type?: string;
  description?: string;
  oneTimePrice?: number;
  fulfillmentSource?: string;
  category?: string;
  status?: string;
  stockStatus?: string;
  interactionWarnings?: string;
  requiresPrescription?: boolean;
  active?: boolean;
  doses?: ProductDose[];
  product_services?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDose {
  id: string;
  dose: string;
  description?: string;
  allowOneTimePurchase?: boolean;
  product_id?: string;
  stripePriceIdSubscription?: string;
}


export interface Service {
  id: string;
  name: string;
  description: string | null;
  status: 'Active' | 'Inactive';
  requires_consultation: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithRelations extends Service {
  products?: { product_id: string; name: string }[];
  plans?: { plan_id: string; name: string }[];
}

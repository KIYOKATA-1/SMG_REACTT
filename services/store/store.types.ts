export interface StoreProduct {
    id: number;
    order: number;
    created: string;
    updated: string;
    is_active: boolean;
    is_deleted: boolean;
    file_image: string[]; 
    name: string;
    description: string;
    price: number;
    is_hit: boolean;
    is_present: boolean;
  }  

  export interface Purchase {
    id: number;
    items: { item: { name: string; description: string; file_image: string } }[];
    total_coins: number;
    created: string;
    status: number;
  }
  
  export interface CartProduct extends StoreProduct {
    quantity: number;
  }
  
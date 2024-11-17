import {IInfiniteScroll, IProducts} from "../quiz/quiz.types";
import {IDiscount, IInfiniteScrollOrders, IOrder, IProductById} from "../products/products.types";


const BACKEND_URL = 'https://api.smg.kz/en/api';

export class ProductsService {
  
  static async getProducts(token: string, page: number = 0, productType: string = '', onlyVisible: boolean = true) {
    const visibilityFilter = onlyVisible ? '&is_open=true' : '';
    const response = await fetch(`${BACKEND_URL}/main/products/?limit=100&offset=${page}&product_type=${productType}${visibilityFilter}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json() as IInfiniteScroll<IProducts>;
  }

  static async getQuizzes(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/main/products/?limit=100&offset=${page}&product_type=quiz`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return await response.json() as IInfiniteScroll<IProducts>;
}

static async getCourses(token: string, page: number = 0) {
  const response = await fetch(`${BACKEND_URL}/main/products/?limit=100&offset=${page}&product_type=course`, {
    method: 'GET',
    headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
    },
});

return await response.json() as IInfiniteScroll<IProducts>;
}


static async buyProduct(token: string, product_id: number, type: number, discount_id?: number) {
  const body: Record<string, any> = { product_id, type };

  if (discount_id !== undefined) {
    body.discount_id = discount_id;
  }

  console.log("Отправляем запрос с телом:", body); // Логируем для отладки

  const response = await fetch(`${BACKEND_URL}/payment/order/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error("Ошибка при покупке продукта:", errorResponse);
    throw new Error(errorResponse.detail || "Ошибка при покупке продукта");
  }

  return await response.json();
}



  static async getOrders(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/payment/orders/?limit=100&offset=${page}&ordering=-updated`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IInfiniteScrollOrders<IOrder>
  }

  static async getPurchasedProducts(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/courses/products/?limit=100&offset=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IInfiniteScroll<IProducts>;
  }


  static async getPurchasedProductById(token: string, id: number) {
    const response = await fetch(`${BACKEND_URL}/courses/products/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IProductById
  }

  static async createProduct(token: string, contentData: {
    name: string,
    description: string,
    price: number,
    course: number[],
    file_image?: string,
    is_subscription: boolean,
    discounts: number[],
    start_date: string,
    end_date: string,
    duration: number,
    general_discount?: number | null,
    general_discount_enabled?: boolean,
    is_free: boolean;
  }) {
    const response = await fetch(`${BACKEND_URL}/main/products/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contentData),
    });
  
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while creating product');
    } else {
      return await response.json();
    }
  }


  static async getProductById(token: string, id:number) {
    const response = await fetch(`${BACKEND_URL}/main/products/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IProducts
  }
  

  

  static async changeProduct(token: string, product: IProducts) {
    const { discounts, ...productWithoutDiscounts } = product;
    const response = await fetch(`${BACKEND_URL}/main/products/${product.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productWithoutDiscounts),
    });
  
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while changing product');
    } else {
      return await response.json();
    }
  }
  static async deleteProduct(token: string, productId: number) {
    const response = await fetch(`${BACKEND_URL}/main/products/${productId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while deleting product');
    } else {
      return await response.json();
    }
  }
  static async getDiscounts(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/main/products/discounts/?limit=1000&offset=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IInfiniteScroll<IDiscount>
  }
  static async createDiscount(token: string, months:number, percent:number) {
    const response = await fetch(`${BACKEND_URL}/main/products/discounts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        months:months,
        percent:percent,
      }),
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while creating discount');
    } else {
      return await response.json();
    }
  }
  static async changeProductVisibility(token: string, product: IProducts, is_open: boolean) {
    const response = await fetch(`${BACKEND_URL}/main/products/${product.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({is_open}),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while updating course');
    } else {
      return await response.json()
    }
  }
}
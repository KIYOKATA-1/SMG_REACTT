import { CartProduct, StoreProduct } from "./store.types";


const BACKEND_URL = 'https://api.smg.kz/en/api';

export class StoreService {
  static async getStoreProducts(
    token: string,
    page: number = 0
  ): Promise<{ count: number; next: string | null; previous: string | null; results: StoreProduct[] }> {
    const response = await fetch(`${BACKEND_URL}/store/?limit=100&offset=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных продуктов");
    }
    return await response.json();
  }
  

  static async createProduct(token: string, data: {
    name: string;
    price: number;
    description: string;
    file_image: string[]; // Ожидается массив строк
  }) {
    const response = await fetch(`${BACKEND_URL}/store/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Передаем объект напрямую
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при создании товара");
    }
  
    return await response.json();
  }
  
  
  

  static async toggleHitStatus(token: string, productId: number, isHit: boolean) {
    const response = await fetch(`${BACKEND_URL}/store/${productId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_hit: isHit }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.detail || "Ошибка при обновлении статуса товара");
    }
  
    return await response.json();
  }

  static async updateProduct(token: string, productId: number, data: { name: string; price: number; description: string; file_image: string[] }) {
    const formData = new FormData();
  
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description);
  
    // Преобразуем массив строк в JSON
    formData.append("file_image", JSON.stringify(data.file_image));
  
    const response = await fetch(`${BACKEND_URL}/store/${productId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData, // Передаём FormData
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.detail || "Ошибка при обновлении товара");
    }
  
    return await response.json();
  }
  

  static async deleteProduct(token: string, productId: number) {
    const response = await fetch(`${BACKEND_URL}/store/${productId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.detail || "Ошибка при удалении товара");
    }
  
    return { success: true, message: "Товар успешно удален" };
  }
  
  static async checkout(token: string, checkoutData: any) {
    const response = await fetch(`${BACKEND_URL}/store/checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.detail || "Ошибка при оформлении заказа.");
    }

    return await response.json();
  }
  static async getPurchaseHistory(token: string) {
  const response = await fetch(`${BACKEND_URL}/store/purchases/?limit=100&offset=0`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || "Ошибка при загрузке истории покупок.");
  }

  return await response.json(); // API возвращает данные с полями `results`
}

static async updatePurchaseStatus(token: string, purchaseId: number, status: number) {
  const response = await fetch(`${BACKEND_URL}/store/purchases/${purchaseId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || "Ошибка при обновлении статуса покупки.");
  }

  return await response.json();
}
static async getCart(token: string): Promise<{ items: CartProduct[] }> {
    const response = await fetch(`${BACKEND_URL}/store/cart/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    const contentType = response.headers.get("Content-Type");
  
    // Проверяем, что сервер вернул JSON
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Некорректный формат ответа от сервера");
    }
  
    if (!response.ok) {
      const errorData = await response.text(); // Читаем текст ошибки
      throw new Error(`Ошибка сервера: ${errorData}`);
    }
  
    return await response.json();
  }
  

  static async updateCart(token: string, cartItems: CartProduct[]) {
    const response = await fetch(`${BACKEND_URL}/store/cart/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cartItems }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.detail || "Ошибка при обновлении корзины.");
    }

    return await response.json();
  }

}


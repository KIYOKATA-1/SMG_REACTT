const API_URL = 'https://api.smg.kz/en/api';

export class ProductsService {
  static async getPurchasedProducts(token: string, page: number = 0) {
    const response = await fetch(`${API_URL}/courses/products/?limit=100&offset=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }
}

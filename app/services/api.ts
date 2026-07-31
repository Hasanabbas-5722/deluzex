const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface Category {
  id: string | number;
  name: string;
  image_url?: string;
  description?: string;
}

export interface Product {
  _id: string | number;
  product_title: string;
  product_price: string;
  product_description: string;
  product_category: string;
  product_material?: string;
  product_voltage?: string;
  product_style?: string;
  product_finishing?: string;
  stock_count?: number;
  product_rating?: number;
  is_featured?: boolean;
  is_new_arrival?: boolean;
  product_main_image?: string;
  product_images?: string[];
}

// Helper to get token (safe for both client and SSR)
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const match = localStorage.getItem('authToken');
    if (match) return match;
  }
  return null;
}

// Helper to build headers
function getAuthHeaders(isFormData = false): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 } // Revalidate cache every 60s
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    
    // Support typical API response wrappers like { data: [...] } or direct arrays [...]
    return data.data || data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return empty array on failure so UI doesn't crash
  }
}

export async function fetchProducts(queryParams?: URLSearchParams | string): Promise<Product[]> {
  try {
    const queryStr = queryParams ? `?${queryParams.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/products${queryStr}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    
    return data.data || data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    const data = await res.json();
    
    return data.data || data || null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

// --- ADMIN MUTATIONS ---

export async function createProduct(productData: any) {
  const isFormData = productData instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(isFormData),
    body: isFormData ? productData : JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: string | number, productData: any) {
  const isFormData = productData instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(isFormData),
    body: isFormData ? productData : JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

export async function createCategory(categoryData: any) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function updateCategory(id: string | number, categoryData: any) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

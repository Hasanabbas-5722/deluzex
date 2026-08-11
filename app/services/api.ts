const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.deluzexlighting.com/api/v1";

type JsonObject = Record<string, unknown>;

type ApiMutationBody = JsonObject | FormData;

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

export async function createProduct(productData: ApiMutationBody) {
  const isFormData = productData instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(isFormData),
    body: isFormData ? productData : JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: string | number, productData: ApiMutationBody) {
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

export async function createCategory(categoryData: JsonObject) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function updateCategory(id: string | number, categoryData: JsonObject) {
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

export async function submitContactForm(contactData: JsonObject) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit contact form');
  }
  return res.json();
}

export interface Inquiry {
  _id: string | number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error("Failed to fetch inquiries");
    const data = await res.json();
    return data.data || data || [];
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
}

// --- PAYMENTS ---

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  razorpay_method: string;
  icon: string;
}

export interface OrderItemPayload {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddressPayload {
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  state: string;
  pin_code: string;
}

export interface OrderPayload {
  email: string;
  phone: string;
  shipping_address: ShippingAddressPayload;
  items: OrderItemPayload[];
  subtotal: number;
  gst: number;
  delivery: number;
  total: number;
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await fetch(`${API_BASE_URL}/payments/methods`);
  if (!res.ok) throw new Error("Failed to fetch payment methods");
  return res.json();
}

export async function createPaymentOrder(
  payload: OrderPayload & { payment_method: string; razorpay_method: string }
) {
  const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to create payment order");
  return data as {
    success: boolean;
    order_id: string;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    key_id: string;
  };
}

export async function verifyPayment(payload: {
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const res = await fetch(`${API_BASE_URL}/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Payment verification failed");
  return data as { success: boolean; order_id: string; message: string };
}

export async function createCodOrder(payload: OrderPayload) {
  const res = await fetch(`${API_BASE_URL}/payments/cod`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to place order");
  return data as { success: boolean; order_id: string; message: string };
}

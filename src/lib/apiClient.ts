import toast from 'react-hot-toast';

/**
 * Centralized fetch wrapper for the application.
 * Automatically handles common HTTP errors (401, 429) and displays toast notifications.
 */
export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    if (res.status === 401) {
      toast.error('غير مصرح لك بالوصول. يرجى تسجيل الدخول. / Unauthorized.', { id: 'unauthorized-error' });
    } else if (res.status === 429) {
      toast.error('تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً. / Rate limit exceeded.', { id: 'ratelimit-error' });
    } else {
      try {
        const errorData = await res.json();
        if (errorData.error) {
          toast.error(errorData.error, { id: `api-error-${res.status}` });
        } else {
          toast.error('حدث خطأ غير متوقع / Unexpected error occurred', { id: `api-error-${res.status}` });
        }
      } catch {
        toast.error(`Error: ${res.statusText}`, { id: `api-error-${res.status}` });
      }
    }
    throw new Error(`API Error: ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }
  
  return await res.text() as unknown as T;
}

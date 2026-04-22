import { createContext, useCallback, useState } from "react";
import apiClient from "../services/apiClient.js";
import { API_ENDPOINTS } from "../config/api.config.js";

export const ProductContext = createContext();

const buildProductFormData = (payload) => {
  const formData = new FormData();

  formData.append("name", payload.name || "");
  formData.append("type", payload.type || "");
  formData.append("stock", payload.stock || 0);
  formData.append("mrp", payload.mrp || 0);
  formData.append("price", payload.price || 0);
  formData.append("brand", payload.brand || "");
  formData.append("exchange", payload.exchange || "Yes");

  const files = (payload.images || []).filter((img) => img?.file instanceof File);
  files.forEach((img) => {
    formData.append("images", img.file);
  });

  return formData;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchProducts = useCallback(async (status) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const query = params.toString();
      const endpoint = query
        ? `${API_ENDPOINTS.PRODUCTS.LIST}?${query}`
        : API_ENDPOINTS.PRODUCTS.LIST;

      const response = await apiClient.get(endpoint);
      const list = response?.data || [];

      setProducts(Array.isArray(list) ? list : []);
      return { success: true, data: list };
    } catch (err) {
      const message = err.message || "Failed to fetch products";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = buildProductFormData(payload);
      const response = await apiClient.post(
        API_ENDPOINTS.PRODUCTS.CREATE,
        formData,
        { isFormData: true }
      );

      const created = response?.data;
      if (created) {
        setProducts((prev) => [created, ...prev]);
      }

      return { success: true, data: created };
    } catch (err) {
      const message = err.message || "Failed to create product";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = buildProductFormData(payload);
      const response = await apiClient.put(
        API_ENDPOINTS.PRODUCTS.UPDATE(id),
        formData,
        { isFormData: true }
      );

      const updated = response?.data;
      if (updated) {
        setProducts((prev) =>
          prev.map((item) => (item.id === id || item._id === id ? updated : item))
        );
      }

      return { success: true, data: updated };
    } catch (err) {
      const message = err.message || "Failed to update product";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
      setProducts((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      return { success: true };
    } catch (err) {
      const message = err.message || "Failed to delete product";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProductStatus = useCallback(async (id, currentStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextStatus = currentStatus === "published" ? "unpublished" : "published";
      const response = await apiClient.patch(
        API_ENDPOINTS.PRODUCTS.UPDATE_STATUS(id),
        { status: nextStatus }
      );

      const statusPayload = response?.data;
      setProducts((prev) =>
        prev.map((item) => {
          if (item.id !== id && item._id !== id) return item;
          return {
            ...item,
            status: statusPayload?.status || nextStatus,
          };
        })
      );

      return { success: true, data: statusPayload };
    } catch (err) {
      const message = err.message || "Failed to update product status";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        updateProductStatus,
        clearError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

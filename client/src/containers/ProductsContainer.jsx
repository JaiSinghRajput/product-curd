// containers/ProductsContainer.jsx
import { useState, useEffect } from "react";
import Tabs from "../components/Tabs";
import ProductGrid from "../components/ProductGrid";
import EmptyState from "../components/EmptyState";
import ProductFormModal from "../components/ProductFormModal";
import DeleteModal from "../components/DeleteModal";
import Toast from "../components/Toast";
import { useProducts } from "../hooks/useProducts";

const ProductsContainer = ({ showTabs = false }) => {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    clearError,
  } = useProducts();

  const [activeTab, setActiveTab] = useState("Published");

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    const status = showTabs
      ? activeTab === "Published"
        ? "published"
        : "unpublished"
      : undefined;

    fetchProducts(status);
  }, [activeTab, showTabs, fetchProducts]);

  const isPublished = activeTab === "Published";

  // 🔑 KEY DIFFERENCE
  const visibleProducts = showTabs
    ? products.filter(
      (p) =>
        p.status ===
        (isPublished ? "published" : "unpublished")
    )
    : products; // Products page = show all

  // CRUD
  const handleAdd = async (data) => {
    const result = await createProduct(data);
    if (result.success) {
      setShowAdd(false);
      showToast("Product added successfully");
    }
  };

  const handleEdit = async (data) => {
    if (!editItem) return;
    const id = editItem.id || editItem._id;
    const result = await updateProduct(id, data);
    if (result.success) {
      setEditItem(null);
      showToast("Product updated successfully");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const id = deleteItem.id || deleteItem._id;
    const result = await deleteProduct(id);
    if (result.success) {
      setDeleteItem(null);
      showToast("Product deleted successfully");
    }
  };

  const toggleStatus = async (product) => {
    const id = product.id || product._id;
    const result = await updateProductStatus(id, product.status);
    if (result.success) {
      showToast("Product status updated");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-lg font-semibold">Products</h1>

        {!showTabs && (
          <button
            onClick={() => setShowAdd(true)}
            className="text-blue-600"
          >
            + Add Products
          </button>
        )}
      </div>

      {/* Tabs ONLY for Home */}
      {showTabs && (
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Content */}
      {visibleProducts.length === 0 ? (
        <EmptyState
          title={showTabs ? "No Published Products" : "No Products Yet"}
          subtitle={showTabs
            ? "Your Published Products will appear here\nCreate your first product to publish"
            : "You have not created any products yet\nStart by adding your first product"}
          actionLabel={!showTabs ? "+ Add Product" : undefined}
          onAction={!showTabs ? () => setShowAdd(true) : undefined}
        />
      ) : (
        <ProductGrid
          products={visibleProducts}
          type={isPublished ? "published" : "unpublished"}
          onEdit={setEditItem}
          onDelete={setDeleteItem}
          onToggle={toggleStatus}
        />
      )}

      {isLoading && (
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2 cursor-pointer" onClick={clearError}>
          {error}
        </p>
      )}

      {/* Modals */}
      {showAdd && (
        <ProductFormModal
          type="add"
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
        />
      )}

      {editItem && (
        <ProductFormModal
          type="edit"
          initialData={editItem}
          onClose={() => setEditItem(null)}
          onSubmit={handleEdit}
        />
      )}

      {deleteItem && (
        <DeleteModal
          product={deleteItem}
          onClose={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ProductsContainer;
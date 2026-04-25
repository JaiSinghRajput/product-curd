// components/ProductCard.jsx
import ImageCarousel from "./ImageCarousel";

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const isPublished = product.status === "published";
  const images = product.images || [];

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-[320px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <ImageCarousel images={images} />

      <h3 className="font-semibold text-sm mt-3">
        {product.name}
      </h3>

      <div className="text-xs text-gray-500 space-y-1 my-3">
        <p>Product type - {product.type}</p>
        <p>Quantity Stock - {product.stock}</p>
        <p>MRP - ₹ {product.mrp}</p>
        <p>Selling Price - ₹ {product.price}</p>
        <p>Brand Name - {product.brand}</p>
        <p>Total Images - {images.length}</p>
        <p>Exchange - {product.exchange}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`flex-1 py-2 rounded-lg text-white text-sm transition-all duration-300 hover:brightness-95 active:scale-[0.98] ${
            isPublished
              ? "bg-green-500"
              : "bg-blue-600"
          }`}
        >
          {isPublished ? "Unpublish" : "Publish"}
        </button>

        <button
          onClick={onEdit}
          className="flex-1 border rounded-lg text-sm transition-all duration-300 hover:bg-gray-50 active:scale-[0.98]"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="px-3 border rounded-lg transition-all duration-300 hover:bg-red-50 active:scale-[0.98]"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
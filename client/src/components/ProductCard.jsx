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
    <div className="bg-white rounded-2xl shadow p-4 w-[320px]">
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
          className={`flex-1 py-2 rounded-lg text-white text-sm ${
            isPublished
              ? "bg-green-500"
              : "bg-blue-600"
          }`}
        >
          {isPublished ? "Unpublish" : "Publish"}
        </button>

        <button
          onClick={onEdit}
          className="flex-1 border rounded-lg text-sm"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="px-3 border rounded-lg"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
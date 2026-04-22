// components/ProductGrid.jsx
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
  type,
  onEdit,
  onDelete,
  onToggle,
}) => {
  return (
    <div className="flex flex-wrap gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id || p._id}
          product={p}
          type={type}
          onEdit={() => onEdit(p)}
          onDelete={() => onDelete(p)}
          onToggle={() => onToggle(p)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
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
    <div className="flex flex-wrap gap-6 smooth-rise-in">
      {products.map((p, index) => (
        <div
          key={p.id || p._id}
          className="smooth-rise-in"
          style={{ animationDelay: `${Math.min(index * 50, 250)}ms` }}
        >
          <ProductCard
            product={p}
            type={type}
            onEdit={() => onEdit(p)}
            onDelete={() => onDelete(p)}
            onToggle={() => onToggle(p)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
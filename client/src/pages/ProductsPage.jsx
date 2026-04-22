// pages/ProductsPage.jsx
import DashboardLayout from "../layouts/DashboardLayout";
import ProductsContainer from "../containers/ProductsContainer";

const ProductsPage = () => {
  return (
    <DashboardLayout>
      <ProductsContainer showTabs={false} />
    </DashboardLayout>
  );
};

export default ProductsPage;
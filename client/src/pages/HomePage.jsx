// pages/HomePage.jsx
import DashboardLayout from "../layouts/DashboardLayout";
import ProductsContainer from "../containers/ProductsContainer";

const HomePage = () => {
  return (
    <DashboardLayout>
      <ProductsContainer showTabs={true} />
    </DashboardLayout>
  );
};

export default HomePage;
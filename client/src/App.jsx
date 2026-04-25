import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./hooks/useAuth";

const AppRoutes = () => {
  const { isAuthenticated, otpSent } = useAuth();
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-fade-enter">
      <Routes location={location}>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <LoginPage />}
        />

        <Route
          path="/otp"
          element={
            otpSent && !isAuthenticated ? <OTPPage /> : <Navigate to="/" />
          }
        />

        <Route
          path="/products"
          element={
            isAuthenticated ? (
              <ProductsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
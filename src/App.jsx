
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { StackProvider } from "./context/StackContext";
import { PriceProvider } from "./context/PriceContext";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import AdminHistory from "./pages/AdminHistory/AdminHistory";
import AdminIdleGuard from "./components/AdminIdleGuard/AdminIdleGuard";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Category from "./pages/Category/Category";
import Product from "./pages/Product/Product";
import Stack from "./pages/Stack/Stack";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Admin from "./pages/Admin/Admin";
import HashScroll from "./components/Navbar/HashScroll";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute/ProtectedAdminRoute";

import AdminForgotPassword from "./pages/AdminForgotPassword/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminForgotPassword/AdminResetPassword";



function App() {
  return (
    <PriceProvider>
      <AvailabilityProvider>
        <StackProvider>
          <BrowserRouter>
            <HashScroll />
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/productos"
                element={<Products />}
              />

              <Route
                path="/productos/:categoria"
                element={<Category />}
              />

              <Route
                path="/producto/:slug"
                element={<Product />}
              />

              <Route
                path="/stack"
                element={<Stack />}
              />

              <Route
                path="/admin/login"
                element={<AdminLogin />}
              />

              <Route
                path="/admin/recuperar"
                element={<AdminForgotPassword />}
              />

              <Route
                path="/admin/nueva-contrasena"
                element={<AdminResetPassword />}
              />




              <Route element={<ProtectedAdminRoute />}>
                <Route element={<AdminIdleGuard />}>
                  <Route
                    path="/admin"
                    element={<Admin />}
                  />

                  <Route
                    path="/admin/historial"
                    element={<AdminHistory />}
                  />
                </Route>
              </Route>



            </Routes>
          </BrowserRouter>
        </StackProvider>
      </AvailabilityProvider>
    </PriceProvider>
  );
}

export default App;

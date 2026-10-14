import React from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Header } from "./components/Header/Header"
import { Footer } from "./components/Footer/Footer"
import { AdminRoute } from "./components/AdminRoute"
import { HomeRoute } from "./components/HomeRoute"
import { RootRedirect } from "./components/RootRedirect"
import { AuthProvider } from "./context/AuthContext"
import { Login } from "./pages/Login"
import { Calculator } from "./pages/Calculator"
import { Admin } from "./pages/Admin"
import { AdminResults } from "./pages/AdminResults"
import { AdminStyleTest } from "./pages/AdminStyleTest"
import { StyleTest } from "./pages/StyleTest"
import { StyledLayout, StyledMain } from "./App.style"

// Layout for the calculator + admin area: header (with auth nav) + footer.
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StyledLayout>
    <Header />
    <StyledMain>{children}</StyledMain>
    <Footer />
  </StyledLayout>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public: style test renders its own header/footer inside StepByStepForm */}
          <Route path="/style-test" element={<StyleTest />} />

          {/* Root redirects based on session (user/admin/none) */}
          <Route path="/" element={<RootRedirect />} />

          {/* Calculator + admin area */}
          <Route
            path="/login"
            element={
              <AppLayout>
                <Login />
              </AppLayout>
            }
          />
          <Route
            path="/calculadora"
            element={
              <AppLayout>
                <HomeRoute>
                  <Calculator />
                </HomeRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AppLayout>
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin/results"
            element={
              <AppLayout>
                <AdminRoute>
                  <AdminResults />
                </AdminRoute>
              </AppLayout>
            }
          />

          <Route
            path="/admin/style-test"
            element={
              <AppLayout>
                <AdminRoute>
                  <AdminStyleTest />
                </AdminRoute>
              </AppLayout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

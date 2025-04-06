import { describe, it, expect, vi, Mock } from "vitest";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getAuth } from "../../services/getAuth";
import { SessionProvider } from "../../context/AuthContext";
import { Login } from "./Login";

// 🔧 Mock del hook useNavigate para controlar redirecciones
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 🔧 Mock del servicio de autenticación
vi.mock("../../services/getAuth", () => ({
  getAuth: vi.fn(),
}));
const mockGetAuth = getAuth as Mock;

// 📦 Función auxiliar para renderizar el componente Login con contexto
const handleLogin = () => {
  return render(
    <SessionProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </SessionProvider>
  );
};

describe("<Login />", () => {
  it("debería mostrar un mensaje de error", async () => {
    // 🧪 Simula error de credenciales inválidas
    mockGetAuth.mockRejectedValue(new Error("Invalid credentials"));
    handleLogin();

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const buttonLogin = screen.getByRole("button", { name: "Login" });

    await act(() => {
      fireEvent.change(usernameInput, { target: { value: "wrongUser" } });
      fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });
      fireEvent.click(buttonLogin);
    });

    // ✅ Verifica que se muestra el mensaje de error
    const errorMessage = screen.getByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument();
  });

  it("debería redirigir a /orders", async () => {
    // 🧪 Simula login exitoso
    mockGetAuth.mockResolvedValue({ success: true });
    handleLogin();

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const buttonLogin = screen.getByRole("button", { name: "Login" });

    await act(() => {
      fireEvent.change(usernameInput, { target: { value: "validUser" } });
      fireEvent.change(passwordInput, { target: { value: "validPassword" } });
      fireEvent.click(buttonLogin);
    });

    // ✅ Verifica redirección y autenticación
    await waitFor(() => {
      expect(mockGetAuth).toHaveBeenCalledWith("validUser", "validPassword");
      expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
  });

  it("debería alternar la visibilidad de la contraseña al hacer clic en 'show/hide'", async () => {
    handleLogin();

    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByRole("button", { name: /show/i });

    // ✅ 1. El campo debe tener tipo "password" inicialmente
    expect(passwordInput).toHaveAttribute("type", "password");

    // ✅ 2. Clic en "show", debe cambiar a tipo "text"
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveTextContent("hide");

    // ✅ 3. Clic en "hide", debe volver a tipo "password"
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveTextContent("show");
  });
});

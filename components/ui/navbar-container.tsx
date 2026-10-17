import { getNotifications } from "@/actions/get-notifications-action";
import { Navbar } from "@/components/ui/navbar";
import { getToken } from "@/src/auth/token";
import type { Notification } from "@/src/streams/types";

// Componente servidor: lee la cookie de sesión (httpOnly) y, si hay sesión,
// carga las notificaciones del usuario. Es la única forma fiable de conocer el
// estado de sesión, ya que el navegador no puede leer una cookie httpOnly.
export async function NavbarContainer() {
  let isAuthenticated = false;

  try {
    isAuthenticated = Boolean(await getToken());
  } catch {
    isAuthenticated = false;
  }

  let notifications: Notification[] = [];
  if (isAuthenticated) {
    try {
      notifications = await getNotifications();
    } catch {
      notifications = [];
    }
  }

  return <Navbar isAuthenticated={isAuthenticated} notifications={notifications} />;
}

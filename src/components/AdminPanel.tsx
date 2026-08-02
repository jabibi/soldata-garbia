import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { setUserRole } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type Role = "usuario" | "administrador";

interface UsuarioEntry {
  id: string;
  email: string | null;
  role: Role;
}

export function AdminPanel() {
  const { t } = useTranslation();
  const { isAdmin, user } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioEntry[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "users"), orderBy("email"));
    return onSnapshot(q, (snapshot) => {
      setUsuarios(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email ?? null,
          role: (doc.data().role ?? "usuario") as Role,
        })),
      );
    });
  }, [isAdmin]);

  if (!isAdmin) return null;

  const ROLE_ITEMS: { value: Role; label: string }[] = [
    { value: "usuario", label: t("admin.roleUsuario") },
    { value: "administrador", label: t("admin.roleAdministrador") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.email")}</TableHead>
              <TableHead className="text-right">{t("admin.rol")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.email ?? usuario.id}</TableCell>
                <TableCell className="text-right">
                  <Select
                    items={ROLE_ITEMS}
                    value={usuario.role}
                    disabled={usuario.id === user?.uid}
                    onValueChange={(v) => setUserRole(usuario.id, v as Role)}
                  >
                    <SelectTrigger className="ml-auto w-full max-w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

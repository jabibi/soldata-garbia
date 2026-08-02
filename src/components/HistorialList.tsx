import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { collection, limit, onSnapshot, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { CalculoNominaResultado } from "@/lib/types";

interface HistorialEntry {
  id: string;
  createdAt: Timestamp | null;
  resultado: CalculoNominaResultado;
}

export function HistorialList() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [entradas, setEntradas] = useState<HistorialEntry[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "historial"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10),
    );

    return onSnapshot(q, (snapshot) => {
      setEntradas(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          createdAt: doc.data().createdAt ?? null,
          resultado: doc.data().resultado as CalculoNominaResultado,
        })),
      );
    });
  }, [user]);

  if (!user) return null;

  const locale = i18n.language?.startsWith("eu") ? "eu-ES" : "es-ES";
  const formatoEuro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
    useGrouping: "always",
  });
  const formatoFecha = new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("historial.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {entradas.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("historial.empty")}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("historial.fecha")}</TableHead>
                <TableHead className="text-right">{t("result.salarioBruto")}</TableHead>
                <TableHead className="text-right">{t("result.netoMensual")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entradas.map((entrada) => (
                <TableRow key={entrada.id}>
                  <TableCell>{entrada.createdAt ? formatoFecha.format(entrada.createdAt.toDate()) : "—"}</TableCell>
                  <TableCell className="text-right">
                    {formatoEuro.format(entrada.resultado.salarioBrutoAnual)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatoEuro.format(entrada.resultado.salarioNetoMensual)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

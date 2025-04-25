import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, Banner, Spinner } from "@shopify/polaris";
import { getProfesionalById } from "../../services/profesionals";
import Documents from "./Documents";
import { auditProfesional } from "../../services/profesionals";

export interface ProfesionalInfoBasica {
    id: string;
    profesionalname: string;
    email: string;
    auditado: boolean; // Asegúrate de que esta propiedad existe en tu interfaz
}

export default function InfoProfesional() {
    const { id } = useParams();
    const [infoProfesional, setInfoProfesional] = useState<ProfesionalInfoBasica | null>(null);
    const [loading, setLoading] = useState(true);
    const [auditing, setAuditing] = useState(false);
    const [auditStatus, setAuditStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    useEffect(() => {
        if (id) {
            getProfesionalById(id)
                .then((response) => {
                    setInfoProfesional(response.data);
                    setAuditStatus(null); // Resetear mensajes al cargar nuevo profesional
                })
                .catch((error) => {
                    console.error("Error al obtener profesional:", error);
                    setAuditStatus({
                        success: false,
                        message: "Error al cargar información del profesional"
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    const handleAudit = async () => {
        if (!id || !infoProfesional) return;

        setAuditing(true);
        setAuditStatus(null);

        try {
            const newAuditStatus = !infoProfesional.auditado;
            const response = await auditProfesional(id, newAuditStatus);
            console.log(response)

            // Actualizar el estado local con el nuevo estado de auditoría
            setInfoProfesional({
                ...infoProfesional,
                auditado: newAuditStatus
            });

            setAuditStatus({
                success: true,
                message: newAuditStatus
                    ? "Profesional auditado correctamente"
                    : "Auditoría del profesional removida correctamente"
            });
        } catch (error) {
            console.error("Error al auditar profesional:", error);
            setAuditStatus({
                success: false,
                message: "Error al actualizar el estado de auditoría"
            });
        } finally {
            setAuditing(false);
        }
    }

    if (loading) return (
        <Card >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Spinner accessibilityLabel="Cargando profesional" size="large" />
            </div>
        </Card>
    );

    if (!infoProfesional) return (
        <Card >
            <Banner tone="critical">
                No se encontró el profesional solicitado
            </Banner>
        </Card>
    );

    return (
        <Card>
            <h2>Información del Profesional</h2>

            {auditStatus && (
                <Banner tone={auditStatus.success ? "success" : "critical"}>
                    {auditStatus.message}
                </Banner>
            )}

            <p><strong>ID:</strong> {infoProfesional.id}</p>
            <p><strong>Nombre:</strong> {infoProfesional.profesionalname}</p>
            <p><strong>Email:</strong> {infoProfesional.email}</p>
            <p><strong>Estado de auditoría:</strong>
                {infoProfesional.auditado ? " Auditado" : " No auditado"}
            </p>

            <Documents id={id ?? ""} />

            <div style={{ marginTop: '20px' }}>
                <Button
                    onClick={handleAudit}
                    loading={auditing}
                    disabled={auditing}
                >
                    {infoProfesional.auditado ? "Remover auditoría" : "Auditar profesional"}
                </Button>
            </div>
        </Card>
    );
}
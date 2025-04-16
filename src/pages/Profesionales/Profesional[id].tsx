import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfesionalById } from "../../services/profesionals";
export interface ProfesionalInfoBasica {
    id: string;
    profesionalname: string;
    email: string;
    password: string;
}

export default function InfoProfesional() {
    const { id } = useParams();
    const [infoProfesional, setInfoProfesional] = useState<ProfesionalInfoBasica | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getProfesionalById(id)
                .then((response) => {
                    setInfoProfesional(response.data); 
                })
                .catch((error) => {
                    console.error("Error al obtener profesional:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div>Cargando información del profesional...</div>;

    if (!infoProfesional) return <div>No se encontró el profesional.</div>;

    return (
        <div>
            <h2>Información del Profesional</h2>
            <p><strong>ID:</strong> {infoProfesional.id}</p>
            <p><strong>Nombre:</strong> {infoProfesional.profesionalname}</p>
            <p><strong>Email:</strong> {infoProfesional.email}</p>
        </div>
    );
}

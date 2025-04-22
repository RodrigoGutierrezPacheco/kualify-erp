import { useEffect, useState } from "react";
import { getProfesionalDocuments, deleteProfesionalDocument, auditProfesionalDocument } from "../../services/documents";
import DocumentsModal from "../../components/Modals/DocumentsModal";
import { Badge, Button } from "@shopify/polaris";

export interface DocumentInfoProps {
    id: string;
}

type DocumentType = 'acta_nacimiento' | 'comprobante_domicilio' | 'constancia_fiscal' | 'ine_pasaporte';

interface Document {
    id: string;
    tipo: DocumentType;
    url?: string;
    auditado: boolean;
}

export default function Documents({ id }: DocumentInfoProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    console.log(documents)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentDocType, setCurrentDocType] = useState<DocumentType | null>(null);

    const requiredDocuments: DocumentType[] = [
        'acta_nacimiento',
        'comprobante_domicilio',
        'constancia_fiscal',
        'ine_pasaporte'
    ];

    const handleGetDocuments = async () => {
        try {
            setLoading(true);
            const response = await getProfesionalDocuments(id);
            setDocuments(response);
            setError(null);
        } catch (error) {
            console.error(error);
            setDocuments([])
            setError("Error al cargar los documentos");
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModal = (docType: DocumentType) => {
        setCurrentDocType(docType);
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
        setCurrentDocType(null);
    }

    const documentsArray = Array.isArray(documents) ? documents : [];
    const missingDocuments = requiredDocuments?.filter(docType =>
        !documentsArray.some(doc => doc.tipo === docType)
    ) || [];

    useEffect(() => {
        handleGetDocuments();
    }, [id]);

    if (loading) {
        return <div>Cargando documentos...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const handleDelete = async (idDocumento: string) => {
        try {
            console.log(currentDocType!)
            const response = await deleteProfesionalDocument(id, idDocumento);
            handleGetDocuments();
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAudit = async (idDocumento: string) => {
        try{
            const response = await auditProfesionalDocument(id, idDocumento);
            handleGetDocuments();
            console.log(response)
        } catch(error){
            console.log(error)
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Documentos del Profesional</h2>

            {/* Documentos existentes */}
            <div>
                <h3 className="font-semibold">Documentos subidos:</h3>
                {documents?.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {documents?.map((doc) => (
                            <li key={doc.id} className="flex items-center justify-between">
                                <span className="capitalize">
                                    {doc.tipo.replace('_', ' ')}:
                                    {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer"
                                            className="ml-2 text-blue-600 underline">
                                            Ver documento
                                        </a>
                                    ) : ' (sin archivo)'}
                                </span>
                                <Button onClick={() => {
                                    handleDelete(doc.id);
                                }}>Eliminar</Button>
                                <button
                                    onClick={() => handleOpenModal(doc.tipo)}
                                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Reemplazar
                                </button>
                                <Button onClick={()=>{
                                    handleAudit(doc.id)
                                }}>Auditar</Button>
                                <Badge tone={doc?.auditado ? 'success' : 'critical'}>{doc.auditado ? 'Aprobado' : 'Pendiente'}</Badge>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay documentos subidos aún.</p>
                )}
            </div>

            {/* Documentos faltantes */}
            {missingDocuments?.length > 0 && (
                <div>
                    <h3 className="font-semibold">Documentos requeridos faltantes:</h3>
                    <ul className="list-disc pl-5">
                        {missingDocuments?.map((docType) => (
                            <li key={docType} className="flex items-center justify-between">
                                <span className="capitalize">
                                    {docType.replace('_', ' ')}
                                </span>
                                <button
                                    onClick={() => handleOpenModal(docType)}
                                    className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Subir documento
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {isOpen && currentDocType && (
                <DocumentsModal
                    isOpen={isOpen}
                    setIsOpen={handleCloseModal}
                    documentType={currentDocType || 'documento'}
                    profesionalId={id}
                    onSuccess={handleGetDocuments}
                />
            )}
        </div>
    );
}
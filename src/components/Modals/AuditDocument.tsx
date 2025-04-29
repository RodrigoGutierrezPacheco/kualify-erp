import { Modal, TextContainer, TextField, Select } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { auditProfesionalDocument } from '../../services/documents';

export interface ModalAuditDocumentProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    profesionalId: string
    refetch: () => void
    documentId: string
}

export default function ModalAuditDocument({ isOpen, setIsOpen, profesionalId, refetch, documentId }: ModalAuditDocumentProps) {
    const [comentario, setComentario] = useState('');
    const [error, setError] = useState('');
    const [isApproved, setIsApproved] = useState<boolean>(true);
    const [statusError, setStatusError] = useState('');

    const handleComentarioChange = useCallback((value: string) => {
        setComentario(value);
        setError('');
    }, []);

    const handleStatusChange = useCallback((value: string) => {
        const newStatus = value === 'approved';
        setIsApproved(newStatus);
        setStatusError('');
    }, []);

    const handleAudit = async () => {
        let hasError = false;

        if (!comentario.trim()) {
            setError('El comentario es obligatorio');
            hasError = true;
        }

        if (hasError) return;

        try {
            await auditProfesionalDocument(profesionalId, documentId, comentario, isApproved);
            refetch();
            setIsOpen(false);
            setComentario('');
            setIsApproved(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={() => {
                setIsOpen(false);
                setComentario('');
                setError('');
                setIsApproved(true);
                setStatusError('');
            }}
            title="Auditar Documento"
            primaryAction={{
                content: 'Confirmar Auditoría',
                onAction: handleAudit,
            }}
            secondaryActions={[
                {
                    content: 'Cancelar',
                    onAction: () => {
                        setIsOpen(false);
                        setComentario('');
                        setError('');
                        setIsApproved(true);
                        setStatusError('');
                    },
                },
            ]}
        >
            <Modal.Section>
                <TextContainer>
                    <Select
                        label="Estado de auditoría"
                        options={[
                            {label: 'Aprobar', value: 'approved'},
                            {label: 'Rechazar', value: 'rejected'},
                        ]}
                        onChange={handleStatusChange}
                        value={isApproved ? 'approved' : 'rejected'}
                        error={statusError}
                    />
                    <TextField
                        autoComplete='off'
                        label="Comentario"
                        value={comentario}
                        onChange={handleComentarioChange}
                        error={error}
                        multiline
                        requiredIndicator
                    />
                </TextContainer>
            </Modal.Section>
        </Modal>
    );
}
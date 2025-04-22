import { Button, Modal, TextContainer, Thumbnail, LegacyStack, Banner } from '@shopify/polaris';
import { useState, useRef } from 'react';
import { uploadProfesionalDocument } from '../../services/documents';

export interface DocumentsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  documentType: string;
  profesionalId: string;
  onSuccess?: () => void;
}

export default function DocumentsModal({
  isOpen,
  setIsOpen,
  documentType,
  profesionalId,
  onSuccess
}: DocumentsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      // Validación básica del tipo de archivo
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Tipo de archivo no válido. Use PDF, PNG o JPG.');
        return;
      }

      // Validación de tamaño (ejemplo: máximo 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Tamaño máximo: 5MB.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    setIsLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('tipo', documentType);
      formData.append('file', file); // 'document' es el nombre del campo que espera el backend
      
      await uploadProfesionalDocument(profesionalId, formData);
  
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  
      onSuccess?.();
      setIsOpen(false);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Error al subir el documento. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='hidden'>
      <Modal
        open={isOpen}
        onClose={handleClose}
        title={`Subir ${documentType.replace('_', ' ')}`}
        primaryAction={{
          content: 'Subir documento',
          onAction: handleUpload,
          disabled: !file || isLoading,
          loading: isLoading
        }}
        secondaryActions={[
          {
            content: 'Cancelar',
            onAction: handleClose,
            disabled: isLoading
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <div style={{ padding: '20px 0' }}>
              {error && (
                <Banner tone="critical" onDismiss={() => setError(null)}>
                  <p>{error}</p>
                </Banner>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                disabled={isLoading}
              />

              <Button
                onClick={triggerFileInput}
                disabled={isLoading}
              >
                Seleccionar archivo
              </Button>

              <p style={{ marginTop: '8px', color: 'var(--p-text-subdued)' }}>
                Formatos aceptados: PDF, PNG, JPG (Máximo 5MB)
              </p>

              {file && (
                <div style={{ marginTop: '20px' }}>
                  <LegacyStack vertical>
                    {file.type.startsWith('image/') ? (
                      <Thumbnail
                        size="large"
                        alt={file.name}
                        source={window.URL.createObjectURL(file)}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '20px',
                        background: '#f6f6f7',
                        borderRadius: '8px'
                      }}>
                        <p>Documento PDF seleccionado</p>
                      </div>
                    )}
                    <p><strong>Nombre:</strong> {file.name}</p>
                    <p><strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                  </LegacyStack>
                </div>
              )}
            </div>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}
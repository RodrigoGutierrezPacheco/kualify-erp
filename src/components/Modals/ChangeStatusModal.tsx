import { Frame, Modal, TextContainer } from '@shopify/polaris';
import { changeStatus } from '../../services/users';
import { changeStatusProfesional } from '../../services/profesionals';
import { deleteAdminById } from '../../services/admins';

export interface DeleteUserProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    refetchUsers?: () => void;
    userId: string
    clearSelection: () => void
    userType: string
    status: boolean
}

export default function ChangeStatusModal({ isOpen, setIsOpen, refetchUsers, userId, clearSelection, userType, status }: DeleteUserProps) {

    const handleDelete = async () => {
        if (userType === 'Profesional') await changeStatusProfesional(userId,!status);
        if (userType === 'Usuario') await changeStatus(userId,!status);
        if (userType === 'Administrador') await deleteAdminById(userId);
        setIsOpen(false);
        refetchUsers && refetchUsers();
        clearSelection();
    }

    return (
        <div className='hidden'>
            <Frame>
                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Reach more shoppers with Instagram product tags"
                    primaryAction={{
                        content: 'Eliminar',
                        onAction: handleDelete,
                    }}
                    secondaryActions={[
                        {
                            content: 'Learn more',
                            //   onAction: handleChange,
                        },
                    ]}
                >
                    <Modal.Section>
                        <TextContainer>
                            <p>
                                Estas seguro que deseas cambniar el estado de el usuario
                            </p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
}
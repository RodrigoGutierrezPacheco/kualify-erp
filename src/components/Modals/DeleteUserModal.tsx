import { Frame, Modal, TextContainer } from '@shopify/polaris';
import { deleteUserById } from '../../services/users';
import { deleteProfesionalById } from '../../services/profesionals';

export interface DeleteUserProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    refetchUsers?: () => void;
    userId: string
    clearSelection: () => void
    userType: string
}

export default function DeleteUserModal({ isOpen, setIsOpen, refetchUsers, userId, clearSelection, userType }: DeleteUserProps) {

    const handleDelete = async () => {
        if (userType === 'Profesional') await deleteProfesionalById(userId);
        if (userType === 'Usuario') await deleteUserById(userId);
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
                                Estas seguro que deseas eliminar el usuario
                            </p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
}
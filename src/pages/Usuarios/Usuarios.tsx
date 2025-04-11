import { useEffect, useState } from "react";
import { Button, IndexTable, Text, useIndexResourceState } from "@shopify/polaris";
import { getAllUsers } from "../../services/users";
import CreateUserModal from "../../components/Modals/CreateUserModal";

export interface getAllUsersResponse {
    data: {
        id: string;
        username: string;
        email: string;
        role: string;
    }[];
}

export default function Usuarios() {
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [allUsers, setAllUsers] = useState<getAllUsersResponse["data"]>([]);

    const fetchUsers = async () => {
        const response = await getAllUsers();
        setAllUsers(response.data); // Asegúrate de acceder a response.data
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Configuración para la tabla seleccionable (opcional)
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(allUsers);

    const rowMarkup = allUsers.map((user, index) => (
        <IndexTable.Row
            id={user.id}
            key={user.id}
            position={index}
        >
            <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                    {user.id}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{user.username}</IndexTable.Cell>
            <IndexTable.Cell>{user.email}</IndexTable.Cell>
            <IndexTable.Cell>
                <Text as="span" variant="bodyMd">
                    {user.role}
                </Text>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <div className="w-full">
            <div className="flex w-full justify-between items-center mb-4">
                <span className="font-bold text-[20px]">Usuarios</span>
                <Button onClick={() => setIsOpenCreate(true)}>Crear usuario</Button>
            </div>

            <IndexTable
                resourceName={{ singular: 'usuario', plural: 'usuarios' }}
                itemCount={allUsers.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: 'ID' },
                    { title: 'Nombre de usuario' },
                    { title: 'Email' },
                    { title: 'Rol' },
                ]}
            >
                {rowMarkup}
            </IndexTable>

            {isOpenCreate && (
                <CreateUserModal
                    isOpen={isOpenCreate}
                    setIsOpen={setIsOpenCreate}
                    refetchUsers={fetchUsers}
                />
            )}
        </div>
    );
}
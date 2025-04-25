import { useEffect, useState } from "react";
import { Button, IndexTable, Text, useIndexResourceState, Banner, Box, Badge } from "@shopify/polaris";
import { getAllAdmins } from "../../services/admins";
import CreateAdminModal from "../../components/Modals/CreateAdminModal";
import DeleteUserModal from "../../components/Modals/DeleteUserModal";
import ChangeStatusModal from "../../components/Modals/ChangeStatusModal";

export interface getAllUsersResponse {
    data: {
        id: string;
        adminName: string;
        email: string;
        status: boolean;
    }[];
}

export default function Administradores() {
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOPenDelete, setIsOpenDelete] = useState(false);
    const [isOpenStatus, setIsOpenStatus] = useState(false);
    const [allUsers, setAllUsers] = useState<getAllUsersResponse["data"]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await getAllAdmins();
            setAllUsers(response.data);
        } catch (err) {
            setError("Error al cargar usuarios");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
        useIndexResourceState(allUsers);

    const bulkActions = [
        {
            content: "Ver",
            onAction: () => setIsOpenCreate(true),
        },
        {
            content: "Cambiar Stuatus ",
            onAction: () => setIsOpenStatus(true),
            destructive: true
        }
        // {
        //     content: "Eliminar seleccionados",
        //     onAction: () => setIsOpenDelete(true),
        //     destructive: true,
        // },
    ];

    const rowMarkup = allUsers?.map((user, index) => (
        <IndexTable.Row id={user.id} key={user.id} position={index} selected={selectedResources.includes(user.id)}>
            <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                    {user.id}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{user.adminName}</IndexTable.Cell>
            <IndexTable.Cell>{user.email}</IndexTable.Cell>
            <IndexTable.Cell><Badge tone={user?.status ? "success" : "critical"}>{user.status ? "Activo" : "Inactivo"}</Badge></IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <div className="w-full">
            <div className="flex w-full justify-between items-center mb-4">
                <span className="font-bold text-[20px]">Administradores</span>
                <Button onClick={() => setIsOpenCreate(true)}>Crear administrador</Button>
            </div>

            {error && (
                <Box padding="400">
                    <Banner title={error} onDismiss={() => setError("")} />
                </Box>
            )}

            {success && (
                <Box padding="400">
                    <Banner title={success} onDismiss={() => setSuccess("")} />
                </Box>
            )}

            <IndexTable
                resourceName={{ singular: 'usuario', plural: 'usuarios' }}
                itemCount={allUsers.length}
                selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: 'ID' },
                    { title: 'Nombre de usuario' },
                    { title: 'Email' },
                    { title: "Status" }
                ]}
                promotedBulkActions={bulkActions}
            >
                {rowMarkup}
            </IndexTable>

            {isOpenCreate && (
                <CreateAdminModal
                    isOpen={isOpenCreate}
                    setIsOpen={setIsOpenCreate}
                    refetchProfesionals={fetchUsers}
                    profesionalId={selectedResources[0]}
                />
            )}

            {isOPenDelete && (
                <DeleteUserModal
                    isOpen={isOPenDelete}
                    setIsOpen={setIsOpenDelete}
                    refetchUsers={fetchUsers}
                    userId={selectedResources[0]}
                    clearSelection={clearSelection}
                    userType="Administrador"
                />
            )}

            {isOpenStatus && (
                <ChangeStatusModal
                    isOpen={isOpenStatus}
                    setIsOpen={setIsOpenStatus}
                    refetchUsers={fetchUsers}
                    userId={selectedResources[0]}
                    clearSelection={clearSelection}
                    userType="Administrador"
                    status={allUsers.find((user) => user.id === selectedResources[0])?.status ? true : false}
                />
            )}

        </div>
    );
}
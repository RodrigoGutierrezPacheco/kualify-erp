import { useEffect, useState } from "react";
import { Button, IndexTable, Text, useIndexResourceState, Banner, Box } from "@shopify/polaris";
import { getAllProfesionals } from "../../services/profesionals";
import CreateProfesionalModal from "../../components/Modals/CreateProfesionalModal";
import DeleteUserModal from "../../components/Modals/DeleteUserModal";
import { useNavigate } from "react-router-dom";

export interface getAllUsersResponse {
    data: {
        id: string;
        profesionalname: string;
        email: string;
        role: string;
    }[];
}

export default function Profesionales() {
    const navigate = useNavigate();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOPenDelete, setIsOpenDelete] = useState(false);
    const [allUsers, setAllUsers] = useState<getAllUsersResponse["data"]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await getAllProfesionals();
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
            onAction: () => navigate(`/profesional/${selectedResources[0]}`),
        },
        {
            content: "Eliminar seleccionados",
            onAction: () => setIsOpenDelete(true),
            destructive: true,
        },
    ];

    const rowMarkup = allUsers?.map((user, index) => (
        <IndexTable.Row id={user.id} key={user.id} position={index} selected={selectedResources.includes(user.id)}>
            <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                    {user.id}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{user.profesionalname}</IndexTable.Cell>
            <IndexTable.Cell>{user.email}</IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <div className="w-full">
            <div className="flex w-full justify-between items-center mb-4">
                <span className="font-bold text-[20px]">Profesionales</span>
                <Button onClick={() => setIsOpenCreate(true)}>Crear profesional</Button>
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
                ]}
                promotedBulkActions={bulkActions}
            >
                {rowMarkup}
            </IndexTable>

            {isOpenCreate && (
                <CreateProfesionalModal
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
                    userType="Profesional"
                />
            )}

        </div>
    );
}
const APP_URL = import.meta.env.VITE_APP_URL;

export interface Document {
  file: File;
  tipo: string;
}
const token = localStorage.getItem("kf");
export const uploadProfesionalDocument = async (
  profesionalId: string,
  formData: FormData
) => {
  const response = await fetch(
    `${APP_URL}/profesionales/${profesionalId}/documentos`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al subir el documento");
  }

  return response.json();
};

export const getProfesionalDocuments = async (idProfesional: string) => {
  try {
    const response = await fetch(
      `${APP_URL}/profesionales/${idProfesional}/documentos`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  } catch (error) {
    return error;
  }
};

export const deleteProfesionalDocument = async (
  idProfesional: string,
  idDocumento: string
) => {
  try {
    const response = await fetch(
      `${APP_URL}/profesionales/${idProfesional}/documentos/${idDocumento}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  } catch (error) {
    return error;
  }
};

export const auditProfesionalDocument = async (idProfesional: string, idDocumento:string, comentario:string, auditado:boolean) => {
  try {
    const response = await fetch(
      `${APP_URL}/profesionales/${idProfesional}/documentos/${idDocumento}/auditar`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({comentario, auditado})
      }
    );
    return response.json();
  } catch (error) {
    return error;
  }
};

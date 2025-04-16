const APP_URL = import.meta.env.VITE_APP_URL;

export interface Document {
  file: File;
  tipo: string;
}

export const uploadProfesionalDocument = async (
  idProfesional: string,
  formData: Document
) => {
  try {
    const response = await fetch(
      `${APP_URL}/profesionales/${idProfesional}/documentos`,
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(formData),
      }
    );
    return response.json();
  } catch (error) {
    return error;
  }
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
        },
      }
    );
    return response.json();
  } catch (error) {
    return error;
  }
};

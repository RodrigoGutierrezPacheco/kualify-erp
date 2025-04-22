const APP_URL = import.meta.env.VITE_APP_URL;

export interface CreateProfesional {
  email: string;
  profesionalname: string;
  password: string;
}

export const createProfesional = async (form: CreateProfesional) => {
  try {
    const response = await fetch(`${APP_URL}/profesionals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(form),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const getAllProfesionals = async () => {
  try {
    const response = await fetch(`${APP_URL}/profesionals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const getProfesionalById = async (id: string) => {
  try {
    const response = await fetch(`${APP_URL}/profesionals/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const deleteProfesionalById = async (id: string) => {
  try {
    const response = await fetch(`${APP_URL}/profesionals/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const updateProfesionalById = async (
  id: string,
  form: CreateProfesional
) => {
  try {
    const response = await fetch(`${APP_URL}/profesionals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(form),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

// En tus tipos o interfaces
export interface ProfesionalDocument {
  tipo: string;
  nombre?: string;
  contenido?: string; // base64
  size?: number;
  mimeType?: string;
  file: string;
}

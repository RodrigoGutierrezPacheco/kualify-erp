const APP_URL = import.meta.env.VITE_APP_URL;

export interface CreateAdmin {
  email: string;
  adminName: string;
  password: string;
}

const token = localStorage.getItem("kf");

export const createAdmin = async (form: CreateAdmin) => {
  try {
    const response = await fetch(`${APP_URL}/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await fetch(`${APP_URL}/admins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const getAdminById = async (id: string) => {
  try {
    const response = await fetch(`${APP_URL}/admins/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const deleteAdminById = async (id: string) => {
  try {
    const response = await fetch(`${APP_URL}/admins/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const updateAdminById = async (id: string, form: CreateAdmin) => {
  try {
    const response = await fetch(`${APP_URL}/admins/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const changeStatusAdmin = async (id: string, status: boolean) => {
  try {
    const response = await fetch(`${APP_URL}/admins/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

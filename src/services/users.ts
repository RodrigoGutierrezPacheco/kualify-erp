const APP_URL = import.meta.env.VITE_APP_URL;

export interface CreateUserProps {
  email: string;
  username: string;
  password: string;
}

export const createUser = async (form: CreateUserProps) => {
  try {
    const response = await fetch(`${APP_URL}/users`, {
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

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${APP_URL}/users`, {
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

export const getUserById = async (id: string) => {
  try {
    const response = await fetch(`${APP_URL}/users/${id}`, {
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

export const deleteUserById = async (id: string) => {
  try {
    const response = await fetch(`${APP_URL}/users/${id}`, {
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

export const updateUserById = async (id: string, form: CreateUserProps) => {
  try {
    const response = await fetch(`${APP_URL}/users/${id}`, {
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

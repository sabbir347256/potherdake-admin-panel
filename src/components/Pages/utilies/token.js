import { useContext } from "react";
import { AuthProvider } from "../../AuthProvider/CreateContext";

export const useApiHeader = () => {
    const { token } = useContext(AuthProvider);

    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };
};
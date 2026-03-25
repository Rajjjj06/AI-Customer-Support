import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { setUser, clearUser, setAuthLoaded } from "../slices/userSlice";
import { getUser } from "@/services/auth";

export function useAuthListener() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    
                    const token = localStorage.getItem("token");
                    if (token) {
                        const user = await getUser();
                        dispatch(
                            setUser({
                                uid: user.firebaseId,
                                name: user.name,
                                email: user.email,
                            })
                        );
                    }
                } catch (error) {
                    console.log("Failed to fetch user from backend:", error);
                    dispatch(clearUser());
                    localStorage.removeItem("token");
                }
            } else {
                dispatch(clearUser());
                localStorage.removeItem("token");
            }
            dispatch(setAuthLoaded());
        });
        return () => unsubscribe();
    }, [dispatch]);
}
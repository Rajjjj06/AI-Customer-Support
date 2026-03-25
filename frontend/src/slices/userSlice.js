import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {auth, provider} from "../services/firebase"
import {  signInWithPopup, signOut } from "firebase/auth";
import { loginGoogle, getUser } from "@/services/auth";




export const login = createAsyncThunk(
    "user/login",
    async(_, thunkAPI) => {
        try{
            // 1. Sign in with Firebase popup to get the ID token
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // 2. Send the Firebase ID token to your backend to get a JWT
            await loginGoogle(idToken);

            // 3. Fetch the full user profile from your backend
            const user = await getUser();
            
            return {
                uid: user.firebaseId,
                name: user.name,
                email: user.email,
            }
            
        }
        catch (error){
            return thunkAPI.rejectWithValue(error.message || error);
        }

    }
);

export const logout = createAsyncThunk(
    "user/logout",
    async(_,thunkAPI) => {
        try {
            await signOut(auth);
            return;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
            
        }
    }
)

const userSlice = createSlice({
   name: "user",
   initialState: {
    currentUser: null,
    isPending: false,
    error: null,
    isAuthLoaded: false,
   },
   reducers:{
    setUser: (state, action) => {
        state.currentUser = action.payload;
        state.isPending = false;
        state.error = null;
    } ,
    clearUser: (state) => {
        state.currentUser = null;
        state.isPending = false;
        state.error = null;
    },
    setAuthLoaded: (state) => {
        state.isAuthLoaded = true;
    }
   },

   extraReducers: (builder) => {
    //login
    builder.addCase(
        login.pending , (state) => {
            state.isPending = true;
            state.error = null;
        }
    )
    builder.addCase(
        login.fulfilled , (state, action) => {
            state.isPending = false;
            state.error = null;
            state.currentUser = action.payload
        }
    )

    builder.addCase(
        login.rejected, (state, action) => {
            state.isPending = false;
            state.error = action.payload
        }
    )

    //logout
    builder.addCase(
        logout.fulfilled, (state) => {
            state.isPending = false;
            state.error = null;
            state.currentUser = null;
        }
    )

   }


})

export const {setUser, clearUser, setAuthLoaded} = userSlice.actions;

export default userSlice.reducer;

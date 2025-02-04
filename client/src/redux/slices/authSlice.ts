import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
}

interface AppState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}



const initialState: AppState = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user") !== "undefined" ? JSON.parse(localStorage.getItem("user")!) : null,
  isAuthenticated: localStorage.getItem("token") !== "undefined",
};

const appSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setAuth, logout } = appSlice.actions;
export default appSlice.reducer;

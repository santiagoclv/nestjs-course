import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse } from '../dto/login-response';

interface SingInState extends LoginResponse {};

export const initialState = {
  otpauth: '',
  secret: '',
  id: 0,
  challenge: '',
} as SingInState;

const singInSlice = createSlice({
  name: 'singin',
  initialState,
  reducers: {
    loginState(state, action: PayloadAction<SingInState>) {
      state = action.payload
      return state;
    }
  }
});

export const { loginState } = singInSlice.actions;
export default singInSlice.reducer;
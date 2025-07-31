import create from 'zustand';

const useLoginStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  userLoginDetails: null,
  setLoginDetails: (loginData) => set(loginData),
}));
export default useLoginStore;
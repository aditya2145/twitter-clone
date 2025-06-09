import React, { createContext, useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { loginService, logoutService, signupService } from '../../api/Services/authService';
import { getAuthUser } from '../../api/Services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: authUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  const {
    mutate: loginMutation,
    isPending: isLogging,
    error: loginError,
  } = useMutation({
    mutationFn: (formData) => loginService(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["authUser"] });
    }
  });

  const {
    mutate: signupMutation,
    error: signupError,
  } = useMutation({
    mutationFn: (formData) => signupService(formData),
    onSuccess: () => {
      navigate('/login');
    }
  })

  const login = (formData) => loginMutation(formData);

  const logout = () => logoutMutation();

  return (
    <AuthContext.Provider value={{ authUser, isLoading, login, loginError, logout, signupMutation, signupError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
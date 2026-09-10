import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axiosClient from "../api/axiosClient";
import { AuthContext } from "./auth-context";


const getDashboardPath = (role) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "COMPANY") {
    return "/company/dashboard";
  }

  return "/student/dashboard";
};



export const AuthProvider = ({ children }) => {


  const [user, setUser] = useState(() => {

    const data = localStorage.getItem(
      "skillproof_user"
    );

    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }

  });



  const [token, setToken] = useState(() =>
    localStorage.getItem(
      "skillproof_token"
    )
  );



  const [validatedToken, setValidatedToken] =
    useState(null);



  const loading =
    Boolean(
      token &&
      validatedToken !== token
    );



  const saveAuth = useCallback((data)=>{

    localStorage.setItem(
      "skillproof_token",
      data.token
    );


    localStorage.setItem(
      "skillproof_user",
      JSON.stringify(data.user)
    );


    setToken(data.token);
    setUser(data.user);


  },[]);




  const login = useCallback(async(data)=>{


    const response =
      await axiosClient.post(
        "/auth/login",
        data
      );


    saveAuth(response.data);


    return response.data.user;


  },[saveAuth]);





  const register = useCallback(async(data)=>{


    const response =
      await axiosClient.post(
        "/auth/register",
        data
      );


    saveAuth(response.data);


    return response.data.user;


  },[saveAuth]);






  const logout = useCallback(()=>{


    localStorage.removeItem(
      "skillproof_token"
    );


    localStorage.removeItem(
      "skillproof_user"
    );


    setToken(null);
    setUser(null);
    setValidatedToken(null);


  },[]);







  useEffect(()=>{


    if(!token) return;


    let active = true;



    const refreshMe = async()=>{


      try{


        const response =
          await axiosClient.get(
            "/auth/me"
          );



        if(!active) return;



        setUser(
          response.data.user
        );



        localStorage.setItem(
          "skillproof_user",
          JSON.stringify(
            response.data.user
          )
        );



        setValidatedToken(token);



      }catch{


        if(active){
          logout();
        }


      }


    };



    refreshMe();



    return ()=>{

      active=false;

    };


  },[token,logout]);







  const value = useMemo(()=>({


    user,

    token,

    loading,


    isAuthenticated:
      Boolean(token && user),


    login,

    register,

    logout,

    getDashboardPath,


  }),[

    user,
    token,
    loading,
    login,
    register,
    logout

  ]);







  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );


};
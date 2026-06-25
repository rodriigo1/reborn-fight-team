'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getPerfil, getPerfilCompleto } from '../lib/api';

const AuthContext = createContext();

const BACKEND_URL = 'http://localhost:3001';

export function AuthProvider({ children }) {
    const [utilizador, setUtilizador] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ao carregar, verificar se existe token guardado e buscar foto
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getPerfil(token)
                .then(async res => {
                    if (res.sucesso) {
                        // Buscar perfil completo para obter foto_url
                        try {
                            const perfilRes = await getPerfilCompleto();
                            if (perfilRes.sucesso && perfilRes.perfil?.foto_url) {
                                const foto = perfilRes.perfil.foto_url;
                                const fotoUrl = foto.startsWith('http')
                                    ? foto
                                    : `${BACKEND_URL}${foto}`;
                                setUtilizador({ ...res.utilizador, fotoUrl });
                            } else {
                                setUtilizador(res.utilizador);
                            }
                        } catch {
                            setUtilizador(res.utilizador);
                        }
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const fazerLogin = (token, user) => {
        localStorage.setItem('token', token);
        // Buscar foto após login
        getPerfilCompleto()
            .then(res => {
                if (res.sucesso && res.perfil?.foto_url) {
                    const foto = res.perfil.foto_url;
                    const fotoUrl = foto.startsWith('http')
                        ? foto
                        : `${BACKEND_URL}${foto}`;
                    setUtilizador({ ...user, fotoUrl });
                } else {
                    setUtilizador(user);
                }
            })
            .catch(() => setUtilizador(user));
    };

    const fazerLogout = () => {
        localStorage.removeItem('token');
        setUtilizador(null);
    };

    // Permite atualizar a foto na navbar após upload na página de perfil
    const atualizarFotoNavbar = (foto_url) => {
        if (!foto_url) return;
        const fotoUrl = foto_url.startsWith('http')
            ? foto_url
            : `${BACKEND_URL}${foto_url}`;
        setUtilizador(prev => prev ? { ...prev, fotoUrl } : prev);
    };

    return (
        <AuthContext.Provider value={{ utilizador, loading, fazerLogin, fazerLogout, atualizarFotoNavbar }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

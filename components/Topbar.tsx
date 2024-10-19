"use client"
// Necesario porque este componente usa interactividad del lado del cliente (como el estado de autenticación y eventos de usuario)

// Importaciones específicas para las funcionalidades requeridas
import { useAuth, UserButton } from "@clerk/nextjs";
// useAuth: Para verificar el estado de autenticación del usuario
// UserButton: Proporciona una interfaz de usuario pre-construida para manejar la sesión del usuario

import { Search } from "lucide-react"
// Importamos solo el icono de búsqueda para mantener el tamaño del bundle pequeño

import Image from "next/image"
// Usado en lugar de <img> porque optimiza automáticamente las imágenes, mejorando el rendimiento

import Link from "next/link"
// Preferido sobre <a> para navegación interna porque permite una navegación más rápida sin recargar la página completa

import { Button } from "./ui/button"

const Topbar = () => {
    // Usamos useAuth para adaptar la UI basándonos en si el usuario ha iniciado sesión o no
    const {isSignedIn} = useAuth()
    
    // Definimos las rutas aquí para facilitar cambios futuros y mantener el código DRY (Don't Repeat Yourself)
    const topRoutes = [
        { label: "Instructor", path: "/instructor" },
        { label: "Learning", path: "/learning" },
    ];

    return (
        // Usamos flexbox para un diseño responsive que se adapte a diferentes tamaños de pantalla
        <div className="flex justify-between items-center p-4">
            {/* El logo es clickeable y lleva a la página principal, una práctica común en diseño web */}
            <Link href="/"> 
                <Image src="/logo.png" height={100} width={200} alt="logo" />
            </Link>

            {/* La barra de búsqueda se oculta en pantallas pequeñas para mantener un diseño limpio en móviles */}
            <div className="max-md:hidden w-[400px] rounded-full flex">
                <input 
                    className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-none text-sm pl-4 py-3"
                    placeholder="Search for courses" 
                />
                {/* El botón de búsqueda usa un icono para ahorrar espacio y mejorar la estética */}
                <button className="bg-[#FDAB04] rounded-r-full border-none outline-none cursor-pointer px-4 py3 hover:bg-[#FDAB04]/80">
                    <Search className="h-4 w-4" />
                </button>
            </div>
            
            {/* Agrupamos los elementos de navegación y autenticación para organizarlos en el lado derecho */}
            <div className="flex gap-6 items-center">
                {/* Los enlaces de navegación se ocultan en móviles para ahorrar espacio */}
                <div className="max-sm:hidden flex gap-6">
                    {/* Usamos map para generar los enlaces dinámicamente, facilitando añadir o quitar rutas */}
                    {topRoutes.map((route) => (
                        <Link
                            href={route.path}
                            key={route.path}
                            className="text-sm font-medium hover:text-[#FDAB04]"
                        >
                            {route.label}
                        </Link>
                    ))}
                </div>

                {/* Cambiamos dinámicamente entre mostrar el botón de usuario o el enlace de inicio de sesión */}
                {isSignedIn ? (
                    <UserButton signInUrl="/sign-in" />
                ) : (
                    <Link href="/sign-in"><Button>Sign In</Button></Link>
                )}
            </div>
        </div>
    );
}

// Exportamos el componente para poder importarlo y usarlo en otras partes de la aplicación
export default Topbar
'use client';
import { obtenerPersonal } from "@/hooks/Conexion";
import { borrarSesion, getToken } from "@/hooks/SessionUtilClient";
import Link from "next/link";
import { useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function Curso() {

    let key = getToken();
    console.log("queiro ver:", key)

    const [personal, setPersonal] = useState([]);
    const [llpersonal, setLLpersonal] = useState(false);

    const salir = () => {
        borrarSesion();
    }

    if (!llpersonal) {
        obtenerPersonal('/admin/personas', key).then((info) => {
            console.log(info);
            if (info.code === 200) {
                setPersonal(info.datos);
                setLLpersonal(true);
                console.log('Personal y llpersonal configurados:', personal);
            }
        });
    }


    //console.log(data);


    return (
        <div className="row">
            <h1 style={{ textAlign: "center" }}>PERSONAL DE LA  TIENDA  DE LIBROS Y CONTACTOS</h1>
            <div className="container-fluid">
                <div className="col-12 mb-5" style={{ display: "flex", justifyContent: "center" }}>
                    <Link style={{ margin: "15px" }} href="/libro" className="btn btn-warning">Libros Disponibles</Link>
                    <Link style={{ margin: "15px" }} href="/login" onClick={salir} className="btn btn-danger">Cerrar Sesión</Link>
                    <Link style={{ margin: "15px" }} href="/libro" className="btn btn-success">Libros Vendidos</Link>
                    <Link style={{ margin: "15px" }} href="/factura" className="btn btn-success">Vender libro</Link>
                </div>

                <table className="table table-striped table-bordered table-responsive-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-center">NRO</th>
                            <th className="text-center">APELLIDOS</th>
                            <th className="text-center">NOMBRES</th>
                            <th className="text-center">IDENTIFICACION</th>
                            <th className="text-center">TIPO-IDENTIFICACION</th>
                            <th className="text-center">DIRECCION</th>
                            <th className="text-center">CORREO</th>
                            <th className="text-center">ACCIONES</th>


                        </tr>
                    </thead>
                    <tbody>
                        {personal.map((datos, i) => (
                            <tr key={i}>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">{datos.apellidos}</td>
                                <td className="text-center">{datos.nombres}</td>
                                <td className="text-center">{datos.identificacion}</td>
                                <td className="text-center">{datos.tipo_identificacion}</td>
                                <td className="text-center">{datos.direccion}</td>
                                <td className="text-center">{datos.cuenta.correo}</td>
                                <td>
                                    {<Link style={{ margin: "5px" }} href={`/personal/modificar/${datos.extrenal_censo}`} className="btn btn-primary font-weight-bold">MODIFICAR</Link>}

                                </td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    );
}
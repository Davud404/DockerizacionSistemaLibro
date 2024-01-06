'use client';
import { obtenerDocumento, obtenerNinosCE, obtenerPersonal } from "@/hooks/Conexion";
import { borrarSesion, getUser, getToken } from "@/hooks/SessionUtilClient";
import Link from "next/link";
import { useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function libro() {


    let key = getToken();

    const [libro, setLibro] = useState([]);
    const [lllibro, setLlibro] = useState(false);

    const salir = () => {
        borrarSesion();
    }

    if (!lllibro) {
        obtenerPersonal('/admin/libros', key).then((info) => {
            if (info.code === 200) {
                setLibro(info.info);
                setLlibro(true);
            }
        });
    }
    //console.log(data);


    return (
        <div className="row">
            <h1 style={{ textAlign: "center" }}>MIS REGISTROS</h1>
            <div className="container-fluid">
            <div className="col-12 mb-5" style={{ display: "flex", justifyContent: "center" }}>
                    <Link style={{ margin: "15px" }} href="/registrarlibro" className="btn btn-warning">Registrar Nuevo LIBRO</Link>
                    <Link style={{ margin: "15px" }} href="/login" onClick={salir} className="btn btn-danger">Cerrar Sesión</Link>
                    <Link style={{ margin: "15px" }} href="/personal" className="btn btn-success">MOSTRAR PERSONAL DE LA EMPRESA</Link>
                </div>
                <table className="table table-striped table-bordered table-responsive-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-center">Nro</th>
                            <th className="text-center">TITULO</th>
                            <th className="text-center">AUTOR</th>
                            <th className="text-center">EDITORIAL</th>
                            <th className="text-center">FECHA DE PUB</th>
                            <th className="text-center">ISBN</th>
                            <th className="text-center">GENERO</th>
                            <th className="text-center">NUM PAGINAS</th>
                            <th className="text-center">RESUMEN</th>
                            <th className="text-center">IDIOMA</th>
                            <th className="text-center">FORMATO</th>
                            <th className="text-center">PRECIO</th>
                            <th className="text-center">ARCHIVO</th>
                            
                            <th className="text-center">ACCIONES</th>

                        </tr>
                    </thead>
                    <tbody>
                        {libro.map((info, i) => (
                            <tr key={i}>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">{info.titulo}</td>
                                <td className="text-center">{info.autor}</td>
                                <td className="text-center">{info.editorial}</td>
                                <td className="text-center">{info.fechaPublicacion}</td>
                                <td className="text-center">{info.isbn}</td>
                                <td className="text-center">{info.genero}</td>
                                <td className="text-center">{info.numeroPaginas}</td>
                                <td className="text-center">{info.resumen}</td>
                                <td className="text-center">{info.idioma}</td>
                                <td className="text-center">{info.formato}</td>
                                <td className="text-center">{info.precio}</td>
                                <td>
                                        {info.archivoLibro.map((foto, index) => (
                                            <img style={{ width: 50, height: 50 }} key={index} src={foto.url} />
                                        ))}
                                    </td>

                                <td>
                                    {<Link style={{ margin: "5px" }} href={`/censopormi/modificar/${info.extrenal_censo}`} className="btn btn-primary font-weight-bold">MODIFICAR</Link>}
                            
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
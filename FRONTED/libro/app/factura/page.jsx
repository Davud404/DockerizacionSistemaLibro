'use client';
import { enviarVenta, obtenerPersonal } from "@/hooks/Conexion";
import { borrarSesion, getToken, getId, } from "@/hooks/SessionUtilClient";
import Link from "next/link";
import { useState } from "react";
import mensajes from "@/componentes/Mensajes";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'


export default function Factura() {

    const [libro, setLibro] = useState([]);
    const [lllibro, setLlibro] = useState(false);
    const [llamada, setLlamada] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [cedula, setCedula] = useState("");
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0];
    const [nro, setNro] = useState(0);
    const [data, setData] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataDes, setDataDes] = useState([]);

    const user = getId();

    const salir = () => {
        borrarSesion();
    }

    let key = getToken();
    //CARGAR PERSONAS
    if (!llamada) {
        obtenerPersonal('/admin/personas', key).then((info) => {

            if (info.code === 200) {

                setClientes(info.datos);
                setLlamada(true);
            } else if (info.code !== 200 || info.msg === "token expirado o no valido") {
                mensajes(info.msg, "Error", "error");
                Cookies.remove("token")
                router.push("/login")
            } else if (info.code !== 200 && info.tag === "Acceso no autorizado") {
                router.push("/libro")
                mensajes(info.tag, "Informacion", "error");
            } else {
                mensajes("No se pudo listar a las personas", "Error", "error");
            }
        });
    };


    const validationShema = Yup.object().shape({
        external_cliente: Yup.string().required('Seleccione una persona'),
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;


    //obtener todos los  libros
    if (!lllibro) {
        obtenerPersonal('/admin/libros', key).then((info) => {
            if (info.code === 200) {
                setLibro(info.info);
                setLlibro(true);
            }
        });
    }


    const subtotal = () => {
        var subtotal = 0;

        dataDes.forEach((element) => {
            subtotal += parseFloat(element.precio);
        });
        return subtotal;
    };


    const handleRowSelection = (index) => {
        const isSelected = selectedRows.includes(index);

        if (isSelected) {
            // Si la fila ya está seleccionada, qse quita de la lista
            setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
        } else {
            // Si la fila no está seleccionada, agrégala a la lista de seleccionada
            setSelectedRows([...selectedRows, index]);
        }
    };

    const handleAgregarLibro = () => {
        setSelectedRows([])
        setMostrarTabla(true);
    };

    const handleCerrarTabla = () => {
        setMostrarTabla(false);
        // setSelectedItems([]);
    };

    const descripcionAux = () => {
        const newDataDes = selectedRows.map((index) => data[index]);
        setDataDes((prevDataDes) => [...prevDataDes, ...newDataDes]);
        setSelectedRows([]); // Limpiar las filas seleccionadas después de guardarlas

        // Filtrar elementos seleccionados de data para obtener "libros disponibles"
        const librosDisponibles = data.filter((libro, i) => !selectedRows.includes(i));
        setData(librosDisponibles);
    };

    const sendData = (data) => {

        if (data.estado !== "PENDIENTE") {
            const numero = "000000" + nro.toString();
        
            const valuecantidad = dataDes.length;
            var datos = {
                'motodpago': data.motodpago,
                'estado': data.estado,
                'total': data.precio,
                'subtotal': data.subtotal,
                "external_cliente": data.external_cliente,
                'cantidad': valuecantidad,
            };
            enviarVenta('/admin/factura/guardar', datos, dataDes, key,).then((info) => {
                console.log(info)
                if (info.code !== 200) {
                    if (info.msg === 'token expirado o no valido') {
                        mensajes(info.msg, "Error", "error");
                        Cookies.remove("token")
                        router.push("/inicio_sesion")
                    } else {
                        mensajes("Venta no se pudo guardar", "Error", "error")
                    }
                } else {
                    mensajes("Venta guardada correctamente", "Informacion", "success")
                    router.push("/ventas");
                }
            });
        } else {
            mensajes("Venta Cancelada", "Informacion", "")
            router.push("/ventas");

        }
    }



    return (

        <div className='wrapper'>
            <h1 style={{ textAlign: "center" }}>FACTURACION</h1>
            <div className="col-12 mb-5" style={{ display: "flex", justifyContent: "center" }}>
                <Link style={{ margin: "15px" }} href="/registrarlibro" className="btn btn-warning">Registrar Nuevo LIBRO</Link>
                <Link style={{ margin: "15px" }} href="/login" onClick={salir} className="btn btn-danger">Cerrar Sesión</Link>
                <Link style={{ margin: "15px" }} href="/libro" className="btn btn-success">MOSTRAR LIBROS</Link>
            </div>
            <div className="card text-center" style={{ margin: 10 }}>
                <div className="card-body">
                    <div className='container-fluid'>

                        <form className='user' onSubmit={handleSubmit(sendData)} >

                            <div className="row mn-4">
                                <div className="col">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label">Numero:</label>
                                        <div className="col-lg-3">
                                            <input name="numero" id="numero" className="form-control" {...register('numero')} onChange={() => { }} value={`000000${nro}`} />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="col">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label" >Fecha:</label>
                                        <div className="col-lg-3">
                                            <input name="fecha" id="fecha" className="form-control" disabled defaultValue={fechaFormateada} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br />

                            <div className="row mb-4">
                                <div className="col">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label" >Cliente:</label>
                                        <div className="col-lg-3">
                                            <select className='form-control' style={{ height: 35, width: 400 }} name="external_cliente" id="external_cliente" {...register('external_cliente')} onChange={(e) => setCedula(e.target.options[e.target.selectedIndex].getAttribute('ced'))}>

                                                <option value="">Elija un cliente</option>
                                                {clientes.map((aux, i) => (
                                                    <option key={i} value={aux.id} ced={aux.identificacion}>
                                                        {`${aux.nombres} ${aux.apellidos}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label">Cedula:</label>
                                        <div className="col-lg-3">
                                            <input type="text" style={{ height: 35, width: 400 }} disabled className="form-control" name="identificacion" id="identificacion" defaultValue={cedula} />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row mb-4">
                                <div className="col">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label">EMPLEADO:</label>
                                        <div className="col-lg-3">
                                            <input type="text" style={{ height: 35, width: 400 }} disabled className="form-control" name="vendedor" id="vendedor" defaultValue={user} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group row">

                                        <div className="col-lg-3">

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label">Metodo pago:</label>
                                        <div className="col-lg-3">
                                            <select className='form-control' {...register('metodo')} name="metodo" id="metodo" style={{ height: 35, width: 400 }} >
                                                <option>ESCOJA EL METODO</option>
                                                <option>TARJETA</option>
                                                <option>EFECTIVO</option>

                                            </select>

                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label">Estado Venta:</label>
                                        <div className="col-lg-3">
                                            <select className='form-control' {...register('estado')} name="estado" id="estado" style={{ height: 35, width: 400 }}  >
                                                <option>PAGADA</option>
                                                <option>CANCELADA</option>

                                            </select>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md">
                                    <div className="form-group row">
                                        <label className="col-lg-3 col-form-label" >LIBROS DISPONIBLES PARA VENDER:</label>
                                        <div className="col-lg-3">
                                            <select className='form-control' style={{ height: 35, width: 400 }} name="external_cliente" id="external_cliente" {...register('external_cliente')}>

                                                <option value="">Elija un libro</option>
                                                {libro.map((aux, i) => (
                                                    <option key={i} value={aux.id}>
                                                        {`${aux.titulo}---${aux.autor}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    
                                </div>

                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md">

                                </div>
                            </div>
                            <div className="row mb-4">

                            </div>
                           
                            <br />
                            <button type='submit' className="btn btn-success">Generar Venta</button>
                        </form>
                    </div>
                </div>
            </div >

        </div >
    );

}
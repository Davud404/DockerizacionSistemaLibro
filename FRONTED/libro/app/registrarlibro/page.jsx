'use client';
import { GuardarDocumento, enviarCenso, enviarLibro, enviarcc, enviarlibro, obtener, obtenerNinosCE, obtenerPersonal, obtenercurso } from "@/hooks/Conexion";
import { getUser, getToken } from "@/hooks/SessionUtilClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import mensajes from '@/componentes/Mensajes';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


export default function Page() {
    let key = getToken();

    const router = useRouter();

    const [selectimg, setSelectimg] = useState([]);
    const [estado, setEstado] = useState(false);
    const [tipo, setTipo] = useState('');
    const [llamada, setLlamada] = useState(false);

    const handleImageChange = (event) => {
        const files = event.target.files;

        const newImagesArray = [...selectimg, ...Array.from(files)];

        if (newImagesArray.length <= 3) {
            setSelectimg(newImagesArray);
        } else {
            mensajes("Solo se permiten hasta 3 imágenes", 'error', 'Error');
        }
    };
    const validationShema = Yup.object().shape({
        titulo: Yup.string().required('Ingrese un título'),
        autor: Yup.string().required('Ingrese un autor'),
        editorial: Yup.string().required('Ingrese una editorial'),
        fechaPublicacion: Yup.date().required('Ingrese una fecha de publicación'),
        isbn: Yup.string().required('Ingrese un ISBN'),
        genero: Yup.string().required('Seleccione un género'),
        numeroPaginas: Yup.number().required('Ingrese el número de páginas'),
        resumen: Yup.string().required('Ingrese un resumen'),
        idioma: Yup.string().required('Ingrese un idioma'),
        formato: Yup.string().required('Ingrese un formato'),
        images: Yup.mixed().required('Seleccione por lo menos una imagen'),
    });
    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    //Metodo para guardar documento
    const sendData = (data) => {
        var datos = {
            'titulo': data.titulo,
            'autor': data.autor,
            'editorial': data.editorial,
            'fechaPublicacion': data.fechaPublicacion,
            'isbn': data.isbn,
            'genero': data.genero,
            'numeroPaginas': data.numeroPaginas,
            'resumen': data.resumen,
            'idioma': data.idioma,
            'formato': data.formato,
            'precio': data.precio,
        };

        enviarLibro('admin/libros/guardar', selectimg, datos, key).then((info) => {
            console.log("libro info es: ",info)
            if (info.code !== 200) {
                if (info.msg === 'token expirado o no valido') {
                    mensajes(info.msg, "Error", "error");
                    Cookies.remove("token")
                    router.push("/login")
                } else {
                    mensajes("Libro no se pudo guardar", "Error", "error")
                }
            } else {
                mensajes("Libro guardado correctamente", "Informacion", "success")
                router.push("/libro");
            }
        });
    };







    return (
        <div className="wrapper" >
            
            <center>
                <br /><br />
                <div className="d-flex flex-column" style={{ width: 700 }}>
                    <h5 className="title" style={{ color: "black", font: "bold" }}>REGISTRO DE  LIBROS</h5>
                    <br />

                    <div className='container-fluid'>
                        <form className="user" onSubmit={handleSubmit(sendData)}>
                            <div className="row mb-4">
                                <div className="col">
                                    <input {...register('titulo')} name="titulo" id="titulo" placeholder="Ingrese el titulo" className={`form-control ${errors.titulo ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.titulo?.message}</div>
                                </div>
                                <div className="col">
                                    <input {...register('autor')} name="autor" id="autor" placeholder="Ingrese el autor" className={`form-control ${errors.autor ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.autor?.message}</div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <input {...register('editorial')} name="editorial" id="editorial" placeholder="Ingrese el editorial" className={`form-control ${errors.editorial ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.editorial?.message}</div>
                                </div>
                                <div className="col">
                                    <input {...register('isbn')} name="isbn" id="isbn" placeholder="Ingrese el isbn" className={`form-control ${errors.isbn ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.isbn?.message}</div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <input {...register('fechaPublicacion')} name="fechaPublicacion" id="fechaPublicacion" placeholder="Ingrese el fechaPublicacion" className={`form-control ${errors.fechaPublicacion ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.fechaPublicacion?.message}</div>
                                </div>
                                <div className="col">
                                    <input {...register('genero')} name="genero" id="genero" placeholder="Ingrese el genero" className={`form-control ${errors.genero ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.genero?.message}</div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <input {...register('numeroPaginas')} name="numeroPaginas" id="numeroPaginas" placeholder="Ingrese el numeroPaginas" className={`form-control ${errors.numeroPaginas ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.numeroPaginas?.message}</div>
                                </div>
                                <div className="col">
                                    <input {...register('resumen')} name="resumen" id="resumen" placeholder="Ingrese el resumen" className={`form-control ${errors.resumen ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.resumen?.message}</div>
                                </div>
                            </div>

                            <div className="row mb-4">
                            <div className="col">
                                    <input {...register('idioma')} name="idioma" id="idioma" placeholder="Ingrese el idioma" className={`form-control ${errors.idioma ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.idioma?.message}</div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col">
                                    <br />
                                    <label className="custom-file-label" style={{ color: "black", fontWeight: "bold", fontSize: '16px' }}>Imagenes</label>
                                    <input {...register('images')} type="file" accept="images/jpeg, images/png" className={`form-control ${errors.tipo ? 'is-invalid' : ''}`} multiple onChange={handleImageChange} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.images?.message}</div>
                                </div>

                            </div>

                            <div className="row mb-4">
                                <div className="col">
                                    <select {...register('formato')} name="formato" id="formato" className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}>
                                        <option>Elija un formato</option>
                                        <option>impreso</option>
                                        <option>electronico</option>
                                        <option>audiolibro</option>
                                    </select>
                                    <div className='alert alert-danger invalid-feedback'>{errors.formato?.message}</div>
                                </div>
                                <div className="col">
                                <div className="col">
                                    <input {...register('precio')} name="precio" id="precio" placeholder="Ingrese el precio" className={`form-control ${errors.precio ? 'is-invalid' : ''}`} />
                                    <div className='alert alert-danger invalid-feedback'>{errors.precio?.message}</div>
                                </div>

                                </div>
                            </div>


                            <hr />
                            <button type='submit' className="btn btn-success">GUARDAR</button>

                        </form>
                    </div>
                    {<Link style={{ margin: "5px" }} href="/libro" className="btn btn-danger font-weight-bold">Regresar</Link>}
                </div>
            </center>
        </div>
    );
}

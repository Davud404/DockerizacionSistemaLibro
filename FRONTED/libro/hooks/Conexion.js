let URL = "http://localhost:3007/api/";
let URLS = "http://localhost:3007/api/";

//devolver la url
export function url_api() {
  return URL;
}

//documentos


export async function enviar(recurso, data) {
  const headers = {
    Accept: "application/json",
    //"Content-Type": "application/json"
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  return await response.json();
}
export async function obtenercurso(recurso) {
  const response = await fetch(URLS + recurso);
  return await response.json();
}

//este si vale
export async function enviarcc(recurso, data, key = "") {
  let headers = {};

  if (key !== "") {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "TOKEN-API": key,
    };
  } else {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  return await response.json();
}
export async function obtenerPersonal(recurso, key = "") {
  let headers = {};
  headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "TOKEN-API": key,
  };

  const response = await (
    await fetch(URL + recurso, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    })
  ).json();

  // console.log("respuesta odcs: " + response)
  return response;
}
export async function enviarLibro(recurso, imagen, data, key = "", rol) {
  const formData = new FormData();

  for (let i = 0; i < imagen.length; i++) {
    formData.append("images", imagen[i]); // Agregar cada imagen al FormData
  }

  formData.append("libros", JSON.stringify(data));

  let headers = {};

  headers = {
    //'Accept': 'application/json',
    // "Content-Type": "application/json",
    "TOKEN-API": key,
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: formData,
  });

  return await response.json();
}
export const enviarVenta = async (recurso, data, array, key = "") => {
  const formData = new FormData();
  array.forEach((element) => {
    formData.append("dataDes", JSON.stringify(element));
  });
  formData.append("factura", JSON.stringify(data));

  const cabeceras = {
    "TOKEN-API": key,
  };

  const datos = await (
    await fetch(URL + recurso, {
      method: "POST",
      headers: cabeceras,
      body: formData,
    })
  ).json();
  return datos;
};

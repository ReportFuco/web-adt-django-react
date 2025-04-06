import { getProductos } from "../../services/store.api";
import React, { useState, useEffect } from "react";
import Header from "../layout/Header";

function StoreCard() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function loadProductos() {
      try {
        const res = await getProductos();
        setProductos(res.data);
      } catch (error) {
        console.error("Error al cargar los productos");
      }
    }
    loadProductos();
  }, []);

  return (
    <div>
        <Header/>
      <div>
        {productos.map((producto) => (
          <div key={producto.id}>
            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <img src={producto.imagen} alt={producto.nombre} />
            <p>{producto.categoria}</p>
            <p>{producto.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoreCard;

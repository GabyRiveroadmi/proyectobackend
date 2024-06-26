const socket = io(); 

socket.on("productos", (data) => {
    renderProductos(data);
})


const renderProductos = (data) => {
const contenedorProductos = document.getElementById("contenedorProductos");
contenedorProductos.innerHTML = "";

data.forEach(item => {
const card = document.createElement("div"); 
        
card.innerHTML = `  <p> ${item.id} </p>
                <p> ${item.title} </p>
                <p> ${item.description} </p>
                <p> ${item.code} </p>
                <p> ${item.price} </p>
                <p> ${item.price} </p>
                <p> ${item.category} </p>
                
                <button> Eliminar </button>
                        `
contenedorProductos.appendChild(card); 
 
card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id); 
})
})
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id); 
}
 

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})


const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value, 
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        img: document.getElementById("img").value,   
    }

    socket.emit("agregarProducto", producto);
}
//Referencias al DOM
const galeria = document.getElementById("galeria");
const visor = document.getElementById("visor");
const visorImg = document.getElementById("visor-img");
const visorInfo = document.getElementById("visor-info");
const indicador = document.getElementById("indicador");

//Recopilemos todas las imagenes miniaturas

const miniaturas = Array.from(galeria.querySelectorAll("img"));

// Indice de la imagen actual visible en el visor

let indiceActual = 0;

// El vento personalizado: Para notificar que cambio la imagen

document.addEventListener("galeria:cambio", ({ detail }) => {
  //indicador.textContent = `${indiceActual + 1} / ${miniaturas.length}`;
  indicador.textContent = `Imagen ${detail.indice + 1} de ${miniaturas.length}`;
});

// Funcion muestra la imagen por indice

function mostrarImagen(indice) {
  //Actualizar el indice global
  indiceActual = indice;
  const miniatura = miniaturas[indiceActual];

  // Copiar los valores de la imagen que tengas atributos src y alt
  visorImg.src = miniatura.src;
  visorImg.alt = miniatura.alt;
  visorInfo.textContent = `${indiceActual + 1} de ${miniaturas.length}`;

  // Disparar el evento personalizado
  const evento = new CustomEvent("galeria:cambio", {
    bubbles: true, //Subir por el DOM
    detail: { indice: indiceActual },
  });

  document.dispatchEvent(evento);
}

// Funcion para abrir el visor

function abrirVisor(indice) {
  mostrarImagen(indice);
  visor.classList.add("activo");
  document.addEventListener("keydown", manejarTeclado);
}

function cierraVisor() {
  visor.classList.remove("activo");
  document.removeEventListener("keydown", manejarTeclado);
}

// Funcion para manejar el teclado
function manejarTeclado(event) {
  switch (event.key) {
    case "ArrowRight":
      //Evitar que al recargar la pagina la flecha que haga clic
      event.preventDefault();
      mostrarImagen(indiceActual + 1) % miniaturas.length;
      break;

    case "ArrowLeft":
      event.preventDefault();
      mostrarImagen((indiceActual - 1 + miniaturas.length) % miniaturas.length);
      break;

    case "Escape":
      cierraVisor();
      break;
  }
}

//Delegar los eventos click al contenedor galeria
//Gestiona el click de todas las imagenes en miniatura

galeria.addEventListener("click", (event) => {
  //Verificar si el click fue en una imagen
  const img = event.target.closest("img");
  // Si el clic no fue a la imagen la tenemos que ignorar
  if (!img) return;

  const indice = Number(img.dataset.index);
  abrirVisor(indice);
});

visor.addEventListener("click", (event) => {
  // Si el click fue directamente en el fondo (#visor) y no en la imagen anterior
  if (event.target === visor) {
    cierraVisor();
  }
});

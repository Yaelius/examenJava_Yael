// main.js

let jugador1Cartas = [];
let jugador2Cartas = [];
let cartaSeleccionadaJugador1 = null;
let cartaSeleccionadaJugador2 = null;

document.addEventListener('DOMContentLoaded', async () => {
  const personajes = await cargarPersonajes();
  repartirCartas(personajes);
});

async function cargarPersonajes() {
  const response = await fetch('personajes.json');
  const personajes = await response.json();
  return personajes;
}

function repartirCartas(personajes) {
  personajes = personajes.sort(() => Math.random() - 0.5);

  const mitad = Math.ceil(personajes.length / 2);
  jugador1Cartas = personajes.slice(0, mitad);
  jugador2Cartas = personajes.slice(mitad);

  mostrarCartas(jugador1Cartas, 'jugador1-cartas');
  mostrarCartas(jugador2Cartas, 'jugador2-cartas');
}

function mostrarCartas(cartas, contenedorId) {
  const contenedor = document.getElementById(contenedorId);

  cartas.forEach(personaje => {
    const template = document.getElementById('carta-template');
    const nuevaCarta = document.importNode(template.content, true);

    nuevaCarta.querySelector('.nombre').textContent = personaje.nom;
    nuevaCarta.querySelector('.ataque').textContent = `Ataque: ${personaje.atac}`;
    nuevaCarta.querySelector('.defensa').textContent = `Defensa: ${personaje.defensa}`;
    nuevaCarta.querySelector('.velocidad').textContent = `Velocidad: ${personaje.velocitat}`;
    nuevaCarta.querySelector('.salud').textContent = `Salud: ${personaje.salut}`;
    nuevaCarta.querySelector('.imagen').src = personaje.imagen;

    contenedor.appendChild(nuevaCarta);
  });
}


function seleccionarCarta(cartaSeleccionada) {
  const jugador1 = document.getElementById('jugador1');
  const jugador2 = document.getElementById('jugador2');

  if (jugador1.contains(cartaSeleccionada)) {
    manejarSeleccionCarta(cartaSeleccionada, cartaSeleccionadaJugador1);
    cartaSeleccionadaJugador1 = cartaSeleccionada;
  } else if (jugador2.contains(cartaSeleccionada)) {
    manejarSeleccionCarta(cartaSeleccionada, cartaSeleccionadaJugador2);
    cartaSeleccionadaJugador2 = cartaSeleccionada;
  }

  cartaSeleccionada.classList.add('seleccionada');
}

function manejarSeleccionCarta(cartaSeleccionada, cartaSeleccionadaJugador) {
  if (cartaSeleccionadaJugador) {
    cartaSeleccionadaJugador.classList.remove('seleccionada');
  }
}

async function iniciarCombate() {
  if (cartaSeleccionadaJugador1 && cartaSeleccionadaJugador2) {
    const cartaJugador1 = obtenerDatosCarta(cartaSeleccionadaJugador1);
    const cartaJugador2 = obtenerDatosCarta(cartaSeleccionadaJugador2);

    document.getElementById('iniciar-combate').disabled = true;

    await realizarCombate(cartaJugador1, cartaJugador2);

    document.getElementById('iniciar-combate').disabled = false;
  } else {
    console.log('Selecciona una carta para cada jugador antes de iniciar el combate.');
  }
}

function obtenerDatosCarta(cartaElement) {
  return {
    nom: cartaElement.querySelector('.nombre').textContent,
    atac: parseInt(cartaElement.querySelector('.ataque').textContent.split(' ')[1]),
    defensa: parseInt(cartaElement.querySelector('.defensa').textContent.split(' ')[1]),
    velocidad: parseInt(cartaElement.querySelector('.velocidad').textContent.split(' ')[1]),
    salut: parseInt(cartaElement.querySelector('.salud').textContent.split(' ')[1]),
  };
}

async function mostrarAlertaCombate(atacante, defensor) {
  let mensaje = "";

  while (atacante.salut > 0 && defensor.salut > 0) {
    mensaje +=
      `${atacante.nom} ataca a ${defensor.nom}.\n${defensor.nom} recibe ${atacante.atac} de daño.\n`;

    defensor.salut -= atacante.atac;
    mensaje += `${defensor.nom} tiene ${defensor.salut} de salud restante.\n`;

    mensaje +=
      `${defensor.nom} ataca a ${atacante.nom}.\n${atacante.nom} recibe ${defensor.atac} de daño.\n`;

    atacante.salut -= defensor.atac;
    mensaje += `${atacante.nom} tiene ${atacante.salut} de salud restante.\n`;
  }

  mensaje +=
    `¡${atacante.nom} ha ganado!\n\n` +
    `${atacante.nom} (Ataque: ${atacante.atac}, Defensa: ${atacante.defensa}, Salud: ${atacante.salut})\n` +
    `vs.\n` +
    `${defensor.nom} (Ataque: ${defensor.atac}, Defensa: ${defensor.defensa}, Salud: ${defensor.salut})`;

  alert(mensaje);
}

async function realizarCombate(atacante, defensor) {
  if (atacante.velocidad > defensor.velocidad) {
    await mostrarAlertaCombate(atacante, defensor);
  } else {
    await mostrarAlertaCombate(defensor, atacante);
  }
}

document.getElementById('jugador1-cartas').addEventListener('click', (event) => {
  const cartaSeleccionada = event.target.closest('.carta');
  if (cartaSeleccionada) {
    seleccionarCarta(cartaSeleccionada);
  }
});

document.getElementById('jugador2-cartas').addEventListener('click', (event) => {
  const cartaSeleccionada = event.target.closest('.carta');
  if (cartaSeleccionada) {
    seleccionarCarta(cartaSeleccionada);
  }
});

document.getElementById('iniciar-combate').addEventListener('click', async () => {
  await iniciarCombate();
});

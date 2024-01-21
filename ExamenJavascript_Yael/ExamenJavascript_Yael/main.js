// main.js

// Carga los personajes desde el archivo JSON
fetch('personajes.json')
  .then(response => response.json())
  .then(personajes => repartirCartas(personajes))
  .catch(error => console.error('Error al cargar los personajes:', error));

let cartaSeleccionadaJugador1 = null;
let cartaSeleccionadaJugador2 = null;

function repartirCartas(personajes) {
  // Ordena los personajes por nombre
  personajes = personajes.sort((a, b) => a.nom.localeCompare(b.nom));

  // Divide la mitad de los personajes para cada jugador
  const mitad = Math.ceil(personajes.length / 2);
  const jugador1Cartas = personajes.slice(0, mitad);
  const jugador2Cartas = personajes.slice(mitad);

  // Crea las cartas y las muestra en el HTML
  mostrarCartas(jugador1Cartas, 'jugador1');
  mostrarCartas(jugador2Cartas, 'jugador2');
}

function mostrarCartas(cartas, contenedorId) {
  const contenedor = document.getElementById(contenedorId);

  cartas.forEach(personaje => {
    const template = document.getElementById('carta-template');
    const nuevaCarta = document.importNode(template.content, true);

    nuevaCarta.querySelector('h3').textContent = personaje.nom;
    nuevaCarta.querySelector('.ataque').textContent = personaje.atac;
    nuevaCarta.querySelector('.defensa').textContent = personaje.defensa;
    nuevaCarta.querySelector('.velocidad').textContent = personaje.velocitat;
    nuevaCarta.querySelector('.salud').textContent = personaje.salut;

    // Puedes utilizar la descripción del personaje para generar la imagen
    const imagenSrc = generarImagenDesdeDescripcion(personaje.descripcio);
    nuevaCarta.querySelector('img').src = imagenSrc;

    // Añadir el evento de clic para seleccionar la carta
    nuevaCarta.querySelector('.card').addEventListener('click', () => seleccionarCarta(nuevaCarta, contenedorId));

    contenedor.appendChild(nuevaCarta);
  });
}

function generarImagenDesdeDescripcion(descripcion) {
  // Aquí deberías implementar la lógica para asignar la imagen correcta
  // según la descripción del personaje
  switch (descripcion.toLowerCase()) {
    case 'un perro sabio y transformable que siempre está listo para la aventura.':
      return 'jake.jpg';
    case 'el héroe valiente con una espada afilada y su leal compañero jake el perro.':
      return 'finn.jpg';
    case 'una valiente guerrera humana-vampiro con una hacha afilada y habilidades excepcionales.':
      return 'marceline.jpg';
    case 'el excéntrico villano que lanza hechizos helados y tiene un corazón complicado.':
      return 'rey_hielo.jpg';
    case 'un arcoíris viviente lleno de positividad y color, siempre listo para ayudar.':
      return 'bob_arcoiris.jpg';
    case 'una consola de videojuegos con conciencia propia, amante de la diversión y la aventura.':
      return 'bmo.jpg';
    case 'la dulce pero fuerte princesa del Reino del Chicle, con habilidades científicas sorprendentes.':
      return 'princesa_chicle.jpg';
    case 'una entidad mágica formada por los colores del arcoíris, capaz de crear y controlar ilusiones.':
      return 'lady_arcoiris.jpg';
    case 'BMO en su versión de combate, equipado con herramientas y habilidades avanzadas para enfrentar desafíos.':
      return 'bmo_guerrero.jpg';
    case 'Una llama real con habilidades pirotécnicas, capaz de controlar el fuego y defender su reino con valentía.':
      return 'princesa_llama.jpg';
    case 'Gunter, el pingüino, potenciado con inteligencia y habilidades mejoradas después de un experimento científico de la Princesa Chicle. ¡Ahora es una amenaza intelectual!':
      return 'gunter_inteligente.jpg';
    default:
      return 'imagen_generica.jpg'; // Imagen genérica si no se encuentra la descripción
  }
}

function seleccionarCarta(cartaSeleccionada, contenedorId) {
  const carta = cartaSeleccionada;

  if (contenedorId === 'jugador1') {
    manejarSeleccionCarta(carta, cartaSeleccionadaJugador1);
    cartaSeleccionadaJugador1 = carta;
  } else if (contenedorId === 'jugador2') {
    manejarSeleccionCarta(carta, cartaSeleccionadaJugador2);
    cartaSeleccionadaJugador2 = carta;
  }

  carta.classList.add('seleccionada');
}

function manejarSeleccionCarta(carta, cartaSeleccionada) {
  if (cartaSeleccionada) {
    cartaSeleccionada.classList.remove('seleccionada');
  }
}


async function iniciarCombate() {
    if (cartaSeleccionadaJugador1 && cartaSeleccionadaJugador2) {
      const cartaJugador1 = obtenerDatosCarta(cartaSeleccionadaJugador1);
      const cartaJugador2 = obtenerDatosCarta(cartaSeleccionadaJugador2);
  
      // Deshabilitar el botón de iniciar combate para evitar múltiples clics
      document.getElementById('iniciar-combate').disabled = true;
  
      // Iniciar combate
      await realizarAtaque(cartaJugador1, cartaJugador2);
  
      // Habilitar el botón de iniciar combate después de mostrar el resultado
      document.getElementById('iniciar-combate').disabled = false;
    } else {
      console.log('Selecciona una carta para cada jugador antes de iniciar el combate.');
    }
  }
  
  async function realizarAtaque(atacante, defensor) {
    // Turno del jugador atacante
    await atacar(atacante, defensor);
  
    // Verifica si el jugador defensor perdió
    if (defensor.salut <= 0) {
      await mostrarResultado(atacante, defensor);
      return;
    }
  
    // Espera 1 segundo antes de continuar con el siguiente ataque
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // Turno del jugador defensor
    await atacar(defensor, atacante);
  
    // Verifica si el jugador atacante perdió
    if (atacante.salut <= 0) {
      await mostrarResultado(defensor, atacante);
      return;
    }
  
    // Espera 1 segundo antes de realizar el siguiente ciclo de ataques
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // Realiza el siguiente ciclo de ataques de forma recursiva
    await realizarAtaque(atacante, defensor);
  }
  

function mostrarResultado(cartaGanadora, cartaPerdedora) {
  const mensaje =
    `¡${cartaGanadora.nom} ha ganado!\n\n` +
    `${cartaGanadora.nom} (Ataque: ${cartaGanadora.atac}, Defensa: ${cartaGanadora.defensa}, Salud: ${cartaGanadora.salut})\n` +
    `vs.\n` +
    `${cartaPerdedora.nom} (Ataque: ${cartaPerdedora.atac}, Defensa: ${cartaPerdedora.defensa}, Salud: ${cartaPerdedora.salut})`;

  alert(mensaje);
}

function obtenerDatosCarta(cartaElement) {
  return {
    nom: cartaElement.querySelector('h3').textContent,
    atac: parseInt(cartaElement.querySelector('.ataque').textContent),
    defensa: parseInt(cartaElement.querySelector('.defensa').textContent),
    velocidad: parseInt(cartaElement.querySelector('.velocidad').textContent),
    salut: parseInt(cartaElement.querySelector('.salud').textContent),
  };
}

function atacar(atacante, defensor) {
  console.log(`${atacante.nom} ataca a ${defensor.nom}`);

  // Lógica del combate
  if (atacante.atac > defensor.defensa) {
    const danio = atacante.atac - defensor.defensa;
    defensor.salut -= danio;
    console.log(`${defensor.nom} recibe ${danio} de daño.`);
  } else {
    defensor.salut -= 10;
    console.log(`${defensor.nom} recibe 10 de daño.`);
  }

  console.log(`${defensor.nom} tiene ${defensor.salut} de salud restante.`);
}

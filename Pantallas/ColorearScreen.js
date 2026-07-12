import { useMemo, useRef, useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,ImageBackground,ActivityIndicator,Image,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';

// Permite leer archivos locales y convertirlos a Base64
import * as FileSystem from 'expo-file-system/legacy';

// Lista de colores disponibles en la paleta
const colores = [
  '#ff0000', // rojo
  '#ff9800', // naranja
  '#ffeb3b', // amarillo
  '#4caf50', // verde
  '#2196f3', // azul
  '#9c27b0', // morado
  '#ffffff', // blanco
  '#000000', // negro
  '#808080', // gris
  '#ab5800', // chocolate
  '#ff69b4', // rosado
];

// Lista de animales disponibles para colorear
const dibujos = [
  {
    id: 'oveja',
    nombre: 'Oveja',
    imagen: require('../assets/colorear/oveja.png'),
  },
  {
    id: 'cerdo',
    nombre: 'Cerdo',
    imagen: require('../assets/colorear/cerdo.png'),
  },
  {
    id: 'caballo',
    nombre: 'Caballo',
    imagen: require('../assets/colorear/caballo.png'),
  },
  {
    id: 'vaca',
    nombre: 'Vaca',
    imagen: require('../assets/colorear/vaca.png'),
  },
  {
    id: 'jirafa',
    nombre: 'Jirafa',
    imagen: require('../assets/colorear/jirafa.png'),
  },
];

export default function ColorearScreen() {
  // Referencia utilizada para enviar instrucciones al WebView
  const webRef = useRef(null);

  // Controla si se muestra el menu o el editor para pintar
  const [modo, setModo] = useState('menu');

  // Guarda el color seleccionado actualmente
  const [colorActual, setColorActual] = useState('#ff0000');

  // Guarda el contenido HTML que contiene el Canvas
  const [htmlCanvas, setHtmlCanvas] = useState(null);

  // Indica si una imagen se esta cargando
  const [cargando, setCargando] = useState(false);

  // Guarda el animal que se esta coloreando
  const [dibujoActual, setDibujoActual] = useState(null);

  // Guarda temporalmente el dibujo coloreado de cada animal
  const [dibujosGuardados, setDibujosGuardados] = useState({});

  /*
    Crea el objeto que utiliza el WebView como fuente.

    useMemo evita crear el objeto nuevamente si el HTML
    no ha cambiado.
  */
  const webSource = useMemo(() => {
    if (!htmlCanvas) {
      return null;
    }

    return {
      html: htmlCanvas,
    };
  }, [htmlCanvas]);

  /*
    Abre el animal seleccionado dentro del editor.

    La funcion carga la imagen local, la convierte a Base64,
    recupera el dibujo guardado y crea el HTML del Canvas.
  */
  async function abrirDibujo(dibujo) {
    try {
      // Activa el indicador de carga
      setCargando(true);

      // Guarda el animal seleccionado
      setDibujoActual(dibujo);

      // Obtiene la imagen local mediante Expo Asset
      const asset = Asset.fromModule(dibujo.imagen);

      // Descarga o prepara el archivo para poder leerlo
      await asset.downloadAsync();

      // Obtiene la ruta local de la imagen
      const uri = asset.localUri || asset.uri;

      // Convierte la imagen en una cadena Base64
      const base64 = await FileSystem.readAsStringAsync(
        uri,
        {
          encoding: 'base64',
        }
      );

      // Construye una imagen que puede utilizarse dentro del HTML
      const imagenBase64 =
        `data:image/png;base64,${base64}`;

      /*
        Busca si el usuario ya habia coloreado este animal
        durante la sesion actual.
      */
      const imagenGuardada =
        dibujosGuardados[dibujo.id] || null;

      // Crea el HTML completo que se mostrara en el WebView
      setHtmlCanvas(
        crearHtml(
          imagenBase64,
          colorActual,
          imagenGuardada
        )
      );

      // Cambia del menu al editor
      setModo('pintar');
    } catch (error) {
      console.log(
        'Error cargando imagen:',
        error
      );
    } finally {
      // Desactiva el indicador aunque ocurra un error
      setCargando(false);
    }
  }

  /*
    Regresa al menu principal.

    Antes de salir, solicita al WebView que convierta
    el Canvas en una imagen y la envie a React Native.
  */
  function volverAlMenu() {
    if (webRef.current && dibujoActual) {
      webRef.current.injectJavaScript(`
        guardarYVolver('${dibujoActual.id}');
        true;
      `);
    } else {
      // Regresa directamente cuando no hay un dibujo abierto
      setModo('menu');
      setHtmlCanvas(null);
      setDibujoActual(null);
    }
  }

  /*
    Recibe los mensajes enviados desde el WebView.

    El mensaje contiene el identificador del animal
    y una imagen Base64 con el dibujo coloreado.
  */
  function manejarMensaje(event) {
    try {
      // Convierte el mensaje recibido en un objeto
      const datos = JSON.parse(
        event.nativeEvent.data
      );

      // Comprueba que el mensaje sea para guardar y volver
      if (datos.tipo === 'guardarVolver') {
        /*
          Guarda la imagen dentro de dibujosGuardados
          utilizando el id del animal.
        */
        setDibujosGuardados((estadoActual) => ({
          ...estadoActual,
          [datos.id]: datos.imagen,
        }));

        // Regresa al menu de animales
        setModo('menu');
        setHtmlCanvas(null);
        setDibujoActual(null);
      }
    } catch (error) {
      console.log(
        'Error recibiendo mensaje:',
        error
      );
    }
  }

  /*
    Cambia el color seleccionado.

    Tambien envia el nuevo color al Canvas
    que se encuentra dentro del WebView.
  */
  function cambiarColor(color) {
    setColorActual(color);

    if (webRef.current) {
      webRef.current.injectJavaScript(`
        window.colorActual = '${color}';
        true;
      `);
    }
  }

  /*
    Solicita al WebView que borre los colores
    y vuelva a mostrar la imagen original.
  */
  function reiniciarDibujo() {
    if (webRef.current) {
      webRef.current.injectJavaScript(`
        reiniciar();
        true;
      `);
    }
  }

  /*
    Genera el documento HTML que contiene el Canvas.

    Recibe la imagen original en Base64, el color inicial
    y una imagen guardada si el animal ya fue coloreado.
  */
  function crearHtml(
    imagenBase64,
    colorInicial,
    imagenGuardada
  ) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        >

        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: transparent;
            overflow: hidden;
            touch-action: none;
            width: 100%;
            height: 100%;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          canvas {
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 18px;
            touch-action: none;
          }
        </style>
      </head>

      <body>
        <canvas
          id="canvas"
          width="900"
          height="900"
        ></canvas>

        <script>
          // Obtiene el Canvas y su contexto de dibujo
          const canvas =
            document.getElementById('canvas');

          const ctx = canvas.getContext(
            '2d',
            {
              willReadFrequently: true,
            }
          );

          // Guarda la imagen original del animal
          let imagenOriginal = new Image();

          // Guarda la imagen coloreada anteriormente
          let imagenGuardadaSrc =
            ${JSON.stringify(imagenGuardada)};

          // Color que se aplicara al tocar una zona
          window.colorActual = '${colorInicial}';

          /*
            Se ejecuta cuando la imagen original termina
            de cargarse dentro del navegador.
          */
          imagenOriginal.onload = function() {
            if (imagenGuardadaSrc) {
              const imagenGuardadaCanvas =
                new Image();

              /*
                Dibuja la version coloreada guardada
                si ya existe una.
              */
              imagenGuardadaCanvas.onload =
                function() {
                  ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                  );

                  ctx.drawImage(
                    imagenGuardadaCanvas,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                  );
                };

              imagenGuardadaCanvas.src =
                imagenGuardadaSrc;
            } else {
              // Dibuja la imagen limpia si no existe guardado
              dibujarImagenOriginal();
            }
          };

          // Asigna la imagen Base64 al objeto Image
          imagenOriginal.src = '${imagenBase64}';

          /*
            Limpia el Canvas y dibuja la imagen original
            centrada y ajustada al espacio disponible.
          */
          function dibujarImagenOriginal() {
            ctx.clearRect(
              0,
              0,
              canvas.width,
              canvas.height
            );

            // Coloca un fondo blanco
            ctx.fillStyle = 'white';

            ctx.fillRect(
              0,
              0,
              canvas.width,
              canvas.height
            );

            const margen = 5;

            /*
              Calcula la escala necesaria para que la imagen
              entre completa dentro del Canvas.
            */
            const escala = Math.min(
              (
                canvas.width -
                margen * 2
              ) / imagenOriginal.width,

              (
                canvas.height -
                margen * 2
              ) / imagenOriginal.height
            );

            const imgW =
              imagenOriginal.width * escala;

            const imgH =
              imagenOriginal.height * escala;

            // Centra la imagen horizontalmente
            const imgX =
              (canvas.width - imgW) / 2;

            // Centra la imagen verticalmente
            const imgY =
              (canvas.height - imgH) / 2;

            ctx.drawImage(
              imagenOriginal,
              imgX,
              imgY,
              imgW,
              imgH
            );
          }

          /*
            Elimina el dibujo guardado y vuelve
            a mostrar la imagen original.
          */
          function reiniciar() {
            imagenGuardadaSrc = null;
            dibujarImagenOriginal();
          }

          // Permite ejecutar reiniciar desde React Native
          window.reiniciar = reiniciar;

          /*
            Convierte el Canvas en una imagen Base64
            y la envia a React Native.
          */
          function guardarYVolver(id) {
            const imagenActual =
              canvas.toDataURL('image/png');

            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                tipo: 'guardarVolver',
                id: id,
                imagen: imagenActual,
              })
            );
          }

          // Permite ejecutar guardarYVolver desde React Native
          window.guardarYVolver = guardarYVolver;

          /*
            Convierte un color hexadecimal
            en valores rojo, verde y azul.
          */
          function hexToRgb(hex) {
            hex = hex.replace('#', '');

            return {
              r: parseInt(
                hex.substring(0, 2),
                16
              ),

              g: parseInt(
                hex.substring(2, 4),
                16
              ),

              b: parseInt(
                hex.substring(4, 6),
                16
              ),
            };
          }

          /*
            Comprueba si un pixel pertenece
            a una linea negra del dibujo.
          */
          function esLineaNegra(data, index) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            return (
              r < 80 &&
              g < 80 &&
              b < 80
            );
          }

          /*
            Comprueba si el color de un pixel
            es parecido al color inicial de la zona.
          */
          function colorParecido(
            data,
            index,
            target,
            tolerancia
          ) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            // Ignora pixeles transparentes
            if (a < 20) {
              return false;
            }

            const diferencia =
              Math.abs(r - target.r) +
              Math.abs(g - target.g) +
              Math.abs(b - target.b);

            return diferencia < tolerancia;
          }

          /*
            Rellena una zona completa utilizando
            el algoritmo de llenado por expansion.
          */
          function rellenar(x, y) {
            // Convierte las coordenadas en numeros enteros
            x = Math.floor(x);
            y = Math.floor(y);

            // Evita trabajar fuera del Canvas
            if (
              x < 0 ||
              y < 0 ||
              x >= canvas.width ||
              y >= canvas.height
            ) {
              return;
            }

            // Obtiene todos los pixeles del Canvas
            const imageData =
              ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              );

            const data = imageData.data;

            // Calcula la posicion del pixel seleccionado
            const inicio =
              (
                y * canvas.width +
                x
              ) * 4;

            // Impide colorear una linea negra
            if (esLineaNegra(data, inicio)) {
              return;
            }

            // Guarda el color original del pixel tocado
            const target = {
              r: data[inicio],
              g: data[inicio + 1],
              b: data[inicio + 2],
            };

            // Convierte el color seleccionado a RGB
            const nuevoColor =
              hexToRgb(window.colorActual);

            /*
              Comprueba si la zona ya tiene
              aproximadamente el mismo color.
            */
            const yaTieneColor =
              Math.abs(
                target.r -
                nuevoColor.r
              ) +
              Math.abs(
                target.g -
                nuevoColor.g
              ) +
              Math.abs(
                target.b -
                nuevoColor.b
              );

            if (yaTieneColor < 20) {
              return;
            }

            /*
              La pila contiene los pixeles pendientes
              por revisar.
            */
            const pila = [[x, y]];

            /*
              Este arreglo evita visitar el mismo pixel
              varias veces.
            */
            const visitados =
              new Uint8Array(
                canvas.width *
                canvas.height
              );

            const tolerancia = 90;

            // Recorre todos los pixeles conectados
            while (pila.length > 0) {
              const punto = pila.pop();

              const px = punto[0];
              const py = punto[1];

              // Ignora posiciones fuera del Canvas
              if (
                px < 0 ||
                py < 0 ||
                px >= canvas.width ||
                py >= canvas.height
              ) {
                continue;
              }

              const posicion =
                py * canvas.width + px;

              // Ignora pixeles ya visitados
              if (visitados[posicion]) {
                continue;
              }

              visitados[posicion] = 1;

              const index = posicion * 4;

              // Evita atravesar las lineas negras
              if (esLineaNegra(data, index)) {
                continue;
              }

              /*
                Solo pinta pixeles con un color parecido
                al color original de la zona.
              */
              if (
                !colorParecido(
                  data,
                  index,
                  target,
                  tolerancia
                )
              ) {
                continue;
              }

              // Aplica el nuevo color al pixel
              data[index] = nuevoColor.r;
              data[index + 1] = nuevoColor.g;
              data[index + 2] = nuevoColor.b;
              data[index + 3] = 255;

              /*
                Agrega los cuatro pixeles vecinos
                para continuar el relleno.
              */
              pila.push([px + 1, py]);
              pila.push([px - 1, py]);
              pila.push([px, py + 1]);
              pila.push([px, py - 1]);
            }

            // Actualiza el Canvas con los nuevos colores
            ctx.putImageData(
              imageData,
              0,
              0
            );
          }

          /*
            Convierte la posicion del toque en pantalla
            a coordenadas internas del Canvas.
          */
          function obtenerPosicion(evento) {
            const rect =
              canvas.getBoundingClientRect();

            let clientX;
            let clientY;

            /*
              Obtiene las coordenadas segun sea
              un toque o un clic.
            */
            if (
              evento.touches &&
              evento.touches.length > 0
            ) {
              clientX =
                evento.touches[0].clientX;

              clientY =
                evento.touches[0].clientY;
            } else {
              clientX = evento.clientX;
              clientY = evento.clientY;
            }

            /*
              Ajusta las coordenadas al tamaño real
              del Canvas.
            */
            const x =
              (
                clientX -
                rect.left
              ) *
              (
                canvas.width /
                rect.width
              );

            const y =
              (
                clientY -
                rect.top
              ) *
              (
                canvas.height /
                rect.height
              );

            return {
              x,
              y,
            };
          }

          /*
            Permite colorear mediante un clic
            cuando se utiliza mouse.
          */
          canvas.addEventListener(
            'click',
            function(evento) {
              const posicion =
                obtenerPosicion(evento);

              rellenar(
                posicion.x,
                posicion.y
              );
            }
          );

          /*
            Permite colorear tocando la pantalla
            desde un dispositivo movil.
          */
          canvas.addEventListener(
            'touchstart',
            function(evento) {
              evento.preventDefault();

              const posicion =
                obtenerPosicion(evento);

              rellenar(
                posicion.x,
                posicion.y
              );
            },
            {
              passive: false,
            }
          );
        </script>
      </body>
      </html>
    `;
  }

  /*
    Muestra el menu con todos los animales
    cuando el modo actual es menu.
  */
  if (modo === 'menu') {
    return (
      <ImageBackground
        source={require('../assets/fondoColorear.png')}
        style={styles.fondo}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.menuContainer}
        >
          <Text style={styles.titulo}>
            Colorear
          </Text>

          {/* Muestra el indicador mientras se carga una imagen */}
          {cargando && (
            <ActivityIndicator
              size="large"
              color="#6bb6e8"
            />
          )}

          {/* Lista de animales disponibles */}
          <View style={styles.grid}>
            {dibujos.map((dibujo) => (
              <TouchableOpacity
                key={dibujo.id}
                style={styles.cardAnimal}
                onPress={() => abrirDibujo(dibujo)}
                activeOpacity={0.8}
              >
                <Image
                  source={dibujo.imagen}
                  style={styles.imagenMiniatura}
                  resizeMode="contain"
                />

                <Text style={styles.nombreAnimal}>
                  {dibujo.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  // Muestra el editor cuando el usuario selecciona un animal
  return (
    <ImageBackground
      source={require('../assets/fondoColorear.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.editorContainer}
      >
        {/* Encabezado del editor */}
        <View style={styles.encabezado}>
          <TouchableOpacity
            style={styles.botonCircular}
            onPress={volverAlMenu}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          <Text style={styles.tituloEditor}>
            {dibujoActual?.nombre}
          </Text>

          <View style={{ width: 44 }} />
        </View>

        {/* Paleta de colores */}
        <View style={styles.paleta}>
          {colores.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.color,
                {
                  backgroundColor: color,
                },
                colorActual === color &&
                  styles.colorSeleccionado,
              ]}
              onPress={() => cambiarColor(color)}
            />
          ))}
        </View>

        {/* Contenedor del Canvas dentro del WebView */}
        <View style={styles.canvasContainer}>
          {webSource && (
            <WebView
              ref={webRef}
              originWhitelist={['*']}
              source={webSource}
              style={styles.webview}
              javaScriptEnabled
              scrollEnabled={false}
              onMessage={manejarMensaje}
            />
          )}
        </View>

        {/* Boton para borrar los colores del dibujo */}
        <TouchableOpacity
          style={styles.botonReiniciarGrande}
          onPress={reiniciarDibujo}
        >
          <Ionicons
            name="refresh"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },

  menuContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 35,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6bb6e8',
    marginBottom: 25,
  },

  grid: {
    width: '92%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  cardAnimal: {
    width: '47%',
    height: 190,
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#555',
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    overflow: 'hidden',
  },

  imagenMiniatura: {
    width: '98%',
    height: 145,
  },

  nombreAnimal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  editorContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 36,
    paddingBottom: 35,
  },

  encabezado: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  botonCircular: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  tituloEditor: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6bb6e8',
  },

  paleta: {
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },

  color: {
    width: 42,
    height: 42,
    borderRadius: 21,
    margin: 7,
    borderWidth: 2,
    borderColor: '#333',
  },

  colorSeleccionado: {
    borderWidth: 5,
    borderColor: 'white',
    elevation: 4,
  },

  canvasContainer: {
    width: 355,
    height: 455,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    marginBottom: 22,
  },

  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  botonReiniciarGrande: {
    backgroundColor: '#d32f2f',
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
  },
});
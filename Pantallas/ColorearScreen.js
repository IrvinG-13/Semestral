import { useMemo, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

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
  const webRef = useRef(null);

  const [modo, setModo] = useState('menu');
  const [colorActual, setColorActual] = useState('#ff0000');
  const [htmlCanvas, setHtmlCanvas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [dibujoActual, setDibujoActual] = useState(null);
  const [dibujosGuardados, setDibujosGuardados] = useState({});

  const webSource = useMemo(() => {
    if (!htmlCanvas) return null;
    return { html: htmlCanvas };
  }, [htmlCanvas]);

  async function abrirDibujo(dibujo) {
    try {
      setCargando(true);
      setDibujoActual(dibujo);

      const asset = Asset.fromModule(dibujo.imagen);
      await asset.downloadAsync();

      const uri = asset.localUri || asset.uri;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      const imagenBase64 = `data:image/png;base64,${base64}`;
      const imagenGuardada = dibujosGuardados[dibujo.id] || null;

      setHtmlCanvas(crearHtml(imagenBase64, colorActual, imagenGuardada));
      setModo('pintar');
    } catch (error) {
      console.log('Error cargando imagen:', error);
    } finally {
      setCargando(false);
    }
  }

  function volverAlMenu() {
    if (webRef.current && dibujoActual) {
      webRef.current.injectJavaScript(`
        guardarYVolver('${dibujoActual.id}');
        true;
      `);
    } else {
      setModo('menu');
      setHtmlCanvas(null);
      setDibujoActual(null);
    }
  }

  function manejarMensaje(event) {
    try {
      const datos = JSON.parse(event.nativeEvent.data);

      if (datos.tipo === 'guardarVolver') {
        setDibujosGuardados((estadoActual) => ({
          ...estadoActual,
          [datos.id]: datos.imagen,
        }));

        setModo('menu');
        setHtmlCanvas(null);
        setDibujoActual(null);
      }
    } catch (error) {
      console.log('Error recibiendo mensaje:', error);
    }
  }

  function cambiarColor(color) {
    setColorActual(color);

    if (webRef.current) {
      webRef.current.injectJavaScript(`
        window.colorActual = '${color}';
        true;
      `);
    }
  }

  function reiniciarDibujo() {
    if (webRef.current) {
      webRef.current.injectJavaScript(`
        reiniciar();
        true;
      `);
    }
  }

  function crearHtml(imagenBase64, colorInicial, imagenGuardada) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
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
        <canvas id="canvas" width="900" height="900"></canvas>

        <script>
          const canvas = document.getElementById('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          let imagenOriginal = new Image();
          let imagenGuardadaSrc = ${JSON.stringify(imagenGuardada)};

          window.colorActual = '${colorInicial}';

          imagenOriginal.onload = function() {
            if (imagenGuardadaSrc) {
              const imagenGuardadaCanvas = new Image();

              imagenGuardadaCanvas.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imagenGuardadaCanvas, 0, 0, canvas.width, canvas.height);
              };

              imagenGuardadaCanvas.src = imagenGuardadaSrc;
            } else {
              dibujarImagenOriginal();
            }
          };

          imagenOriginal.src = '${imagenBase64}';

          function dibujarImagenOriginal() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const margen = 5;

            const escala = Math.min(
              (canvas.width - margen * 2) / imagenOriginal.width,
              (canvas.height - margen * 2) / imagenOriginal.height
            );

            const imgW = imagenOriginal.width * escala;
            const imgH = imagenOriginal.height * escala;
            const imgX = (canvas.width - imgW) / 2;
            const imgY = (canvas.height - imgH) / 2;

            ctx.drawImage(imagenOriginal, imgX, imgY, imgW, imgH);
          }

          function reiniciar() {
            imagenGuardadaSrc = null;
            dibujarImagenOriginal();
          }

          window.reiniciar = reiniciar;

          function guardarYVolver(id) {
            const imagenActual = canvas.toDataURL('image/png');

            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                tipo: 'guardarVolver',
                id: id,
                imagen: imagenActual,
              })
            );
          }

          window.guardarYVolver = guardarYVolver;

          function hexToRgb(hex) {
            hex = hex.replace('#', '');

            return {
              r: parseInt(hex.substring(0, 2), 16),
              g: parseInt(hex.substring(2, 4), 16),
              b: parseInt(hex.substring(4, 6), 16),
            };
          }

          function esLineaNegra(data, index) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            return r < 80 && g < 80 && b < 80;
          }

          function colorParecido(data, index, target, tolerancia) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            if (a < 20) return false;

            const diferencia =
              Math.abs(r - target.r) +
              Math.abs(g - target.g) +
              Math.abs(b - target.b);

            return diferencia < tolerancia;
          }

          function rellenar(x, y) {
            x = Math.floor(x);
            y = Math.floor(y);

            if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
              return;
            }

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const inicio = (y * canvas.width + x) * 4;

            if (esLineaNegra(data, inicio)) {
              return;
            }

            const target = {
              r: data[inicio],
              g: data[inicio + 1],
              b: data[inicio + 2],
            };

            const nuevoColor = hexToRgb(window.colorActual);

            const yaTieneColor =
              Math.abs(target.r - nuevoColor.r) +
              Math.abs(target.g - nuevoColor.g) +
              Math.abs(target.b - nuevoColor.b);

            if (yaTieneColor < 20) {
              return;
            }

            const pila = [[x, y]];
            const visitados = new Uint8Array(canvas.width * canvas.height);
            const tolerancia = 90;

            while (pila.length > 0) {
              const punto = pila.pop();
              const px = punto[0];
              const py = punto[1];

              if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) {
                continue;
              }

              const posicion = py * canvas.width + px;

              if (visitados[posicion]) {
                continue;
              }

              visitados[posicion] = 1;

              const index = posicion * 4;

              if (esLineaNegra(data, index)) {
                continue;
              }

              if (!colorParecido(data, index, target, tolerancia)) {
                continue;
              }

              data[index] = nuevoColor.r;
              data[index + 1] = nuevoColor.g;
              data[index + 2] = nuevoColor.b;
              data[index + 3] = 255;

              pila.push([px + 1, py]);
              pila.push([px - 1, py]);
              pila.push([px, py + 1]);
              pila.push([px, py - 1]);
            }

            ctx.putImageData(imageData, 0, 0);
          }

          function obtenerPosicion(evento) {
            const rect = canvas.getBoundingClientRect();

            let clientX;
            let clientY;

            if (evento.touches && evento.touches.length > 0) {
              clientX = evento.touches[0].clientX;
              clientY = evento.touches[0].clientY;
            } else {
              clientX = evento.clientX;
              clientY = evento.clientY;
            }

            const x = (clientX - rect.left) * (canvas.width / rect.width);
            const y = (clientY - rect.top) * (canvas.height / rect.height);

            return { x, y };
          }

          canvas.addEventListener('click', function(evento) {
            const posicion = obtenerPosicion(evento);
            rellenar(posicion.x, posicion.y);
          });

          canvas.addEventListener('touchstart', function(evento) {
            evento.preventDefault();
            const posicion = obtenerPosicion(evento);
            rellenar(posicion.x, posicion.y);
          }, { passive: false });
        </script>
      </body>
      </html>
    `;
  }

  if (modo === 'menu') {
    return (
      <ImageBackground
        source={require('../assets/fondoColorear.png')}
        style={styles.fondo}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.menuContainer}>
          <Text style={styles.titulo}>Colorear</Text>

          {cargando && <ActivityIndicator size="large" color="#6bb6e8" />}

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

                <Text style={styles.nombreAnimal}>{dibujo.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/fondoColorear.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.editorContainer}>
        <View style={styles.encabezado}>
          <TouchableOpacity style={styles.botonCircular} onPress={volverAlMenu}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.tituloEditor}>
            {dibujoActual?.nombre}
          </Text>

          <View style={{ width: 44 }} />
        </View>

        <View style={styles.paleta}>
          {colores.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.color,
                { backgroundColor: color },
                colorActual === color && styles.colorSeleccionado,
              ]}
              onPress={() => cambiarColor(color)}
            />
          ))}
        </View>

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

        <TouchableOpacity
          style={styles.botonReiniciarGrande}
          onPress={reiniciarDibujo}
        >
          <Ionicons name="refresh" size={30} color="white" />
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
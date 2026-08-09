# Modelo 3D coche — visor conducible (folio-2025)

Visor 3D web de un 4×4 de juguete conducible. Carga los **modelos reales del
proyecto folio-2025 de Bruno Simon** (licencia MIT) y les conecta física real
(Rapier), sonido, pinturas y un menú de juego. Órbita, condúcelo por un
circuito con rampas y objetos, y expórtalo a **GLB** u **OBJ+MTL** desde la
barra del visor.

## Cómo levantarlo

El proyecto es HTML + JavaScript puro: **no hay build, ni npm, ni backend**.
Solo necesita servirse por HTTP (los módulos ES y los `.glb`/`.wasm` no cargan
abriendo el archivo con `file://`).

Desde la carpeta del proyecto, con cualquiera de estas opciones:

```bash
# Python 3 (suele venir preinstalado)
python3 -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8000
```

Luego abre **http://localhost:8000/Coche-Toy-3D.html** en un navegador con
WebGL (Chrome, Edge, Firefox o Safari recientes).

> Requiere conexión a internet la primera vez: three.js y Rapier se cargan por
> CDN. El resto (modelos, sonidos, decodificador Draco) es local.

## Controles

| Tecla | Acción |
|---|---|
| Botón **Conducir** | entra/sale del modo conducción |
| `↑ ↓ ← →` | acelerar / frenar / girar |
| `Espacio` | salto y enderezar |
| `Shift` | boost |
| `X` | freno de mano (derrape) |
| `H` | bocina |
| `Esc` | salir de conducción |
| arrastrar / rueda | orbitar / zoom (modo inspección) |

El **Menú** (botón arriba a la izquierda) reúne: vehículo (de serie / old
school), 14 pinturas, encuadres (iso, frontal, trasera, cenital) y revisión
(malla, fondo oscuro, sonido).

## Estructura

```
Coche-Toy-3D.html      — página del visor (cabecera, menú, ficha, controles)
coche-toy-model.js     — todo el modelo: carga de GLB, física Rapier, sonido,
                         pinturas, mundo (rampas, objetos, faroles) y cámara
three-d-stage.js       — componente <three-d-stage>: render, luces, órbita,
                         sombra y exportador GLB/OBJ (no editar)
HANDOFF.md             — documentación técnica: jerarquía de piezas,
                         constantes de física portadas del juego, materiales
assets/
  vehiculo/            — default.glb, defaultAntenna.glb, oldSchool.glb
  objetos/             — explosiveCrates, benches, lanterns, bricks (.glb)
  draco/               — decodificador Draco (los GLB van comprimidos)
  sonido/              — motor, rodadura, boost, bocina, golpes, checkpoint…
_ds/                   — Documa Design System (tokens de color y tipografía)
uploads/               — proyecto original folio-2025 (fuente, licencia MIT)
```

## Exportar el modelo

En modo inspección, la barra inferior del visor descarga el coche como
**GLB** (jerarquía + materiales, abre directo en Blender) o **OBJ + MTL**.
Los pivotes de ruedas y antena van nombrados y listos para animar; el detalle
de qué pivote hace qué está en `HANDOFF.md`.

## Créditos y licencia

Los modelos 3D, sonidos y el decodificador Draco proceden del proyecto
**folio-2025 de Bruno Simon**, bajo licencia **MIT** (texto completo en
`uploads/license.md`). El código del visor (física, sonido, mundo, interfaz)
es propio de este proyecto. Estilo visual: **Documa Design System**.
"# Modelo-3D-coche-Blender" 

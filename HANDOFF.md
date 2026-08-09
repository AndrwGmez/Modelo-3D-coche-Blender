# Handoff — Vehículo folio-2025 en visor conducible

El visor (`Coche-Toy-3D.html` + `coche-toy-model.js`) carga los **modelos
reales del proyecto folio-2025 de Bruno Simon** (licencia MIT, incluida en
`uploads/license.md`) subido por el usuario, y les conecta una simulación de
conducción propia. Ya no hay geometría procedural del coche: la fuente de
verdad es el GLB.

## Fuente

| | |
|---|---|
| Coche | `assets/vehiculo/default.glb` (copiado de `uploads/static/vehicle/`) |
| Antena | injertada de `assets/vehiculo/defaultAntenna.glb` |
| Paleta | embebida en el GLB (`palette.png` también copiada de referencia) |
| Draco | los GLB van comprimidos; decodificador en `assets/draco/` (del propio proyecto) |
| Blender | fuente original en `uploads/resources/folio-2025.blend` |

Los `-compressed.glb` del proyecto usan texturas KTX2/ETC1S — necesitarían
`KTX2Loader`; se usan los originales sin comprimir.

## Cómo está montado

El GLB está autorado con **+X como frente**; la simulación asume **+Z**. Cada
pieza del modelo va dentro de un envoltorio girado −90° en Y y escalado
**×1.6** (para conservar el mundo, la cámara y las velocidades ya calibradas).

```
coche_folio2025 (rotation.order YXZ: rumbo, luego pendiente de rampa)
├── cuerpo                      ← balanceo/cabeceo/hundimiento (resortes)
│   └── modelo_cuerpo (ry −90°, ×1.6)
│       └── escena de default.glb
│           ├── chassis001
│           │   └── wheelContainer × 4   ← clones, EXACTO a setWheels():
│           │       ·  i0/i2 con rotation.y = π (lado espejado)
│           │       ·  DIRECCIÓN = rotation.y del contenedor (π + giro / giro)
│           │       ·  TRACCIÓN = wheelCylinder.rotation.z (+ un lado, − el otro)
│           │       ·  y = −(0.91 − radio medido) para apoyar en el suelo
│           └── antena_mastil (varillas finas + antena_ref)
└── (a nivel de escena) antena_cabeza — no se exporta, como en el juego
```

Valores del juego portados tal cual: amplitud de dirección **0.5 rad** con
easing **×16** (`steeringAmplitude`, VisualVehicle), giro de rueda con signo
por lado y **congelado con el freno de mano solo**, luces de freno
(`stopLights` + `backLights` en naranja), **marcha atrás en blanco** (emisivo
2.2), **intermitentes a 0.8 s** mientras giras, y **boost (Shift)** que
multiplica el empuje y hunde las celdas `cell1/3/2` en secuencia con easing
`1−(1−x)^7`, como setBoostAnimation().

### Antena (portada de VisualVehicle.setAntenna / update)

No es un látigo: el mástil (`antenna` completo — los cubos helper del juego se
descartan por su tamaño REAL en mundo, gordos en ambos ejes horizontales; las
varillas, casquillos y base entran con su transformada exacta, y la cabeza se
posa sobre la varilla más alta) **rota
en Y para apuntar a un objetivo**; conduciendo, el objetivo es un punto 35 m
por delante del coche (el mismo truco que usa BlackFriday.js cuando no hay
fragmento que perseguir). El cabezal (`antennaHead`) cuelga de `antennaHeadReference` **dentro del mástil**: cada cuadro se coloca en `antennaHeadReference`, hace `lookAt` al
objetivo y su eje (`axle`) gira sin parar con `remapClamp(dist, 50, 5, 1, 10)`
— más rápido cuanto más cerca. En el visor gira también en inspección y el
mástil rastrea un objetivo orbitando en el modo Movimiento. Al colgar del mástil hereda posición, inclinación y escala por construcción
(cero deriva) y **sí sale en el GLB exportado**.

### Materiales

Los del GLB tal cual (`palette` con la textura embebida, `darkGray`,
emisivos de luces). A los materiales `emissive*` se les sube
`emissiveIntensity` a 1.6 para que las luces se lean como en los renders de
`uploads/resources/renders/`. El selector de pintura se retiró: el color lo
trae la paleta original del proyecto. `MATS` (Set) alimenta el toggle de malla.

## Física — Rapier de verdad (el motor del juego)

La conducción ya NO es una simulación a mano: es **Rapier**
(`@dimforge/rapier3d-compat` por CDN, con dos CDN de reserva), el mismo motor
que usa el folio. Es el esquema **raycast-vehicle** de los motores grandes: un
rayo de suspensión por rueda, nada de "altura del terreno" muestreada.

Portado de `Physics.js` / `PhysicsVehicle.js` valor a valor:

| Parámetro | Valor del juego |
|---|---|
| Gravedad | (0, −9.81, 0) |
| Chasis | cuboid 2.6×0.8×1.7 masa 2.5 (lastre a y −0.55 = centerOfMass bajo) + techo + defensa |
| Ruedas | conexión (±0.90, 0, ±0.75), dir (0,−1,0), eje (0,0,1) |
| Suspensión | rest 0.88, stiffness 20, compression 10, relaxation 2.7, maxForce 150 |
| Agarre | frictionSlip 0.9, sideFrictionStiffness 3 |
| Motor | 300 × (1 + boost×2) / (1 + exceso sobre topSpeed 5→40) |
| Frenos | idle 0.06, reversa 0.4, ×35 (brakeAmplitude) |
| Dirección | ±0.5 rad en ruedas 0-1, easing ×16 |
| Salto (espacio) | flip.jump: impulso 5×masa + par corrector si está volcado |
| Freno de mano (X) | agarre trasero interpolado 0.9→0.28 y rigidez lateral 3→0.45 |
| Estabilizador de vuelo | par PD (kP 0.85·masa, kD 0.28·masa) sobre el error de inclinación mientras no hay rueda en contacto |
| Objetos golpeables | densidad 0.14, restitución 0.35, damping 0.15/0.22 — salen despedidos |
| Impacto | caída de rapidez > 2.2 m/s en un cuadro → picado del morro, polvo y golpe de pistón |
| Paso | updateVehicle(1/60) → world.step(), subpasos fijos |

- **Escala**: la física corre en la escala del modelo (la del GLB y la del
  juego); lo visual va ×1.6. Traslaciones ×1.6 al pintar, colliders ÷1.6.
- **Mundo físico**: suelo, 4 muros, las 4 rampas como cuñas convexas idénticas
  a las mallas, faroles como cilindros fijos, y cajas/bancos/ladrillos como
  **cuerpos dinámicos** (caen, ruedan, se apilan; sus mallas espejan el cuerpo).
- **Cero visual autocalibrado**: parado y con las 4 ruedas en contacto, la
  altura del cuerpo y la carrera media de suspensión definen el reposo.
- **Ruedas visuales**: carrera real (`wheelSuspensionLength`) sobre la cota
  autorada; el pistón escala con la carrera; volcado 2.5 s → voltereta sola.
- **Sombra**: sol alto (5.4, 7.0, 3.8), mapa 2048, encuadre ±7.5 m que viaja
  con el coche, normalBias 0.035; toda malla del coche proyecta y recibe.
- Presentación por cuadro (`presenta()`): rastro, polvo, estelas, cámara,
  luz, sonido — sin cambios.

## Pendiente

- Clips de animación horneados en el GLB exportado (los pivotes ya están).
- Collider simplificado (caja 4.2 × 2.2 × 2.1 + 4 cilindros r≈0.69).
- `oldSchool.glb` como variante seleccionable.

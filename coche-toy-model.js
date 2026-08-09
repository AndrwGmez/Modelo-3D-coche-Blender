// Coche del portafolio conducible.
// Lenguaje de la referencia: volumenes planos de aristas apenas redondeadas,
// escala de juguete de radiocontrol, camara elevada. Nada de micro-detalle:
// cada pieza tiene que leerse desde arriba y a distancia.
// Unidades: metros, y-up, base sobre y = 0.
import * as THREE from 'three';

const stage = document.querySelector('three-d-stage');
await stage.ready;

/* ==========================================================================
   VEHICULO REAL — folio-2025 (MIT, Bruno Simon), subido por el usuario.
   Se carga default.glb (carroceria, jaula, celdas de energia, luces y UNA
   rueda de muestra que se clona a las cuatro esquinas) y se injerta la antena
   de defaultAntenna.glb repivotada en cadena para el latigazo.
   El modelo esta autorado con +X como frente; se envuelve en un grupo girado
   -90 en Y para que el frente sea +Z, que es lo que asume la simulacion.
   ========================================================================== */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// (se conserva: lo usan los obstaculos del mundo)
function bevelBox(w, h, d, r, seg) {
  const iw = w - 2 * r, ih = h - 2 * r, dep = d - 2 * r;
  const rc = Math.min(r * 2.2, iw / 2, ih / 2);
  const s = new THREE.Shape();
  const x = -iw / 2, y = -ih / 2;
  s.moveTo(x + rc, y);
  s.lineTo(x + iw - rc, y);
  s.quadraticCurveTo(x + iw, y, x + iw, y + rc);
  s.lineTo(x + iw, y + ih - rc);
  s.quadraticCurveTo(x + iw, y + ih, x + iw - rc, y + ih);
  s.lineTo(x + rc, y + ih);
  s.quadraticCurveTo(x, y + ih, x, y + ih - rc);
  s.lineTo(x, y + rc);
  s.quadraticCurveTo(x, y, x + rc, y);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: dep, curveSegments: seg, steps: 1,
    bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: seg,
  });
  g.translate(0, 0, -dep / 2);
  g.computeVertexNormals();
  return g;
}

/* ---------- medidas: del propio GLB (contenedor de rueda en 0.87,-0.42,-0.7
   respecto al chasis en y 0.91), escalado x1.6 para conservar el mundo ---------- */
const ESCALA = 1.6;
let R = 0.49 * ESCALA;            // radio de rueda en mundo; se remide del mesh real tras cargar
const EJE_X = 0.70 * ESCALA;      // semivia
const EJE_Z = 0.87 * ESCALA;      // semidistancia entre ejes

const _gltf = new GLTFLoader();
// los GLB del folio van comprimidos con Draco; el decodificador viene con el
// propio proyecto (static/draco/gltf), copiado a assets/draco
const _draco = new DRACOLoader();
_draco.setDecoderPath('assets/draco/');
_gltf.setDRACOLoader(_draco);
const [gCoche, gAntena, gCajas, gBancos, gFaroles, gLadrillos, gViejo] = await Promise.all([
  _gltf.loadAsync('assets/vehiculo/default.glb'),
  _gltf.loadAsync('assets/vehiculo/defaultAntenna.glb'),
  _gltf.loadAsync('assets/objetos/explosiveCrates.glb'),
  _gltf.loadAsync('assets/objetos/benches.glb'),
  _gltf.loadAsync('assets/objetos/lanterns.glb'),
  _gltf.loadAsync('assets/objetos/bricks.glb'),
  _gltf.loadAsync('assets/vehiculo/oldSchool.glb'),
]);

const raiz = gCoche.scene;
raiz.updateMatrixWorld(true);

// separa el conjunto de rueda (GLTFLoader sanea 'wheelContainer.001' a
// 'wheelContainer001', asi que se busca por prefijo)
let contenedorRueda = null;
raiz.traverse((o) => { if (!contenedorRueda && /^wheelContainer/.test(o.name)) contenedorRueda = o; });
if (contenedorRueda) {
  contenedorRueda.removeFromParent();
  // radio REAL de la rueda autorada: el pivote debe quedar a esa altura o el
  // coche flota (el contenedor esta autorado con la suspension comprimida)
  let cil = null;
  contenedorRueda.traverse((o) => { if (!cil && /^wheelCylinder/.test(o.name)) cil = o; });
  if (cil) {
    const bb = new THREE.Box3().setFromObject(cil);
    R = ((bb.max.y - bb.min.y) / 2) * ESCALA;
  }
}

function envuelto(nodo) {
  // pasa una pieza del marco del modelo (+X frente) al de la simulacion (+Z)
  const g = new THREE.Group();
  g.rotation.y = -Math.PI / 2;
  g.scale.setScalar(ESCALA);
  if (nodo) g.add(nodo);
  return g;
}

/* ---------- ensamblaje ---------- */
const coche = new THREE.Group();
coche.name = 'coche_folio2025';
coche.rotation.order = 'YXZ';   // rumbo primero, inclinacion de rampa despues

const cuerpo = new THREE.Group();
cuerpo.name = 'cuerpo';
const modeloCuerpo = envuelto(raiz);
modeloCuerpo.name = 'modelo_cuerpo';
cuerpo.add(modeloCuerpo);
coche.add(cuerpo);

/* ---------- ruedas: EXACTO al juego (VisualVehicle.setWheels) ----------
   4 clones de wheelContainer colgados del CHASIS del modelo; los indices 0 y 2
   van girados PI en Y (lado espejado). Solo wheelCylinder* rueda
   (rotation.z, signo por lado); la direccion es rotation.y del contenedor
   entero (PI + giro en el lado espejado, easing *16, amplitud 0.5). La altura
   se deriva del radio medido para que el neumatico apoye en el suelo. */
const chasisNodo = (() => { let c = null; raiz.traverse((o) => { if (!c && /^chassis/.test(o.name)) c = o; }); return c || raiz; })();
const Y_RUEDA = -(0.91 - R / ESCALA);
const ruedas = [];
if (contenedorRueda) {
  const puestos = [
    { x: 0.87, z: 0.698, flip: true, front: true },
    { x: 0.87, z: -0.698, flip: false, front: true },
    { x: -0.87, z: 0.698, flip: true, front: false },
    { x: -0.87, z: -0.698, flip: false, front: false },
  ];
  for (const p of puestos) {
    const cont = contenedorRueda.clone(true);
    cont.position.set(p.x, Y_RUEDA, p.z);
    cont.rotation.set(0, p.flip ? Math.PI : 0, 0);
    let cilindro = null, suspension = null;
    cont.traverse((o) => {
      if (!cilindro && /^wheelCylinder/.test(o.name)) cilindro = o;
      if (!suspension && /^wheelSuspension/.test(o.name)) suspension = o;
    });
    if (cilindro) cilindro.position.set(0, 0, 0);                 // como el juego
    if (suspension) suspension.scale.y = Math.max(0.05, Math.abs(Y_RUEDA) - 0.42);
    chasisNodo.add(cont);
    ruedas.push({ container: cont, cylinder: cilindro, suspension, flip: p.flip, front: p.front, baseY: p.flip ? Math.PI : 0 });
  }
}

/* piezas con comportamiento propio, como setParts() del juego */
const P = {};
{
  const buscas = [['stop', /^stopLights/], ['back', /^backLights/], ['blinkL', /^blinkerLeft/], ['blinkR', /^blinkerRight/], ['cell1', /^cell1/], ['cell2', /^cell2/], ['cell3', /^cell3/]];
  raiz.traverse((o) => { for (const [k, rx] of buscas) if (!P[k] && rx.test(o.name)) P[k] = o; });
  for (const k of ['stop', 'back', 'blinkL', 'blinkR']) if (P[k]) P[k].visible = false;
}
const matTraseraFreno = P.back ? P.back.material : null;   // naranja original del GLB
const matTraseraBlanca = new THREE.MeshStandardMaterial({ name: 'luz_marcha_atras', color: '#FFFFFF', emissive: '#FFFFFF', emissiveIntensity: 2.2, roughness: 0.4 });

/* ---------- antena: EXACTA al juego (VisualVehicle.setAntenna) ----------
   El mastil ('antenna'; sus cubos gigantes son helpers no visibles y se
   filtran por grosor) ROTA EN Y PARA APUNTAR a un objetivo. El cabezal
   ('antennaHead') vive a nivel de escena: cada cuadro se coloca en
   'antennaHeadReference', mira al objetivo, y su eje (children[0], 'axle')
   gira sin parar — mas rapido cuanto mas cerca esta el objetivo. */
let mastil = null, cabezaAntena = null, ejeCabeza = null, refCabeza = null;
(function injertaAntena() {
  const src = gAntena.scene;
  src.updateMatrixWorld(true);
  const nodo = src.getObjectByName('antenna');
  if (!nodo) return;
  const B = new THREE.Vector3().setFromMatrixPosition(nodo.matrixWorld);
  const invB = new THREE.Matrix4().makeTranslation(-B.x, -B.y, -B.z);
  mastil = new THREE.Group();
  mastil.name = 'antena_mastil';
  mastil.position.copy(B);
  const _wb = new THREE.Box3(), _ws = new THREE.Vector3();
  nodo.traverse((o) => {
    if (!o.isMesh) return;
    _wb.setFromObject(o);
    _wb.getSize(_ws);
    // helpers del juego = cubos gordos en AMBOS ejes horizontales; el resto
    // del mastil (varillas, casquillos, base) es fino en al menos uno
    if (_ws.x > 0.45 && _ws.z > 0.45) return;
    const c = o.clone();
    new THREE.Matrix4().multiplyMatrices(invB, o.matrixWorld).decompose(c.position, c.quaternion, c.scale);
    mastil.add(c);
  });
  refCabeza = new THREE.Object3D();
  refCabeza.name = 'antena_ref';
  const refSrc = nodo.getObjectByName('antennaHeadReference');
  if (refSrc) {
    const Pr = new THREE.Vector3();
    refSrc.getWorldPosition(Pr);
    refCabeza.position.copy(Pr).sub(B);
  } else {
    refCabeza.position.set(0, 1.35, 0);
  }
  const bbM = new THREE.Box3().setFromObject(mastil);
  if (isFinite(bbM.max.y)) refCabeza.position.y = Math.min(refCabeza.position.y, bbM.max.y - B.y - 0.015);
  mastil.add(refCabeza);
  raiz.add(mastil);
  const cabezaSrc = src.getObjectByName('antennaHead');
  if (cabezaSrc) {
    cabezaAntena = cabezaSrc.clone(true);
    cabezaAntena.name = 'antena_cabeza';
    // HIJA de la referencia del mastil, no suelta en escena: el juego la
    // recoloca a mano cada cuadro, pero cualquier desfase (calibracion del
    // cero, inclinacion del chasis) la dejaba flotando o clavada en la jaula.
    // Colgada aqui hereda posicion, giro y escala x1.6 por construccion, y de
    // regalo ahora SI sale en el GLB exportado.
    cabezaAntena.position.set(0, 0, 0);
    cabezaAntena.rotation.set(0, 0, 0);
    ejeCabeza = cabezaAntena.children[0] || null;
    refCabeza.add(cabezaAntena);
  }
})();

/* cristales del coche detallado: mismo chasis, coordenadas alineadas */
(function injertaCristales() {
  const g = gAntena.scene.getObjectByName('glass');
  if (!g) return;
  const c = g.clone(true);
  c.name = 'cristales';
  const matCristal = new THREE.MeshStandardMaterial({
    name: 'carGlass', color: '#10141C', roughness: 0.12, metalness: 0.3,
  });
  c.traverse((o) => { if (o.isMesh) o.material = matCristal; });
  raiz.add(c);
})();

const _apV = new THREE.Vector3(), _apT = new THREE.Vector3();
function remapClamp(v, inA, inB, outA, outB) {
  const t = Math.min(1, Math.max(0, (v - inA) / (inB - inA)));
  return outA + t * (outB - outA);
}
function apuntaAntena(dt, px, pz, rumbo, tx, tz) {
  if (mastil) mastil.rotation.y = Math.atan2(tx - px, tz - pz) - rumbo;
  if (!cabezaAntena) return;
  // lookAt en mundo funciona igual estando anidada; se apunta a la ALTURA del
  // propio cabezal para que el radar barra nivelado en vez de cabecear
  cabezaAntena.getWorldPosition(_apV);
  _apT.set(tx, _apV.y, tz);
  cabezaAntena.lookAt(_apT);
  if (ejeCabeza) ejeCabeza.rotation.z += dt * remapClamp(Math.hypot(tx - px, tz - pz), 50, 5, 1, 10);
}

let blinkT = 0;
function luces(dt, acel, frenando, s) {
  if (P.stop) P.stop.visible = !!frenando;
  if (P.back) {
    if (frenando) { P.back.visible = true; P.back.material = matTraseraFreno; }
    else if (acel < -0.05 || V.largo < -0.3) { P.back.visible = true; P.back.material = matTraseraBlanca; }
    else P.back.visible = false;
  }
  if (P.blinkL && P.blinkR) {
    if (Math.abs(s) > 0.2) {
      blinkT += dt;
      const on = Math.floor(blinkT / 0.8) % 2 === 0;   // cadencia 0.8 s del juego
      P.blinkL.visible = s > 0 && on;
      P.blinkR.visible = s < 0 && on;
    } else {
      blinkT = 0;
      P.blinkL.visible = false;
      P.blinkR.visible = false;
    }
  }
}
function celdasBoost() {
  // al usar el boost las celdas de energia se hunden en secuencia (juego: mix
  // 1.2/s con easing 1-(1-x)^7 y remaps 0-0.6 / 0.2-0.8 / 0.4-1)
  const e = 1 - Math.pow(1 - V.boost, 7);
  if (P.cell1) P.cell1.position.y = remapClamp(e, 0, 0.6, 0.2, 0);
  if (P.cell3) P.cell3.position.y = remapClamp(e, 0.2, 0.8, 0.2, 0);
  if (P.cell2) P.cell2.position.y = remapClamp(e, 0.4, 1, 0.2, 0);
}

/* ---------- materiales y sombras ---------- */
const MATS = new Set();
if (cabezaAntena) cabezaAntena.traverse((o) => { if (o.isMesh) { o.castShadow = true; if (o.material) MATS.add(o.material); } });
coche.traverse((o) => {
  if (!o.isMesh) return;
  o.castShadow = true;
  o.receiveShadow = true;
  if (o.material) {
    MATS.add(o.material);
    if (/emissive/i.test(o.material.name) && o.material.emissiveIntensity < 1.4) {
      o.material.emissiveIntensity = 1.6;   // que las luces se lean como en los renders
    }
  }
});

/* ---------- segundo vehiculo: oldSchool.glb ---------- */
const carroceriaViejo = (() => {
  const src = gViejo.scene;
  src.updateMatrixWorld(true);
  // fuera las ruedas del GLB: el rig de ruedas ya existe y es compartido
  const fuera = [];
  src.traverse((o) => { if (/^wheel/i.test(o.name)) fuera.push(o); });
  for (const o of fuera) o.removeFromParent();
  const g = envuelto(src);
  g.name = 'modelo_cuerpo_oldschool';
  g.visible = false;
  cuerpo.add(g);
  return g;
})();

/* ---------- pinturas del juego (setPaints) ----------
   rojo = materiales originales del GLB; el resto, degradados verticales con
   los MISMOS pares de color que createGradient() en VisualVehicle.js. Se
   aplican a bodyPainted y a los cuatro wheelPainted, como paints.changeTo(). */
function creaPintura(nombre, arriba, abajo) {
  const m = new THREE.MeshStandardMaterial({ name: nombre + 'Gradient', roughness: 0.52, metalness: 0.08 });
  const cA = new THREE.Color(arriba), cB = new THREE.Color(abajo);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uArr = { value: cA };
    sh.uniforms.uAba = { value: cB };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vGradY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGradY = position.y;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vGradY;\nuniform vec3 uArr;\nuniform vec3 uAba;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(uAba, uArr, clamp(vGradY / 1.4, 0.0, 1.0));');
  };
  m.customProgramCacheKey = () => 'grad_' + nombre;
  MATS.add(m);
  return m;
}
const pintables = [];
coche.traverse((o) => { if (o.isMesh && (/^bodyPainted/.test(o.name) || /^wheelPainted/.test(o.name))) pintables.push(o); });
const PINTURAS = {
  naranja: creaPintura('orange', '#ff940d', '#af0071'),      // pares originales del juego
  blanco: creaPintura('white', '#ffffff', '#b5b5b5'),
  negro: creaPintura('black', '#626262', '#262526'),
  // acabados extra con el mismo esquema (tono vivo arriba, hundido abajo)
  amarillo: creaPintura('yellow', '#ffd23d', '#e0700e'),
  arena: creaPintura('sand', '#e9c883', '#96662a'),
  verde: creaPintura('green', '#8fdd2b', '#1f7a35'),
  esmeralda: creaPintura('emerald', '#2fd6a3', '#0c5f57'),
  cian: creaPintura('cyan', '#3fd4ff', '#0c62c9'),
  azul: creaPintura('blue', '#4f8bff', '#24297d'),
  indigo: creaPintura('indigo', '#6d5cff', '#391e8f'),
  violeta: creaPintura('violet', '#b06bff', '#5c1e90'),
  magenta: creaPintura('magenta', '#ff4fd8', '#8f1268'),
  rosa: creaPintura('pink', '#ff7aa8', '#c22550'),
};
const pinturasOriginales = new Map();
for (const o of pintables) pinturasOriginales.set(o, o.material);

// PRECALENTADO de shaders: cada acabado compila su programa al usarse por
// primera vez (~centenas de ms) y eso era un tiron al cambiar de pintura en
// marcha. Se renderizan una vez en placas invisibles bajo el suelo y se
// retiran: el programa queda cacheado en el renderer.
stage.ready.then(() => {
  const g = new THREE.PlaneGeometry(0.01, 0.01);
  const horno = new THREE.Group();
  horno.name = 'horno_shaders';
  for (const m of Object.values(PINTURAS)) horno.add(new THREE.Mesh(g, m));
  horno.position.set(0, -60, 0);
  stage._scene.add(horno);
  let n = 0;
  const quita = () => { if (++n < 3) return requestAnimationFrame(quita); stage._scene.remove(horno); g.dispose(); };
  requestAnimationFrame(quita);
});

stage.setObject(coche);

/* ---------- look: entorno de estudio, luz rasante, sombra de contacto ---------- */
let luzSol = null;   // debe declararse antes de aplicarLook, que la asigna
const sombra = (() => {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const g = cv.getContext('2d');
  const rad = g.createRadialGradient(64, 64, 8, 64, 64, 62);
  rad.addColorStop(0, 'rgba(0,0,0,0.55)');
  rad.addColorStop(0.55, 'rgba(0,0,0,0.26)');
  rad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = rad;
  g.fillRect(0, 0, 128, 128);
  const plano = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 4.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })
  );
  plano.name = 'sombra_contacto';
  plano.rotation.x = -Math.PI / 2;
  plano.position.y = 0.005;
  plano.renderOrder = -1;
  stage._scene.add(plano);     // fuera del grupo exportado
  return plano;
})();

(function aplicarLook() {
  const renderer = stage._renderer, scene = stage._scene;
  if (!renderer || !scene) return;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const env = new THREE.Scene();
  const plano = (color, w, h, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.rotation.set(...rot);
    env.add(m);
  };
  env.add(new THREE.Mesh(new THREE.BoxGeometry(14, 9, 14), new THREE.MeshBasicMaterial({ color: '#8A9099', side: THREE.BackSide })));
  plano('#FFFFFF', 9, 9, [0, 4.3, 0], [Math.PI / 2, 0, 0]);
  plano('#2A2A2C', 14, 14, [0, -4.3, 0], [Math.PI / 2, 0, 0]);
  plano('#E6EAF2', 7, 6, [-6.7, 0.6, 0], [0, Math.PI / 2, 0]);
  plano('#6E747E', 7, 6, [6.7, 0.2, 0], [0, Math.PI / 2, 0]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(env, 0.02).texture;
  scene.environmentIntensity = 0.45;
  pmrem.dispose();

  scene.traverse((o) => {
    if (o.isHemisphereLight) {
      o.intensity = 0.55;
      o.color.set('#FFF1DC');
      o.groundColor.set('#6B5A48');
    } else if (o.isDirectionalLight) {
      if (o.castShadow) {
        o.intensity = 2.3;
        o.color.set('#FFE9C4');
        o.position.set(5.4, 7.0, 3.8);   // sol alto: la sombra cae BAJO el coche, no detras
        // 2048 era el mayor coste por cuadro: cada malla del coche se dibuja
        // otra vez dentro del mapa. A 1024 con el encuadre ajustado se ve igual
        // y cuesta la cuarta parte de relleno.
        o.shadow.mapSize.set(2048, 2048);
        o.shadow.bias = -0.00025;
        o.shadow.normalBias = 0.035;
        o.shadow.camera.left = -7.5;
        o.shadow.camera.right = 7.5;
        o.shadow.camera.top = 7.5;
        o.shadow.camera.bottom = -7.5;
        o.shadow.camera.far = 40;
        o.shadow.camera.updateProjectionMatrix();
        if (!o.target.parent) scene.add(o.target);
        luzSol = o;
      } else {
        o.intensity = 0.42;
        o.color.set('#BFD4FF');
      }
    }
    if (o.isMesh && o.material && o.material.isShadowMaterial) o.material.opacity = 0.32;
  });

  // el pixel ratio nativo de una pantalla retina cuadruplica el relleno; 1.5
  // es indistinguible en un render de color plano
  const dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(Math.min(dpr, 1.5));
  // subida adaptativa: se cronometran 12 cuadros y solo si sobran (< 6 ms) se
  // pasa a 2x. Fijarlo a ciegas hunde a 30 fps los portatiles integrados.
  if (dpr > 1.5) requestAnimationFrame(() => {
    const t0 = performance.now();
    for (let i = 0; i < 12; i++) renderer.render(scene, stage._camera);
    if ((performance.now() - t0) / 12 < 6) renderer.setPixelRatio(Math.min(dpr, 2));
  });

})();

/* ---------- ficha tecnica real, leida del modelo ---------- */
const caja = new THREE.Box3().setFromObject(coche);
let tris = 0, piezas = 0;
const mats = new Set();
coche.traverse((o) => {
  if (!o.isMesh) return;
  piezas++;
  mats.add(o.material.name);
  const g = o.geometry;
  tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
});
const tam = caja.getSize(new THREE.Vector3());
const txt = (id, v) => { document.getElementById(id).textContent = v; };
txt('s-parts', piezas);
txt('s-mats', mats.size);
txt('s-tris', Math.round(tris).toLocaleString('es-ES'));
txt('s-size', `${tam.z.toFixed(2)} × ${tam.x.toFixed(2)} × ${tam.y.toFixed(2)} m`);

/* ==========================================================================
   MUNDO CONDUCIBLE
   Cámara elevada que sigue al coche, flechas o WASD/ZQSD, y objetos que se
   pueden golpear. Todo vive en la escena del visor, nunca en el grupo que se
   exporta al GLB.
   ========================================================================== */
const mundo = new THREE.Group();
mundo.name = 'mundo';
mundo.visible = false;
stage._scene.add(mundo);

// zonas de suelo blando: cada una con su color y su agarre
const ZONAS = [
  { x: -19, z: 19, r: 9.5, agarre: 0.52, color: '#D9C48E', nombre: 'arena' },
  { x: 21, z: -19, r: 9.5, agarre: 0.72, color: '#9DBE86', nombre: 'hierba' },
];
function agarreEn(x, z) {
  for (const zo of ZONAS) if (Math.hypot(x - zo.x, z - zo.z) < zo.r) return zo.agarre;
  return 1;
}

const suelo = new THREE.Mesh(
  new THREE.PlaneGeometry(220, 220),
  new THREE.MeshStandardMaterial({ color: '#DDE1E9', roughness: 0.95, metalness: 0 })
);
suelo.rotation.x = -Math.PI / 2;
suelo.position.y = -0.012;
suelo.receiveShadow = true;
mundo.add(suelo);

// placas visibles de las zonas blandas
for (const zo of ZONAS) {
  const m = new THREE.Mesh(
    new THREE.CircleGeometry(zo.r, 40),
    new THREE.MeshStandardMaterial({ color: zo.color, roughness: 1, metalness: 0 })
  );
  m.name = 'zona_' + zo.nombre;
  m.rotation.x = -Math.PI / 2;
  m.position.set(zo.x, -0.008, zo.z);
  m.receiveShadow = true;
  mundo.add(m);
}

// instrucciones escritas en el suelo, no en la interfaz
(function instruccionesEnSuelo() {
  const cv = document.createElement('canvas');
  cv.width = 1024; cv.height = 256;
  const g = cv.getContext('2d');
  g.clearRect(0, 0, 1024, 256);
  g.fillStyle = 'rgba(21,24,30,0.42)';
  g.font = '600 96px "JetBrains Mono", monospace';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('↑ ↓ ← →', 512, 78);
  g.font = '600 54px "JetBrains Mono", monospace';
  g.fillText('PARA CONDUCIR', 512, 178);
  const plano = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 2.25),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })
  );
  plano.rotation.x = -Math.PI / 2;
  plano.position.set(0, 0.002, 7.5);
  mundo.add(plano);
})();

// RAMPAS: cunas alineadas al mundo. El coche consulta la altura del terreno bajo
// su eje y despega al salir por el borde alto.
const rampas = [];
function creaRampa(x, z, ancho, largo, alto, giro) {
  const s = new THREE.Shape();
  // el perfil va espejado porque rotateY(90) invierte el eje: sin esto la parte
  // alta de la malla cae en el lado opuesto al que dice la consulta de altura
  s.moveTo(largo / 2, 0); s.lineTo(-largo / 2, alto); s.lineTo(-largo / 2, 0); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: ancho, bevelEnabled: false, curveSegments: 1 });
  geo.translate(0, 0, -ancho / 2);
  geo.rotateY(Math.PI / 2);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#8C9099', roughness: 0.85, metalness: 0.05 }));
  m.name = 'rampa_' + (rampas.length + 1);
  m.position.set(x, 0, z);
  m.rotation.y = giro;
  m.castShadow = true; m.receiveShadow = true;
  mundo.add(m);
  rampas.push({ x, z, ancho, largo, alto, cos: Math.cos(giro), sin: Math.sin(giro) });
}
creaRampa(0, 22, 5, 7, 1.5, 0);
creaRampa(-18, 6, 4.5, 6, 1.2, Math.PI / 2);
creaRampa(20, -14, 5, 8, 1.8, Math.PI);
creaRampa(-10, -24, 4.5, 6.5, 1.3, -Math.PI / 2);

// altura del terreno y direccion de subida bajo un punto
const _terr = { y: 0, pend: 0, ejeX: 0, ejeZ: 1 };
function terreno(x, z) {
  _terr.y = 0; _terr.pend = 0; _terr.ejeX = 0; _terr.ejeZ = 1;
  for (const r of rampas) {
    const dx = x - r.x, dz = z - r.z;
    const lx = dx * r.cos - dz * r.sin;
    const lz = dx * r.sin + dz * r.cos;
    if (Math.abs(lx) > r.ancho / 2 || Math.abs(lz) > r.largo / 2) continue;
    const y = r.alto * ((lz + r.largo / 2) / r.largo);
    if (y > _terr.y) {
      _terr.y = y;
      _terr.pend = r.alto / r.largo;
      _terr.ejeX = r.sin; _terr.ejeZ = r.cos;   // direccion de subida en mundo
    }
  }
  return _terr;
}

// faroles reales del proyecto como balizas fijas del recorrido
{
  const base = gFaroles.scene;
  base.updateMatrixWorld(true);
  let farol = null;
  base.traverse((o) => { if (!farol && o.isMesh) farol = o; });
  if (farol) {
    const puestosFarol = [[9, 9, 0.4], [-9, 14, 2.1], [14, 0, 1.2], [-16, -8, 3.6], [4, -18, 5.2], [-24, 18, 0.9]];
    // una sola llamada de dibujo para los seis, con matriz por instancia
    const inst = new THREE.InstancedMesh(farol.geometry, farol.material, puestosFarol.length);
    inst.name = 'faroles';
    inst.castShadow = true;
    const _mx = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _e = new THREE.Vector3(1.35, 1.35, 1.35);
    puestosFarol.forEach(([px, pz, giro], i) => {
      _q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro);
      _p.set(px, 0, pz);
      inst.setMatrixAt(i, _mx.compose(_p, _q, _e));
    });
    inst.instanceMatrix.needsUpdate = true;
    inst.userData.puestos = puestosFarol;
    mundo.add(inst);
  }
}

// objetos golpeables REALES del proyecto: cajas explosivas, bancos y
// ladrillos, clonados de sus GLB. El radio de colision y la altura de apoyo
// salen del bbox de cada mesh, no de constantes.
const obstaculos = [];
{
  const catalogo = [];
  const cosecha = (gltf, nombre, max) => {
    let n = 0;
    gltf.scene.traverse((o) => { if (o.isMesh && n < max) { catalogo.push({ mesh: o, nombre }); n++; } });
  };
  cosecha(gCajas, 'caja', 2);
  cosecha(gBancos, 'banco', 1);
  cosecha(gLadrillos, 'ladrillo', 3);

  const puestos = [[-6, 4, 0], [6.5, 6, 1], [-9, -5, 2], [8, -7, 3], [0, 15, 0], [-14, 9, 4], [13, 2, 5], [-3, -13, 1], [18, 12, 0], [-20, -14, 2]];
  const _bb = new THREE.Box3(), _tam = new THREE.Vector3();
  puestos.forEach((p, i) => {
    const pieza = catalogo[p[2] % catalogo.length];
    if (!pieza) return;
    const m = pieza.mesh.clone();
    m.name = 'obstaculo_' + pieza.nombre + '_' + (i + 1);
    m.rotation.set(0, (i * 1.7) % (Math.PI * 2), 0);
    m.castShadow = true;
    // apoyo y radio reales del mesh
    m.position.set(0, 0, 0);
    m.updateMatrixWorld(true);
    _bb.setFromObject(m);
    _bb.getSize(_tam);
    const base = -_bb.min.y;
    m.position.set(p[0], base, p[1]);
    mundo.add(m);
    obstaculos.push({ m, vx: 0, vz: 0, vy: 0, vry: 0, vrx: 0, r: Math.max(_tam.x, _tam.z) * 0.5, base });
  });
}

// Rastro de derrape: la firma visual de la referencia. NO son marcas suELtas.
// Cada lado es una CINTA continua (un solo mesh, tira de triangulos) cuyos
// bordes se generan desplazando cada punto perpendicular a la trayectoria. Con
// rectangulos independientes, cada uno girado un poco distinto, las esquinas
// sobresalian y el rastro quedaba con el borde en escalera.
const PASO_HUELLA = 0.16;
const MAX_PUNTOS = 150;
const ANCHO_HUELLA = 0.15;

// El buffer de puntos esta PREASIGNADO y funciona como anillo. Antes se creaba
// un objeto por punto (hasta 28 por cuadro) y se descartaban con shift(): esa
// basura constante provocaba pausas periodicas del recolector, que es lo que se
// sentia como acelerar-pausa-acelerar al pisar el gas.
function creaRastro() {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(MAX_PUNTOS * 2 * 3);
  const col = new Float32Array(MAX_PUNTOS * 2 * 4);
  const idx = [];
  for (let i = 0; i < MAX_PUNTOS - 1; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 4));   // itemSize 4 = alfa por vertice
  geo.setIndex(idx);
  geo.setDrawRange(0, 0);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide,
  }));
  mesh.frustumCulled = false;
  mesh.renderOrder = -2;
  mundo.add(mesh);
  const puntos = new Array(MAX_PUNTOS);
  for (let i = 0; i < MAX_PUNTOS; i++) puntos[i] = { x: 0, z: 0, ex: 0, ez: 0, vida: 0, corte: false };
  return { mesh, pos, col, puntos, inicio: 0, n: 0 };
}
const rastros = [creaRastro(), creaRastro()];

function empujaPunto(r, px, pz, perX, perZ, corte) {
  const q = r.puntos[(r.inicio + r.n) % MAX_PUNTOS];
  q.x = px; q.z = pz;
  q.ex = perX * ANCHO_HUELLA; q.ez = perZ * ANCHO_HUELLA;
  q.vida = 1; q.corte = corte;
  if (r.n < MAX_PUNTOS) r.n++; else r.inicio = (r.inicio + 1) % MAX_PUNTOS;
}

function refrescaRastro(r, dt) {
  if (r.n === 0) return;
  const caida = dt * 0.14;
  // el buffer se reescribe solo mientras la cinta tenga puntos vivos
  for (let i = 0; i < r.n; i++) r.puntos[(r.inicio + i) % MAX_PUNTOS].vida -= caida;
  while (r.n > 0 && r.puntos[r.inicio].vida <= 0) { r.inicio = (r.inicio + 1) % MAX_PUNTOS; r.n--; }
  if (r.n < 2) { r.mesh.geometry.setDrawRange(0, 0); return; }
  for (let i = 0; i < r.n; i++) {
    const q = r.puntos[(r.inicio + i) % MAX_PUNTOS];
    const b = i * 6, c = i * 8;
    r.pos[b] = q.x + q.ex; r.pos[b + 1] = 0.004; r.pos[b + 2] = q.z + q.ez;
    r.pos[b + 3] = q.x - q.ex; r.pos[b + 4] = 0.004; r.pos[b + 5] = q.z - q.ez;
    // se mantiene opaco un tramo y luego se va: aclarar desde el primer instante
    // era lo que daba el aspecto de manchas translucidas
    const a = q.corte ? 0 : Math.min(1, q.vida * 2.6) * 0.3;
    r.col[c] = 0.137; r.col[c + 1] = 0.149; r.col[c + 2] = 0.176; r.col[c + 3] = a;
    r.col[c + 4] = 0.137; r.col[c + 5] = 0.149; r.col[c + 6] = 0.176; r.col[c + 7] = a;
  }
  r.mesh.geometry.attributes.position.needsUpdate = true;
  r.mesh.geometry.attributes.color.needsUpdate = true;
  r.mesh.geometry.setDrawRange(0, (r.n - 1) * 6);
}

const ultimaHuella = new THREE.Vector2(0, 0);
let derrapando = false;

// POLVO: nube de puntos reciclada, se levanta al derrapar y al aterrizar
const MAX_POLVO = 90;
const polvo = (() => {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(MAX_POLVO * 3);
  const col = new Float32Array(MAX_POLVO * 4);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 4));
  geo.setDrawRange(0, 0);
  const m = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.5, sizeAttenuation: true, vertexColors: true,
    transparent: true, depthWrite: false,
  }));
  m.name = 'polvo';
  m.frustumCulled = false;
  mundo.add(m);
  const p = new Array(MAX_POLVO);
  for (let i = 0; i < MAX_POLVO; i++) p[i] = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, vida: 0 };
  return { geo, pos, col, p, idx: 0 };
})();

function lanzaPolvo(x, y, z, fuerza) {
  const q = polvo.p[polvo.idx++ % MAX_POLVO];
  q.x = x + (Math.random() - 0.5) * 0.4;
  q.y = y + 0.1;
  q.z = z + (Math.random() - 0.5) * 0.4;
  q.vx = (Math.random() - 0.5) * fuerza;
  q.vy = 0.6 + Math.random() * fuerza * 0.4;
  q.vz = (Math.random() - 0.5) * fuerza;
  q.vida = 1;
}

function refrescaPolvo(dt) {
  let n = 0;
  for (let i = 0; i < MAX_POLVO; i++) {
    const q = polvo.p[i];
    if (q.vida <= 0) continue;
    q.vida -= dt * 0.9;
    q.vy -= 2.2 * dt;
    q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt;
    if (q.y < 0.05) { q.y = 0.05; q.vy = 0; q.vx *= 0.9; q.vz *= 0.9; }
    if (q.vida <= 0) continue;
    const b = n * 3, c = n * 4;
    polvo.pos[b] = q.x; polvo.pos[b + 1] = q.y; polvo.pos[b + 2] = q.z;
    polvo.col[c] = 0.72; polvo.col[c + 1] = 0.70; polvo.col[c + 2] = 0.66;
    polvo.col[c + 3] = Math.min(1, q.vida * 1.6) * 0.4;
    n++;
  }
  polvo.geo.attributes.position.needsUpdate = true;
  polvo.geo.attributes.color.needsUpdate = true;
  polvo.geo.setDrawRange(0, n);
}

// ESTELAS DE BOOST: dos cintas aditivas emitidas desde las referencias reales
// del juego (setBoostTrails: chasis en x -1.28, y 0.1, z ±0.55)
const refsEstela = [0.55, -0.55].map((lado) => {
  const o = new THREE.Object3D();
  o.position.set(-1.28, 0.1, lado);
  chasisNodo.add(o);
  return o;
});
const estelas = refsEstela.map(() => {
  const N = 44;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 2 * 3);
  const col = new Float32Array(N * 2 * 4);
  const idx = [];
  for (let i = 0; i < N - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 4));
  geo.setIndex(idx);
  geo.setDrawRange(0, 0);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  }));
  mesh.frustumCulled = false;
  mundo.add(mesh);
  const pts = new Array(N);
  for (let i = 0; i < N; i++) pts[i] = { x: 0, y: 0, z: 0, vida: 0 };
  return { geo, pos, col, pts, ini: 0, n: 0, N };
});
const _refP = new THREE.Vector3();
function emiteEstelas() {
  const activo = V.boost > 0.55 && V.cmdA > 0 && !V.aire;
  if (!activo) return;
  for (let s = 0; s < 2; s++) {
    const e = estelas[s];
    refsEstela[s].getWorldPosition(_refP);
    const q = e.pts[(e.ini + e.n) % e.N];
    q.x = _refP.x; q.y = _refP.y; q.z = _refP.z; q.vida = 1;
    if (e.n < e.N) e.n++; else e.ini = (e.ini + 1) % e.N;
  }
}
function refrescaEstelas(dt) {
  for (const e of estelas) {
    if (!e.n) continue;
    for (let i = 0; i < e.n; i++) e.pts[(e.ini + i) % e.N].vida -= dt * 2.4;
    while (e.n && e.pts[e.ini].vida <= 0) { e.ini = (e.ini + 1) % e.N; e.n--; }
    if (e.n < 2) { e.geo.setDrawRange(0, 0); continue; }
    for (let i = 0; i < e.n; i++) {
      const q = e.pts[(e.ini + i) % e.N], b = i * 6, c = i * 8;
      const w = 0.10 * q.vida;
      e.pos[b] = q.x; e.pos[b + 1] = q.y + w; e.pos[b + 2] = q.z;
      e.pos[b + 3] = q.x; e.pos[b + 4] = q.y - w; e.pos[b + 5] = q.z;
      const al = q.vida * 0.85;
      e.col[c] = 0.84; e.col[c + 1] = 0.29; e.col[c + 2] = 0.88; e.col[c + 3] = al;
      e.col[c + 4] = 0.72; e.col[c + 5] = 0.12; e.col[c + 6] = 0.66; e.col[c + 7] = al;
    }
    e.geo.attributes.position.needsUpdate = true;
    e.geo.attributes.color.needsUpdate = true;
    e.geo.setDrawRange(0, (e.n - 1) * 6);
  }
}

function marcaHuella(dt, dirX, dirZ) {
  const activo = V.derrape > 0.22;
  if (activo) {
    const dx = V.x - ultimaHuella.x, dz = V.z - ultimaHuella.y;
    const avance = Math.hypot(dx, dz);
    if (avance > PASO_HUELLA) {
      // se rellena TODO el tramo recorrido, no un punto: si el cuadro fue largo
      // el rastro sigue siendo continuo
      const pasos = Math.min(14, Math.floor(avance / PASO_HUELLA));
      const ux = dx / avance, uz = dz / avance;
      const perX = uz, perZ = -ux;                 // perpendicular a la trayectoria
      for (let k = 1; k <= pasos; k++) {
        const t = (k * PASO_HUELLA) / avance;
        const px = ultimaHuella.x + dx * t, pz = ultimaHuella.y + dz * t;
        for (let s = 0; s < 2; s++) {
          const lado = s === 0 ? 1 : -1;
          empujaPunto(rastros[s],
            px - dirX * 1.08 + dirZ * lado * 0.79,
            pz - dirZ * 1.08 - dirX * lado * 0.79,
            perX, perZ, !derrapando && k === 1);
        }
      }
      const t = (pasos * PASO_HUELLA) / avance;
      ultimaHuella.set(ultimaHuella.x + dx * t, ultimaHuella.y + dz * t);
      derrapando = true;
    }
  } else {
    ultimaHuella.set(V.x, V.z);   // sin esto la primera marca daria un salto
    derrapando = false;
  }
  // la cinta se reescribe a 30 Hz: en un rastro que se desvanece no se nota y
  // ahorra la mitad de las subidas de buffer
  if ((cuadro & 1) === 0) { refrescaRastro(rastros[0], dt * 2); refrescaRastro(rastros[1], dt * 2); }
}

/* ---------- estado del vehiculo ---------- */
// La velocidad es un VECTOR en mundo, no un escalar sobre el rumbo: eso es lo
// que permite que el coche derrape, que el morro apunte hacia dentro de la
// curva y que la inercia se sienta en vez de ir sobre rieles.
/* ==========================================================================
   FISICA REAL: Rapier (rapier.rs), el mismo motor del juego. Physics.js crea
   RAPIER.World({x:0,y:-9.81,z:0}) y PhysicsVehicle.js un
   DynamicRayCastVehicleController: un rayo de suspension POR RUEDA (el
   raycast-vehicle clasico de los motores grandes). Portado con las constantes
   exactas del juego. La fisica corre en la ESCALA DEL MODELO (la del GLB,
   coche ~2.6 m): lo visual va x1.6, asi que las traslaciones se multiplican
   por ESCALA al pintar y los colliders del mundo se dividen.
   ========================================================================== */
coche.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

const FIS = {
  listo: false, world: null, body: null, ctrl: null, masa: 2.5,
  rest: 1.0, lenRest: 0.5,     // se calibran solos con el coche parado
  obst: [], saltoCD: 0, volcado: 0, rapPrev: 0, zonaPrev: -1, safe: { x: 0, z: 0 },
};
const QY90 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
const Q_SPAWN = { x: 0, y: Math.sin(-Math.PI / 4), z: 0, w: Math.cos(Math.PI / 4) };  // el cuerpo mira +X; -90 grados lo deja mirando +Z

try {
  let RAPIER = null;
  for (const url of [
    'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.14.0/+esm',
    'https://unpkg.com/@dimforge/rapier3d-compat@0.14.0/rapier.es.js',
    'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.14.0',
  ]) {
    try { const m = await import(url); RAPIER = m.default || m; if (RAPIER && RAPIER.init) break; } catch (e) { console.warn('CDN Rapier fallo, pruebo otro:', url); }
  }
  await RAPIER.init();
  const K = ESCALA;
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });   // gravedad identica a Physics.js
  world.timestep = 1 / 60;

  // suelo y muros del recinto (los limites visuales estan a +-44 m de mundo)
  world.createCollider(RAPIER.ColliderDesc.cuboid(90, 1, 90).setTranslation(0, -1, 0).setFriction(0.9));
  const LIM = 44 / K;
  for (const [wx, wz, hw, hd] of [[0, -LIM, LIM + 2, 0.6], [0, LIM, LIM + 2, 0.6], [-LIM, 0, 0.6, LIM + 2], [LIM, 0, 0.6, LIM + 2]]) {
    world.createCollider(RAPIER.ColliderDesc.cuboid(hw, 4, hd).setTranslation(wx, 4, wz));
  }

  // rampas: cuna convexa IDENTICA a la malla visual (la altura sube hacia +lz)
  for (const r of rampas) {
    const a = r.ancho / 2 / K, l = r.largo / 2 / K, h = r.alto / K;
    const pts = new Float32Array([-a, 0, -l, a, 0, -l, -a, 0, l, a, 0, l, -a, h, l, a, h, l]);
    const giroR = Math.atan2(r.sin, r.cos);
    world.createCollider(
      RAPIER.ColliderDesc.convexHull(pts)
        .setTranslation(r.x / K, 0, r.z / K)
        .setRotation({ x: 0, y: Math.sin(giroR / 2), z: 0, w: Math.cos(giroR / 2) })
        .setFriction(0.9)
    );
  }

  // faroles fijos
  for (const fa of mundo.children) {
    if (fa.name !== 'faroles' || !fa.userData.puestos) continue;
    for (const [px, , pz] of fa.userData.puestos.map(([a, b, c]) => [a, c, b])) {
      world.createCollider(RAPIER.ColliderDesc.cylinder(1.4, 0.32).setTranslation(px / K, 1.4, pz / K));
    }
  }

  // objetos golpeables: cuerpos dinamicos de verdad (caen, ruedan, se apilan)
  const _bbF = new THREE.Box3(), _c0 = new THREE.Vector3(), _heF = new THREE.Vector3();
  for (const ob of obstaculos) {
    ob.m.updateMatrixWorld(true);
    _bbF.setFromObject(ob.m); _bbF.getCenter(_c0); _bbF.getSize(_heF);
    const q0 = ob.m.quaternion.clone();
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(_c0.x / K, _c0.y / K, _c0.z / K)
        .setRotation({ x: q0.x, y: q0.y, z: q0.z, w: q0.w })
        .setLinearDamping(0.15).setAngularDamping(0.22)   // menos freno: vuelan y voltean
    );
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(Math.max(0.06, _heF.x / 2 / K), Math.max(0.06, _heF.y / 2 / K), Math.max(0.06, _heF.z / 2 / K))
        .setDensity(0.14).setFriction(0.5).setRestitution(0.35),
      body
    );
    const oL = ob.m.position.clone().divideScalar(K).sub(_c0.clone().divideScalar(K)).applyQuaternion(q0.clone().invert());
    FIS.obst.push({ m: ob.m, body, oL, t0: { x: _c0.x / K, y: _c0.y / K, z: _c0.z / K }, q0: { x: q0.x, y: q0.y, z: q0.z, w: q0.w } });
  }

  // chasis del juego: collider principal (masa 2.5 con centro de masa BAJO,
  // aqui repartido en principal 1.5 + lastre 1.0 a y -0.55), techo y defensa
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 1.6, 0).setRotation(Q_SPAWN).setCanSleep(false).setCcdEnabled(true)
  );
  // CCD: sin deteccion continua, un cuerpo rapido o volcando atraviesa el suelo
  // de 2 m en un solo paso. Y un SOLO cuerpo principal + lastre bajo para el
  // centro de masa: antes habia ademas un collider "bumper" de 3x1x1.8 que
  // sobresalia del morro; al tocar una rampa de canto se incrustaba y Rapier lo
  // expulsaba con un impulso gigante que mandaba el coche BAJO el mapa. Fuera.
  world.createCollider(RAPIER.ColliderDesc.cuboid(1.28, 0.4, 0.82).setTranslation(0, -0.1, 0).setMass(1.6).setFriction(0.5), body);
  world.createCollider(RAPIER.ColliderDesc.cuboid(0.85, 0.3, 0.58).setTranslation(0, -0.5, 0).setMass(1.3).setFriction(0.5), body);

  const ctrl = world.createVehicleController(body);
  const RADIO_FIS = R / K;   // radio medido del propio GLB
  const conex = [[0.90, 0.75], [0.90, -0.75], [-0.90, 0.75], [-0.90, -0.75]];  // mismo orden que el array de ruedas
  for (let i = 0; i < 4; i++) {
    ctrl.addWheel({ x: conex[i][0], y: 0, z: conex[i][1] }, { x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 1 }, 0.88, RADIO_FIS);
    ctrl.setWheelFrictionSlip(i, 0.9);
    ctrl.setWheelMaxSuspensionForce(i, 150);
    ctrl.setWheelMaxSuspensionTravel(i, 2);
    ctrl.setWheelSideFrictionStiffness(i, 3);
    ctrl.setWheelSuspensionCompression(i, 10);
    ctrl.setWheelSuspensionRelaxation(i, 2.7);
    ctrl.setWheelSuspensionStiffness(i, 20);
    ctrl.setWheelSuspensionRestLength(i, 0.88);
  }
  FIS.world = world; FIS.body = body; FIS.ctrl = ctrl; FIS.masa = body.mass();
  FIS.listo = true;
} catch (e) {
  console.error('Rapier no pudo cargar: la conduccion queda desactivada', e);
}

const V = {
  x: 0, z: 0, rumbo: 0,
  vx: 0, vz: 0,          // velocidad en mundo
  guinada: 0,            // velocidad angular
  giro: 0,               // angulo real de las ruedas directrices
  largo: 0, lateral: 0,  // velocidad descompuesta, por cuadro
  gas: 0, derrape: 0,
  y: 0, vy: 0, aire: false,   // altura sobre el terreno y salto
  boost: 0, cmdA: 0, cmdS: 0, frenando: false, mano: 0,
  cabRampa: 0, rolRampa: 0, paredCD: 0,
};
const teclas = new Set();
const ACEL = ['arrowup', 'w', 'z'], FRENO = ['arrowdown', 's'];
const IZQ = ['arrowleft', 'a', 'q'], DER = ['arrowright', 'd'], MANO = ['x'], BOOST = ['shift'];
const pulsada = (lista) => lista.some((k) => teclas.has(k));

// Suspension del cuerpo: tres resortes amortiguados (hundimiento, balanceo,
// cabeceo). Asignar el angulo directamente es lo que hace que una animacion se
// sienta tosca; con resorte hay retardo, rebote y asentamiento.
const S = { y: 0, vy: 0, rol: 0, vrol: 0, cab: 0, vcab: 0 };
const WN = 12, ZETA = 0.42;

// Camara con muelle critico: ni pegada al coche ni con el retardo plano de un
// lerp. Se abre y se eleva con la velocidad, y mira por delante del morro.
const CAM = { pos: new THREE.Vector3(7.5, 9.2, 7.5), vel: new THREE.Vector3(), mira: new THREE.Vector3(0, 1.1, 0) };
// vectores de trabajo reutilizados: crear cuatro Vector3 por cuadro alimentaba
// al recolector y se sentia como tirones al acelerar
const _tmpA = new THREE.Vector3(), _tmpB = new THREE.Vector3();

// Resortes amortiguados en linea, sin devolver arrays: cada array por cuadro es
// basura, y las pausas del recolector se ven como tirones.
function aplicaSuspension(dt, aLong, aLat, hundir) {
  const k = WN * WN, c = 2 * ZETA * WN;
  S.vrol += (k * (THREE.MathUtils.clamp(-aLat * 0.0065, -0.11, 0.11) - S.rol) - c * S.vrol) * dt;
  S.rol += S.vrol * dt;
  S.vcab += (k * (THREE.MathUtils.clamp(-aLong * 0.011, -0.065, 0.065) - S.cab) - c * S.vcab) * dt;
  S.cab += S.vcab * dt;
  const kY = (WN * 1.35) * (WN * 1.35), cY = 2 * 0.5 * WN * 1.35;
  S.vy += (kY * (THREE.MathUtils.clamp(hundir, -0.05, 0.05) - S.y) - cY * S.vy) * dt;
  S.y += S.vy * dt;
  cuerpo.rotation.z = S.rol;
  cuerpo.rotation.x = S.cab;
  cuerpo.position.y = S.y;
}

let modo = 'inspeccion';   // inspeccion | demo | conduccion
let cuadro = 0;

/* ---------- sonidos REALES del proyecto (static/sounds/vehicle) ----------
   Mapeados con las formulas exactas de Player.js: el motor sube de volumen con
   max(0.05, |acel|*0.5*(boost+1)*0.8) y easing 10 al subir / 2.5 al bajar, y
   de tono con remapClamp(acel*boost, 0, 1, 0.6, 1.1) suavizado *5; el bucle de
   energia del boost usa (0.5+|acel|*0.5)*boost*0.3 y tono 0.95+|acel|*2. */
const AUDIO = { ctx: null, on: false, listo: false, items: {}, golpes: {} };
async function cargaAudio() {
  if (AUDIO.ctx || !window.AudioContext) return;
  const ctx = new AudioContext();
  AUDIO.ctx = ctx;
  const bufDe = async (url) => ctx.decodeAudioData(await (await fetch(url)).arrayBuffer());
  const bucle = async (n, url) => {
    const src = ctx.createBufferSource();
    src.buffer = await bufDe(url);
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(g).connect(ctx.destination);
    src.start();
    AUDIO.items[n] = { src, g, vol: 0, rate: 1 };
  };
  const golpe = async (n, url) => { AUDIO.golpes[n] = await bufDe(url); };
  await Promise.all([
    bucle('motor', 'assets/sonido/motor.mp3'),
    bucle('rodadura', 'assets/sonido/rodadura.mp3'),
    bucle('boost', 'assets/sonido/boost.mp3'),
    golpe('bocina', 'assets/sonido/bocina.mp3'),
    golpe('suspension', 'assets/sonido/suspension.mp3'),
    golpe('pintura', 'assets/sonido/pintura.mp3'),
    golpe('golpeLadrillo', 'assets/sonido/golpe-ladrillo.mp3'),
    golpe('golpeMetal', 'assets/sonido/golpe-metal.mp3'),
    golpe('checkpoint', 'assets/sonido/checkpoint.mp3'),
  ]);
  AUDIO.listo = true;
}
function unaVez(n, vol = 1, rate = 1) {
  if (!AUDIO.on || !AUDIO.listo || !AUDIO.golpes[n]) return;
  const s = AUDIO.ctx.createBufferSource();
  s.buffer = AUDIO.golpes[n];
  s.playbackRate.value = rate;
  const g = AUDIO.ctx.createGain();
  g.gain.value = vol;
  s.connect(g).connect(AUDIO.ctx.destination);
  s.start();
}
function actualizaSonido(rapidez, derrape, gas, dt) {
  if (!AUDIO.on || !AUDIO.listo) return;
  const acel = Math.abs(gas) * 0.5;
  const b = V.boost + 1;
  const m = AUDIO.items.motor;
  {
    const obj = Math.max(0.05, acel * b * 0.8);
    const d = obj - m.vol;
    m.vol += d * dt * (d > 0 ? 10 : 2.5);
    m.g.gain.value = m.vol * 0.55;
    const r = remapClamp(acel * b, 0, 1, 0.6, 1.1);
    m.rate += (r - m.rate) * dt * 5;
    m.src.playbackRate.value = m.rate;
  }
  const fl = AUDIO.items.rodadura;
  {
    const obj = Math.min(0.4, rapidez * 0.025) * (V.aire ? 0 : 1) + derrape * 0.2;
    const d = obj - fl.vol;
    fl.vol += d * dt * (d > 0 ? 8 : 4);
    fl.g.gain.value = fl.vol;
  }
  const bo = AUDIO.items.boost;
  {
    const obj = (0.5 + acel) * V.boost * 0.3;
    const d = obj - bo.vol;
    bo.vol += d * dt * (d > 0 ? 10 : 1);
    bo.g.gain.value = bo.vol;
    const r = 0.95 + Math.abs(gas) * 2;
    bo.rate += (r - bo.rate) * dt * 5;
    bo.src.playbackRate.value = bo.rate;
  }
}
function paraSonido() {
  if (!AUDIO.listo) return;
  for (const k in AUDIO.items) { AUDIO.items[k].vol = 0; AUDIO.items[k].g.gain.value = 0; }
}

function reposo() {
  if (FIS.listo) {
    FIS.body.setTranslation({ x: 0, y: FIS.rest, z: 0 }, true);
    FIS.body.setRotation(Q_SPAWN, true);
    FIS.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    FIS.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    for (const ob of FIS.obst) {
      ob.body.setTranslation(ob.t0, true);
      ob.body.setRotation(ob.q0, true);
      ob.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ob.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
    sobrante = 0; prevAire = false; prevVy = 0;
  }
  cuerpo.position.set(0, 0, 0);
  cuerpo.rotation.set(0, 0, 0);
  coche.position.set(0, 0, 0);
  coche.rotation.set(0, 0, 0);
  if (mastil) mastil.rotation.y = 0;
  for (const r of ruedas) { r.container.rotation.y = r.baseY; r.container.position.y = Y_RUEDA; if (r.cylinder) r.cylinder.rotation.z = 0; }
  for (const e of estelas) { e.n = 0; e.ini = 0; e.geo.setDrawRange(0, 0); }
  blinkT = 0;
  for (const k of ['stop', 'back', 'blinkL', 'blinkR']) if (P[k]) P[k].visible = false;
  sombra.position.set(0, 0.005, 0);
  sombra.rotation.set(-Math.PI / 2, 0, 0);
  Object.assign(V, { x: 0, z: 0, rumbo: 0, vx: 0, vz: 0, guinada: 0, giro: 0, largo: 0, lateral: 0, gas: 0, derrape: 0, y: 0, vy: 0, aire: false, boost: 0, cmdA: 0, cmdS: 0, frenando: false, mano: 0 });
  for (const q of polvo.p) q.vida = 0;
  polvo.geo.setDrawRange(0, 0);
  sobrante = 0;
  paraSonido();
  Object.assign(S, { y: 0, vy: 0, rol: 0, vrol: 0, cab: 0, vcab: 0 });
  CAM.pos.set(7.5, 9.2, 7.5);
  CAM.vel.set(0, 0, 0);
  CAM.mira.set(0, 1.1, 0);
  for (const r of rastros) { r.inicio = 0; r.n = 0; r.mesh.geometry.setDrawRange(0, 0); }
  ultimaHuella.set(0, 0);
  derrapando = false;}



// La fisica avanza en subpasos FIJOS de 1/120 s. Con dt variable un cuadro largo
// integraba de golpe y se percibia como un tiron; asi el resultado no depende de
// cuanto durase el cuadro.
const PASO_FIS = 1 / 60;   // el paso del juego: updateVehicle(min(1/60, delta))
let sobrante = 0, prevAire = false, prevVy = 0;
const _qb = new THREE.Quaternion(), _fw = new THREE.Vector3(), _sd = new THREE.Vector3(), _upv = new THREE.Vector3(), _vv = new THREE.Vector3();
const STEER_SIGN = 1;    // bullet/rapier giran la rueda alrededor del eje ARRIBA (-directionCs): positivo = izquierda, igual que el visual

// flip.jump del juego: impulso vertical de 5*masa y par corrector si el coche
// esta volcado o de lado
function salto() {
  if (!FIS.listo || FIS.saltoCD > 0 || modo !== 'conduccion') return;
  FIS.saltoCD = 0.9;
  const q = FIS.body.rotation();
  _qb.set(q.x, q.y, q.z, q.w);
  _sd.set(0, 0, 1).applyQuaternion(_qb);
  _fw.set(1, 0, 0).applyQuaternion(_qb);
  _upv.set(0, 1, 0).applyQuaternion(_qb);
  FIS.body.applyImpulse({ x: 0, y: 5 * FIS.masa, z: 0 }, true);
  let tq = null;
  if (Math.abs(_upv.y) > Math.abs(_sd.y) && Math.abs(_upv.y) > Math.abs(_fw.y)) {
    if (_upv.y < -0.3) tq = new THREE.Vector3(0.8 * FIS.masa, 0, 0);
  } else {
    tq = new THREE.Vector3(_sd.y * 0.4 * FIS.masa, 0, -_fw.y * 0.8 * FIS.masa);
  }
  if (tq) { tq.applyQuaternion(_qb); FIS.body.applyTorqueImpulse({ x: tq.x, y: tq.y, z: tq.z }, true); }
  unaVez('suspension', 0.5, 1.15);
}

function pasoConduccion(dt) {
  if (!FIS.listo) return;
  const a = (pulsada(ACEL) ? 1 : 0) - (pulsada(FRENO) ? 1 : 0);
  const s = (pulsada(IZQ) ? 1 : 0) - (pulsada(DER) ? 1 : 0);
  const enBoost = pulsada(BOOST) && a > 0 ? 1 : 0;
  V.boost += (enBoost - V.boost) * Math.min(1, dt * 1.2);
  V.giro += (s * 0.5 - V.giro) * Math.min(1, dt * 16);   // steeringAmplitude 0.5 + easing del juego
  V.cmdA = a; V.cmdS = s; V.gas = a;
  FIS.saltoCD = Math.max(0, FIS.saltoCD - dt);

  // subpasos fijos de 1/60: updatePrePhysics -> updateVehicle -> step
  sobrante = Math.min(sobrante + dt, PASO_FIS * 3);
  while (sobrante >= PASO_FIS - 1e-9) {
    sobrante -= PASO_FIS;
    const lv = FIS.body.linvel();
    const q = FIS.body.rotation();
    _qb.set(q.x, q.y, q.z, q.w);
    _fw.set(1, 0, 0).applyQuaternion(_qb);
    const rapidezM = Math.hypot(lv.x, lv.y, lv.z);
    const vLargoM = lv.x * _fw.x + lv.y * _fw.y + lv.z * _fw.z;
    const adelante = rapidezM < 0.05 || vLargoM / Math.max(rapidezM, 0.001) > 0.5;

    // updatePrePhysics del juego, valor a valor. CLAVE: el juego multiplica la
    // fuerza de motor y el freno por ticker.deltaScaled (~el timestep) antes de
    // setWheelEngineForce. Sin ese factor la fuerza es ~60x y el coche hace el
    // caballito y vuelca. deltaScaled = paso fijo = 1/60.
    const DS = PASO_FIS;
    const topSpeed = 5 + (40 - 5) * V.boost;               // topSpeed / topSpeedBoost
    const overflow = Math.max(0, rapidezM - topSpeed);
    let engine = a * (1 + V.boost * 2) * 300 / (1 + overflow) * DS;   // engineForceAmplitude 300 x deltaScaled
    let brake = Math.abs(a) < 0.1 ? 0.06 : 0;              // idleBrake
    if (rapidezM > 0.5 && ((a > 0 && !adelante) || (a < 0 && adelante))) { brake = 0.4; engine = 0; }  // reverseBrake
    brake *= 35 * DS;                                      // brakeAmplitude x deltaScaled
    FIS.ctrl.setWheelSteering(0, STEER_SIGN * V.giro);
    FIS.ctrl.setWheelSteering(1, STEER_SIGN * V.giro);
    // freno de mano: agarre trasero interpolado (0.9 -> 0.28), nunca a cero de
    // golpe; rompe adherencia progresivamente en vez de girar sobre si mismo
    V.mano += ((pulsada(MANO) ? 1 : 0) - V.mano) * Math.min(1, PASO_FIS * 12);
    // agarre de la superficie bajo el coche (arena / hierba / asfalto)
    const gz = agarreEn(FIS.body.translation().x * ESCALA, FIS.body.translation().z * ESCALA);
    for (let i = 0; i < 4; i++) {
      const trasera = i >= 2;
      FIS.ctrl.setWheelFrictionSlip(i, (0.9 - (trasera ? 0.62 * V.mano : 0)) * gz);
      FIS.ctrl.setWheelSideFrictionStiffness(i, (3 - (trasera ? 2.55 * V.mano : 0)) * gz);
    }
    for (let i = 0; i < 4; i++) { FIS.ctrl.setWheelEngineForce(i, engine); FIS.ctrl.setWheelBrake(i, brake); }
    FIS.ctrl.updateVehicle(PASO_FIS);
    FIS.world.step();
  }
  V.frenando = a < 0 && V.largo > 0.8;

  // estado del cuerpo -> V y transformada visual (posiciones x1.6)
  const t = FIS.body.translation(), q2 = FIS.body.rotation(), lv2 = FIS.body.linvel();
  _qb.set(q2.x, q2.y, q2.z, q2.w);
  _fw.set(1, 0, 0).applyQuaternion(_qb);
  _sd.set(0, 0, 1).applyQuaternion(_qb);
  _upv.set(0, 1, 0).applyQuaternion(_qb);
  V.rumbo = Math.atan2(_fw.x, _fw.z);
  let enSuelo = 0;
  for (let i = 0; i < 4; i++) if (FIS.ctrl.wheelIsInContact(i)) enSuelo++;
  V.aire = enSuelo === 0;

  // calibracion en reposo, SOLO sobre suelo llano y con el coche derecho.
  // Antes se calibraba en cualquier parada: parar en lo alto de una rampa o
  // apoyado en una caja corria el cero, y al volver al llano el coche se
  // PINTABA hundido bajo el mapa aunque el cuerpo fisico siguiera arriba
  // (ese era el "atravesar el mapa" de las capturas; por eso la red de
  // seguridad no saltaba).
  const rapidezXZ = Math.hypot(lv2.x, lv2.z);
  const gLlano = terreno(t.x * ESCALA, t.z * ESCALA).y < 0.01;
  if (enSuelo === 4 && rapidezXZ < 0.4 && gLlano && _upv.y > 0.95) {
    FIS.rest += (t.y - FIS.rest) * Math.min(1, dt * 3);
    let media = 0;
    for (let i = 0; i < 4; i++) media += FIS.ctrl.wheelSuspensionLength(i) || 0.5;
    FIS.lenRest += (media / 4 - FIS.lenRest) * Math.min(1, dt * 3);
  }
  // el offset centro-del-cuerpo -> origen visual es LOCAL del cuerpo: se rota
  // con el chasis. Restarlo siempre en vertical enterraba el modelo ~0.7 m al
  // quedar tumbado (el "atravesar el mapa" de la foto contra la caja);
  // derecho, es matematicamente identico a t.y - rest.
  _vv.set(0, -FIS.rest, 0).applyQuaternion(_qb);
  let yVis = (t.y + _vv.y) * ESCALA;
  if (_upv.y > 0.6) {
    // con el coche derecho, el cuerpo jamas se PINTA bajo su cota de apoyo:
    // una compresion brutal de suspension (aterrizaje, choque) hundia el
    // dibujo aunque el cuerpo fisico siguiera sobre el suelo. Volcado o de
    // lado NO se capa: ahi la cota baja es legitima (techo contra el suelo).
    const gVis = terreno(t.x * ESCALA, t.z * ESCALA).y;
    yVis = Math.max(yVis, gVis - 0.24);
  }
  coche.position.set((t.x + _vv.x) * ESCALA, yVis, (t.z + _vv.z) * ESCALA);
  coche.quaternion.copy(_qb).multiply(QY90);
  V.x = coche.position.x; V.y = Math.max(0, coche.position.y); V.z = coche.position.z;
  V.vx = lv2.x * ESCALA; V.vz = lv2.z * ESCALA;
  V.largo = (lv2.x * _fw.x + lv2.y * _fw.y + lv2.z * _fw.z) * ESCALA;
  V.lateral = (lv2.x * _sd.x + lv2.y * _sd.y + lv2.z * _sd.z) * ESCALA;
  const objDerrape = V.aire ? 0 : Math.max(THREE.MathUtils.clamp((Math.abs(V.lateral) - 1.5) / 4, 0, 1), V.mano * (rapidezXZ > 1.5 ? 0.85 : 0));
  V.derrape += (objDerrape - V.derrape) * Math.min(1, dt * 9);

  // aterrizaje: hundimiento del cuerpo, polvo y piston
  if (prevAire && !V.aire) {
    const golpe = Math.max(0, -prevVy) * ESCALA;
    if (golpe > 3) {
      S.vy -= Math.min(0.5, golpe * 0.04);
      for (let k = 0; k < 5; k++) lanzaPolvo(V.x, V.y, V.z, 1.1 + golpe * 0.12);
      unaVez('suspension', Math.min(1, golpe * 0.1));
    }
  }
  prevAire = V.aire; prevVy = lv2.y;

  // en el aire, un par proporcional-derivativo endereza el chasis hacia el
  // horizonte: sin esto un salto de canto te dejaba cayendo de techo
  if (V.aire) {
    const av = FIS.body.angvel();
    const kP = 0.85 * FIS.masa, kD = 0.28 * FIS.masa;
    FIS.body.applyTorqueImpulse({
      x: (-_upv.z * kP - av.x * kD) * dt,
      y: -av.y * kD * 0.35 * dt,
      z: (_upv.x * kP - av.z * kD) * dt,
    }, true);
  }

  // RED DE SEGURIDAD: si por una penetracion imposible de evitar al 100% el
  // cuerpo acaba bajo el mundo o fuera de limites, reaparece en el ultimo punto
  // donde estuvo apoyado y derecho, en vez de quedar debajo del mapa.
  if (t.y < -1.2 || Math.abs(t.x) > 80 || Math.abs(t.z) > 80) {
    FIS.body.setTranslation({ x: FIS.safe.x, y: FIS.rest + 1.2, z: FIS.safe.z }, true);
    FIS.body.setRotation(Q_SPAWN, true);
    FIS.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    FIS.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  } else if (enSuelo === 4 && _upv.y > 0.9) {
    FIS.safe.x = t.x; FIS.safe.z = t.z;
  }

  // impacto: perdida subita de rapidez horizontal en un solo cuadro
  const caida = FIS.rapPrev - rapidezXZ;
  if (caida > 2.2 && !V.aire) {
    S.vcab -= Math.min(0.55, caida * 0.06);      // el morro pica
    S.vrol += (Math.random() - 0.5) * caida * 0.05;
    // que sonido: si hay un objeto golpeable cerca es ladrillo, si no metal
    let cerca = false;
    for (const ob of FIS.obst) {
      const d = Math.hypot(ob.m.position.x - V.x, ob.m.position.z - V.z);
      if (d < 3.4) { cerca = true; break; }
    }
    unaVez(cerca ? 'golpeLadrillo' : 'golpeMetal', Math.min(1, caida * 0.16), 0.9 + Math.random() * 0.2);
    unaVez('suspension', Math.min(0.7, caida * 0.09), 0.85);
    for (let k = 0; k < 3; k++) lanzaPolvo(V.x, V.y, V.z, 0.9 + caida * 0.1);
  }
  FIS.rapPrev = rapidezXZ;

  // checkpoint: sonar una vez al entrar en cada zona, no en bucle
  const zonaAhora = ZONAS.findIndex((zo) => Math.hypot(V.x - zo.x, V.z - zo.z) < zo.r);
  if (zonaAhora !== FIS.zonaPrev) {
    if (zonaAhora >= 0) unaVez('checkpoint', 0.45);
    FIS.zonaPrev = zonaAhora;
  }

  // enderezado automatico: volcado O apoyado de lado (como contra una caja),
  // quieto durante 2 s -> flip asistido. El umbral viejo (0.15) solo cubria
  // estar boca abajo del todo.
  if (_upv.y < 0.55 && rapidezXZ < 1.5) FIS.volcado += dt; else FIS.volcado = 0;
  if (FIS.volcado > 2) { FIS.volcado = 0; FIS.saltoCD = 0; salto(); }

  // ruedas: carrera de suspension REAL del controller sobre la cota autorada
  for (let i = 0; i < 4; i++) {
    const r = ruedas[i];
    if (!r) break;
    let len = FIS.ctrl.wheelSuspensionLength(i);
    if (!(len > 0)) len = FIS.lenRest;
    const y = THREE.MathUtils.clamp(Y_RUEDA + (FIS.lenRest - len), -0.62, -0.24);
    r.container.position.y += (y - r.container.position.y) * Math.min(1, dt * 25);
    if (r.suspension) r.suspension.scale.y = Math.max(0.05, Math.abs(r.container.position.y) - 0.42 + 0.05);
    if (r.front) r.container.rotation.y = r.baseY + V.giro;
    if (r.cylinder) {
      const paso = THREE.MathUtils.clamp((V.largo * dt) / R, -0.3, 0.3);
      r.cylinder.rotation.z += r.flip ? paso : -paso;
    }
  }

  // objetos golpeables: espejo visual de sus cuerpos rigidos
  for (const ob of FIS.obst) {
    const bt = ob.body.translation(), bq = ob.body.rotation();
    _qb.set(bq.x, bq.y, bq.z, bq.w);
    _vv.copy(ob.oL).applyQuaternion(_qb);
    ob.m.position.set((bt.x + _vv.x) * ESCALA, (bt.y + _vv.y) * ESCALA, (bt.z + _vv.z) * ESCALA);
    ob.m.quaternion.copy(_qb);
  }

  aplicaSuspension(dt, 0, 0, 0);   // el resorte visual solo conserva el golpe de aterrizaje
  sombra.position.set(V.x, 0.006, V.z);
  presenta(dt);
}

// Lo que solo hace falta una vez por cuadro dibujado: rastro, polvo, camara, luz
// y sonido. Separado de la fisica para no repetirlo en cada subpaso.
function presenta(dt) {
  cuadro++;
  const nX = Math.sin(V.rumbo), nZ = Math.cos(V.rumbo);
  const rapidez = Math.hypot(V.vx, V.vz);
  marcaHuella(dt, nX, nZ);
  refrescaPolvo(dt);
  actualizaSonido(rapidez, V.derrape, V.gas, dt);
  apuntaAntena(dt, V.x, V.z, V.rumbo, V.x + nX * 35, V.z + nZ * 35);
  luces(dt, V.cmdA, V.frenando, V.cmdS);
  celdasBoost();

  emiteEstelas();
  refrescaEstelas(dt);

  // camara: se abre y se eleva con la velocidad, gira un poco con el rumbo y
  // mira por delante del coche
  const gc = V.rumbo * 0.3, dist = (8.4 + rapidez * 0.30) * 0.66;
  const cosg = Math.cos(gc), sing = Math.sin(gc);
  _tmpA.set(V.x + (cosg + sing) * dist, 8.4 + rapidez * 0.16 + V.y, V.z + (cosg - sing) * dist);
  _tmpA.sub(CAM.pos).multiplyScalar(21.16).addScaledVector(CAM.vel, -9.2);
  CAM.vel.addScaledVector(_tmpA, dt);
  CAM.pos.addScaledVector(CAM.vel, dt);
  _tmpB.set(V.x + nX * rapidez * 0.30, 1.1 + V.y, V.z + nZ * rapidez * 0.30);
  CAM.mira.lerp(_tmpB, Math.min(1, dt * 4.5));

  // el encuadre de sombra es de 11 m: si no viaja con el coche, la sombra
  // desaparece en cuanto te alejas del origen
  if (luzSol) {
    luzSol.position.set(V.x + 5.4, 7.0, V.z + 3.8);
    luzSol.target.position.set(V.x, 0, V.z);
    luzSol.target.updateMatrixWorld();
    luzSol.target.position.set(V.x, 0, V.z);
    luzSol.target.updateMatrixWorld();
  }

  // se apunta la camara a mano: controls.update() rehace toda su trigonometria
  // y el visor ya lo llama una vez por cuadro por su cuenta
  stage._controls.target.copy(CAM.mira);
  stage._camera.position.copy(CAM.pos);
  stage._camera.lookAt(CAM.mira);
}

function pasoDemo(dt, t) {
  // volante y gas suaves; el mastil rastrea un objetivo que orbita el coche,
  // como hace el juego cuando hay un objetivo cerca
  const vuelta = Math.sin(t * 0.75) * 0.8 + Math.sin(t * 1.9) * 0.2;
  const gas = Math.cos(t * 0.8);
  V.giro += (vuelta * 0.5 - V.giro) * Math.min(1, dt * 16);
  const vel = 7 + gas * 4.5;
  const paso = THREE.MathUtils.clamp((vel * dt) / R, -0.30, 0.30);
  for (const r of ruedas) {
    if (r.cylinder) r.cylinder.rotation.z += r.flip ? paso : -paso;
    if (r.front) r.container.rotation.y = r.baseY + V.giro;
  }
  const acelLong = -Math.sin(t * 0.8) * 3.6;
  const acelLat = vel * (vel / 2.55) * Math.tan(V.giro) * 0.12;
  aplicaSuspension(dt, acelLong, acelLat, Math.sin(t * 5.3) * 0.005);
  apuntaAntena(dt, 0, 0, 0, Math.sin(t * 0.35) * 26, Math.cos(t * 0.35) * 26);
  luces(dt, gas, false, vuelta);
  celdasBoost();
}

let raf = 0, tDemo = 0, marca = 0;

// La simulacion avanza cuando el visor dibuja, no en un bucle propio: asi nunca
// se desincroniza del render ni sigue corriendo con la pestana en segundo plano.
// Va colgada de la ESCENA, no de una malla: cualquier malla puede quedar fuera
// del frustum y ser descartada, y entonces el juego entero se congela.
stage._scene.onBeforeRender = () => {
  const ahora = performance.now();
  const dt = marca ? Math.min(0.05, (ahora - marca) / 1000) : 0.016;
  marca = ahora;
  if (modo === 'conduccion') pasoConduccion(dt);
  else if (modo === 'demo') { tDemo += dt; pasoDemo(dt, tDemo); }
  else apuntaAntena(dt, 0, 0, 0, 18, 26);
};
function arranca() {
  marca = 0;
  tDemo = 0;
}

/* ---------- encuadres guardados ---------- */
const ENCUADRES = {
  iso: [[0.66, 0.82, 0.66], 2.5],
  frontal: [[0.02, 0.30, 1], 2.4],
  trasera: [[-0.02, 0.30, -1], 2.4],
  cenital: [[0.001, 1, 0.03], 2.15],
};
function encuadre(nombre) {
  const cam = stage._camera, ctrl = stage._controls;
  if (!cam || !ctrl) return;
  const [dir, f] = ENCUADRES[nombre] || ENCUADRES.iso;
  const c = caja.getCenter(new THREE.Vector3());
  const d = caja.getBoundingSphere(new THREE.Sphere()).radius * f;
  cam.position.copy(c).add(new THREE.Vector3(...dir).normalize().multiplyScalar(d));
  ctrl.target.copy(c);
  ctrl.update();
  ctrl.autoRotate = false;
}

/* ---------- controles del visor ---------- */
const guarda = (k, v) => { try { localStorage.setItem('coche4x4:' + k, v); } catch (e) { /* modo privado */ } };
const lee = (k) => { try { return localStorage.getItem('coche4x4:' + k); } catch (e) { return null; } };
const marcar = (cont, b) => { for (const o of cont.querySelectorAll('button')) o.setAttribute('aria-pressed', String(o === b)); };

const vistas = document.getElementById('vistas');
function ponVista(nombre) {
  encuadre(nombre);
  marcar(vistas, vistas.querySelector('[data-vista="' + nombre + '"]'));
  guarda('vista', nombre);
}
vistas.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-vista]');
  if (b) { if (modo === 'conduccion') salirConduccion(); ponVista(b.dataset.vista); }
});

/* ---------- menu de juego ---------- */
const btnMenu = document.getElementById('menu-btn');
function ponMenu(abierto) {
  document.body.classList.toggle('menu-abierto', abierto);
  btnMenu.setAttribute('aria-pressed', String(abierto));
  guarda('menu', abierto ? '1' : '0');
}
btnMenu.addEventListener('click', () => ponMenu(!document.body.classList.contains('menu-abierto')));
ponMenu(lee('menu') !== '0');

/* ---------- vehiculo: alterna carroceria sin tocar la fisica ---------- */
const selCoche = document.getElementById('vehiculo');
function ponVehiculo(cual) {
  const viejo = cual === 'oldschool';
  modeloCuerpo.visible = !viejo;
  carroceriaViejo.visible = viejo;
  marcar(selCoche, selCoche.querySelector('[data-coche="' + cual + '"]'));
  guarda('vehiculo', cual);
}
selCoche.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-coche]');
  if (b) ponVehiculo(b.dataset.coche);
});

/* ---------- pinturas: como paints.changeTo() ---------- */
const pintura = document.getElementById('pintura');
function ponPintura(nombre) {
  for (const o of pintables) o.material = nombre === 'rojo' ? pinturasOriginales.get(o) : PINTURAS[nombre];
  const b = pintura.querySelector('[data-pintura="' + nombre + '"]');
  marcar(pintura, b);
  const eti = document.getElementById('pintura-nombre');
  if (eti && b) eti.textContent = b.title;
  guarda('pintura2', nombre);
  unaVez('pintura', 0.5);   // spray real del juego
}
pintura.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-pintura]');
  if (b) ponPintura(b.dataset.pintura);
});

const btnWire = document.getElementById('wire');
btnWire.addEventListener('click', () => {
  const activo = btnWire.getAttribute('aria-pressed') !== 'true';
  btnWire.setAttribute('aria-pressed', String(activo));
  for (const m of MATS) m.wireframe = activo;
});

const btnFondo = document.getElementById('fondo');
function ponFondo(oscuro) {
  btnFondo.setAttribute('aria-pressed', String(oscuro));
  btnFondo.textContent = oscuro ? 'Fondo claro' : 'Fondo oscuro';
  stage.style.setProperty('--stage-bg', oscuro ? '#1B1E24' : '#EFF1F6');
  suelo.material.color.set(oscuro ? '#22262E' : '#DDE1E9');
  guarda('fondo', oscuro ? '1' : '0');
}
btnFondo.addEventListener('click', () => ponFondo(btnFondo.getAttribute('aria-pressed') !== 'true'));

const btnSonido = document.getElementById('sonido');
btnSonido.addEventListener('click', () => {
  AUDIO.on = !AUDIO.on;
  btnSonido.setAttribute('aria-pressed', String(AUDIO.on));
  if (AUDIO.on) { cargaAudio(); if (AUDIO.ctx && AUDIO.ctx.state === 'suspended') AUDIO.ctx.resume(); }
  else paraSonido();
  guarda('sonido', AUDIO.on ? '1' : '0');
});

const btnAnim = document.getElementById('anim');
btnAnim.addEventListener('click', () => {
  if (modo === 'conduccion') salirConduccion();
  const activo = modo !== 'demo';
  modo = activo ? 'demo' : 'inspeccion';
  btnAnim.setAttribute('aria-pressed', String(activo));
  if (activo) arranca(); else { modo = 'inspeccion'; reposo(); }
});

/* ---------- modo conducción: sin interfaz, como la referencia ---------- */
const btnDrive = document.getElementById('drive');
const salida = document.getElementById('salida');

function entraConduccion() {
  if (!FIS.listo) { console.error('Rapier no cargo; no hay conduccion'); return; }
  modo = 'conduccion';
  btnAnim.setAttribute('aria-pressed', 'false');
  btnDrive.setAttribute('aria-pressed', 'true');
  document.body.classList.add('conduciendo');
  salida.hidden = false;
  mundo.visible = true;
  if (AUDIO.on) { cargaAudio(); if (AUDIO.ctx && AUDIO.ctx.state === 'suspended') AUDIO.ctx.resume(); }
  stage._controls.enabled = false;
  stage._controls.autoRotate = false;
  reposo();
  const cam = stage._camera, ctrl = stage._controls;
  cam.position.set(7.5, 9.2, 7.5);
  cam.far = Math.max(cam.far, 400);
  cam.updateProjectionMatrix();
  // hay que apuntar la camara AQUI: con los controles desactivados nadie mas la
  // reorienta, y viniendo de la vista cenital miraria al suelo
  ctrl.target.set(0, 1.1, 0);
  cam.lookAt(ctrl.target);
  arranca();
}
function salirConduccion() {
  modo = 'inspeccion';
  if (luzSol) {
    luzSol.position.set(5.4, 7.0, 3.8);
    luzSol.target.position.set(0, 0, 0);
    luzSol.target.updateMatrixWorld();
  }
  btnDrive.setAttribute('aria-pressed', 'false');
  document.body.classList.remove('conduciendo');
  salida.hidden = true;
  mundo.visible = false;
  stage._controls.enabled = true;
  teclas.clear();
  reposo();
  encuadre(lee('vista') || 'iso');
}
btnDrive.addEventListener('click', () => {
  if (modo === 'conduccion') salirConduccion(); else entraConduccion();
});
salida.addEventListener('click', salirConduccion);

// Controles tactiles: alimentan el MISMO conjunto de teclas que el teclado, asi
// que la fisica no sabe de donde viene la entrada.
const tactil = document.getElementById('tactil');
if (matchMedia('(pointer: coarse)').matches) document.body.classList.add('tactil');
for (const b of tactil.querySelectorAll('button[data-tecla]')) {
  const pulsa = (v) => (ev) => {
    ev.preventDefault();
    if (v) teclas.add(b.dataset.tecla); else teclas.delete(b.dataset.tecla);
    b.setAttribute('aria-pressed', String(v));
  };
  b.addEventListener('pointerdown', pulsa(true));
  b.addEventListener('pointerup', pulsa(false));
  b.addEventListener('pointercancel', pulsa(false));
  b.addEventListener('pointerleave', pulsa(false));
}

addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (AUDIO.on && !AUDIO.ctx) cargaAudio();
  if (modo === 'conduccion' && k === 'h' && !teclas.has('h')) unaVez('bocina', 0.55);   // bocina real del juego
  if (modo === 'conduccion' && k === ' ' && !teclas.has(' ')) salto();                   // flip.jump del juego
  if (modo === 'conduccion' && k === 'escape') { salirConduccion(); return; }
  if (modo !== 'conduccion') return;
  if (k.startsWith('arrow') || ' wasdqz'.includes(k)) e.preventDefault();
  teclas.add(k);
});
addEventListener('keyup', (e) => teclas.delete(e.key.toLowerCase()));
addEventListener('blur', () => teclas.clear());

/* ---------- estado recordado entre recargas ---------- */
const vistaGuardada = lee('vista');
ponVista(vistaGuardada && ENCUADRES[vistaGuardada] ? vistaGuardada : 'iso');
if (lee('fondo') === '1') ponFondo(true);
if (lee('vehiculo') === 'oldschool') ponVehiculo('oldschool');
const pinturaGuardada = lee('pintura2');
if (pinturaGuardada && pinturaGuardada !== 'rojo' && PINTURAS[pinturaGuardada]) ponPintura(pinturaGuardada);
if (lee('sonido') === '1') { AUDIO.on = true; btnSonido.setAttribute('aria-pressed', 'true'); }

/* ---------- rendimiento: congelar matrices de lo estatico ---------- */
{
  const dinamicos = new Set(FIS.obst.map((o) => o.m));
  if (typeof sombra !== 'undefined' && sombra) dinamicos.add(sombra);
  mundo.traverse((o) => {
    if (dinamicos.has(o)) return;
    o.updateMatrix();
    o.matrixAutoUpdate = false;
  });
}

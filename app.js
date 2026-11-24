"use strict";

(() => {
  const THREE = window.THREE;
  const canvas = document.querySelector("#world");
  const welcome = document.querySelector("#welcome-screen");
  const craftDialog = document.querySelector("#craft-dialog");
  const marketDialog = document.querySelector("#market-dialog");
  const timeButtons = [...document.querySelectorAll(".time-button")];
  const sceneTitle = document.querySelector("#scene-title");
  const sceneCaption = document.querySelector("#scene-caption");
  const sceneDescription = document.querySelector("#scene-description");
  const offeringButton = document.querySelector("#offering-button");
  const fireworkControl = document.querySelector("#firework-control");
  const colorPicker = document.querySelector("#firework-color");
  const dockViewButton = document.querySelector("#dock-view-button");
  const overviewButton = document.querySelector("#overview-button");
  const toast = document.querySelector("#toast");
  const photoInput = document.querySelector("#visitor-photo");
  const photoPreview = document.querySelector("#photo-preview");

  if (!THREE) {
    showToast("โหลด Three.js ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วเปิดหน้านี้อีกครั้ง");
    return;
  }

  const timeContent = {
    morning: ["เช้าบุญ", "เช้าบุญ — พระออกบิณฑบาต", "แสงแรกอาบองค์พระธาตุ ผู้คนรอใส่บาตรและเดินชมตลาดเก่า", "พระเดินบิณฑบาตในลานกลาง แตะร้านค้าเพื่อชมสินค้า"],
    evening: ["ย่ำค่ำ", "ย่ำค่ำ — เริ่มเทศกาล", "แสงอาทิตย์อัสดง ตลาดเริ่มคึกคัก กระทงแรกค่อย ๆ ลอยไปตามสายน้ำ", "ร่วมเดินชมตลาด ลอยกระทง แล้วมองโคมแรกที่ลอยขึ้นฟ้า"],
    night: ["คืนวันเพ็ญ", "คืนวันเพ็ญ — โคมลอยเต็มฟ้า", "แสงเทียนและโคมกระดาษส่องประกายเหนือสายน้ำ พร้อมมหรสพยามค่ำ", "สร้างโคมลอย หรือเลือกสีพลุแล้วแตะฉากเพื่อจุด"]
  };
  const krathongTypes = [
    { name: "ใบตองดั้งเดิม", symbol: "✿", color: "#83a96e", petals: "#e9c989" },
    { name: "กลีบบัวชมพู", symbol: "❀", color: "#d8879d", petals: "#f4c9d0" },
    { name: "ดอกบัวม่วง", symbol: "✿", color: "#a28cbf", petals: "#d1bbdf" },
    { name: "ดาวเรืองทอง", symbol: "✽", color: "#d29d42", petals: "#f1d378" },
    { name: "กาบกล้วยรักษ์โลก", symbol: "❋", color: "#728d56", petals: "#c2cf8a" },
    { name: "กลีบบัวขาว", symbol: "✿", color: "#ded6c2", petals: "#fff2dc" },
    { name: "ดอกพุดหอม", symbol: "❀", color: "#e9c2a3", petals: "#fff0d6" },
    { name: "ดอกไม้หลากสี", symbol: "✽", color: "#bf7281", petals: "#f0ce77" },
    { name: "กระทงสายรุ้ง", symbol: "❋", color: "#73aaa0", petals: "#e9a1a0" }
  ];
  const lanternTypes = [
    { name: "โคมล้านนาลายคำ", color: "#e6a947", trim: "#ffe0a0" },
    { name: "โคมลายดอกพิกุล", color: "#c94f43", trim: "#f5d18a" },
    { name: "โคมไทลื้อลายคราม", color: "#456a98", trim: "#e5cb91" },
    { name: "โคมผ้าฝ้ายย้อมคราม", color: "#567c78", trim: "#e3c18a" },
    { name: "โคมแดงชาดล้านนา", color: "#a93f35", trim: "#f2cd7a" },
    { name: "โคมม่วงดอกเอื้อง", color: "#805779", trim: "#f1d29a" },
    { name: "โคมบัวหลวง", color: "#cb7d83", trim: "#fff0d5" },
    { name: "โคมกระดาษสาธรรมชาติ", color: "#bd9a65", trim: "#f5dfb1" },
    { name: "โคมลายเครือเถา", color: "#718451", trim: "#f6d18b" }
  ];
  const stalls = [
    { x: -7.1, z: -1.5, name: "ขนมไทยป้านวล", items: [["ข้าวเหนียวมะม่วง", "45 บ."], ["ขนมชั้นใบเตย", "25 บ."], ["ทองหยิบทองหยอด", "35 บ."]], color: "#a75d43" },
    { x: -7.1, z: 1.4, name: "สำรับพื้นบ้าน", items: [["ข้าวซอยไก่", "65 บ."], ["น้ำพริกอ่อง", "50 บ."], ["ไส้อั่วสมุนไพร", "55 บ."]], color: "#a78050" },
    { x: -7.1, z: 4.3, name: "ดอกไม้บูชา", items: [["พวงมาลัยมะลิ", "40 บ."], ["ดอกบัวคู่", "30 บ."], ["ธูปเทียนหอม", "25 บ."]], color: "#9b6674" },
    { x: 7.1, z: -1.5, name: "ผ้าไหมเมืองเหนือ", items: [["ผ้าพันคอทอมือ", "280 บ."], ["ถุงย่ามลายดอก", "190 บ."], ["พวงกุญแจผ้า", "65 บ."]], color: "#795c73" },
    { x: 7.1, z: 1.4, name: "งานหัตถกรรม", items: [["โคมกระดาษสา", "150 บ."], ["ร่มบ่อสร้าง", "320 บ."], ["พัดสานไม้ไผ่", "85 บ."]], color: "#55766c" },
    { x: 7.1, z: 4.3, name: "น้ำสมุนไพรยายคำ", items: [["น้ำอัญชันมะนาว", "35 บ."], ["น้ำเก๊กฮวย", "30 บ."], ["น้ำลำไย", "35 บ."]], color: "#977244" }
  ];
  const state = {
    time: "morning", scene: null, camera: null, renderer: null, clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(), pointer: new THREE.Vector2(), ground: null,
    characters: [], stalls: [], krathongs: [], lanterns: [], fireworks: [],
    ambientLights: [], particles: [], photo: null, craftMode: "krathong",
    offeringCount: 0, soundOn: false, audio: null, toastTimer: 0, waterTick: 0,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    water: null, waterMaterial: null, moon: null, moonDisk: null, starField: null, stageLights: [],
    pier: null, skyMaterial: null, sceneReady: false, lastOfferAt: 0,
    cameraControl: { target: new THREE.Vector3(0, 1.4, -1), theta: 0, phi: 1.18, distance: 25, dragging: null, moved: false, dockView: false, touchPointers: new Map(), multiTouch: false, pinchDistance: 0, followTarget: null },
    renderInterval: 1000 / 30, lastRender: 0, nextFireworkAt: 0, ambientRaftTarget: 6, skyElapsed: 0
  };

  const rand = (min, max) => min + Math.random() * (max - min);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const color = (value) => new THREE.Color(value);
  const krathongFlowZ = -15.75;
  const riverZBounds = { near: -7.2, far: -29 };
  const materialCache = new Map();
  const incenseSmokeMaterial = new THREE.MeshBasicMaterial({ color: "#e8dbc4", transparent: true, opacity: .2, depthWrite: false });
  const material = (value, extra = {}) => {
    const key = `${value}:${JSON.stringify(extra)}`;
    if (!materialCache.has(key)) materialCache.set(key, new THREE.MeshStandardMaterial({ color: value, roughness: .78, ...extra }));
    return materialCache.get(key);
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function addMesh(parent, geometry, meshMaterial, position, rotation = null) {
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.position.set(position[0], position[1], position[2]);
    if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    parent.add(mesh);
    return mesh;
  }

  function makeWishTexture(wish, fill = "#f4e3bf", ink = "#493626") {
    const surface = document.createElement("canvas");
    surface.width = 512;
    surface.height = 96;
    const paint = surface.getContext("2d");
    paint.fillStyle = fill;
    paint.fillRect(0, 0, surface.width, surface.height);
    paint.strokeStyle = "#b99965";
    paint.lineWidth = 5;
    paint.strokeRect(4, 4, surface.width - 8, surface.height - 8);
    paint.fillStyle = ink;
    paint.font = "34px Kanit, sans-serif";
    paint.textAlign = "center";
    paint.textBaseline = "middle";
    paint.fillText(wish || "ขอให้มีความสุข", surface.width / 2, surface.height / 2, surface.width - 30);
    const texture = new THREE.CanvasTexture(surface);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }

  function makeLanternModel(typeIndex, ambient = false, image = null, wish = "") {
    const type = lanternTypes[typeIndex % lanternTypes.length];
    const group = new THREE.Group();
    const paper = material(type.color, { side: THREE.DoubleSide, emissive: type.color, emissiveIntensity: .08, roughness: .9 });
    const trim = material(type.trim, { metalness: .1, roughness: .68, emissive: type.trim, emissiveIntensity: .04 });
    addMesh(group, new THREE.CylinderGeometry(.34, .38, .82, 10, 4, false), paper, [0, .49, 0]);
    addMesh(group, new THREE.TorusGeometry(.38, .022, 4, 10), trim, [0, .09, 0]);
    addMesh(group, new THREE.TorusGeometry(.34, .022, 4, 10), trim, [0, .90, 0]);
    if (image) {
      const texture = new THREE.CanvasTexture(image);
      addMesh(group, new THREE.PlaneGeometry(.21, .22), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }), [0, .47, .285]);
    }
    if (wish) {
      const wishTexture = makeWishTexture(wish);
      addMesh(group, new THREE.PlaneGeometry(.31, .12), new THREE.MeshBasicMaterial({ map: wishTexture, transparent: true, side: THREE.DoubleSide }), [0, .48, .355]);
    }
    const ribPositions = [];
    for (let i = 0; i < 10; i++) {
      const angle = i * Math.PI / 5;
      const x = Math.cos(angle), z = Math.sin(angle);
      ribPositions.push(x * .36, .12, z * .36, x * .32, .86, z * .32);
    }
    const ribsGeometry = new THREE.BufferGeometry();
    ribsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(ribPositions, 3));
    group.add(new THREE.LineSegments(ribsGeometry, new THREE.LineBasicMaterial({ color: type.trim })));
    const flame = addMesh(group, new THREE.ConeGeometry(.055, .15, 6), material("#ffd990", { emissive: "#ff9d38", emissiveIntensity: .75 }), [0, .08, 0]);
    group.userData = {
      typeIndex, flame, phase: rand(0, Math.PI * 2),
      windX: rand(-.42, .42), windZ: rand(-.34, .34)
    };
    return group;
  }

  function makeKrathong(typeIndex, name = "", image = null, ambient = false, wish = "") {
    const type = krathongTypes[typeIndex % krathongTypes.length];
    const group = new THREE.Group();
    const leaf = material(type.color, { side: THREE.DoubleSide, roughness: .86 });
    const flower = material(type.petals, { side: THREE.DoubleSide, emissive: type.petals, emissiveIntensity: ambient ? .02 : .05 });
    const base = addMesh(group, new THREE.CylinderGeometry(.40, .31, .12, 9, 1), leaf, [0, .095, 0]);
    base.rotation.x = .015;
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 4;
      const petal = addMesh(group, new THREE.ConeGeometry(.095, .20, 5), flower, [Math.sin(angle) * .26, .23, Math.cos(angle) * .26]);
      petal.rotation.x = .7;
      petal.rotation.z = Math.cos(angle) * .25;
    }
    addMesh(group, new THREE.CylinderGeometry(.06, .04, .16, 8), material("#e2b974"), [0, .29, 0]);
    const candle = addMesh(group, new THREE.ConeGeometry(.035, .11, 8), material("#fff0b0", { emissive: "#ffbf48", emissiveIntensity: 1.8 }), [0, .42, 0]);
    const glow = addMesh(group, new THREE.SphereGeometry(.045, 6, 5), material("#fff0b0", { emissive: "#ffbf48", emissiveIntensity: .6 }), [0, .47, 0]);
    const incenseTips = [], smoke = [];
    for (const x of [-.09, .09]) {
      addMesh(group, new THREE.CylinderGeometry(.008, .01, .18, 5), material("#72563b"), [x, .36, .12]);
      incenseTips.push(addMesh(group, new THREE.SphereGeometry(.018, 5, 4), material("#ffb35c", { emissive: "#ff672f", emissiveIntensity: 1.1 }), [x, .46, .12]));
      const trail = addMesh(group, new THREE.SphereGeometry(.025, 5, 4), incenseSmokeMaterial, [x, .52, .12]);
      smoke.push(trail);
    }
    if (image) {
      const texture = new THREE.CanvasTexture(image);
      const photo = addMesh(group, new THREE.PlaneGeometry(.21, .21), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }), [0, .53, .10]);
      photo.rotation.x = -.3;
    }
    if (wish) {
      const wishTexture = makeWishTexture(wish);
      const wishLabel = addMesh(group, new THREE.PlaneGeometry(.88, .18), new THREE.MeshBasicMaterial({ map: wishTexture, side: THREE.DoubleSide }), [0, .45, .29]);
      wishLabel.rotation.x = -.16;
    }
    group.userData = { name, typeIndex, candle, glow, incenseTips, smoke, phase: rand(0, Math.PI * 2), wish };
    return group;
  }

  function keepKrathongClearOfPier(krathong) {
    const { position, userData } = krathong;
    if (position.z >= -15.4 && position.z <= -5.2 && Math.abs(position.x) < 3.25) {
      const side = userData.waterSide || (position.x < 0 ? -1 : 1);
      userData.waterSide = side;
      position.x = side * 3.25;
    }
  }

  function launchKrathongFromPier(krathong, startX = -2.2) {
    krathong.position.set(clamp(startX, -2.8, 2.2), -.035, krathongFlowZ);
    krathong.userData.flowSpeed = rand(.55, .8);
    krathong.userData.flowLane = rand(riverZBounds.far + .8, krathongFlowZ);
    krathong.userData.laneSpeed = rand(.2, .5);
  }

  function animateKrathongLights(krathong, elapsed) {
    const { candle, glow, incenseTips, smoke, phase } = krathong.userData;
    const flicker = Math.sin(elapsed * .018 + phase);
    candle.rotation.z = flicker * .09;
    candle.scale.set(1 + flicker * .08, 1 + Math.sin(elapsed * .027 + phase) * .1, 1 + flicker * .08);
    glow.scale.setScalar(.85 + (flicker + 1) * .12);
    incenseTips.forEach((tip, index) => {
      tip.scale.setScalar(.82 + (Math.sin(elapsed * .02 + phase + index) + 1) * .12);
    });
    smoke.forEach((trail, index) => {
      const drift = (elapsed * .00012 + phase + index * .5) % 1;
      trail.position.y = .52 + drift * .2;
      trail.position.x = (index ? .09 : -.09) + Math.sin(drift * Math.PI * 2 + phase) * .025;
      trail.scale.setScalar(.55 + drift * .75);
    });
  }

  function createStupa(parent, x, z) {
    const base = material("#9e8154", { metalness: .18, roughness: .56 });
    const gold = material("#c8a667", { metalness: .25, roughness: .46 });
    const bright = material("#e4c681", { metalness: .3, roughness: .40, emissive: "#70512c", emissiveIntensity: .12 });
    for (let i = 0; i < 5; i++) {
      const bottom = 1.65 - i * .24, top = bottom - .22;
      addMesh(parent, new THREE.CylinderGeometry(top, bottom, .28, 8, 1), i % 2 ? bright : gold, [x, .38 + i * .28, z]);
    }
    addMesh(parent, new THREE.CylinderGeometry(.48, .72, .62, 8), base, [x, 1.95, z]);
    addMesh(parent, new THREE.CylinderGeometry(.29, .49, .72, 8), gold, [x, 2.58, z]);
    addMesh(parent, new THREE.ConeGeometry(.34, .98, 8), bright, [x, 3.39, z]);
    addMesh(parent, new THREE.ConeGeometry(.16, 1.15, 8), gold, [x, 4.42, z]);
    addMesh(parent, new THREE.SphereGeometry(.12, 12, 10), bright, [x, 5.08, z]);
    addMesh(parent, new THREE.ConeGeometry(.16, .64, 8), gold, [x, 5.43, z]);
    const foot = addMesh(parent, new THREE.BoxGeometry(3.9, .34, 2.6), material("#8c6844"), [x, .18, z]);
    foot.castShadow = false;
  }

  function createRoof(parent, x, y, z, width, depth, roofMaterial) {
    const roof = addMesh(parent, new THREE.ConeGeometry(width * .76, .68, 4), roofMaterial, [x, y, z]);
    roof.rotation.y = Math.PI / 4;
    const eave = addMesh(parent, new THREE.BoxGeometry(width, .11, depth), roofMaterial, [x, y - .20, z]);
    const tip = addMesh(parent, new THREE.ConeGeometry(.11, .38, 4), roofMaterial, [x, y + .42, z]);
    tip.rotation.y = Math.PI / 4;
    for (const side of [-1, 1]) {
      const end = addMesh(parent, new THREE.ConeGeometry(.11, .30, 4), roofMaterial, [x + side * width * .39, y - .08, z]);
      end.rotation.z = -side * .48;
      end.rotation.y = Math.PI / 4;
    }
    eave.castShadow = true;
  }

  function createTemple() {
    const temple = new THREE.Group();
    temple.position.set(8.5, 0, -7.0);
    const wall = material("#d2b37e");
    const trim = material("#81553e");
    const roof1 = material("#613e38", { roughness: .65 });
    const roof2 = material("#745044");
    addMesh(temple, new THREE.BoxGeometry(5.2, 1.75, 3.5), wall, [0, 1.15, 0]);
    addMesh(temple, new THREE.BoxGeometry(5.4, .18, 3.7), material("#e0c995"), [0, 2.0, 0]);
    for (let i = -2; i <= 2; i++) {
      addMesh(temple, new THREE.BoxGeometry(.20, 1.25, .20), trim, [i * 1.02, 1.27, 1.57]);
      addMesh(temple, new THREE.BoxGeometry(.42, .94, .08), material("#493c32"), [i * .86, .98, 1.78]);
      addMesh(temple, new THREE.BoxGeometry(.26, .72, .06), material("#e8b866", { emissive: "#d38d38", emissiveIntensity: .35 }), [i * .86, .83, 1.83]);
    }
    createRoof(temple, 0, 2.30, 0, 6.7, 4.7, roof1);
    createRoof(temple, 0, 2.83, 0, 4.8, 3.5, roof2);
    createRoof(temple, 0, 3.32, 0, 3.1, 2.5, roof1);
    createStupa(temple, 1.55, 2.15);
    const stair = addMesh(temple, new THREE.BoxGeometry(3.4, .18, 1.2), material("#b9a17c"), [0, .12, 2.12]);
    for (let i = 0; i < 5; i++) addMesh(temple, new THREE.BoxGeometry(.62, .06, .07), material("#edcd8c", { emissive: "#8b642e", emissiveIntensity: .12 }), [-2 + i, .10, 2.03]);
    const lamp = new THREE.PointLight("#ffcd77", 1.0, 7, 2);
    lamp.position.set(0, 3.2, 1.8); temple.add(lamp);
    state.scene.add(temple);
  }

  function createShop(stall) {
    const group = new THREE.Group();
    group.position.set(stall.x, 0, stall.z);
    const awning = material(stall.color, { side: THREE.DoubleSide });
    const cream = material("#e7c992");
    const wood = material("#5c4635");
    addMesh(group, new THREE.BoxGeometry(2.6, .82, 1.25), material("#977653"), [0, .60, 0]);
    addMesh(group, new THREE.BoxGeometry(2.9, .13, 1.62), wood, [0, 1.08, 0]);
    addMesh(group, new THREE.BoxGeometry(3.1, .14, 1.74), awning, [0, 1.70, -.12]);
    const slopedRoof = addMesh(group, new THREE.BoxGeometry(3.18, .12, 1.84), awning, [0, 1.80, -.12]);
    slopedRoof.rotation.x = -.10;
    for (const side of [-1, 1]) {
      addMesh(group, new THREE.BoxGeometry(.12, 1.7, .12), wood, [side * 1.34, .91, .55]);
      addMesh(group, new THREE.BoxGeometry(.12, 1.55, .12), wood, [side * 1.34, .84, -.72]);
    }
    for (let i = 0; i < 5; i++) {
      const object = addMesh(group, i % 2 ? new THREE.SphereGeometry(.18, 10, 8) : new THREE.CylinderGeometry(.12, .15, .20, 8), material(["#d5a862", "#bd795e", "#829268", "#e4c892", "#cb766e"][i]), [-.97 + i * .48, 1.30, .38]);
      object.scale.y = .75;
    }
    const sign = addMesh(group, new THREE.BoxGeometry(2.2, .28, .06), cream, [0, 2.02, .76]);
    sign.material = material("#dfc28b", { emissive: "#654b2c", emissiveIntensity: .14 });
    const hit = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.5, 2.1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hit.position.set(0, 1.2, .15); hit.userData.stall = stall; group.add(hit);
    const lamp = new THREE.PointLight("#ffc770", state.time === "night" ? 1.2 : 0, 4, 2);
    lamp.position.set(0, 1.52, .48); group.add(lamp);
    state.scene.add(group);
    state.stalls.push(hit);
  }

  function createTree(x, z, size = 1) {
    const trunk = addMesh(state.scene, new THREE.CylinderGeometry(.10 * size, .19 * size, 1.8 * size, 7), material("#69513b"), [x, .9 * size, z]);
    trunk.castShadow = true;
    for (let i = 0; i < 4; i++) {
      const leaf = addMesh(state.scene, new THREE.SphereGeometry((.62 - i * .055) * size, 10, 8), material(i % 2 ? "#527a59" : "#64865d"), [x + (i % 2 ? .28 : -.24) * size, (1.72 + (i % 2) * .43) * size, z]);
      leaf.scale.set(1, .82, .9);
    }
  }

  function createStage() {
    const stage = new THREE.Group();
    stage.position.set(-5.4, 0, 0);
    const platform = addMesh(stage, new THREE.BoxGeometry(7.5, .78, 3.2), material("#805846"), [-4.6, .39, -5.5]);
    addMesh(stage, new THREE.BoxGeometry(7.8, .14, 3.4), material("#d2ad71"), [-4.6, .83, -5.5]);
    addMesh(stage, new THREE.BoxGeometry(6.6, 2.1, .34), material("#8c5550"), [-4.6, 1.90, -6.85]);
    for (let i = 0; i < 9; i++) {
      const colorCode = ["#d9aa75", "#d9c477", "#96ad8c"][i % 3];
      const body = addMesh(stage, new THREE.CylinderGeometry(.13, .17, .72, 8), material(colorCode), [-7.3 + i * .68, 1.32, -5.64]);
      const head = addMesh(stage, new THREE.SphereGeometry(.17, 10, 8), material("#d7a47f"), [-7.3 + i * .68, 1.83, -5.64]);
      body.userData.phase = i * 1.2; head.userData.phase = i * 1.2;
    }
    for (const x of [-7.3, -5.5, -3.7, -1.9]) {
      const light = new THREE.SpotLight("#ffd58d", 3.0, 15, Math.PI / 5, .5, 1.2);
      light.position.set(x, 5, -4.7); light.target.position.set(x, .8, -5.8);
      stage.add(light, light.target); state.stageLights.push(light);
    }
    state.scene.add(stage);
  }

  function createHuman({ monk = false, x = 0, z = 0, colorCode = "#7a9a91", devotee = false, activity = null, pairId = null, pairOffset = 0 } = {}) {
    const root = new THREE.Group();
    root.position.set(x, 0, z);
    const skin = material("#c98d68");
    const cloth = material(monk ? "#c5793d" : colorCode, { roughness: .9 });
    const pants = material(monk ? "#c5793d" : ["#4c4841", "#394a4a", "#50483b"][Math.floor(rand(0, 3))]);
    const dark = material("#44362b");
    const body = addMesh(root, new THREE.CylinderGeometry(.20, .29, .72, 10), cloth, [0, 1.05, 0]);
    body.scale.set(1.05, 1.08, .74);
    if (monk) {
      const robe = addMesh(root, new THREE.ConeGeometry(.39, .78, 10), cloth, [0, .83, 0]);
      robe.rotation.x = Math.PI;
      addMesh(root, new THREE.BoxGeometry(.46, .10, .45), material("#e3a15e"), [0, 1.31, .03]);
      addMesh(root, new THREE.BoxGeometry(.045, .78, .44), material("#9d592f"), [.10, .84, .21]);
    } else {
      addMesh(root, new THREE.CylinderGeometry(.15, .21, .20, 8), cloth, [0, .72, 0]);
    }
    const head = addMesh(root, new THREE.SphereGeometry(.20, 12, 10), skin, [0, 1.59, .015]);
    const hair = addMesh(root, new THREE.SphereGeometry(.204, 12, 8, 0, Math.PI * 2, 0, Math.PI * .48), monk ? skin : dark, [0, 1.65, 0]);
    hair.scale.set(1.02, .95, 1.02);
    const legs = [];
    for (const side of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(side * .11, .64, 0); root.add(leg);
      addMesh(leg, new THREE.CylinderGeometry(.07, .09, .40, 8), pants, [0, -.22, 0]);
      addMesh(leg, new THREE.BoxGeometry(.14, .06, .23), dark, [0, -.46, .06]);
      legs.push(leg);
    }
    const arms = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group(); arm.position.set(side * .25, 1.31, 0); root.add(arm);
      addMesh(arm, new THREE.CylinderGeometry(.065, .075, .38, 8), monk ? cloth : skin, [side * .015, -.23, 0]).rotation.z = -side * .12;
      const hand = addMesh(arm, new THREE.SphereGeometry(.075, 8, 6), skin, [side * .015, -.43, .025]);
      hand.scale.set(.9, .8, 1.05);
      arms.push(arm);
    }
    let bowl = null, food = null;
    if (monk) {
      bowl = addMesh(root, new THREE.CylinderGeometry(.22, .16, .15, 12, 1, true), material("#504d45", { metalness: .52, roughness: .42, side: THREE.DoubleSide }), [.31, 1.11, .20]);
      const rim = addMesh(root, new THREE.TorusGeometry(.205, .025, 6, 12), material("#b89b64", { metalness: .55 }), [.31, 1.19, .20]);
      rim.rotation.x = Math.PI / 2;
      food = new THREE.Group();
      const rice = addMesh(food, new THREE.SphereGeometry(.07, 7, 5), material("#fff1d2"), [.29, 1.23, .19]);
      const flower = addMesh(food, new THREE.SphereGeometry(.055, 7, 5), material("#e3b970"), [.36, 1.23, .20]);
      root.add(food); food.visible = false;
    } else if (devotee) {
      const offering = new THREE.Group();
      addMesh(offering, new THREE.CylinderGeometry(.13, .16, .12, 8), material("#b58752"), [0, 1.05, .28]);
      addMesh(offering, new THREE.SphereGeometry(.08, 7, 6), material("#f1dfbd"), [0, 1.15, .28]);
      root.add(offering);
      root.userData.offering = offering;
    }
    const activityProp = new THREE.Group();
    if (activity === "lantern") {
      const lantern = makeLanternModel(Math.floor(rand(0, lanternTypes.length)));
      lantern.scale.setScalar(.43);
      lantern.position.set(0, .18, .45);
      activityProp.add(lantern);
      activityProp.position.set(.03, 1.55, .12);
    } else if (activity === "krathong") {
      const krathong = makeKrathong(Math.floor(rand(0, krathongTypes.length)));
      krathong.scale.setScalar(.7);
      krathong.position.set(0, .06, .42);
      activityProp.add(krathong);
      activityProp.position.set(0, 1.02, .22);
    }
    if (activity) root.add(activityProp);
    root.userData = {
      monk, devotee, activity, festivalOnly: Boolean(activity), legs, arms, bowl, food, donated: false,
      phase: rand(0, 20), target: null, speed: monk ? rand(.45, .67) : rand(.33, .58),
      root, body, head, activityProp, pairId, pairOffset,
      launchAt: pairId ? 8 + pairOffset : rand(6, 13), launched: false
    };
    if (!monk && devotee) root.userData.offering = root.children.find(child => child instanceof THREE.Group && child !== legs[0] && child !== legs[1] && child !== arms[0] && child !== arms[1]);
    state.scene.add(root);
    state.characters.push(root);
    return root;
  }

  function moveTarget(character) {
    const data = character.userData;
    if (data.pierWalker) {
      data.target = new THREE.Vector3(rand(-2.2, 2.2), 0, rand(-10.6, -5.0));
      return;
    }
    data.target = new THREE.Vector3(rand(-5.3, 5.3), 0, rand(-5.8, 2.7));
    if (data.monk) data.target.set(rand(-1.6, 1.6), 0, 2.5);
  }

  function createCrowd() {
    const clothes = ["#b98267", "#668184", "#b38c5d", "#617b62", "#9d6570", "#d0b77e", "#68769a", "#936d4f"];
    for (let i = 0; i < 22; i++) {
      const monk = i < 4;
      const devotee = !monk && i < 12;
      const character = createHuman({
        monk,
        devotee,
        x: monk ? -1.4 + (i % 4) * .9 : rand(-5.0, 5.0),
        z: monk ? -6 + Math.floor(i / 2) * .65 : rand(-5.5, 2.3),
        colorCode: clothes[i % clothes.length]
      });
      if (!monk) moveTarget(character);
    }
    createPierVisitors(clothes);
  }

  function createPierVisitors(clothes) {
    const activities = [
      { x: -1.15, z: -6.5, activity: "lantern", pairId: "lantern-couple", pairOffset: 0 },
      { x: -.28, z: -6.45, activity: "lantern", pairId: "lantern-couple", pairOffset: .45 },
      { x: 1.5, z: -7.6, activity: "lantern" },
      { x: -.95, z: -10.0, activity: "krathong", pairId: "krathong-couple", pairOffset: 0 },
      { x: .10, z: -10.4, activity: "krathong", pairId: "krathong-couple", pairOffset: .45 },
      { x: 1.45, z: -9.6, activity: "krathong" }
    ];
    activities.forEach((visitor, index) => {
      const character = createHuman({
        x: visitor.x, z: visitor.z, activity: visitor.activity, pairId: visitor.pairId, pairOffset: visitor.pairOffset,
        colorCode: clothes[(index + 2) % clothes.length]
      });
      character.rotation.y = Math.PI;
      if (visitor.pairId) {
        const pairSide = visitor.pairOffset === 0 ? -1 : 1;
        character.rotation.y += pairSide * .1;
        character.userData.head.rotation.y = -pairSide * .12;
      }
    });
    for (let i = 0; i < 4; i++) {
      const walker = createHuman({
        x: (i % 2 ? 1 : -1) * (1.0 + (i % 2) * .35),
        z: -5.2 - Math.floor(i / 2) * 1.1,
        colorCode: clothes[(i + 5) % clothes.length]
      });
      walker.userData.pierWalker = true;
      walker.userData.festivalOnly = true;
      moveTarget(walker);
    }
  }

  function createPier() {
    const wood = material("#72513a", { roughness: .88 });
    const plankTop = material("#aa8057", { roughness: .84 });
    const edge = material("#d0aa72", { roughness: .76 });
    state.pier = new THREE.Group();
    const startZ = -5.8, endZ = -14.8, length = startZ - endZ, centerZ = (startZ + endZ) / 2;
    addMesh(state.pier, new THREE.BoxGeometry(5.1, .24, length), wood, [0, .04, centerZ]);
    for (let row = 0; row < 19; row++) {
      const z = startZ - .26 - row * .46;
      addMesh(state.pier, new THREE.BoxGeometry(4.96, .05, .40), row % 2 ? plankTop : edge, [0, .18, z]);
    }
    for (const x of [-2.32, 2.32]) {
      for (let row = 0; row < 7; row++) {
        const z = startZ - .35 - row * 1.05;
        addMesh(state.pier, new THREE.CylinderGeometry(.13, .17, 1.2, 8), wood, [x, -.38, z]);
        if (row < 5) addMesh(state.pier, new THREE.CylinderGeometry(.055, .065, .82, 8), edge, [x * .91, .57, z]);
      }
      addMesh(state.pier, new THREE.BoxGeometry(.13, .13, 5.4), wood, [x * .91, .98, startZ - 2.6]);
    }
    for (const z of [-7.1, -10.9]) {
      for (const x of [-2.65, 2.65]) {
        addMesh(state.pier, new THREE.CylinderGeometry(.065, .085, 2.35, 8), wood, [x, 1.28, z]);
        const lantern = makeLanternModel(z < -9 ? 7 : 0, true);
        lantern.scale.setScalar(.73);
        lantern.position.set(x, 2.48, z);
        lantern.userData.ambient = true;
        lantern.userData.stationary = true;
        lantern.visible = false;
        state.pier.add(lantern);
        state.lanterns.push(lantern);
      }
    }
    for (const x of [-1.4, 0, 1.4]) {
      addMesh(state.pier, new THREE.BoxGeometry(.045, .012, length - 1), material("#d4b68c"), [x, .174, centerZ]);
    }
    state.scene.add(state.pier);
  }

  function createGroundAndSky() {
    const groundMaterial = material("#58694d", { roughness: 1 });
    const pavingMaterials = [material("#b9a681"), material("#aa9875")];
    state.ground = addMesh(state.scene, new THREE.PlaneGeometry(60, 60), groundMaterial, [0, -.14, -2], [-Math.PI / 2, 0, 0]);
    const path = addMesh(state.scene, new THREE.PlaneGeometry(12.4, 12.5), material("#aa936e", { roughness: .95 }), [0, -.04, -1.0], [-Math.PI / 2, 0, 0]);
    for (let row = 0; row < 17; row++) {
      for (let column = -2; column <= 2; column++) {
        const stone = addMesh(state.scene, new THREE.BoxGeometry(2.34, .025, .67), pavingMaterials[(row + column) & 1], [column * 2.42, -.005, 4.8 - row * .68]);
        stone.receiveShadow = true;
      }
    }
    for (let i = -12; i <= 12; i += 2) {
      for (const side of [-1, 1]) {
        const pebble = addMesh(state.scene, new THREE.DodecahedronGeometry(.38, 0), i % 4 ? pavingMaterials[0] : pavingMaterials[1], [i * .74, .03, -3 + side * 4.4]);
        pebble.scale.y = .18;
        pebble.castShadow = false;
      }
    }
    const waterGeo = new THREE.PlaneGeometry(60, 24, 20, 12);
    state.waterMaterial = new THREE.MeshStandardMaterial({ color: "#315e60", roughness: .29, metalness: .1, transparent: true, opacity: .94, side: THREE.DoubleSide });
    state.water = addMesh(state.scene, waterGeo, state.waterMaterial, [0, -.08, -17.8], [-Math.PI / 2, 0, 0]);
    const bank = addMesh(state.scene, new THREE.BoxGeometry(34, .30, 1.8), material("#786e54"), [0, -.13, -6.5]);
    createPier();
    for (let i = -12; i <= 12; i++) {
      const x = i * 1.5;
      const shimmer = addMesh(state.scene, new THREE.BoxGeometry(rand(.5, 1.8), .014, .035), material("#a5c1a4", { emissive: "#70978c", emissiveIntensity: .14 }), [x, -.045, -8.0 - (i % 4) * .5]);
      shimmer.userData.phase = rand(0, 6);
      state.ambientLights.push(shimmer);
    }
    for (const tree of [[-12, -5, 1.0], [-11, -1.8, .85], [-11.7, 3, 1.05], [11.7, -5, 1], [11.4, -.7, .9], [12, 3.3, 1.08], [-14, 6, 1], [14, 6, 1]]) createTree(...tree);
    state.skyMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        zenith: { value: color("#7196aa") },
        horizon: { value: color("#e4cbb0") },
        cloudColor: { value: color("#f2e4d3") },
        sunColor: { value: color("#fff1d2") },
        sunDirection: { value: new THREE.Vector3(-.34, .56, -.75).normalize() },
        time: { value: 0 },
        cloudStrength: { value: .34 },
        viewportHeight: { value: window.innerHeight }
      },
      vertexShader: `
        varying vec3 vDirection;
        void main() {
          vDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vDirection;
        uniform vec3 zenith;
        uniform vec3 horizon;
        uniform vec3 cloudColor;
        uniform vec3 sunColor;
        uniform vec3 sunDirection;
        uniform float time;
        uniform float cloudStrength;
        uniform float viewportHeight;
        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        void main() {
          vec3 direction = normalize(vDirection);
          float height = clamp(gl_FragCoord.y / viewportHeight, 0.0, 1.0);
          float gradient = smoothstep(0.62, 0.98, height);
          vec3 sky = mix(horizon, zenith, gradient);
          vec2 cloudUv = vec2(atan(direction.z, direction.x) * 2.4, height * 8.0);
          float cloudNoise = noise(cloudUv + vec2(time * 0.002, 0.0)) * 0.65
                           + noise(cloudUv * 2.1 - vec2(time * 0.001, 0.0)) * 0.35;
          float cloudMask = smoothstep(0.57, 0.77, cloudNoise) * (1.0 - smoothstep(0.72, 0.96, height));
          sky = mix(sky, cloudColor, cloudMask * cloudStrength);
          float sun = max(dot(direction, normalize(sunDirection)), 0.0);
          sky += sunColor * (pow(sun, 110.0) * 0.72 + pow(sun, 13.0) * 0.12);
          gl_FragColor = vec4(sky, 1.0);
          #include <encodings_fragment>
        }
      `
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(80, 16, 10), state.skyMaterial);
    sky.position.y = 5; state.scene.add(sky); state.moon = sky;
    state.moonDisk = addMesh(state.scene, new THREE.SphereGeometry(.92, 20, 16), new THREE.MeshBasicMaterial({ color: "#fff0c5" }), [-10, 12, -18]);
    state.moonDisk.castShadow = false;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 90; i++) starPositions.push(rand(-25, 25), rand(8, 28), rand(-26, 2));
    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    state.starField = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: "#fff1ce", size: .06, transparent: true, opacity: .70 }));
    state.scene.add(state.starField);
  }

  function createAmbientLanterns() {
    for (let i = 0; i < 8; i++) {
      const model = makeLanternModel(i % lanternTypes.length, true);
      model.position.set(rand(-11, 11), rand(2.4, 14), rand(-12, -3));
      model.userData.speed = rand(.18, .38);
      model.userData.phase = rand(0, Math.PI * 2);
      model.userData.ambient = true;
      model.userData.ambientCount = i;
      model.visible = false;
      state.scene.add(model); state.lanterns.push(model);
    }
  }

  function createScene() {
    state.scene = new THREE.Scene();
    state.scene.background = color("#93b0aa");
    state.scene.fog = new THREE.Fog("#9cb7ae", 24, 52);
    state.camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, .1, 120);
    updateCamera();
    try {
      state.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch (error) {
      console.error("Could not initialize WebGL renderer", error);
      showToast("อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับ WebGL");
      return;
    }
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    state.renderer.setSize(window.innerWidth, window.innerHeight, false);
    state.renderer.shadowMap.enabled = false;
    if ("outputEncoding" in state.renderer) state.renderer.outputEncoding = THREE.sRGBEncoding;
    state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    state.renderer.toneMappingExposure = 1.15;
    state.scene.add(new THREE.HemisphereLight("#ffedcf", "#4b6153", 1.65));
    const sunlight = new THREE.DirectionalLight("#fff1d8", 2.1);
    sunlight.position.set(-7, 15, 8);
    state.scene.add(sunlight);
    createGroundAndSky();
    createTemple();
    stalls.forEach(createShop);
    createStage();
    createCrowd();
    createAmbientLanterns();
    resize();
    state.sceneReady = true;
    setTime("morning");
    requestAnimationFrame(animate);
  }

  function resize() {
    if (!state.renderer || !state.camera) return;
    const width = window.innerWidth, height = window.innerHeight;
    if (state.skyMaterial) state.skyMaterial.uniforms.viewportHeight.value = height;
    const narrow = width / height < .72;
    state.camera.fov = narrow ? 61 : 43;
    if (!state.cameraControl.followTarget) {
      if (!state.cameraControl.dockView) state.cameraControl.distance = narrow ? 31 : 25;
      else if (narrow) state.cameraControl.distance = 23;
    }
    updateCamera();
    state.camera.aspect = width / height;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(width, height, false);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1 : 1.25));
  }

  function updateCamera() {
    if (!state.camera) return;
    const control = state.cameraControl;
    const horizontal = control.distance * Math.sin(control.phi);
    state.camera.position.set(
      control.target.x + horizontal * Math.sin(control.theta),
      control.target.y + control.distance * Math.cos(control.phi),
      control.target.z + horizontal * Math.cos(control.theta)
    );
    state.camera.lookAt(control.target);
    state.camera.updateMatrixWorld();
  }

  function setCameraView(view) {
    const control = state.cameraControl;
    control.followTarget = null;
    if (view === "dock") {
      control.dockView = true;
      control.target.set(0, 1.25, -9.1);
      control.theta = 2.35;
      control.phi = 1.18;
      control.distance = window.innerWidth / window.innerHeight < .72 ? 23 : 19;
      dockViewButton.setAttribute("aria-pressed", "true");
      showToast("มุมมองท่าน้ำ — ลากหน้าจอเพื่อหมุนกล้อง");
    } else {
      control.dockView = false;
      control.target.set(0, 1.4, -1);
      control.theta = 0;
      control.phi = 1.18;
      control.distance = window.innerWidth / window.innerHeight < .72 ? 31 : 25;
      dockViewButton.setAttribute("aria-pressed", "false");
      showToast("กลับสู่ภาพรวมงานลอยกระทง");
    }
    updateCamera();
  }

  function followKrathong(krathong) {
    const control = state.cameraControl;
    control.dockView = true;
    control.followTarget = krathong;
    control.target.set(krathong.position.x, .55, krathong.position.z);
    control.theta = Math.PI;
    control.phi = .75;
    control.distance = window.innerWidth / window.innerHeight < .72 ? 18 : 14;
    dockViewButton.setAttribute("aria-pressed", "true");
    updateCamera();
  }

  function updateCameraFollow(delta) {
    const target = state.cameraControl.followTarget;
    if (!target || !target.parent) return;
    const desired = new THREE.Vector3(target.position.x, .5, target.position.z);
    state.cameraControl.target.lerp(desired, clamp(delta * 2.4, 0, 1));
    updateCamera();
  }

  function setTime(time) {
    const previousTime = state.time;
    if (time === "night" && state.time !== "night") {
      state.nextFireworkAt = state.clock.elapsedTime * 1000 + rand(9000, 18000);
    }
    state.time = time;
    const [title, caption, description] = timeContent[time];
    sceneTitle.textContent = title;
    sceneCaption.textContent = caption;
    sceneDescription.textContent = description;
    timeButtons.forEach(button => {
      const active = button.dataset.time === time;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    offeringButton.classList.toggle("offering-hidden", time !== "morning");
    fireworkControl.classList.toggle("fireworks-inactive", time !== "night");
    canvas.style.cursor = time === "night" ? "crosshair" : "default";
    if (!state.sceneReady) return;
    const settings = {
      morning: { sky: "#82b4cd", fog: "#82b4cd", zenith: "#347ca9", horizon: "#eac994", clouds: "#d9e8ef", sunColor: "#fff0cb", cloudStrength: .18, sun: 1.4, skyLight: 1.35, exposure: 1, water: "#537c79", stage: 0, lanternCount: 0 },
      evening: { sky: "#875f74", fog: "#875f74", zenith: "#302444", horizon: "#e8906c", clouds: "#ffb987", sunColor: "#ffd09a", cloudStrength: .22, sun: .72, skyLight: .78, exposure: .95, water: "#3d6867", stage: .8, lanternCount: 2 },
      night: { sky: "#090e1b", fog: "#090e1b", zenith: "#020614", horizon: "#071125", clouds: "#151c2d", sunColor: "#d8e4ff", cloudStrength: .04, sun: .06, skyLight: .14, exposure: .82, water: "#102d38", stage: 1.3, lanternCount: 6 }
    }[time];
    state.renderer.toneMappingExposure = settings.exposure;
    state.scene.background.set(settings.sky);
    state.scene.fog.color.set(settings.fog);
    state.scene.children.forEach(object => {
      if (object.isHemisphereLight) object.intensity = settings.skyLight;
      else if (object.isDirectionalLight) object.intensity = settings.sun;
    });
    if (state.skyMaterial) {
      state.skyMaterial.uniforms.zenith.value.set(settings.zenith);
      state.skyMaterial.uniforms.horizon.value.set(settings.horizon);
      state.skyMaterial.uniforms.cloudColor.value.set(settings.clouds);
      state.skyMaterial.uniforms.sunColor.value.set(settings.sunColor);
      state.skyMaterial.uniforms.cloudStrength.value = settings.cloudStrength;
    }
    if (state.waterMaterial) state.waterMaterial.color.set(settings.water);
    state.stageLights.forEach(light => { light.intensity = settings.stage; });
    let ambientVisible = 0;
    state.lanterns.forEach(lantern => {
      if (!lantern.userData.ambient) return;
      if (lantern.userData.stationary) {
        lantern.visible = time !== "morning";
        return;
      }
      lantern.visible = ambientVisible < settings.lanternCount;
      if (lantern.visible) ambientVisible++;
      if (time === "evening" && lantern.visible) lantern.position.y = 3.4 + (ambientVisible % 3) * 1.2;
    });
    const pairLaunchTimes = new Map();
    state.characters.forEach(person => {
      if (person.userData.monk) person.visible = time === "morning";
      else if (person.userData.festivalOnly) person.visible = time !== "morning";
      if (person.userData.activity && previousTime !== time) {
        const data = person.userData;
        const baseLaunch = data.pairId
          ? (pairLaunchTimes.get(data.pairId) ?? (() => {
            const launchAt = state.clock.elapsedTime + rand(5, 8);
            pairLaunchTimes.set(data.pairId, launchAt);
            return launchAt;
          })())
          : state.clock.elapsedTime + rand(5, 12);
        data.launchAt = baseLaunch + data.pairOffset;
        person.userData.launched = false;
        person.userData.activityProp.visible = true;
      }
    });
    state.krathongs.forEach(krathong => { krathong.visible = time !== "morning"; });
    if (time !== "morning") {
      const target = time === "night" ? state.ambientRaftTarget : Math.min(3, state.ambientRaftTarget);
      while (state.krathongs.length < target) {
        const krathong = makeKrathong(Math.floor(rand(0, 9)), "", null, true);
        const x = rand(-28, 28);
        const lane = rand(riverZBounds.far + .8, riverZBounds.near - .5);
        const flowLane = x < 3.25 ? Math.min(lane, krathongFlowZ) : lane;
        krathong.position.set(x, -.035, flowLane);
        krathong.userData.flowSpeed = rand(.55, .8);
        krathong.userData.flowLane = flowLane;
        krathong.userData.laneSpeed = rand(.12, .32);
        state.scene.add(krathong);
        state.krathongs.push(krathong);
      }
    }
    if (state.moonDisk) {
      state.moonDisk.visible = time === "night";
      state.moonDisk.material.color.set(time === "evening" ? "#ffd09c" : "#fff0c5");
      state.moonDisk.scale.setScalar(time === "night" ? 1 : .58);
    }
    if (state.starField) state.starField.visible = time === "night";
    state.stalls.forEach(hit => { hit.parent.children.forEach(child => {
      if (child.isPointLight) child.intensity = time === "night" ? 1.4 : 0;
    }); });
  }

  function avoidCrowd(character, next) {
    let x = next.x, z = next.z;
    for (const other of state.characters) {
      if (other === character || !other.visible) continue;
      const dx = x - other.position.x, dz = z - other.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance > 0 && distance < .70) {
        const push = (.70 - distance) * .72;
        x += dx / distance * push;
        z += dz / distance * push;
      }
    }
    if (character.userData.pierWalker) {
      return { x: clamp(x, -2.0, 2.0), z: clamp(z, -13.1, -4.8) };
    }
    return { x: clamp(x, -5.8, 5.8), z: clamp(z, -5.8, 3.2) };
  }

  function updateCharacters(delta, elapsed) {
    state.characters.forEach(character => {
      if (!character.visible) return;
      const data = character.userData;
      data.phase += delta * (data.speed * 8);
      if (data.monk) {
        if (character.position.z > 2.35) {
          character.position.z = -7.1;
          character.position.x = rand(-1.7, 1.7);
          data.donated = false;
          if (data.food) data.food.visible = false;
        } else {
          character.position.z += data.speed * delta;
        }
        character.position.x += Math.sin(elapsed * .45 + data.phase) * delta * .11;
      } else if (data.activity === "lantern") {
        const lift = clamp(1 - Math.abs(elapsed - data.launchAt * 1000) / 2200, 0, 1);
        data.body.rotation.x = .06 + lift * .11;
        data.arms.forEach((arm, index) => {
          const side = index === 0 ? -1 : 1;
          arm.rotation.z = side * (.18 + lift * 1.28);
          arm.rotation.x = -.12 - lift * .2 + Math.sin(data.phase + index) * .025;
        });
        data.activityProp.position.y = 1.55 + lift * .56;
        data.activityProp.position.z = .12 + lift * .12;
        if (state.time !== "morning" && !data.launched && elapsed > data.launchAt * 1000) {
          const held = data.activityProp.children[0];
          const lantern = makeLanternModel(held.userData.typeIndex, false, null, "ขอให้พบแต่ความสุข");
          character.updateMatrixWorld(true);
          held.getWorldPosition(lantern.position);
          lantern.scale.setScalar(.68);
          lantern.userData.speed = .52;
          lantern.userData.owner = "ท่าน้ำ";
          state.scene.add(lantern);
          state.lanterns.push(lantern);
          held.visible = false;
          data.launched = true;
        } else if (data.launched && elapsed > data.launchAt * 1000 + 14000) {
          data.launchAt = elapsed / 1000 + rand(7, 14);
          data.launched = false;
          data.activityProp.children[0].visible = true;
        }
      } else if (data.activity === "krathong") {
        animateKrathongLights(data.activityProp.children[0], elapsed);
        const bow = clamp(1 - Math.abs(elapsed - data.launchAt * 1000) / 2400, 0, 1);
        data.activityProp.position.y = 1.02 - bow * .91 + Math.sin(data.phase * .25) * .012;
        data.activityProp.position.z = .22 + bow * .50;
        data.body.rotation.x = .04 + bow * .22;
        data.legs.forEach(leg => { leg.rotation.x = bow * .14; });
        data.arms.forEach(arm => {
          arm.rotation.x = -.22 - bow * .93 + Math.sin(data.phase * .2) * .025;
          arm.rotation.z = 0;
        });
        if (state.time !== "morning" && !data.launched && elapsed > data.launchAt * 1000) {
          const krathong = makeKrathong(Math.floor(rand(0, krathongTypes.length)), "", null, false, "ขอให้ครอบครัวมีความสุข");
          character.updateMatrixWorld(true);
          const releasePoint = character.localToWorld(new THREE.Vector3(0, .10, .72));
          launchKrathongFromPier(krathong, releasePoint.x - 1.1);
          krathong.userData.owner = "ท่าน้ำ";
          state.scene.add(krathong);
          state.krathongs.push(krathong);
          data.activityProp.visible = false;
          data.launched = true;
        } else if (data.launched && elapsed > data.launchAt * 1000 + 12000) {
          data.launchAt = elapsed / 1000 + rand(8, 15);
          data.launched = false;
          data.activityProp.visible = true;
        }
      } else {
        if (!data.target || character.position.distanceTo(data.target) < .35) moveTarget(character);
        const destination = avoidCrowd(character, data.target);
        const direction = new THREE.Vector3(destination.x - character.position.x, 0, destination.z - character.position.z);
        if (direction.lengthSq() > .001) {
          direction.normalize();
          character.position.addScaledVector(direction, data.speed * delta);
          character.rotation.y = Math.atan2(direction.x, direction.z);
        }
      }
      const gait = Math.sin(data.phase);
      if (!data.activity) {
        data.legs[0].rotation.x = gait * .44;
        data.legs[1].rotation.x = -gait * .44;
        data.arms[0].rotation.x = -gait * .27;
        data.arms[1].rotation.x = gait * .27;
      } else if (data.activity === "krathong") {
        const bow = data.launched ? 0 : clamp(1 - Math.abs(elapsed - data.launchAt * 1000) / 2400, 0, 1);
        const gaitScale = 1 - bow * .85;
        data.legs[0].rotation.x = gait * .44 * gaitScale + bow * .14;
        data.legs[1].rotation.x = -gait * .44 * gaitScale + bow * .14;
      } else if (data.launched) {
        data.arms.forEach((arm, index) => {
          const side = index === 0 ? -1 : 1;
          arm.rotation.z = side * .18;
          arm.rotation.x = -.12 + Math.sin(data.phase + index) * .025;
        });
      }
      if (data.devotee && !data.donated && elapsed - state.lastOfferAt > 1100) {
        const monk = state.characters.find(other => other.userData.monk && other.visible && other.position.distanceTo(character.position) < 1.05);
        if (monk && monk.userData.food) {
          data.donated = true;
          monk.userData.food.visible = true;
          state.lastOfferAt = elapsed;
          if (state.offeringCount > 0) state.offeringCount -= 1;
        }
      }
      if (data.donated && data.offering) {
        data.offering.position.y = 1.03 + Math.sin(elapsed * .007) * .025;
        data.arms.forEach(arm => { arm.rotation.x = -.85; });
      }
    });
  }

  function createFirework(position, colorCode) {
    const group = new THREE.Group();
    group.position.copy(position);
    const points = [];
    const velocity = [];
    for (let i = 0; i < 30; i++) {
      const theta = rand(0, Math.PI * 2);
      const phi = rand(0, Math.PI);
      const speed = rand(1.6, 4.8);
      velocity.push(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed,
        Math.sin(phi) * Math.sin(theta) * speed
      );
      points.push(0, 0, 0);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: colorCode, size: .095, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(particles); state.scene.add(group);
    state.fireworks.push({ group, geometry, velocity, age: 0, lifetime: 1.7 });
    if (state.soundOn) playChime(660, .12);
  }

  function updateFireworks(delta) {
    state.fireworks = state.fireworks.filter(firework => {
      firework.age += delta;
      const attribute = firework.geometry.getAttribute("position");
      for (let i = 0; i < attribute.count; i++) {
        const offset = i * 3;
        const time = firework.age;
        attribute.array[offset] = firework.velocity[offset] * time * .42;
        attribute.array[offset + 1] = firework.velocity[offset + 1] * time * .42 - time * time * 1.05;
        attribute.array[offset + 2] = firework.velocity[offset + 2] * time * .42;
      }
      attribute.needsUpdate = true;
      firework.group.children[0].material.opacity = clamp(1 - firework.age / firework.lifetime, 0, 1);
      if (firework.age >= firework.lifetime) {
        state.scene.remove(firework.group);
        firework.geometry.dispose();
        firework.group.children[0].material.dispose();
        return false;
      }
      return true;
    });
  }

  function updateKrathongs(delta, elapsed) {
    for (const krathong of state.krathongs) {
      animateKrathongLights(krathong, elapsed);
      krathong.position.x += (krathong.userData.flowSpeed || .65) * delta;
      if (Math.abs(krathong.position.x) < 3.25) {
        krathong.userData.flowLane = Math.min(krathong.userData.flowLane ?? krathongFlowZ, krathongFlowZ);
        krathong.position.z = Math.min(krathong.position.z, krathongFlowZ);
      }
      const laneDelta = (krathong.userData.flowLane - krathong.position.z);
      krathong.position.z += clamp(laneDelta, -krathong.userData.laneSpeed * delta, krathong.userData.laneSpeed * delta);
      krathong.position.z += Math.sin(elapsed * .00035 + krathong.userData.phase) * delta * .045;
      krathong.position.y = -.035 + Math.sin(elapsed * .0014 + krathong.userData.phase) * .012;
      krathong.rotation.y += delta * .025;
      if (krathong.position.x > 28.5) {
        if (state.cameraControl.followTarget === krathong) {
          krathong.position.x = 28.5;
          krathong.userData.flowSpeed = 0;
          state.cameraControl.followTarget = null;
        } else {
          krathong.position.x = -28.5;
          const lane = rand(riverZBounds.far + .8, riverZBounds.near - .5);
          krathong.position.z = Math.min(lane, krathongFlowZ);
          krathong.userData.flowLane = krathong.position.z;
        }
      }
      keepKrathongClearOfPier(krathong);
    }
    for (let i = 0; i < state.krathongs.length; i++) {
      for (let j = i + 1; j < state.krathongs.length; j++) {
        const first = state.krathongs[i], second = state.krathongs[j];
        const dx = second.position.x - first.position.x;
        const dz = second.position.z - first.position.z;
        const distance = Math.hypot(dx, dz);
        if (distance === 0 || distance >= .9) continue;
        const push = (.9 - distance) * .35;
        const xPush = dx / distance * push;
        const zPush = dz / distance * push;
        if (state.cameraControl.followTarget !== first) {
          first.position.x = clamp(first.position.x - xPush, -28.5, 28.5);
          first.position.z = clamp(first.position.z - zPush, riverZBounds.far + .6, riverZBounds.near - .4);
          first.userData.flowLane = first.position.z;
        }
        if (state.cameraControl.followTarget !== second) {
          second.position.x = clamp(second.position.x + xPush, -28.5, 28.5);
          second.position.z = clamp(second.position.z + zPush, riverZBounds.far + .6, riverZBounds.near - .4);
          second.userData.flowLane = second.position.z;
        }
        for (const raft of [first, second]) {
          if (Math.abs(raft.position.x) < 3.25) {
            raft.position.z = Math.min(raft.position.z, krathongFlowZ);
            raft.userData.flowLane = Math.min(raft.userData.flowLane, krathongFlowZ);
          }
        }
        keepKrathongClearOfPier(first);
        keepKrathongClearOfPier(second);
      }
    }
  }

  function animate(timestamp = 0) {
    requestAnimationFrame(animate);
    if (timestamp - state.lastRender < state.renderInterval) return;
    state.lastRender = timestamp;
    const delta = Math.min(state.clock.getDelta(), .055);
    const elapsed = state.clock.elapsedTime * 1000;
    if (!state.reducedMotion && !document.hidden) {
      updateCharacters(delta, elapsed);
      updateKrathongs(delta, elapsed);
      state.lanterns.forEach(lantern => {
        if (!lantern.visible || lantern.userData.stationary) return;
        lantern.position.y += lantern.userData.speed * delta;
        lantern.position.x += (lantern.userData.windX + Math.sin(elapsed * .0007 + lantern.userData.phase) * .12) * delta;
        lantern.position.z += (lantern.userData.windZ + Math.cos(elapsed * .00055 + lantern.userData.phase) * .08) * delta;
        lantern.rotation.z = Math.sin(elapsed * .001 + lantern.userData.phase) * .025;
        if (Math.abs(lantern.position.x) > 28) lantern.userData.windX *= -1;
        if (lantern.position.z < -28 || lantern.position.z > 8) lantern.userData.windZ *= -1;
        lantern.position.x = clamp(lantern.position.x, -28, 28);
        lantern.position.z = clamp(lantern.position.z, -28, 8);
        if (lantern.position.y > 18) {
          lantern.position.set(rand(-18, 18), 1, rand(-24, 5));
        }
      });
      state.stageLights.forEach(light => { light.intensity = state.time === "night" ? 1.4 : state.time === "evening" ? .8 : 0; });
      if (state.water) {
        state.waterTick++;
        if (state.waterTick % 4 === 0) {
          const positions = state.water.geometry.attributes.position;
          for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i), y = positions.getY(i);
            positions.setZ(i, Math.sin(x * .5 + elapsed * .0006) * .016 + Math.cos(y * .75 + elapsed * .0008) * .014);
          }
          positions.needsUpdate = true;
          state.water.geometry.computeVertexNormals();
        }
      }
      updateCameraFollow(delta);
      if (state.skyMaterial) state.skyMaterial.uniforms.time.value = elapsed;
      if (state.time === "night" && elapsed > state.nextFireworkAt) {
        createFirework(new THREE.Vector3(rand(-9, 9), rand(6.5, 10.5), rand(-16, -9)), ["#ffd166", "#ff8c70", "#a9c5ff", "#9ee2c1"][Math.floor(rand(0, 4))]);
        state.nextFireworkAt = elapsed + rand(14000, 26000);
      }
      updateFireworks(delta);
    }
    state.renderer.render(state.scene, state.camera);
  }

  function openMarket(stall) {
    document.querySelector("#market-title").textContent = stall.name;
    document.querySelector("#market-description").textContent = "ของทำมือและรสชาติพื้นบ้าน คัดสรรจากชุมชนในเมืองเก่า";
    document.querySelector("#market-menu").innerHTML = stall.items.map(([name, price]) => `<div class="market-menu-item"><span>${name}</span><span>${price}</span></div>`).join("");
    marketDialog.showModal();
  }

  function createCraftChoices() {
    const grid = document.querySelector("#krathong-grid");
    [...krathongTypes, ...lanternTypes].forEach((type, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "krathong-choice";
      wrapper.dataset.mode = index < krathongTypes.length ? "krathong" : "lantern";
      wrapper.innerHTML = `<input type="radio" name="krathong" id="krathong-${index}" value="${index % 9}" ${index === 0 ? "checked" : ""}><label for="krathong-${index}" style="--swatch:${type.color}"><span aria-hidden="true">${index < 9 ? krathongTypes[index].symbol : "♧"}</span><span>${type.name}</span></label>`;
      grid.append(wrapper);
    });
  }

  function openCraft(mode) {
    state.craftMode = mode;
    const isLantern = mode === "lantern";
    document.querySelector("#craft-eyebrow").textContent = isLantern ? "A LIGHT FOR THE SKY" : "A WISH FOR THE RIVER";
    document.querySelector("#craft-title").textContent = isLantern ? "ทำโคมลอยของคุณ" : "ทำกระทงของคุณ";
    document.querySelector("#craft-intro").textContent = isLantern ? "ใส่ชื่อ เขียนคำอธิษฐาน แล้วเลือกโคมล้านนา" : "ใส่ชื่อ เขียนคำอธิษฐาน แล้วเลือกกระทงที่ชอบ";
    document.querySelector("#craft-choice-label").innerHTML = isLantern ? 'เลือกแบบโคม <span class="optional">9 แบบ</span>' : 'เลือกกระทง <span class="optional">9 แบบ</span>';
    document.querySelector("#craft-submit").innerHTML = isLantern ? 'อธิษฐานแล้วปล่อยโคม <span aria-hidden="true">↑</span>' : 'อธิษฐานแล้วลอยกระทง <span aria-hidden="true">→</span>';
    document.querySelector("#craft-note").textContent = isLantern ? "โคมลอยดิจิทัลในโลกจำลอง ไม่จุดไฟหรือปล่อยวัตถุจริง" : "กระทงดิจิทัลนี้ลอยในโลกจำลองเท่านั้น ♡";
    document.querySelectorAll(".krathong-choice").forEach(choice => {
      const visible = choice.dataset.mode === mode;
      choice.hidden = !visible;
      const radio = choice.querySelector("input");
      radio.disabled = !visible;
      radio.checked = visible && choice.querySelector("label").htmlFor === `krathong-${isLantern ? 9 : 0}`;
    });
    document.querySelector("#visitor-photo").value = "";
    document.querySelector("#visitor-wish").value = "";
    state.photo = null;
    photoPreview.textContent = "✿ เลือกรูปจากอุปกรณ์ของคุณ";
    craftDialog.showModal();
  }

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.pointer, state.camera);
  }

  function handleSceneTap(event) {
    if (!state.sceneReady) return;
    setPointer(event);
    const hits = state.raycaster.intersectObjects(state.stalls, false);
    if (hits.length && state.time !== "night") {
      openMarket(hits[0].object.userData.stall);
      return;
    }
    if (state.time === "night") {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2.4);
      const target = new THREE.Vector3();
      if (!state.raycaster.ray.intersectPlane(plane, target)) {
        target.copy(state.raycaster.ray.origin).addScaledVector(state.raycaster.ray.direction, 22);
      }
      target.x = clamp(target.x, -14, 14);
      target.y = clamp(target.y, 3, 12);
      target.z = clamp(target.z, -18, 3);
      createFirework(target, colorPicker.value);
    }
  }

  canvas.addEventListener("pointerdown", event => {
    if (!state.sceneReady || event.button > 0) return;
    if (event.pointerType === "touch") {
      state.cameraControl.touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (state.cameraControl.touchPointers.size > 1) {
        state.cameraControl.multiTouch = true;
        state.cameraControl.dragging = null;
        const [first, second] = [...state.cameraControl.touchPointers.values()];
        state.cameraControl.pinchDistance = Math.hypot(first.x - second.x, first.y - second.y);
      }
    }
    state.cameraControl.dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY };
    state.cameraControl.moved = false;
    if (state.cameraControl.multiTouch) state.cameraControl.dragging = null;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    if (event.pointerType === "touch" && state.cameraControl.touchPointers.has(event.pointerId)) {
      state.cameraControl.touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (state.cameraControl.touchPointers.size > 1) {
        const [first, second] = [...state.cameraControl.touchPointers.values()];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (state.cameraControl.pinchDistance > 0 && distance > 1) {
          state.cameraControl.distance = clamp(state.cameraControl.distance * state.cameraControl.pinchDistance / distance, 8, 39);
          state.cameraControl.followTarget = null;
          updateCamera();
        }
        state.cameraControl.pinchDistance = distance;
        return;
      }
    }
    const drag = state.cameraControl.dragging;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.lastX, dy = event.clientY - drag.lastY;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5) state.cameraControl.moved = true;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    if (state.cameraControl.moved) {
      state.cameraControl.followTarget = null;
      state.cameraControl.theta -= dx * .006;
      state.cameraControl.phi = clamp(state.cameraControl.phi + dy * .004, .38, 1.48);
      updateCamera();
    }
  });
  canvas.addEventListener("pointerup", event => {
    if (event.pointerType === "touch") state.cameraControl.touchPointers.delete(event.pointerId);
    const drag = state.cameraControl.dragging;
    if (drag && drag.id === event.pointerId) {
      if (!state.cameraControl.moved && !state.cameraControl.multiTouch) handleSceneTap(event);
      state.cameraControl.dragging = null;
      state.cameraControl.moved = false;
    }
    if (state.cameraControl.touchPointers.size < 2) state.cameraControl.pinchDistance = 0;
    if (!state.cameraControl.touchPointers.size) state.cameraControl.multiTouch = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => {
    state.cameraControl.dragging = null;
    state.cameraControl.moved = false;
    state.cameraControl.touchPointers.clear();
    state.cameraControl.multiTouch = false;
    state.cameraControl.pinchDistance = 0;
  });
  canvas.addEventListener("wheel", event => {
    event.preventDefault();
    state.cameraControl.distance = clamp(state.cameraControl.distance + event.deltaY * .018, 8, 39);
    state.cameraControl.followTarget = null;
    updateCamera();
  }, { passive: false });

  function playChime(frequency = 523, duration = .3) {
    if (!state.audio || !state.soundOn) return;
    const oscillator = state.audio.createOscillator(), gain = state.audio.createGain();
    oscillator.type = "sine"; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, state.audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.07, state.audio.currentTime + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, state.audio.currentTime + duration);
    oscillator.connect(gain); gain.connect(state.audio.destination);
    oscillator.start(); oscillator.stop(state.audio.currentTime + duration + .02);
  }

  document.querySelector("#sound-toggle").addEventListener("click", async event => {
    state.soundOn = !state.soundOn;
    if (state.soundOn) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) { state.soundOn = false; showToast("เบราว์เซอร์นี้ไม่รองรับเสียงบรรยากาศ"); return; }
      state.audio ||= new AudioContext();
      if (state.audio.state === "suspended") await state.audio.resume();
      playChime(523, .35); playChime(659, .35);
    }
    event.currentTarget.setAttribute("aria-pressed", String(state.soundOn));
    event.currentTarget.querySelector(".sound-label").textContent = state.soundOn ? "ปิดเสียง" : "เปิดเสียง";
  });
  timeButtons.forEach(button => button.addEventListener("click", () => setTime(button.dataset.time)));
  dockViewButton.addEventListener("click", () => setCameraView("dock"));
  overviewButton.addEventListener("click", () => setCameraView("overview"));
  document.querySelector("#enter-button").addEventListener("click", () => {
    welcome.classList.add("is-hidden");
    showToast("ยินดีต้อนรับสู่เมืองเก่าริมน้ำสามมิติ");
  });
  document.querySelector("#float-button").addEventListener("click", () => openCraft("krathong"));
  document.querySelector("#lantern-button").addEventListener("click", () => openCraft("lantern"));
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  [craftDialog, marketDialog].forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  }));
  offeringButton.addEventListener("click", () => {
    state.offeringCount += 1;
    showToast("ตั้งจิตทำบุญแล้ว พระจะรับบาตรเมื่อเดินมาถึง");
    playChime(587, .4);
  });
  createCraftChoices();
  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) { state.photo = null; photoPreview.textContent = "✿ เลือกรูปจากอุปกรณ์ของคุณ"; return; }
    if (!file.type.startsWith("image/")) { showToast("กรุณาเลือกรูปภาพ"); photoInput.value = ""; return; }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("load", () => {
        state.photo = image;
        photoPreview.replaceChildren(image, Object.assign(document.createElement("span"), { textContent: "เพิ่มรูปบนกระทงแล้ว" }));
      });
      image.src = reader.result;
    });
    reader.addEventListener("error", () => showToast("อ่านไฟล์รูปไม่สำเร็จ กรุณาลองอีกครั้ง"));
    reader.readAsDataURL(file);
  });
  document.querySelector("#craft-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = document.querySelector("#visitor-name").value.trim();
    if (!name) { document.querySelector("#visitor-name").focus(); return; }
    const wish = document.querySelector("#visitor-wish").value.trim() || "ขอให้มีความสุข";
    const selection = Number(new FormData(event.currentTarget).get("krathong"));
    if (state.craftMode === "lantern") {
      const model = makeLanternModel(selection, false, state.photo, wish);
      model.userData.owner = name;
      model.userData.speed = .42;
      model.position.set(rand(-3.8, 3.8), .3, rand(-2, 2));
      state.scene.add(model);
      state.lanterns.push(model);
      setTime("night");
      showToast(`${name} ปล่อยโคมอธิษฐานลอยขึ้นสู่ฟ้าแล้ว`);
      playChime(784, .45);
    } else {
      const model = makeKrathong(selection, name, state.photo, false, wish);
      launchKrathongFromPier(model);
      model.userData.owner = name;
      state.scene.add(model);
      state.krathongs.push(model);
      if (state.time === "morning") setTime("evening");
      followKrathong(model);
      showToast(`${name} ส่งกระทงพร้อมคำอธิษฐานลงน้ำแล้ว · กล้องกำลังติดตาม`);
      playChime(784, .45);
    }
    craftDialog.close();
    event.currentTarget.reset();
    state.photo = null;
    photoPreview.textContent = "✿ เลือกรูปจากอุปกรณ์ของคุณ";
  });

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) state.clock.start(); });
  createScene();
})();

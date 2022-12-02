import * as THREE from "three";
import Tree from "./Tree.component.js";
import Bench from "./Bench.component.js";
import { GLTFLoader } from "https://unpkg.com/three@0.146.0/examples/jsm/loaders/GLTFLoader.js";

const Lamp = () => {
  const lamp = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.25),
    new THREE.MeshBasicMaterial({ color: 0x252525 })
  );
  base.position.set(0, 0, 0.7);

  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 4.5),
    new THREE.MeshBasicMaterial({ color: 0x252525 })
  );
  post.position.set(0, 0, post.geometry.parameters.depth / 2);

  const bulb = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.3),
    new THREE.MeshBasicMaterial({ color: 0xfff68f })
  );
  bulb.position.set(
    0,
    0,
    post.geometry.parameters.depth + bulb.geometry.parameters.depth / 2
  );

  const bottom = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 1.5, 8),
    new THREE.MeshBasicMaterial({ color: 0x252525 })
  );
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.set(
    0,
    0,
    post.geometry.parameters.depth - bottom.geometry.parameters.height / 2
  );

  const top = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.25, 8),
    new THREE.MeshBasicMaterial({ color: 0x252525 })
  );
  top.rotation.x = Math.PI / 2;
  top.position.set(
    0,
    0,
    // 10
    post.geometry.parameters.depth +
      bulb.geometry.parameters.depth +
      top.geometry.parameters.height / 2
  );

  const light = new THREE.PointLight(0xfff68f, 1, 10);
  light.position.set(0, 0, 4.65);

  lamp.add(base);
  lamp.add(post);
  lamp.add(bulb);
  lamp.add(bottom);
  lamp.add(top);
  lamp.add(light);
  return lamp;
};

const Sidewalk = () => {
  const texture = new THREE.TextureLoader().load("../src/tileSidewalk.jpg");
  const sidewalk = new THREE.Group();

  for (let i = -20; i <= 20; i += 2)
    for (let j = -20; j <= 20; j += 2) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 0.1),
        new THREE.MeshLambertMaterial({ map: texture })
      );
      tile.position.set(i, j, 0.7);
      sidewalk.add(tile);
    }

  return sidewalk;
};

const Playground = () => {
  const texture = new THREE.TextureLoader().load("../src/tileSand.jpg");
  const playground = new THREE.Group();

  //   32.5

  for (let i = -18; i <= 18; i += 2)
    for (let j = -18; j <= 18; j += 2) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 0.1),
        new THREE.MeshLambertMaterial({ map: texture, color: 0x4f772d }) //0x606c38 //0x1b8080 // 0x606c38 // 0x1b8080
      );
      tile.position.set(i, j, 0.75);
      playground.add(tile);
    }

  return playground;
};

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const Forest = () => {
  const forest = new THREE.Group();

  const treesPosition = [];
  let i = 0;
  while (i < 15) {
    const x = randomIntFromInterval(3, 15);
    const y = randomIntFromInterval(3, 15);

    if (!treesPosition.includes([x, y])) {
      const tree = Tree();
      tree.position.set(x, y, 0.75);
      forest.add(tree);

      treesPosition.push([x, y]);
      i += 1;
    }
  }
  return forest;
};

const Benches = () => {
  const benches = new THREE.Group();

  const bench = Bench();
  bench.position.set(0, 0, 0.75);

  benches.add(bench);
  return benches;
};

const Park = () => {
  const park = new THREE.Group();

  const sidewalk = Sidewalk();
  const playground = Playground();
  park.add(sidewalk);
  park.add(playground);

  // Creating lamps
  for (let i = -15; i <= 15; i += 10) {
    const lamp1 = Lamp();
    const lamp2 = Lamp();
    const lamp3 = Lamp();
    const lamp4 = Lamp();
    lamp1.position.set(i, 18, 0);
    lamp2.position.set(i, -18, 0);
    lamp3.position.set(18, i, 0);
    lamp4.position.set(-18, i, 0);
    park.add(lamp1);
    park.add(lamp2);
    park.add(lamp3);
    park.add(lamp4);
  }

  // Creating forest
  let forest = Forest();
  forest.position.set(-18, -18, 0);
  park.add(forest);

  forest = Forest();
  forest.position.set(0, -18, 0);
  park.add(forest);

  forest = Forest();
  forest.position.set(0, 0, 0);
  park.add(forest);

  forest = Forest();
  forest.position.set(-18, 0, 0);
  park.add(forest);

  // const benches = Benches();
  // park.add(benches);

  // Creating benches
  for (let i = -8; i <= 8; i += 8) {
    // horizontal benches
    const bench1 = Bench("horizontal");
    const bench2 = Bench("horizontal");

    // vertical benches
    const bench3 = Bench("vertical");
    const bench4 = Bench("vertical");
    bench1.position.set(i, 17, 0.75);
    bench2.position.set(i, -17, 0.75);
    bench3.position.set(17, i, 0.75);
    bench4.position.set(-17, i, 0.75);
    park.add(bench1);
    park.add(bench2);
    park.add(bench3);
    park.add(bench4);
  }

  const lamp = Lamp();
  park.add(lamp);

  const loader = new GLTFLoader();
  loader.load("./../../src/fountain.glb", (gltf) => {
    gltf.scene.children[0].rotation.x = -Math.PI;
    gltf.scene.children[0].rotation.y = Math.PI;
    gltf.scene.children[0].position.z = 2.2;
    gltf.scene.children[0].scale.set(0.01, 0.01, 0.01);

    park.add(gltf.scene.children[0]);
  });

  return park;
};

export default Park;

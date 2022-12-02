import * as THREE from "three";

const Bench = (direction) => {
  const bench = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1, 0.4),
    new THREE.MeshBasicMaterial({ color: 0xbcb8b1 })
  );
  base.position.z = 0.2;
  bench.add(base);

  const texture = new THREE.TextureLoader().load("../../src/wood.png");

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 1.2, 0.2),
    new THREE.MeshBasicMaterial({ map: texture, color: 0xa0522d })
  );
  seat.position.z = 0.5;
  bench.add(seat);

  // const slat = new THREE.Mesh(
  //   new THREE.BoxGeometry(3.5,0.1,0.6),
  //   new THREE.MeshBasicMaterial({color: 0x7f4a4c})
  // );

  // slat.position.z = 0.9;
  // bench.add(slat);

  if (direction == "vertical") {
    bench.rotation.set(0, 0, -Math.PI / 2);
  }

  return bench;
};

export default Bench;

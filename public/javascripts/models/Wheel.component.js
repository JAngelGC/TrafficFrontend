import * as THREE from "three";

const Wheel = () => {
  const wheel = new THREE.Mesh(
    new THREE.BoxGeometry(12, 33, 12),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );

  wheel.position.z = 6;
  return wheel;
};

export default Wheel;
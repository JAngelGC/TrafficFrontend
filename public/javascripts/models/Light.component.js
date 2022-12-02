import * as THREE from "three";

const Light = (color) => {
  const light = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.35, 40),
    new THREE.MeshBasicMaterial({ color: color })
  );

  return light;
};

export default Light;

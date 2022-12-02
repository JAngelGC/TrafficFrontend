import * as THREE from "three";

const Tree = () => {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0x7f4a4c })
  );
  trunk.position.z = 0.5;
  tree.add(trunk);

  const z = Math.random() + 1;

  const leaves = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, z),
    new THREE.MeshLambertMaterial({ color: 0xa7c120 })
  );

  leaves.position.z = z / 2 + 1;
  // leaves.position.z = z / 2 + 2;

  tree.add(leaves);

  return tree;
};

export default Tree;

import * as THREE from "three";
import Light from "./Light.component.js";

const trafficLightColors = {
  Black: 0x000000,
  Green: 0x00ff00,
  Red: 0xff0000,
  Yellow: 0xffff00,
};

export const updateTrafficLight = (trafficLight, color, direction) => {
  trafficLight.children[3].material.color.setHex(trafficLightColors["Black"]);
  trafficLight.children[4].material.color.setHex(trafficLightColors["Black"]);
  trafficLight.children[5].material.color.setHex(trafficLightColors["Black"]);

  if (color === "Red") {
    trafficLight.children[3].material.color.setHex(trafficLightColors["Red"]);
  } else if (color === "Yellow") {
    trafficLight.children[4].material.color.setHex(
      trafficLightColors["Yellow"]
    );
  } else if (color === "Green") {
    trafficLight.children[5].material.color.setHex(trafficLightColors["Green"]);
  }
};

const TrafficLight = (color, direction) => {
  const trafficLight = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.15),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  base.position.z = 0.15 / 2;
  trafficLight.add(base);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 3),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  body.position.z = 3 / 2;
  trafficLight.add(body);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.25, 0.75),
    new THREE.MeshLambertMaterial({ color: 0x393939 })
  );
  box.position.z = 2.8;
  box.position.x = 1.5;
  trafficLight.add(box);

  const redLight = Light(0x000000);
  redLight.position.z = 2.8 + 0.4 / 2;
  redLight.position.x = 1.5;

  const yellowLight = Light(0x00000);
  yellowLight.position.z = 2.8;
  yellowLight.position.x = 1.5;

  const greenLight = Light(0x000000);
  greenLight.position.z = 2.8 - 0.4 / 2;
  greenLight.position.x = 1.5;

  if (color === "Green") {
    greenLight.material.color.setHex(trafficLightColors[color]);
  } else if (color === "Yellow") {
    yellowLight.material.color.setHex(trafficLightColors[color]);
  } else {
    redLight.material.color.setHex(trafficLightColors[color]);
  }

  trafficLight.add(redLight);
  trafficLight.add(yellowLight);
  trafficLight.add(greenLight);

  trafficLight.rotation.set(0, 0, Math.PI / 2);

  // console.log(direction);
  if (direction === "up") {
    trafficLight.rotation.set(0, 0, Math.PI);
  }

  if (direction === "down") {
    trafficLight.rotation.set(0, 0, 0);
  }

  if (direction === "left") {
    trafficLight.rotation.set(0, 0, -Math.PI / 2);
  }
  // if (direction == "right") {
  //   trafficLight.rotation.set(0, 0, Math.PI / 2);
  // }

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 0.1, 0.1),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  //
  arm.position.x = 0.85;
  arm.position.z = 3;
  trafficLight.add(arm);

  return trafficLight;
};

export default TrafficLight;

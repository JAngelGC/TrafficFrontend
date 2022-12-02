import * as THREE from "three";
import Wheel from "./Wheel.component.js";

const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];

const getCarFrontTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
};

const getCarSideTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
};

const pickRandom = (array) => array[Math.floor(Math.random() * array.length)];

export const updateCarDirection = (car, direction) => {
  if (direction === "up") {
    car.rotation.set(0, 0, Math.PI / 2);
  }

  if (direction === "down") {
    car.rotation.set(0, 0, -Math.PI / 2);
  }

  if (direction === "left") {
    car.rotation.set(0, 0, Math.PI);
  }

  if (direction === "right") {
    car.rotation.set(0, 0, 0);
  }
};

const Car = (direction) => {
  const car = new THREE.Group();
  const color = pickRandom(vehicleColors);

  //back wheels
  const backWheel = Wheel();
  backWheel.position.x = -18;
  car.add(backWheel);

  //front wheels
  const frontWheel = Wheel();
  frontWheel.position.x = 18;
  car.add(frontWheel);

  //body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(60, 30, 15),
    new THREE.MeshLambertMaterial({ color: color })
  );
  body.position.z = 12;
  car.add(body);

  const carFrontTexture = getCarFrontTexture();
  carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
  carFrontTexture.rotation = Math.PI / 2;

  const carBackTexture = getCarFrontTexture();
  carBackTexture.center = new THREE.Vector2(0.5, 0.5);
  carBackTexture.rotation = -Math.PI / 2;

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.flipY = false;

  const carRightSideTexture = getCarSideTexture();

  //cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
  ]);
  cabin.position.x = -6;
  cabin.position.z = 25.5;
  car.add(cabin);

  if (direction === "up") {
    car.rotation.set(0, 0, Math.PI / 2);
  }

  if (direction === "down") {
    car.rotation.set(0, 0, -Math.PI / 2);
  }

  if (direction === "left") {
    car.rotation.set(0, 0, Math.PI);
  }

  return car;
};

export default Car;

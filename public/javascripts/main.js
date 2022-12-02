import * as THREE from "three";
import Car from "./models/Car.component.js";
import TrafficLight from "./models/TrafficLight.component.js";
import { OrbitControls } from "https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js";
import { updateTrafficLight } from "./models/TrafficLight.component.js";
import { updateCarDirection } from "./models/Car.component.js";
import Park from "./models/Park.component.js";

// URL of API
const baseURL = "https://backendpipeline.mybluemix.net/";

// Canvas drawing diferential
const dx = -50;
const dy = -50;
const dz = 0.25;

///////////////////
// VISUALIZATION //
///////////////////
// Create city
const getCity = async () => {
  const res = await fetch(baseURL + "/city", {
    method: "POST",
  });

  const cityID = res.headers.get("Location");
  const state = await res.json();
  return {
    cityID,
    stateCars: state["currentCars"],
    stateStreets: state["currentStreets"],
    stateLights: state["currentLights"],
  };
};

const createView = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, // FOV
    window.innerWidth / window.innerHeight, // Aspect
    0.1, // Near
    2000 //Far
  );

  camera.position.set(0, 0, 110);

  // Create WebGL Instance
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(innerWidth, innerHeight);
  // renderer.setPixelRatio(devicePixelRatio);

  return {
    scene,
    camera,
    renderer,
  };
};

////////////
// MODELS //
////////////
const createPlayground = (scene) => {
  const pgGeometry = new THREE.BoxGeometry(100, 100, 1);
  const pgMaterial = new THREE.MeshLambertMaterial({ color: 0x828290 });
  const pg = new THREE.Mesh(pgGeometry, pgMaterial);
  pg.position.x = 0;
  pg.position.y = 0;
  pg.position.z = 0.05;

  scene.add(pg);
  return pg;
};

const createCar = (scene, id, pos, direction, color) => {
  // Define car geometry
  const playerCar = Car(direction);
  playerCar.position.set(pos[0] + dx, pos[1] + dy, 0.6);
  playerCar["carId"] = id;
  playerCar["direction"] = direction;
  playerCar.scale.set(0.05, 0.05, 0.05);
  scene.add(playerCar);
  return playerCar;
};

const createTrafficLights = (scene, id, pos, color, direction) => {
  const trafficLight = TrafficLight(color, direction);

  trafficLight["lightId"] = id;
  trafficLight.scale.set(2, 2, 2);
  trafficLight.position.set(pos[0] + dx, pos[1] + dy, 1);

  scene.add(trafficLight);
  return trafficLight;
};

const createStreet = (scene, id, start, end, direction) => {
  let width = Math.abs(start[0] - end[0]);
  width = width == 0 ? 5 : width;
  let height = Math.abs(start[1] - end[1]);
  height = height == 0 ? 5 : height;

  let position = "";
  if (direction === "right") {
    position = [end[0] + dx - width / 2, end[1] + dy];
  }
  if (direction == "left") {
    position = [start[0] + dx - width / 2, start[1] + dy];
  }
  if (direction == "up") {
    position = [end[0] + dx, end[1] + dy - height / 2];
  }
  if (direction == "down") {
    position = [start[0] + dx, start[1] + dy - height / 2];
  }

  const streetGeometry = new THREE.BoxGeometry(width, height, 1);
  const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x454545 }); //0x8d99ae
  const street = new THREE.Mesh(streetGeometry, streetMaterial);

  street.position.x = position[0];
  street.position.y = position[1];
  street.position.z = 0;
  street["streetId"] = id;

  scene.add(street);
  return street;
};

const createLight = (scene) => {
  // Create light
  const pointLight = new THREE.AmbientLight(0x707070);

  // Set position
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);
};

const createPark = (scene) => {
  let park = Park();
  park.position.x = 25 + dx;
  park.position.y = 25 + dy;
  park.position.z = 0 + dz;
  scene.add(park);

  park = Park();
  park.position.x = 75 + dx;
  park.position.y = 25 + dy;
  park.position.z = 0 + dz;
  scene.add(park);

  park = Park();
  park.position.x = 25 + dx;
  park.position.y = 75 + dy;
  park.position.z = 0 + dz;
  scene.add(park);

  park = Park();
  park.position.x = 75 + dx;
  park.position.y = 75 + dy;
  park.position.z = 0 + dz;
  scene.add(park);
};

const addToDOM = (renderer, camera) => {
  // Add renderer to the DOM
  document.body.appendChild(renderer.domElement);

  // Set the background color
  renderer.setClearColor(0x4c4c4c, 1); //0x02182b //0xfb9062 //0xc4c4c4
};

///////////////////
// RENDERIZATION //
///////////////////
const updateCity = (
  renderer,
  scene,
  camera,
  lights,
  cars,
  cityID,
  frame_rate,
  previous_time,
  controls
) => {
  const render = async () => {
    const now = Date.now();
    const elapsed_time = now - previous_time;

    if (elapsed_time >= frame_rate) {
      const res = await fetch(`${baseURL}/${cityID}/cars`);
      const data = await res.json();

      const dataCar = data["currentCars"];
      for (const newCarState of dataCar) {
        for (const car of cars) {
          if (car["carId"] == newCarState["id"]) {
            car.position.x = newCarState.pos[0] + dx;
            car.position.y = newCarState.pos[1] + dy;
            car.direction = newCarState.direction;
            updateCarDirection(car, car.direction);
          }
        }
      }

      // UPDATE TRAFFIC LIGHT COLORS
      const dataLights = data["currentLights"];
      for (const newLightState of dataLights) {
        for (const light of lights) {
          if (light["lightId"] == newLightState["id"]) {
            updateTrafficLight(light, newLightState.color);
          }
        }
      }
      previous_time = now;
    }

    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();
};

const createCity = async () => {
  // Visualization
  const frame_rate = 50; // Refresh screen every 200 ms
  const previous_time = Date.now();
  const { scene, camera, renderer } = createView();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  createLight(scene);
  addToDOM(renderer, camera);

  // Create city
  const { cityID, stateCars, stateStreets, stateLights } = await getCity();

  // Create streets
  const streets = [];
  for (const street of stateStreets) {
    streets.push(
      createStreet(
        scene,
        street["id"],
        street["start"],
        street["end"],
        street["direction"]
      )
    );
  }

  // Create traffic lights
  const lights = [];
  for (const light of stateLights) {
    lights.push(
      createTrafficLights(
        scene,
        light["id"],
        light["pos"],
        light["color"],
        light["direction"]
      )
    );
  }

  // Create cars
  const cars = [];
  for (const car of stateCars) {
    cars.push(
      createCar(scene, car["id"], car["pos"], car["direction"], 0xff00ff)
    );
  }

  // Creating enviorenment
  createPark(scene);

  updateCity(
    renderer,
    scene,
    camera,
    lights,
    cars,
    cityID,
    frame_rate,
    previous_time,
    controls
  );
};

createCity();

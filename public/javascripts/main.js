// URL of API
const baseURL = "http://localhost:5000";

// Canvas drawing diferential
dx = -50;
dy = -50;

const trafficLightColors = {
  Green: 0x00ff00,
  Red: 0xff0000,
  Yellow: 0xffff00,
};

// Create city
const getCity = async () => {
  const res = await fetch(baseURL + "/city", {
    method: "POST",
  });

  // const data = await res.json();
  // console.log("DATA::::   ", data);
  // return res;
  // .then((response) => {
  //   return response.headers.get("Location");
  // });

  cityID = res.headers.get("Location");
  state = await res.json();
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
    50, // FOV
    // window.innerWidth / window.innerHeight, // Aspect
    1, // Aspect
    0.1, // Near
    2000 //Far
  );

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 110;

  // camera.position.x = -50;
  // camera.position.y = -50;
  // camera.position.z = 50;
  // camera.rotation.set(-0.2, -0.2, 0);

  // newX = 1;
  // newY = -1;
  // newZ = 1;

  // camera.rotation.set(newX, newY, newZ);

  // Create WebGL Instance
  const renderer = new THREE.WebGLRenderer();

  // orbit
  // const controls = new OrbitControls(camera, renderer.domElement);

  return {
    scene,
    camera,
    renderer,
  };
};

const createPlayground = (scene) => {
  const pgGeometry = new THREE.BoxGeometry(100, 100, 1);
  const pgMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
  const pg = new THREE.Mesh(pgGeometry, pgMaterial);
  pg.position.x = 0;
  pg.position.y = 0;

  scene.add(pg);
  return pg;
};

const createCar = (scene, id, pos, direction, color) => {
  // Define car geometry
  let carGeometry;
  if (direction == "left" || direction == "right") {
    carGeometry = new THREE.BoxGeometry(2, 1, 1);
  } else if (direction == "up" || direction == "down") {
    carGeometry = new THREE.BoxGeometry(1, 2, 1);
  }

  // Define car material
  const carMaterial = new THREE.MeshLambertMaterial({ color: color });
  // Create car
  const car = new THREE.Mesh(carGeometry, carMaterial);
  // car.position.x = 50;
  // car.position.y = 0;
  car["carId"] = id;
  car.position.x = pos[0] + dx;
  car.position.y = pos[1] + dy;

  scene.add(car);
  return car;
};

const createTrafficLights = (scene, id, pos, color) => {
  const lightGeometry = new THREE.BoxGeometry(2, 2, 1);

  const lightMaterial = new THREE.MeshLambertMaterial({
    color: trafficLightColors[color],
  });
  // Create car
  const light = new THREE.Mesh(lightGeometry, lightMaterial);
  light["lightId"] = id;
  light.position.x = pos[0] + dx;
  light.position.y = pos[1] + dy;

  scene.add(light);
  return light;
};

const createStreet = (scene, id, start, end, direction) => {
  let width = Math.abs(start[0] - end[0]);
  width = width == 0 ? 2 : width;
  let height = Math.abs(start[1] - end[1]);
  height = height == 0 ? 2 : height;

  console.log(id, "=", width, height);

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

  // console.log("---------------- ", width, height);
  // console.log("position: ", position);

  const streetGeometry = new THREE.BoxGeometry(width, height, 1);
  const streetMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const street = new THREE.Mesh(streetGeometry, streetMaterial);

  street.position.x = position[0];
  street.position.y = position[1];
  street["streetId"] = id;

  scene.add(street);
  return street;
};

const createLight = (scene) => {
  // Create light
  const pointLight = new THREE.PointLight(0xffffff);

  // Set position
  pointLight.position.x = 0;
  pointLight.position.y = 0;
  pointLight.position.z = 100;
  scene.add(pointLight);
};

const addToDOM = (renderer, camera) => {
  // Add renderer to the DOM
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setSize();
  document.body.appendChild(renderer.domElement);

  // console.log(camera["rotation"]);

  // Set the background color
  renderer.setClearColor(0x75a878, 1);
};

const updateCity = (
  renderer,
  scene,
  camera,
  lights,
  cars,
  cityID,
  frame_rate,
  previous_time
) => {
  const render = async () => {
    const now = Date.now();
    const elapsed_time = now - previous_time;

    if (elapsed_time >= frame_rate) {
      // console.log("_____________________________________");
      const res = await fetch(`${baseURL}/${cityID}/cars`);
      const data = await res.json();

      // console.log("-------------------");
      // console.log(data);
      // console.log("-------------------");

      const dataCar = data["currentCars"];

      for (const newCarState of dataCar) {
        for (const car of cars) {
          if (car["carId"] == newCarState["id"]) {
            car.position.x = newCarState.pos[0] + dx;
            car.position.y = newCarState.pos[1] + dy;
          }
        }
      }
      const dataLights = data["currentLights"];
      for (const newLightState of dataLights) {
        for (const light of lights) {
          if (light["lightId"] == newLightState["id"]) {
            // console.log(light);
            light.material.color.setHex(
              trafficLightColors[newLightState.color]
            );
          }
        }
      }

      previous_time = now;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  render();
};

const createCity = async () => {
  // Visualization
  const frame_rate = 200; // Refresh screen every 200 ms
  const previous_time = Date.now();
  const { scene, camera, renderer } = createView();
  createLight(scene);
  addToDOM(renderer, camera);

  // Create city
  const { cityID, stateCars, stateStreets, stateLights } = await getCity();
  // console.log("-------------------");
  // console.log(stateStreets);

  // const pg = createPlayground(scene);

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
      createTrafficLights(scene, light["id"], light["pos"], light["color"])
    );
  }

  // Create cars
  const cars = [];
  for (const car of stateCars) {
    cars.push(
      createCar(scene, car["id"], car["pos"], car["direction"], 0xff00ff)
    );
  }

  // console.log("CARS: ", cars);
  // console.log("state: ", state);

  updateCity(
    renderer,
    scene,
    camera,
    lights,
    cars,
    cityID,
    frame_rate,
    previous_time
  );
};

createCity();

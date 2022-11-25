# Tools
import numpy as np
from functools import reduce

# Mesa framework
from mesa import Agent, Model
from mesa.space import ContinuousSpace
from mesa.time import RandomActivation, SimultaneousActivation

# File imports
from data import dataStreets
from data import dataCars
from data import dataSetStreets


class TrafficLight(Agent):
    def __init__(self, model: Model, pos, state, time):
        super().__init__(model.next_id(), model)
        self.pos = pos
        self.state = state
        self.time = time

    def step(self):
        self.time = self.time + 1

        if (self.state == "Green"):
            if (self.time == 7):
                self.time = 0
                self.state = "Yellow"
                
        if (self.state == "Yellow"):
            if (self.time == 3):
                self.time = 0
                self.state = "Red"
                
        if (self.state == "Red"):
            if (self.time == 15):
                self.time = 0
                self.state = "Green"


class Street(Agent):
    def __init__(self, model: Model, start, end, direction, traffic_light):
        super().__init__(model.next_id(), model)
        self.start = start
        self.end = end
        self.traffic_light = traffic_light
        self.direction = direction
        self.nextStreet = { "right": None, "forward": None, "left": None }

    def setStreet(self, nextStreet):
        self.nextStreet = {"left": nextStreet[0],
                            "forward": nextStreet[1],
                            "right": nextStreet[2]
                            }



class Car(Agent):
    def __init__(self, model: Model, pos, speed, street: Street):
        super().__init__(model.next_id(), model)
        self.pos = pos
        self.speed = speed
        self.old_speed = speed
        self.street = street

    def changeLane(self, carTurn):
        self.street = self.street.nextStreet[carTurn]
    
    def car_advance(self):
        self.speed = self.old_speed
        new_pos = np.array(self.pos) + np.array([0.5, 0.5]) * self.speed
        self.model.space.move_agent(self, new_pos)


    def step(self):

        traffic_light = self.street.traffic_light
                
        distance_from_start = reduce(lambda acc, current: acc + current, np.subtract(self.street.start, self.pos))
        distance_from_end = reduce(lambda acc, current: acc + current, np.subtract(self.street.end, self.pos))

        speed_radius = 3
        speed = abs(self.speed[0] + (self.speed[1]))

        # FIX: Kinda works?
        if (0 <= speed <= 1): speed_radius = 5
        elif (1 < speed <= 3): speed_radius = 7
        elif (3 < speed <= 5): speed_radius = 9
        else: speed_radius = speed + 5
        # speed_radius = reduce(lambda acc, current: acc + current, np.subtract(self.street.end, self.pos))
        # print(self.unique_id, "   ", speed_radius)



        neighbor_cars = [n for n in self.model.space.get_neighbors(self.pos, radius = speed_radius, include_center = False) if isinstance(n, Car) and n.street == self.street and n != self]
        ahead_cars = [n for n in neighbor_cars if np.less(self.pos, n.pos).any()]

        # If driving in "opposite" direction: Invert the sign & Get cars ahead of me
        if (self.street.direction == "left" or self.street.direction == "down"):
            distance_from_end = -distance_from_end
            ahead_cars = [n for n in neighbor_cars if np.greater(self.pos, n.pos).any()]


        # If within range of traffic light
        if (2.5 <= distance_from_end <= 7.5):
            if (traffic_light.state == "Red"):
                # print("-------------------")
                self.speed = [0, 0]
            elif (traffic_light.state == "Green" or traffic_light.state == "Yellow"):
                self.car_advance()
            else:
                self.car_advance()


        # If cars in front of me
        elif ahead_cars:
            # print("AHEAD CARS: ", len(ahead_cars))
            closest_car = min(ahead_cars, key=lambda n:
                reduce(lambda acc, current: acc + current, abs(np.subtract(self.pos, n.pos))))

            # print("CLOSEST CARS: ", closest_car.unique_id)
            # Check distance with closest_car
            if closest_car.speed == [0, 0]:
                self.speed = [0, 0]

            else:
                self.old_speed = closest_car.speed
                self.car_advance()



        # ---- STREET CHANGE ---- 
        # If going in right direction
        # print(self.pos, "     ", self.street.start)
        elif (self.street.direction == "right" or self.street.direction == "up"):
            if (np.less(self.pos, self.street.start).any() or np.greater_equal(self.pos, self.street.end).all()):
                print("------------")
                print("LANE CHANGE")
                carTurn = "forward"
                self.changeLane(carTurn)
                
            self.car_advance()
    
        # If going in "opposite" direction
        # print(self.pos, "     ", self.street.start)
        elif (self.street.direction == "left" or self.street.direction == "down"):
            if (np.greater(self.pos, self.street.start).any() or np.less_equal(self.pos, self.street.end).all()):
                print("------------")
                print("LANE CHANGE")
                carTurn = "forward"
                self.changeLane(carTurn)

            self.car_advance()

        


class City(Model):
    def __init__(self):
        super().__init__()
        self.space = ContinuousSpace(100, 100, True)
        self.schedule = SimultaneousActivation(self)

        # Creating streets
        streets = []        
        for dataStreet in dataStreets:
            currentLight  = (TrafficLight(self, dataStreet["light"]["pos"], dataStreet["light"]["state"], dataStreet["light"]["time"]))
            currentStreet = Street(self, dataStreet["start"], dataStreet["end"], dataStreet["direction"], currentLight)
            
            # traffic_lights.append(currentLight)
            streets.append(currentStreet)
            
            self.space.place_agent(currentLight, currentLight.pos)
            self.schedule.add(currentLight)
        
            self.space.place_agent(currentStreet, currentStreet.start)
            self.schedule.add(currentStreet)
        
        
        
        # Creating cars
        for dataCar in dataCars:
            currentCar = Car(self, dataCar["pos"], dataCar["speed"], streets[dataCar["street"]])
            self.space.place_agent(currentCar, currentCar.pos)
            self.schedule.add(currentCar)

        for dataSetStreet in dataSetStreets:
            s1 = streets[dataSetStreet["info"][0]] if dataSetStreet["info"][0] != None else None 
            s2 = streets[dataSetStreet["info"][1]] if dataSetStreet["info"][1] != None else None 
            s3 = streets[dataSetStreet["info"][2]] if dataSetStreet["info"][2] != None else None 
            streets[dataSetStreet["id"]].setStreet([s1, s2, s3])

    def step(self):
        self.schedule.step()

    def getCars(self):
        cars = []
        for n in self.schedule.agents:
            if isinstance(n, Car):
                cars.append({"id": n.unique_id, "pos": [n.pos[0], n.pos[1]], "direction": n.street.direction})
        return cars

    def getStreets(self):
        streets = []
        for n in self.schedule.agents:
            if isinstance(n, Street):
                streets.append({"id": n.unique_id,
                                    "start": [n.start[0], n.start[1]],
                                    "end": [n.end[0], n.end[1]],
                                    "direction": n.direction
                                })
        return streets

    def getTrafficLights(self):
        lights = []
        for n in self.schedule.agents:
            if isinstance(n, TrafficLight):
                lights.append({"id": n.unique_id, "pos": [n.pos[0], n.pos[1]], "color": n.state})
        return lights

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



class Car(Agent):
    def __init__(self, model: Model, pos, speed, street: Street):
        super().__init__(model.next_id(), model)
        self.pos = pos
        self.speed = speed
        self.old_speed = speed
        self.street = street

        


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
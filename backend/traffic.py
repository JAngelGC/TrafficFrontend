# Tools
import numpy as np
from functools import reduce

# Mesa framework
from mesa import Agent, Model
from mesa.space import ContinuousSpace
from mesa.time import RandomActivation, SimultaneousActivation


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
    
    def step(self):
        self.schedule.step()
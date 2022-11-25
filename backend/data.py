dataStreets = [
    # Street 0 -> left to right 1
    {
    "start": [0, 45],
    "end": [50, 45],
    "direction": "right",
    "light": {
        "pos": [50, 44],
        "state": "Green",
        "time": 0,
        } 
    },
    # Street 1 -> left to right 2
    {
    "start": [50, 45],
    "end": [100, 45],
    "direction": "right",
    "light": {
        "pos": [99, 44],
        "state": "Green",
        "time": 0,
        } 
    },
    # Street 2 -> right to left 1
    {
    "start": [100, 55],
    "end": [50, 55],
    "direction": "left",
    "light": {
        "pos": [50, 56],
        "state": "Green",
        "time": 0,
        } 
    },
    # Street 3 -> right to left 2
    {
    "start": [50, 55],
    "end": [0, 55],
    "direction": "left",
    "light": {
        "pos": [0, 56],
        "state": "Green",
        "time": 0,
        } 
    },

    # Street 4 -> down to up 1
    {
    "start": [55, 0],
    "end": [55, 50],
    "direction": "up",
    "light": {
        "pos": [56, 50],
        "state": "Red",
        "time": 5,
        } 
    },
    # Street 5 -> down to up 2
    {
    "start": [55, 50],
    "end": [55, 100],
    "direction": "up",
    "light": {
        "pos": [56, 99],
        "state": "Red",
        "time": 5,
        } 
    },
    # Street 6 -> down to up 1
    {
    "start": [45, 100],
    "end": [45, 50],
    "direction": "down",
    "light": {
        "pos": [44, 50],
        "state": "Red",
        "time": 5,
        } 
    },
    # Street 7 -> down to up 2
    {
    "start": [45, 50],
    "end": [45, 0],
    "direction": "down",
    "light": {
        "pos": [44, 0],
        "state": "Red",
        "time": 5,
        } 
    }    

]


dataCars = [
    # Cars Street 0 (left to right 1)
    {
        "pos": [0, 45],
        "speed": [1, 0],
        "street": 0
    },
    {
        "pos": [20, 55],
        "speed": [-1, 0],
        "street": 3
    },
    {
        "pos": [55, 15],
        "speed": [0, 1],
        "street": 4
    },
    {
        "pos": [45, 80],
        "speed": [0, -1],
        "street": 6
    }
]


dataSetStreets = [
    #left forward right
    {
        "id": 0 ,
        "info": [None, 1, None]
    },
    {
        "id": 1 ,
        "info": [None, 0, None]
    },
    {
        "id": 2 ,
        "info": [None, 3, None]
    },
    {
        "id": 3 ,
        "info": [None, 2, None]
    },
    {
        "id": 4 ,
        "info": [None, 5, None]
    },
    {
        "id": 5 ,
        "info": [None, 4, None]
    },
    {
        "id": 6 ,
        "info": [None, 7, None]
    },
    {
        "id": 7 ,
        "info": [None, 6, None]
    },
]
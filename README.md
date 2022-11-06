# BigData
This project simulate a chain of ice-cream shops.  
The project is built from 3 sub-systems:  
## Simulator:
- Simulates orders of ice creams from various branches.  
## Dashboard:
- Present the stock of ice cream both in each branch sperately and in all the branches combined (data is stored on Reddis).
- Present prediction for future sales.
## Data storage:
- Store in mysql all the relevent data about each branch (the data is taken from APIs).
- For each sale it stores the details of the sale on mongoDB and add information about the weather on that day and wether there is a holiday or not.
- Make a prediction about future sales using BigML.

All the sub-systems communicate using Kafka.

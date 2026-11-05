db = db.getSiblingDB("jetour");
db.flights.drop(); db.bookings.drop(); db.ratelimits.drop();
const base = {airline:"Jetour Airways",classType:"Economy",baggage:"20kg",status:"Scheduled",tag:"Available",createdAt:new Date(),updatedAt:new Date()};
db.flights.insertMany([
 {...base,flightNo:"JT-101",origin:"Manila",destination:"Tokyo",originCode:"MNL",destinationCode:"NRT",departureDate:"2026-12-01",departureTime:"07:30",arrivalTime:"12:50",duration:"4h 20m",price:12499,availableSeats:30,tag:"Popular"},
 {...base,flightNo:"JT-102",origin:"Manila",destination:"Tokyo",originCode:"MNL",destinationCode:"NRT",departureDate:"2026-12-01",departureTime:"14:10",arrivalTime:"21:00",duration:"6h 50m",price:8999,availableSeats:3,airline:"Sky Partner",stops:1},
 {...base,flightNo:"JT-103",origin:"Manila",destination:"Tokyo",originCode:"MNL",destinationCode:"NRT",departureDate:"2026-12-01",departureTime:"21:45",arrivalTime:"03:00",duration:"4h 15m",price:17999,availableSeats:12,classType:"Business",baggage:"40kg"},
 {...base,flightNo:"JT-104",origin:"Manila",destination:"Tokyo",originCode:"MNL",destinationCode:"NRT",departureDate:"2026-12-01",departureTime:"09:00",arrivalTime:"14:00",duration:"4h",price:9999,availableSeats:10,status:"Cancelled"},
 {...base,flightNo:"JT-201",origin:"Tokyo",destination:"Manila",originCode:"NRT",destinationCode:"MNL",departureDate:"2026-12-08",departureTime:"10:00",arrivalTime:"13:30",duration:"4h 30m",price:13499,availableSeats:25},
 {...base,flightNo:"JT-301",origin:"Cebu",destination:"Singapore",originCode:"CEB",destinationCode:"SIN",departureDate:"2026-12-05",departureTime:"06:15",arrivalTime:"09:55",duration:"3h 40m",price:7499,availableSeats:20},
 {...base,flightNo:"JT-302",origin:"Manila",destination:"Seoul",originCode:"MNL",destinationCode:"ICN",departureDate:"2026-12-03",departureTime:"23:30",arrivalTime:"04:50",duration:"4h 20m",price:9899,availableSeats:2},
 {...base,flightNo:"JT-303",origin:"Manila",destination:"Singapore",originCode:"MNL",destinationCode:"SIN",departureDate:"2026-12-02",departureTime:"11:00",arrivalTime:"14:30",duration:"3h 30m",price:6999,availableSeats:40},
]);
print("seeded", db.flights.countDocuments());

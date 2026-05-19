export type Flight = {
  _id: string;
  flightNo: string;
  airline: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classType: string;
  baggage: string;
  price: number;
  availableSeats: number;
  status: "Scheduled" | "Delayed" | "Cancelled" | "Completed";
  tag: string;
};
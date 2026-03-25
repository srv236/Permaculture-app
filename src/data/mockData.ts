import { Producer } from "../types/farm";

export const MOCK_PRODUCERS: Producer[] = [
  {
    id: "1",
    name: "Elena Rodriguez",
    phone: "+1234567890",
    email: "elena@greenvalley.com",
    farmName: "Green Valley Permaculture",
    locations: ["North Hills", "East River"],
    picture: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200&h=200",
    produce: [
      {
        id: "p1",
        name: "Tomatoes",
        variety: "Heirloom Cherokee Purple",
        price: "$4.50/lb",
        quantity: "20 lbs available",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "p2",
        name: "Kale",
        variety: "Lacinato (Dino)",
        price: "$3.00/bunch",
        quantity: "15 bunches",
        image: "https://images.unsplash.com/photo-1524179524541-1aa1ece28142?auto=format&fit=crop&q=80&w=400"
      }
    ]
  },
  {
    id: "2",
    name: "Marcus Thorne",
    phone: "+1987654321",
    email: "marcus@earthwise.farm",
    farmName: "Earthwise Sanctuary",
    locations: ["South Plateau"],
    picture: "https://images.unsplash.com/photo-1560365163-3e8d64e762ef?auto=format&fit=crop&q=80&w=200&h=200",
    produce: [
      {
        id: "p3",
        name: "Honey",
        variety: "Wildflower Raw",
        price: "$12.00/jar",
        quantity: "10 jars",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400"
      }
    ]
  }
];
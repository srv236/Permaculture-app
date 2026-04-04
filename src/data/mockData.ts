import { Producer } from "../types/farm";

export const MOCK_PRODUCERS: Producer[] = [
  {
    id: "1",
    name: "Elena Rodriguez",
    phone: "+1234567890",
    email: "elena@greenvalley.com",
    farm_name: "Green Valley Permaculture",
    locations: ["North Hills", "East River"],
    picture_url: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200&h=200",
    is_verified: true,
    has_completed_course: true,
    produce: [
      {
        id: "p1",
        farm_id: "f1",
        name: "Tomatoes",
        variety: "Heirloom Cherokee Purple",
        price: "$4.50/lb",
        quantity: "20 lbs available",
        image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "p2",
        farm_id: "f1",
        name: "Kale",
        variety: "Lacinato (Dino)",
        price: "$3.00/bunch",
        quantity: "15 bunches",
        image_url: "https://images.unsplash.com/photo-1524179524541-1aa1ece28142?auto=format&fit=crop&q=80&w=400"
      }
    ]
  },
  {
    id: "2",
    name: "Marcus Thorne",
    phone: "+1987654321",
    email: "marcus@earthwise.farm",
    farm_name: "Earthwise Sanctuary",
    locations: ["South Plateau"],
    picture_url: "https://images.unsplash.com/photo-1560365163-3e8d64e762ef?auto=format&fit=crop&q=80&w=200&h=200",
    is_verified: true,
    has_completed_course: true,
    produce: [
      {
        id: "p3",
        farm_id: "f2",
        name: "Honey",
        variety: "Wildflower Raw",
        price: "$12.00/jar",
        quantity: "10 jars",
        image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400"
      }
    ]
  }
];
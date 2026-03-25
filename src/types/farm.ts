export interface Produce {
  id: string;
  name: string;
  variety: string;
  price: string;
  quantity: string;
  image: string;
}

export interface Producer {
  id: string;
  name: string;
  phone: string;
  email: string;
  farmName: string;
  locations: string[];
  picture?: string;
  produce: Produce[];
}
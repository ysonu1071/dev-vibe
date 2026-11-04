import { seedData } from '../utils/seed';

export type ServiceItem = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

const services: ServiceItem[] = [...seedData.services];

export const listServices = () => services;

export const getServiceById = (id: string) => services.find((item) => item.id === id);

export const createService = (input: { name: string; duration: number; price: number }) => {
  const item = {
    id: `svc-${Date.now()}`,
    name: input.name,
    duration: Number(input.duration),
    price: Number(input.price),
  };

  services.push(item);
  return item;
};

export const updateService = (id: string, input: Partial<{ name: string; duration: number; price: number }>) => {
  const index = services.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  services[index] = {
    ...services[index],
    ...input,
    duration: input.duration !== undefined ? Number(input.duration) : services[index].duration,
    price: input.price !== undefined ? Number(input.price) : services[index].price,
  };

  return services[index];
};

export const deleteService = (id: string) => {
  const index = services.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  services.splice(index, 1);
  return true;
};

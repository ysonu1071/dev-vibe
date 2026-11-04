import { seedData } from '../utils/seed';

export type BranchItem = {
  id: string;
  salonId: string;
  name: string;
  city: string;
  address: string;
  status: string;
};

const branches: BranchItem[] = [...seedData.branches];

export const listBranches = () => branches;

export const getBranchById = (id: string) => branches.find((item) => item.id === id);

export const createBranch = (input: { name: string; city: string; address: string; salonId?: string }) => {
  const branch = {
    id: `branch-${Date.now()}`,
    salonId: input.salonId ?? 'salon-1',
    name: input.name,
    city: input.city,
    address: input.address,
    status: 'active',
  };

  branches.push(branch);
  return branch;
};

export const updateBranch = (id: string, input: Partial<{ name: string; city: string; address: string; status: string }>) => {
  const index = branches.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  branches[index] = {
    ...branches[index],
    ...input,
  };

  return branches[index];
};

export const deleteBranch = (id: string) => {
  const index = branches.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  branches.splice(index, 1);
  return true;
};

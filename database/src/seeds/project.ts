import { Project, User } from "@backend/typeorm";
import { faker } from "@faker-js/faker";

export const projectSize = 5;

const projects = faker.helpers.multiple((): Partial<Project> => ({
  key: faker.string.alpha({ length: 4 }).toUpperCase(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  imageUrl: faker.image.url(),
  // @ts-ignore
  owner: { id: 1 }
}), { count: projectSize });

const getProjectSeeds = () => {
  const projectSeeds = [];
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    projectSeeds.push({
      ...project,
      id: i + 1,
    })
  }
  return projectSeeds;
}
export default getProjectSeeds;
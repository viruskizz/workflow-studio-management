import { ProjectEffects } from "./project/project.effects"
import { projectReducer } from "./project/project.reducer"

export const AppReducer = {
  project: projectReducer,
}

export const AppEffects = [
  ProjectEffects
]
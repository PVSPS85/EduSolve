import { api } from './api';
import { Project, ApplicationSubmission } from '../types';

export const projectService = {
  async getProjects(filters?: Record<string, string>) {
    return api.get<Project[]>('/projects', { params: filters });
  },

  async getProjectById(id: string) {
    return api.get<Project>(`/projects/${id}`);
  },

  async createProject(projectData: Partial<Project>) {
    return api.post<Project>('/projects', projectData);
  },

  async applyToProject(applicationData: Partial<ApplicationSubmission>) {
    return api.post<ApplicationSubmission>('/applications', applicationData);
  },

  async getApplications(projectId?: string) {
    return api.get<ApplicationSubmission[]>('/applications', {
      params: projectId ? { projectId } : undefined,
    });
  },
};


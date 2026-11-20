import { api } from './api';
import { WorkspaceProject } from '../types';

export const workspaceService = {
  async getWorkspaces() {
    return api.get<WorkspaceProject[]>('/workspaces');
  },

  async getWorkspaceById(id: string) {
    return api.get<WorkspaceProject>(`/workspaces/${id}`);
  },

  async updateTask(workspaceId: string, taskId: string, updates: any) {
    return api.put(`/workspaces/${workspaceId}/tasks/${taskId}`, updates);
  },
};


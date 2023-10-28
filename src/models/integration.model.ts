import { ProjectConnection } from "@linear/sdk";

export interface IntegrationItem {
  id: number;
  name: string;
  description: string;
  iconURL: string;
}

export interface IntegrationTask {}

export interface IntegrationProject {
  id: string;
  name: string;
}

export interface Integration {
  name: string;
  description: string;
  iconURL: string;
  apiKey?: string;

  checkToken(apiKey: any): Promise<boolean>;
  // fetchTasks(): Promise<IntegrationTask>;
  fetchProjects(): Promise<IntegrationProject[]>;
}

export class LinearIntegration implements Integration {
  name = "linear";
  description =
    "Linear is a better way to build products\nMeet the new standard for modern software development.Streamline issues, sprints, and product roadmaps.";
  iconURL = "/img/integrations/linear.svg";
  apiKey?: string;

  async checkToken(apiKey: string): Promise<boolean> {
    try {
      const { ok } = await fetch(`/api/linear/check_token`, {
        headers: { Authorization: apiKey },
      }).then((r) => r.json());

      return ok;
    } catch (e) {
      return false;
    }
  }

  async fetchProjects(): Promise<IntegrationProject[]> {
    if (!this.apiKey) throw new Error(`${this.name} apiKey is missing`);

    const req = await fetch(`/api/linear/get_projects`, {
      headers: { Authorization: this.apiKey },
    });
    const res: ProjectConnection = await req.json();

    return res.nodes.map((p) => ({ name: p.name, id: p.id }));
  }
}

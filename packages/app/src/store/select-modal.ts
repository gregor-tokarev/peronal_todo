import { defineStore } from "pinia";
import { Project } from "@models/project.model.ts";
import { Draft } from "@models/draft.model.ts";
import { ProjectStatus } from "@models/projectStauts.model.ts";

function modelStoreFabric<TFn extends Function, TOptions, TResult>(
  name: string,
) {
  return defineStore(name, {
    state: () => ({
      resolveFn: null as null | TFn,
      modalOptions: null as TOptions | null,
      open: false,
    }),
    actions: {
      use(options: TOptions): Promise<TResult> {
        this.open = true;

        return new Promise((resolve) => {
          this.resolveFn = resolve;
          this.modalOptions = options;
        });
      },
      close() {
        this.resolveFn = null;
        this.modalOptions = null;
        this.open = false;
      },
    },
  });
}

interface ProjectModalOptions {
  draft?: Draft;
  hintText: string;
}

interface ProjectModalFn {
  (value: string): void;
}
export const useProjectModalStore = modelStoreFabric<
  ProjectModalFn,
  ProjectModalOptions,
  Project["id"]
>("projectModal");

interface ProjectStatusModalOptions {
  statusId: string | null;
  hintText: string;
}
interface ProjectStatusModalFn {
  (value: string): void;
}

export const useProjectStatusModalStore = modelStoreFabric<
  ProjectStatusModalFn,
  ProjectStatusModalOptions,
  ProjectStatus["id"]
>("projectStatusModal");

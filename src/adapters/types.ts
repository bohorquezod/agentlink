export interface RootDocMapping {
  source: string;
  target: string;
}

export interface CategoryTarget {
  dir: string;
  transform?: (filename: string) => string;
}

export interface IdeAdapter {
  id: string;
  name: string;
  description: string;
  rootDocs: RootDocMapping[];
  skills?: CategoryTarget;
  agents?: CategoryTarget;
  commands?: CategoryTarget;
}

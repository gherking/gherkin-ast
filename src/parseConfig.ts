export enum TagFormat {
  PARAMETERLESS,
  FUNCTIONAL,
  ASSIGNMENT,
  UNDERSCORE,
}

export type ParseConfig = {
  tagFormat: TagFormat,
};

const DEFAULT_CONFIG: ParseConfig = {
  tagFormat: TagFormat.FUNCTIONAL,
}

class Configuration {
  constructor(private config: ParseConfig = DEFAULT_CONFIG) {
  }

  set(config?: Partial<ParseConfig>) {
    this.config = {
      tagFormat: config?.tagFormat ?? DEFAULT_CONFIG.tagFormat,
    };
  }

  get(): ParseConfig {
    return this.config;
  }
}

export default new Configuration();

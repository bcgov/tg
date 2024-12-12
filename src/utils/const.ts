export const DEGREE_SEP = 1;

export const DATETIME = {
  TODAY: new Date(),
  EOL_NEAR: new Date(new Date().setMonth(new Date().getMonth() + 6)),
};

export enum ViewMode {
  Default = 'default',
  Integrations = 'integrations',
  Environments = 'environments',
}

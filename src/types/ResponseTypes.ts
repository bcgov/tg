export interface Technology {
  cr57a_technologyname: string;
  cr57a_technologiesid: string;
  cr57a_eoldate: string;
}

export interface Application {
  cr57a_appshortcode: string;
  cr57a_appscatalogueid: string;
  cr57a_productowner: string;
  cr57a_risklevel: number;
}

export interface ApplicationTechnology {
  _cr57a_appshortcode_value: string;
  _cr57a_technology_value: string;
}

export interface AppEnvironments {
  cr57a_apphostingserverid: string;
  _cr57a_databaseserver_value: string;
  _cr57a_serverappliance_value: string;
  cr57a_openshiftnamespace: string;
  _cr57a_appshortcode_value: string;
  _cr57a_appname_value: string;
  cr57a_category: number;
  cr57a_appserver: string | null;
  cr57a_storage: string | null;
}

export interface ApplicationIntegrations {
  _cr57a_appshortcode_value: string;
  _cr57a_upstreamapplication_value: string;
  _cr57a_downstreamapplication_value: string;
  cr57a_commoncomponent: number;
}

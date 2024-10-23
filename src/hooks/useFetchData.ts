import { useEffect, useRef, useState } from "react";
import { IInputs } from "../generated/ManifestTypes";

interface Technology {
  cr57a_technologyname: string;
  cr57a_technologiesid: string;
  cr57a_eoldate: string;
}

interface Application {
  cr57a_appshortcode: string;
  cr57a_appscatalogueid: string;
  cr57a_productowner: string;
  cr57a_risklevel: number;
}

interface ApplicationTechnology {
  _cr57a_appshortcode_value: string;
  _cr57a_technology_value: string;
}

interface AppHostingServer {
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

interface ApplicationIntegrations {
  _cr57a_appshortcode_value: string;
  _cr57a_upstreamapplication_value: string;
  _cr57a_downstreamapplication_value: string;
  cr57a_commoncomponent: number;
}

interface FetchDataParams {
  context?: ComponentFramework.Context<IInputs>;
}

const useFetchData = ({ context }: FetchDataParams = {}) => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationTechnologies, setApplicationTechnologies] = useState<
    ApplicationTechnology[]
  >([]);
  const [applicationIntegrations, setApplicationIntegrations] = useState<
    ApplicationIntegrations[]
  >([]);
  const [applicationEnvironments, setApplicationEnvironments] = useState<
    AppHostingServer[]
  >([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const isPCF = !!context;
  const hasFetchedData = useRef(false);

  const fetchCRM = async () => {
    try {
      if (isPCF && context) {
        console.log("Using webAPI retrieval");

        const appFetch = await context.webAPI.retrieveMultipleRecords(
          "cr57a_appscatalogue",
          "?$select=cr57a_description,cr57a_businessarea,cr57a_businesssme,cr57a_appshortcode,cr57a_appscatalogueid"
        );

        const techFetch = await context.webAPI.retrieveMultipleRecords(
          "cr57a_technologies",
          "?$select=cr57a_technologyname,cr57a_eoldate,cr57a_technologiesid"
        );
        const appTechFetch = await context.webAPI.retrieveMultipleRecords(
          "cr57a_applicationtechnologies",
          ""
        );
        const appIntFetch = await context.webAPI.retrieveMultipleRecords(
          "cr57a_appintegrationses",
          ""
        );
        const appEnvFetch = await context.webAPI.retrieveMultipleRecords(
          "cr57a_appenvironmentses",
          ""
        );
        setApplications(appFetch.entities as Application[]);
        setTechnologies(techFetch.entities as Technology[]);
        setApplicationTechnologies(
          appTechFetch.entities as ApplicationTechnology[]
        );
        setApplicationIntegrations(
          appIntFetch.entities as ApplicationIntegrations[]
        );
        setApplicationEnvironments(appEnvFetch.entities as AppHostingServer[]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (hasFetchedData.current) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await fetchCRM();
      setLoading(false);
      hasFetchedData.current = true;

    };

    fetchData();
  }, [context, isPCF]);

  return {
    technologies,
    applications,
    applicationTechnologies,
    applicationIntegrations,
    applicationEnvironments,
    loading,
  };
};

export default useFetchData;

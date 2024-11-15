import { useEffect, useRef, useState } from 'react';
import { IInputs } from '../generated/ManifestTypes';
import axios from 'axios';
import {
  Technology,
  Application,
  ApplicationIntegrations,
  ApplicationTechnology,
  AppEnvironments,
  TechnologyVersion,
} from '../types/ResponseTypes';

interface FetchDataParams {
  context?: ComponentFramework.Context<IInputs>;
}

const useFetchData = ({ context }: FetchDataParams = {}) => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [techVersions, setTechVersions] = useState<TechnologyVersion[]>([]);
  const [applicationTechnologies, setApplicationTechnologies] = useState<ApplicationTechnology[]>(
    [],
  );
  const [applicationIntegrations, setApplicationIntegrations] = useState<ApplicationIntegrations[]>(
    [],
  );
  const [applicationEnvironments, setApplicationEnvironments] = useState<AppEnvironments[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isPCF = !!context;
  const hasFetchedData = useRef(false);
  const API_URL = process.env.REACT_APP_NOT_SECRET_CODE;

  const fetchWithAuth = async (url: string, token: string) => {
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'odata.include-annotations=OData.Community.Display.V1.FormattedValue',
      },
    });
  };

  const fetchDataWithToken = async () => {
    try {
      // Obtain the auth token from localhost:3001/token
      const tokenResponse = await axios.post('http://localhost:3001/token');
      const authToken = tokenResponse.data.token;

      // Define the API URLs
      const apiUrls = {
        technologies: `${API_URL}api/data/v9.2/cr57a_technologieses`,
        applications: `${API_URL}api/data/v9.2/cr57a_appscatalogues`,
        appTechnologies: `${API_URL}api/data/v9.2/cr57a_applicationtechnologieses`,
        appIntegrations: `${API_URL}api/data/v9.2/cr57a_appintegrationses`,
        appHostingServers: `${API_URL}api/data/v9.2/cr57a_appenvironmentses`,
        technologiesVersion: `${API_URL}api/data/v9.2/imb_technologyversions`,
      };

      // Fetch all data concurrently with the auth token
      const [
        techResponse,
        appResponse,
        appTechResponse,
        appIntegrationsResponse,
        appHostingServerResponse,
        technologiesVersionResponse,
      ] = await Promise.all([
        fetchWithAuth(apiUrls.technologies, authToken),
        fetchWithAuth(apiUrls.applications, authToken),
        fetchWithAuth(apiUrls.appTechnologies, authToken),
        fetchWithAuth(apiUrls.appIntegrations, authToken),
        fetchWithAuth(apiUrls.appHostingServers, authToken),
        fetchWithAuth(apiUrls.technologiesVersion, authToken),
      ]);

      setApplications(appResponse.data.value);
      setTechnologies(techResponse.data.value);
      setApplicationTechnologies(appTechResponse.data.value);
      setApplicationIntegrations(appIntegrationsResponse.data.value);
      setApplicationEnvironments(appHostingServerResponse.data.value);
      setTechVersions(technologiesVersionResponse.data.value);
    } catch (error) {
      console.error('Error fetching authenticated data:', error);
    }
  };

  const fetchCRM = async () => {
    if (isPCF && context) {
      console.log('Using webAPI retrieval');

      const appFetch = await context.webAPI.retrieveMultipleRecords('cr57a_appscatalogue', '');

      const techFetch = await context.webAPI.retrieveMultipleRecords('cr57a_technologies', '');
      const techVersion = await context.webAPI.retrieveMultipleRecords(
        'imb_technologyversions',
        '',
      );
      const appTechFetch = await context.webAPI.retrieveMultipleRecords(
        'cr57a_applicationtechnologies',
        '',
      );
      const appIntFetch = await context.webAPI.retrieveMultipleRecords(
        'cr57a_appintegrationses',
        '',
      );
      const appEnvFetch = await context.webAPI.retrieveMultipleRecords(
        'cr57a_appenvironmentses',
        '',
      );
      setApplications(appFetch.entities as Application[]);
      setTechnologies(techFetch.entities as Technology[]);
      setApplicationTechnologies(appTechFetch.entities as ApplicationTechnology[]);
      setApplicationIntegrations(appIntFetch.entities as ApplicationIntegrations[]);
      setApplicationEnvironments(appEnvFetch.entities as AppEnvironments[]);
      setTechVersions(techVersion.entities as TechnologyVersion[]);
    }
  };

  useEffect(() => {
    if (hasFetchedData.current) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchCRM();
      } catch (error) {
        console.error('Error fetching data with Context.WebAPI:', error);
        console.log('Using fallback using local development server');
        await fetchDataWithToken();
      }
      setLoading(false);
      hasFetchedData.current = true;
    };

    fetchData();
  }, []);

  return {
    technologies,
    applications,
    applicationTechnologies,
    applicationIntegrations,
    applicationEnvironments,
    techVersions,
    loading,
  };
};

export default useFetchData;

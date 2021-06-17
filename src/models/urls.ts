import { Region, VehicleView } from '../types';

export const SERVER_URLS = {
  [Region.China]: 'b2vapi.bmwgroup.cn:8592',
  [Region.Europe]: 'b2vapi.bmwgroup.com',
  [Region.UnitedStates]: 'b2vapi.bmwgroup.us',
};

export const OAUTH_ENDPOINTS = {
  [Region.China]: 'gcdm/oauth',
  [Region.Europe]: 'gcdm/oauth',
  [Region.UnitedStates]: 'gcdm/usa/oauth',
}

/**
 * Handles all URLs required by BMW API
 */
export class Urls {
  private readonly _host: string;
  private readonly _oauthEnpoint: string;

  constructor(private readonly _region: Region) {
    this._host = this._getHostForRegionOrThrow(this._region);
    this._oauthEnpoint = this._getOauthEndpointForRegionOrThrow(this._region);
  }

  private _getHostForRegionOrThrow(region: Region): string {
    if (SERVER_URLS[region]) return SERVER_URLS[region];
    throw new Error('Unsupported region.');
  }

  private _getOauthEndpointForRegionOrThrow(region: Region): string {
    if (SERVER_URLS[region]) return OAUTH_ENDPOINTS[region];
    throw new Error('Unsupported region.');
  }

  getHost() {
    return this._host;
  }

  getAuthURL() {
    return `https://customer.bmwgroup.com/${this._oauthEnpoint}/token`;
  }

  getBaseURL() {
    return `https://${this._host}/webapi/v1`;
  }

  getVehiclesURL() {
    return `${this.getBaseURL()}/user/vehicles`;
  }

  getVehicleVinURL(vin: string) {
    return `${this.getVehiclesURL()}/${vin}`;
  }

  getVehicleStatusURL(vin: string) {
    return `${this.getVehicleVinURL(vin)}/status`;
  }

  getRemoteServiceStatusURL(vin: string, serviceType: string) {
    return `${this.getVehicleVinURL(vin)}/serviceExecutionStatus?serviceType=${serviceType}`;
  }

  getRemoteServiceURL(vin: string) {
    return `${this.getVehicleVinURL(vin)}/executeService`;
  }

  getVehicleImage(vin: string, width: number, height: number, view: VehicleView) {
    return `${this.getVehicleVinURL(vin)}/image?width=${width}&height=${height}&view=${view}`;
  }
}

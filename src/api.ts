import axios, { AxiosRequestConfig } from 'axios';
import * as querystring from 'querystring';
import axiosRetry from 'axios-retry';

import { Urls } from './models/urls';
import { Vehicle } from './models/vehicle';
import { logger } from './models/logger';
import { Region, VehicleView } from './types';
import { VehicleStatus } from './models/vehicle-status';

axiosRetry(axios, { retries: 3 });
const sleep = async (ms = 0) => new Promise(r => setTimeout(r, ms));

export type ApiConfig = {
  region: Region;
  username: string;
  password: string;
}

export class API {
  private readonly _urls: Urls;
  private _oauthToken?: string;
  private _refreshToken?: string;
  private _tokenExpiresAt?: Date;

  /**
   * Initializes the API
   *
   * @example
   * import API from '@mihaiblaga89/bmw-connecteddrive-api';
   *
   * await API.init({
   *   region: 'eu',
   *   username: 'user@example.com',
   *   password: 'mySuperPassword',
   *   debug: true,
   * });
   */
  constructor(private readonly _config: ApiConfig,
              private readonly _debug = false) {
    // derive urls for initial region
    this._urls = new Urls(_config.region);
  }

  /**
   * Make a generic request to BMW API
   */
  async requestWithAuth<T>(url: string, {
    headers: overwriteHeaders = {},
    method = 'GET',
    postData = {},
    ...rest
  }: AxiosRequestConfig & { postData?: object } = {}) {
    this._debug && logger.log('making request', url);
    if (!this._oauthToken || !this._tokenExpiresAt || (Date.now() > this._tokenExpiresAt.getTime())) {
      await this.getToken();
      await sleep(200); // if the request is made too quickly the API will reject it with 500
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Bearer ${this._oauthToken}`,
      ...overwriteHeaders,
    };
    // separated for easy testing
    let response;
    if (method === 'GET') {
      response = await axios.get(url, { headers, ...rest });
    } else {
      response = await axios.post(url, postData, { headers, ...rest });
    }

    const { data } = response;
    this._debug && logger.log('request response', data);
    return data as T;
  }

  /**
   * Gets the auth token from BMW API
   */
  async getToken() {
    this._debug && logger.log('getting token');
    const { username, password } = this._config;
    const postData = querystring.stringify({
      grant_type: 'password',
      scope: 'authenticate_user vehicle_data remote_services',
      username,
      password,
    });

    const headers = {
      Authorization: 'Basic ZDc2NmI1MzctYTY1NC00Y2JkLWEzZGMtMGNhNTY3MmQ3ZjhkOjE1ZjY5N2Y2LWE1ZDUtNGNhZC05OWQ5LTNhMTViYzdmMzk3Mw==',
      Credentials: 'nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ',
    };
    this._debug && logger.log('token data', { postData, headers });
    const { data } = await axios.post(this._urls.getAuthURL(), postData, { headers });

    this._debug && logger.log('token response', { data });
    const { access_token, expires_in, refresh_token } = data;

    this._oauthToken = access_token;
    this._refreshToken = refresh_token;
    this._tokenExpiresAt = new Date(Date.now() + expires_in * 1000);
  }

  /**
   * Gets your currently stored vehicles or fetches them from the BMW's API
   *
   * @example
   * const vehicles = await API.getVehicles();
   */
  async getVehicles(): Promise<Vehicle[]> {
    const { vehicles = [] } = await this.requestWithAuth(this._urls.getVehiclesURL());
    return vehicles.map(vehicle => new Vehicle(vehicle));
  }


  /**
   * Gets the status of the vehicle
   */
  async getVehicleStatus(vehicle: Vehicle | string): Promise<VehicleStatus> {
    const vin = Vehicle.isVehicle(vehicle) ? vehicle.get('vin') : vehicle;
    const { vehicleStatus } = await this.requestWithAuth(this._urls.getVehicleStatusURL(vin));
    return new VehicleStatus(vehicleStatus);
  }

  /**
   * Gets the vehicle's photo
   */
  async getVehicleImage(vehicle: Vehicle | string, view: VehicleView = VehicleView.FrontSide, width = 400, height = 400) {
    const vin = Vehicle.isVehicle(vehicle) ? vehicle.get('vin') : vehicle;
    const binaryImage = await this.requestWithAuth<string>(
      this._urls.getVehicleImage(vin, width, height, view),
      { headers: { Accept: 'image/png' }, responseType: 'arraybuffer' },
    );

    console.log(binaryImage);
    return `data:image/png;base64,${Buffer.from(binaryImage, 'binary').toString('base64')}`;
  }
}

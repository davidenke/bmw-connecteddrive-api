import { VehicleData } from '../types';

export class Vehicle {

  static isVehicle(vehicle: any): vehicle is Vehicle {
    return 'vin' in vehicle;
  }

  constructor(private readonly _data: VehicleData) {}

  get<T extends keyof VehicleData>(key: T): VehicleData[T] {
    return this._data[key];
  }

  /**
   * Returns the vehicle's name as a combination of year, brand, bodytype and model
   * Ex. 2017 BMW F30 320d
   *
   * @readonly
   * @returns {String}
   * @memberof Vehicle
   */
  get name(): string {
    const { bodytype, brand, model, yearOfConstruction } = this._data;
    return `${yearOfConstruction} ${brand} ${bodytype} ${model}`;
  }
}

export default Vehicle;

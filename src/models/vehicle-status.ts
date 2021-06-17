import { ConditionBasedServicingData, VehicleStatusResponse } from '../types';

export class VehicleStatus {
  private readonly _cbsData?: ConditionBasedServicingData;

  get digitalChargingServiceActivation() {
    return this._data.DCS_CCH_Activation;
  }

  get digitalChargingServiceOngoing() {
    return this._data.DCS_CCH_Ongoing;
  }

  get conditionBasedServicingData(): ConditionBasedServicingData | undefined {
    return this._cbsData;
  }

  get internalClock(): Date | undefined {
    if (this._data.internalDataTimeUTC) {
      return new Date(this._data.internalDataTimeUTC);
    }
    return undefined;
  }

  get remainingRangeTotal(): number {
    return this._data.remainingRangeFuel + this._data.remainingRangeElectric;
  }

  get remainingRangeTotalMls(): number {
    return this._data.remainingRangeFuelMls + this._data.remainingRangeElectricMls;
  }

  get updateTime(): Date | undefined {
    if (this._data.updateTime) {
      return new Date(this._data.updateTime);
    }
    return undefined;
  }

  get cached(): boolean {
    return false;
  }

  constructor(private readonly _data: VehicleStatusResponse) {
    if (_data.cbsData) {
      this._cbsData = {
        description: _data.cbsData.cbsDescription,
        remainingMileage: _data.cbsData.cbsRemainingMileage,
        state: _data.cbsData.cbsState,
        type: _data.cbsData.cbsType,
      };

      if (_data.cbsData.cbsDueDate) {
        // YYYY-MM to date
        const parts = _data.cbsData.cbsDueDate.split('-').map(part => parseInt(part)) as [number, number];
        this._cbsData.dueDate = new Date(...parts);
      }
    }
  }

  get<T extends keyof VehicleStatusResponse>(key: T): VehicleStatusResponse[T] {
    return this._data[key];
  }
}

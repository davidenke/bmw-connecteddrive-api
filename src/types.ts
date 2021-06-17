export enum VehicleView {
  FrontSide = 'FRONTSIDE',
  Front = 'FRONT',
  RearSide = 'REARSIDE',
  Rear = 'REAR',
  Side = 'SIDE',
  Dashboard = 'DASHBOARD',
  DriverDoor = 'DRIVERDOOR',
  RearBirdsEye = 'REARBIRDSEYE',
}

export enum Region {
  China = 'cn',
  Europe = 'eu',
  UnitedStates = 'us'
}

export type ConditionBasedServicingData = {
  description: string;
  dueDate?: Date;
  remainingMileage: number;
  state: unknown;
  type: unknown;
}

export type VehicleData = {
  bodytype: string;
  brand: string;
  model: string;
  vin: string;
  yearOfConstruction: number;
};

export type VehicleStatusResponse = {
  DCS_CCH_Activation: boolean;
  DCS_CCH_Ongoing: boolean;

  cbsData?: {
    cbsDescription: string;
    cbsDueDate?: string;
    cbsRemainingMileage: number;
    cbsState: unknown;
    cbsType: unknown;
  };

  chargingConnectionType: boolean;
  chargingLevelHv: boolean;
  chargingStatus: boolean;
  checkControlMessages: boolean;
  connectionStatus: boolean;
  doorDriverFront: boolean;
  doorDriverRear: boolean;
  doorLockState: boolean;
  doorPassengerFront: boolean;
  doorPassengerRear: boolean;
  hood: boolean;
  // TODO: verify those date formats
  internalDataTimeUTC: string | number;
  updateTime: string | number;

  lastChargingEndReason: boolean;
  lastChargingEndResult: boolean;
  maxRangeElectric: boolean;
  maxRangeElectricMls: boolean;
  mileage: boolean;
  parkingLight: boolean;
  position: boolean;
  positionLight: boolean;
  rearWindow: boolean;
  remainingFuel: number;
  remainingRangeElectric: number;
  remainingRangeElectricMls: number;
  remainingRangeFuel: number;
  remainingRangeFuelMls: number;
  singleImmediateCharging: boolean;
  trunk: boolean;
  updateReason: boolean;
  vehicleCountry: string;
  vin: string;
  windowDriverFront: boolean;
  windowDriverRear: boolean;
  windowPassengerFront: boolean;
  windowPassengerRear: boolean;
}

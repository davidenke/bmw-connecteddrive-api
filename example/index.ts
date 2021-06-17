import { inspect } from 'util';
import { API } from '../src';
import { Region } from '../src/types';

const example = async () => {
  try {
    const api = new API({
      region: Region.Europe,
      username: 'david@enke.dev',
      password: '********',
    }, false);

    const currentVehicles = await api.getVehicles();
    console.log(inspect(currentVehicles, false, null, true));
  } catch (error) {
    console.error(error);
  }
};

example();

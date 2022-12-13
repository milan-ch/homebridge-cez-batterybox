import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { CEZBatteryBoxPlatform } from '../platform';

import { v4 as uuid } from 'uuid';
import { OIGPowerConnectAPI } from '../api/OIGPowerConnect';

export class OIGPowerBattery {
  private service: Service;
  private oigPowerConnectAPI: OIGPowerConnectAPI;

  constructor(
    private readonly platform: CEZBatteryBoxPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    this.oigPowerConnectAPI = new OIGPowerConnectAPI(
      this.platform.config.username,
      this.platform.config.password,
      this.platform.config.devId,
    );

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'OIG Power')
      .setCharacteristic(this.platform.Characteristic.Model, 'BatteryBox')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, uuid());

    this.service = this.accessory.getService(this.platform.Service.Battery) ||
      this.accessory.addService(this.platform.Service.Battery);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);

    this.service.getCharacteristic(this.platform.Characteristic.BatteryLevel)
      .onGet(this.getBatteryLevel.bind(this));
  }

  async getBatteryLevel() {
    this.platform.log.debug(`TEST JSON: ${await this.oigPowerConnectAPI.getBatteryLevel()}`);

    return 98;
  }
}
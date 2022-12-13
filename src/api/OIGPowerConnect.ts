import fetch, { Response } from 'node-fetch';
import { URLSearchParams } from 'url';

export class OIGPowerConnectAPI {

  private uris = {
    login: 'https://www.oigpower.cz/inc/php/scripts/Login.php',
    ping: 'https://www.oigpower.cz/cez/json.php',
    control: '',
  };

  private email!: string;
  private password!: string;
  private devId!: string;

  constructor(
    email: string,
    password: string,
    devId: string,
  ) {
    this.email = email;
    this.password = password;
    this.devId = devId;
  }

  // the main function to make a request to Salus
  private async makeRequest(url: 'ping'|'control', data: object) {
    try {
      // get the cookie to set for all the following requests.
      const cookieRequest = await fetch(this.uris.login);
      const cookie = `${cookieRequest.headers.get('set-cookie')?.split(';')[0] as string}`;

      // log in the account
      await fetch(this.uris.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie,
        },
        body: new URLSearchParams({
          'email': this.email,
          'password': this.password,
        }),
      });

      // get the token
      // const tokenRegex = /name="token" type="hidden" value="(.*)" \/>/;
      // const tokenRequest = await fetch(this.uris.devices, {
      //   headers: {
      //     cookie,
      //   },
      // });
      // const tokenRequestBody = await tokenRequest.text();
      // const tokenMatch = tokenRequestBody.match(tokenRegex);

      // if (!tokenMatch) {
      //   throw new TypeError('Something went wrong when trying to get a device token');
      // }
      // const [, token] = tokenMatch;

      // make the final request
      let finalRequest!: Response;
      switch(url) {
        case 'ping': {
          finalRequest = await fetch(this.uris.ping, {
            headers: {
              cookie,
            },
          });
          break;
        }
        case 'control': {
          // finalRequest = await fetch(`${this.uris.control}`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          //     cookie,
          //   },
          //   body: new URLSearchParams({
          //     token: token as string,
          //     ...data,
          //   }),
          // });
          // break;
        }
      }

      return await finalRequest.json();

    } catch (err) {
      return null;
    }
  }

  async pingServer() {
    return await this.makeRequest('ping', {});
    // return await this.makeRequest('ping', {}) as {
    //   CEZBBoxBatteryLevel: string;
    // CH1currentSetPoint: string;
    // CH1autoOff: '1'|'0';
    // CH1heatOnOffStatus: '0'|'1';
  }

  async getBatteryLevel() {
    try {
      return await this.pingServer();
    } catch(err) {
      return null;
    }
  }

}
export class Version {
  version = '';

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const versionJson = require('./version.json');

    this.version = versionJson.version;
  }
}

/**
 * @flow
 */

type StandaloneContextDataType = 'user' | 'service';
type StandaloneContextBuildConfiguration = 'Debug' | 'Release';
type StandaloneContextAndroidBuildConfiguration = {
  keystore: string,
  keystorePassword: string,
  keyAlias: string,
  keyPassword: string,
  outputFile: ?string,
};

/**
 *  A user context is used when we are configuring a standalone app locally on a user's machine,
 *  such as during `exp detach`.
 */
type StandaloneContextDataUser = {
  projectPath: string,
  exp: any,
};

/**
 *  A service context is used when we are generating a standalone app remotely on an Expo
 *  service machine, such as during `exp build`.
 */
type StandaloneContextDataService = {
  expoSourcePath: string,
  archivePath: ?string,
  manifest: ?any,
  privateConfig: ?any,
};

class StandaloneContext {
  type: StandaloneContextDataType;
  data: StandaloneContextDataUser | StandaloneContextDataService;
  config: ?any; // same as underlying app.json or manifest
  published: {
    url: ?string,
    releaseChannel: string,
  };
  build: {
    configuration: StandaloneContextBuildConfiguration,
    android: ?StandaloneContextAndroidBuildConfiguration,
  };

  static createUserContext = (
    projectPath: string,
    exp: any,
    publishedUrl: ?string
  ): StandaloneContext => {
    let context = new StandaloneContext();
    context.type = 'user';
    context.data = {
      projectPath,
      exp,
    };
    context.config = exp;
    context.published = {
      url: publishedUrl,
      releaseChannel: 'default',
    };
    // we never expect user contexts to be pre-built right now
    context.build = {
      configuration: 'Debug',
      android: null,
    };
    return context;
  };

  static createServiceContext = (
    expoSourcePath: string,
    archivePath: ?string,
    manifest: ?any,
    privateConfig: ?any,
    buildConfiguration: StandaloneContextBuildConfiguration,
    publishedUrl: ?string,
    releaseChannel: ?string,
    androidBuildConfiguration: ?StandaloneContextAndroidBuildConfiguration
  ): StandaloneContext => {
    let context = new StandaloneContext();
    context.type = 'service';
    context.data = {
      expoSourcePath,
      archivePath,
      manifest,
      privateConfig,
    };
    context.config = manifest;
    context.build = {
      configuration: buildConfiguration,
      android: androidBuildConfiguration,
    };
    context.published = {
      url: publishedUrl,
      releaseChannel: releaseChannel ? releaseChannel : 'default',
    };
    return context;
  };

  /**
   *  On iOS we begin configuring standalone apps before we have any information about the
   *  project's manifest.
   */
  isAnonymous = () => {
    return this.type === 'service' && !this.config;
  };
}

export default StandaloneContext;

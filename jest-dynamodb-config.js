module.exports = async () => {
  const serverless = new (require('serverless'))();

  await serverless.init();
  const service = await serverless.variables.populateService();

  const extractTableResources = (r) =>
    Object.keys(r)
      .map((name) => r[name])
      .filter((r) => r.Type === 'AWS::DynamoDB::Table')
      .map((r) => r.Properties);

  const tables = [];
  if (Array.isArray(service.resources)) {
    service.resources.map((r) => {
      tables.push(...extractTableResources(r.Resources));
    });
  } else {
    tables.push(...extractTableResources(service.resources.Resources));
  }

  return {
    tables,
    port: 8001,
    options: ['-sharedDb', '-inMemory'],
    installerConfig: {
      installPath: '.dynamodb',
    },
  };
};

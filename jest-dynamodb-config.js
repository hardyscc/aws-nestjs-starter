module.exports = async () => {
  const serverless = new (require('serverless'))();

  await serverless.init();
  const service = await serverless.variables.populateService();
  const resources = service.resources[0].Resources;

  const tables = Object.keys(resources)
    .map((name) => resources[name])
    .filter((r) => r.Type === 'AWS::DynamoDB::Table')
    .map((r) => r.Properties);

  return {
    tables,
    port: 8000,
    installerConfig: {
      installPath: '.dynamodb',
    },
  };
};

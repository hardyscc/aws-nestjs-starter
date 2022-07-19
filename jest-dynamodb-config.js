const { execSync } = require('child_process');

module.exports = () => {
  const service = JSON.parse(
    execSync('npx sls print --format json', { encoding: 'utf-8' }),
  );

  const tables = Object.values(service.resources.Resources)
    .filter((resource) => resource.Type === 'AWS::DynamoDB::Table')
    .map((resource) => resource.Properties);

  return {
    tables,
    port: 8001,
    options: ['-sharedDb', '-inMemory'],
    installerConfig: {
      installPath: '.dynamodb',
    },
  };
};

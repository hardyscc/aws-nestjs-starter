import { pascalCase } from 'change-case';
import * as dynamoose from 'dynamoose';
import { Schema } from 'dynamoose/dist/Schema';
import { TableOptionsOptional } from 'dynamoose/dist/Table';
import * as fs from 'fs';
import * as glob from 'glob-promise';
import * as yaml from 'js-yaml';
import * as path from 'path';

const args = process.argv.slice(2);
const matchPattern = args[1];
const outputFile = args[2];

const deletionPolicy = 'Delete';
const globalOptions: TableOptionsOptional = {
  throughput: 'ON_DEMAND',
  prefix: '${self:service}-${self:provider.stage}-',
  suffix: '-table',
};

async function main() {
  if (!matchPattern || !outputFile) {
    console.log('missing required arguments.');
    return;
  }

  const slsResources: { Resources: Record<string, any> } = { Resources: {} };

  // find all the files that match the given pattern
  const files = await glob.promise(matchPattern);
  await Promise.all(
    files.map(async (file) => {
      console.log('detected:', file);

      // use the filename without extention as tablename
      const fileNameExt = file.split(/[\\\/]/).pop()!;
      const fileName = fileNameExt.split('.').shift()!;
      const tableName = pascalCase(fileName);

      // dynamic import the typescript file
      const exports = await import(`.${path.sep}${file}`);
      // get the first export
      const schema = Object.values(exports).shift() as Schema;

      // make sure it is a Schema class
      if (schema.constructor.name === 'Schema') {
        const model = dynamoose.model(fileName, schema, globalOptions);
        // append to the resources object
        slsResources.Resources[`${tableName}Table`] = {
          Type: 'AWS::DynamoDB::Table',
          DeletionPolicy: deletionPolicy,
          Properties: await model.table().create({ return: 'request' }),
        };
      }
    }),
  );

  // convert from js object to yaml
  const yamlReources = yaml.dump(slsResources);
  const outputPath = outputFile.split(/[\\\/]/);
  // create the missing folders if necessary
  if (outputPath.length > 1) {
    await fs.promises.mkdir(
      outputPath.slice(0, outputPath.length - 1).join(path.sep),
      { recursive: true },
    );
  }
  // write to output file
  await fs.promises.writeFile(outputFile, yamlReources);
  console.log(`Serverless resources file generated at ${outputFile}`);
  process.exit(0);
}

main();

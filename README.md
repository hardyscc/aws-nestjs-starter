# Serverless, AWS, NestJS, GraphQL and DynamoDB starter.

## Description

A starter project that makes creating a deployable AWS Serverless project extremely easy.

## Technologies

- [AWS Lambda](https://aws.amazon.com/lambda)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb)
- [Serverless](https://serverless.com/framework/docs/providers/aws/)
- [NestJS](https://docs.nestjs.com/)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [NestJS Dynamoose](https://github.com/hardyscc/nestjs-dynamoose)

## Usage

```bash
git clone https://github.com/hardyscc/aws-nestjs-starter.git <Your_Project_Name>
cd <Your_Project_Name>

yarn install
```

Find and replace `aws-nestjs-starter` to your project name under `package.json`, `serverless.yml` and `.env` files.

## Setup AWS Credentials

1. [Sign up for an AWS account](https://serverless.com/framework/docs/providers/aws/guide/credentials#sign-up-for-an-aws-account)

2. Login to your AWS account and go to the **Identity & Access Management (IAM)** page.

3. Click on **Users** and then **Add user**. Enter a name in the first field to remind you this User is related to the Serverless Framework, like `serverless-admin`. Enable **Programmatic access** by clicking the checkbox. Click **Next** to go through to the Permissions page. Click on **Attach existing policies directly**. Search for and select **AdministratorAccess** then click **Next: Review**. Check to make sure everything looks good and click **Create user**.

4. View and copy the **API Key & Secret** to a temporary place. You'll need it in the next step.

## Setup Workstation

Install Serverless CLI

```sh
npm install -g serverless
```

Install AWS CLI

- Windows: `choco install awscli`
- MacOS: `brew install awscli`

Config AWS CLI

```sh
aws configure
```

Input:

```sh
AWS Access Key ID [****************TKYQ]:
AWS Secret Access Key [****************yNO2]:
Default region name [None]:
Default output format [None]:
```

> Please enter your **AWS Access Key ID** and **AWS Secret Access Key**

## Deployment

```bash
# deploy to AWS
$ sls deploy
```

## Local Offline Development

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## GraphQL Endpoint Test

- local: http://localhost:3000/graphql
- AWS: https://<your_aws_deployment_id>.execute-api.us-east-1.amazonaws.com/dev/graphql

```graphql
mutation {
  createNotification(
    input: { targetId: "device1", userId: "user1", content: "Hello World" }
  ) {
    id
  }
}
```

```graphql
query {
  notification(userId: "user1") {
    id
    targetId
    userId
    content
    createAt
  }
}
```

```graphql
query {
  notificationByTarget(targetId: "device1") {
    id
    targetId
    userId
    content
    createAt
  }
}
```

## Stay in touch

- Author - [Hardys](hardyscc@gmail.com)
- Twitter - [@hardyscchk](https://twitter.com/hardyscchk)

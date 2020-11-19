import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { CognitoIdentity } from 'aws-sdk';
import {
  cfnCustomResource,
  CustomResourceHandlerSet,
} from 'cfn-custom-resource-helper';
import retryx from 'retryx';

export const handler: CloudFormationCustomResourceHandler = async (
  event,
  context,
): Promise<any> => {
  console.log(event.ResourceProperties);
  const {
    IdentityPoolId,
    IdentityProviderName,
  }: Record<string, string> = event.ResourceProperties;

  const RoleMapping: CognitoIdentity.RoleMapping =
    event.ResourceProperties.RoleMapping;

  const cognitoIdentity = new CognitoIdentity();

  const identityPoolRoles = await retryx(() =>
    cognitoIdentity.getIdentityPoolRoles({ IdentityPoolId }).promise(),
  );

  console.log('after getIdentityPoolRoles');

  const params = {
    ...identityPoolRoles,
  } as CognitoIdentity.SetIdentityPoolRolesInput;

  const upsert = async () => {
    try {
      if (!params.RoleMappings) {
        params.RoleMappings = {};
      }

      params.RoleMappings[IdentityProviderName] = RoleMapping;
      await retryx(() =>
        cognitoIdentity.setIdentityPoolRoles(params).promise(),
      );

      console.log('after setIdentityPoolRoles');
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const handlers: CustomResourceHandlerSet = {
    async onCreate() {
      await upsert();

      return { id: IdentityProviderName };
    },

    async onUpdate(updateEvent: any) {
      await upsert();

      return { id: updateEvent.PhysicalResourceId };
    },

    async onDelete(deleteEvent: any) {
      if (params.RoleMappings) {
        delete params.RoleMappings[IdentityProviderName];
      }

      await retryx(() =>
        cognitoIdentity.setIdentityPoolRoles(params).promise(),
      );

      return { id: deleteEvent.PhysicalResourceId };
    },
  };

  return await cfnCustomResource(event, context, handlers);
};

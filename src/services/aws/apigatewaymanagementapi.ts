import {
  ApiGatewayManagementApiClient,
  DeleteConnectionCommand,
  DeleteConnectionCommandOutput,
  PostToConnectionCommand,
  PostToConnectionCommandOutput,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { contentResponse, LogLevel, WebSocketResponseEventDTO } from '@juki-team/commons';
import { log } from '../../helpers';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, WITHOUT_AWS_KEYS } from './config';

const domainName = 'im7lou2on3.execute-api.us-east-1.amazonaws.com';
const stage = 'v1';
const endpoint = `wss://${domainName}/${stage}`;
export const awsAGWS = new ApiGatewayManagementApiClient({
  endpoint,
  region: AWS_REGION,
  credentials: WITHOUT_AWS_KEYS
    ? undefined
    : { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
});

export function agws() {
  return {
    PostToConnectionWebSocketResponseEvent: async ({ message, event, connectionId }: {
      message: string,
      event: WebSocketResponseEventDTO,
      connectionId: string,
    }): Promise<PostToConnectionCommandOutput> => {
      const requestParams = {
        ConnectionId: connectionId,
        Data: JSON.stringify(contentResponse(message, event)),
      };
      log(LogLevel.INFO)(`sending web socket, message: "${message}"`);
      log(LogLevel.DEBUG)(`sending web socket, message: "${message}", requestParams: "${JSON.stringify(requestParams)}", endpoint: "${endpoint}"`);
      const command = new PostToConnectionCommand(requestParams);
      const response = await awsAGWS.send(command);
      log(LogLevel.INFO)(`sent web socket, message: "${message}"`);
      log(LogLevel.DEBUG)(`sent web socket, message: "${message}", requestParams: "${JSON.stringify(requestParams)}", endpoint: "${endpoint}", response: "${JSON.stringify(response)}"`);
      return response;
    },
    deleteConnection: async ({ connectionId }: { connectionId: string }): Promise<DeleteConnectionCommandOutput> => {
      const command = new DeleteConnectionCommand({ ConnectionId: connectionId });
      log(LogLevel.INFO)(`deleting web socket, connectionId: "${connectionId}"`);
      const response = await awsAGWS.send(command);
      log(LogLevel.INFO)(`deleted web socket, connectionId: "${connectionId}"`);
      log(LogLevel.DEBUG)(`deleted web socket, connectionId: "${connectionId}", response: "${JSON.stringify(response)}"`);
      return response;
    },
  };
}

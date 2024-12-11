import {
  ApiGatewayManagementApiClient,
  DeleteConnectionCommand,
  DeleteConnectionCommandOutput,
  PostToConnectionCommand,
  PostToConnectionCommandInput,
  PostToConnectionCommandOutput,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { contentResponse, LogLevel, WebSocketResponseEventDTO } from '@juki-team/commons';
import { log } from '../../helpers';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, WITHOUT_AWS_KEYS } from './config';

export function wsApi(endpoint: string) {
  
  const awsAGMA = new ApiGatewayManagementApiClient({
    endpoint,
    region: AWS_REGION,
    credentials: WITHOUT_AWS_KEYS
      ? undefined
      : { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
  });
  
  return {
    PostToConnectionWebSocketResponseEvent: async ({ message, event, connectionId }: {
      message: string,
      event: WebSocketResponseEventDTO,
      connectionId: string,
    }): Promise<PostToConnectionCommandOutput> => {
      const requestParams: PostToConnectionCommandInput = {
        ConnectionId: connectionId,
        Data: JSON.stringify(contentResponse(message, event)),
      };
      log(LogLevel.INFO)(`sending web socket, message: "${message}"`);
      log(LogLevel.DEBUG)(`sending web socket, message: "${message}", requestParams: "${JSON.stringify(requestParams)}"`);
      const command = new PostToConnectionCommand(requestParams);
      const response = await awsAGMA.send(command);
      log(LogLevel.INFO)(`sent web socket, message: "${message}"`);
      log(LogLevel.DEBUG)(`sent web socket, message: "${message}", requestParams: "${JSON.stringify(requestParams)}", response: "${JSON.stringify(response)}"`);
      return response;
    },
    deleteConnection: async ({ connectionId }: { connectionId: string }): Promise<DeleteConnectionCommandOutput> => {
      const command = new DeleteConnectionCommand({ ConnectionId: connectionId });
      log(LogLevel.INFO)(`deleting web socket, connectionId: "${connectionId}"`);
      const response = await awsAGMA.send(command);
      log(LogLevel.INFO)(`deleted web socket, connectionId: "${connectionId}"`);
      log(LogLevel.DEBUG)(`deleted web socket, connectionId: "${connectionId}", response: "${JSON.stringify(response)}"`);
      return response;
    },
  };
}

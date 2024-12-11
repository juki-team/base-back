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
    postToConnectionWebSocketResponseEvent: async ({ message, event, connectionId }: {
      message: string,
      event: WebSocketResponseEventDTO,
      connectionId: string,
    }): Promise<
      { success: true, output: PostToConnectionCommandOutput, error: null }
      | { success: false, output: null, error: any }
    > => {
      const requestParams: PostToConnectionCommandInput = {
        ConnectionId: connectionId,
        Data: JSON.stringify(contentResponse(message, event)),
      };
      log(LogLevel.INFO)(`sending web socket, message: "${message}", endpoint: "${endpoint}"`);
      log(LogLevel.DEBUG)(`sending web socket, message: "${message}", endpoint: "${endpoint}", requestParams: "${JSON.stringify(requestParams)}"`);
      
      try {
        const command = new PostToConnectionCommand(requestParams);
        const output = await awsAGMA.send(command);
        log(LogLevel.INFO)(`sent web socket, message: "${message}", endpoint: "${endpoint}"`);
        log(LogLevel.DEBUG)(`sent web socket, message: "${message}", endpoint: "${endpoint}", requestParams: "${JSON.stringify(requestParams)}", response: "${JSON.stringify(output)}"`);
        return { success: true, output, error: null };
      } catch (error: any) {
        if (error?.name === 'GoneException') {
          log(LogLevel.ERROR)(`sent error web socket, message: "${message}", endpoint: "${endpoint}", connectionId: "${connectionId}": GoneException, is no longer active`);
          return { success: false, output: null, error };
        } else {
          console.error('Unexpected error:', error);
        }
        log(LogLevel.ERROR)(`sent error web socket, message: "${message}", endpoint: "${endpoint}", connectionId: "${connectionId}":  Unexpected error`, error);
        return { success: false, output: null, error };
      }
    },
    deleteConnection: async ({ connectionId }: { connectionId: string }): Promise<DeleteConnectionCommandOutput> => {
      const command = new DeleteConnectionCommand({ ConnectionId: connectionId });
      log(LogLevel.INFO)(`deleting web socket, connectionId: "${connectionId}", endpoint: "${endpoint}"`);
      const response = await awsAGMA.send(command);
      log(LogLevel.INFO)(`deleted web socket, connectionId: "${connectionId}", endpoint: "${endpoint}"`);
      log(LogLevel.DEBUG)(`deleted web socket, connectionId: "${connectionId}", endpoint: "${endpoint}", response: "${JSON.stringify(response)}"`);
      return response;
    },
  };
}

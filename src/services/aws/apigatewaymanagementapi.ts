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
import { jkLogTelegramBot } from '../telegram';
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
      log(LogLevel.DEBUG)(`sending web socket, message: "${message}", endpoint: "${endpoint}"`);
      log(LogLevel.TRACE)(`sending web socket, message: "${message}", endpoint: "${endpoint}", requestParams: "${JSON.stringify(requestParams)}"`);
      
      try {
        const command = new PostToConnectionCommand(requestParams);
        const output = await awsAGMA.send(command);
        log(LogLevel.DEBUG)(`sent web socket, message: "${message}", endpoint: "${endpoint}"`);
        log(LogLevel.TRACE)(`sent web socket, message: "${message}", endpoint: "${endpoint}", requestParams: "${JSON.stringify(requestParams)}", response: "${JSON.stringify(output)}"`);
        return { success: true, output, error: null };
      } catch (error: any) {
        if (error?.name === 'GoneException') {
          log(LogLevel.WARN)(`GoneException error sending web socket message, connection is no longer active, message: "${message}", endpoint: "${endpoint}", connectionId: "${connectionId}", requestParams: "${JSON.stringify(requestParams)}"`);
          return { success: false, output: null, error };
        }
        log(LogLevel.ERROR)(`Unexpected error sending web socket message, message: "${message}", endpoint: "${endpoint}", connectionId: "${connectionId}", requestParams: "${JSON.stringify(requestParams)}"`, error);
        void jkLogTelegramBot.sendErrorMessage('Unexpected error sending web socket message', {
          error,
          endpoint,
          requestParams,
        });
        return { success: false, output: null, error };
      }
    },
    deleteConnection: async ({ connectionId }: { connectionId: string }): Promise<
      { success: true, output: DeleteConnectionCommandOutput, error: null }
      | { success: false, output: null, error: any }
    > => {
      try {
        const command = new DeleteConnectionCommand({ ConnectionId: connectionId });
        log(LogLevel.DEBUG)(`deleting web socket, connectionId: "${connectionId}", endpoint: "${endpoint}"`);
        const output = await awsAGMA.send(command);
        log(LogLevel.DEBUG)(`deleted web socket, connectionId: "${connectionId}", endpoint: "${endpoint}"`);
        log(LogLevel.TRACE)(`deleted web socket, connectionId: "${connectionId}", endpoint: "${endpoint}", response: "${JSON.stringify(output)}"`);
        return { success: true, output, error: null };
      } catch (error: any) {
        if (error?.name === 'GoneException') {
          log(LogLevel.WARN)(`GoneException error deleting web socket connection, connection is no longer active, endpoint: "${endpoint}", connectionId: "${connectionId}"`);
          return { success: false, output: null, error };
        }
        log(LogLevel.ERROR)(`Unexpected error deleting web socket connection, endpoint: "${endpoint}", connectionId: "${connectionId}"`, error);
        void jkLogTelegramBot.sendErrorMessage('Unexpected error deleting web socket connection', {
          error,
          endpoint,
          connectionId,
        });
        return { success: false, output: null, error };
      }
    },
  };
}

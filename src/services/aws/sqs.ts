import { AWS } from './config';

export const awsSqs = new AWS.SQS({ apiVersion: '2012-11-05' });

export const sqsQueue = (queueUrl: string) => ({
  deleteMessage: async ({ receiveMessageResult }: { receiveMessageResult: AWS.SQS.Types.ReceiveMessageResult }) => {
    return await awsSqs.deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: receiveMessageResult?.Messages?.[0].ReceiptHandle || '',
    }).promise();
  },
  receiveMessage: async (props?: { visibilityTimeout: number, waitTimeSeconds: number }) => {
    const { visibilityTimeout = 900, waitTimeSeconds = 20 } = props || {};
    const params: AWS.SQS.Types.ReceiveMessageRequest = {
      QueueUrl: queueUrl,
      AttributeNames: [
        'SentTimestamp',
      ],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: [
        'All',
      ],
      VisibilityTimeout: visibilityTimeout, // Should be between 0 seconds and 12 hours.
      WaitTimeSeconds: waitTimeSeconds, // Should be between 0 and 20 seconds.
    };
    return await awsSqs.receiveMessage(params).promise();
  },
  sendMessage: async ({
    messageBody,
    messageDeduplicationId,
    messageGroupId,
  }: { messageBody: string, messageDeduplicationId: string, messageGroupId: string }) => {
    return await awsSqs.sendMessage({
      // Remove DelaySeconds parameter and value for FIFO queues
      // DelaySeconds: 10,
      MessageAttributes: {
        'Type': {
          DataType: 'String',
          StringValue: 'Exec command',
        },
      },
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      MessageDeduplicationId: messageDeduplicationId,
      MessageGroupId: messageGroupId,
    }).promise();
  },
  changeMessageVisibility: async ({
    receiveMessageResult,
    visibilityTimeout,
  }: { receiveMessageResult: AWS.SQS.Types.ReceiveMessageResult, visibilityTimeout: number }) => (
    await awsSqs.changeMessageVisibility({
      QueueUrl: queueUrl,
      ReceiptHandle: receiveMessageResult?.Messages?.[0].ReceiptHandle || '',
      VisibilityTimeout: visibilityTimeout,
    })
  ),
  getQueueAttributes: async () => {
    return await awsSqs.getQueueAttributes({ QueueUrl: queueUrl, AttributeNames: ['All'] }).promise();
  },
});

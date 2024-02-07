import { SHARED_TASK_STATUSES_FOLDER } from '../config';


export const getStoppingLockFilePath = (taskId: string) => SHARED_TASK_STATUSES_FOLDER
  + '/'
  + taskId
  + '.stopping.lock';

export const getStoppedLockFilePath = (taskId: string) => SHARED_TASK_STATUSES_FOLDER
  + '/'
  + taskId
  + '.stopped.lock';

export const getRunningLockFilePath = (taskId: string) => SHARED_TASK_STATUSES_FOLDER
  + '/'
  + taskId
  + '.running.lock';

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addDailySchedule POST /api/dailySchedule/add */
export async function addDailyScheduleUsingPost(
  body: API.DailySchedule,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/dailySchedule/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteDailySchedule POST /api/dailySchedule/delete */
export async function deleteDailyScheduleUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/dailySchedule/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** finishDailyScheduleById POST /api/dailySchedule/finish */
export async function finishDailyScheduleByIdUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.finishDailyScheduleByIdUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/dailySchedule/finish', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listDailySchedule GET /api/dailySchedule/list */
export async function listDailyScheduleUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListDailySchedule_>('/dailySchedule/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** queryHistoryDailySchedule POST /api/dailySchedule/queryHistory */
export async function queryHistoryDailyScheduleUsingPost(
  params: URLSearchParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseTaskHistory_>('/dailySchedule/queryHistory', {
    method: 'POST',
    data: params, // 使用 data 发送请求载荷
    ...(options || {}),
  });
}

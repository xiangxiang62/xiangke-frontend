// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addArticleComment POST /api/articleComment/add */
export async function addArticleCommentUsingPost(
  body: API.ArticleCommentAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseArticleComment_>('/articleComment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getArticleComments GET /api/articleComment/list */
export async function getArticleCommentsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleCommentsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListArticleCommentVO_>('/articleComment/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

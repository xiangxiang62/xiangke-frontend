// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addArticle POST /article/add */
export async function addArticleUsingPost(
  body: API.ArticleAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/article/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteArticle POST /article/delete */
export async function deleteArticleUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/article/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** editArticle POST /article/edit */
export async function editArticleUsingPost(
  body: API.ArticleEditRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/article/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getArticleVOById GET /article/get/vo */
export async function getArticleVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseArticleVO_>('/article/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listArticleByPage POST /article/list/page */
export async function listArticleByPageUsingPost(
  body: API.ArticleQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageArticle_>('/article/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listArticleVOByPage POST /article/list/page/vo */
export async function listArticleVoByPageUsingPost(
  body: API.ArticleQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageArticleVO_>('/article/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyArticleVOByPage POST /article/my/list/page/vo */
export async function listMyArticleVoByPageUsingPost(
  body: API.ArticleQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageArticleVO_>('/article/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateArticle POST /article/update */
export async function updateArticleUsingPost(
  body: API.ArticleUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/article/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

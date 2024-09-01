// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doArticleFavour POST /api/article_favour/ */
export async function doArticleFavourUsingPost(
  body: API.ArticleFavourAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/article_favour/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listFavourArticleByPage POST /api/article_favour/list/page */
export async function listFavourArticleByPageUsingPost(
  body: API.ArticleFavourQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageArticleVO_>('/api/article_favour/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyFavourArticleByPage POST /api/article_favour/my/list/page */
export async function listMyFavourArticleByPageUsingPost(
  body: API.ArticleQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageArticleVO_>('/article_favour/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

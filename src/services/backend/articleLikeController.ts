// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doThumb POST /api/article_like/ */
export async function doThumbUsingPost(
  body: API.ArticleLikeAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/article_like/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

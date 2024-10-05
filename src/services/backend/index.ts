// @ts-ignore
/* eslint-disable */
// API 更新时间：
// API 唯一标识：
import * as fileController from './fileController';
import * as postController from './postController';
import * as articleController from '../backend/articleController';
import * as postFavourController from './postFavourController';
import * as postThumbController from './postThumbController';
import * as userController from './userController';
import * as wxMpController from './wxMpController';
import * as articleLikeController from "@/services/backend/articleLikeController";
import * as articleCommentController from "@/services/backend/articleCommentController";
import * as dailyScheduleController from "@/services/backend/dailyScheduleController";
export default {
  userController,
  postThumbController,
  postFavourController,
  postController,
  articleController,
  fileController,
  articleLikeController,
  articleCommentController,
  dailyScheduleController,
  wxMpController,
};

declare namespace API {
  type Article = {
    authorId?: number;
    category?: string;
    concise?: string;
    content?: string;
    createdTime?: string;
    favourNum?: number;
    id?: number;
    isDeleted?: number;
    likeNum?: number;
    status?: Record<string, any>;
    tags?: string;
    title?: string;
    updatedTime?: string;
  };

  type ArticleAddRequest = {
    authorId?: number;
    category?: string;
    concise?: string;
    content?: string;
    tags?: string;
    title?: string;
  };

  type ArticleComment = {
    articleId?: number;
    authorId?: number;
    content?: string;
    createdTime?: string;
    id?: number;
    isDeleted?: number;
    parentCommentId?: number;
  };

  type ArticleCommentAddRequest = {
    articleId?: number;
    authorId?: number;
    content?: string;
    createdTime?: string;
    isDeleted?: number;
    parentCommentId?: number;
  };

  type ArticleCommentVO = {
    articleId?: number;
    authorId?: number;
    childComments?: ArticleCommentVO[];
    content?: string;
    createdTime?: string;
    id?: number;
    parentCommentId?: number;
    rootComment?: boolean;
    userVO?: UserVO;
  };

  type ArticleEditRequest = {
    category?: string;
    concise?: string;
    content?: string;
    id?: number;
    tags?: string;
    title?: string;
  };

  type ArticleFavourAddRequest = {
    id?: number;
  };

  type ArticleFavourQueryRequest = {
    articleQueryRequest?: ArticleQueryRequest;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type ArticleLikeAddRequest = {
    id?: number;
  };

  type ArticleQueryRequest = {
    authorId?: number;
    category?: string;
    concise?: string;
    content?: string;
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    status?: Record<string, any>;
    tags?: string;
    title?: string;
  };

  type ArticleUpdateRequest = {
    authorId?: number;
    category?: string;
    concise?: string;
    content?: string;
    id?: number;
    status?: Record<string, any>;
    tags?: string;
    title?: string;
  };

  type ArticleVO = {
    authorId?: number;
    category?: string;
    content?: string;
    createdTime?: string;
    favourNum?: number;
    id?: number;
    likeNum?: number;
    liked?: boolean;
    starred?: boolean;
    tags?: string;
    title?: string;
    user?: UserVO;
  };

  type BaseResponseArticleComment_ = {
    code?: number;
    data?: ArticleComment;
    message?: string;
  };

  type BaseResponseArticleVO_ = {
    code?: number;
    data?: ArticleVO;
    message?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListArticleCommentVO_ = {
    code?: number;
    data?: ArticleCommentVO[];
    message?: string;
  };

  type BaseResponseListDailySchedule_ = {
    code?: number;
    data?: DailySchedule[];
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageArticle_ = {
    code?: number;
    data?: PageArticle_;
    message?: string;
  };

  type BaseResponsePageArticleVO_ = {
    code?: number;
    data?: PageArticleVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseTaskHistory_ = {
    code?: number;
    data?: TaskHistory;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type DailySchedule = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    planName?: string;
    todayIsFinish?: number;
    updateTime?: string;
    userId?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type finishDailyScheduleByIdUsingPOSTParams = {
    /** dailyId */
    dailyId?: number;
  };

  type getArticleCommentsUsingGETParams = {
    /** articleId */
    articleId: number;
  };

  type getArticleVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: number;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageArticle_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Article[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageArticleVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ArticleVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type queryHistoryDailyScheduleUsingPOSTParams = {
    /** today */
    today: string;
  };

  type sendEmailUsingGETParams = {
    /** email */
    email: string;
    /** type */
    type: string;
  };

  type TaskHistory = {
    historyTaskInfo?: string;
    id?: number;
    taskTime?: string;
    userId?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userEmail?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    email?: string;
    emailCode?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}

import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
// @ts-ignore
  router.resources('analizeResult', '/analizeResult', controller.common); // 分析结果上传
};

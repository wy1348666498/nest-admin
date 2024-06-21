export type List2TreeOptions = {
  idKey?: string;
  pIdKey?: string;
};

/**
 * @description: 列表转树形结构
 * @param items
 * @param pid
 * @param options
 */
export function list2Tree(items: any[], pid: any, options?: List2TreeOptions) {
  const idKey = options?.idKey || 'id';
  const pIdKey = options?.pIdKey || 'pid';

  return items
    .filter((item) => item[pIdKey] === pid)
    .map((item) => {
      const children = list2Tree(items, item[idKey], options);
      return {
        ...item,
        children: children?.length ? children : null,
      };
    });
}

interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}
export const listToTree = <T = any>(
  list: any[],
  config: Partial<TreeHelperConfig> = {},
): T[] => {
  const nodeMap = new Map();
  const result: T[] = [];

  const id = config.id || 'id';
  const children = config.children || 'children';
  const pid = config.pid || 'pid';

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent.children : result).push(node);
  }
  return result;
};

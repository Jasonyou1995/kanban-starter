export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

export type BoardData = {
  columns: Column[];
  cards: Record<string, Card>;
};

export const initialData: BoardData = {
  columns: [
    { id: "col-backlog", title: "待办", cardIds: ["card-1", "card-2"] },
    { id: "col-discovery", title: "调研", cardIds: ["card-3"] },
    {
      id: "col-progress",
      title: "进行中",
      cardIds: ["card-4", "card-5"],
    },
    { id: "col-review", title: "评审", cardIds: ["card-6"] },
    { id: "col-done", title: "已完成", cardIds: ["card-7", "card-8"] },
  ],
  cards: {
    "card-1": {
      id: "card-1",
      title: "对齐路线图主题",
      details: "起草季度主题，附带影响力说明与度量指标。",
    },
    "card-2": {
      id: "card-2",
      title: "收集客户反馈信号",
      details: "梳理客服标签、销售记录与流失用户反馈。",
    },
    "card-3": {
      id: "card-3",
      title: "原型设计：数据分析视图",
      details: "绘制初步的仪表盘布局与关键下钻路径。",
    },
    "card-4": {
      id: "card-4",
      title: "打磨状态命名",
      details: "统一整个看板的列标签与措辞风格。",
    },
    "card-5": {
      id: "card-5",
      title: "设计卡片布局",
      details: "为密集列表的快速扫读增加层级与留白。",
    },
    "card-6": {
      id: "card-6",
      title: "微交互走查",
      details: "验证悬停、聚焦与加载状态。",
    },
    "card-7": {
      id: "card-7",
      title: "发布营销页面",
      details: "终稿文案已确认，素材包已交付。",
    },
    "card-8": {
      id: "card-8",
      title: "收尾 onboarding 冲刺",
      details: "撰写发布说明并在团队内部分享。",
    },
  },
};

const isColumnId = (columns: Column[], id: string) =>
  columns.some((column) => column.id === id);

const findColumnId = (columns: Column[], id: string) => {
  if (isColumnId(columns, id)) {
    return id;
  }
  return columns.find((column) => column.cardIds.includes(id))?.id;
};

export const moveCard = (
  columns: Column[],
  activeId: string,
  overId: string
): Column[] => {
  const activeColumnId = findColumnId(columns, activeId);
  const overColumnId = findColumnId(columns, overId);

  if (!activeColumnId || !overColumnId) {
    return columns;
  }

  const activeColumn = columns.find((column) => column.id === activeColumnId);
  const overColumn = columns.find((column) => column.id === overColumnId);

  if (!activeColumn || !overColumn) {
    return columns;
  }

  const isOverColumn = isColumnId(columns, overId);

  if (activeColumnId === overColumnId) {
    if (isOverColumn) {
      const nextCardIds = activeColumn.cardIds.filter(
        (cardId) => cardId !== activeId
      );
      nextCardIds.push(activeId);
      return columns.map((column) =>
        column.id === activeColumnId
          ? { ...column, cardIds: nextCardIds }
          : column
      );
    }

    const oldIndex = activeColumn.cardIds.indexOf(activeId);
    const newIndex = activeColumn.cardIds.indexOf(overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return columns;
    }

    const nextCardIds = [...activeColumn.cardIds];
    nextCardIds.splice(oldIndex, 1);
    nextCardIds.splice(newIndex, 0, activeId);

    return columns.map((column) =>
      column.id === activeColumnId
        ? { ...column, cardIds: nextCardIds }
        : column
    );
  }

  const activeIndex = activeColumn.cardIds.indexOf(activeId);
  if (activeIndex === -1) {
    return columns;
  }

  const nextActiveCardIds = [...activeColumn.cardIds];
  nextActiveCardIds.splice(activeIndex, 1);

  const nextOverCardIds = [...overColumn.cardIds];
  if (isOverColumn) {
    nextOverCardIds.push(activeId);
  } else {
    const overIndex = overColumn.cardIds.indexOf(overId);
    const insertIndex = overIndex === -1 ? nextOverCardIds.length : overIndex;
    nextOverCardIds.splice(insertIndex, 0, activeId);
  }

  return columns.map((column) => {
    if (column.id === activeColumnId) {
      return { ...column, cardIds: nextActiveCardIds };
    }
    if (column.id === overColumnId) {
      return { ...column, cardIds: nextOverCardIds };
    }
    return column;
  });
};

export const createId = (prefix: string) => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  const timePart = Date.now().toString(36);
  return `${prefix}-${randomPart}${timePart}`;
};

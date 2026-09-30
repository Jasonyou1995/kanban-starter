import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KanbanBoard } from "@/components/KanbanBoard";

const getFirstColumn = () => screen.getAllByTestId(/column-/i)[0];

describe("看板（KanbanBoard）", () => {
  it("渲染五个列", () => {
    render(<KanbanBoard />);
    expect(screen.getAllByTestId(/column-/i)).toHaveLength(5);
  });

  it("重命名列", async () => {
    render(<KanbanBoard />);
    const column = getFirstColumn();
    const input = within(column).getByLabelText("列标题");
    await userEvent.clear(input);
    await userEvent.type(input, "新名称");
    expect(input).toHaveValue("新名称");
  });

  it("添加并移除卡片", async () => {
    render(<KanbanBoard />);
    const column = getFirstColumn();
    const addButton = within(column).getByRole("button", {
      name: /添加卡片/i,
    });
    await userEvent.click(addButton);

    const titleInput = within(column).getByPlaceholderText(/卡片标题/i);
    await userEvent.type(titleInput, "新卡片");
    const detailsInput = within(column).getByPlaceholderText(/详细说明/i);
    await userEvent.type(detailsInput, "备注");

    await userEvent.click(within(column).getByRole("button", { name: /添加卡片/i }));

    expect(within(column).getByText("新卡片")).toBeInTheDocument();

    const deleteButton = within(column).getByRole("button", {
      name: /删除 新卡片/i,
    });
    await userEvent.click(deleteButton);

    expect(within(column).queryByText("新卡片")).not.toBeInTheDocument();
  });
});

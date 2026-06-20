"use client";

import { useState } from "react";
import { Task } from "@/db/schema";
import TaskRow from "./TaskRow";
import SubtaskList from "./SubtaskList";
import { reorderTasks } from "@/app/actions/tasks";

export default function TaskListDnd({
  tasks,
  goalTitleById,
  subtasksByParent,
}: {
  tasks: Task[];
  goalTitleById: Map<number, string>;
  subtasksByParent?: Map<number, Task[]>;
}) {
  const [order, setOrder] = useState(tasks);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  function handleDragOver(targetId: number) {
    if (draggingId === null || draggingId === targetId) return;
    setOrder((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((t) => t.id === draggingId);
      const toIdx = next.findIndex((t) => t.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }

  function handleDrop() {
    setDraggingId(null);
    reorderTasks(order.map((t) => t.id));
  }

  return (
    <div>
      {order.map((t) => (
        <div key={t.id}>
          <TaskRow
            task={t}
            goalTitle={t.goalId ? goalTitleById.get(t.goalId) : null}
            draggable
            dragging={draggingId === t.id}
            onDragStart={() => setDraggingId(t.id)}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragOver(t.id);
            }}
            onDrop={handleDrop}
          />
          {subtasksByParent && (
            <SubtaskList parentTask={t} subtasks={subtasksByParent.get(t.id) ?? []} />
          )}
        </div>
      ))}
    </div>
  );
}

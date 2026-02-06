
export interface TaskItem {
    id: string
    title: string
    description: string | null
    assigneeId: string
    completed: boolean | null
    createdAt: Date
    updatedAt: Date
}

export type TaskResponse = TaskItem[]

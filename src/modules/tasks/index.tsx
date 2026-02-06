import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { PenLine, Plus, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DefaultLoader from '@/components/defaul-loader'
import { useGetModalState } from '@/hooks/use-modal-state'
import { useTRPC } from '@/integrations/trpc/react'
import { getDate } from '@/utils/get-date'
import { DataTable } from '@/utils/data-table'
import { ModalDrawer } from '@/utils/modal-drawer'
import { toast } from 'sonner'
import { TaskItem } from './types'
import CreateTaskForm from './create-task-form'
import { Spinner } from '@/components/ui/spinner'

function Tasks() {
  // Modal and tRPC hooks
  const trpc = useTRPC()
  const utils = useQueryClient()
  const { isOpen, setIsOpen, open } = useGetModalState({ value: 'create-task' })

  // Data fetching and mutation
  const {
    isPending,
    isError,
    data,
  } = useQuery(trpc.tasks.getAllTasks.queryOptions())
  const remove = useMutation(trpc.tasks.remove.mutationOptions())
  const isProcessing = remove?.isPending
  const items = data?.data || []

  // Remove task handler
  const removeTask = async (taskId: string) => {
    await remove.mutate(
      { taskId },
      {
        onSuccess(data) {
          toast.success(data?.message)
          utils.invalidateQueries({ queryKey: trpc.tasks.getAllTasks.queryKey() })
        },
        onError(error) {
          toast.error(error?.message)
        },
      }
    )
  }

  const columns: ColumnDef<TaskItem>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'completed',
      header: 'Status',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created On',
      cell: ({ row }) => {
        const template = row?.original
        const createdAt = getDate(template?.createdAt)
        return <div>{createdAt}</div>
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated On',
      cell: ({ row }) => {
        const template = row?.original
        const updatedAt = getDate(template?.updatedAt)
        return <div>{updatedAt}</div>
      },
    },
    {
      header: 'Actions',
      cell: ({ row }) => {
        const template = row?.original
        const taskId = template?.id
        return (
          <div className="flex items-center gap-2">
            <Button
              disabled={isProcessing}
              type="button"
              variant="secondary"
              size="icon-sm"
            >
              <PenLine />
            </Button>
            <Button
              onClick={() => removeTask(taskId)}
              disabled={isProcessing}
              id={taskId}
              type="button"
              variant="secondary"
              className="hover:bg-destructive hover:text-white"
              size="icon-sm"
            >
              {isProcessing ? <Spinner /> : <Trash2Icon />}
            </Button>
          </div>
        )
      },
    },
  ]

  // Creator button
  const Creator = () => (
    <Button disabled={isProcessing} type="button" onClick={open} size="sm">
      <Plus />
      Create task
    </Button>
  )

  // Handle loading state first
  if (isPending) {
    return <DefaultLoader />
  }

  // Then error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-10">
        <div className="text-destructive text-lg font-medium mb-2">
          Error loading tasks.
        </div>
        <div className="text-muted-foreground mb-4">
          Something went wrong while fetching the tasks. Please try again.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }
  return (
    <div>
      <ModalDrawer
        title="Create a new task"
        description="Enter task details below to create a new task."
        open={isOpen}
        setOpen={setIsOpen}
      >
        <CreateTaskForm />
      </ModalDrawer>
      <DataTable
        columns={columns}
        data={items}
        title="Tasks"
        searchBy='title'
        createAction={Creator}
      />
    </div>
  )
}

export default Tasks

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { TaskItemInput, taskItemSchema } from './schema'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/integrations/trpc/trpc'
import { useGetModalState } from '@/hooks/use-modal-state'
import { Spinner } from '@/components/ui/spinner'

const CreateTaskForm = () => {
    const create = useMutation(trpc.tasks.create.mutationOptions())
    const utils = useQueryClient()
    const { close } = useGetModalState({ value: "create-task" })
    const form = useForm<TaskItemInput>({
        defaultValues: {
            title: "",
            description: "",
            completed: false,
        },
        resolver: zodResolver(taskItemSchema),
        mode: "onTouched",
    })

    const { control, handleSubmit } = form

    const onCreateTask: SubmitHandler<TaskItemInput> = (data) => {
        create.mutate({
            title: data.title,
            description: data.description,
        }, {
            onSuccess(data) {
                form.reset()
                utils.invalidateQueries({ queryKey: trpc.tasks.getAllTasks.queryKey() })
                toast.success(data?.message)
                close()
            },
            onError(error) {
                console.log(error)
                toast.error(error?.message)
            },
        })
    }
    return (
        <form onSubmit={handleSubmit(onCreateTask)} className="size-full flex flex-col justify-between">
            <FieldGroup className='flex-1'>
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                value={typeof field.value === 'string' ? field.value : ''}
                                placeholder="Task title"
                            />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                value={typeof field.value === 'string' ? field.value : ''}
                                placeholder="Task description"
                            />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} className='text-center pb-2' />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <Field>
                <Button type='submit' className='w-full' disabled={create.isPending}>
                    {create.isPending && <Spinner />}
                    Create Task
                </Button>
            </Field>
        </form>
    )
}

export default CreateTaskForm
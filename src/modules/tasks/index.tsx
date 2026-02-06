import { DataTable } from '@/utils/data-table'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}
function Tasks() {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
  ]
  const data: Payment[] = [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
  ]
  return (
    <div>
      <DataTable columns={columns} data={data} title={'Variable'} />
    </div>
  )
}

export default Tasks

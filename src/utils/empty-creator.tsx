import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Folder } from 'lucide-react'
import React from 'react'

interface EmptyCreatorProps {
  title: string
  description: string
  options: React.ReactNode
}
const EmptyCreator: React.FC<EmptyCreatorProps> = ({
  title,
  description,
  options,
}) => {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder className="size-4" />
        </EmptyMedia>
        <EmptyTitle className="text-sm">{title}</EmptyTitle>
        <EmptyDescription className="text-sm">{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {options}
      </EmptyContent>
    </Empty>
  )
}

export default EmptyCreator

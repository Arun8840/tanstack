// src/modules/themes/index.tsx
'use client'

import EmptyCreator from '@/utils/empty-creator'
import { ThemeTemplateResponse } from './types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ThemeTemplatesProps {
  templates: ThemeTemplateResponse
}

function ThemeTemplates({ templates }: ThemeTemplatesProps) {
  const Actions = () => {
    return (
      <div>
        <Button size={'sm'}>
          <Plus />
          Create Theme
        </Button>
      </div>
    )
  }
  return (
    <div>
      {templates && templates.length > 0 ? (
        templates.map((theme) => <div key={theme.id}>{theme.title}</div>)
      ) : (
        <EmptyCreator
          title="No Themes"
          description="You haven't created any themes yet. Get started by creating your first theme."
          options={<Actions />}
        />
      )}
    </div>
  )
}

export default ThemeTemplates

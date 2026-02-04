// src/modules/themes/index.tsx
'use client'

import { ThemeTemplateResponse } from "./types";


interface ThemeTemplatesProps {
  templates: ThemeTemplateResponse
}

function ThemeTemplates({ templates }: ThemeTemplatesProps) {

  return (
    <div>
      {templates?.map((theme) => (
        <div key={theme.id}>
          {theme.title}
        </div>
      ))}
    </div>
  )
}

export default ThemeTemplates
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PMMessageCardProps {
  message: string
  type: "recommendations" | "options" | "action"
  allowMultiSelect?: boolean
  options?: Array<{
    title?: string
    label?: string
    description: string
    keyAreas?: string[]
  }>
  actions?: Array<{
    label: string
    value: string
    primary: boolean
  }>
  onSelect: (value: string) => void
}

export function PMMessageCard({ message, type, allowMultiSelect, options, actions, onSelect }: PMMessageCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleOptionClick = (value: string) => {
    if (allowMultiSelect) {
      setSelectedOptions(prev => {
        if (prev.includes(value)) {
          return prev.filter(v => v !== value)
        }
        return [...prev, value]
      })
    } else {
      onSelect(value)
    }
  }

  const handleSubmitMultiple = () => {
    if (selectedOptions.length > 0) {
      onSelect(selectedOptions.join(", "))
      setSelectedOptions([])
    }
  }

  return (
    <div className="w-full max-w-full">
      <p className="mb-2 text-xs font-medium opacity-70">AI Project Manager</p>

      {type === "action" ? (
        // Action buttons in a card
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="prose prose-sm mb-4">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
            <div className="flex gap-3">
              {actions?.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.primary ? "default" : "outline"}
                  onClick={() => onSelect(action.label)}
                  className="flex-1"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Options as cards
        <>
          <div className="prose prose-sm mb-3">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {options?.map((option, idx) => {
              const title = option.title || option.label || ""
              const hasKeyAreas = option.keyAreas && option.keyAreas.length > 0
              const selectValue = type === "recommendations"
                ? `I'm interested in: ${title} - ${option.description}`
                : `${title}: ${option.description}`
              const isSelected = selectedOptions.includes(selectValue)

              return (
                <Card
                  key={idx}
                  className={`cursor-pointer transition-all hover:shadow-sm hover:border-primary ${
                    isSelected ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleOptionClick(selectValue)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        <CardDescription className="mt-1 text-xs">
                          {option.description}
                        </CardDescription>
                      </div>
                      {allowMultiSelect && isSelected && (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      )}
                    </div>
                  </CardHeader>
                  {hasKeyAreas && (
                    <CardContent className="pt-0 pb-3">
                      <ul className="space-y-0.5">
                        {option.keyAreas!.slice(0, 3).map((area, areaIdx) => (
                          <li key={areaIdx} className="text-xs text-muted-foreground">
                            • {area}
                          </li>
                        ))}
                        {option.keyAreas!.length > 3 && (
                          <li className="text-xs text-muted-foreground font-medium">
                            +{option.keyAreas!.length - 3} more
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>

          {allowMultiSelect && selectedOptions.length > 0 && (
            <div className="mt-3 flex justify-end">
              <Button onClick={handleSubmitMultiple} size="sm">
                Continue with {selectedOptions.length} selected
              </Button>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground text-center">
            {allowMultiSelect
              ? "Select one or more options, or type your own response below"
              : "Select an option above, or type your own response below"}
          </p>
        </>
      )}
    </div>
  )
}

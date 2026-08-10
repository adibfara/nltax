import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { Info, RotateCcw } from 'lucide-react'

interface TopTogglesProps {
  thirtyPercentRuling: boolean
  applyTaxCredits: boolean
  onToggleRuling: () => void
  onToggleTaxCredits: () => void
  onResetAll: () => void
}

export function TopToggles({
  thirtyPercentRuling,
  applyTaxCredits,
  onToggleRuling,
  onToggleTaxCredits,
  onResetAll,
}: TopTogglesProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-6">
      <div className="flex items-center gap-2">
        <Label htmlFor="ruling-toggle" className="flex items-center gap-1">
          30% ruling
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Only 70% of gross salary is taxed</TooltipContent>
          </Tooltip>
        </Label>
        <Switch id="ruling-toggle" checked={thirtyPercentRuling} onCheckedChange={onToggleRuling} />
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="credits-toggle" className="flex items-center gap-1">
          Tax credits
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Applies arbeidskorting + algemene heffingskorting</TooltipContent>
          </Tooltip>
        </Label>
        <Switch id="credits-toggle" checked={applyTaxCredits} onCheckedChange={onToggleTaxCredits} />
      </div>

      <ThemeToggle />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onResetAll} aria-label="Reset all data">
            <RotateCcw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear all data and restore defaults</TooltipContent>
      </Tooltip>
    </div>
  )
}

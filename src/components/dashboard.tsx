import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PenIcon } from 'lucide-react'
import { Tab } from '@/App'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

export default function Dashboard({ initialTabs }: { initialTabs: Tab[] }) {
  const [tabs, setTabs] = useState(initialTabs)
  const [editingTab, setEditingTab] = useState<Tab | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleVersionChange = (tabId: string, versionId: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.i === tabId ? { ...tab, currentVersion: versionId } : tab
      )
    )
  }

  const handleEdit = (tab: Tab) => {
    setEditingTab(tab)
    setEditContent(tab.versions.find(v => v.id === tab.currentVersion)?.content ?? '')
  }

  const handleSave = () => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.i === editingTab?.i
          ? {
            ...tab,
            versions: tab.versions.map(v =>
              v.id === tab.currentVersion ? { ...v, content: editContent } : v
            )
          }
          : tab
      )
    )
    setEditingTab(null)
  }

  const handleNewVersion = () => {
    const newVersionId = `v${(editingTab?.versions.length ?? 0) + 1}`
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.i === editingTab?.i
          ? {
            ...tab,
            versions: [...tab.versions, { id: newVersionId, content: editContent, isDefault: false }],
            currentVersion: newVersionId
          }
          : tab
      )
    )
    setEditingTab(null)
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tabs.map((tab) => (
          <Accordion key={tab.i} type="single" collapsible className="w-full">

            <Card className="w-full">
              <AccordionItem value="item-1">

                <CardHeader className="flex flex-col items-start space-y-2">
                  <CardTitle className="text-xl font-bold flex justify-between items-center w-full">
                    <span>
                      {tab.title}
                    </span>
                    <span>
                      <AccordionTrigger />
                    </span>
                  </CardTitle>
                  <div className="flex items-center justify-between w-full">
                    <Select
                      value={tab.currentVersion}
                      onValueChange={(value) => handleVersionChange(tab.i, value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Version" />
                      </SelectTrigger>
                      <SelectContent>
                        {tab.versions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            {version.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tab)}>
                      <PenIcon className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{tab.description}</p>
                  </AccordionContent>
                </CardContent>
              </AccordionItem>
            </Card>
          </Accordion>
        ))}
      </div>

      <Dialog open={editingTab !== null} onOpenChange={() => setEditingTab(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar {editingTab?.title}</DialogTitle>
          </DialogHeader>
          <Textarea
            className="min-h-[200px]"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleSave}>Guardar</Button>
            <Button onClick={handleNewVersion}>Nueva Versión</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
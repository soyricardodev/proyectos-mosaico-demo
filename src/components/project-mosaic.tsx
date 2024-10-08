import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { GitBranch, MoreVertical } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Tab } from '@/App'

const ResponsiveGridLayout = WidthProvider(Responsive)

export function ProjectMosaic({ initialTabs }: { initialTabs: Tab[] }) {
  const [tabs, setTabs] = useState(initialTabs)
  const [focusedTab, setFocusedTab] = useState<string | null>(null)

  const layout = tabs.map((tab, index) => ({
    i: tab.i,
    x: (index % 3) * 2,
    y: Math.floor(index / 3) * 2,
    w: tab.w,
    h: tab.h,
    minW: 2,
    minH: 2,
  }))

  const handleContentChange = (i: string, newContent: string) => {
    setTabs(tabs.map(tab => 
      tab.i === i ? {
        ...tab,
        versions: tab.versions.map(v => 
          v.id === tab.currentVersion ? { ...v, content: newContent } : v
        )
      } : tab
    ))
  }

  const handleVersionChange = (i: string, newVersion: string) => {
    setTabs(tabs.map(tab => 
      tab.i === i ? { ...tab, currentVersion: newVersion } : tab
    ))
  }

  const handleSave = (i: string) => {
    const tab = tabs.find(tab => tab.i === i)
    if (tab) {
      const currentVersionContent = tab.versions.find(v => v.id === tab.currentVersion)?.content
      console.log('Saving data for tab:', i, 'Version:', tab.currentVersion, 'Content:', currentVersionContent)
    }
    // Here you would typically send the data to a server
  }

  const handleCreateNewVersion = (i: string) => {
    setTabs(tabs.map(tab => {
      if (tab.i === i) {
        const newVersionId = `v${tab.versions.length + 1}`
        const currentContent = tab.versions.find(v => v.id === tab.currentVersion)?.content || ''
        return {
          ...tab,
          versions: [...tab.versions, { id: newVersionId, content: currentContent, isDefault: false }],
          currentVersion: newVersionId
        }
      }
      return tab
    }))
  }

  const handleSetDefaultVersion = (i: string, versionId: string) => {
    setTabs(tabs.map(tab => 
      tab.i === i ? {
        ...tab,
        versions: tab.versions.map(v => ({ ...v, isDefault: v.id === versionId }))
      } : tab
    ))
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 6, sm: 4, xs: 2, xxs: 2 }}
        rowHeight={100}
      >
        {tabs.map((tab) => (
          <div key={tab.i} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-semibold flex justify-between items-center text-sm">
              <span className="truncate">{tab.title}</span>
              <div className="flex items-center space-x-1">
                <Select 
                  value={tab.currentVersion} 
                  onValueChange={(value) => handleVersionChange(tab.i, value)}
                >
                  <SelectTrigger className="w-14 h-6 text-xs">
                    <SelectValue placeholder="Version" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    {tab.versions.map((version) => (
                      <SelectItem key={version.id} value={version.id} className="flex items-center justify-between">
                        {version.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-0" align="end">
                    {tab.versions.map((version) => (
                      <div key={version.id} className="flex items-center space-x-2 p-2">
                        <Checkbox
                          id={`${tab.i}-${version.id}`}
                          checked={version.isDefault}
                          onCheckedChange={() => handleSetDefaultVersion(tab.i, version.id)}
                        />
                        <label htmlFor={`${tab.i}-${version.id}`} className="text-sm">
                          {version.id} as default
                        </label>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="p-2 h-[calc(100%-2.5rem)] relative">
              {tab.i === 'alcance' ? (
                <Select 
                  value={tab.versions.find(v => v.id === tab.currentVersion)?.content} 
                  onValueChange={(value) => handleContentChange(tab.i, value)}
                >
                  <SelectTrigger className="w-full h-full">
                    <SelectValue placeholder="Seleccionar alcance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <>
                  <Textarea
                    value={tab.versions.find(v => v.id === tab.currentVersion)?.content}
                    onChange={(e) => handleContentChange(tab.i, e.target.value)}
                    onFocus={() => setFocusedTab(tab.i)}
                    onBlur={() => setFocusedTab(null)}
                    placeholder="Escriba aquí..."
                    className="w-full h-full resize-none pr-24 scrollbar-hide"
                  />
                  <div className={`absolute bottom-2 right-2 flex gap-2 transition-all duration-300 ease-in-out ${
                    focusedTab === tab.i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <Button onClick={() => handleSave(tab.i)} size="sm">
                      Guardar
                    </Button>
                    <Button onClick={() => handleCreateNewVersion(tab.i)} size="sm" variant="outline">
                      <GitBranch className="w-4 h-4 mr-1" />
                      Nueva versión
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}
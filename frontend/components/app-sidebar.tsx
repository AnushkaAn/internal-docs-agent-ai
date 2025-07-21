import { MessageSquare, Upload, Bookmark, Settings, FileText, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} 
from "@/components/components/ui/sidebar" 
import { Badge } from "@/components/components/ui/badge"

const menuItems = [
  {
    title: "Ask Docs",
    icon: MessageSquare,
    isActive: true,
    badge: null,
  },
  {
    title: "Upload Docs",
    icon: Upload,
    isActive: false,
    badge: null,
  },
  {
    title: "Saved Answers",
    icon: Bookmark,
    isActive: false,
    badge: "12",
  },
  {
    title: "Settings",
    icon: Settings,
    isActive: false,
    badge: null,
  },
]

const recentDocs = [
  { name: "API Reference", type: "PDF", updated: "2 hours ago" },
  { name: "Deployment Guide", type: "DOCX", updated: "1 day ago" },
  { name: "Security Policies", type: "PDF", updated: "3 days ago" },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-800 bg-gray-900">
      <SidebarHeader className="border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-100">Docs AI</h2>
            <p className="text-xs text-gray-400">Internal Assistant</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={item.isActive}
                className="w-full justify-start text-gray-300 hover:text-gray-100 hover:bg-gray-800 data-[active=true]:bg-blue-600/20 data-[active=true]:text-blue-400 data-[active=true]:border-blue-500/30"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto bg-gray-700 text-gray-300 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-8">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Recent Documents</h3>
          <div className="space-y-2">
            {recentDocs.map((doc, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{doc.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                      {doc.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{doc.updated}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4">
        <div className="text-xs text-gray-500 text-center">
          <p>AI-powered documentation assistant</p>
          <p className="mt-1">for internal teams</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

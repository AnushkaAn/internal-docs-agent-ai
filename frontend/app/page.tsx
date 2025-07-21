"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Send,
  Upload,
  User,
  Bot,
  Clock,
} from "lucide-react"
import { Button } from "@/components/components/ui/button"
import { Input } from "@/components/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/components/ui/avatar"
import { SidebarProvider, SidebarInset } from "@/components/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Time } from "@/components/components/ui/time"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function DocsAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your Internal Docs AI Agent. I can help you find information from your uploaded documentation. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: inputValue }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error fetching response:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content: "⚠️ Failed to get response from backend.",
          timestamp: new Date(),
        },
      ])
    }

    setIsLoading(false)
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const formData = new FormData();

  // ✅ Safely convert FileList to Array
  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  try {
    setUploading(true);
    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ File(s) uploaded and indexed!");
    } else {
      alert("❌ Upload failed: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("⚠️ An error occurred while uploading.");
  } finally {
    setUploading(false);
  }
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-950 text-gray-100">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-xl font-semibold">Internal Docs AI</h1>
              <Avatar className="w-8 h-8 border border-gray-700">
                <AvatarFallback className="bg-gray-800 text-gray-300">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-2xl">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 border border-gray-700">
                      <AvatarFallback
                        className={`${
                          message.type === "user"
                            ? "bg-blue-600"
                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                        } text-white`}
                      >
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 border border-gray-700 text-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="flex items-center mt-2 text-xs opacity-70">
                        <Clock className="w-3 h-3 mr-1" />
                        <Time timestamp={message.timestamp} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-2xl flex items-center space-x-2 text-sm text-gray-400">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything about your internal docs..."
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 pr-12 py-3 rounded-xl"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>

        {/* Upload Floating Button */}
        <Button
          size="lg"
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg"
          onClick={handleFileUploadClick}
          disabled={uploading}
        >
          <Upload className="w-5 h-5 mr-2" />
          {uploading ? "Uploading..." : "Upload Docs"}
        </Button>
        <input
  type="file"
  accept=".pdf,.docx,.doc,.txt"
  ref={fileInputRef}
  onChange={handleFileChange}
  multiple
  style={{ display: "none" }}
/>
      </div>
    </SidebarProvider>
  )
}

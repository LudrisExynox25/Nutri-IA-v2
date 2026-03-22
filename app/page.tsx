'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ChatArea from '@/components/chat-area'
import ChatInput from '@/components/chat-input'

interface Document {
  id: string
  name: string
  uploadedAt: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function Page() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: `Document ${documents.length + 1}`,
      uploadedAt: new Date().toISOString(),
    }
    setDocuments([newDoc, ...documents])
    setSelectedDocumentId(newDoc.id)
    setMessages([]) // Clear messages when switching documents
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
    if (selectedDocumentId === id) {
      setSelectedDocumentId(documents.length > 1 ? documents[0].id : null)
      setMessages([])
    }
  }

  const handleSelectDocument = (id: string) => {
    setSelectedDocumentId(id)
    setMessages([]) // Clear messages when switching documents
  }

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate API call with a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${message}". This is a demo response. In a real app, this would process your question against the selected document.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        documents={documents}
        onAddDocument={handleAddDocument}
        onDeleteDocument={handleDeleteDocument}
        onSelectDocument={handleSelectDocument}
        selectedDocumentId={selectedDocumentId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea messages={messages} isLoading={isLoading} />
        {selectedDocumentId && (
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}

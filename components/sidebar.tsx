'use client'

import { Plus, FileText, Trash2, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Document {
  id: string
  name: string
  uploadedAt: string
}

interface SidebarProps {
  documents: Document[]
  onAddDocument: () => void
  onDeleteDocument: (id: string) => void
  onSelectDocument: (id: string) => void
  selectedDocumentId: string | null
}

export default function Sidebar({
  documents,
  onAddDocument,
  onDeleteDocument,
  onSelectDocument,
  selectedDocumentId,
}: SidebarProps) {
  const [expandDocuments, setExpandDocuments] = useState(true)

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">ChatBot</h1>
        <p className="text-sm text-gray-500">Document Assistant</p>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={onAddDocument}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Chat
        </Button>
      </div>

      {/* Documents Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setExpandDocuments(!expandDocuments)}
            className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            <span className="flex items-center gap-2">
              <FileText size={16} />
              Documents
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${expandDocuments ? '' : '-rotate-90'}`}
            />
          </button>
        </div>

        {expandDocuments && (
          <div className="flex-1 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No documents yet</p>
              </div>
            ) : (
              <div className="p-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                      selectedDocumentId === doc.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => onSelectDocument(doc.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteDocument(doc.id)
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Upload documents to get started</p>
      </div>
    </aside>
  )
}

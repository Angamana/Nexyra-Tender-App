import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Upload, Eye, X, AlertTriangle } from 'lucide-react'
import localforage from 'localforage'
// @ts-ignore
import mammoth from 'mammoth'

type TemplateItem = {
  name: string
  desc: string
  file?: File
}

export default function TemplateList() {
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [templateToPreview, setTemplateToPreview] = useState<TemplateItem | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [templates, setTemplates] = useState<TemplateItem[]>([
    { name: 'Nexyra_Pricing_Standard.docx', desc: 'Price List formatting template • AI will inject dynamic prices here.' },
    { name: 'Company_Profile_Cover.docx', desc: 'Standard cover letter layout with letterhead.' }
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load from localforage on mount
  useEffect(() => {
    localforage.getItem<TemplateItem[]>('nexyra_templates').then((saved) => {
      if (saved && saved.length > 0) {
        setTemplates(saved)
      }
    }).catch(console.error)
  }, [])

  const saveTemplates = async (newTemplates: TemplateItem[]) => {
    setTemplates(newTemplates)
    await localforage.setItem('nexyra_templates', newTemplates).catch(console.error)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setTimeout(() => {
        saveTemplates([{ name: file.name, desc: 'Newly uploaded template • Original Layout Preserved.', file }, ...templates])
        setIsUploading(false)
      }, 1500)
    }
  }

  useEffect(() => {
    if (templateToPreview?.file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setPreviewHtml(result.value || '<p class="text-gray-500 italic">Document is empty.</p>')
        } catch (err) {
          console.error(err)
          setPreviewHtml('<p class="text-red-500 font-bold p-8 text-center">Error rendering document. The file might be corrupted or unsupported.</p>')
        }
      }
      reader.readAsArrayBuffer(templateToPreview.file)
    } else if (templateToPreview && !templateToPreview.file) {
      setPreviewHtml('<div class="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl mt-12 max-w-xl mx-auto"><p class="font-bold text-lg text-gray-900 mb-2">Built-in Template Preview</p>This is a default template placeholder.<br/>Please upload your own <b>.docx</b> file to see a live rendering of your document layout.</div>')
    } else {
      setPreviewHtml(null)
    }
  }, [templateToPreview])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Template Library</h1>
          <p className="text-sm text-gray-500 mt-1">Manage letterheads and proposal templates for document generation.</p>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="space-y-6 max-w-3xl">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Preserve Original Formatting</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload your exact company templates (Pricing, Cover Letters, Methodologies). 
              The AI will use these files as strict blueprints to ensure that when it compiles tenders, 
              the layout, tables, logos, and fonts match your original documents perfectly.
            </p>
            
            <div 
              className={`border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-colors cursor-pointer ${isUploading ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".doc,.docx"
              />
              {isUploading ? (
                <>
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-blue-900">Uploading Document...</p>
                  <p className="text-xs text-blue-600 mt-1">Please wait while the AI analyzes the blueprint</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-900">Upload .docx Template</p>
                  <p className="text-xs text-gray-500 mt-1">Drag and drop or click to browse</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Active Templates</h4>
            
            {templates.map(template => (
              <div key={template.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:border-blue-300 transition-colors gap-3">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0 mt-0.5 sm:mt-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-500">{template.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 justify-end sm:justify-start flex-shrink-0">
                  <button 
                    onClick={() => setTemplateToPreview(template)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors bg-blue-50/50 sm:bg-transparent"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                  <button 
                    onClick={() => setTemplateToDelete(template.name)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors bg-red-50/50 sm:bg-transparent"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {templateToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Template?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to permanently delete <span className="font-semibold text-gray-700">{templateToDelete}</span>? The AI will no longer be able to use this blueprint for formatting.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setTemplateToDelete(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    saveTemplates(templates.filter(t => t.name !== templateToDelete))
                    setTemplateToDelete(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {templateToPreview && createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setTemplateToPreview(null)
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col z-[9999] animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between p-3 sm:p-4 text-white bg-gray-900 border-b border-gray-800 gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-md">{templateToPreview.name}</h3>
                <p className="text-xs text-gray-400 truncate">Microsoft Word Document • {templateToPreview.file ? (templateToPreview.file.size / 1024).toFixed(1) + ' KB' : 'Built-in'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
              <button 
                onClick={() => setTemplateToPreview(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md active:scale-95"
                title="Close Preview"
                aria-label="Close Preview"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>

          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setTemplateToPreview(null)
            }}
            className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center pb-24 items-start"
          >
            {/* Rendered HTML Viewer */}
            <div className="bg-white max-w-4xl w-full min-h-[800px] sm:min-h-[1056px] h-max shadow-2xl rounded-md p-6 sm:p-16 animate-in slide-in-from-bottom-8 duration-300 relative text-gray-900 leading-relaxed preview-content"
                 dangerouslySetInnerHTML={{ __html: previewHtml || '<div class="flex items-center justify-center h-64"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>' }}
            >
            </div>
          </div>

          {/* Floating Bottom Close Button for Mobile & Easy Access */}
          <button 
            onClick={() => setTemplateToPreview(null)}
            className="fixed bottom-6 right-6 z-[10000] bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Close Document Preview"
          >
            <X className="w-5 h-5" />
            <span>Close Preview</span>
          </button>

          <style dangerouslySetInnerHTML={{ __html: `
            .preview-content h1 { font-size: 2.25rem; font-weight: bold; margin-bottom: 1rem; color: #111827; }
            .preview-content h2 { font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem; margin-top: 1.5rem; color: #111827; }
            .preview-content h3 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem; margin-top: 1.5rem; color: #111827; }
            .preview-content p { margin-bottom: 1rem; }
            .preview-content table { width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 1rem; }
            .preview-content th, .preview-content td { border: 1px solid #d1d5db; padding: 0.75rem; }
            .preview-content th { background-color: #f3f4f6; font-weight: 600; text-align: left; }
            .preview-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
            .preview-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
          `}} />
        </div>,
        document.body
      )}
    </div>
  )
}

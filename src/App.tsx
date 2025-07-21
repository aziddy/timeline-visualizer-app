import { useState } from 'react'
import './App.css'
import { useUrlState } from './hooks/useUrlState'
import { CalendarView } from './components/CalendarView'
import { LineView } from './components/LineView'
import { ListView } from './components/ListView'
import { LabelSummary } from './components/LabelSummary'
import { EntryForm } from './components/EntryForm'
import type { TimelineEntry, ViewMode } from './types/timeline'

function App() {
  const { state, updateState } = useUrlState()
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | undefined>()

  const handleAddEntry = () => {
    setEditingEntry(undefined)
    setShowForm(true)
  }

  const handleEditEntry = (entry: TimelineEntry) => {
    setEditingEntry(entry)
    setShowForm(true)
  }

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const newEntries = state.timelineData.entries.filter(e => e.id !== entryId)
      updateState({
        timelineData: {
          ...state.timelineData,
          entries: newEntries
        }
      })
    }
  }

  const handleSaveEntry = (entryData: Omit<TimelineEntry, 'id'>) => {
    const newEntries = [...state.timelineData.entries]
    
    if (editingEntry) {
      const index = newEntries.findIndex(e => e.id === editingEntry.id)
      if (index >= 0) {
        newEntries[index] = { ...entryData, id: editingEntry.id }
      }
    } else {
      const newEntry: TimelineEntry = {
        ...entryData,
        id: Date.now().toString()
      }
      newEntries.push(newEntry)
    }

    updateState({
      timelineData: {
        ...state.timelineData,
        entries: newEntries
      }
    })
    
    setShowForm(false)
    setEditingEntry(undefined)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    updateState({ viewMode: mode })
  }

  const handleTimelineNameChange = (name: string) => {
    updateState({
      timelineData: {
        ...state.timelineData,
        name
      }
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="timeline-title-container">
            <span className="edit-icon">✏️</span>
            <input
              type="text"
              value={state.timelineData.name}
              onChange={(e) => handleTimelineNameChange(e.target.value)}
              className="timeline-title"
              placeholder="Timeline Name"
            />
          </div>
          
          <div className="view-controls">
            <button 
              className={state.viewMode === 'calendar' ? 'active' : ''}
              onClick={() => handleViewModeChange('calendar')}
            >
              Calendar
            </button>
            <button 
              className={state.viewMode === 'line-horizontal' ? 'active' : ''}
              onClick={() => handleViewModeChange('line-horizontal')}
            >
              Line (H)
            </button>
            <button 
              className={state.viewMode === 'line-vertical' ? 'active' : ''}
              onClick={() => handleViewModeChange('line-vertical')}
            >
              Line (V)
            </button>
            <button 
              className={state.viewMode === 'list' ? 'active' : ''}
              onClick={() => handleViewModeChange('list')}
            >
              List
            </button>
          </div>

          <button onClick={handleAddEntry} className="add-entry-btn">
            + Add Entry
          </button>
        </div>
      </header>

      <main className="app-main">
        {state.viewMode === 'calendar' && (
          <CalendarView 
            entries={state.timelineData.entries} 
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
        
        {state.viewMode === 'line-horizontal' && (
          <LineView 
            entries={state.timelineData.entries} 
            mode="horizontal" 
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
        
        {state.viewMode === 'line-vertical' && (
          <LineView 
            entries={state.timelineData.entries} 
            mode="vertical" 
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {state.viewMode === 'list' && (
          <>
            <LabelSummary entries={state.timelineData.entries} />
            <ListView 
              entries={state.timelineData.entries} 
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          </>
        )}

        {state.timelineData.entries.length === 0 && state.viewMode !== 'list' && (
          <div className="empty-state">
            <p>No timeline entries yet. Click "Add Entry" to get started!</p>
          </div>
        )}
      </main>

      {showForm && (
        <EntryForm
          entry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={() => {
            setShowForm(false)
            setEditingEntry(undefined)
          }}
        />
      )}
    </div>
  )
}

export default App

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActivePage, Project, ExportRecord } from './types';
import { INITIAL_SAMPLE_PROJECTS, INITIAL_SAMPLE_EXPORTS } from './services/videoApi';
import { MarketingPage } from './components/MarketingPage';
import { StudioSidebar } from './components/StudioSidebar';
import { StudioTopBar } from './components/StudioTopBar';
import { OverviewView } from './components/OverviewView';
import { WorkspaceView } from './components/WorkspaceView';
import { ProjectsView } from './components/ProjectsView';
import { ExportsView } from './components/ExportsView';
import { SettingsView } from './components/SettingsView';
import { UploadModal } from './components/UploadModal';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('homepage');
  const [projects, setProjects] = useState<Project[]>(INITIAL_SAMPLE_PROJECTS);
  const [exports, setExports] = useState<ExportRecord[]>(INITIAL_SAMPLE_EXPORTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('sample-prj-01');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Active project for workspace
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  const handleSelectProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setActivePage('workspace');
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setSelectedProjectId(newProject.id);
    setActivePage('workspace');
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProjectId === projectId) {
      const remaining = projects.filter((p) => p.id !== projectId);
      if (remaining.length > 0) {
        setSelectedProjectId(remaining[0].id);
      }
    }
  };

  const handleAddExport = (newExport: ExportRecord) => {
    setExports([newExport, ...exports]);
  };

  const handleDeleteExport = (exportId: string) => {
    setExports((prev) => prev.filter((e) => e.id !== exportId));
  };

  const userProjectsCount = projects.filter((p) => !p.isSample).length;

  // Render Marketing Page in standalone layout
  if (activePage === 'homepage') {
    return (
      <>
        <MarketingPage
          onNavigate={(page) => setActivePage(page)}
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      </>
    );
  }

  // Render Studio Workspace & Dashboard layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#10131C] text-white">
      {/* Studio Sidebar */}
      <StudioSidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        userProjectCount={userProjectsCount}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <StudioTopBar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          userProjectCount={userProjectsCount}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'overview' && (
            <OverviewView
              projects={projects}
              onSelectProject={handleSelectProject}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'workspace' && (
            <WorkspaceView
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              onAddExport={handleAddExport}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />
          )}

          {activePage === 'projects' && (
            <ProjectsView
              projects={projects}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />
          )}

          {activePage === 'exports' && (
            <ExportsView
              exports={exports}
              onDeleteExport={handleDeleteExport}
              onOpenWorkspace={() => setActivePage('workspace')}
            />
          )}

          {activePage === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}

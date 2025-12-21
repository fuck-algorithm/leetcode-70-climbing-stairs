import { AnimationState, AnimationTimeline } from '../../state/animationSlice';

export interface DPSolutionData {
  result: number;
  timeline: AnimationTimeline[];
  stepsData?: {
    stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[];
    values: number[];
  };
}

export interface DynamicProgrammingVisualizerProps {
  n: number;
  state: AnimationState;
  onGenerateSolution: (data: DPSolutionData) => void;
  dispatch: (action: { type: string; payload?: unknown }) => void;
}

export interface ControlPanelProps {
  state: AnimationState;
  dispatch: (action: { type: string; payload?: unknown }) => void;
  onReset: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onPlayPause: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onPreviousStep: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onNextStep: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onStepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PathDiagramProps {
  n: number;
  state: AnimationState;
  currentTimeline: AnimationTimeline | null;
}

export interface GuidePanelProps {
  showingGuide: boolean;
  setShowingGuide: (show: boolean) => void;
}

export type ClimberPosition = 'bottom' | 'step1' | 'step2';

export interface StairPosition {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
} 
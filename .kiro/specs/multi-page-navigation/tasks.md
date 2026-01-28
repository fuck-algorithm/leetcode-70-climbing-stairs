# Implementation Plan

- [x] 1. Set up routing infrastructure
  - [x] 1.1 Install and configure React Router
    - Add react-router dependency (already installed based on package.json)
    - Update main.tsx to wrap App with BrowserRouter
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Create route configuration file
    - Create src/routes/config.ts with NAV_ITEMS and VALID_PATHS constants
    - Define DEFAULT_PATH constant
    - _Requirements: 2.1, 2.2, 2.3, 3.3_

- [x] 2. Create Layout and Navigation components
  - [x] 2.1 Create Layout component with Outlet
    - Create src/components/Layout.tsx
    - Include header with title link, GitHubCorner, BackToHot100, WeChatGroup
    - Use Outlet for child route rendering
    - _Requirements: 4.3_
  - [x] 2.2 Create NavigationBar component with NavLink
    - Create src/components/NavigationBar.tsx
    - Use NavLink for active state styling
    - Apply algorithm-specific colors
    - _Requirements: 1.1, 1.3, 4.1_
  - [x]* 2.3 Write property test for active state synchronization
    - **Property 2: Active State Synchronization**
    - **Validates: Requirements 1.3**

- [x] 3. Create algorithm page components
  - [x] 3.1 Create DPPage component
    - Create src/pages/DPPage.tsx
    - Extract DP-specific logic from current App.tsx
    - Include SimpleDPVisualizer, CodePanel, DataInput, AlgorithmThoughts
    - _Requirements: 2.1, 2.4_
  - [x] 3.2 Create MatrixPage component
    - Create src/pages/MatrixPage.tsx
    - Extract Matrix-specific logic from current App.tsx
    - Include MatrixFastPower, CodePanel, DataInput, AlgorithmThoughts
    - _Requirements: 2.2, 2.4_
  - [x] 3.3 Create FormulaPage component
    - Create src/pages/FormulaPage.tsx
    - Extract Formula-specific logic from current App.tsx
    - Include FormulaVisualizer, CodePanel, DataInput, AlgorithmThoughts
    - _Requirements: 2.3, 2.4_

- [x] 4. Update App.tsx with route definitions
  - [x] 4.1 Refactor App.tsx to use Routes
    - Replace algorithm selector with Routes configuration
    - Add Navigate for root and catch-all redirects
    - Remove algorithm switching logic
    - _Requirements: 1.2, 1.4, 3.2, 3.3_
  - [x]* 4.2 Write property test for invalid URL redirect
    - **Property 4: Invalid URL Redirect**
    - **Validates: Requirements 3.3**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Integration and cleanup
  - [x] 6.1 Update CSS styles for navigation
    - Update App.css with NavLink active styles
    - Ensure responsive design for navigation bar
    - _Requirements: 4.1, 4.2_
  - [x] 6.2 Remove deprecated code from App.tsx
    - Remove unused algorithm state management
    - Remove renderAlgorithmSelector function
    - Clean up unused imports
    - _Requirements: 2.4_
  - [x]* 6.3 Write property test for route-URL synchronization
    - **Property 1: Route-URL Synchronization**
    - **Validates: Requirements 1.2, 3.1**
  - [x]* 6.4 Write property test for direct URL access
    - **Property 3: Direct URL Access**
    - **Validates: Requirements 3.2**

- [x] 7. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

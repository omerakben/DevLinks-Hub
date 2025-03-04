**Front End Capstone Requirements: DevLinks Hub**

**Project:** DevLinks Hub
DevLinks Hub
DevLinks Hub is a centralized resource management platform designed to streamline access to development resources through a curated link management system. The platform offers two distinct experiences: a public-facing curated collection of essential developer resources managed by administrators and personalized link collections for authenticated users. Using Firebase for authentication and database management, the platform will provide a clean, organized interface for accessing frequently used development resources.
The motivation behind this project stems from a common challenge in web development: the scattered nature of learning resources and documentation. As developers navigate between various frameworks, libraries, and tools, maintaining quick access to these resources becomes increasingly complex. While browser bookmarks exist, they lack organization, shareability, and accessibility across devices. By creating a centralized hub specifically designed for developers, this platform aims to reduce the friction in accessing essential resources and improve workflow efficiency.
Core Features:
- Public view displaying categorized default links (Frontend Developer, Backend Developer, Full Stack Developer etc.)
- Administrator dashboard for managing public resource collections
- Google Authentication integration for user accounts
- Personal link collection management for authenticated users (CRUD operations)
- Category-based organization system
- Responsive design for mobile and desktop access
- Search functionality within saved resources
Stretch Features:
- Link validation checking
- Resource rating system
- Community-suggested links queue for admin review
- Link click analytics
- Resource description and notes feature
- Tag-based filtering system
- Quick copy functionality for code snippets or URLs


**I. General Requirements Checklist**

This section outlines the general requirements for the front-end capstone project and confirms that DevLinks Hub meets each one.

*   [] **Persistent Storage:**
    *   **Requirement:** You are required to use the persistent storage tool that you were taught (i.e. json-server, firebase, SQL Server, SQLite).
    *   **DevLinks Hub Implementation:** DevLinks Hub uses **Firebase Realtime Database** for persistent storage. This was the primary database technology taught in the bootcamp.

*   [] **Frameworks/Libraries:**
    *   **Requirement:** You are required to use the major libraries and/or frameworks that you learned during the course (e.g. React, etc...).
    *   **DevLinks Hub Implementation:** DevLinks Hub uses **Next.js (which is built on React)**, the primary framework taught in the bootcamp. It also utilizes the Firebase SDK (for Authentication and Realtime Database).

*   [] **Multiple Routes:**
    *   **Requirement:** Your application must support multiple routes to show different views to the user, and the user must be able to navigate to each route/view.
    *   **DevLinks Hub Implementation:** DevLinks Hub utilizes Next.js's built-in routing system to support multiple routes, including:
        *   `/` (Homepage - Public view)
        *   `/user/dashboard` (User Dashboard - Authenticated)
        *   `/admin/dashboard` (Admin Dashboard - Authenticated and Admin-only)
        *   (Potentially others, like a dedicated "suggest link" page)

*   [] **Single Responsibility Principle:**
    *   **Requirement:** You must show your proficiency by following the Single Responsibility Principle and writing modular code, where each module has a single responsibility.
    *   **DevLinks Hub Implementation:** DevLinks Hub is structured with modular components:
        *   `Navbar`: Handles navigation and authentication.
        *   `LinkCard`: Displays a single link (reusable for both public and user links).
        *   `AddLinkForm`: Handles adding and editing links.
        *   `CategoryList`: Displays a list of categories.
        *   Separate API routes (`/api/links`, `/api/categories`, etc.) handle specific data operations.

*   [] **Create Resource Form:**
    *   **Requirement:** You must have a form that allows a user to create a new resource.
    *   **DevLinks Hub Implementation:** The `AddLinkForm` component provides a form for users (and admins) to add new links to the platform.

*   [] **Form Input Types:**
      *   **Requirement**: Make all inputs have the correct type (e.g. numeric inputs should be of type number, long form text should be a textarea)
      *   **DevLinks Hub Implementation:**  The `AddLinkForm` uses appropriate HTML input types:
          *   `<input type="url">` for the URL.
          *   `<input type="text">` for the title.
          *    `<textarea>` for the description.
          *   `<input type="number">` for up/down votes
*   [] **Related Resource Selection:**
    *   **Requirement:** Your form must include a `<select>` element, radio button group, or checkbox group that allows a user to choose a related resource.
    *   **DevLinks Hub Implementation:** The `AddLinkForm` will include a `<select>` element (dropdown) allowing users to choose the category/topic for the link they are adding (for both user links and, in the admin dashboard, for public links).  This relates the new link to an existing category.

*   [] **Data Deletion (User-Specific):**
    *   **Requirement:** Customers must be able to delete their own data, and be prevented from deleting other customers' data.
    *   **DevLinks Hub Implementation:**  Only authenticated users can delete links from *their* personal collections.  The API routes for deleting links will include checks to ensure the user making the request is the owner of the link being deleted (using the user's UID from Firebase Authentication).  The public links are only deletable by admin users.

*   [] **Data Editing:**
    *   **Requirement:** Customers must be able to edit their data.
    *   **DevLinks Hub Implementation:** Users can edit their own links via the `AddLinkForm` (reused for both adding and editing). API routes handle updating the link data in the database, with similar authentication checks as deletion to prevent unauthorized editing.

*   [] **Flexible Layout:**
    *   **Requirement:** You must be able to implement a flexible layout for your UI by either (a) using a 3rd party framework like Bootstrap, or (b) authoring your own CSS using Flexbox.
    *   **DevLinks Hub Implementation:** DevLinks Hub will utilize **Tailwind CSS** (a 3rd party framework) for creating a responsive and flexible layout.

*   [] **Legible and Quality Copy:**
    *   **Requirement:** All copy for your application must be legible and quality, so pay attention to colors, margins, padding, and font sizes. No Lorem ipsum, etc.
    *   **DevLinks Hub Implementation:**  DevLinks Hub will use a clean, minimalist design with a well-defined color palette, appropriate font sizes, and sufficient whitespace (margins and padding) to ensure readability.  All text will be meaningful and relevant to the application's functionality.

*  [] **README:**
    * **Requirements:** Described on the document given.
    * **DevLinks Hub Implementation:** README file created according to given document.

*  [] **3 project(artifacts):**
    * **Requirements:** Described on the document given.
    * **DevLinks Hub Implementation:** Included 3 different project from past which show growth of journey

**II. Data Design (ERD)**

*   [] **ERD Exists:**
    *   **Requirement:** You must have an ERD for your project.
    *   **DevLinks Hub Implementation:**  An ERD has been created using dbdiagram.io and is included in the proposal presentation.  The ERD accurately reflects the structure of the Firebase Realtime Database.

*   [] **User-Related Data:**
    *   **Requirement:** You must have a user-related data scheme.
    *   **DevLinks Hub Implementation:**  The `userLinks` node in the database stores data specific to each authenticated user (their personal links and categories).  The user's UID (from Firebase Authentication) is used as the key to associate data with the correct user.

*   [] **One-to-Many Relationship:**
    *   **Requirement:** In addition to having user-related data, you need to have at least one more 1 -> many relationships defined in your ERD.
    *   **DevLinks Hub Implementation:** The ERD clearly shows a one-to-many relationship between users and their links: one user can have many links.  It also shows a one-to-many relationship between users and categories. And one-to-many relationships between `publicLinks` and their links.

*   [ ] **Many-to-Many Relationship:**
    *   **Requirement:** Having a many -> many relationship is recommended, but not required for your client side project.
    * **DevLinks Hub Implementation:** While not strictly required, the use of tags *could* be considered a many-to-many relationship (many links can have many tags). However, this is implemented as an array within the link object, not as a separate join table, due to the NoSQL nature of the Realtime Database. This choice was made for simplicity and efficiency in this specific project context.

*   [] **Persistent Storage Tool**
    *    **Requirement:** You are required to use the persistent storage tool that you were taught (i.e. json-server, firebase, SQL Server, SQLite).
    *   **DevLinks Hub Implementation:** DevLinks Hub uses **Firebase Realtime Database** for persistent storage.

**III. General Details**

*   [] **Project Name in `<title>`:**
    *   **Requirement:** Make sure your project name is in the `<title>` tag of the head.
    *   **DevLinks Hub Implementation:** The project name ("DevLinks Hub") will be included in the `<title>` tag of the HTML generated by Next.js.

*   [] **Project Name in `package.json`:**
    *   **Requirement:** Make sure your project name is correct in the `name` property in your `package.json`.
    *   **DevLinks Hub Implementation:** The `name` property in `package.json` is set to "devlinks-hub" (or a similar, appropriate name).

*   [] **Correct Input Types:**
    *   **Requirement:** Make all inputs have the correct type.
    *   **DevLinks Hub Implementation:** Confirmed (as listed above).

*   [] **Professional Data:**
    *   **Requirement:** Make sure all of your data is professional and relevant.
    *   **DevLinks Hub Implementation:**  All data (link titles, descriptions, etc.) will be professional and relevant to the application's purpose.  Placeholder data will be avoided.

*   [] **No Zombie Code:**
    *   **Requirement:** No zombie code.
    *   **DevLinks Hub Implementation:** All commented-out code will be removed before final submission.

*   [] **No Console Logs:**
    *   **Requirement:** No console logs.
    *   **DevLinks Hub Implementation:** All `console.log` statements used for debugging will be removed before final submission.

*   [] **No Console Errors:**
    *   **Requirement:** The console in your Developer Tools should not have any errors.
    *   **DevLinks Hub Implementation:** The application will be thoroughly tested to ensure there are no console errors.

*   [] **Explain Warnings:**
    *   **Requirement:** Students should be able to explain any warnings in the console.
    *   **DevLinks Hub Implementation:** Any remaining console warnings (if any) will be understood and explained.

*   [] **Professional Commit Messages:**
    *   **Requirement:** Professional/meaningful commit and PR messages.
    *   **DevLinks Hub Implementation:** All commit and pull request messages will be clear, concise, and descriptive, following best practices for Git commit messages.

**IV. Design**

*   [] **Limited Color Palette:**
    *   **Requirement:** Limited color palette (3 colors).
    *   **DevLinks Hub Implementation:** A limited color palette (no more than 3 primary colors, plus neutrals) will be chosen and consistently applied throughout the application.

*   [] **Left-Aligned Text:**
    *   **Requirement:** Most text copy should be left aligned.
    *   **DevLinks Hub Implementation:** Text will be left-aligned for improved readability.

*   [] **Padding/Margins:**
    *   **Requirement:** Use of padding/margins.
    *   **DevLinks Hub Implementation:**  Appropriate padding and margins will be used to create visual hierarchy and prevent content from feeling cramped.

*   [] **Consistency:**
    *   **Requirement:** Consistency: views, cards, fonts, sizes, etc.
    *   **DevLinks Hub Implementation:** Consistent styling will be applied across all views, components, and elements.  A UI library (Tailwind CSS) will aid in maintaining consistency.

*   [] **Image Resizing:**
    *   **Requirement:** If you use images in your application, they must be resized, if needed, for display in the UI and the correct ratio must be maintained.
    *   **DevLinks Hub Implementation:** Any images used (e.g., favicons) will be appropriately sized and optimized for web display.

This document demonstrates that the DevLinks Hub project meets all the specified requirements for the front-end capstone. It also provides a clear roadmap for development and serves as a checklist to ensure all requirements are addressed.

Phase 1: Project Setup and Authentication
Set up Next.js project with Tailwind CSS
Configure Firebase (Authentication and Realtime Database)
Implement basic routing structure
Create authentication flow (Google Authentication)
Phase 2: Core Components and Public View
Design and implement the Navbar component
Create LinkCard component for displaying resources
Implement CategoryList component
Build the public homepage with default categorized links
Phase 3: User Dashboard
Create protected routes for authenticated users
Implement AddLinkForm component for CRUD operations
Build user dashboard for managing personal links
Add category management for personal collections
Phase 4: Admin Dashboard
Create admin-only protected routes
Build admin dashboard for managing public resources
Implement admin-specific features (approving community suggestions, etc.)
Phase 5: Advanced Features and Refinement
Implement search functionality
Add responsive design optimizations
Implement any stretch features (link validation, rating system, etc.)
Final testing and refinement
Technical Considerations
Proper form input types for different data fields
Authentication checks to prevent unauthorized access/modifications
Clean, professional UI with limited color palette
Proper error handling and validation

devlinks-hub/
├── publicLinks/
│   ├── [linkId]/
│   │   ├── title: string
│   │   ├── url: string
│   │   ├── description: string
│   │   ├── categoryId: string
│   │   ├── createdAt: timestamp
│   │   ├── updatedAt: timestamp
│   │   └── createdBy: userId
├── userLinks/
│   ├── [userId]/
│   │   ├── links/
│   │   │   ├── [linkId]/
│   │   │   │   ├── title: string
│   │   │   │   ├── url: string
│   │   │   │   ├── description: string
│   │   │   │   ├── categoryId: string
│   │   │   │   ├── createdAt: timestamp
│   │   │   │   └── updatedAt: timestamp
│   │   └── categories/
│   │       ├── [categoryId]/
│   │       │   ├── name: string
│   │       │   ├── createdAt: timestamp
│   │       │   └── updatedAt: timestamp
├── publicCategories/
│   ├── [categoryId]/
│   │   ├── name: string
│   │   ├── description: string
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
└── users/
    ├── [userId]/
    │   ├── displayName: string
    │   ├── email: string
    │   ├── photoURL: string
    │   ├── isAdmin: boolean
    │   ├── createdAt: timestamp
    │   └── lastLogin: timestamp

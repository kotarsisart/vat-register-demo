# VAT Register Demo

A responsive frontend demo of a VAT register management interface, built with React, TypeScript, and SCSS Modules.

The project demonstrates a modern redesign of an accounting interface for browsing sales and purchase registers, analyzing VAT amounts, and managing document views.

## Features

- **Sales and purchase registers** with sample accounting documents
- **Search and filtering** by year, month, operation type, JPK V7 code, and document series
- **VAT summaries** with net, tax, and gross totals
- **VAT breakdown** by tax rate
- **Expandable document details** in desktop and mobile layouts
- **Responsive design** optimized for desktop, tablet, and mobile screens
- **Light and dark themes** with system preference detection and persistent selection
- **CSV export** of filtered documents
- **Print-friendly view** for register reports
- **Document tags** stored in local storage
- **Configurable pagination**
- **Demo states** for populated, empty, and error scenarios

## Tech Stack

- React
- TypeScript
- Vite
- SCSS Modules
- Lucide React

## Getting Started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

The development server URL will appear in the terminal.

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

## Project Notes

- All accounting data is fictional and used exclusively for demonstration.
- The application runs entirely in the browser without a backend.
- Theme preferences, document tags, and pagination settings are stored locally.
- CSV export and printing operate on the currently filtered document set.

## Disclaimer

This project is a frontend demonstration and is not intended for production accounting or tax reporting.
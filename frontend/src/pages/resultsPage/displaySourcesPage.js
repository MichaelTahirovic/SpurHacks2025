import React from 'react';
import AISummary from "./components/AISummary";
import SourceList from "./components/SourceList";

export function DisplaySourcesPage() {
    return (
        <>
            <AISummary />
            <SourceList />
        </>
    );
}

// The old DisplaySourcesPage component is no longer needed
// as its logic has been merged into AISummary and SourceList.

// We will make DisplaySourcePageFull the default export
// if there is a routing system that expects a default export.
// For now, we will leave it as a named export.
export default DisplaySourcesPage; 